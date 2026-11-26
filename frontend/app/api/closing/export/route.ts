import { NextResponse } from "next/server";
import { requireActionRole } from "@/lib/auth/permissions";
import { getClosingHistory } from "@/lib/data/closingReports";
import { buildCsvDocument } from "@/lib/services/csvExport";

// Required role: ADMIN
export async function GET(req: Request) {
    const auth = await requireActionRole(["ADMIN"]);
    if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const viewParam = new URL(req.url).searchParams.get("view");
    const view = viewParam === "monthly" || viewParam === "yearly" ? viewParam : "daily";
    const history = await getClosingHistory(view);

    const csv =
        view === "daily"
            ? buildCsvDocument(
                  ["Date", "Status", "Opening Cash", "Collected", "Cash Collected", "Refunds", "Expenses", "Expected Cash", "Counted Cash", "Difference"],
                  history.daily.map((r) => [
                      r.dateKey, r.status, r.openingCash, r.collected, r.cashCollected,
                      r.refunds, r.expenses, r.expectedCash, r.actualCash, r.variance,
                  ])
              )
            : buildCsvDocument(
                  ["Period", "Collected", "Refunds", "Expenses", "Cash Difference", "Days Closed"],
                  history.aggregated.map((r) => [
                      r.period, r.collected, r.refunds, r.expenses, r.variance, r.daysClosed,
                  ])
              );

    return new NextResponse(csv, {
        status: 200,
        headers: {
            "Content-Type": "text/csv; charset=utf-8",
            "Content-Disposition": `attachment; filename="closing-history-${view}.csv"`,
        },
    });
}
