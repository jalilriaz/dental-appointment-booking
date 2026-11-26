import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireActionRole } from "@/lib/auth/permissions";
import { refundSchema } from "@/lib/validations/billing";
import { issueRefund } from "@/lib/services/refunds";

// Required role: ADMIN
export async function GET() {
    const auth = await requireActionRole(["ADMIN"]);
    if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const refunds = await prisma.payment.findMany({
        where: { type: "REFUND" },
        include: {
            patientTreatment: {
                select: {
                    patient: { select: { id: true, name: true, phone: true } },
                    treatment: { select: { name: true } },
                },
            },
            recordedBy: { select: { name: true } },
        },
        orderBy: { date: "desc" },
        take: 100,
    });
    return NextResponse.json({ refunds });
}

// Required role: ADMIN
export async function POST(req: Request) {
    const auth = await requireActionRole(["ADMIN"]);
    if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

    try {
        const body = await req.json();
        const parsed = refundSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { error: parsed.error.issues[0]?.message || "Invalid refund payload." },
                { status: 400 }
            );
        }
        const res = await issueRefund({ ...parsed.data, actorUserId: auth.user.id });
        if (!res.success) {
            return NextResponse.json({ error: res.error }, { status: res.status });
        }
        return NextResponse.json(res, { status: 201 });
    } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to issue refund";
        const code = msg.includes("closed and locked") ? 409 : 500;
        return NextResponse.json({ error: msg }, { status: code });
    }
}
