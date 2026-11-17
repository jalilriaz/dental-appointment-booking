"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCalendarEvent = createCalendarEvent;
exports.updateCalendarEvent = updateCalendarEvent;
exports.deleteCalendarEvent = deleteCalendarEvent;
exports.syncUpcomingAppointmentsToGoogleCalendar = syncUpcomingAppointmentsToGoogleCalendar;
const googleapis_1 = require("googleapis");
const prisma_1 = __importDefault(require("@/lib/prisma"));
/**
 * Get an authenticated Google Calendar client using the Admin's stored tokens.
 * Returns null if no admin has connected Google Calendar.
 */
async function getCalendarClient() {
    // Find admin user with Google Calendar connected
    const admin = await prisma_1.default.user.findFirst({
        where: {
            role: "ADMIN",
            googleCalendarConnected: true,
            googleCalendarToken: { not: null },
        },
    });
    if (!admin || !admin.googleCalendarToken) {
        return null;
    }
    const oauth2Client = new googleapis_1.google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.GOOGLE_REDIRECT_URI);
    try {
        const tokens = JSON.parse(admin.googleCalendarToken);
        oauth2Client.setCredentials(tokens);
        // Handle token refresh
        oauth2Client.on("tokens", async (newTokens) => {
            const updatedTokens = { ...tokens, ...newTokens };
            await prisma_1.default.user.update({
                where: { id: admin.id },
                data: {
                    googleCalendarToken: JSON.stringify(updatedTokens),
                    googleCalendarRefreshToken: newTokens.refresh_token || admin.googleCalendarRefreshToken,
                },
            });
        });
        return googleapis_1.google.calendar({ version: "v3", auth: oauth2Client });
    }
    catch (error) {
        console.error("Failed to parse Google Calendar tokens:", error);
        return null;
    }
}
async function handleGoogleCalendarError(error, context) {
    console.error(`Failed to ${context} Google Calendar event:`, error?.message || error);
    if (error?.message === "invalid_grant" || error?.response?.data?.error === "invalid_grant" || (error?.code && error.code.toString() === "400" && error?.message?.includes("invalid_grant"))) {
        try {
            await prisma_1.default.user.updateMany({
                where: { role: "ADMIN", googleCalendarConnected: true },
                data: {
                    googleCalendarConnected: false,
                    googleCalendarToken: null,
                    googleCalendarRefreshToken: null,
                },
            });
            console.log("Google Calendar disconnected due to expired token. Admin needs to re-authenticate.");
        }
        catch (dbError) {
            console.error("Failed to disconnect calendar in DB:", dbError);
        }
    }
}
/**
 * Create a Google Calendar event for an appointment.
 * Returns the Google Event ID or null if calendar is not connected.
 */
async function createCalendarEvent({ summary, description, startTime, endTime, patientName, patientPhone, }) {
    try {
        const calendar = await getCalendarClient();
        if (!calendar) {
            console.log("Google Calendar not connected — skipping event creation");
            return null;
        }
        const event = await calendar.events.insert({
            calendarId: "primary",
            requestBody: {
                summary,
                description: [
                    description || "",
                    `Patient: ${patientName}`,
                    patientPhone ? `Phone: ${patientPhone}` : "",
                ].filter(Boolean).join("\n"),
                start: {
                    dateTime: startTime.toISOString(),
                    timeZone: "Asia/Karachi",
                },
                end: {
                    dateTime: endTime.toISOString(),
                    timeZone: "Asia/Karachi",
                },
                reminders: {
                    useDefault: false,
                    overrides: [
                        { method: "popup", minutes: 30 },
                    ],
                },
            },
        });
        return event.data.id || null;
    }
    catch (error) {
        await handleGoogleCalendarError(error, "create");
        return null;
    }
}
/**
 * Update an existing Google Calendar event.
 */
async function updateCalendarEvent({ eventId, summary, description, startTime, endTime, patientName, patientPhone, }) {
    try {
        const calendar = await getCalendarClient();
        if (!calendar)
            return false;
        await calendar.events.update({
            calendarId: "primary",
            eventId,
            requestBody: {
                summary,
                description: [
                    description || "",
                    `Patient: ${patientName}`,
                    patientPhone ? `Phone: ${patientPhone}` : "",
                ].filter(Boolean).join("\n"),
                start: {
                    dateTime: startTime.toISOString(),
                    timeZone: "Asia/Karachi",
                },
                end: {
                    dateTime: endTime.toISOString(),
                    timeZone: "Asia/Karachi",
                },
            },
        });
        return true;
    }
    catch (error) {
        await handleGoogleCalendarError(error, "update");
        return false;
    }
}
/**
 * Delete a Google Calendar event.
 */
async function deleteCalendarEvent(eventId) {
    try {
        const calendar = await getCalendarClient();
        if (!calendar)
            return false;
        await calendar.events.delete({
            calendarId: "primary",
            eventId,
        });
        return true;
    }
    catch (error) {
        await handleGoogleCalendarError(error, "delete");
        return false;
    }
}
/**
 * Sync all unsynced upcoming appointments to Google Calendar.
 * Useful after freshly connecting or reconnecting Google Calendar.
 */
async function syncUpcomingAppointmentsToGoogleCalendar() {
    const calendar = await getCalendarClient();
    if (!calendar)
        return { synced: 0, failed: 0 };
    const unsynced = await prisma_1.default.appointment.findMany({
        where: {
            googleEventId: null,
            status: "SCHEDULED",
            startTime: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }, // from yesterday onwards
        },
        include: {
            treatment: true,
            patient: true,
            doctor: true,
        },
        orderBy: { startTime: "asc" },
    });
    let synced = 0;
    let failed = 0;
    for (const appt of unsynced) {
        try {
            const patientName = appt.guestName || appt.patient?.name || "Patient";
            const patientPhone = appt.guestPhone || appt.patient?.phone || undefined;
            const summary = `${appt.treatment.name} — ${patientName}${appt.sessionLabel ? ` (${appt.sessionLabel})` : ""}`;
            const description = [
                `Patient: ${patientName}`,
                `Treatment: ${appt.treatment.name}`,
                `Duration: ${appt.treatment.durationMin} min`,
                appt.doctor ? `Doctor: ${appt.doctor.name}` : "",
                appt.notes ? `Notes: ${appt.notes}` : "",
            ].filter(Boolean).join("\n");
            const googleEventId = await createCalendarEvent({
                summary,
                description,
                startTime: appt.startTime,
                endTime: appt.endTime,
                patientName,
                patientPhone,
            });
            if (googleEventId) {
                await prisma_1.default.appointment.update({
                    where: { id: appt.id },
                    data: { googleEventId },
                });
                synced++;
            }
            else {
                failed++;
            }
        }
        catch (err) {
            console.error(`[GoogleCalendar] Failed to sync appointment ${appt.id}:`, err);
            failed++;
        }
    }
    console.log(`[GoogleCalendar] Batch sync complete: ${synced} synced, ${failed} failed.`);
    return { synced, failed };
}
//# sourceMappingURL=googleCalendar.js.map