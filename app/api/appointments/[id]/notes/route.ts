import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/auth";
import { revalidatePath } from "next/cache";

// GET: Fetch clinical note for an appointment
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const cookie = (await cookies()).get("session")?.value;
        if (!cookie) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const session = await decrypt(cookie);
        const role = session.role as string;
        if (!["ADMIN", "STAFF"].includes(role)) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const { id } = await params;

        const notes = await prisma.clinicalNote.findMany({
            where: { appointmentId: id },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({ notes });
    } catch (error) {
        console.error("Fetch clinical notes error:", error);
        return NextResponse.json({ error: "Failed to fetch notes" }, { status: 500 });
    }
}

// POST: Create or update clinical note (ADMIN only — doctor writes notes)
export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const cookie = (await cookies()).get("session")?.value;
        if (!cookie) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const session = await decrypt(cookie);
        const role = session.role as string;

        if (role !== "ADMIN") {
            return NextResponse.json(
                { error: "Only the doctor (Admin) can write clinical notes" },
                { status: 403 }
            );
        }

        const { id } = await params;
        const body = await request.json();
        const { diagnosis, treatmentDone, prescription, remarks, odontogramData, noteId } = body;

        if (!treatmentDone) {
            return NextResponse.json(
                { error: "Treatment done is required" },
                { status: 400 }
            );
        }

        // Verify the appointment exists
        const appointment = await prisma.appointment.findUnique({
            where: { id },
        });

        if (!appointment) {
            return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
        }

        let note;

        if (noteId) {
            // Update existing note
            note = await prisma.clinicalNote.update({
                where: { id: noteId },
                data: {
                    diagnosis: diagnosis || null,
                    treatmentDone,
                    prescription: prescription || null,
                    remarks: remarks || null,
                    odontogramData: odontogramData !== undefined ? odontogramData : undefined,
                },
            });
        } else {
            // Create new note
            note = await prisma.clinicalNote.create({
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

        revalidatePath("/admin", "layout");
        revalidatePath("/staff", "layout");

        return NextResponse.json({ success: true, note });
    } catch (error) {
        console.error("Save clinical note error:", error);
        return NextResponse.json({ error: "Failed to save note" }, { status: 500 });
    }
}
