import prisma from "@/lib/prisma";
import { createCalendarEvent } from "@/lib/googleCalendar";
import { generatePatientCode } from "@/lib/patientCode";
import { normalizePhone } from "@/lib/phone";
import { isSundayInKarachi, parseKarachiDateTime } from "@/lib/timezone";
import { generateRandomPatientPasswordHash } from "@/lib/security";
import { revalidatePath } from "next/cache";

export interface CreateAppointmentInput {
    // Patient details
    patientId?: string;
    patientName?: string;
    phone?: string;
    age?: number | string;
    email?: string;

    // Booking details
    treatmentId: string;
    date: string; // "YYYY-MM-DD"
    time: string; // "HH:MM"
    durationMin?: number;
    bookedBy: "WEBSITE" | "WALK_IN" | "WHATSAPP_BOT" | "ADMIN" | "RECEPTIONIST";
    notes?: string;

    // Multi-session treatment plan linking
    patientTreatmentId?: string;
    sessionNumber?: number;
    sessionLabel?: string;
    plannedFee?: number;
}

export interface BookingResponse {
    success: boolean;
    message?: string;
    appointment?: any;
    patientCode?: number | null;
    isMultiSession?: boolean;
    sessionNumber?: number | null;
    sessionLabel?: string | null;
    error?: string;
    status?: number;
}

/**
 * Centralized, transactional booking engine for Elite Dental Centre.
 * Unifies appointment creation across Web, Walk-in, Admin, and WhatsApp Bot.
 */
