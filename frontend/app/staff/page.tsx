import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  EventAvailableOutlined,
  AccessTimeOutlined,
  PeopleAltOutlined,
  AddOutlined,
  CalendarMonthOutlined,
  PhoneOutlined,
  CheckCircleOutlineOutlined,
  ArrowForwardOutlined,
  TrendingUpOutlined,
  WbTwilightOutlined,
} from "@mui/icons-material";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatTime } from "@/lib/utils";
import TodayAppointments from "@/components/shared/TodayAppointments";

async function getSession() {
  const cookie = (await cookies()).get("session")?.value;
  if (!cookie) return null;
  try {
    return await decrypt(cookie);
  } catch {
    return null;
  }
}

export default async function StaffDashboard() {
  const session = await getSession();
  if (!session) redirect("/login");

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayEnd = new Date(todayStart.getTime() + 86400000);
  const tomorrowStart = new Date(todayEnd);
  const tomorrowEnd = new Date(tomorrowStart.getTime() + 86400000);

  const [
    todayAppointments,
    tomorrowAppointments,
    todayCompleted,
    upcomingCount,
    totalPatients,
  ] = await Promise.all([
    prisma.appointment.findMany({
      where: { startTime: { gte: todayStart, lt: todayEnd }, status: { not: "CANCELLED" } },
      include: {
        patient: { select: { id: true, name: true, phone: true, email: true } },
        treatment: { select: { name: true, durationMin: true, price: true } },
      },
      orderBy: { startTime: "asc" },
    }),
    prisma.appointment.findMany({
      where: { startTime: { gte: tomorrowStart, lt: tomorrowEnd }, status: { not: "CANCELLED" } },
      include: {
        patient: { select: { id: true, name: true, phone: true } },
        treatment: { select: { name: true, durationMin: true } },
      },
      orderBy: { startTime: "asc" },
    }),
    prisma.appointment.count({
      where: { startTime: { gte: todayStart, lt: todayEnd }, status: "COMPLETED" },
    }),
    prisma.appointment.count({
      where: { startTime: { gte: now }, status: "SCHEDULED" },
    }),
    prisma.user.count({ where: { role: "PATIENT" } }),
  ]);

  const todayTotal = todayAppointments.length;
  const remainingToday = todayAppointments.filter(
    (a) => new Date(a.startTime) >= now && a.status === "SCHEDULED"
  ).length;
  const tomorrowTotal = tomorrowAppointments.length;

  const nextAppointment = todayAppointments.find(
    (apt) => new Date(apt.startTime) > now && apt.status === "SCHEDULED"
  );

  const serializedToday = todayAppointments.map((a) => ({
    id: a.id,
    startTime: a.startTime.toISOString(),
    endTime: a.endTime.toISOString(),
    status: a.status,
    amountPaid: a.amountPaid || 0,
    patient: a.patient,
    treatment: a.treatment,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Reception Dashboard</h1>
          <p className="text-slate-600 text-sm font-medium flex items-center gap-2 mt-1">
            <CalendarMonthOutlined sx={{ fontSize: 16, color: "#0d9488" }} />
            {formatDate(now, "long")}
          </p>
        </div>
        <Button asChild className="bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl shadow-xs transition-premium active:scale-95">
          <Link href="/staff/book">
            <AddOutlined sx={{ fontSize: 18, mr: 1 }} />
            Book Appointment
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Link href="/staff/appointments?filter=today" className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs border-l-4 border-l-sky-500 cursor-pointer block hover:shadow-md transition-all">
          <div className="flex items-center gap-2 text-sky-700 mb-1">
            <EventAvailableOutlined sx={{ fontSize: 16 }} />
            <span className="text-xs font-bold uppercase tracking-wider">Today</span>
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{todayTotal}</p>
          <p className="text-xs text-slate-500 font-medium mt-0.5">appointments</p>
        </Link>
        <Link href="/staff/appointments?status=SCHEDULED&filter=today" className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs border-l-4 border-l-amber-500 cursor-pointer block hover:shadow-md transition-all">
          <div className="flex items-center gap-2 text-amber-800 mb-1">
            <AccessTimeOutlined sx={{ fontSize: 16 }} />
            <span className="text-xs font-bold uppercase tracking-wider">Remaining</span>
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{remainingToday}</p>
          <p className="text-xs text-slate-500 font-medium mt-0.5">left today</p>
        </Link>
        <Link href="/staff/appointments?status=COMPLETED&filter=today" className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs border-l-4 border-l-emerald-600 cursor-pointer block hover:shadow-md transition-all">
          <div className="flex items-center gap-2 text-emerald-700 mb-1">
            <CheckCircleOutlineOutlined sx={{ fontSize: 16 }} />
            <span className="text-xs font-bold uppercase tracking-wider">Done</span>
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{todayCompleted}</p>
          <p className="text-xs text-slate-500 font-medium mt-0.5">completed</p>
        </Link>
        <Link href="/staff/appointments?filter=tomorrow" className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs border-l-4 border-l-teal-600 cursor-pointer block hover:shadow-md transition-all">
          <div className="flex items-center gap-2 text-teal-700 mb-1">
            <WbTwilightOutlined sx={{ fontSize: 16 }} />
            <span className="text-xs font-bold uppercase tracking-wider">Tomorrow</span>
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{tomorrowTotal}</p>
          <p className="text-xs text-slate-500 font-medium mt-0.5">booked</p>
        </Link>
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs border-l-4 border-l-slate-400">
          <div className="flex items-center gap-2 text-slate-600 mb-1">
            <PeopleAltOutlined sx={{ fontSize: 16 }} />
            <span className="text-xs font-bold uppercase tracking-wider">Patients</span>
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{totalPatients}</p>
          <p className="text-xs text-slate-500 font-medium mt-0.5">total seen</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Today's Schedule */}
        <div className="lg:col-span-2 space-y-6">
          {/* Next Patient */}
          {nextAppointment && (
            <div className="bg-white rounded-2xl border border-teal-200 shadow-xs overflow-hidden border-l-4 border-l-teal-600">
              <div className="px-6 py-5">
                <div className="flex justify-between items-start">
                  <div>
                    <Badge className="bg-teal-50 text-teal-800 border-teal-200 hover:bg-teal-100 font-bold mb-2">
                      Next Patient
                    </Badge>
                    <p className="text-2xl font-extrabold text-slate-900">
                      {formatTime(nextAppointment.startTime)}
                    </p>
                    <p className="text-sm text-slate-600 font-medium">
                      Starts in{" "}
                      {Math.max(
                        1,
                        Math.round(
                          (new Date(nextAppointment.startTime).getTime() - now.getTime()) /
                            60000
                        )
                      )}{" "}
                      minutes
                    </p>
                  </div>
                  <div className="size-12 rounded-full bg-teal-50 flex items-center justify-center text-teal-700 font-bold text-lg border border-teal-200">
                    {nextAppointment.patient.name?.charAt(0)}
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-bold text-slate-900">
                    {nextAppointment.patient.name}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-slate-600 font-medium mt-1">
                    <span className="flex items-center gap-1">
                      <AccessTimeOutlined sx={{ fontSize: 14, color: "#0d9488" }} />
                      {nextAppointment.treatment.durationMin} min
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircleOutlineOutlined sx={{ fontSize: 14, color: "#0d9488" }} />
                      {nextAppointment.treatment.name}
                    </span>
                  </div>
                  {nextAppointment.patient?.phone && (
                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2 text-sm text-slate-700 font-medium">
                      <PhoneOutlined sx={{ fontSize: 16, color: "#0d9488" }} />
                      <span>{nextAppointment.patient.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Today's Appointments with Check Out */}
          <TodayAppointments initialAppointments={serializedToday} />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Tomorrow's Preview */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200/90 bg-slate-50/70 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <WbTwilightOutlined sx={{ fontSize: 16, color: "#0d9488" }} />
                Tomorrow
              </h3>
              <Badge className="bg-teal-50 text-teal-800 border-teal-200 hover:bg-teal-100 font-bold">
                {tomorrowTotal}
              </Badge>
            </div>
            <div className="p-6">
              {tomorrowAppointments.length === 0 ? (
                <p className="text-sm text-slate-500 font-medium text-center py-4">
                  No appointments booked yet
                </p>
              ) : (
                <div className="space-y-2.5">
                  {tomorrowAppointments.slice(0, 5).map((apt) => (
                    <div
                      key={apt.id}
                      className="flex items-center gap-3 py-1.5"
                    >
                      <div className="text-xs font-bold text-slate-600 w-14">
                        {formatTime(apt.startTime)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">
                          {apt.patient.name}
                        </p>
                        <p className="text-xs text-slate-500 font-medium truncate">
                          {apt.treatment.name}
                        </p>
                      </div>
                    </div>
                  ))}
                  {tomorrowAppointments.length > 5 && (
                    <p className="text-xs text-slate-500 font-medium text-center pt-1">
                      +{tomorrowAppointments.length - 5} more
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200/90 bg-slate-50/70">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <TrendingUpOutlined sx={{ fontSize: 16, color: "#0d9488" }} />
                Overview
              </h3>
            </div>
            <div className="p-6 space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-sm text-slate-600 font-medium">Upcoming Total</span>
                <span className="text-sm font-bold text-slate-900">{upcomingCount}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-sm text-slate-600 font-medium">Total Patients</span>
                <span className="text-sm font-bold text-slate-900">{totalPatients}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-slate-600 font-medium">Completed Today</span>
                <span className="text-sm font-bold text-teal-700">{todayCompleted}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200/90 bg-slate-50/70">
              <h3 className="text-sm font-bold text-slate-900">Quick Actions</h3>
            </div>
            <div className="p-6 space-y-2">
              <Button
                asChild
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl justify-start h-11 transition-premium active:scale-[0.98] shadow-xs"
              >
                <Link href="/staff/book">
                  <AddOutlined sx={{ fontSize: 18, mr: 1.5 }} />
                  Book New Appointment
                </Link>
              </Button>
              <Button
                asChild
                variant="secondary"
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold justify-start h-11 border border-slate-200/80 rounded-xl transition-premium"
              >
                <Link href="/staff/appointments">
                  <EventAvailableOutlined sx={{ fontSize: 18, mr: 1.5, color: "#0d9488" }} />
                  View All Appointments
                  <ArrowForwardOutlined sx={{ fontSize: 16, ml: "auto", color: "#64748b" }} />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
