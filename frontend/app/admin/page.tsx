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
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Dashboard</h1>
        <p className="text-sm text-slate-600 font-medium mt-0.5">
          Welcome back! Here&apos;s what&apos;s happening today.
        </p>
      </div>

      {/* Revenue Cards — Top Priority */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Realized Revenue */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs border-l-4 border-l-emerald-600 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Realized Revenue
              </p>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">
                {formatPKR(realizedRevenue)}
              </p>
              <p className="text-[11px] text-emerald-700 font-semibold mt-1">
                ✓ Completed visits only
              </p>
            </div>
            <div className="size-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <DollarSign className="size-6" />
            </div>
          </div>
        </div>

        {/* Projected Revenue */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs border-l-4 border-l-sky-500 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Projected Revenue
              </p>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">
                {formatPKR(projectedRevenue)}
              </p>
              <p className="text-[11px] text-sky-700 font-semibold mt-1">
                Scheduled + Completed
              </p>
            </div>
            <div className="size-12 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600">
              <TrendingUp className="size-6" />
            </div>
          </div>
        </div>

        {/* Monthly Revenue */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs border-l-4 border-l-teal-600 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                This Month
              </p>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">
                {formatPKR(monthRevenue)}
              </p>
              <p className="text-[11px] text-teal-700 font-semibold mt-1">
                Realized this month
              </p>
            </div>
            <div className="size-12 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600">
              <CalendarCheck className="size-6" />
            </div>
          </div>
        </div>

        {/* Today */}
        <Link
          href="/admin/appointments?filter=today"
          className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs border-l-4 border-l-amber-500 hover:shadow-md transition-all block cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Today
              </p>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">
                {appointmentsToday}
              </p>
              <p className="text-[11px] text-amber-800 font-semibold mt-1">
                appointments today
              </p>
            </div>
            <div className="size-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
              <Clock className="size-6" />
            </div>
          </div>
        </Link>
      </div>

      {/* Mini Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/admin/patients"
          className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex items-center gap-3 hover:shadow-md hover:border-slate-300 transition-all cursor-pointer"
        >
          <div className="size-10 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600">
            <Users className="size-5" />
          </div>
          <div>
            <p className="text-xl font-extrabold text-slate-900">{totalPatients}</p>
            <p className="text-xs font-medium text-slate-600">Total Patients</p>
          </div>
        </Link>
        <Link
          href="/admin/appointments?status=COMPLETED"
          className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex items-center gap-3 hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer"
        >
          <div className="size-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="size-5" />
          </div>
          <div>
            <p className="text-xl font-extrabold text-slate-900">
              {completedAppointments}
            </p>
            <p className="text-xs font-medium text-slate-600">Completed</p>
          </div>
        </Link>
        <Link
          href="/admin/appointments?status=SCHEDULED"
          className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex items-center gap-3 hover:shadow-md hover:border-amber-300 transition-all cursor-pointer"
        >
          <div className="size-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
            <Clock className="size-5" />
          </div>
          <div>
            <p className="text-xl font-extrabold text-slate-900">
              {upcomingAppointments}
            </p>
            <p className="text-xs font-medium text-slate-600">Upcoming</p>
          </div>
        </Link>
        <Link
          href="/admin/appointments?status=CANCELLED"
          className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex items-center gap-3 hover:shadow-md hover:border-rose-300 transition-all cursor-pointer"
        >
          <div className="size-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
            <CalendarX className="size-5" />
          </div>
          <div>
            <p className="text-xl font-extrabold text-slate-900">
              {cancelledAppointments}
            </p>
            <p className="text-xs font-medium text-slate-600">Cancelled</p>
          </div>
        </Link>
      </div>

      {/* Today's Appointments with Checkout */}
      <TodayAppointments initialAppointments={serializedToday} />

      {/* Recent Appointments Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200/90 bg-slate-50/70">
          <h2 className="text-base font-bold text-slate-900">
            Recent Appointments
          </h2>
          <Link
            href="/admin/appointments"
            className="text-sm text-teal-700 hover:text-teal-800 font-semibold transition-colors"
          >
            View All →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50/90 border-b border-slate-200/90">
              <tr>
                <th className="text-left px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="text-left px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Treatment
                </th>
                <th className="text-left px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="text-left px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="text-left px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {recentAppointments.map((apt) => (
                <tr
                  key={apt.id}
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4 font-semibold text-slate-900">
                    {apt.patient?.name || "Unknown"}
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-medium">
                    {apt.treatment?.name}
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-medium">
                    {formatDate(apt.startTime, "short")},{" "}
                    {formatTime(apt.startTime)}
                  </td>
                  <td className="px-6 py-4 text-teal-700 font-bold">
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
