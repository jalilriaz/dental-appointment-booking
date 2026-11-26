import { NextResponse } from "next/server";
import { requireActionRole } from "@/lib/auth/permissions";
import { labOrderUpdateSchema } from "@/lib/validations/polish";
import { deleteLabOrder, updateLabOrder } from "@/lib/services/labOrders";

// Required role: ADMIN or STAFF (STAFF limited to status updates RECEIVED/DELIVERED; ADMIN full edits)
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const auth = await requireActionRole(["ADMIN", "STAFF"]);
    if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

    try {
        const { id } = await params;
        const parsed = labOrderUpdateSchema.safeParse(await req.json());
        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid lab update." }, { status: 400 });
        }
        if (auth.user.role !== "ADMIN" && (parsed.data.cost !== undefined || parsed.data.labName !== undefined)) {
            return NextResponse.json({ error: "Only clinic admin can modify lab pricing or vendor." }, { status: 403 });
        }
        const order = await updateLabOrder(id, parsed.data, auth.user.id);
        return NextResponse.json({ order });
    } catch (err) {
        return NextResponse.json({ error: err instanceof Error ? err.message : "Update failed" }, { status: 400 });
    }
}

// Required role: ADMIN
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
    const auth = await requireActionRole(["ADMIN"]);
    if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
    const { id } = await params;
    await deleteLabOrder(id, auth.user.id);
    return NextResponse.json({ success: true });
}
