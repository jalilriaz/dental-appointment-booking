import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/auth";
import { z } from "zod";
import { logger } from "@/lib/logger";

const updatePatientSchema = z.object({
    medicalAlerts: z.string().max(1000).optional().nullable(),
});

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const cookie = (await cookies()).get("session")?.value;
        if (!cookie) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const session = await decrypt(cookie);
        const { id } = await params;

        if (session.role !== "ADMIN" && session.role !== "STAFF") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const patient = await prisma.user.findUnique({
            where: { id },
            include: {
                appointments: {
                    include: {
                        treatment: { select: { name: true, price: true, durationMin: true } },
                    },
                    orderBy: { startTime: "desc" },
                },
                _count: { select: { appointments: true } },
            },
        });

        if (!patient) {
            return NextResponse.json({ error: "Patient not found" }, { status: 404 });
        }

        return NextResponse.json({ patient });
    } catch (error) {
        console.error("Fetch patient details error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// PATCH: Update patient details (Admin only)
export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const cookie = (await cookies()).get("session")?.value;
        if (!cookie) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const session = await decrypt(cookie);
        if (session.role !== "ADMIN") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const { id } = await params;
        const body = await request.json();
        
        const parseResult = updatePatientSchema.safeParse(body);
        if (!parseResult.success) {
            return NextResponse.json({ error: "Invalid data format or length" }, { status: 400 });
        }

        const { medicalAlerts } = parseResult.data;

        const patient = await prisma.user.update({
            where: { id },
            data: {
                medicalAlerts: medicalAlerts !== undefined ? (medicalAlerts || null) : undefined,
            },
            select: { id: true, medicalAlerts: true },
        });

        if (medicalAlerts !== undefined) {
             logger.info({ adminId: session.id, patientId: id, action: "update_medical_alerts" }, "Admin updated patient medical alerts");
        }

        return NextResponse.json({ success: true, patient });
    } catch (error) {
        console.error("Update patient error:", error);
        return NextResponse.json({ error: "Failed to update patient" }, { status: 500 });
    }
}
