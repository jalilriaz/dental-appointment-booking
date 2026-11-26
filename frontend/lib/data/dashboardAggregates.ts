import {
    formatKarachiDate,
    formatPKR,
    getKarachiDateKey,
    getKarachiDayBounds,
    getKarachiMonthBounds,
} from "@/lib/format";
import type {
    ChartDataPoint,
    ChartDatasets,
    NeedsAttentionItem,
} from "@/features/dashboard/types";

export function buildChartDatasets(
    appts: Array<{ startTime: Date; status: string; amountPaid?: number | null }>,
    payments: Array<{ date: Date; amount: number }>,
    includeRevenue: boolean
): ChartDatasets {
    const weekly: ChartDataPoint[] = [];
    for (let i = -6; i <= 0; i++) {
        const b = getKarachiDayBounds(i);
        const dayAppts = appts.filter((a) => getKarachiDateKey(a.startTime) === b.dateKey);
        const rev = includeRevenue
            ? dayAppts.reduce((s, a) => s + (a.status === "COMPLETED" ? a.amountPaid || 0 : 0), 0) +
              payments.filter((p) => getKarachiDateKey(p.date) === b.dateKey).reduce((s, p) => s + p.amount, 0)
            : null;
        weekly.push({ label: formatKarachiDate(b.startUtc, "short"), revenue: rev, appointments: dayAppts.length });
    }

    const monthly: ChartDataPoint[] = [];
    for (let m = -5; m <= 0; m++) {
        const mb = getKarachiMonthBounds(m);
        const mAppts = appts.filter((a) => a.startTime >= mb.startUtc && a.startTime <= mb.endUtc);
        const rev = includeRevenue
            ? mAppts.reduce((s, a) => s + (a.status === "COMPLETED" ? a.amountPaid || 0 : 0), 0) +
              payments.filter((p) => p.date >= mb.startUtc && p.date <= mb.endUtc).reduce((s, p) => s + p.amount, 0)
            : null;
        monthly.push({ label: formatKarachiDate(mb.startUtc, "month-year"), revenue: rev, appointments: mAppts.length });
    }

    const currYear = getKarachiMonthBounds(0).year;
    const yearly: ChartDataPoint[] = [currYear - 1, currYear].map((yr) => {
        const yAppts = appts.filter((a) => Number(getKarachiDateKey(a.startTime).slice(0, 4)) === yr);
        const rev = includeRevenue
            ? yAppts.reduce((s, a) => s + (a.status === "COMPLETED" ? a.amountPaid || 0 : 0), 0) +
              payments.filter((p) => Number(getKarachiDateKey(p.date).slice(0, 4)) === yr).reduce((s, p) => s + p.amount, 0)
            : null;
        return { label: String(yr), revenue: rev, appointments: yAppts.length };
    });

    return { weekly, monthly, yearly };
}

export function computeOutstanding(
    plans: Array<{
        id: string;
        totalCost: number;
        patient: { id: string; name: string };
        treatment: { name: string };
        payments: Array<{ amount: number }>;
    }>,
    appts: Array<{
        id: string;
        price: number;
        discount: number;
        amountPaid: number | null;
        patient: { id: string; name: string };
        treatment: { name: string };
    }>
): { outstandingBalance: number; unpaidItems: NeedsAttentionItem[] } {
    let total = 0;
    const unpaidItems: NeedsAttentionItem[] = [];

    for (const pt of plans) {
        const paid = pt.payments.reduce((s, p) => s + p.amount, 0);
        const due = Math.max(0, pt.totalCost - paid);
        if (due > 0) {
            total += due;
            if (unpaidItems.length < 4) {
                unpaidItems.push({
                    id: `plan-${pt.id}`,
                    type: "unpaid",
                    title: `${pt.patient.name} · ${pt.treatment.name}`,
                    subtitle: `Plan balance due: ${formatPKR(due)}`,
                    href: `/admin/patients/${pt.patient.id}`,
                });
            }
        }
    }

    for (const apt of appts) {
        const net = Math.max(0, (apt.price || 0) - (apt.discount || 0));
        const due = Math.max(0, net - (apt.amountPaid || 0));
        if (due > 0) {
            total += due;
            if (unpaidItems.length < 4) {
                unpaidItems.push({
                    id: `apt-${apt.id}`,
                    type: "unpaid",
                    title: `${apt.patient.name} · ${apt.treatment.name}`,
                    subtitle: `Visit balance due: ${formatPKR(due)}`,
                    href: `/admin/patients/${apt.patient.id}`,
                });
            }
        }
    }

    return { outstandingBalance: total, unpaidItems };
}
