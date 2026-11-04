"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSlotAvailability = validateSlotAvailability;
const prisma_1 = __importDefault(require("@/lib/prisma"));
/**
 * Validates if a time slot is available for a requested appointment.
 * Single-doctor clinic — no staffId needed.
 * @param startTime The start time of the requested appointment.
 * @param endTime The end time of the requested appointment.
 * @param excludeAppointmentId Optional appointment ID to exclude (for rescheduling).
 * @returns boolean - True if available, False if double-booked.
 */
async function validateSlotAvailability(startTime, endTime, excludeAppointmentId) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where = {
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
    const conflictingAppointment = await prisma_1.default.appointment.findFirst({ where });
    return !conflictingAppointment;
}
