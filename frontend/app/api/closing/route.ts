import { NextResponse } from "next/server";
import { requireActionRole } from "@/lib/auth/permissions";
import { dailyClosingSubmitSchema, reopenClosingSchema } from "@/lib/validations/billing";
import { approveDailyClosing, reopenDailyClosing } from "@/lib/services/dailyClosing";
import { getClosingHistory, getDaysNotClosed } from "@/lib/data/closingReports";

// Required role: ADMIN
export async function GET(req: Request) {
    const auth = await requireActionRole(["ADMIN"]);
    if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const viewParam = new URL(req.url).searchParams.get("view");
    const view = viewParam === "monthly" || viewParam === "yearly" ? viewParam : "daily";
    const [history, daysNotClosed] = await Promise.all([
        getClosingHistory(view),
        getDaysNotClosed(),
    ]);
    return NextResponse.json({ ...history, daysNotClosed });
}

// Required role: ADMIN
export async function POST(req: Request) {
    const auth = await requireActionRole(["ADMIN"]);
    if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

    try {
        const body = await req.json();
        if (body.action === "reopen") {
            const parsed = reopenClosingSchema.safeParse(body);
            if (!parsed.success) {
                return NextResponse.json(
                    { error: parsed.error.issues[0]?.message || "Reopen reason is required." },
                    { status: 400 }
                );
            }
            const row = await reopenDailyClosing({ ...parsed.data, adminUserId: auth.user.id });
            return NextResponse.json({ closing: row });
        }

        const parsed = dailyClosingSubmitSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { error: parsed.error.issues[0]?.message || "Invalid closing payload." },
                { status: 400 }
            );
        }
        const row = await approveDailyClosing({ ...parsed.data, adminUserId: auth.user.id });
        return NextResponse.json({ closing: row });
    } catch (err) {
        const msg = err instanceof Error ? err.message : "Daily closing operation failed";
        return NextResponse.json({ error: msg }, { status: 400 });
    }
}
