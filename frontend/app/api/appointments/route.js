"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
exports.POST = POST;
const server_1 = require("next/server");
const cache_1 = require("next/cache");
const prisma_1 = __importDefault(require("@/lib/prisma"));
const headers_1 = require("next/headers");
const auth_1 = require("@/lib/auth");
const googleCalendar_1 = require("@/lib/googleCalendar");
const zod_1 = require("zod");
const logger_1 = require("@/lib/logger");
const email_1 = require("@/lib/email");
const phone_1 = require("@/lib/phone");
const timezone_1 = require("@/lib/timezone");
const security_1 = require("@/lib/security");
// Zod Schema for Booking Payload Validation
const bookingSchema = zod_1.z.object({
    treatmentId: zod_1.z.string().min(1, "Treatment ID is required"),
    date: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
    time: zod_1.z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format (HH:MM)"),
    notes: zod_1.z.string().optional(),
    patientId: zod_1.z.string().optional(),
    newPatient: zod_1.z.object({
        name: zod_1.z.string().min(1, "Name is required"),
        email: zod_1.z.string().email().optional().or(zod_1.z.literal("")),
        phone: zod_1.z.string().min(10, "Phone number is required"),
        dateOfBirth: zod_1.z.string().optional(), // New DOB field
    }).optional(),
    guestName: zod_1.z.string().optional(),
    guestPhone: zod_1.z.string().optional(),
    guestEmail: zod_1.z.string().email().optional().or(zod_1.z.literal("")),
    guestDob: zod_1.z.string().optional(), // New Guest DOB field
}).superRefine((data, ctx) => {
    // If guest details are partially provided
    if (data.guestName || data.guestPhone || data.guestEmail || data.guestDob) {
        if (!data.guestName) {
            ctx.addIssue({ code: zod_1.z.ZodIssueCode.custom, message: "Guest name is required", path: ["guestName"] });
        }
        if (!data.guestPhone) {
            ctx.addIssue({ code: zod_1.z.ZodIssueCode.custom, message: "Guest phone is required", path: ["guestPhone"] });
        }
    }
});
// GET: Fetch appointments (filtered by role)
async function GET(request) {
    try {
        const cookie = (await (0, headers_1.cookies)()).get("session")?.value;
        if (!cookie)
            return server_1.NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        const session = await (0, auth_1.decrypt)(cookie);
        const role = session.role;
        if (role !== "ADMIN" && role !== "STAFF") {
            return server_1.NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
        const { searchParams } = new URL(request.url);
        const status = searchParams.get("status");
        const dateFrom = searchParams.get("dateFrom");
        const dateTo = searchParams.get("dateTo");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const where = {};
        if (status)
            where.status = status;
        if (dateFrom || dateTo) {
            where.startTime = {};
            if (dateFrom)
                where.startTime.gte = new Date(dateFrom);
            if (dateTo)
                where.startTime.lte = new Date(dateTo + "T23:59:59");
        }
        const appointments = await prisma_1.default.appointment.findMany({
            where,
            include: {
                patient: { select: { id: true, name: true, email: true, phone: true } },
                treatment: { select: { id: true, name: true, price: true, durationMin: true } },
            },
            orderBy: { startTime: "desc" },
        });
        return server_1.NextResponse.json({ appointments });
    }
    catch (error) {
        logger_1.logger.error({ err: error }, "Failed to fetch appointments");
        return server_1.NextResponse.json({ error: "Failed to fetch appointments" }, { status: 500 });
    }
}
// POST: Book a new appointment
async function POST(request) {
    let body;
    try {
        const cookie = (await (0, headers_1.cookies)()).get("session")?.value;
        let session = null;
        if (cookie) {
            try {
                session = await (0, auth_1.decrypt)(cookie);
            }
            catch {
                session = null;
            }
        }
        const bookerRole = session?.role;
        let patientId = session?.id;
        body = await request.json();
        // 🛡️ Strict Payload Validation using Zod
        const validationResult = bookingSchema.safeParse(body);
        if (!validationResult.success) {
            return server_1.NextResponse.json({
                error: "Validation failed",
                details: validationResult.error.format()
            }, { status: 400 });
        }
        const { treatmentId, date, time, notes, newPatient, guestName, guestPhone, guestEmail, guestDob } = validationResult.data;
        // If not logged in and not staff, guest details are required
        if (!session && (!guestName || !guestPhone)) {
            return server_1.NextResponse.json({ error: "Name and phone number are required to book" }, { status: 400 });
        }
        // Validation for Staff/Admin booking on behalf of others
        if (bookerRole === "STAFF" || bookerRole === "ADMIN") {
            if (validationResult.data.patientId) {
                patientId = validationResult.data.patientId;
            }
            if (!patientId && !newPatient) {
                return server_1.NextResponse.json({ error: "Patient ID or New Patient details required" }, { status: 400 });
            }
        }
        // Validate date — no Sundays
        if ((0, timezone_1.isSundayInKarachi)(date)) {
            return server_1.NextResponse.json({ error: "Sunday is a clinic off day. Please select another date." }, { status: 400 });
        }
        // Get treatment info
        const treatment = await prisma_1.default.treatment.findUnique({
            where: { id: treatmentId },
        });
        if (!treatment) {
            return server_1.NextResponse.json({ error: "Treatment not found" }, { status: 404 });
        }
        // Calculate start and end times in Karachi timezone
        const startTime = (0, timezone_1.parseKarachiDateTime)(date, time);
        const endTime = new Date(startTime.getTime() + treatment.durationMin * 60000);
        // Determine booking source
        let bookedBy = "WEBSITE";
        if (bookerRole === "STAFF" || bookerRole === "ADMIN") {
            bookedBy = body.bookedBy || "WALK_IN";
        }
        // Atomic transaction for double-booking prevention AND user creation
        const result = await prisma_1.default.$transaction(async (tx) => {
            let finalPatientId = patientId;
            // 1. Handle New Patient or Guest Creation if needed
            if ((bookerRole === "STAFF" || bookerRole === "ADMIN") && newPatient) {
                const canonicalPhone = (0, phone_1.normalizePhone)(newPatient.phone);
                const existingUser = await tx.user.findFirst({
                    where: {
                        phone: canonicalPhone,
                    },
                });
                if (existingUser) {
                    finalPatientId = existingUser.id;
                }
                else {
                    const hashedPassword = await (0, security_1.generateRandomPatientPasswordHash)();
                    const createdUser = await tx.user.create({
                        data: {
                            name: newPatient.name,
                            email: newPatient.email || undefined,
                            phone: canonicalPhone,
                            password: hashedPassword,
                            role: "PATIENT",
                            dateOfBirth: newPatient.dateOfBirth ? new Date(newPatient.dateOfBirth) : undefined,
                        },
                    });
                    finalPatientId = createdUser.id;
                }
            }
            else if (!finalPatientId && guestPhone && guestName) {
                const canonicalGuestPhone = (0, phone_1.normalizePhone)(guestPhone);
                const existingUser = await tx.user.findFirst({
                    where: { phone: canonicalGuestPhone },
                });
                if (existingUser) {
                    finalPatientId = existingUser.id;
                }
                else {
                    const hashedPassword = await (0, security_1.generateRandomPatientPasswordHash)();
                    const createdUser = await tx.user.create({
                        data: {
                            name: guestName,
                            email: guestEmail || undefined,
                            phone: canonicalGuestPhone,
                            password: hashedPassword,
                            role: "PATIENT",
                            dateOfBirth: guestDob ? new Date(guestDob) : undefined,
                        },
                    });
                    finalPatientId = createdUser.id;
                }
            }
            // 2. Check for exact time overlap
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
            if (!finalPatientId) {
                throw new Error("PATIENT_ID_REQUIRED");
            }
            // 3. Create appointment
            const appointment = await tx.appointment.create({
                data: {
                    startTime,
                    endTime,
                    patientId: finalPatientId,
                    treatmentId,
                    status: "SCHEDULED",
                    bookedBy,
                    price: treatment.price,
                    // Guest Details
                    guestName: guestName,
                    guestPhone: guestPhone,
                    guestEmail: guestEmail,
                    guestDob: guestDob ? new Date(guestDob) : undefined,
                },
                include: {
                    treatment: { select: { name: true, durationMin: true } },
                    patient: { select: { name: true, phone: true, email: true } },
                },
            });
            return appointment;
        });
        // 4. Create Google Calendar event (outside transaction — non-blocking background task)
        (async () => {
            try {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const safeResult = result;
                if (safeResult.treatment && safeResult.patient) {
                    const googleEventId = await (0, googleCalendar_1.createCalendarEvent)({
                        summary: `${safeResult.treatment.name} — ${safeResult.patient.name}`,
                        description: `Treatment: ${safeResult.treatment.name}\nDuration: ${safeResult.treatment.durationMin} min`,
                        startTime: safeResult.startTime,
                        endTime: safeResult.endTime,
                        patientName: safeResult.patient.name || "Patient",
                    });
                    if (googleEventId) {
                        await prisma_1.default.appointment.update({
                            where: { id: result.id },
                            data: { googleEventId },
                        });
                    }
                }
            }
            catch (calError) {
                logger_1.logger.warn({ err: calError, appointmentId: result.id }, "Google Calendar sync failed");
            }
        })();
        // Send Email notification
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const safeResultObj = result;
        const emailToNotify = safeResultObj.patient?.email;
        if (emailToNotify) {
            const formattedDate = new Date(safeResultObj.startTime).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
            const formattedTime = new Date(safeResultObj.startTime).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
            (0, email_1.sendAppointmentConfirmationEmail)(emailToNotify, safeResultObj.patient.name, safeResultObj.treatment.name, formattedDate, formattedTime).catch((err) => logger_1.logger.warn({ err }, "Failed to send confirmation email"));
        }
        // Revalidate cached pages so admin/staff see fresh data instantly
        (0, cache_1.revalidatePath)("/admin", "layout");
        (0, cache_1.revalidatePath)("/staff", "layout");
        return server_1.NextResponse.json({
            success: true,
            appointment: result,
            message: "Appointment booked successfully!",
        }, { status: 201 });
    }
    catch (error) {
        if (error instanceof Error && error.message === "DOUBLE_BOOKING") {
            return server_1.NextResponse.json({
                error: "This time slot is no longer available. Please select another time.",
                code: "DOUBLE_BOOKING",
            }, { status: 409 });
        }
        logger_1.logger.error({ err: error, body }, "Failed to book appointment");
        return server_1.NextResponse.json({ error: "Failed to book appointment" }, { status: 500 });
    }
}
