import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { decrypt } from "@/lib/auth";
import prisma from "@/lib/prisma";
import AdminExecutiveDashboard, {
  DashboardKPIs,
  ChartDatasets,
  ChartDataPoint,
  QueuePatientAppointment,
  UpcomingAppointmentItem,
  StatusDistribution,
  PopularTreatmentItem,
} from "@/components/admin/AdminExecutiveDashboard";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  // ─── 1. Server Session & Admin Role Verification ───────────
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  let session: Record<string, unknown> | null = null;

  if (sessionCookie) {
    try {
      session = await decrypt(sessionCookie);
    } catch {
      session = null;
    }
  }

  // Strict server guard: Only ADMIN users can view this executive dashboard
  if (!session || session.role !== "ADMIN") {
    redirect("/login?callbackUrl=/admin");
  }

  // ─── 2. Date Boundaries (Asia/Karachi UTC+5 context) ──────
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const todayStart = new Date(currentYear, currentMonth, now.getDate(), 0, 0, 0, 0);
  const todayEnd = new Date(currentYear, currentMonth, now.getDate(), 23, 59, 59, 999);

  const monthStart = new Date(currentYear, currentMonth, 1, 0, 0, 0, 0);
  const nextMonthStart = new Date(currentYear, currentMonth + 1, 1, 0, 0, 0, 0);
  const prevMonthStart = new Date(currentYear, currentMonth - 1, 1, 0, 0, 0, 0);

  // ─── 3. Parallel Database Queries ─────────────────────────
  const [
    // Revenue current month
    revThisMonthAgg,
    // Revenue previous month (for MoM trend)
    revLastMonthAgg,
    // Outstanding balance (all uncollected dues)
    nonCancelledAppointments,
    // Today's appointments for KPI
    todayAppointmentsList,
    // Total registered patients & new patients this month
    totalPatientsCount,
    newPatientsThisMonthCount,
    // Status distribution
    statusGroupCounts,
    // All appointments for chart aggregations
    allAppointmentsForCharts,
    // Queue: today and recent active appointments
    recentQueueAppointments,
    // Upcoming schedule from today onwards
    upcomingAppointmentsList,
    // Popular treatments
    allActiveTreatments,
    // Doctor details for name & identity
    leadDoctor,
  ] = await Promise.all([
    // Realized revenue this month
    prisma.appointment.aggregate({
      _sum: { amountPaid: true },
      where: {
        status: "COMPLETED",
        startTime: { gte: monthStart, lt: nextMonthStart },
      },
    }),

    // Realized revenue last month
    prisma.appointment.aggregate({
      _sum: { amountPaid: true },
      where: {
        status: "COMPLETED",
        startTime: { gte: prevMonthStart, lt: monthStart },
      },
    }),

    // Non-cancelled appointments to calculate exact outstanding balance
    prisma.appointment.findMany({
      where: { status: { not: "CANCELLED" } },
      select: {
        price: true,
        amountPaid: true,
        discount: true,
      },
    }),

    // Today's appointments count & status
    prisma.appointment.findMany({
      where: {
        startTime: { gte: todayStart, lte: todayEnd },
      },
      select: {
        status: true,
      },
    }),

    // Total registered patient profiles
    prisma.user.count({
      where: { role: "PATIENT" },
    }),

    // New patients registered this month
    prisma.user.count({
      where: {
        role: "PATIENT",
        createdAt: { gte: monthStart },
      },
    }),

    // Status breakdown (Completed, Scheduled, Cancelled, No-show)
    prisma.appointment.groupBy({
      by: ["status"],
      _count: { id: true },
    }),

    // Full appointments dataset for weekly, monthly, and yearly time series
    prisma.appointment.findMany({
      select: {
        startTime: true,
        status: true,
        amountPaid: true,
      },
      orderBy: { startTime: "asc" },
    }),

    // Queue of recent active appointments for table
    prisma.appointment.findMany({
      take: 30,
      orderBy: { startTime: "desc" },
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            phone: true,
            medicalAlerts: true,
            _count: {
              select: { appointments: true },
            },
          },
        },
        treatment: {
          select: {
            id: true,
            name: true,
            durationMin: true,
            price: true,
          },
        },
      },
    }),

    // Upcoming appointments from today onwards
    prisma.appointment.findMany({
      where: {
        startTime: { gte: todayStart },
        status: { in: ["SCHEDULED", "RESCHEDULED"] },
      },
      orderBy: { startTime: "asc" },
      take: 20,
      include: {
        patient: {
          select: {
            name: true,
            phone: true,
            _count: {
              select: { appointments: true },
            },
          },
        },
        treatment: {
          select: {
            name: true,
            durationMin: true,
          },
        },
      },
    }),

    // Treatments for top treatments breakdown
    prisma.treatment.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: { appointments: true },
        },
        appointments: {
          select: {
            amountPaid: true,
            status: true,
          },
        },
      },
    }),

    // Doctor profile for greeting & consistency
    prisma.doctor.findFirst({
      where: { isActive: true },
      orderBy: [{ isLead: "desc" }, { createdAt: "asc" }],
      select: { name: true },
    }),
  ]);

  // ─── 4. KPI Calculations ──────────────────────────────────
  const revenueThisMonth = revThisMonthAgg._sum.amountPaid || 0;
  const revenueLastMonth = revLastMonthAgg._sum.amountPaid || 0;

  let revenueTrendPct = 0;
  if (revenueLastMonth > 0) {
    revenueTrendPct = Math.round(
      ((revenueThisMonth - revenueLastMonth) / revenueLastMonth) * 100
    );
  } else if (revenueThisMonth > 0) {
    revenueTrendPct = 100;
  }

  const outstandingBalance = nonCancelledAppointments.reduce((sum, apt) => {
    const uncollected = Math.max(
      0,
      apt.price - (apt.discount || 0) - (apt.amountPaid || 0)
    );
    return sum + uncollected;
  }, 0);

  const appointmentsTodayTotal = todayAppointmentsList.length;
  const appointmentsTodayDone = todayAppointmentsList.filter(
    (a) => a.status === "COMPLETED"
  ).length;
  const appointmentsTodayNoShow = todayAppointmentsList.filter(
    (a) => a.status === "NO_SHOW"
  ).length;

  const kpis: DashboardKPIs = {
    revenueThisMonth,
    revenueLastMonth,
    revenueTrendPct,
    appointmentsTodayDone,
    appointmentsTodayTotal,
    appointmentsTodayNoShow,
    totalPatients: totalPatientsCount,
    newPatientsThisMonth: newPatientsThisMonthCount,
    outstandingBalance,
  };

  // ─── 5. Time Series Datasets (Weekly, Monthly, Yearly) ─────
  // Weekly: Last 7 days
  const weeklyMap: Record<string, { label: string; dateStr: string; revenue: number; appointments: number }> = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const key = d.toISOString().split("T")[0];
    const dayLabel = d.toLocaleDateString("en-US", { weekday: "short" });
    weeklyMap[key] = {
      label: dayLabel,
      dateStr: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      revenue: 0,
      appointments: 0,
    };
  }

  // Monthly: 12 months of current year
  const monthlyMap: Record<string, { label: string; revenue: number; appointments: number }> = {};
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  monthNames.forEach((mName, idx) => {
    monthlyMap[String(idx)] = {
      label: mName,
      revenue: 0,
      appointments: 0,
    };
  });

  // Yearly: 2024 to current year
  const yearlyMap: Record<string, { label: string; revenue: number; appointments: number }> = {
    "2024": { label: "2024", revenue: 0, appointments: 0 },
    "2025": { label: "2025", revenue: 0, appointments: 0 },
    [String(currentYear)]: { label: String(currentYear), revenue: 0, appointments: 0 },
  };

  allAppointmentsForCharts.forEach((apt) => {
    const aDate = new Date(apt.startTime);
    const dateKey = aDate.toISOString().split("T")[0];
    const yearKey = String(aDate.getFullYear());
    const monthKey = String(aDate.getMonth());

    // Weekly bucket
    if (weeklyMap[dateKey]) {
      weeklyMap[dateKey].appointments += 1;
      if (apt.status === "COMPLETED") {
        weeklyMap[dateKey].revenue += apt.amountPaid || 0;
      }
    }

    // Monthly bucket (current year)
    if (aDate.getFullYear() === currentYear && monthlyMap[monthKey]) {
      monthlyMap[monthKey].appointments += 1;
      if (apt.status === "COMPLETED") {
        monthlyMap[monthKey].revenue += apt.amountPaid || 0;
      }
    }

    // Yearly bucket
    if (yearlyMap[yearKey]) {
      yearlyMap[yearKey].appointments += 1;
      if (apt.status === "COMPLETED") {
        yearlyMap[yearKey].revenue += apt.amountPaid || 0;
      }
    }
  });

  const chartData: ChartDatasets = {
    weekly: Object.values(weeklyMap),
    monthly: Object.values(monthlyMap),
    yearly: Object.values(yearlyMap),
  };

  // ─── 6. Status Distribution Breakdown ─────────────────────
  let completedCount = 0;
  let upcomingCount = 0;
  let cancelledCount = 0;
  let noShowCount = 0;
  let totalVisits = 0;

  statusGroupCounts.forEach((group) => {
    const c = group._count.id;
    totalVisits += c;
    if (group.status === "COMPLETED") completedCount += c;
    else if (group.status === "SCHEDULED" || group.status === "RESCHEDULED") upcomingCount += c;
    else if (group.status === "CANCELLED") cancelledCount += c;
    else if (group.status === "NO_SHOW") noShowCount += c;
  });

  const statusDistribution: StatusDistribution = {
    completed: completedCount,
    upcoming: upcomingCount,
    cancelled: cancelledCount,
    noShow: noShowCount,
    total: totalVisits,
  };

  // ─── 7. Top Popular Treatments ────────────────────────────
  const popularTreatments: PopularTreatmentItem[] = allActiveTreatments
    .map((t) => {
      const bookings = t._count.appointments;
      const revenue = t.appointments.reduce((sum, a) => {
        if (a.status === "COMPLETED") {
          return sum + (a.amountPaid || 0);
        }
        return sum;
      }, 0);
      return {
        name: t.name,
        bookings,
        revenue,
        category: t.category,
      };
    })
    .sort((a, b) => b.bookings - a.bookings)
    .slice(0, 5);

  // ─── 8. Serialized Queue Patients ─────────────────────────
  const serializedQueue: QueuePatientAppointment[] = recentQueueAppointments.map((apt) => ({
    id: apt.id,
    startTime: apt.startTime.toISOString(),
    endTime: apt.endTime.toISOString(),
    status: apt.status,
    amountPaid: apt.amountPaid || 0,
    price: apt.price || 0,
    discount: apt.discount || 0,
    patient: apt.patient
      ? {
          id: apt.patient.id,
          name: apt.patient.name,
          phone: apt.patient.phone,
          medicalAlerts: apt.patient.medicalAlerts,
          isFirstVisit: (apt.patient._count?.appointments ?? 1) <= 1,
        }
      : null,
    treatment: {
      id: apt.treatment.id,
      name: apt.treatment.name,
      durationMin: apt.treatment.durationMin,
      price: apt.treatment.price,
    },
  }));

  // ─── 9. Serialized Upcoming Schedule ──────────────────────
  const serializedUpcoming: UpcomingAppointmentItem[] = upcomingAppointmentsList.map((apt) => ({
    id: apt.id,
    startTime: apt.startTime.toISOString(),
    endTime: apt.endTime.toISOString(),
    status: apt.status,
    patient: apt.patient
      ? {
          name: apt.patient.name,
          phone: apt.patient.phone,
          isFirstVisit: (apt.patient._count?.appointments ?? 1) <= 1,
        }
      : null,
    treatment: {
      name: apt.treatment.name,
      durationMin: apt.treatment.durationMin,
    },
  }));

  const doctorName = leadDoctor?.name || "Dr. Sheriyaar";

  return (
    <AdminExecutiveDashboard
      doctorName={doctorName}
      kpis={kpis}
      chartData={chartData}
      queueAppointments={serializedQueue}
      upcomingAppointments={serializedUpcoming}
      statusDistribution={statusDistribution}
      popularTreatments={popularTreatments}
    />
  );
}
