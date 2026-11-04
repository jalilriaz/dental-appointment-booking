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
const cache_1 = require("next/cache");
/**
 * Centralized, transactional booking engine for Elite Dental Centre.
 * Unifies appointment creation across Web, Walk-in, Admin, and WhatsApp Bot.
 */
async function createAppointment(input) {
    try {
        const { patientId: inputPatientId, patientName, phone, age, email, treatmentId, date, time, durationMin: customDuration, bookedBy, notes, patientTreatmentId: explicitPtId, sessionNumber: explicitSessionNumber, sessionLabel: explicitSessionLabel, plannedFee, } = input;
        // 1. Validate required fields
        if (!date || !time) {
            return { success: false, error: "Date and time are required.", status: 400 };
        }
        if (!inputPatientId && (!patientName || !phone)) {
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
        // 3. Resolve treatment
        let treatment = null;
        if (treatmentId) {
            treatment = await prisma_1.default.treatment.findUnique({
                where: { id: treatmentId },
            });
        }
        if (!treatment) {
            treatment = await prisma_1.default.treatment.findFirst({
                where: { isActive: true },
            });
        }
        if (!treatment) {
            return { success: false, error: "No valid treatment found.", status: 400 };
        }
        const duration = customDuration || treatment.durationMin || 30;
        const startTime = (0, timezone_1.parseKarachiDateTime)(date, time);
        const endTime = new Date(startTime.getTime() + duration * 60000);
        // 4. Resolve Patient (Phone-based canonical lookup or existing patientId)
        let patient = null;
        let canonicalPhone = null;
        if (inputPatientId) {
            patient = await prisma_1.default.user.findUnique({
                where: { id: inputPatientId },
            });
            if (patient) {
                canonicalPhone = patient.phone ? (0, phone_1.normalizePhone)(patient.phone) : null;
            }
        }
        if (!patient && phone) {
            canonicalPhone = (0, phone_1.normalizePhone)(phone);
            patient = await prisma_1.default.user.findFirst({
                where: { phone: canonicalPhone },
            });
            if (!patient) {
                const initialPasswordHash = await (0, security_1.generateRandomPatientPasswordHash)();
                const code = await (0, patientCode_1.generatePatientCode)();
                patient = await prisma_1.default.user.create({
                    data: {
                        name: patientName || "Valued Patient",
                        phone: canonicalPhone,
                        email: email || undefined,
                        role: "PATIENT",
                        password: initialPasswordHash,
                        patientCode: code,
                    },
                });
            }
            else if (!patient.patientCode) {
                const code = await (0, patientCode_1.generatePatientCode)();
                patient = await prisma_1.default.user.update({
                    where: { id: patient.id },
                    data: { patientCode: code },
                });
            }
        }
        if (!patient) {
            return { success: false, error: "Unable to find or create patient record.", status: 400 };
        }
        // 5. Double Booking Conflict Check
        const conflict = await prisma_1.default.appointment.findFirst({
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
        let assignedSessionNumber = explicitSessionNumber || null;
        let assignedSessionLabel = explicitSessionLabel || null;
        // If no explicit plan was passed, check if the patient has an active IN_PROGRESS plan for this treatment
        if (!targetPtId) {
            const activePlan = await prisma_1.default.patientTreatment.findFirst({
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
            const plan = await prisma_1.default.patientTreatment.findUnique({
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
        const appointment = await prisma_1.default.appointment.create({
            data: {
                startTime,
                endTime,
                patientId: patient.id,
                treatmentId: treatment.id,
                bookedBy: bookedBy,
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
                const summary = `${treatment.name} — ${patient.name || patientName}${assignedSessionLabel ? ` (${assignedSessionLabel})` : ""}`;
                const description = `Patient: ${patient.name || patientName}\nTreatment: ${treatment.name}\nDuration: ${duration} min${assignedSessionLabel ? `\nSession: ${assignedSessionLabel}` : ""}${age ? `\nAge: ${age}` : ""}`;
                const googleEventId = await (0, googleCalendar_1.createCalendarEvent)({
                    summary,
                    description,
                    startTime,
                    endTime,
                    patientName: patient.name || patientName || "Patient",
                    patientPhone: canonicalPhone || patient.phone || undefined,
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
        })();
        // 9. Revalidate Dashboard Views
        (0, cache_1.revalidatePath)("/admin");
        (0, cache_1.revalidatePath)("/staff");
        (0, cache_1.revalidatePath)("/admin/appointments");
        (0, cache_1.revalidatePath)("/staff/appointments");
        return {
            success: true,
            message: "Appointment booked successfully.",
            appointment,
            patientCode: patient.patientCode,
            isMultiSession: Boolean(targetPtId),
            sessionNumber: assignedSessionNumber,
            sessionLabel: assignedSessionLabel,
        };
    }
    catch (error) {
        console.error("[BookingService] createAppointment error:", error);
        return {
            success: false,
            error: error.message || "Failed to book appointment.",
            status: 500,
        };
    }
}
