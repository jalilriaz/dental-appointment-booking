import { NextResponse } from "next/server";
import { requireActionRole } from "@/lib/auth/permissions";
import { retryNotificationLogEntry } from "@/lib/services/notifications";

// Required role: ADMIN
export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
    const auth = await requireActionRole(["ADMIN"]);
    if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

    try {
        const { id } = await params;
        const log = await retryNotificationLogEntry(id, auth.user.id);
        return NextResponse.json({ log });
    } catch (err) {
        const msg = err instanceof Error ? err.message : "Retry failed";
        return NextResponse.json({ error: msg }, { status: 400 });
    }
}