export async function createAppointment(input: CreateAppointmentInput): Promise<BookingResponse> {
    try {
        const {
            patientId: inputPatientId,
            patientName,
            phone,
            age,
            email,
            treatmentId,
            date,
            time,
            durationMin: customDuration,
            bookedBy,
            notes,
            patientTreatmentId: explicitPtId,
            sessionNumber: explicitSessionNumber,
            sessionLabel: explicitSessionLabel,
            plannedFee,
        } = input;

        // 1. Validate required fields
        if (!date || !time) {
            return { success: false, error: "Date and time are required.", status: 400 };
        }
        if (!inputPatientId && (!patientName || !phone)) {
            return { success: false, error: "Patient name and phone number are required.", status: 400 };
        }

        // 2. Validate clinic closure on Sunday
        if (isSundayInKarachi(date)) {
            return {
                success: false,
                error: "The clinic is closed on Sundays. Please select a day from Monday to Saturday.",
                status: 400,
            };
        }

        // 3. Resolve treatment
        let treatment = null;
        if (treatmentId) {
            treatment = await prisma.treatment.findUnique({
                where: { id: treatmentId },
            });
        }
        if (!treatment) {
            treatment = await prisma.treatment.findFirst({
                where: { isActive: true },
            });
        }
        if (!treatment) {
            return { success: false, error: "No valid treatment found.", status: 400 };
        }

        const duration = customDuration || treatment.durationMin || 30;
        const startTime = parseKarachiDateTime(date, time);
        const endTime = new Date(startTime.getTime() + duration * 60000);

        // 4. Resolve Patient (Phone-based canonical lookup or existing patientId)
        let patient = null;
        let canonicalPhone: string | null = null;

        if (inputPatientId) {
            patient = await prisma.user.findUnique({
                where: { id: inputPatientId },
            });
            if (patient) {
                canonicalPhone = patient.phone ? normalizePhone(patient.phone) : null;
            }
        }

        if (!patient && phone) {
            canonicalPhone = normalizePhone(phone);
            patient = await prisma.user.findFirst({
                where: { phone: canonicalPhone },
            });

            if (!patient) {
                const initialPasswordHash = await generateRandomPatientPasswordHash();
                const code = await generatePatientCode();
                patient = await prisma.user.create({
                    data: {
                        name: patientName || "Valued Patient",
                        phone: canonicalPhone,
                        email: email || undefined,
                        role: "PATIENT",
                        password: initialPasswordHash,
                        patientCode: code,
                    },
                });
            } else if (!patient.patientCode) {
                const code = await generatePatientCode();
                patient = await prisma.user.update({
                    where: { id: patient.id },
                    data: { patientCode: code },
                });
            }
        }

        if (!patient) {
            return { success: false, error: "Unable to find or create patient record.", status: 400 };
        }

        // 5. Double Booking Conflict Check
        const conflict = await prisma.appointment.findFirst({
            where: {
                status: { notIn: ["CANCELLED", "NO_SHOW"] },
                AND: [
                    { startTime: { lt: endTime } },
                    { endTime: { gt: startTime } },
                ],
            },
        });

        if (conflict) {
            return {
                success: false,
                error: "This time slot is already booked. Please choose another time.",
                status: 409,
            };
        }

        // 6. Multi-Session Treatment Plan Linking & Session Number Computation
        let targetPtId = explicitPtId || null;
        let assignedSessionNumber: number | null = explicitSessionNumber || null;
        let assignedSessionLabel: string | null = explicitSessionLabel || null;

        // If no explicit plan was passed, check if the patient has an active IN_PROGRESS plan for this treatment
        if (!targetPtId) {
            const activePlan = await prisma.patientTreatment.findFirst({
                where: {
                    patientId: patient.id,
                    treatmentId: treatment.id,
                    clinicalStatus: "IN_PROGRESS",
                },
                orderBy: { startDate: "desc" },
            });
            if (activePlan) {
                targetPtId = activePlan.id;
            }
        }

        let appointmentPrice = treatment.price;

        if (targetPtId) {
            const plan = await prisma.patientTreatment.findUnique({
                where: { id: targetPtId },
                include: {
                    appointments: {
                        where: { status: { notIn: ["CANCELLED", "NO_SHOW"] } },
                    },
                },
            });

            if (plan) {
                const activeSessionsCount = plan.appointments.length;
                if (!assignedSessionNumber) {
                    assignedSessionNumber = activeSessionsCount + 1;
                }
                if (!assignedSessionLabel) {
                    assignedSessionLabel = `Session ${assignedSessionNumber} of ${plan.totalSessions}`;
                }
                // For a session linked to an existing multi-session package, individual appointment price is 0
                // (the revenue is tracked via the package totalCost and installment payments)
                appointmentPrice = 0;
            }
        }

        // 7. Create Appointment Record
        const appointment = await prisma.appointment.create({
            data: {
                startTime,
                endTime,
                patientId: patient.id,
                treatmentId: treatment.id,
                bookedBy: bookedBy as any,
                status: "SCHEDULED",
                price: appointmentPrice,
                guestName: patientName || patient.name,
                guestPhone: canonicalPhone || patient.phone,
                patientTreatmentId: targetPtId,
                sessionNumber: assignedSessionNumber,
                sessionLabel: assignedSessionLabel,
                plannedFee: plannedFee || null,
                notes: notes || (assignedSessionLabel ? `${assignedSessionLabel} — ${treatment.name}` : undefined),
            },
            include: {
                treatment: true,
                patient: true,
                patientTreatment: true,
            },
        });

        // 8. Background side effects (Google Calendar sync, etc.)
        (async () => {
            try {
                const summary = `${treatment!.name} — ${patient.name || patientName}${assignedSessionLabel ? ` (${assignedSessionLabel})` : ""}`;
                const description = `Patient: ${patient.name || patientName}\nTreatment: ${treatment!.name}\nDuration: ${duration} min${assignedSessionLabel ? `\nSession: ${assignedSessionLabel}` : ""}${age ? `\nAge: ${age}` : ""}`;

                const googleEventId = await createCalendarEvent({
                    summary,
                    description,
                    startTime,
                    endTime,
                    patientName: patient.name || patientName || "Patient",
                    patientPhone: canonicalPhone || patient.phone || undefined,
                });

                if (googleEventId) {
                    await prisma.appointment.update({
                        where: { id: appointment.id },
                        data: { googleEventId },
                    });
                }
            } catch (err) {
                console.error("[BookingService] Google Calendar sync non-fatal error:", err);
            }
        })();

        // 9. Revalidate Dashboard Views
        revalidatePath("/admin");
        revalidatePath("/staff");
        revalidatePath("/admin/appointments");
        revalidatePath("/staff/appointments");

        return {
            success: true,
            message: "Appointment booked successfully.",
            appointment,
            patientCode: patient.patientCode,
            isMultiSession: Boolean(targetPtId),
            sessionNumber: assignedSessionNumber,
            sessionLabel: assignedSessionLabel,
        };
    } catch (error: any) {
        console.error("[BookingService] createAppointment error:", error);
        return {
            success: false,
            error: error.message || "Failed to book appointment.",
            status: 500,
        };
    }
}
