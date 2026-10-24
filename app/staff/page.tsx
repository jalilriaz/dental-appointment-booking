import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
    CalendarCheck,
    Clock,
    Users,
    Plus,
    Calendar,
    Phone,
    CheckCircle2,
    ArrowRight,
    TrendingUp,
    Sunrise,
} from "lucide-react";
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
                    <h1 className="text-2xl font-bold text-white tracking-tight">Reception Dashboard</h1>
                    <p className="text-slate-400 text-sm flex items-center gap-2 mt-1">
                        <Calendar className="size-4" />
                        {formatDate(now, "long")}
                    </p>
                </div>
                <Button asChild className="btn-brand border-0 rounded-full transition-premium active:scale-95">
                    <Link href="/staff/book">
                        <Plus className="size-4 mr-2" />
                        Book Appointment
                    </Link>
                </Button>
            </div>

            {/* Stats Cards — Dark Glass */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <Link href="/staff/appointments?filter=today" className="glass-card rounded-xl p-4 border-l-2 border-l-blue-400 cursor-pointer block hover:scale-[1.02] hover:shadow-lg transition-premium">
                    <div className="flex items-center gap-2 text-blue-400 mb-1">
                        <CalendarCheck className="size-4" />
                        <span className="text-xs font-semibold uppercase tracking-wide">Today</span>
                    </div>
                    <p className="text-3xl font-bold text-white">{todayTotal}</p>
                    <p className="text-xs text-slate-400 mt-0.5">appointments</p>
                </Link>
                <Link href="/staff/appointments?status=SCHEDULED&filter=today" className="glass-card rounded-xl p-4 border-l-2 border-l-amber-400 cursor-pointer block hover:scale-[1.02] hover:shadow-lg transition-premium">
                    <div className="flex items-center gap-2 text-amber-400 mb-1">
                        <Clock className="size-4" />
                        <span className="text-xs font-semibold uppercase tracking-wide">Remaining</span>
                    </div>
                    <p className="text-3xl font-bold text-white">{remainingToday}</p>
                    <p className="text-xs text-slate-400 mt-0.5">left today</p>
                </Link>
                <Link href="/staff/appointments?status=COMPLETED&filter=today" className="glass-card rounded-xl p-4 border-l-2 border-l-teal-400 cursor-pointer block hover:scale-[1.02] hover:shadow-lg transition-premium">
                    <div className="flex items-center gap-2 text-teal-400 mb-1">
                        <CheckCircle2 className="size-4" />
                        <span className="text-xs font-semibold uppercase tracking-wide">Done</span>
                    </div>
                    <p className="text-3xl font-bold text-white">{todayCompleted}</p>
                    <p className="text-xs text-slate-400 mt-0.5">completed</p>
                </Link>
                <Link href="/staff/appointments?filter=tomorrow" className="glass-card rounded-xl p-4 border-l-2 border-l-purple-400 cursor-pointer block hover:scale-[1.02] hover:shadow-lg transition-premium">
                    <div className="flex items-center gap-2 text-purple-400 mb-1">
                        <Sunrise className="size-4" />
                        <span className="text-xs font-semibold uppercase tracking-wide">Tomorrow</span>
                    </div>
                    <p className="text-3xl font-bold text-white">{tomorrowTotal}</p>
                    <p className="text-xs text-slate-400 mt-0.5">booked</p>
                </Link>
                <div className="glass-card rounded-xl p-4 border-l-2 border-l-cyan-400">
                    <div className="flex items-center gap-2 text-cyan-400 mb-1">
                        <Users className="size-4" />
                        <span className="text-xs font-semibold uppercase tracking-wide">Patients</span>
                    </div>
                    <p className="text-3xl font-bold text-white">{totalPatients}</p>
                    <p className="text-xs text-slate-400 mt-0.5">total seen</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Today's Schedule */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Next Patient */}
                    {nextAppointment && (
                        <div className="glass-card rounded-xl overflow-hidden border-l-2 border-l-teal-400 glow-border-teal">
                            <div className="px-6 py-5">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <Badge className="bg-teal-500/10 text-teal-400 border-teal-500/20 hover:bg-teal-500/15 mb-2">
                                            Next Patient
                                        </Badge>
                                        <p className="text-xl font-bold text-white">
                                            {formatTime(nextAppointment.startTime)}
                                        </p>
                                        <p className="text-sm text-slate-400">
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
                                    <div className="size-12 rounded-full bg-teal-500/10 flex items-center justify-center text-teal-400 font-bold text-lg border border-teal-500/20">
                                        {nextAppointment.patient.name?.charAt(0)}
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <h3 className="text-lg font-semibold text-white">
                                        {nextAppointment.patient.name}
                                    </h3>
                                    <div className="flex items-center gap-4 text-sm text-slate-400 mt-1">
                                        <span className="flex items-center gap-1">
                                            <Clock className="size-3.5" />
                                            {nextAppointment.treatment.durationMin} min
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <CheckCircle2 className="size-3.5" />
                                            {nextAppointment.treatment.name}
                                        </span>
                                    </div>
                                    {nextAppointment.patient?.phone && (
                                        <div className="mt-3 pt-3 border-t border-white/[0.06] flex items-center gap-2 text-sm text-slate-400">
                                            <Phone className="size-4 text-teal-400" />
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
                    <div className="glass-card rounded-xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
                            <h3 className="text-base font-semibold text-white flex items-center gap-2">
                                <Sunrise className="size-4 text-purple-400" />
                                Tomorrow
                            </h3>
                            <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20 hover:bg-purple-500/15">
                                {tomorrowTotal}
                            </Badge>
                        </div>
                        <div className="p-6">
                            {tomorrowAppointments.length === 0 ? (
                                <p className="text-sm text-slate-400 text-center py-4">
                                    No appointments booked yet
                                </p>
                            ) : (
                                <div className="space-y-2.5">
                                    {tomorrowAppointments.slice(0, 5).map((apt) => (
                                        <div
                                            key={apt.id}
                                            className="flex items-center gap-3 py-1.5"
                                        >
                                            <div className="text-xs font-semibold text-slate-400 w-14">
                                                {formatTime(apt.startTime)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-white truncate">
                                                    {apt.patient.name}
                                                </p>
                                                <p className="text-xs text-slate-400 truncate">
                                                    {apt.treatment.name}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                    {tomorrowAppointments.length > 5 && (
                                        <p className="text-xs text-slate-400 text-center pt-1">
                                            +{tomorrowAppointments.length - 5} more
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="glass-card rounded-xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-white/[0.06]">
                            <h3 className="text-base font-semibold text-white flex items-center gap-2">
                                <TrendingUp className="size-4 text-blue-400" />
                                Overview
                            </h3>
                        </div>
                        <div className="p-6 space-y-3">
                            <div className="flex justify-between items-center py-2 border-b border-white/[0.04]">
                                <span className="text-sm text-slate-400">Upcoming Total</span>
                                <span className="text-sm font-bold text-white">{upcomingCount}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-white/[0.04]">
                                <span className="text-sm text-slate-400">Total Patients</span>
                                <span className="text-sm font-bold text-white">{totalPatients}</span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <span className="text-sm text-slate-400">Completed Today</span>
                                <span className="text-sm font-bold text-teal-400">{todayCompleted}</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="glass-card rounded-xl overflow-hidden glow-border-teal">
                        <div className="px-6 py-4 border-b border-white/[0.06]">
                            <h3 className="text-base font-semibold text-white">Quick Actions</h3>
                        </div>
                        <div className="p-6 space-y-2">
                            <Button
                                asChild
                                className="w-full btn-brand border-0 justify-start h-11 transition-premium active:scale-[0.98]"
                            >
                                <Link href="/staff/book">
                                    <Plus className="size-4 mr-3" />
                                    Book New Appointment
                                </Link>
                            </Button>
                            <Button
                                asChild
                                variant="secondary"
                                className="w-full bg-white/[0.04] hover:bg-white/[0.06] text-slate-200 justify-start h-11 border border-white/[0.06] transition-premium"
                            >
                                <Link href="/staff/appointments">
                                    <CalendarCheck className="size-4 mr-3" />
                                    View All Appointments
                                    <ArrowRight className="size-4 ml-auto" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
