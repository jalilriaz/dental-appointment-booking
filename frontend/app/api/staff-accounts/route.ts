import { NextResponse } from "next/server";
import { requireActionRole } from "@/lib/auth/permissions";
import { staffCreateSchema } from "@/lib/validations/operations";
import { createStaffAccount, listStaffAccounts } from "@/lib/services/staffAccounts";

// Required role: ADMIN
export async function GET() {
    const auth = await requireActionRole(["ADMIN"]);
    if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
    const staff = await listStaffAccounts();
    return NextResponse.json({ staff });
}

// Required role: ADMIN
export async function POST(req: Request) {
    const auth = await requireActionRole(["ADMIN"]);
    if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

    try {
        const body = await req.json();
        const parsed = staffCreateSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { error: parsed.error.issues[0]?.message || "Invalid staff payload." },
                { status: 400 }
            );
        }
        const staff = await createStaffAccount(parsed.data, auth.user.id);
        return NextResponse.json({ staff }, { status: 201 });
    } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to create staff account";
        return NextResponse.json({ error: msg }, { status: 400 });
    }
}
