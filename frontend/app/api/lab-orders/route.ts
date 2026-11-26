import { NextResponse } from "next/server";
import { requireActionRole } from "@/lib/auth/permissions";
import { labOrderCreateSchema } from "@/lib/validations/polish";
import { createLabOrder, listLabOrders } from "@/lib/services/labOrders";

// Required role: ADMIN or STAFF (view lab cases)
export async function GET(req: Request) {
    const auth = await requireActionRole(["ADMIN", "STAFF"]);
    if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const status = new URL(req.url).searchParams.get("status") || "ALL";
    const orders = await listLabOrders(status);
    return NextResponse.json({ orders });
}

// Required role: ADMIN (create lab order)
export async function POST(req: Request) {
    const auth = await requireActionRole(["ADMIN"]);
    if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

    try {
        const parsed = labOrderCreateSchema.safeParse(await req.json());
        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid lab order." }, { status: 400 });
        }
        const order = await createLabOrder(parsed.data, auth.user.id);
        return NextResponse.json({ order }, { status: 201 });
    } catch (err) {
        return NextResponse.json({ error: err instanceof Error ? err.message : "Failed to create lab order" }, { status: 400 });
    }
}
