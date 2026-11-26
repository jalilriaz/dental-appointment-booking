import { NextResponse } from "next/server";
import { requireActionRole } from "@/lib/auth/permissions";
import { resetStaffPasswordByAdmin } from "@/lib/services/staffAccounts";

// Required role: ADMIN (generates temporary password shown once, forces change on next login)
export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
    const auth = await requireActionRole(["ADMIN"]);
    if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

    try {
        const { id } = await params;
        const result = await resetStaffPasswordByAdmin(id, auth.user.id);
        return NextResponse.json(result);
    } catch (err) {
        const msg = err instanceof Error ? err.message : "Password reset failed";
        return NextResponse.json({ error: msg }, { status: 400 });
    }
}
