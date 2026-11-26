"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { z } from "zod";
import { requireActionRole } from "@/lib/auth/permissions";
import { logFrontendAudit } from "@/lib/audit";
import { paymentMethodEnum } from "@/lib/validations/billing";
import { assertDayNotClosed } from "@/lib/services/closingLock";
import { calculatePlanFinancialState } from "@/lib/services/moneyMath";
import type { PaymentMethodValue } from "@/lib/constants/payment-methods";
import {
    getPrecautionsForTreatment,
    formatPrecautionsMessage,
    dispatchN8nPrecautionsWebhook
} from "@/lib/precautions";

export interface CheckoutOptions {
    appointmentId: string;
    amountCollected: number;
    notes?: string;
    billedPrice?: number;
    discount?: number;
    paymentMethod?: PaymentMethodValue;
    discountPercent?: number;
    packageCost?: number;
    totalSessions?: number;
    nextSessionDate?: string;
    nextSessionTime?: string;
    nextSessionLabel?: string;
    nextSessionFee?: number;
}

const checkoutSchema = z.object({
    appointmentId: z.string().min(1, "Appointment ID is required"),
    amountCollected: z.number().min(0, "Amount cannot be negative"),
    notes: z.string().optional(),
    billedPrice: z.number().min(0, "Billed price cannot be negative").optional(),
    discount: z.number().min(0, "Discount cannot be negative").optional(),
    discountPercent: z.number().min(0).max(100).optional(),
    paymentMethod: paymentMethodEnum.optional().default("CASH"),
    packageCost: z.number().min(0).optional(),
    totalSessions: z.number().int().min(1).optional(),
    nextSessionDate: z.string().optional(),
    nextSessionTime: z.string().optional(),
    nextSessionLabel: z.string().optional(),
    nextSessionFee: z.number().min(0).optional(),
});

