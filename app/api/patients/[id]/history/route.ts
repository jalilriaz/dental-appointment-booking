import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/auth";

// GET: Fetch complete patient history (all appointments + clinical notes)
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

        const patient = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
            },
        });

        if (!patient) {
            return NextResponse.json({ error: "Patient not found" }, { status: 404 });
        }

        const appointments = await prisma.appointment.findMany({
            where: { patientId: id },
            include: {
                treatment: { select: { name: true, price: true, durationMin: true } },
                clinicalNotes: {
                    orderBy: { createdAt: "desc" },
                },
            },
            orderBy: { startTime: "desc" },
        });

        return NextResponse.json({ patient, appointments });
    } catch (error) {
        console.error("Fetch patient history error:", error);
        return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 });
    }
}
