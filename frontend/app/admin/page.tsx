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
              Live practice metrics, daily patient schedule, and procedural ledger for Dr. Sheriyaar at G-8 Markaz Islamabad.
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
          3.5. DOCTORS ON DUTY & OPERATORY ALLOCATIONS
          ────────────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-7">
        <div className="flex items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 flex items-center justify-center">
              <LocalHospitalOutlined sx={{ fontSize: 20 }} />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                Doctors & Specialists on Shift Today
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Live operatory chair status and consulting hours across clinical suites.
              </p>
            </div>
          </div>
          <Link
            href="/admin/doctors"
            className="text-xs text-teal-700 hover:text-teal-800 font-bold inline-flex items-center gap-1 transition-colors px-3 py-1.5 rounded-lg hover:bg-teal-50 shrink-0"
          >
            <span>Manage Doctors</span>
            <ArrowForwardOutlined sx={{ fontSize: 13 }} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Dr. Sheriyaar */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#0B1528] via-[#0E2438] to-teal-950 border border-teal-500/40 hover:border-teal-400/80 text-white transition-all shadow-sm flex flex-col justify-between relative overflow-hidden group">
            <div className="flex items-center gap-3 relative z-10">
              <div className="relative size-13 rounded-xl overflow-hidden ring-2 ring-teal-400/70 shrink-0 bg-slate-800 shadow-md">
                <Image
                  src="/images/dr_sheriyaar.jpg"
                  alt="Dr. Sheriyaar"
                  fill
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <p className="text-xs font-black text-white truncate">Dr. Sheriyaar</p>
                  <span className="size-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                </div>
                <p className="text-[11px] font-bold text-teal-300 truncate">Lead Surgeon</p>
                <p className="text-[10px] text-slate-300 font-medium">Chair 1 · Surgical Suite</p>
              </div>
            </div>
            <div className="mt-3 pt-2.5 border-t border-teal-500/30 flex items-center justify-between text-[11px] relative z-10">
              <span className="font-semibold text-slate-300">12 PM – 8 PM</span>
              <span className="font-extrabold text-emerald-300 bg-emerald-500/20 border border-emerald-500/30 px-1.5 py-0.5 rounded">Active</span>
            </div>
          </div>

          {/* Dr. Ayesha Malik */}
          <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:border-slate-300 transition-all flex flex-col justify-between">
            <div className="flex items-center gap-3">
              <div className="size-12 rounded-xl bg-teal-100 text-teal-800 font-black text-sm flex items-center justify-center shrink-0">
                AM
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-black text-slate-900 truncate">Dr. Ayesha Malik</p>
                  <span className="size-2 rounded-full bg-emerald-500 shrink-0" />
                </div>
                <p className="text-[11px] font-bold text-slate-700 truncate">Consultant Orthodontist</p>
                <p className="text-[10px] text-slate-500 font-medium">Chair 2 · Orthodontics</p>
              </div>
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
              <span className="font-semibold text-slate-600">2 PM – 6 PM</span>
              <span className="font-extrabold text-emerald-700 bg-emerald-100/60 px-1.5 py-0.5 rounded">In Operatory</span>
            </div>
          </div>

          {/* Dr. Hamza Tariq */}
          <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:border-slate-300 transition-all flex flex-col justify-between">
            <div className="flex items-center gap-3">
              <div className="size-12 rounded-xl bg-slate-200 text-slate-800 font-black text-sm flex items-center justify-center shrink-0">
                HT
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-black text-slate-900 truncate">Dr. Hamza Tariq</p>
                  <span className="size-2 rounded-full bg-blue-500 shrink-0" />
                </div>
                <p className="text-[11px] font-bold text-slate-700 truncate">Consultant Endodontist</p>
                <p className="text-[10px] text-slate-500 font-medium">Chair 3 · Rotary Endo</p>
              </div>
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
              <span className="font-semibold text-slate-600">4 PM – 8 PM</span>
              <span className="font-extrabold text-blue-700 bg-blue-100/60 px-1.5 py-0.5 rounded">Next Shift</span>
            </div>
          </div>

          {/* Dr. Fatima Noor */}
          <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:border-slate-300 transition-all flex flex-col justify-between">
            <div className="flex items-center gap-3">
              <div className="size-12 rounded-xl bg-emerald-100 text-emerald-800 font-black text-sm flex items-center justify-center shrink-0">
                FN
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-black text-slate-900 truncate">Dr. Fatima Noor</p>
                  <span className="size-2 rounded-full bg-emerald-500 shrink-0" />
                </div>
                <p className="text-[11px] font-bold text-slate-700 truncate">Specialist Periodontist</p>
                <p className="text-[10px] text-slate-500 font-medium">Chair 4 · Laser Hygiene</p>
              </div>
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
              <span className="font-semibold text-slate-600">12 PM – 4 PM</span>
              <span className="font-extrabold text-emerald-700 bg-emerald-100/60 px-1.5 py-0.5 rounded">Active</span>
            </div>
          </div>
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
                <th className="px-6 py-3.5 sm:px-8">Patient Name</th>
                <th className="px-6 py-3.5">Procedure / Treatment</th>
                <th className="px-6 py-3.5">Scheduled Timing</th>
                <th className="px-6 py-3.5">Fee (PKR)</th>
                <th className="px-6 py-3.5 text-right sm:pr-8">Clinical Status</th>
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