export async function checkoutAppointment(
    appointmentIdOrOptions: string | CheckoutOptions,
    amountCollectedArg?: number,
    notesArg?: string,
    billedPriceArg?: number,
    discountArg?: number,
    extraOptions?: Partial<CheckoutOptions>
) {
    try {
        const auth = await requireActionRole(["ADMIN", "STAFF"]);
        if (!auth.ok) {
            return { success: false, error: auth.error };
        }

        // Normalize input whether passed as object or positional arguments
        let rawInput: CheckoutOptions;
        if (typeof appointmentIdOrOptions === "object") {
            rawInput = appointmentIdOrOptions;
        } else {
            rawInput = {
                appointmentId: appointmentIdOrOptions,
                amountCollected: amountCollectedArg ?? 0,
                notes: notesArg,
                billedPrice: billedPriceArg,
                discount: discountArg,
                discountPercent: extraOptions?.discountPercent,
                paymentMethod: extraOptions?.paymentMethod || "CASH",
                packageCost: extraOptions?.packageCost,
                totalSessions: extraOptions?.totalSessions,
                nextSessionDate: extraOptions?.nextSessionDate,
                nextSessionTime: extraOptions?.nextSessionTime,
                nextSessionLabel: extraOptions?.nextSessionLabel,
                nextSessionFee: extraOptions?.nextSessionFee,
            };
        }

        // Strict validation using Zod
        const validationResult = checkoutSchema.safeParse(rawInput);
        if (!validationResult.success) {
            return {
                success: false,
                error: "Invalid input data",
                details: validationResult.error.flatten().fieldErrors
            };
        }

        const validData = validationResult.data;

        // 1. Fetch appointment
        const appointment = await prisma.appointment.findUnique({
            where: { id: validData.appointmentId },
            include: { treatment: true, patientTreatment: true, patient: true },
        });

        if (!appointment) {
            return { success: false, error: "Appointment not found" };
        }

        // Prevent checkout of future-dated appointments
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);
        if (appointment.startTime > todayEnd) {
            return {
                success: false,
                error: "Cannot check out a future appointment. Please book a new appointment for today instead."
            };
        }

        // 1b. Update Appointment Price if provided
        if (validData.billedPrice !== undefined && validData.billedPrice !== null) {
            await prisma.appointment.update({
                where: { id: validData.appointmentId },
                data: {
                    price: validData.billedPrice,
                    discount: validData.discount ?? 0,
                }
            });
            appointment.price = validData.billedPrice;
        } else if (validData.discount !== undefined) {
            await prisma.appointment.update({
                where: { id: validData.appointmentId },
                data: { discount: validData.discount }
            });
        }

        // 2. Resolve or Create Multi-Session Treatment Plan (PatientTreatment)
        let patientTreatmentId = appointment.patientTreatmentId;
        const isMultiSession = appointment.treatment.isMultiSession || (validData.totalSessions && validData.totalSessions > 1);

        if (!patientTreatmentId) {
            // Check for existing ongoing treatment plan
            const existingPT = await prisma.patientTreatment.findFirst({
                where: {
                    patientId: appointment.patientId,
                    treatmentId: appointment.treatmentId,
                    clinicalStatus: "IN_PROGRESS",
                },
            });

            if (existingPT) {
                patientTreatmentId = existingPT.id;
                // Dynamically resolve session number: count existing appointments in this plan
                const existingApptsCount = await prisma.appointment.count({
                    where: {
                        patientTreatmentId: existingPT.id,
                        status: { notIn: ["CANCELLED"] }
                    }
                });
                const sessionNum = appointment.sessionNumber || Math.max(1, existingApptsCount);
                await prisma.appointment.update({
                    where: { id: validData.appointmentId },
                    data: {
                        patientTreatmentId: existingPT.id,
                        sessionNumber: sessionNum,
                        sessionLabel: appointment.sessionLabel || `Session #${sessionNum}`,
                    },
                });
            } else {
                const totalCost = validData.packageCost ??
                    ((appointment.price || appointment.treatment.price) - (validData.discount || 0));
                const totalSessions = isMultiSession
                    ? (validData.totalSessions || appointment.treatment.defaultSessions || 10)
                    : 1;

                const newPT = await prisma.patientTreatment.create({
                    data: {
                        patientId: appointment.patientId,
                        treatmentId: appointment.treatmentId,
                        totalCost,
                        totalSessions,
                        clinicalStatus: isMultiSession ? "IN_PROGRESS" : "COMPLETED",
                        financialStatus: "UNPAID",
                        status: isMultiSession ? "ONGOING" : "COMPLETED",
                        startDate: new Date(),
                    },
                });
                patientTreatmentId = newPT.id;

                await prisma.appointment.update({
                    where: { id: validData.appointmentId },
                    data: {
                        patientTreatmentId: newPT.id,
                        sessionNumber: 1,
                        sessionLabel: isMultiSession ? "Session #1 (Initial Setup & Downpayment)" : "Single Visit",
                    },
                });
            }
        }

        // 3. Create Payment Record (only if collected > 0; check daily closing lock)
        if (validData.amountCollected > 0 && patientTreatmentId) {
            await assertDayNotClosed(new Date());
            await prisma.payment.create({
                data: {
                    amount: validData.amountCollected,
                    date: new Date(),
                    method: validData.paymentMethod,
                    notes: validData.notes,
                    appointmentId: validData.appointmentId,
                    patientTreatmentId: patientTreatmentId,
                    recordedById: auth.user.id,
                },
            });
        }

        // 4. Update Appointment Status to COMPLETED
        await prisma.appointment.update({
            where: { id: validData.appointmentId },
            data: {
                status: "COMPLETED",
                amountPaid: (appointment.amountPaid || 0) + validData.amountCollected,
                checkoutTime: new Date(),
            },
        });

        // 5. Update Treatment Plan Financial & Clinical Status
        if (patientTreatmentId) {
            const pt = await prisma.patientTreatment.findUnique({
                where: { id: patientTreatmentId },
                include: {
                    payments: true,
                    appointments: {
                        where: { status: { notIn: ["CANCELLED", "Not_Visited"] } },
                    },
                },
            });

            if (pt) {
                const fin = calculatePlanFinancialState(
                    pt.totalCost,
                    pt.payments.map((p) => ({ amount: p.amount, type: p.type as "PAYMENT" | "REFUND" }))
                );
                const totalPaid = fin.netPaid;
                const completedCount = pt.appointments.filter(a => a.status === "COMPLETED").length;

                const financialStatus = fin.financialStatus;

                // Clinical status: For multi-session treatments (e.g. Braces, Implants, RCT), 
                // clinical status stays IN_PROGRESS until explicitly completed by doctor/staff
                const isSingleVisit = !appointment.treatment.isMultiSession && (!validData.totalSessions || validData.totalSessions <= 1);
                const clinicalStatus = isSingleVisit ? "COMPLETED" : "IN_PROGRESS";
                const legacyStatus = totalPaid >= pt.totalCost ? "FULLY_PAID" : isSingleVisit ? "COMPLETED" : "ONGOING";

                await prisma.patientTreatment.update({
                    where: { id: pt.id },
                    data: {
                        financialStatus: financialStatus as any,
                        clinicalStatus: clinicalStatus as any,
                        status: legacyStatus as any,
                    },
                });
            }
        }

        // 6. Schedule Next Session if date & time provided
        let nextAppointment = null;
        let nextSessionError: string | null = null;
        if (validData.nextSessionDate && validData.nextSessionTime) {
            const nextSessionNumber = (appointment.sessionNumber ?? 1) + 1;
            const nextSessionLabel = validData.nextSessionLabel || `Session #${nextSessionNumber} (Follow-Up / Adjustment)`;

            try {
                const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || 'http://localhost:4000';
                const sessionToken = (await cookies()).get("session")?.value;
                const nextRes = await fetch(`${API_BASE_URL}/api/admin/walk-in`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        ...(sessionToken ? { Cookie: `session=${sessionToken}` } : {}),
                    },
                    body: JSON.stringify({
                        patientId: appointment.patientId,
                        treatmentId: appointment.treatmentId,
                        date: validData.nextSessionDate,
                        time: validData.nextSessionTime,
                        patientTreatmentId: patientTreatmentId || undefined,
                        notes: nextSessionLabel,
                    }),
                });
                const nextData = await nextRes.json();
                if (nextRes.ok && nextData.appointment) {
                    nextAppointment = nextData.appointment;
                } else {
                    nextSessionError = nextData.error || 'Failed to allocate slot';
                    console.warn('[Billing] Next session booking failed:', nextSessionError);
                }
            } catch (err: any) {
                nextSessionError = err.message || 'Could not connect to booking server';
                console.warn('[Billing] Next session network error:', nextSessionError);
            }
        }

        // 7. Dispatch Care Precautions Webhook
        const patientPhone = appointment.guestPhone || appointment.patient?.phone;
        const patientName = appointment.guestName || appointment.patient?.name || "Valued Patient";
        if (patientPhone) {
            (async () => {
                try {
                    const precautions = getPrecautionsForTreatment(
                        appointment.treatment.name,
                        appointment.treatment.instructions
                    );
                    const message = formatPrecautionsMessage({
                        patientName,
                        treatmentName: appointment.treatment.name,
                        precautions,
                        doctorName: "Attending Dentist",
                    });
                    await dispatchN8nPrecautionsWebhook({
                        phone: patientPhone,
                        patientName,
                        treatmentName: appointment.treatment.name,
                        precautions,
                        message,
                        appointmentId: appointment.id,
                    });
                } catch (dispatchErr) {
                    console.error("Auto precaution dispatch failed:", dispatchErr);
                }
            })();
        }

        // 8. Audit checkout & payment collection
        await logFrontendAudit({
            userId: auth.user.id,
            action: "CHECKOUT_PAYMENT",
            entity: "Appointment",
            entityId: appointment.id,
            details: {
                amountCollected: validData.amountCollected,
                billedPrice: validData.billedPrice ?? appointment.price,
                discount: validData.discount ?? appointment.discount,
                paymentMethod: validData.paymentMethod,
                patientTreatmentId,
            },
        });

        // 9. Revalidate paths
        revalidatePath("/admin");
        revalidatePath("/staff");
        revalidatePath("/admin/appointments");
        revalidatePath("/staff/appointments");

        // Fetch latest treatment plan with complete payments ledger
        let updatedPlan = null;
        if (patientTreatmentId) {
            updatedPlan = await prisma.patientTreatment.findUnique({
                where: { id: patientTreatmentId },
                include: {
                    treatment: true,
                    patient: {
                        select: {
                            id: true,
                            name: true,
                            phone: true,
                            patientCode: true,
                            gender: true,
                            dateOfBirth: true,
                        },
                    },
                    payments: { orderBy: { date: "asc" } },
                },
            });
        }

        return {
            success: true,
            nextAppointment,
            patientTreatment: updatedPlan,
            message: nextAppointment
                ? "Visit checked out and next session booked!"
                : nextSessionError
                    ? `Visit checked out, but next session could not be scheduled: ${nextSessionError}`
                    : "Visit checked out successfully."
        };
    } catch (error) {
        console.error("Checkout Error:", error);
        return { success: false, error: "Failed to process checkout" };
    }
}
