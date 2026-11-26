import prisma from "@/lib/prisma";
import { createCalendarEvent } from "@/lib/googleCalendar";
import { generatePatientCode } from "@/lib/patientCode";
import { normalizePhone } from "@/lib/phone";
import { isSundayInKarachi, parseKarachiDateTime } from "@/lib/timezone";
import { generateRandomPatientPasswordHash } from "@/lib/security";
import { ALL_TREATMENTS } from "@/lib/treatmentsData";
import { sendAppointmentConfirmationEmail } from "@/lib/email";
import { dispatchN8nBookingWebhook } from "@/lib/n8n";
import { checkDoctorAvailability } from "@/lib/doctorAvailability";
import {
    exceedsMaxBookingHorizon,
    isOverlappingBreak,
    violatesAdvanceNotice,
} from "@/lib/bookingRules";
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
    doctorId?: string;
    isEmergency?: boolean;

    // Multi-session treatment plan linking
    patientTreatmentId?: string;
    skipActivePlan?: boolean;
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
    whatsappConfirmation?: {
        sent: boolean;
        error?: string;
    };
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
            doctorId,
            isEmergency,
            patientTreatmentId: explicitPtId,
            skipActivePlan,
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

        // 2. Validate clinic closure on Sunday & doctor availability
        if (isSundayInKarachi(date)) {
            return {
                success: false,
                error: "The clinic is closed on Sundays. Please select a day from Monday to Saturday.",
                status: 400,
            };
        }

        const docCheck = await checkDoctorAvailability(date, doctorId);
        if (!docCheck.available) {
            return {
                success: false,
                error: docCheck.reason || "Doctor is currently unavailable.",
                status: 400,
            };
        }

        const rules = await prisma.systemSettings.findUnique({ where: { id: "settings" } }).catch(() => null);
        const isPublicChannel = bookedBy === "WEBSITE" || bookedBy === "WHATSAPP_BOT";
        if (exceedsMaxBookingHorizon(date, rules?.maxBookingDaysAhead ?? 60)) {
            return {
                success: false,
                error: `Bookings can only be scheduled up to ${rules?.maxBookingDaysAhead ?? 60} days in advance.`,
                status: 400,
            };
        }

        // 3. Execute atomic serialized transaction
        const txResult = await prisma.$transaction(async (tx) => {
            // Serialize concurrent slot booking requests with a PostgreSQL Transaction Advisory Lock
            // Guarantees zero double-booking even if Website, Chatbot, and Walk-in hit the exact same millisecond.
            const lockKey = `slot_${date}_${time}`;
            await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${lockKey}));`;

            // A. Resolve treatment (enforce showOnWeb for website/WhatsApp channels; deletedAt: null everywhere)
            const isPublicChannel = bookedBy === "WEBSITE" || bookedBy === "WHATSAPP_BOT";
            const visFilter = isPublicChannel
                ? { isActive: true, showOnWeb: true, deletedAt: null }
                : { isActive: true, deletedAt: null };
            let treatment = null;
            if (treatmentId) {
                treatment = await tx.treatment.findFirst({
                    where: { id: treatmentId, ...visFilter },
                });
                if (!treatment) {
                    const mock = ALL_TREATMENTS.find((t) => t.id === treatmentId);
                    if (mock) {
                        treatment = await tx.treatment.findFirst({
                            where: { name: { equals: mock.name, mode: "insensitive" }, ...visFilter },
                        });
                    }
                }
            } else {
                treatment = await tx.treatment.findFirst({
                    where: { name: { contains: "Consultation", mode: "insensitive" }, ...visFilter },
                });
                if (!treatment) {
                    treatment = await tx.treatment.findFirst({ where: visFilter });
                }
            }
            if (!treatment) {
                throw new Error("TREATMENT_NOT_FOUND");
            }

            // B. Compute dynamic duration & time windows
            const duration = customDuration || treatment.durationMin || 30;
            const startTime = parseKarachiDateTime(date, time);
            const endTime = new Date(startTime.getTime() + duration * 60000);

            if (!isEmergency) {
                const [hh, mm] = time.split(":").map(Number);
                const sMin = hh * 60 + mm;
                if (isOverlappingBreak(sMin, sMin + duration, rules?.breakStart, rules?.breakEnd)) {
                    throw new Error("BREAK_WINDOW");
                }
                if (isPublicChannel && violatesAdvanceNotice(startTime, new Date(), rules?.advanceNoticeMin ?? 60)) {
                    throw new Error("ADVANCE_NOTICE");
                }
            }

            // C. Atomic double-booking + buffer collision check across all channels
            const bufferPadMs = !isEmergency ? (rules?.bufferMin ?? 0) * 60_000 : 0;
            const conflict = await tx.appointment.findFirst({
                where: {
                    status: { notIn: ["CANCELLED"] },
                    AND: [
                        { startTime: { lt: new Date(endTime.getTime() + bufferPadMs) } },
                        { endTime: { gt: new Date(startTime.getTime() - bufferPadMs) } },
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
                if (!user || user.deletedAt) throw new Error("PATIENT_NOT_FOUND");
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
                if (user && user.deletedAt) {
                    throw new Error("PATIENT_ARCHIVED");
                }

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

            if (!targetPtId && !skipActivePlan) {
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

            // Resolve attending doctor: use explicitly selected doctor or default to active lead doctor
            let targetDoctorId = doctorId || null;
            if (!targetDoctorId) {
                const defaultDoc = await tx.doctor.findFirst({
                    where: { isActive: true },
                    orderBy: [{ isLead: "desc" }, { createdAt: "asc" }],
                });
                targetDoctorId = defaultDoc?.id || null;
            }

            // F. Create Appointment Record
            const appointment = await tx.appointment.create({
                data: {
                    startTime,
                    endTime,
                    patientId: user.id,
                    treatmentId: treatment.id,
                    doctorId: targetDoctorId,
                    bookedBy: bookedBy as any,
                    isEmergency: Boolean(isEmergency),
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
                    doctor: true,
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

            // Non-blocking confirmation email + NotificationLog
            try {
                const emailRecipient = user.email || guestEmail || email;
                const previewText = `${treatment.name} visit on ${formatDate(startTime)} at ${formatTime(startTime)}`.slice(0, 140);
                if (emailRecipient) {
                    const emailRes = await sendAppointmentConfirmationEmail(
                        emailRecipient,
                        user.name || patientName || guestName || "Patient",
                        treatment.name,
                        formatDate(startTime),
                        formatTime(startTime)
                    );
                    const skipped = (emailRes as any)?.messageId === "skipped-no-smtp";
                    await prisma.notificationLog.create({
                        data: {
                            patientId: user.id,
                            appointmentId: appointment.id,
                            channel: "EMAIL",
                            recipient: emailRecipient,
                            templateKey: "booking_confirmation",
                            messagePreview: previewText,
                            status: skipped ? "SKIPPED" : "SENT",
                            errorMessage: skipped ? "SMTP not configured" : null,
                            sentAt: skipped ? null : new Date(),
                        },
                    }).catch(() => {});
                }
            } catch (emailErr: any) {
                console.error("[BookingService] Email notification non-fatal error:", emailErr);
            }
        })();

        // Dispatch WhatsApp confirmation via n8n webhook and log in NotificationLog
        let whatsappConfirmation: { sent: boolean; error?: string } = {
            sent: false,
            error: "No phone number available for WhatsApp confirmation",
        };
        try {
            const recipientPhone = canonicalPhone || user.phone || guestPhone || phone;
            const previewText = `${treatment.name} visit on ${formatDate(startTime)} at ${formatTime(startTime)}`.slice(0, 140);
            if (recipientPhone) {
                const n8nResult = await dispatchN8nBookingWebhook({
                    phone: recipientPhone,
                    patientName: user.name || patientName || guestName || "Valued Patient",
                    treatmentName: treatment.name,
                    doctorName: appointment.doctor?.name || "Attending Dentist",
                    date: formatDate(startTime),
                    time: formatTime(startTime),
                    appointmentId: appointment.id,
                    patientCode,
                    bookedBy,
                    sessionLabel: assignedSessionLabel,
                    isMultiSession: Boolean(targetPtId),
                });
                whatsappConfirmation = {
                    sent: n8nResult.success,
                    error: n8nResult.error,
                };
                await prisma.notificationLog.create({
                    data: {
                        patientId: user.id,
                        appointmentId: appointment.id,
                        channel: "WHATSAPP",
                        recipient: recipientPhone,
                        templateKey: "booking_confirmation",
                        messagePreview: previewText,
                        status: n8nResult.success ? "SENT" : "FAILED",
                        errorMessage: n8nResult.error || null,
                        sentAt: n8nResult.success ? new Date() : null,
                    },
                }).catch(() => {});
            } else {
                await prisma.notificationLog.create({
                    data: {
                        patientId: user.id,
                        appointmentId: appointment.id,
                        channel: "WHATSAPP",
                        recipient: "missing",
                        templateKey: "booking_confirmation",
                        messagePreview: previewText,
                        status: "SKIPPED",
                        errorMessage: "No phone number on file",
                    },
                }).catch(() => {});
            }
        } catch (n8nErr: any) {
            console.error("[BookingService] n8n WhatsApp notification non-fatal error:", n8nErr);
            whatsappConfirmation = {
                sent: false,
                error: n8nErr?.message || "Failed to dispatch WhatsApp confirmation",
            };
        }

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
            whatsappConfirmation,
        };
    } catch (error: any) {
        const isOverlapExclusion =
            error?.message === "DOUBLE_BOOKING" ||
            error?.code === "23P01" ||
            error?.meta?.code === "23P01" ||
            String(error?.message || "").includes("Appointment_no_overlap_active");
        if (isOverlapExclusion) {
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
        if (error.message === "PATIENT_ARCHIVED") {
            return {
                success: false,
                error: "This patient account is archived. Restore it in the Patients Directory before booking.",
                status: 409,
            };
        }
        if (error.message === "BREAK_WINDOW") {
            return {
                success: false,
                error: "This time falls during the clinic break window.",
                status: 400,
            };
        }
        if (error.message === "ADVANCE_NOTICE") {
            return {
                success: false,
                error: `Online bookings require at least ${error?.advanceNoticeMin || "configured"} advance notice.`,
                status: 400,
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
