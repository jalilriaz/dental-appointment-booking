import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireActionRole } from "@/lib/auth/permissions";

// Required role: ADMIN
export async function GET(req: Request) {
    const auth = await requireActionRole(["ADMIN"]);
    if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const channel = searchParams.get("channel");

    const logs = await prisma.notificationLog.findMany({
        where: {
            ...(status && status !== "ALL" ? { status: status as "SENT" | "FAILED" | "SKIPPED" | "PENDING" } : {}),
            ...(channel && channel !== "ALL" ? { channel: channel as "WHATSAPP" | "EMAIL" | "SMS" } : {}),
        },
        include: {
            patient: { select: { id: true, name: true } },
            appointment: { select: { id: true, startTime: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 200,
    });

    return NextResponse.json({ logs });
}
