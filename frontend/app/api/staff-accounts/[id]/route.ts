import { NextResponse } from "next/server";
import { requireActionRole } from "@/lib/auth/permissions";
import { staffUpdateSchema } from "@/lib/validations/operations";
import { updateStaffAccount } from "@/lib/services/staffAccounts";

// Required role: ADMIN (deactivation invalidates active sessions immediately; protects last active ADMIN)
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const auth = await requireActionRole(["ADMIN"]);
    if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

    try {
        const { id } = await params;
        const body = await req.json();
        const parsed = staffUpdateSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { error: parsed.error.issues[0]?.message || "Invalid staff update payload." },
                { status: 400 }
            );
        }
        const res = await updateStaffAccount(id, parsed.data, auth.user.id);
        if (!res.ok) return NextResponse.json({ error: res.error }, { status: res.status });
        return NextResponse.json({ staff: res.staff });
    } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to update staff account";
        return NextResponse.json({ error: msg }, { status: 400 });
    }
}
