import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/auth";

export async function GET() {
    try {
        const cookie = (await cookies()).get("session")?.value;
        if (!cookie) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const session = await decrypt(cookie);
        const role = session.role as string;

        if (!["ADMIN", "STAFF"].includes(role)) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
        const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

        const appointments = await prisma.appointment.findMany({
            where: {
                startTime: { gte: todayStart, lte: todayEnd },
                status: { not: "CANCELLED" },
            },
            include: {
                patient: {
                    select: {
                        id: true,
                        name: true,
                        phone: true,
                        medicalAlerts: true,
                        appointments: {
                            where: { status: "NO_SHOW" },
                            select: { id: true },
                        },
                    },
                },
                treatment: {
                    select: { name: true, durationMin: true, price: true },
                },
            },
            orderBy: { startTime: "asc" },
        });

        const serialized = appointments.map((a) => ({
            id: a.id,
            startTime: a.startTime.toISOString(),
            endTime: a.endTime.toISOString(),
            status: a.status,
            amountPaid: a.amountPaid ?? 0,
            price: a.price ?? a.treatment.price,
            discount: a.discount ?? 0,
            patient: a.patient
                ? {
                      id: a.patient.id,
                      name: a.patient.name,
                      phone: a.patient.phone,
                      medicalAlerts: a.patient.medicalAlerts,
                      noShowCount: a.patient.appointments.length,
                  }
                : null,
            treatment: a.treatment,
        }));

        return NextResponse.json({ appointments: serialized });
    } catch (error) {
        console.error("Today appointments fetch error:", error);
        return NextResponse.json({ error: "Failed to fetch today's appointments" }, { status: 500 });
    }
}
