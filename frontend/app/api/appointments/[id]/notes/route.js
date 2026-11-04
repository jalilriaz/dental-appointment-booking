"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
exports.POST = POST;
const server_1 = require("next/server");
const prisma_1 = __importDefault(require("@/lib/prisma"));
const headers_1 = require("next/headers");
const auth_1 = require("@/lib/auth");
const cache_1 = require("next/cache");
// GET: Fetch clinical note for an appointment
async function GET(request, { params }) {
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
        const notes = await prisma_1.default.clinicalNote.findMany({
            where: { appointmentId: id },
            orderBy: { createdAt: "desc" },
        });
        return server_1.NextResponse.json({ notes });
    }
    catch (error) {
        console.error("Fetch clinical notes error:", error);
        return server_1.NextResponse.json({ error: "Failed to fetch notes" }, { status: 500 });
    }
}
// POST: Create or update clinical note (ADMIN only — doctor writes notes)
async function POST(request, { params }) {
    try {
        const cookie = (await (0, headers_1.cookies)()).get("session")?.value;
        if (!cookie)
            return server_1.NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        const session = await (0, auth_1.decrypt)(cookie);
        const role = session.role;
        if (role !== "ADMIN") {
            return server_1.NextResponse.json({ error: "Only the doctor (Admin) can write clinical notes" }, { status: 403 });
        }
        const { id } = await params;
        const body = await request.json();
        const { diagnosis, treatmentDone, prescription, remarks, odontogramData, noteId } = body;
        if (!treatmentDone) {
            return server_1.NextResponse.json({ error: "Treatment done is required" }, { status: 400 });
        }
        // Verify the appointment exists
        const appointment = await prisma_1.default.appointment.findUnique({
            where: { id },
        });
        if (!appointment) {
            return server_1.NextResponse.json({ error: "Appointment not found" }, { status: 404 });
        }
        let note;
        if (noteId) {
            // Update existing note
            note = await prisma_1.default.clinicalNote.update({
                where: { id: noteId },
                data: {
                    diagnosis: diagnosis || null,
                    treatmentDone,
                    prescription: prescription || null,
                    remarks: remarks || null,
                    odontogramData: odontogramData !== undefined ? odontogramData : undefined,
                },
            });
        }
        else {
            // Create new note
            note = await prisma_1.default.clinicalNote.create({
                data: {
                    appointmentId: id,
                    diagnosis: diagnosis || null,
                    treatmentDone,
                    prescription: prescription || null,
                    remarks: remarks || null,
                    odontogramData: odontogramData || null,
                },
            });
        }
        (0, cache_1.revalidatePath)("/admin", "layout");
        (0, cache_1.revalidatePath)("/staff", "layout");
        return server_1.NextResponse.json({ success: true, note });
    }
    catch (error) {
        console.error("Save clinical note error:", error);
        return server_1.NextResponse.json({ error: "Failed to save note" }, { status: 500 });
    }
}
