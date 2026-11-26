import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireActionRole } from "@/lib/auth/permissions";
import { consentFormSchema } from "@/lib/validations/clinical-records";
import { createConsentForm } from "@/lib/services/clinicalMedia";

// Required role: ADMIN or STAFF
export async function GET(req: Request) {
    const auth = await requireActionRole(["ADMIN", "STAFF"]);
    if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const patientId = new URL(req.url).searchParams.get("patientId");
    const consents = await prisma.consentForm.findMany({
        where: patientId ? { patientId } : undefined,
        include: { createdBy: { select: { name: true } } },
        orderBy: [{ createdAt: "desc" }],
        take: 100,
    });
    return NextResponse.json({ consents });
}

// Required role: ADMIN or STAFF (signed consents are immutable; supersede creates version + 1)
export async function POST(req: Request) {
    const auth = await requireActionRole(["ADMIN", "STAFF"]);
    if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

    try {
        const body = await req.json();
        const parsed = consentFormSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { error: parsed.error.issues[0]?.message || "Invalid consent form payload." },
                { status: 400 }
            );
        }
        const consent = await createConsentForm(parsed.data, auth.user.id);
        return NextResponse.json({ consent }, { status: 201 });
    } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to save consent";
        return NextResponse.json({ error: msg }, { status: 400 });
    }
}
