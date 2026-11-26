import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { logFrontendAudit } from "@/lib/audit";
import { requireActionRole } from "@/lib/auth/permissions";
import { bookingRulesSchema, publicContentSchema } from "@/lib/validations/polish";
import { mergePublicContent } from "@/lib/services/publicContent";

// Required role: ADMIN or STAFF
export async function GET() {
    const auth = await requireActionRole(["ADMIN", "STAFF"]);
    if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const s = await prisma.systemSettings.findUnique({ where: { id: "settings" } });
    return NextResponse.json({
        rules: {
            breakStart: s?.breakStart || "",
            breakEnd: s?.breakEnd || "",
            bufferMin: s?.bufferMin ?? 0,
            advanceNoticeMin: s?.advanceNoticeMin ?? 60,
            maxBookingDaysAhead: s?.maxBookingDaysAhead ?? 60,
            cancellationCutoffHours: s?.cancellationCutoffHours ?? 12,
        },
        publicContent: mergePublicContent(s?.publicContent),
    });
}

// Required role: ADMIN
export async function PUT(req: Request) {
    const auth = await requireActionRole(["ADMIN"]);
    if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

    try {
        const body = await req.json();
        if (body.rules) {
            const parsed = bookingRulesSchema.safeParse(body.rules);
            if (!parsed.success) {
                return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid booking rules." }, { status: 400 });
            }
            const r = parsed.data;
            if (r.breakStart && r.breakEnd && r.breakStart >= r.breakEnd) {
                return NextResponse.json({ error: "Break end time must be after break start time." }, { status: 400 });
            }
            await prisma.systemSettings.update({
                where: { id: "settings" },
                data: {
                    breakStart: r.breakStart || null,
                    breakEnd: r.breakEnd || null,
                    bufferMin: r.bufferMin,
                    advanceNoticeMin: r.advanceNoticeMin,
                    maxBookingDaysAhead: r.maxBookingDaysAhead,
                    cancellationCutoffHours: r.cancellationCutoffHours,
                },
            });
            await logFrontendAudit({
                userId: auth.user.id,
                action: "UPDATE_BOOKING_RULES",
                entity: "SystemSettings",
                entityId: "settings",
                details: { bufferMin: r.bufferMin, breakStart: r.breakStart || null },
            });
        }
        if (body.publicContent) {
            const parsed = publicContentSchema.safeParse(body.publicContent);
            if (!parsed.success) {
                return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid public content." }, { status: 400 });
            }
            await prisma.systemSettings.update({
                where: { id: "settings" },
                data: { publicContent: parsed.data as object },
            });
            await logFrontendAudit({
                userId: auth.user.id,
                action: "UPDATE_PUBLIC_CONTENT",
                entity: "SystemSettings",
                entityId: "settings",
                details: { announcementEnabled: parsed.data.announcementEnabled },
            });
        }
        return NextResponse.json({ success: true });
    } catch (err) {
        return NextResponse.json({ error: err instanceof Error ? err.message : "Failed to save settings" }, { status: 400 });
    }
}
