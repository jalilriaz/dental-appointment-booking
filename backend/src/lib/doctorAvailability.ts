import prisma from "./prisma";
import { getKarachiDayBoundaries } from "./timezone";

export async function checkDoctorAvailability(
    dateStr: string,
    doctorId?: string | null
): Promise<{ available: boolean; reason?: string }> {
    const doctor = doctorId
        ? await prisma.doctor.findUnique({ where: { id: doctorId } })
        : await prisma.doctor.findFirst({ orderBy: [{ isLead: "desc" }, { createdAt: "asc" }] });

    if (!doctor || !doctor.isActive) {
        return {
            available: false,
            reason: "The attending doctor is currently unavailable for appointments.",
        };
    }

    if (doctor.unavailableFrom && doctor.unavailableTo) {
        const { startOfDay, endOfDay } = getKarachiDayBoundaries(dateStr);
        if (doctor.unavailableFrom <= endOfDay && doctor.unavailableTo >= startOfDay) {
            return {
                available: false,
                reason: doctor.unavailableReason || "Doctor is on scheduled leave on this date.",
            };
        }
    }

    return { available: true };
}
