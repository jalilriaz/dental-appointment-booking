import { requireRole } from "@/lib/auth/permissions";
import { getKarachiDateKey } from "@/lib/format";
import { shiftDateKey } from "@/lib/karachi-date";
import { getAgingReport, getProfitReport } from "@/lib/data/financeReports";
import { getAppointmentReport, getRetentionReport } from "@/lib/data/clinicalReports";
import ReportsView from "@/features/reports/ReportsView";

export default async function AdminRevenuePage() {
    await requireRole(["ADMIN"], { callbackUrl: "/admin/revenue" });
    const todayKey = getKarachiDateKey(new Date());
    const startKey = shiftDateKey(todayKey, -30);

    const [profit, aging, appointments, retention] = await Promise.all([
        getProfitReport(startKey, todayKey),
        getAgingReport(),
        getAppointmentReport(startKey, todayKey),
        getRetentionReport(startKey, todayKey),
    ]);

    return <ReportsView initialData={{ profit, aging, appointments, retention }} />;
}
