import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireActionRole } from "@/lib/auth/permissions";
import { patientFileTypeEnum } from "@/lib/validations/clinical-records";
import { savePatientFile } from "@/lib/services/secureFiles";

// Required role: ADMIN
export async function GET(req: Request) {
    const auth = await requireActionRole(["ADMIN"]);
    if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const patientId = new URL(req.url).searchParams.get("patientId");
    const files = await prisma.patientFile.findMany({
        where: { deletedAt: null, ...(patientId ? { patientId } : {}) },
        include: { uploadedBy: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
        take: 100,
    });
    return NextResponse.json({ files });
}

// Required role: ADMIN
export async function POST(req: Request) {
    const auth = await requireActionRole(["ADMIN"]);
    if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

    try {
        const form = await req.formData();
        const file = form.get("file");
        const patientId = String(form.get("patientId") || "");
        const title = String(form.get("title") || "").trim();
        const rawType = String(form.get("fileType") || "DOCUMENT");
        const notes = String(form.get("notes") || "").trim() || null;

        if (!(file instanceof File)) {
            return NextResponse.json({ error: "File is required." }, { status: 400 });
        }
        const typeParse = patientFileTypeEnum.safeParse(rawType);
        if (!typeParse.success || !patientId || title.length < 2) {
            return NextResponse.json({ error: "Patient, valid file type, and title are required." }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const record = await savePatientFile({
            buffer,
            patientId,
            fileType: typeParse.data,
            title,
            notes,
            actorUserId: auth.user.id,
        });
        return NextResponse.json({ file: record }, { status: 201 });
    } catch (err) {
        const msg = err instanceof Error ? err.message : "Upload failed";
        return NextResponse.json({ error: msg }, { status: 400 });
    }
}
