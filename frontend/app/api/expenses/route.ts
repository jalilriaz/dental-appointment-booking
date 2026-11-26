import { NextResponse } from "next/server";
import { requireActionRole } from "@/lib/auth/permissions";
import { expenseSchema } from "@/lib/validations/billing";
import { createExpense, listExpenses } from "@/lib/services/expenses";

// Required role: ADMIN
export async function GET(req: Request) {
    const auth = await requireActionRole(["ADMIN"]);
    if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const url = new URL(req.url);
    const expenses = await listExpenses({
        startDateKey: url.searchParams.get("start") || undefined,
        endDateKey: url.searchParams.get("end") || undefined,
        category: url.searchParams.get("category") || undefined,
    });
    return NextResponse.json({ expenses });
}

// Required role: ADMIN
export async function POST(req: Request) {
    const auth = await requireActionRole(["ADMIN"]);
    if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

    try {
        const body = await req.json();
        const parsed = expenseSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { error: parsed.error.issues[0]?.message || "Invalid expense payload." },
                { status: 400 }
            );
        }
        const expense = await createExpense(parsed.data, auth.user.id);
        return NextResponse.json({ expense }, { status: 201 });
    } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to create expense";
        return NextResponse.json({ error: msg }, { status: msg.includes("closed and locked") ? 409 : 500 });
    }
}
