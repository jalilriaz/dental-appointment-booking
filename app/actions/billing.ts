"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { logger } from "@/lib/logger";

import {
    getPrecautionsForTreatment,
    formatPrecautionsMessage,
    dispatchN8nPrecautionsWebhook
} from "@/lib/precautions";

const checkoutSchema = z.object({
    appointmentId: z.string().min(1, "Appointment ID is required"),
    amountCollected: z.number().min(0, "Amount cannot be negative"),
    notes: z.string().optional(),
    billedPrice: z.number().min(0, "Billed price cannot be negative").optional(),
    discount: z.number().min(0, "Discount cannot be negative").optional(),
});

export async function checkoutAppointment(appointmentId: string, amountCollected: number, notes?: string, billedPrice?: number, discount?: number) {
    try {
        // 🛡️ Strict validation using Zod
        const validationResult = checkoutSchema.safeParse({
            appointmentId,
            amountCollected,
            notes,
            billedPrice,
            discount,
        });

        if (!validationResult.success) {
            return {
                success: false,
                error: "Invalid input data",
                details: validationResult.error.flatten().fieldErrors
            };
        }

        const validData = validationResult.data;

        // 1. Fetch the appointment to get treatment details
        const appointment = await prisma.appointment.findUnique({
            where: { id: validData.appointmentId },
            include: { treatment: true, patientTreatment: true, patient: true },
        });

        if (!appointment) {
            return { success: false, error: "Appointment not found" };
        }

        // 🛡️ Prevent checkout of future-dated appointments
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);
        if (appointment.startTime > todayEnd) {
            return {
                success: false,
                error: "Cannot check out a future appointment. Please book a new appointment for today instead."
            };
        }

        // 1b. Update Appointment Price if provided (The "Billed Price" for this visit)
        if (validData.billedPrice !== undefined && validData.billedPrice !== null) {
            await prisma.appointment.update({
                where: { id: validData.appointmentId },
                data: {
                    price: validData.billedPrice,
                    discount: validData.discount ?? 0,
                }
            });
            // Update local object for subsequent logic
            appointment.price = validData.billedPrice;
        } else if (validData.discount !== undefined) {
            await prisma.appointment.update({
                where: { id: validData.appointmentId },
                data: { discount: validData.discount }
            });
        }

        // 2. Determine PatientTreatment
        // If not already linked, we might need to create one or find an existing ONGOING one for this patient + treatment
        let patientTreatmentId = appointment.patientTreatmentId;

        if (!patientTreatmentId) {
            // Check if there's an existing ONGOING treatment for this patient & treatment type
            const existingPT = await prisma.patientTreatment.findFirst({
                where: {
                    patientId: appointment.patientId,
                    treatmentId: appointment.treatmentId,
                    status: "ONGOING",
                },
            });

            if (existingPT) {
                patientTreatmentId = existingPT.id;
                // Link appointment to this PT
                await prisma.appointment.update({
                    where: { id: validData.appointmentId },
                    data: { patientTreatmentId: existingPT.id },
                });
            } else {
                // Create a NEW PatientTreatment
                // Default total cost to the treatment's standard price, unless overridden (logic can be enhanced)
                // If this is the FIRST appointment (creating the plan), and we set a price, use that.
                // Otherwise fallback to treatment default.
                const newPT = await prisma.patientTreatment.create({
                    data: {
                        patientId: appointment.patientId,
                        treatmentId: appointment.treatmentId,
                        // totalCost includes the discount subtraction to give the accurate net total for the plan
                        totalCost: (appointment.price || appointment.treatment.price) - (validData.discount || 0),
                        status: "ONGOING",
                        startDate: new Date(),
                    },
                });
                patientTreatmentId = newPT.id;

                // Link appointment
                await prisma.appointment.update({
                    where: { id: validData.appointmentId },
                    data: { patientTreatmentId: newPT.id },
                });
            }
        }

        // 3. Create Payment Record (only if amount > 0)
        if (validData.amountCollected > 0) {
            await prisma.payment.create({
                data: {
                    amount: validData.amountCollected,
                    date: new Date(),
                    method: "CASH", // Default, can be passed as arg later
                    notes: validData.notes,
                    appointmentId: validData.appointmentId,
                    patientTreatmentId: patientTreatmentId!,
                },
            });
        }

        // 4. Update Appointment Status, Amount Paid, & Checkout Time
        await prisma.appointment.update({
            where: { id: validData.appointmentId },
            data: {
                status: "COMPLETED",
                amountPaid: (appointment.amountPaid || 0) + validData.amountCollected,
                checkoutTime: new Date(),
            },
        });

        // 5. Check if Validation of "Fully Paid" is needed
        // Calculate total paid vs total cost
        const pt = await prisma.patientTreatment.findUnique({
            where: { id: patientTreatmentId! }, // Now guaranteed to exist.
            include: { payments: true },
        });

        if (pt) {
            const totalPaid = pt.payments.reduce((sum, p) => sum + p.amount, 0);
            // Allow status update even if currently "COMPLETED", as long as it's not already "FULLY_PAID"
            if (totalPaid >= pt.totalCost && pt.status !== "FULLY_PAID") {
                await prisma.patientTreatment.update({
                    where: { id: pt.id },
                    data: { status: "FULLY_PAID" },
                });
                console.log(`[Billing] Updated Treatment ${pt.id} to FULLY_PAID`);
            }
        }

        // 6. Automatically dispatch WhatsApp Care Precautions to the patient in background
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

        return { success: true };
    } catch (error) {
        console.error("Checkout Error:", error);
        return { success: false, error: "Failed to process checkout" };
    }
}
