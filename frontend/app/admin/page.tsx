import prisma from "@/lib/prisma";
import Image from "next/image";
import {
  PeopleAltOutlined,
  EventAvailableOutlined,
  AttachMoneyOutlined,
  AccessTimeOutlined,
  TrendingUpOutlined,
  EventBusyOutlined,
  CheckCircleOutlineOutlined,
  PersonAddAlt1Outlined,
  CalendarMonthOutlined,
  AccountBalanceWalletOutlined,
  ArrowForwardOutlined,
  LocalHospitalOutlined,
} from "@mui/icons-material";
import Link from "next/link";
import TodayAppointments from "@/components/shared/TodayAppointments";
import AnimatedDashboard from "@/components/shared/AnimatedDashboard";
import { formatPKR, formatDate, formatTime } from "@/lib/utils";
import StatusBadge from "@/components/shared/StatusBadge";

export default async function AdminDashboard() {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayEnd = new Date(todayStart.getTime() + 86400000);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  // Fetch all stats in parallel
  const [
    totalPatients,
    totalAppointments,
    appointmentsToday,
    completedAppointments,
    cancelledAppointments,
    upcomingAppointments,
    realizedRevenueAgg,
    projectedRevenueAgg,
    monthlyRealizedAgg,
    todayAppts,
    recentAppointments,
    doctorsList,
  ] = await Promise.all([
    prisma.user.count({ where: { role: "PATIENT" } }),
    prisma.appointment.count(),
    prisma.appointment.count({
      where: {
        startTime: { gte: todayStart, lt: todayEnd },
        status: { not: "CANCELLED" },
      },
    }),
    prisma.appointment.count({ where: { status: "COMPLETED" } }),
    prisma.appointment.count({ where: { status: "CANCELLED" } }),
    prisma.appointment.count({
      where: { startTime: { gte: now }, status: "SCHEDULED" },
    }),
    prisma.appointment.aggregate({
      _sum: { amountPaid: true },
      where: { status: "COMPLETED" },
    }),
    prisma.appointment.aggregate({
      _sum: { price: true },
      where: { status: { in: ["SCHEDULED", "COMPLETED"] } },
    }),
    prisma.appointment.aggregate({
      _sum: { amountPaid: true },
      where: { status: "COMPLETED", startTime: { gte: monthStart } },
    }),
    prisma.appointment.findMany({
      where: {
        startTime: { gte: todayStart, lt: todayEnd },
        status: { not: "CANCELLED" },
      },
      include: {
        patient: { select: { name: true, phone: true, medicalAlerts: true } },
        treatment: { select: { name: true, durationMin: true, price: true } },
      },
      orderBy: { startTime: "asc" },
    }),
    prisma.appointment.findMany({
      take: 8,
      orderBy: { startTime: "desc" },
      include: {
        patient: { select: { name: true, phone: true } },
        treatment: { select: { name: true, price: true, category: true } },
      },
    }),
    prisma.doctor.findMany({
      where: { isActive: true },
      orderBy: [{ isLead: "desc" }, { createdAt: "asc" }],
    }),
  ]);

  const realizedRevenue = realizedRevenueAgg._sum.amountPaid || 0;
  const projectedRevenue = projectedRevenueAgg._sum.price || 0;
  const monthRevenue = monthlyRealizedAgg._sum.amountPaid || 0;

  const serializedToday = todayAppts.map((a) => ({
    id: a.id,
    startTime: a.startTime.toISOString(),
    endTime: a.endTime.toISOString(),
    status: a.status,
    amountPaid: a.amountPaid || 0,
    patient: a.patient,
    treatment: a.treatment,
  }));

  return (
    <AnimatedDashboard className="space-y-6 sm:space-y-8">
      {/* ──────────────────────────────────────────────────────────────────
          1. EXECUTIVE HERO BANNER: Welcome + Quick Action Command Center
          ────────────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0B1528] via-[#0F1E38] to-[#0B1528] text-white p-6 sm:p-8 lg:p-10 shadow-xl border border-slate-800/80">
        {/* Subtle Ambient Background Gradients */}
        <div className="absolute -top-24 -right-24 size-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 size-80 bg-teal-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-300 text-xs font-bold uppercase tracking-wider">
              <LocalHospitalOutlined sx={{ fontSize: 14 }} />
              <span>Center of Advanced Implantology & Cosmetic Dentistry</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight font-sans">
              Clinical Operations Hub
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              Live practice metrics, daily patient schedule, and procedural ledger for Dr. Shehryar Akhtar at G-8 Markaz Islamabad.
            </p>
          </div>

          {/* Quick Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 shrink-0">
            <Link
              href="/admin/walk-in"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-xs shadow-lg shadow-teal-600/25 active:scale-95 transition-all cursor-pointer border border-teal-400/40"
            >
              <PersonAddAlt1Outlined sx={{ fontSize: 18 }} />
              <span>+ New Walk-In Patient</span>
            </Link>

            <Link
              href="/admin/appointments"
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs border border-white/15 backdrop-blur-sm active:scale-95 transition-all cursor-pointer"
            >
              <CalendarMonthOutlined sx={{ fontSize: 18 }} />
              <span>All Appointments</span>
            </Link>

            <Link
              href="/admin/revenue"
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs border border-white/15 backdrop-blur-sm active:scale-95 transition-all cursor-pointer"
            >
              <AccountBalanceWalletOutlined sx={{ fontSize: 18 }} />
              <span>Ledger</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────────────
          2. PRIMARY FINANCIAL & OPERATIONAL KPIS (Top Tier Cards)
          ────────────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Card 1: Total Realized Revenue */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              Total Realized Revenue
            </span>
            <div className="size-11 rounded-2xl bg-teal-50 border border-teal-200/80 flex items-center justify-center text-teal-700 shadow-2xs group-hover:scale-105 transition-transform">
              <AttachMoneyOutlined sx={{ fontSize: 24 }} />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-sans">
              {formatPKR(realizedRevenue)}
            </p>
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 pt-1">
              <CheckCircleOutlineOutlined sx={{ fontSize: 14 }} />
              <span>Collected & Reconciled</span>
            </div>
          </div>
        </div>

        {/* Card 2: This Month's Revenue */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              Current Month Intake
            </span>
            <div className="size-11 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-700 shadow-2xs group-hover:scale-105 transition-transform">
              <TrendingUpOutlined sx={{ fontSize: 24 }} />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-sans">
              {formatPKR(monthRevenue)}
            </p>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 pt-1">
              <span>Month-to-date collections</span>
            </div>
          </div>
        </div>

        {/* Card 3: Today's Appointments */}
        <Link
          href="/admin/appointments?filter=today"
          className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md hover:border-teal-300 transition-all relative overflow-hidden group block cursor-pointer"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              Today&apos;s Schedule
            </span>
            <div className="size-11 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-700 shadow-2xs group-hover:scale-105 transition-transform">
              <AccessTimeOutlined sx={{ fontSize: 24 }} />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-sans">
              {appointmentsToday}
            </p>
            <div className="flex items-center gap-1 text-xs font-bold text-amber-800 pt-1">
              <span>Patient visits scheduled today</span>
              <ArrowForwardOutlined sx={{ fontSize: 13 }} />
            </div>
          </div>
        </Link>

        {/* Card 4: Total Registered Patients */}
        <Link
          href="/admin/patients"
          className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md hover:border-teal-300 transition-all relative overflow-hidden group block cursor-pointer"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              Patient Community
            </span>
            <div className="size-11 rounded-2xl bg-sky-50 border border-sky-200/80 flex items-center justify-center text-sky-700 shadow-2xs group-hover:scale-105 transition-transform">
              <PeopleAltOutlined sx={{ fontSize: 24 }} />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-sans">
              {totalPatients}
            </p>
            <div className="flex items-center gap-1 text-xs font-bold text-sky-700 pt-1">
              <span>Registered patient profiles</span>
              <ArrowForwardOutlined sx={{ fontSize: 13 }} />
            </div>
          </div>
        </Link>
      </div>

      {/* ──────────────────────────────────────────────────────────────────
          3. CLINICAL HEALTH & VOLUME BENCHMARKS (Secondary Stats Row)
          ────────────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Link
          href="/admin/appointments?status=COMPLETED"
          className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs flex items-center gap-3.5 hover:shadow-sm hover:border-teal-300 transition-all cursor-pointer group"
        >
          <div className="size-10 rounded-xl bg-teal-50 border border-teal-200/60 flex items-center justify-center text-teal-700 shrink-0">
            <CheckCircleOutlineOutlined sx={{ fontSize: 20 }} />
          </div>
          <div className="min-w-0">
            <p className="text-lg font-black text-slate-900 leading-none">{completedAppointments}</p>
            <p className="text-[11px] font-semibold text-slate-500 truncate mt-1">Completed Procedures</p>
          </div>
        </Link>

        <Link
          href="/admin/appointments?status=SCHEDULED"
          className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs flex items-center gap-3.5 hover:shadow-sm hover:border-teal-300 transition-all cursor-pointer group"
        >
          <div className="size-10 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-700 shrink-0">
            <EventAvailableOutlined sx={{ fontSize: 20 }} />
          </div>
          <div className="min-w-0">
            <p className="text-lg font-black text-slate-900 leading-none">{upcomingAppointments}</p>
            <p className="text-[11px] font-semibold text-slate-500 truncate mt-1">Upcoming Future Slots</p>
          </div>
        </Link>

        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs flex items-center gap-3.5">
          <div className="size-10 rounded-xl bg-sky-50 border border-sky-200/60 flex items-center justify-center text-sky-700 shrink-0">
            <TrendingUpOutlined sx={{ fontSize: 20 }} />
          </div>
          <div className="min-w-0">
            <p className="text-lg font-black text-slate-900 leading-none">{formatPKR(projectedRevenue)}</p>
            <p className="text-[11px] font-semibold text-slate-500 truncate mt-1">Projected Total Pipeline</p>
          </div>
        </div>

        <Link
          href="/admin/appointments?status=CANCELLED"
          className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs flex items-center gap-3.5 hover:shadow-sm hover:border-rose-300 transition-all cursor-pointer group"
        >
          <div className="size-10 rounded-xl bg-rose-50 border border-rose-200/60 flex items-center justify-center text-rose-700 shrink-0">
            <EventBusyOutlined sx={{ fontSize: 20 }} />
          </div>
          <div className="min-w-0">
            <p className="text-lg font-black text-slate-900 leading-none">{cancelledAppointments}</p>
            <p className="text-[11px] font-semibold text-slate-500 truncate mt-1">Cancelled Bookings</p>
          </div>
        </Link>
      </div>

      {/* ──────────────────────────────────────────────────────────────────
          3.5. ATTENDING DENTAL SURGEON
          ────────────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-7">
        <div className="flex items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 flex items-center justify-center">
              <LocalHospitalOutlined sx={{ fontSize: 20 }} />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                Attending Dental Surgeon
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Lead practitioner on duty and active clinical consulting schedule.
              </p>
            </div>
          </div>
          <Link
            href="/admin/settings#doctor-profile"
            className="text-xs text-teal-700 hover:text-teal-800 font-bold inline-flex items-center gap-1 transition-colors px-3 py-1.5 rounded-lg hover:bg-teal-50 shrink-0"
          >
            <span>Edit in Settings</span>
            <ArrowForwardOutlined sx={{ fontSize: 13 }} />
          </Link>
        </div>

        <div className="max-w-md">
          {doctorsList.filter(d => d.isLead || d.name.includes("Shehryar") || d.name.includes("Sheriyaar")).slice(0, 1).map((doc) => (
            <div
              key={doc.id}
              className="p-5 rounded-2xl bg-gradient-to-br from-[#0B1528] via-[#0E2438] to-teal-950 border border-teal-500/40 hover:border-teal-400/80 text-white transition-all shadow-sm flex flex-col justify-between relative overflow-hidden group"
            >
              <div className="flex items-center gap-3.5 relative z-10">
                <div className="relative size-14 rounded-xl overflow-hidden ring-2 ring-teal-400/70 shrink-0 bg-slate-800 shadow-md">
                  <Image
                    src={doc.image || "/dr_sheriyaar.webp"}
                    alt={doc.name}
                    fill
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-black text-white truncate">{doc.name}</p>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      ON DUTY
                    </span>
                  </div>
                  <p className="text-xs font-bold text-teal-300 truncate mt-0.5">{doc.role || "Lead Dental Surgeon & Implantologist"}</p>
                  <p className="text-[11px] text-slate-300 font-medium truncate mt-0.5">{doc.operatory || "Chair 1 · Main Surgical Suite"}</p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-teal-500/30 flex items-center justify-between text-xs relative z-10">
                <span className="font-semibold text-slate-300">Schedule: {doc.schedule.split(":")[1]?.trim() || doc.schedule || "12 PM – 8 PM"}</span>
                <span className="font-extrabold text-teal-200">Consultation Fee: Rs. {doc.consultationFee?.toLocaleString() || "2,000"}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────────────
          4. TODAY'S REAL-TIME CLINICAL SCHEDULE
          ────────────────────────────────────────────────────────────────── */}
      <TodayAppointments initialAppointments={serializedToday} />

      {/* ──────────────────────────────────────────────────────────────────
          5. RECENT APPOINTMENTS CLINICAL LOG
          ────────────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 sm:px-8 sm:py-5 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
              Recent Clinical Visits
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Latest scheduled and attended treatments across all booking channels.
            </p>
          </div>
          <Link
            href="/admin/appointments"
            className="text-xs text-teal-700 hover:text-teal-800 font-bold inline-flex items-center gap-1 transition-colors px-3 py-1.5 rounded-lg hover:bg-teal-50"
          >
            <span>View Full Log</span>
            <ArrowForwardOutlined sx={{ fontSize: 14 }} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50/80 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3.5 sm:px-8 whitespace-nowrap">Patient Name</th>
                <th className="px-6 py-3.5 whitespace-nowrap">Procedure / Treatment</th>
                <th className="px-6 py-3.5 whitespace-nowrap">Scheduled Timing</th>
                <th className="px-6 py-3.5 whitespace-nowrap">Fee (PKR)</th>
                <th className="px-6 py-3.5 text-right sm:pr-8 whitespace-nowrap">Clinical Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {recentAppointments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">
                    <AccessTimeOutlined sx={{ fontSize: 32 }} className="text-slate-300 mx-auto mb-2" />
                    <p className="text-sm font-bold text-slate-700">No Appointments Recorded</p>
                    <p className="text-xs text-slate-400 mt-0.5">New bookings will appear here in chronological order.</p>
                  </td>
                </tr>
              ) : (
                recentAppointments.map((apt) => {
                  const initial = (apt.patient?.name || "P").charAt(0).toUpperCase();

                  return (
                    <tr
                      key={apt.id}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                    >
                      <td className="px-6 py-4 sm:px-8">
                        <div className="flex items-center gap-3">
                          <div className="size-9 rounded-full bg-teal-50 text-teal-800 border border-teal-200/80 flex items-center justify-center font-bold text-xs shrink-0 group-hover:border-teal-400 transition-colors">
                            {initial}
                          </div>
                          <div>
                            <span className="font-extrabold text-slate-900 block group-hover:text-teal-700 transition-colors">
                              {apt.patient?.name || "Anonymous Patient"}
                            </span>
                            {apt.patient?.phone && (
                              <span className="text-[11px] text-slate-400 font-medium">
                                {apt.patient.phone}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-800">
                        {apt.treatment?.name}
                      </td>
                      <td className="px-6 py-4 text-xs font-semibold text-slate-600">
                        <span>{formatDate(apt.startTime, "short")}</span>
                        <span className="text-slate-400 ml-1">· {formatTime(apt.startTime)}</span>
                      </td>
                      <td className="px-6 py-4 font-extrabold text-teal-700 font-sans">
                        {formatPKR(apt.treatment?.price || 0)}
                      </td>
                      <td className="px-6 py-4 text-right sm:pr-8">
                        <StatusBadge status={apt.status} />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AnimatedDashboard>
  );
}
