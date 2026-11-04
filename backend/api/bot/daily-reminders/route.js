"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
const server_1 = require("next/server");
const prisma_1 = __importDefault(require("@/lib/prisma"));
const utils_1 = require("@/lib/utils");
const auth_bot_1 = require("@/lib/auth-bot");
const phone_1 = require("@/lib/phone");
const timezone_1 = require("@/lib/timezone");
async function GET(request) {
    const auth = (0, auth_bot_1.verifyBotAuth)(request);
    if (!auth.ok) {
        return server_1.NextResponse.json({ error: auth.error }, { status: auth.status || 401 });
    }
    try {
        const todayStr = (0, timezone_1.getKarachiTodayStr)();
        const { startOfDay, endOfDay } = (0, timezone_1.getKarachiDayBoundaries)(todayStr);
        // Fetch all scheduled or rescheduled appointments for today in Karachi timezone
        const appointments = await prisma_1.default.appointment.findMany({
            where: {
                status: {
                    in: ["SCHEDULED", "RESCHEDULED"],
                },
                startTime: {
                    gte: startOfDay,
                    lte: endOfDay,
                },
            },
            include: {
                patient: {
                    select: {
                        name: true,
                        phone: true,
                    },
                },
                treatment: {
                    select: {
                        name: true,
                        durationMin: true,
                    },
                },
            },
            orderBy: {
                startTime: "asc",
            },
        });
        const reminders = appointments
            .filter((apt) => {
            const phone = apt.guestPhone || apt.patient?.phone;
            return Boolean(phone);
        })
            .map((apt) => {
            const patientName = apt.guestName || apt.patient?.name || "Patient";
            const rawPhone = apt.guestPhone || apt.patient?.phone || "";
            const phone = (0, phone_1.normalizePhone)(rawPhone);
            const timeString = (0, utils_1.formatTime)(apt.startTime);
            const dateString = (0, utils_1.formatDate)(apt.startTime, "medium");
            const treatmentName = apt.treatment?.name || "Dental Visit";
            const message = `🦷 *Elite Dental Centre — Appointment Reminder*\n\n` +
                `Dear *${patientName}*,\n\n` +
                `This is a friendly reminder for your scheduled dental visit today with *Dr. Sheriyaar*:\n\n` +
                `📅 *Date:* Today (${dateString})\n` +
                `⏰ *Time:* ${timeString}\n` +
                `🦷 *Treatment:* ${treatmentName}\n` +
                `📍 *Location:* F-10 Markaz, Islamabad\n\n` +
                `To help us prepare for your visit, please reply to this message:\n` +
                `• Reply *CONFIRM* if you are attending\n` +
                `• Reply *RESCHEDULE* if you need a different time\n` +
                `• Reply *CANCEL* if you cannot make it today\n\n` +
                `We look forward to seeing you! ✨`;
            return {
                appointmentId: apt.id,
                patientName,
                phone,
                time: timeString,
                treatmentName,
                message,
            };
        });
        return server_1.NextResponse.json(reminders);
    }
    catch (error) {
        console.error("Error generating daily reminders:", error);
        return server_1.NextResponse.json({ error: "Failed to generate daily reminders" }, { status: 500 });
    }
}
