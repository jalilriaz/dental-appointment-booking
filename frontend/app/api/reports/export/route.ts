import { NextResponse } from "next/server";
import { requireActionRole } from "@/lib/auth/permissions";
import { getKarachiDateKey } from "@/lib/format";
import { shiftDateKey } from "@/lib/karachi-date";
import { buildCsvDocument } from "@/lib/services/csvExport";
import { getAgingReport, getProfitReport } from "@/lib/data/financeReports";
import { getAppointmentReport, getRetentionReport } from "@/lib/data/clinicalReports";

// Required role: ADMIN
export async function GET(req: Request) {
    const auth = await requireActionRole(["ADMIN"]);
    if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const url = new URL(req.url);
    const todayKey = getKarachiDateKey(new Date());
    const start = url.searchParams.get("start") || shiftDateKey(todayKey, -30);
    const end = url.searchParams.get("end") || todayKey;
    const type = url.searchParams.get("type") || "profit";

    let csv = "";
    if (type === "aging") {
        const aging = await getAgingReport();
        csv = buildCsvDocument(
            ["Type", "Patient", "Phone", "Treatment", "Date", "Age Days", "Total Cost", "Paid", "Balance"],
            aging.rows.map((r) => [r.kind, r.patientName, r.patientPhone || "", r.treatmentName, r.referenceDate.slice(0, 10), r.ageDays, r.totalCost, r.paid, r.balance])
        );
    } else if (type === "appointments") {
        const appts = await getAppointmentReport(start, end);
        csv = buildCsvDocument(
            ["DateTime", "Patient", "Phone", "Treatment", "Status", "Channel"],
            appts.appointments.map((a) => [a.startTime, a.patientName, a.patientPhone || "", a.treatmentName, a.status, a.bookedBy])
        );
    } else if (type === "retention") {
        const ret = await getRetentionReport(start, end);
        csv = buildCsvDocument(
            ["Patient", "Phone", "Last Visit", "Last Treatment", "Days Since Visit"],
            ret.overdueRecall.map((r) => [r.patientName, r.phone || "", r.lastVisitDate.slice(0, 10), r.lastTreatment, r.daysSinceVisit])
        );
    } else {
        const profit = await getProfitReport(start, end);
        csv = buildCsvDocument(
            ["Date", "Type", "Method", "Patient", "Treatment", "Amount PKR", "Notes"],
            profit.recentPayments.map((p) => [p.date.slice(0, 10), p.type, p.method, p.patientName, p.treatmentName, p.amount, p.notes || ""])
        );
    }

    return new NextResponse(csv, {
        status: 200,
        headers: {
            "Content-Type": "text/csv; charset=utf-8",
            "Content-Disposition": `attachment; filename="report-${type}-${start}-to-${end}.csv"`,
        },
    });
}
