"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
const server_1 = require("next/server");
const prisma_1 = __importDefault(require("@/lib/prisma"));
async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const date = searchParams.get("date");
        const treatmentId = searchParams.get("treatmentId");
        const excludeAppointmentId = searchParams.get("excludeAppointmentId");
        if (!date) {
            return server_1.NextResponse.json({ error: "date is required" }, { status: 400 });
        }
        // Parse date using local time constructor to avoid UTC offset issues
        const [year, month, day] = date.split("-").map(Number);
        const selectedDate = new Date(year, month - 1, day);
        // Check for Sunday (clinic off day)
        if (selectedDate.getDay() === 0) {
            return server_1.NextResponse.json({ slots: [], dayOff: true, reason: "Sunday is a clinic off day" });
        }
        // Get treatment duration
        let treatmentDuration = 30;
        if (treatmentId) {
            const treatment = await prisma_1.default.treatment.findUnique({
                where: { id: treatmentId },
                select: { durationMin: true },
            });
            if (treatment)
                treatmentDuration = treatment.durationMin;
        }
        // Get clinic working hours from SystemSettings
        const settings = await prisma_1.default.systemSettings.findUnique({
            where: { id: "settings" },
        });
        const workStart = settings?.workDayStart || "09:00";
        const workEnd = settings?.workDayEnd || "17:00";
        // Get existing appointments for this date (use local date boundaries)
        const startOfDay = new Date(year, month - 1, day, 0, 0, 0, 0);
        const endOfDay = new Date(year, month - 1, day, 23, 59, 59, 999);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const whereClause = {
            startTime: { gte: startOfDay, lte: endOfDay },
            status: { notIn: ["CANCELLED"] },
        };
        // Exclude a specific appointment when rescheduling
        if (excludeAppointmentId) {
            whereClause.id = { not: excludeAppointmentId };
        }
        const existingAppointments = await prisma_1.default.appointment.findMany({
            where: whereClause,
            select: { startTime: true, endTime: true },
        });
        // Generate all possible slots
        const slots = [];
        const [startH, startM] = workStart.split(":").map(Number);
        const [endH, endM] = workEnd.split(":").map(Number);
        const workStartMin = startH * 60 + startM;
        const workEndMin = endH * 60 + endM;
        for (let min = workStartMin; min < workEndMin; min += treatmentDuration) {
            const slotH = Math.floor(min / 60);
            const slotM = min % 60;
            const slotEndMin = min + treatmentDuration;
            // Skip if treatment would go past working hours
            if (slotEndMin > workEndMin)
                continue;
            // Check if slot overlaps with any existing appointment (exact overlap, no buffer)
            const isOccupied = existingAppointments.some((apt) => {
                const aptStartMin = apt.startTime.getHours() * 60 + apt.startTime.getMinutes();
                const aptEndMin = apt.endTime.getHours() * 60 + apt.endTime.getMinutes();
                // Standard overlap check: slot starts before apt ends AND slot ends after apt starts
                return min < aptEndMin && slotEndMin > aptStartMin;
            });
            // Format to 12h
            const period = slotH >= 12 ? "PM" : "AM";
            const displayH = slotH === 0 ? 12 : slotH > 12 ? slotH - 12 : slotH;
            const label = `${displayH}:${slotM.toString().padStart(2, "0")} ${period}`;
            // Calculate end time display
            const endTimeH = Math.floor(slotEndMin / 60);
            const endTimeM = slotEndMin % 60;
            const endPeriod = endTimeH >= 12 ? "PM" : "AM";
            const endDisplayH = endTimeH === 0 ? 12 : endTimeH > 12 ? endTimeH - 12 : endTimeH;
            const endLabel = `${endDisplayH}:${endTimeM.toString().padStart(2, "0")} ${endPeriod}`;
            // Check if slot is in the past (for today)
            const now = new Date();
            const isToday = selectedDate.toDateString() === now.toDateString();
            const isPast = isToday && (slotH < now.getHours() || (slotH === now.getHours() && slotM <= now.getMinutes()));
            slots.push({
                value: `${slotH.toString().padStart(2, "0")}:${slotM.toString().padStart(2, "0")}`,
                label,
                endLabel,
                available: !isOccupied && !isPast,
            });
        }
        return server_1.NextResponse.json({ slots, dayOff: false });
    }
    catch (error) {
        console.error("Availability check error:", error);
        return server_1.NextResponse.json({ error: "Failed to check availability" }, { status: 500 });
    }
}
