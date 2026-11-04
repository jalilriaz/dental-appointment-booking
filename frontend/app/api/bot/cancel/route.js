"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PATCH = PATCH;
const server_1 = require("next/server");
const prisma_1 = __importDefault(require("@/lib/prisma"));
const cache_1 = require("next/cache");
const googleCalendar_1 = require("@/lib/googleCalendar");
const auth_bot_1 = require("@/lib/auth-bot");
const phone_1 = require("@/lib/phone");
const timezone_1 = require("@/lib/timezone");
async function PATCH(req) {
    try {
        // 1. Timing-Safe Authentication Check
        const auth = (0, auth_bot_1.verifyBotAuth)(req);
        if (!auth.ok) {
            return server_1.NextResponse.json({ message: auth.error }, { status: auth.status || 401 });
        }
        // 2. Parse and Validate Request Body
        const body = await req.json();
        const { phone, currentDate, appointmentId } = body;
        if (!phone) {
            return server_1.NextResponse.json({ message: "Missing required fields: please provide phone" }, { status: 400 });
        }
        const canonicalPhone = (0, phone_1.normalizePhone)(phone);
        // 3. Find Patient by Canonical Phone
        const patient = await prisma_1.default.user.findFirst({
            where: { phone: canonicalPhone },
        });
        if (!patient) {
            return server_1.NextResponse.json({ message: "Patient not found with this phone number." }, { status: 404 });
        }
        // Build upcoming appointment query
        let appointmentQuery = {
            patientId: patient.id,
            status: { in: ["SCHEDULED", "RESCHEDULED"] },
            startTime: {
                gt: new Date(),
            },
        };
        if (appointmentId) {
            appointmentQuery.id = appointmentId;
        }
        else if (currentDate) {
            const { startOfDay, endOfDay } = (0, timezone_1.getKarachiDayBoundaries)(currentDate);
            appointmentQuery.startTime = {
                gte: startOfDay,
                lte: endOfDay,
            };
        }
        else {
            // Check if patient has multiple upcoming appointments
            const upcomingAppointments = await prisma_1.default.appointment.findMany({
                where: appointmentQuery,
                orderBy: { startTime: "asc" },
                include: { treatment: { select: { name: true } } },
            });
            if (upcomingAppointments.length > 1) {
                return server_1.NextResponse.json({
                    multipleAppointments: true,
                    message: "The patient has multiple upcoming appointments. Please ask them which one (by date or treatment) they wish to cancel.",
                    appointments: upcomingAppointments.map((a) => ({
                        appointmentId: a.id,
                        patientName: a.guestName || patient.name || "Patient",
                        date: a.startTime.toISOString().split("T")[0],
                        time: a.startTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true }),
                        treatment: a.treatment.name,
                    })),
                });
            }
        }
        const existingAppointment = await prisma_1.default.appointment.findFirst({
            where: appointmentQuery,
            orderBy: {
                startTime: "asc",
            },
        });
        if (!existingAppointment) {
            return server_1.NextResponse.json({ message: "No upcoming scheduled appointments found for this phone number." }, { status: 404 });
        }
        if (existingAppointment.status === "CANCELLED") {
            return server_1.NextResponse.json({
                success: true,
                message: "Appointment is already cancelled.",
                appointmentId: existingAppointment.id,
            });
        }
        // 4. Cancel Appointment
        const cancelledAppointment = await prisma_1.default.appointment.update({
            where: { id: existingAppointment.id },
            data: {
                status: "CANCELLED",
            },
        });
        // 5. Trigger Google Calendar sync
        if (existingAppointment.googleEventId) {
            (async () => {
                try {
                    await (0, googleCalendar_1.deleteCalendarEvent)(existingAppointment.googleEventId);
                    await prisma_1.default.appointment.update({
                        where: { id: existingAppointment.id },
                        data: { googleEventId: null },
                    });
                }
                catch (calError) {
                    console.error("WhatsApp Bot -> Google Calendar delete sync failed:", calError);
                }
            })();
        }
        // 6. Real-Time UI Revalidation
        (0, cache_1.revalidatePath)("/admin");
        (0, cache_1.revalidatePath)("/staff");
        return server_1.NextResponse.json({
            success: true,
            message: "Appointment cancelled successfully.",
            appointmentId: cancelledAppointment.id,
        });
    }
    catch (error) {
        console.error("Error cancelling appointment via bot:", error);
        return server_1.NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
