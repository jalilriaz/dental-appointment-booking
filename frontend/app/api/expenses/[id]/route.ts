import { NextResponse } from "next/server";
import { requireActionRole } from "@/lib/auth/permissions";
import { expenseSchema } from "@/lib/validations/billing";
import { deleteExpense, updateExpense } from "@/lib/services/expenses";

// Required role: ADMIN
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const auth = await requireActionRole(["ADMIN"]);
    if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

    try {
        const { id } = await params;
        const body = await req.json();
        const parsed = expenseSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { error: parsed.error.issues[0]?.message || "Invalid expense payload." },
                { status: 400 }
            );
        }
        const expense = await updateExpense(id, parsed.data, auth.user.id);
        return NextResponse.json({ expense });
    } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to update expense";
        const status = msg.includes("not found") ? 404 : msg.includes("closed and locked") ? 409 : 500;
        return NextResponse.json({ error: msg }, { status });
    }
}

// Required role: ADMIN
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
    const auth = await requireActionRole(["ADMIN"]);
    if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

    try {
        const { id } = await params;
        await deleteExpense(id, auth.user.id);
        return NextResponse.json({ success: true });
    } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to delete expense";
        const status = msg.includes("not found") ? 404 : msg.includes("closed and locked") ? 409 : 500;
        return NextResponse.json({ error: msg }, { status });
    }
}
