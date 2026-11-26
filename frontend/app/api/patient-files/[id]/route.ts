import { NextResponse } from "next/server";
import { requireActionRole } from "@/lib/auth/permissions";
import { archivePatientFile } from "@/lib/services/secureFiles";

// Required role: ADMIN
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
    const auth = await requireActionRole(["ADMIN"]);
    if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

    try {
        const { id } = await params;
        await archivePatientFile(id, auth.user.id);
        return NextResponse.json({ success: true });
    } catch (err) {
        const msg = err instanceof Error ? err.message : "Delete failed";
        return NextResponse.json({ error: msg }, { status: msg.includes("not found") ? 404 : 500 });
    }
}
