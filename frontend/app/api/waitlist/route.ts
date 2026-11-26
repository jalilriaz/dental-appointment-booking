import { NextResponse } from "next/server";
import { requireActionRole } from "@/lib/auth/permissions";
import { waitlistCreateSchema } from "@/lib/validations/polish";
import { createWaitlistEntry, listWaitlistEntries } from "@/lib/services/waitlist";

// Required role: ADMIN or STAFF
export async function GET(req: Request) {
    const auth = await requireActionRole(["ADMIN", "STAFF"]);
    if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const status = new URL(req.url).searchParams.get("status") || "ALL";
    const entries = await listWaitlistEntries(status);
    return NextResponse.json({ entries });
}

// Required role: ADMIN or STAFF
export async function POST(req: Request) {
    const auth = await requireActionRole(["ADMIN", "STAFF"]);
    if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

    try {
        const parsed = waitlistCreateSchema.safeParse(await req.json());
        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid waitlist input." }, { status: 400 });
        }
        const entry = await createWaitlistEntry(parsed.data, auth.user.id);
        return NextResponse.json({ entry }, { status: 201 });
    } catch (err) {
        return NextResponse.json({ error: err instanceof Error ? err.message : "Failed to add waitlist entry" }, { status: 400 });
    }
}
