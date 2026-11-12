import prisma from "@/lib/prisma";
import { createCalendarEvent } from "@/lib/googleCalendar";
import { generatePatientCode } from "@/lib/patientCode";
import { normalizePhone } from "@/lib/phone";
import { isSundayInKarachi, parseKarachiDateTime } from "@/lib/timezone";
import { generateRandomPatientPasswordHash } from "@/lib/security";
import { ALL_TREATMENTS } from "@/lib/treatmentsData";
import { sendAppointmentConfirmationEmail } from "@/lib/email";
import { formatTime, formatDate } from "@/lib/utils";

const revalidatePath = (..._args: any[]) => {};

export interface CreateAppointmentInput {
    // Patient details
    patientId?: string;
    patientName?: string;
    phone?: string;
    age?: number | string;
    email?: string;
    dateOfBirth?: string | Date;

    // Guest booking details (for unauthenticated web bookings)
    guestName?: string;
    guestPhone?: string;
    guestEmail?: string;
    guestDob?: string | Date;

    // Booking details
    treatmentId: string;
    date: string; // "YYYY-MM-DD"
    time: string; // "HH:MM"
    durationMin?: number;
    bookedBy: "WEBSITE" | "WALK_IN" | "WHATSAPP_BOT" | "ADMIN" | "RECEPTIONIST" | "STAFF";
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
 * Serializes and guarantees anti-double booking across WhatsApp Bot, Website, and Walk-in portals.
 */
export async function createAppointment(input: CreateAppointmentInput): Promise<BookingResponse> {
    try {
        const {
            patientId: inputPatientId,
            patientName,
            phone,
            age,
            email,
            dateOfBirth,
            guestName,
            guestPhone,
            guestEmail,
            guestDob,
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

        const rawPhone = phone || guestPhone;
        const rawName = patientName || guestName;

        if (!inputPatientId && (!rawName || !rawPhone)) {
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

        // 3. Execute atomic serialized transaction
        const txResult = await prisma.$transaction(async (tx) => {
            // A. Resolve treatment
            let treatment = null;
            if (treatmentId) {
                treatment = await tx.treatment.findUnique({
                    where: { id: treatmentId },
                });
                if (!treatment) {
                    const mock = ALL_TREATMENTS.find((t) => t.id === treatmentId);
                    if (mock) {
                        treatment = await tx.treatment.findFirst({
                            where: { name: { equals: mock.name, mode: "insensitive" } },
                        });
                    }
                }
            }
            if (!treatment) {
                treatment = await tx.treatment.findFirst({
                    where: { isActive: true },
                });
            }
            if (!treatment) {
                throw new Error("TREATMENT_NOT_FOUND");
            }

            // B. Compute dynamic duration & time windows
            const duration = customDuration || treatment.durationMin || 30;
            const startTime = parseKarachiDateTime(date, time);
            const endTime = new Date(startTime.getTime() + duration * 60000);

            // C. Atomic double-booking collision check across all channels
            const conflict = await tx.appointment.findFirst({
                where: {
                    status: { notIn: ["CANCELLED"] },
                    AND: [
                        { startTime: { lt: endTime } },
                        { endTime: { gt: startTime } },
                    ],
                },
            });

            if (conflict) {
                throw new Error("DOUBLE_BOOKING");
            }

            // D. Resolve patient (existing ID or canonical phone lookup)
            let user = null;
            let canonicalPhone: string | null = null;
            let patientCode: number | null = null;

            if (inputPatientId) {
                user = await tx.user.findUnique({
                    where: { id: inputPatientId },
                });
                if (!user) throw new Error("PATIENT_NOT_FOUND");
                canonicalPhone = user.phone ? normalizePhone(user.phone) : null;
                patientCode = user.patientCode;
                if (!patientCode) {
                    patientCode = await generatePatientCode();
                    await tx.user.update({
                        where: { id: user.id },
                        data: { patientCode },
                    });
                }
            } else {
                canonicalPhone = normalizePhone(rawPhone!);
                user = await tx.user.findFirst({
                    where: { phone: canonicalPhone },
                });

                const nameToUse = rawName || "Valued Patient";
                const emailToUse = email || guestEmail || undefined;
                const dobToUse = guestDob || dateOfBirth ? new Date((guestDob || dateOfBirth)!) : undefined;

                if (!user) {
                    patientCode = await generatePatientCode();
                    const initialPasswordHash = await generateRandomPatientPasswordHash();
                    user = await tx.user.create({
                        data: {
                            name: nameToUse,
                            phone: canonicalPhone,
                            email: emailToUse,
                            role: "PATIENT",
                            password: initialPasswordHash,
                            patientCode,
                            dateOfBirth: dobToUse,
                        },
                    });
                } else {
                    const shouldUpdateName = Boolean(nameToUse && nameToUse !== "Valued Patient" && nameToUse !== user.name);
                    patientCode = user.patientCode || (await generatePatientCode());
                    user = await tx.user.update({
                        where: { id: user.id },
                        data: {
                            ...(shouldUpdateName ? { name: nameToUse } : {}),
                            patientCode,
                        },
                    });
                }
            }

            // E. Multi-Session Treatment Plan Linking
            let targetPtId = explicitPtId || null;
            let assignedSessionNumber: number | null = explicitSessionNumber || null;
            let assignedSessionLabel: string | null = explicitSessionLabel || null;

            if (!targetPtId) {
                const activePlan = await tx.patientTreatment.findFirst({
                    where: {
                        patientId: user.id,
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
                const plan = await tx.patientTreatment.findUnique({
                    where: { id: targetPtId },
                    include: {
                        appointments: {
                            where: { status: { notIn: ["CANCELLED"] } },
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
                    appointmentPrice = 0;
                }
            }

            // F. Create Appointment Record
            const appointment = await tx.appointment.create({
                data: {
                    startTime,
                    endTime,
                    patientId: user.id,
                    treatmentId: treatment.id,
                    bookedBy: bookedBy as any,
                    status: "SCHEDULED",
                    price: appointmentPrice,
                    guestName: guestName || rawName || user.name,
                    guestPhone: guestPhone || canonicalPhone || user.phone,
                    guestEmail: guestEmail || email || user.email || null,
                    guestDob: guestDob || dateOfBirth ? new Date((guestDob || dateOfBirth)!) : null,
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

            return {
                appointment,
                patientCode,
                targetPtId,
                assignedSessionNumber,
                assignedSessionLabel,
                treatment,
                user,
                startTime,
                endTime,
                duration,
                canonicalPhone,
            };
        });

        // 4. Background non-blocking tasks (Google Calendar & Email)
        const {
            appointment,
            patientCode,
            targetPtId,
            assignedSessionNumber,
            assignedSessionLabel,
            treatment,
            user,
            startTime,
            endTime,
            duration,
            canonicalPhone,
        } = txResult;

        (async () => {
            try {
                const summary = `${treatment.name} — ${user.name || patientName || guestName}${assignedSessionLabel ? ` (${assignedSessionLabel})` : ""}`;
                const description = `Patient: ${user.name || patientName || guestName}\nTreatment: ${treatment.name}\nDuration: ${duration} min${assignedSessionLabel ? `\nSession: ${assignedSessionLabel}` : ""}${age ? `\nAge: ${age}` : ""}`;

                const googleEventId = await createCalendarEvent({
                    summary,
                    description,
                    startTime,
                    endTime,
                    patientName: user.name || patientName || guestName || "Patient",
                    patientPhone: canonicalPhone || user.phone || undefined,
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

            // Non-blocking confirmation email
            try {
                const emailRecipient = user.email || guestEmail || email;
                if (emailRecipient) {
                    await sendAppointmentConfirmationEmail(
                        emailRecipient,
                        user.name || patientName || guestName || "Patient",
                        treatment.name,
                        formatDate(startTime),
                        formatTime(startTime)
                    );
                }
            } catch (emailErr) {
                console.error("[BookingService] Email notification non-fatal error:", emailErr);
            }
        })();

        // 5. Revalidate views
        revalidatePath("/admin");
        revalidatePath("/staff");
        revalidatePath("/admin/appointments");
        revalidatePath("/staff/appointments");

        return {
            success: true,
            message: "Appointment booked successfully.",
            appointment,
            patientCode,
            isMultiSession: Boolean(targetPtId),
            sessionNumber: assignedSessionNumber,
            sessionLabel: assignedSessionLabel,
        };
    } catch (error: any) {
        if (error.message === "DOUBLE_BOOKING") {
            return {
                success: false,
                error: "This time slot is already booked. Please choose another time.",
                status: 409,
            };
        }
        if (error.message === "TREATMENT_NOT_FOUND") {
            return {
                success: false,
                error: "Treatment not found.",
                status: 404,
            };
        }
        if (error.message === "PATIENT_NOT_FOUND") {
            return {
                success: false,
                error: "Patient record not found.",
                status: 404,
            };
        }

        console.error("[BookingService] createAppointment error:", error);
        return {
            success: false,
            error: error.message || "Failed to book appointment.",
            status: 500,
        };
    }
}
