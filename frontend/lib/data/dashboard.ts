import type { AppRole } from "@/lib/auth/permissions";
import { formatPercentChange } from "@/lib/format";
import { fetchDashboardRawData } from "@/lib/data/dashboardQueries";
import { buildChartDatasets, computeOutstanding } from "@/lib/data/dashboardAggregates";
import {
    buildNeedsAttentionItems,
    mapQueueAppointments,
    mapUpcomingAppointments,
} from "@/lib/data/dashboardMappers";
import type {
    ClinicDashboardData,
    PopularTreatmentItem,
    StatusDistribution,
} from "@/features/dashboard/types";

export async function getDashboardData(role: AppRole): Promise<ClinicDashboardData> {
    const raw = await fetchDashboardRawData(role);
    const { canViewFinance, clinic, finance } = raw;

    const todayDone = raw.todayAppts.filter((a) => a.status === "COMPLETED").length;
    const todayActive = raw.todayAppts.filter((a) => a.status !== "CANCELLED").length;
    const todayRemaining = raw.todayAppts.filter(
        (a) => !["COMPLETED", "CANCELLED", "Not_Visited"].includes(a.status)
    ).length;

    const statusCounts: StatusDistribution = {
        completed: 0,
        upcoming: 0,
        cancelled: 0,
        noShow: 0,
        total: 0,
    };
    for (const grp of raw.statusGroups) {
        const count = grp._count._all;
        statusCounts.total += count;
        if (grp.status === "COMPLETED") statusCounts.completed += count;
        else if (grp.status === "CANCELLED") statusCounts.cancelled += count;
        else if (grp.status === "Not_Visited") statusCounts.noShow += count;
        else statusCounts.upcoming += count;
    }

    const chartData = buildChartDatasets(
        raw.apptsSinceLastYear,
        finance?.yearPayments || [],
        canViewFinance
    );

    const revByTreatment = new Map<string, number>();
    if (canViewFinance) {
        for (const a of raw.apptsSinceLastYear) {
            if (a.status === "COMPLETED") {
                const amt = (a as { amountPaid?: number | null }).amountPaid || 0;
                revByTreatment.set(a.treatmentId, (revByTreatment.get(a.treatmentId) || 0) + amt);
            }
        }
    }

    const popularTreatments: PopularTreatmentItem[] = raw.treatmentsList
        .map((t) => ({
            name: t.name,
            bookings: t._count.appointments,
            revenue: canViewFinance ? revByTreatment.get(t.id) || 0 : null,
            category: t.category,
        }))
        .filter((t) => t.bookings > 0)
        .sort((a, b) => b.bookings - a.bookings)
        .slice(0, 5);

    const { outstandingBalance, unpaidItems } =
        canViewFinance && finance
            ? computeOutstanding(finance.unpaidPlans, finance.unpaidAppts)
            : { outstandingBalance: null, unpaidItems: [] };

    const needsAttention = buildNeedsAttentionItems(
        role,
        unpaidItems,
        raw.unconfirmedTomorrow,
        raw.recentNoShows
    );

    const revThis = finance ? finance.revenueThisMonth : null;
    const revPrev = finance ? finance.revenueLastMonth : 0;

    return {
        role: role === "ADMIN" ? "ADMIN" : "STAFF",
        clinic,
        kpis: {
            revenueThisMonth: revThis,
            revenueTrendText: revThis !== null ? formatPercentChange(revThis, revPrev) : "-",
            revenueTrendPositive: revThis !== null && revThis >= revPrev,
            appointmentsTodayDone: todayDone,
            appointmentsTodayTotal: todayActive,
            appointmentsTodayRemaining: todayRemaining,
            tomorrowTotal: raw.tomorrowCount,
            totalPatients: raw.totalPatients,
            newPatientsThisMonth: raw.newPatientsThisMonth,
            outstandingBalance,
        },
        chartData,
        queueAppointments: mapQueueAppointments(raw.queueAppts, canViewFinance),
        upcomingAppointments: mapUpcomingAppointments(raw.upcomingAppts),
        statusDistribution: statusCounts,
        popularTreatments,
        needsAttention,
    };
}
