import { google } from "googleapis";
import prisma from "@/lib/prisma";

/**
 * Get an authenticated Google Calendar client using the Admin's stored tokens.
 * Returns null if no admin has connected Google Calendar.
 */
async function getCalendarClient() {
    // Find admin user with Google Calendar connected
    const admin = await prisma.user.findFirst({
        where: {
            role: "ADMIN",
            googleCalendarConnected: true,
            googleCalendarToken: { not: null },
        },
    });

    if (!admin || !admin.googleCalendarToken) {
        return null;
    }

    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
    );

    try {
        const tokens = JSON.parse(admin.googleCalendarToken);
        oauth2Client.setCredentials(tokens);

        // Handle token refresh
        oauth2Client.on("tokens", async (newTokens) => {
            const updatedTokens = { ...tokens, ...newTokens };
            await prisma.user.update({
                where: { id: admin.id },
                data: {
                    googleCalendarToken: JSON.stringify(updatedTokens),
                    googleCalendarRefreshToken: newTokens.refresh_token || admin.googleCalendarRefreshToken,
                },
            });
        });

        return google.calendar({ version: "v3", auth: oauth2Client });
    } catch (error) {
        console.error("Failed to parse Google Calendar tokens:", error);
        return null;
    }
}

async function handleGoogleCalendarError(error: any, context: string) {
    console.error(`Failed to ${context} Google Calendar event:`, error?.message || error);
    if (error?.message === "invalid_grant" || error?.response?.data?.error === "invalid_grant" || (error?.code && error.code.toString() === "400" && error?.message?.includes("invalid_grant"))) {
        try {
            await prisma.user.updateMany({
                where: { role: "ADMIN", googleCalendarConnected: true },
                data: {
                    googleCalendarConnected: false,
                    googleCalendarToken: null,
                    googleCalendarRefreshToken: null,
                },
            });
            console.log("Google Calendar disconnected due to expired token. Admin needs to re-authenticate.");
        } catch (dbError) {
            console.error("Failed to disconnect calendar in DB:", dbError);
        }
    }
}

/**
 * Create a Google Calendar event for an appointment.
 * Returns the Google Event ID or null if calendar is not connected.
 */
export async function createCalendarEvent({
    summary,
    description,
    startTime,
    endTime,
    patientName,
    patientPhone,
}: {
    summary: string;
    description?: string;
    startTime: Date;
    endTime: Date;
    patientName: string;
    patientPhone?: string;
}): Promise<string | null> {
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
    } catch (error) {
        await handleGoogleCalendarError(error, "create");
        return null;
    }
}

/**
 * Update an existing Google Calendar event.
 */
export async function updateCalendarEvent({
    eventId,
    summary,
    description,
    startTime,
    endTime,
    patientName,
    patientPhone,
}: {
    eventId: string;
    summary: string;
    description?: string;
    startTime: Date;
    endTime: Date;
    patientName: string;
    patientPhone?: string;
}): Promise<boolean> {
    try {
        const calendar = await getCalendarClient();
        if (!calendar) return false;

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
    } catch (error) {
        await handleGoogleCalendarError(error, "update");
        return false;
    }
}

/**
 * Delete a Google Calendar event.
 */
export async function deleteCalendarEvent(eventId: string): Promise<boolean> {
    try {
        const calendar = await getCalendarClient();
        if (!calendar) return false;

        await calendar.events.delete({
            calendarId: "primary",
            eventId,
        });

        return true;
    } catch (error) {
        await handleGoogleCalendarError(error, "delete");
        return false;
    }
}

/**
 * Sync all unsynced upcoming appointments to Google Calendar.
 * Useful after freshly connecting or reconnecting Google Calendar.
 */
export async function syncUpcomingAppointmentsToGoogleCalendar(): Promise<{ synced: number; failed: number }> {
    const calendar = await getCalendarClient();
    if (!calendar) return { synced: 0, failed: 0 };

    const unsynced = await prisma.appointment.findMany({
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
                await prisma.appointment.update({
                    where: { id: appt.id },
                    data: { googleEventId },
                });
                synced++;
            } else {
                failed++;
            }
        } catch (err) {
            console.error(`[GoogleCalendar] Failed to sync appointment ${appt.id}:`, err);
            failed++;
        }
    }

    console.log(`[GoogleCalendar] Batch sync complete: ${synced} synced, ${failed} failed.`);
    return { synced, failed };
}
