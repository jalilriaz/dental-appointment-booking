"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAppointment = createAppointment;
const prisma_1 = __importDefault(require("@/lib/prisma"));
const googleCalendar_1 = require("@/lib/googleCalendar");
const patientCode_1 = require("@/lib/patientCode");
const phone_1 = require("@/lib/phone");
const timezone_1 = require("@/lib/timezone");
const security_1 = require("@/lib/security");
const treatmentsData_1 = require("@/lib/treatmentsData");
const email_1 = require("@/lib/email");
const n8n_1 = require("@/lib/n8n");
const utils_1 = require("@/lib/utils");
const revalidatePath = (..._args) => { };
/**
 * Centralized, transactional booking engine for Elite Dental Centre.
 * Serializes and guarantees anti-double booking across WhatsApp Bot, Website, and Walk-in portals.
 */
async function createAppointment(input) {
    try {
        const { patientId: inputPatientId, patientName, phone, age, email, dateOfBirth, guestName, guestPhone, guestEmail, guestDob, treatmentId, date, time, durationMin: customDuration, bookedBy, notes, doctorId, patientTreatmentId: explicitPtId, sessionNumber: explicitSessionNumber, sessionLabel: explicitSessionLabel, plannedFee, } = input;
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
        if ((0, timezone_1.isSundayInKarachi)(date)) {
            return {
                success: false,
                error: "The clinic is closed on Sundays. Please select a day from Monday to Saturday.",
                status: 400,
            };
        }
        // 3. Execute atomic serialized transaction
        const txResult = await prisma_1.default.$transaction(async (tx) => {
            // Serialize concurrent slot booking requests with a PostgreSQL Transaction Advisory Lock
            // Guarantees zero double-booking even if Website, Chatbot, and Walk-in hit the exact same millisecond.
            const lockKey = `slot_${date}_${time}`;
            await tx.$executeRaw `SELECT pg_advisory_xact_lock(hashtext(${lockKey}));`;
            // A. Resolve treatment
            let treatment = null;
            if (treatmentId) {
                treatment = await tx.treatment.findUnique({
                    where: { id: treatmentId },
                });
                if (!treatment) {
                    const mock = treatmentsData_1.ALL_TREATMENTS.find((t) => t.id === treatmentId);
                    if (mock) {
                        treatment = await tx.treatment.findFirst({
                            where: { name: { equals: mock.name, mode: "insensitive" } },
                        });
                    }
                }
            }
            if (!treatment) {
                // Default fallback to General Consultation & Dental Checkup first
                treatment = await tx.treatment.findFirst({
                    where: { name: { contains: "Consultation", mode: "insensitive" }, isActive: true },
                });
                if (!treatment) {
                    treatment = await tx.treatment.findFirst({
                        where: { isActive: true },
                    });
                }
            }
            if (!treatment) {
                throw new Error("TREATMENT_NOT_FOUND");
            }
            // B. Compute dynamic duration & time windows
            const duration = customDuration || treatment.durationMin || 30;
            const startTime = (0, timezone_1.parseKarachiDateTime)(date, time);
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
            let canonicalPhone = null;
            let patientCode = null;
            if (inputPatientId) {
                user = await tx.user.findUnique({
                    where: { id: inputPatientId },
                });
                if (!user)
                    throw new Error("PATIENT_NOT_FOUND");
                canonicalPhone = user.phone ? (0, phone_1.normalizePhone)(user.phone) : null;
                patientCode = user.patientCode;
                if (!patientCode) {
                    patientCode = await (0, patientCode_1.generatePatientCode)();
                    await tx.user.update({
                        where: { id: user.id },
                        data: { patientCode },
                    });
                }
            }
            else {
                canonicalPhone = (0, phone_1.normalizePhone)(rawPhone);
                user = await tx.user.findFirst({
                    where: { phone: canonicalPhone },
                });
                const nameToUse = rawName || "Valued Patient";
                const emailToUse = email || guestEmail || undefined;
                const dobToUse = guestDob || dateOfBirth ? new Date((guestDob || dateOfBirth)) : undefined;
                if (!user) {
                    patientCode = await (0, patientCode_1.generatePatientCode)();
                    const initialPasswordHash = await (0, security_1.generateRandomPatientPasswordHash)();
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
                }
                else {
                    const shouldUpdateName = Boolean(nameToUse && nameToUse !== "Valued Patient" && nameToUse !== user.name);
                    patientCode = user.patientCode || (await (0, patientCode_1.generatePatientCode)());
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
            let assignedSessionNumber = explicitSessionNumber || null;
            let assignedSessionLabel = explicitSessionLabel || null;
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
                    bookedBy: bookedBy,
                    status: "SCHEDULED",
                    price: appointmentPrice,
                    guestName: guestName || rawName || user.name,
                    guestPhone: guestPhone || canonicalPhone || user.phone,
                    guestEmail: guestEmail || email || user.email || null,
                    guestDob: guestDob || dateOfBirth ? new Date((guestDob || dateOfBirth)) : null,
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
        const { appointment, patientCode, targetPtId, assignedSessionNumber, assignedSessionLabel, treatment, user, startTime, endTime, duration, canonicalPhone, } = txResult;
        (async () => {
            try {
                const summary = `${treatment.name} — ${user.name || patientName || guestName}${assignedSessionLabel ? ` (${assignedSessionLabel})` : ""}`;
                const description = `Patient: ${user.name || patientName || guestName}\nTreatment: ${treatment.name}\nDuration: ${duration} min${assignedSessionLabel ? `\nSession: ${assignedSessionLabel}` : ""}${age ? `\nAge: ${age}` : ""}`;
                const googleEventId = await (0, googleCalendar_1.createCalendarEvent)({
                    summary,
                    description,
                    startTime,
                    endTime,
                    patientName: user.name || patientName || guestName || "Patient",
                    patientPhone: canonicalPhone || user.phone || undefined,
                });
                if (googleEventId) {
                    await prisma_1.default.appointment.update({
                        where: { id: appointment.id },
                        data: { googleEventId },
                    });
                }
            }
            catch (err) {
                console.error("[BookingService] Google Calendar sync non-fatal error:", err);
            }
            // Non-blocking confirmation email
            try {
                const emailRecipient = user.email || guestEmail || email;
                if (emailRecipient) {
                    await (0, email_1.sendAppointmentConfirmationEmail)(emailRecipient, user.name || patientName || guestName || "Patient", treatment.name, (0, utils_1.formatDate)(startTime), (0, utils_1.formatTime)(startTime));
                }
            }
            catch (emailErr) {
                console.error("[BookingService] Email notification non-fatal error:", emailErr);
            }
            // Non-blocking WhatsApp confirmation via n8n webhook
            try {
                const recipientPhone = canonicalPhone || user.phone || guestPhone || phone;
                if (recipientPhone) {
                    await (0, n8n_1.dispatchN8nBookingWebhook)({
                        phone: recipientPhone,
                        patientName: user.name || patientName || guestName || "Valued Patient",
                        treatmentName: treatment.name,
                        doctorName: appointment.doctor?.name || "Dr. Shehryar Akhtar",
                        date: (0, utils_1.formatDate)(startTime),
                        time: (0, utils_1.formatTime)(startTime),
                        appointmentId: appointment.id,
                        patientCode,
                    });
                }
            }
            catch (n8nErr) {
                console.error("[BookingService] n8n WhatsApp notification non-fatal error:", n8nErr);
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
    }
    catch (error) {
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
//# sourceMappingURL=bookingService.js.map