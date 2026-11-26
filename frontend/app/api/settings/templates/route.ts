import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { logFrontendAudit } from "@/lib/audit";
import { requireActionRole } from "@/lib/auth/permissions";
import { templateUpdateSchema } from "@/lib/validations/operations";
import { findInvalidPlaceholders, mergeSavedTemplates } from "@/lib/services/messageTemplates";

// Required role: ADMIN or STAFF (read templates)
export async function GET() {
    const auth = await requireActionRole(["ADMIN", "STAFF"]);
    if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const settings = await prisma.systemSettings.findUnique({
        where: { id: "settings" },
        select: { messageTemplates: true },
    });
    return NextResponse.json({ templates: mergeSavedTemplates(settings?.messageTemplates) });
}

// Required role: ADMIN (validates whitelisted placeholders only)
export async function PUT(req: Request) {
    const auth = await requireActionRole(["ADMIN"]);
    if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

    try {
        const body = await req.json();
        const parsed = templateUpdateSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { error: parsed.error.issues[0]?.message || "Invalid template input." },
                { status: 400 }
            );
        }

        const invalid = Array.from(new Set([
            ...findInvalidPlaceholders(parsed.data.whatsappBody),
            ...findInvalidPlaceholders(parsed.data.emailSubject),
            ...findInvalidPlaceholders(parsed.data.emailBody),
        ]));
        if (invalid.length > 0) {
            return NextResponse.json(
                { error: `Unknown placeholder(s): ${invalid.join(", ")}. Allowed: patient_name, date, time, treatment, clinic_phone.` },
                { status: 400 }
            );
        }

        const current = await prisma.systemSettings.findUnique({
            where: { id: "settings" },
            select: { messageTemplates: true },
        });
        const merged = mergeSavedTemplates(current?.messageTemplates);
        merged[parsed.data.key] = {
            ...merged[parsed.data.key],
            whatsappBody: parsed.data.whatsappBody,
            emailSubject: parsed.data.emailSubject,
            emailBody: parsed.data.emailBody,
        };

        await prisma.systemSettings.update({
            where: { id: "settings" },
            data: { messageTemplates: merged as object },
        });

        await logFrontendAudit({
            userId: auth.user.id,
            action: "UPDATE_MESSAGE_TEMPLATE",
            entity: "SystemSettings",
            entityId: "settings",
            details: { templateKey: parsed.data.key },
        });

        return NextResponse.json({ templates: merged });
    } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to save template";
        return NextResponse.json({ error: msg }, { status: 400 });
    }
}
