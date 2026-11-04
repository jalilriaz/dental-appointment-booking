"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PATCH = PATCH;
const server_1 = require("next/server");
const prisma_1 = __importDefault(require("@/lib/prisma"));
const headers_1 = require("next/headers");
const auth_1 = require("@/lib/auth");
const googleCalendar_1 = require("@/lib/googleCalendar");
const email_1 = require("@/lib/email");
const cache_1 = require("next/cache");
async function PATCH(request, { params }) {
    try {
        // 1. Auth check — ADMIN or STAFF only
        const cookie = (await (0, headers_1.cookies)()).get("session")?.value;
        if (!cookie)
            return server_1.NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        const session = await (0, auth_1.decrypt)(cookie);
        const role = session.role;
        if (!["ADMIN", "STAFF"].includes(role)) {
            return server_1.NextResponse.json({ error: "Only Admin or Staff can reschedule appointments" }, { status: 403 });
        }
        const { id } = await params;
        const body = await request.json();
        const { date, time, cancel } = body;
        // 2. Get existing appointment with treatment info
        const existingApt = await prisma_1.default.appointment.findUnique({
            where: { id },
            include: {
                treatment: { select: { id: true, name: true, durationMin: true } },
                patient: { select: { name: true, phone: true, email: true } }
            },
        });
        if (!existingApt) {
            return server_1.NextResponse.json({ error: "Appointment not found" }, { status: 404 });
        }
        // ─── Case A: Cancellation ───────────────────────────────────
        if (cancel === true) {
            const updatedApt = await prisma_1.default.appointment.update({
                where: { id },
                data: { status: "CANCELLED" },
                include: {
                    treatment: { select: { name: true } },
                    patient: { select: { name: true } },
                }
            });
            // Sync with Google Calendar (Delete event in background)
            if (updatedApt.googleEventId) {
                (async () => {
                    try {
                        await (0, googleCalendar_1.deleteCalendarEvent)(updatedApt.googleEventId);
                    }
                    catch (syncError) {
                        console.error("Google Calendar delete error (appointment cancelled):", syncError);
                    }
                })();
            }
            (0, cache_1.revalidatePath)("/admin", "layout");
            (0, cache_1.revalidatePath)("/staff", "layout");
            return server_1.NextResponse.json({
                success: true,
                appointment: updatedApt,
                message: "Appointment cancelled successfully",
            });
        }
        // ─── Case B: Reschedule ─────────────────────────────────────
        if (!date || !time) {
            return server_1.NextResponse.json({ error: "Date and time are required for rescheduling" }, { status: 400 });
        }
        // Validate date — no past dates, no Sundays
        const selectedDate = new Date(date);
        const todaySearch = new Date();
        todaySearch.setHours(0, 0, 0, 0);
        if (selectedDate < todaySearch) {
            return server_1.NextResponse.json({ error: "Cannot reschedule to a past date" }, { status: 400 });
        }
        if (selectedDate.getDay() === 0) {
            return server_1.NextResponse.json({ error: "Sunday is a clinic off day. Please select another date." }, { status: 400 });
        }
        if (existingApt.status === "CANCELLED") {
            return server_1.NextResponse.json({ error: "Cannot reschedule a cancelled appointment" }, { status: 400 });
        }
        // Calculate new start/end times
        const [timeH, timeM] = time.split(":").map(Number);
        const newStartTime = new Date(date);
        newStartTime.setHours(timeH, timeM, 0, 0);
        const newEndTime = new Date(newStartTime);
        newEndTime.setMinutes(newEndTime.getMinutes() + existingApt.treatment.durationMin);
        // Check for conflicts (excluding the current appointment)
        const conflict = await prisma_1.default.appointment.findFirst({
            where: {
                id: { not: id },
                status: { notIn: ["CANCELLED"] },
                AND: [
                    { startTime: { lt: newEndTime } },
                    { endTime: { gt: newStartTime } },
                ],
            },
        });
        if (conflict) {
            return server_1.NextResponse.json({ error: "This time slot is no longer available. Please select another time.", code: "DOUBLE_BOOKING" }, { status: 409 });
        }
        // Update appointment
        const updatedApt = await prisma_1.default.appointment.update({
            where: { id },
            data: {
                startTime: newStartTime,
                endTime: newEndTime,
                status: "RESCHEDULED",
            },
            include: {
                treatment: { select: { name: true, durationMin: true } },
                patient: { select: { name: true, phone: true, email: true } },
            },
        });
        // Google Calendar sync — Update OR Create if missing (background task)
        (async () => {
            try {
                if (updatedApt.googleEventId) {
                    await (0, googleCalendar_1.updateCalendarEvent)({
                        eventId: updatedApt.googleEventId,
                        summary: `${updatedApt.treatment.name} — ${updatedApt.patient.name} (Rescheduled)`,
                        description: `Treatment: ${updatedApt.treatment.name}\nDuration: ${updatedApt.treatment.durationMin} min\nStatus: RESCHEDULED`,
                        startTime: newStartTime,
                        endTime: newEndTime,
                        patientName: updatedApt.patient.name || "Patient",
                    });
                }
                else {
                    // Self-healing: Create a new event if it didn't exist
                    const newEventId = await (0, googleCalendar_1.createCalendarEvent)({
                        summary: `${updatedApt.treatment.name} — ${updatedApt.patient.name} (Rescheduled)`,
                        description: `Treatment: ${updatedApt.treatment.name}\nDuration: ${updatedApt.treatment.durationMin} min\nStatus: RESCHEDULED`,
                        startTime: newStartTime,
                        endTime: newEndTime,
                        patientName: updatedApt.patient.name || "Patient",
                    });
                    if (newEventId) {
                        await prisma_1.default.appointment.update({
                            where: { id: updatedApt.id },
                            data: { googleEventId: newEventId }
                        });
                    }
                }
            }
            catch (syncError) {
                console.error("Google Calendar sync error (action still saved):", syncError);
            }
        })();
        // Send Email notification
        const emailToNotify = updatedApt.patient.email;
        if (emailToNotify) {
            const formattedDate = newStartTime.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
            const formattedTime = newStartTime.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
            (0, email_1.sendAppointmentRescheduleEmail)(emailToNotify, updatedApt.patient.name, updatedApt.treatment.name, formattedDate, formattedTime).catch((err) => console.error("Failed to send reschedule email:", err));
        }
        (0, cache_1.revalidatePath)("/admin", "layout");
        (0, cache_1.revalidatePath)("/staff", "layout");
        return server_1.NextResponse.json({
            success: true,
            appointment: updatedApt,
            message: `Appointment rescheduled to ${newStartTime.toLocaleDateString()} at ${newStartTime.toLocaleTimeString()}`,
        });
    }
    catch (error) {
        console.error("Reschedule appointment error:", error);
        return server_1.NextResponse.json({ error: error instanceof Error ? error.message : "Failed to process appointment update" }, { status: 500 });
    }
}
