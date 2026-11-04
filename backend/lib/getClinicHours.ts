import prisma from "@/lib/prisma";

/**
 * Fetch clinic working hours from the database and return a formatted string.
 * Falls back to the hardcoded default if no settings are saved yet.
 */
export async function getClinicHours(): Promise<string> {
    try {
        const settings = await prisma.systemSettings.findUnique({
            where: { id: "settings" },
            select: { workDayStart: true, workDayEnd: true },
        });

        const startTime = settings?.workDayStart || "09:00";
        const endTime = settings?.workDayEnd || "17:00";

        return `${formatTime(startTime)} - ${formatTime(endTime)} (Mon-Sat)`;
    } catch {
        return "12:00 PM - 8:00 PM (Mon-Sat)";
    }
}

function formatTime(time: string): string {
    const [h, m] = time.split(":").map(Number);
    const period = h >= 12 ? "PM" : "AM";
    const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${displayH}:${m.toString().padStart(2, "0")} ${period}`;
}
