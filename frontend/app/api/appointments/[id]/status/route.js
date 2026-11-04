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
const cache_1 = require("next/cache");
// PATCH: Update appointment status (Admin/Staff only)
async function PATCH(request, { params }) {
    try {
        const cookie = (await (0, headers_1.cookies)()).get("session")?.value;
        if (!cookie)
            return server_1.NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        const session = await (0, auth_1.decrypt)(cookie);
        const role = session.role;
        if (!["ADMIN", "STAFF"].includes(role)) {
            return server_1.NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
        const { id } = await params;
        const body = await request.json();
        const { status, amountPaid, price, discount } = body;
        const validStatuses = ["SCHEDULED", "COMPLETED", "CANCELLED", "NO_SHOW", "RESCHEDULED"];
        if (!status || !validStatuses.includes(status)) {
            return server_1.NextResponse.json({ error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` }, { status: 400 });
        }
        // First, fetch the existing appointment to check its current status
        const existingAppointment = await prisma_1.default.appointment.findUnique({
            where: { id },
            select: { status: true, patientId: true, startTime: true, endTime: true }
        });
        if (!existingAppointment) {
            return server_1.NextResponse.json({ error: "Appointment not found" }, { status: 404 });
        }
        let updateData = {
            status,
            amountPaid: status === "COMPLETED" ? (amountPaid ?? 0) : 0,
            price: price !== undefined ? price : undefined,
            discount: discount !== undefined ? discount : undefined,
        };
        // 🛡️ Prevent checkout of future-dated appointments
        if (status === "COMPLETED") {
            const todayEnd = new Date();
            todayEnd.setHours(23, 59, 59, 999);
            if (existingAppointment.startTime > todayEnd) {
                return server_1.NextResponse.json({ error: "Cannot check out a future appointment. Please book a new appointment for today instead." }, { status: 400 });
            }
        }
        const appointment = await prisma_1.default.appointment.update({
            where: { id },
            data: updateData,
            include: {
                treatment: { select: { name: true, price: true } },
                patient: { select: { name: true } },
            },
        });
        // Update the patient's noShowCount based on the status change
        if (status === "NO_SHOW" && existingAppointment.status !== "NO_SHOW") {
            // Patient was just marked as a no-show, increment counter
            await prisma_1.default.user.update({
                where: { id: existingAppointment.patientId },
                data: { noShowCount: { increment: 1 } }
            });
        }
        else if (existingAppointment.status === "NO_SHOW" && status !== "NO_SHOW") {
            // Status was changed FROM no-show to something else, decrement counter to undo
            await prisma_1.default.user.update({
                where: { id: existingAppointment.patientId },
                data: { noShowCount: { decrement: 1 } }
            });
        }
        // ─── Google Calendar Sync (Background task) ────────────────────────────────
        if (appointment.googleEventId) {
            (async () => {
                try {
                    if (status === "CANCELLED" || status === "NO_SHOW") {
                        // Delete the event from Google Calendar
                        await (0, googleCalendar_1.deleteCalendarEvent)(appointment.googleEventId);
                    }
                    else if (status === "COMPLETED") {
                        // Update the event title to show it's completed
                        await (0, googleCalendar_1.updateCalendarEvent)({
                            eventId: appointment.googleEventId,
                            summary: `✅ ${appointment.treatment.name} — ${appointment.patient?.name || "Patient"} (Completed)`,
                            description: `Treatment: ${appointment.treatment.name}\nStatus: COMPLETED\nAmount Paid Today: Rs. ${(appointment.amountPaid ?? 0).toLocaleString("en-PK")}`,
                            startTime: appointment.startTime,
                            endTime: appointment.endTime,
                            patientName: appointment.patient?.name || "Patient",
                        });
                    }
                }
                catch (syncError) {
                    // Calendar sync failure should not block status update
                    console.error("Google Calendar sync error (status still updated):", syncError);
                }
            })();
        }
        (0, cache_1.revalidatePath)("/admin", "layout");
        (0, cache_1.revalidatePath)("/staff", "layout");
        return server_1.NextResponse.json({
            success: true,
            appointment,
            message: status === "COMPLETED"
                ? `Patient checked out — Rs. ${(appointment.amountPaid ?? 0).toLocaleString("en-PK")} recorded`
                : `Appointment marked as ${status}`,
        });
    }
    catch (error) {
        console.error("Update appointment status error:", error);
        return server_1.NextResponse.json({ error: "Failed to update status" }, { status: 500 });
    }
}
