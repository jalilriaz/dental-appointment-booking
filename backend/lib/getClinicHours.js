"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClinicHours = getClinicHours;
const prisma_1 = __importDefault(require("@/lib/prisma"));
/**
 * Fetch clinic working hours from the database and return a formatted string.
 * Falls back to the hardcoded default if no settings are saved yet.
 */
async function getClinicHours() {
    try {
        const settings = await prisma_1.default.systemSettings.findUnique({
            where: { id: "settings" },
            select: { workDayStart: true, workDayEnd: true },
        });
        const startTime = settings?.workDayStart || "09:00";
        const endTime = settings?.workDayEnd || "17:00";
        return `${formatTime(startTime)} - ${formatTime(endTime)} (Mon-Sat)`;
    }
    catch {
        return "12:00 PM - 8:00 PM (Mon-Sat)";
    }
}
function formatTime(time) {
    const [h, m] = time.split(":").map(Number);
    const period = h >= 12 ? "PM" : "AM";
    const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${displayH}:${m.toString().padStart(2, "0")} ${period}`;
}
