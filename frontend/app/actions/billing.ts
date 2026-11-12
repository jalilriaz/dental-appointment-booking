"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { logger } from "@/lib/logger";
import { createAppointment } from "@/lib/bookingService";
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
    paymentMethod?: "CASH" | "CARD" | "ONLINE";
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
    paymentMethod: z.enum(["CASH", "CARD", "ONLINE"]).optional().default("CASH"),
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
                await prisma.appointment.update({
                    where: { id: validData.appointmentId },
                    data: {
                        patientTreatmentId: existingPT.id,
                        sessionNumber: appointment.sessionNumber || 1,
                        sessionLabel: appointment.sessionLabel || `Session 1 of ${existingPT.totalSessions}`,
                    },
                });
            } else {
                const totalCost = validData.packageCost ??
                    ((appointment.price || appointment.treatment.price) - (validData.discount || 0));
                const totalSessions = isMultiSession
                    ? (validData.totalSessions || appointment.treatment.defaultSessions || 1)
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
                        sessionLabel: isMultiSession ? `Session 1 of ${totalSessions}` : "Single Visit",
                    },
                });
            }
        }

        // 3. Create Payment Record (only if collected > 0)
        if (validData.amountCollected > 0 && patientTreatmentId) {
            await prisma.payment.create({
                data: {
                    amount: validData.amountCollected,
                    date: new Date(),
                    method: validData.paymentMethod as any,
                    notes: validData.notes,
                    appointmentId: validData.appointmentId,
                    patientTreatmentId: patientTreatmentId,
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
                        where: { status: { notIn: ["CANCELLED", "NO_SHOW"] } },
                    },
                },
            });

            if (pt) {
                const totalPaid = pt.payments.reduce((sum, p) => sum + p.amount, 0);
                const completedCount = pt.appointments.filter(a => a.status === "COMPLETED").length;

                // Financial status
                const financialStatus = totalPaid >= pt.totalCost
                    ? "FULLY_PAID"
                    : totalPaid > 0
                        ? "PARTIALLY_PAID"
                        : "UNPAID";

                // Clinical status: Only COMPLETED if single session OR all sessions done
                const isAllSessionsDone = pt.totalSessions <= 1 || completedCount >= pt.totalSessions;
                const clinicalStatus = isAllSessionsDone ? "COMPLETED" : "IN_PROGRESS";
                const legacyStatus = totalPaid >= pt.totalCost ? "FULLY_PAID" : isAllSessionsDone ? "COMPLETED" : "ONGOING";

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
        if (validData.nextSessionDate && validData.nextSessionTime) {
            const nextSessionNumber = (appointment.sessionNumber || 1) + 1;
            const pt = patientTreatmentId ? await prisma.patientTreatment.findUnique({ where: { id: patientTreatmentId } }) : null;
            const totalSess = pt ? pt.totalSessions : (validData.totalSessions || 2);
            const nextSessionLabel = validData.nextSessionLabel || `Session ${nextSessionNumber} of ${totalSess}`;

            const nextBookingResult = await createAppointment({
                patientId: appointment.patientId,
                treatmentId: appointment.treatmentId,
                date: validData.nextSessionDate,
                time: validData.nextSessionTime,
                bookedBy: "ADMIN",
                patientTreatmentId: patientTreatmentId || undefined,
                sessionNumber: nextSessionNumber,
                sessionLabel: nextSessionLabel,
                notes: nextSessionLabel,
                plannedFee: validData.nextSessionFee || undefined,
            });

            if (nextBookingResult.success) {
                nextAppointment = nextBookingResult.appointment;
            } else {
                console.warn("[Billing] Next session booking failed:", nextBookingResult.error);
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
                        doctorName: "Dr. Sheriyaar",
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

        // 8. Revalidate paths
        revalidatePath("/admin");
        revalidatePath("/staff");
        revalidatePath("/admin/appointments");
        revalidatePath("/staff/appointments");

        return {
            success: true,
            nextAppointment,
            message: nextAppointment ? "Visit checked out and next session booked!" : "Visit checked out successfully."
        };
    } catch (error) {
        console.error("Checkout Error:", error);
        return { success: false, error: "Failed to process checkout" };
    }
}
