import prisma from "@/lib/prisma";

/**
 * Validates if a time slot is available for a requested appointment.
 * Single-doctor clinic — no staffId needed.
 * @param startTime The start time of the requested appointment.
 * @param endTime The end time of the requested appointment.
 * @param excludeAppointmentId Optional appointment ID to exclude (for rescheduling).
 * @returns boolean - True if available, False if double-booked.
 */
export async function validateSlotAvailability(
    startTime: Date,
    endTime: Date,
    excludeAppointmentId?: string
): Promise<boolean> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {
        status: {
            notIn: ["CANCELLED"],
        },
        OR: [
            // Case 1: New appointment starts during an existing one
            {
                startTime: { lte: startTime },
                endTime: { gt: startTime },
            },
            // Case 2: New appointment ends during an existing one
            {
                startTime: { lt: endTime },
                endTime: { gte: endTime },
            },
            // Case 3: New appointment completely overlaps an existing one
            {
                startTime: { gte: startTime },
                endTime: { lte: endTime },
            },
        ],
    };

    if (excludeAppointmentId) {
        where.id = { not: excludeAppointmentId };
    }

    const conflictingAppointment = await prisma.appointment.findFirst({ where });

    return !conflictingAppointment;
}
