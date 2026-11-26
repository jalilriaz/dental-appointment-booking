import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireActionRole } from "@/lib/auth/permissions";
import { prescriptionSchema } from "@/lib/validations/clinical-records";
import { createPrescription } from "@/lib/services/prescriptions";

// Required role: ADMIN or STAFF (view & print)
export async function GET(req: Request) {
    const auth = await requireActionRole(["ADMIN", "STAFF"]);
    if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const patientId = new URL(req.url).searchParams.get("patientId");
    const prescriptions = await prisma.prescription.findMany({
        where: patientId ? { patientId } : undefined,
        include: { prescribedBy: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
        take: 100,
    });
    return NextResponse.json({ prescriptions });
}

// Required role: ADMIN only (STAFF receives 403)
export async function POST(req: Request) {
    const auth = await requireActionRole(["ADMIN"]);
    if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

    try {
        const body = await req.json();
        const parsed = prescriptionSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { error: parsed.error.issues[0]?.message || "Invalid prescription payload." },
                { status: 400 }
            );
        }
        const res = await createPrescription(parsed.data, auth.user.id);
        if (!res.success) {
            return NextResponse.json({ error: res.error, warnings: res.warnings }, { status: res.status });
        }
        return NextResponse.json(res, { status: 201 });
    } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to create prescription";
        return NextResponse.json({ error: msg }, { status: 400 });
    }
}
