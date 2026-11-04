"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = POST;
const server_1 = require("next/server");
const prisma_1 = __importDefault(require("@/lib/prisma"));
const auth_bot_1 = require("@/lib/auth-bot");
const timezone_1 = require("@/lib/timezone");
async function POST(req) {
    try {
        const auth = (0, auth_bot_1.verifyBotAuth)(req);
        if (!auth.ok) {
            return server_1.NextResponse.json({ message: auth.error }, { status: auth.status || 401 });
        }
        const { date, time } = await req.json();
        if (!date || !time) {
            return server_1.NextResponse.json({ message: "Missing date or time" }, { status: 400 });
        }
        // Sunday check in Asia/Karachi
        if ((0, timezone_1.isSundayInKarachi)(date)) {
            return server_1.NextResponse.json({
                isAvailable: false,
                message: "The clinic is closed on Sundays. Please select a different day (Monday-Saturday).",
            });
        }
        const startTimeStamp = (0, timezone_1.parseKarachiDateTime)(date, time);
        // Assume default 30 min duration since service may not be selected yet
        const endTimeStamp = new Date(startTimeStamp);
        endTimeStamp.setMinutes(endTimeStamp.getMinutes() + 30);
        // Check for exact time overlap
        const existingAppointment = await prisma_1.default.appointment.findFirst({
            where: {
                status: {
                    notIn: ["CANCELLED", "NO_SHOW"],
                },
                AND: [
                    { startTime: { lt: endTimeStamp } },
                    { endTime: { gt: startTimeStamp } },
                ],
            },
        });
        if (existingAppointment) {
            return server_1.NextResponse.json({
                isAvailable: false,
                message: "An appointment already exists at this time.",
            });
        }
        return server_1.NextResponse.json({
            isAvailable: true,
            message: "Time slot is available.",
        });
    }
    catch (error) {
        console.error("Error checking availability:", error);
        return server_1.NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
