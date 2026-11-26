import { NextResponse } from "next/server";
import { requireActionRole } from "@/lib/auth/permissions";
import { getKarachiDateKey } from "@/lib/format";
import { shiftDateKey } from "@/lib/karachi-date";
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
    const type = url.searchParams.get("type") || "all";

    if (type === "profit") return NextResponse.json(await getProfitReport(start, end));
    if (type === "aging") return NextResponse.json(await getAgingReport());
    if (type === "appointments") return NextResponse.json(await getAppointmentReport(start, end));
    if (type === "retention") return NextResponse.json(await getRetentionReport(start, end));

    const [profit, aging, appointments, retention] = await Promise.all([
        getProfitReport(start, end),
        getAgingReport(),
        getAppointmentReport(start, end),
        getRetentionReport(start, end),
    ]);
    return NextResponse.json({ profit, aging, appointments, retention });
}
