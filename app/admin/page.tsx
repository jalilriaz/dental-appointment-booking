import prisma from "@/lib/prisma"
import {
  Users,
  CalendarCheck,
  DollarSign,
  Clock,
  TrendingUp,
  CalendarX,
  CheckCircle2,
} from "lucide-react"
import Link from "next/link"
import TodayAppointments from "@/components/shared/TodayAppointments"
import AnimatedDashboard from "@/components/shared/AnimatedDashboard"
import { formatPKR, formatDate, formatTime } from "@/lib/utils"
import StatusBadge from "@/components/shared/StatusBadge"

export default async function AdminDashboard() {
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const todayEnd = new Date(todayStart.getTime() + 86400000)
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

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
        patient: { select: { name: true } },
        treatment: { select: { name: true, price: true } },
      },
    }),
  ])

  const realizedRevenue = realizedRevenueAgg._sum.amountPaid || 0
  const projectedRevenue = projectedRevenueAgg._sum.price || 0
  const monthRevenue = monthlyRealizedAgg._sum.amountPaid || 0

  const serializedToday = todayAppts.map((a) => ({
    id: a.id,
    startTime: a.startTime.toISOString(),
    endTime: a.endTime.toISOString(),
    status: a.status,
    amountPaid: a.amountPaid || 0,
    patient: a.patient,
    treatment: a.treatment,
  }))

  return (
    <AnimatedDashboard className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-sm text-slate-400">
          Welcome back! Here&apos;s what&apos;s happening today.
        </p>
      </div>

      {/* Revenue Cards — Top Priority */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Realized Revenue */}
        <div className="glass-card rounded-xl p-5 border-l-2 border-l-emerald-500 hover:scale-[1.02] hover:border-teal-500/50 transition-premium animate-fade-in-up opacity-0 stagger-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                Realized Revenue
              </p>
              <p className="text-2xl font-bold text-emerald-400 mt-1">
                {formatPKR(realizedRevenue)}
              </p>
              <p className="text-[10px] text-slate-500 mt-1">
                ✓ Completed visits only
              </p>
            </div>
            <div className="size-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <DollarSign className="size-6 text-emerald-400" />
            </div>
          </div>
        </div>

        {/* Projected Revenue */}
        <div className="glass-card rounded-xl p-5 border-l-2 border-l-blue-400 hover:scale-[1.02] hover:border-blue-400/50 transition-premium animate-fade-in-up opacity-0 stagger-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                Projected Revenue
              </p>
              <p className="text-2xl font-bold text-blue-400 mt-1">
                {formatPKR(projectedRevenue)}
              </p>
              <p className="text-[10px] text-slate-500 mt-1">
                Scheduled + Completed
              </p>
            </div>
            <div className="size-12 rounded-xl bg-blue-400/10 flex items-center justify-center">
              <TrendingUp className="size-6 text-blue-400" />
            </div>
          </div>
        </div>

        {/* Monthly Revenue */}
        <div className="glass-card rounded-xl p-5 border-l-2 border-l-green-400 hover:scale-[1.02] hover:border-green-400/50 transition-premium animate-fade-in-up opacity-0 stagger-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                This Month
              </p>
              <p className="text-2xl font-bold text-green-400 mt-1">
                {formatPKR(monthRevenue)}
              </p>
              <p className="text-[10px] text-slate-500 mt-1">
                Realized this month
              </p>
            </div>
            <div className="size-12 rounded-xl bg-green-400/10 flex items-center justify-center">
              <CalendarCheck className="size-6 text-green-400" />
            </div>
          </div>
        </div>

        {/* Today */}
        <Link
          href="/admin/appointments?filter=today"
          className="glass-card rounded-xl p-5 border-l-2 border-l-amber-400 hover:scale-[1.02] hover:border-amber-400/50 transition-premium animate-fade-in-up opacity-0 stagger-4 block cursor-pointer hover:shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                Today
              </p>
              <p className="text-2xl font-bold text-white mt-1">
                {appointmentsToday}
              </p>
              <p className="text-[10px] text-slate-500 mt-1">
                appointments today
              </p>
            </div>
            <div className="size-12 rounded-xl bg-amber-400/10 flex items-center justify-center">
              <Clock className="size-6 text-amber-400" />
            </div>
          </div>
        </Link>
      </div>

      {/* Mini Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/admin/patients"
          className="glass-card rounded-xl p-4 flex items-center gap-3 hover:scale-[1.02] transition-premium animate-fade-in-up opacity-0 stagger-5 cursor-pointer hover:shadow-lg hover:border-teal-500/50"
        >
          <div className="size-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <Users className="size-5 text-blue-400" />
          </div>
          <div>
            <p className="text-lg font-bold text-white">{totalPatients}</p>
            <p className="text-xs text-slate-400">Total Patients</p>
          </div>
        </Link>
        <Link
          href="/admin/appointments?status=COMPLETED"
          className="glass-card rounded-xl p-4 flex items-center gap-3 hover:scale-[1.02] transition-premium animate-fade-in-up opacity-0 stagger-6 cursor-pointer hover:shadow-lg hover:border-teal-500/50"
        >
          <div className="size-10 rounded-lg bg-teal-500/10 flex items-center justify-center">
            <CheckCircle2 className="size-5 text-teal-400" />
          </div>
          <div>
            <p className="text-lg font-bold text-white">
              {completedAppointments}
            </p>
            <p className="text-xs text-slate-400">Completed</p>
          </div>
        </Link>
        <Link
          href="/admin/appointments?status=SCHEDULED"
          className="glass-card rounded-xl p-4 flex items-center gap-3 hover:scale-[1.02] transition-premium animate-fade-in-up opacity-0 stagger-7 cursor-pointer hover:shadow-lg hover:border-teal-500/50"
        >
          <div className="size-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
            <Clock className="size-5 text-amber-400" />
          </div>
          <div>
            <p className="text-lg font-bold text-white">
              {upcomingAppointments}
            </p>
            <p className="text-xs text-slate-400">Upcoming</p>
          </div>
        </Link>
        <Link
          href="/admin/appointments?status=CANCELLED"
          className="glass-card rounded-xl p-4 flex items-center gap-3 hover:scale-[1.02] transition-premium animate-fade-in-up opacity-0 stagger-8 cursor-pointer hover:shadow-lg hover:border-teal-500/50"
        >
          <div className="size-10 rounded-lg bg-red-500/10 flex items-center justify-center">
            <CalendarX className="size-5 text-red-400" />
          </div>
          <div>
            <p className="text-lg font-bold text-white">
              {cancelledAppointments}
            </p>
            <p className="text-xs text-slate-400">Cancelled</p>
          </div>
        </Link>
      </div>

      {/* Today's Appointments with Checkout */}
      <TodayAppointments initialAppointments={serializedToday} />

      {/* Recent Appointments Table */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
          <h2 className="text-lg font-semibold text-white">
            Recent Appointments
          </h2>
          <Link
            href="/admin/appointments"
            className="text-sm text-teal-400 hover:text-teal-300 font-medium transition-premium"
          >
            View All →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-white/[0.03]">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Patient
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Treatment
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Price
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {recentAppointments.map((apt) => (
                <tr
                  key={apt.id}
                  className="hover:bg-white/[0.03] transition-premium cursor-pointer"
                >
                  <td className="px-6 py-4 font-medium text-slate-200">
                    {apt.patient?.name || "Unknown"}
                  </td>
                  <td className="px-6 py-4 text-slate-400">
                    {apt.treatment?.name}
                  </td>
                  <td className="px-6 py-4 text-slate-400">
                    {formatDate(apt.startTime, "short")},{" "}
                    {formatTime(apt.startTime)}
                  </td>
                  <td className="px-6 py-4 text-teal-400 font-semibold">
                    {formatPKR(apt.treatment?.price || 0)}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={apt.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AnimatedDashboard>
  )
}
