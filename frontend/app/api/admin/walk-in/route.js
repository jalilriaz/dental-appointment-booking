"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = POST;
const server_1 = require("next/server");
const prisma_1 = __importDefault(require("@/lib/prisma"));
const headers_1 = require("next/headers");
const auth_1 = require("@/lib/auth");
const googleCalendar_1 = require("@/lib/googleCalendar");
const zod_1 = require("zod");
const logger_1 = require("@/lib/logger");
const patientCode_1 = require("@/lib/patientCode");
const email_1 = require("@/lib/email");
const cache_1 = require("next/cache");
const phone_1 = require("@/lib/phone");
const timezone_1 = require("@/lib/timezone");
const security_1 = require("@/lib/security");
// Zod validation schema
const walkInSchema = zod_1.z.object({
    // Patient identification — either existing patientId OR new patient details
    patientId: zod_1.z.string().optional(),
    phone: zod_1.z.string().min(10, "Phone number must be at least 10 digits").optional(),
    cnic: zod_1.z.string().optional().default(""),
    fullName: zod_1.z.string().optional(),
    age: zod_1.z.number().int().min(1).max(150).optional(),
    // Appointment details — always required
    date: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
    time: zod_1.z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format (HH:MM)"),
    treatmentId: zod_1.z.string().min(1, "Treatment is required"),
    patientTreatmentId: zod_1.z.string().optional(),
    notes: zod_1.z.string().optional(),
}).superRefine((data, ctx) => {
    // Must have either patientId (registered patient) OR new patient details
    if (!data.patientId) {
        if (!data.phone)
            ctx.addIssue({ code: zod_1.z.ZodIssueCode.custom, message: "Phone is required for new patients", path: ["phone"] });
        if (!data.fullName)
            ctx.addIssue({ code: zod_1.z.ZodIssueCode.custom, message: "Name is required for new patients", path: ["fullName"] });
        if (!data.age)
            ctx.addIssue({ code: zod_1.z.ZodIssueCode.custom, message: "Age is required for new patients", path: ["age"] });
    }
});
async function POST(request) {
    let body;
    try {
        // 1. Auth check
        const cookie = (await (0, headers_1.cookies)()).get("session")?.value;
        if (!cookie)
            return server_1.NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        const session = await (0, auth_1.decrypt)(cookie);
        const role = session.role;
        if (role !== "ADMIN" && role !== "STAFF") {
            return server_1.NextResponse.json({ error: "Forbidden — Admin or Staff only" }, { status: 403 });
        }
        // 2. Validate
        body = await request.json();
        const validationResult = walkInSchema.safeParse(body);
        if (!validationResult.success) {
            return server_1.NextResponse.json({
                error: "Validation failed",
                details: validationResult.error.format(),
            }, { status: 400 });
        }
        const { patientId, phone, cnic, fullName, age, date, time, treatmentId, patientTreatmentId, notes } = validationResult.data;
        const canonicalPhone = phone ? (0, phone_1.normalizePhone)(phone) : undefined;
        // 3. Validate date — no past dates, no Sundays
        if ((0, timezone_1.isSundayInKarachi)(date)) {
            return server_1.NextResponse.json({ error: "Sunday is a clinic off day. Please select another date." }, { status: 400 });
        }
        // 4. Get treatment info
        const treatment = await prisma_1.default.treatment.findUnique({ where: { id: treatmentId } });
        if (!treatment)
            return server_1.NextResponse.json({ error: "Treatment not found" }, { status: 404 });
        // 5. Calculate times using Asia/Karachi timezone
        const startTime = (0, timezone_1.parseKarachiDateTime)(date, time);
        const endTime = new Date(startTime.getTime() + treatment.durationMin * 60000);
        // 6. Atomic transaction
        const result = await prisma_1.default.$transaction(async (tx) => {
            let userId;
            let patientCode = null;
            let patientName;
            if (patientId) {
                // ── Registered patient path ──
                const existingUser = await tx.user.findUnique({ where: { id: patientId }, select: { id: true, name: true, patientCode: true } });
                if (!existingUser)
                    throw new Error("PATIENT_NOT_FOUND");
                userId = existingUser.id;
                patientName = existingUser.name;
                patientCode = existingUser.patientCode;
                // Assign code if missing
                if (!patientCode) {
                    patientCode = await (0, patientCode_1.generatePatientCode)();
                    await tx.user.update({ where: { id: userId }, data: { patientCode } });
                }
            }
            else {
                // ── New patient path: Main User record ──
                let user = await tx.user.findFirst({ where: { phone: canonicalPhone } });
                if (!user) {
                    patientCode = await (0, patientCode_1.generatePatientCode)();
                    const hashedPassword = await (0, security_1.generateRandomPatientPasswordHash)();
                    user = await tx.user.create({
                        data: { name: fullName, phone: canonicalPhone, password: hashedPassword, role: "PATIENT", patientCode },
                    });
                }
                else if (!user.patientCode) {
                    patientCode = await (0, patientCode_1.generatePatientCode)();
                    await tx.user.update({ where: { id: user.id }, data: { patientCode } });
                }
                else {
                    patientCode = user.patientCode;
                }
                userId = user.id;
                patientName = user.name;
            }
            // Double-booking check — exact overlap on same day only
            const { startOfDay: dayStart, endOfDay: dayEnd } = (0, timezone_1.getKarachiDayBoundaries)(date);
            const conflict = await tx.appointment.findFirst({
                where: {
                    status: { notIn: ["CANCELLED"] },
                    startTime: { gte: dayStart, lte: dayEnd },
                    AND: [
                        { startTime: { lt: endTime } },
                        { endTime: { gt: startTime } },
                    ],
                },
            });
            if (conflict)
                throw new Error("DOUBLE_BOOKING");
            // Multi-session treatment plan linking
            let targetPtId = patientTreatmentId || null;
            if (!targetPtId) {
                const activePlan = await tx.patientTreatment.findFirst({
                    where: {
                        patientId: userId,
                        treatmentId: treatment.id,
                        clinicalStatus: "IN_PROGRESS",
                    },
                    orderBy: { startDate: "desc" },
                });
                if (activePlan) {
                    targetPtId = activePlan.id;
                }
            }
            let sessionNumber = null;
            let sessionLabel = null;
            let aptPrice = treatment.price;
            if (targetPtId) {
                const plan = await tx.patientTreatment.findUnique({
                    where: { id: targetPtId },
                    include: {
                        appointments: {
                            where: { status: { notIn: ["CANCELLED", "NO_SHOW"] } },
                        },
                    },
                });
                if (plan) {
                    sessionNumber = plan.appointments.length + 1;
                    sessionLabel = `Session ${sessionNumber} of ${plan.totalSessions}`;
                    aptPrice = 0; // Revenue belongs to plan package
                }
            }
            // Create appointment
            const appointment = await tx.appointment.create({
                data: {
                    startTime, endTime, patientId: userId, treatmentId,
                    status: "SCHEDULED", bookedBy: "WALK_IN",
                    price: aptPrice,
                    notes: notes || (sessionLabel ? `${sessionLabel} — ${treatment.name}` : null),
                    patientTreatmentId: targetPtId,
                    sessionNumber,
                    sessionLabel,
                },
                include: {
                    treatment: { select: { name: true, durationMin: true } },
                    patient: { select: { name: true, phone: true, email: true } },
                    patientTreatment: true,
                },
            });
            return { appointment, patientCode, patientName, sessionNumber, sessionLabel };
        });
        // 7. Google Calendar (non-blocking in background)
        (async () => {
            try {
                const appt = result.appointment;
                const googleEventId = await (0, googleCalendar_1.createCalendarEvent)({
                    summary: `${appt.treatment.name} — ${appt.patient.name}`,
                    description: `Treatment: ${appt.treatment.name}\nDuration: ${appt.treatment.durationMin} min\nBooked: Walk-In`,
                    startTime: appt.startTime, endTime: appt.endTime,
                    patientName: appt.patient.name || "Patient",
                    patientPhone: appt.patient.phone || undefined,
                });
                if (googleEventId) {
                    await prisma_1.default.appointment.update({ where: { id: appt.id }, data: { googleEventId } });
                }
            }
            catch (calError) {
                logger_1.logger.warn({ err: calError, appointmentId: result.appointment.id }, "Google Calendar sync failed for walk-in");
            }
        })();
        // Send Email notification
        const emailToNotify = result.appointment.patient.email;
        if (emailToNotify) {
            const formattedDate = new Date(result.appointment.startTime).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
            const formattedTime = new Date(result.appointment.startTime).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
            (0, email_1.sendAppointmentConfirmationEmail)(emailToNotify, result.appointment.patient.name, result.appointment.treatment.name, formattedDate, formattedTime).catch((err) => logger_1.logger.warn({ err }, "Failed to send confirmation email"));
        }
        // Revalidate cached pages
        (0, cache_1.revalidatePath)("/admin", "layout");
        (0, cache_1.revalidatePath)("/staff", "layout");
        // 8. Return
        return server_1.NextResponse.json({
            success: true,
            patientCode: result.patientCode,
            patientName: result.patientName,
            appointment: {
                id: result.appointment.id,
                date: result.appointment.startTime,
                time,
                serviceType: result.appointment.treatment.name,
                status: result.appointment.status,
            },
            message: `Appointment booked for ${result.patientName} (Patient ID: ${result.patientCode})`,
        }, { status: 201 });
    }
    catch (error) {
        if (error instanceof Error && error.message === "DOUBLE_BOOKING") {
            return server_1.NextResponse.json({ error: "This time slot is no longer available. Please select another time.", code: "DOUBLE_BOOKING" }, { status: 409 });
        }
        if (error instanceof Error && error.message === "PATIENT_NOT_FOUND") {
            return server_1.NextResponse.json({ error: "Patient not found" }, { status: 404 });
        }
        logger_1.logger.error({ err: error, body }, "Walk-in registration error");
        return server_1.NextResponse.json({ error: "Failed to process walk-in registration" }, { status: 500 });
    }
}
