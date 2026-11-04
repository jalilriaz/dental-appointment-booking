"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.expirePastAppointments = expirePastAppointments;
const prisma_1 = __importDefault(require("@/lib/prisma"));
const googleCalendar_1 = require("@/lib/googleCalendar");
const cache_1 = require("next/cache");
/**
 * Automatically marks passed appointments that were not attended as NO_SHOW (Missed).
 * - Appointments from previous days (before today 00:00) that are still SCHEDULED or RESCHEDULED are marked as NO_SHOW.
 * - Appointments from today are marked as NO_SHOW once the clinic day has concluded (after 21:00 / 9:00 PM or at midnight).
 * - Increments patient's noShowCount.
 * - Cleans up Google Calendar events in the background.
 */
async function expirePastAppointments() {
    try {
        const now = new Date();
        const startOfToday = new Date(now);
        startOfToday.setHours(0, 0, 0, 0);
        // After 21:00 (9:00 PM clinic closing) or at midnight, today's passed slots can also be expired.
        // Before 21:00, only appointments strictly from previous days are expired to give same-day patients time.
        const cutoffTime = now.getHours() >= 21 ? now : startOfToday;
        // Find candidate appointments
        const overdueAppointments = await prisma_1.default.appointment.findMany({
            where: {
                status: {
                    in: ["SCHEDULED", "RESCHEDULED"],
                },
                startTime: {
                    lt: cutoffTime,
                },
            },
            select: {
                id: true,
                patientId: true,
                googleEventId: true,
            },
        });
        if (overdueAppointments.length === 0) {
            return { updatedCount: 0, updatedIds: [] };
        }
        const appointmentIds = overdueAppointments.map((a) => a.id);
        const patientIdCountMap = new Map();
        overdueAppointments.forEach((a) => {
            if (a.patientId) {
                patientIdCountMap.set(a.patientId, (patientIdCountMap.get(a.patientId) || 0) + 1);
            }
        });
        // 1. Batch update appointment statuses to NO_SHOW
        await prisma_1.default.appointment.updateMany({
            where: {
                id: { in: appointmentIds },
            },
            data: {
                status: "NO_SHOW",
            },
        });
        // 2. Increment noShowCount for affected patients
        for (const [patientId, count] of patientIdCountMap.entries()) {
            try {
                await prisma_1.default.user.update({
                    where: { id: patientId },
                    data: {
                        noShowCount: { increment: count },
                    },
                });
            }
            catch (userErr) {
                console.error(`Failed to increment noShowCount for user ${patientId}:`, userErr);
            }
        }
        // 3. Remove events from Google Calendar in the background
        const googleEventIds = overdueAppointments
            .map((a) => a.googleEventId)
            .filter((id) => Boolean(id));
        if (googleEventIds.length > 0) {
            (async () => {
                for (const gId of googleEventIds) {
                    try {
                        await (0, googleCalendar_1.deleteCalendarEvent)(gId);
                    }
                    catch (calErr) {
                        // Suppress background sync errors
                    }
                }
            })();
        }
        try {
            (0, cache_1.revalidatePath)("/admin", "layout");
            (0, cache_1.revalidatePath)("/staff", "layout");
        }
        catch {
            // Ignore if called outside request context
        }
        return {
            updatedCount: appointmentIds.length,
            updatedIds: appointmentIds,
        };
    }
    catch (err) {
        console.error("Error expiring past appointments:", err);
        return { updatedCount: 0, updatedIds: [] };
    }
}
