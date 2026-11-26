import { NextResponse } from "next/server";
import { requireActionRole } from "@/lib/auth/permissions";
import { waitlistUpdateSchema } from "@/lib/validations/polish";
import { notifyWaitlistCandidate, updateWaitlistStatus } from "@/lib/services/waitlist";

// Required role: ADMIN or STAFF (update waitlist entry status)
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const auth = await requireActionRole(["ADMIN", "STAFF"]);
    if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const { id } = await params;
    const parsed = waitlistUpdateSchema.safeParse(await req.json());
    if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid status update." }, { status: 400 });
    }
    const entry = await updateWaitlistStatus(id, parsed.data.status, parsed.data.notes, auth.user.id);
    return NextResponse.json({ entry });
}

// Required role: ADMIN or STAFF (notify waitlisted patient for opened cancellation slot)
export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
    const auth = await requireActionRole(["ADMIN", "STAFF"]);
    if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

    try {
        const { id } = await params;
        const result = await notifyWaitlistCandidate(id, auth.user.id);
        return NextResponse.json(result);
    } catch (err) {
        return NextResponse.json({ error: err instanceof Error ? err.message : "Failed to notify candidate" }, { status: 400 });
    }
}
