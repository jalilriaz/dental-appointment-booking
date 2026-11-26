import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireActionRole } from "@/lib/auth/permissions";
import { beforeAfterToggleSchema } from "@/lib/validations/clinical-records";
import { createBeforeAfterRecord, updateBeforeAfterVisibility } from "@/lib/services/clinicalMedia";

// Required role: ADMIN
export async function GET(req: Request) {
    const auth = await requireActionRole(["ADMIN"]);
    if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const patientId = new URL(req.url).searchParams.get("patientId");
    const photos = await prisma.beforeAfterPhoto.findMany({
        where: patientId ? { patientId } : undefined,
        include: { treatment: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
        take: 100,
    });
    return NextResponse.json({ photos });
}

// Required role: ADMIN (uploads default to hasConsent=false, showOnWeb=false)
export async function POST(req: Request) {
    const auth = await requireActionRole(["ADMIN"]);
    if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

    try {
        const form = await req.formData();
        const before = form.get("beforeFile");
        const after = form.get("afterFile");
        const patientId = String(form.get("patientId") || "");
        const title = String(form.get("title") || "").trim();
        const treatmentId = String(form.get("treatmentId") || "").trim() || null;
        const notes = String(form.get("notes") || "").trim() || null;

        if (!(before instanceof File) || !(after instanceof File) || !patientId || title.length < 2) {
            return NextResponse.json({ error: "Title, patient, before image, and after image are required." }, { status: 400 });
        }
        const photo = await createBeforeAfterRecord({
            patientId,
            treatmentId,
            title,
            notes,
            beforeBuffer: Buffer.from(await before.arrayBuffer()),
            afterBuffer: Buffer.from(await after.arrayBuffer()),
            actorUserId: auth.user.id,
        });
        return NextResponse.json({ photo }, { status: 201 });
    } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to save before/after photos";
        return NextResponse.json({ error: msg }, { status: 400 });
    }
}

// Required role: ADMIN (withdrawing consent forces showOnWeb=false)
export async function PATCH(req: Request) {
    const auth = await requireActionRole(["ADMIN"]);
    if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

    try {
        const body = await req.json();
        const parsed = beforeAfterToggleSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: "Invalid update payload." }, { status: 400 });
        }
        const photo = await updateBeforeAfterVisibility({ ...parsed.data, actorUserId: auth.user.id });
        return NextResponse.json({ photo });
    } catch (err) {
        const msg = err instanceof Error ? err.message : "Update failed";
        return NextResponse.json({ error: msg }, { status: 400 });
    }
}
