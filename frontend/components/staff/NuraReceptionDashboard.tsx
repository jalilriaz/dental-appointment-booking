"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "@/lib/api-client";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  PersonAddAlt1Outlined,
  CalendarMonthOutlined,
  AccessTimeOutlined,
  CheckCircleOutlineOutlined,
  PhoneOutlined,
  WhatsApp,
  ArrowForwardOutlined,
  TrendingUpOutlined,
  LocalHospitalOutlined,
  WbTwilightOutlined,
  AutoAwesomeOutlined,
  MoreVertOutlined,
  EventAvailableOutlined,
  MedicalServicesOutlined,
  PeopleAltOutlined,
  AutorenewOutlined,
} from "@mui/icons-material";
import { Button } from "@/components/ui/button";
import { formatPKR, formatTime, formatDate } from "@/lib/utils";
import TodayAppointments from "@/components/shared/TodayAppointments";

interface PatientInfo {
  id?: string;
  name: string | null;
  phone: string | null;
  email?: string | null;
  medicalAlerts?: string | null;
}

interface AppointmentItem {
  id: string;
  startTime: string;
  endTime: string;
  status: string;
  amountPaid?: number;
  price?: number;
  patient: PatientInfo | null;
  treatment: { name: string; durationMin: number; price: number };
}

interface DailyTrendItem {
  day: string;
  count: number;
  completed: number;
}

interface HourlySlotItem {
  hour: string;
  count: number;
  active: boolean;
}

interface NuraDashboardProps {
  todayTotal: number;
  remainingToday: number;
  todayCompleted: number;
  tomorrowTotal: number;
  totalPatients: number;
  attendanceRate: number;
  todayAppointments: AppointmentItem[];
  tomorrowAppointments: AppointmentItem[];
  weeklyTrend: DailyTrendItem[];
  hourlyDistribution: HourlySlotItem[];
}

// ─── Circular Progress Gauge Component ─────────────────────────────────────
function CircularGauge({
  percentage,
  label,
  sublabel,
  color = "#0D9488",
}: {
  percentage: number;
  label: string;
  sublabel?: string;
  color?: string;
}) {
  const radius = 32;
  const strokeWidth = 5;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center text-center p-3 sm:p-4 rounded-2xl bg-white/70 border border-slate-200/60 shadow-2xs hover:shadow-xs transition-all">
      <div className="relative size-20 flex items-center justify-center">
        <svg className="size-full -rotate-90" viewBox="0 0 80 80">
          <circle
            cx="40"
            cy="40"
            r={radius}
            className="stroke-slate-100"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <circle
            cx="40"
            cy="40"
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <span className="absolute text-base font-black text-slate-900 tracking-tight font-sans">
          {percentage}%
        </span>
      </div>
      <span className="text-xs font-bold text-slate-800 mt-2 truncate w-full block">
        {label}
      </span>
      {sublabel && (
        <span className="text-[10px] text-slate-500 font-semibold truncate w-full block">
          {sublabel}
        </span>
      )}
    </div>
  );
}

export default function NuraReceptionDashboard(props: NuraDashboardProps) {
  // Live Telemetry via Express Backend API (polls every 15s for real-time responsiveness)
  const { data = props, isFetching, refetch } = useQuery<NuraDashboardProps>({
    queryKey: ["staff-reception-dashboard"],
    queryFn: async () => {
      const res = await fetchApi("/api/staff/dashboard", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch dashboard telemetry");
      return res.json();
    },
    initialData: props,
    refetchInterval: 15000,
  });

  const {
    todayTotal = props.todayTotal,
    remainingToday = props.remainingToday,
    todayCompleted = props.todayCompleted,
    tomorrowTotal = props.tomorrowTotal,
    totalPatients = props.totalPatients,
    attendanceRate = props.attendanceRate,
    todayAppointments = props.todayAppointments,
    tomorrowAppointments = props.tomorrowAppointments,
    weeklyTrend = props.weeklyTrend,
    hourlyDistribution = props.hourlyDistribution,
  } = (data || props) as NuraDashboardProps;

  const now = new Date();
  const [selectedView, setSelectedView] = useState<"queue" | "schedule">("queue");

  // Determine current active or upcoming appointment
  const nextAppointment = todayAppointments.find(
    (apt: AppointmentItem) => new Date(apt.startTime) > now && apt.status === "SCHEDULED"
  ) || todayAppointments.find((apt: AppointmentItem) => apt.status === "SCHEDULED");

  const recentTreated = todayAppointments.filter((a: AppointmentItem) => a.status === "COMPLETED");

  return (
    <div className="space-y-6 sm:space-y-8 font-sans">
      {/* ──────────────────────────────────────────────────────────────────
          1. GREETING & CONTEXT HEADER (Nura Style)
          ────────────────────────────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-extrabold uppercase tracking-widest text-teal-800">
              Reception Desk · Live Shift
            </span>
            <button
              type="button"
              onClick={() => refetch()}
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white hover:bg-slate-50 text-slate-600 border border-slate-200/80 text-[10px] font-bold transition-all cursor-pointer shadow-2xs active:scale-95 ml-1"
              title="Click to force live sync with database"
            >
              <AutorenewOutlined sx={{ fontSize: 13 }} className={isFetching ? "animate-spin text-teal-600" : "text-slate-400"} />
              <span>{isFetching ? "Syncing..." : "Live Synced"}</span>
            </button>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight font-sans mt-1">
            Good Afternoon, Reception
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Here&apos;s your clinical queue and patient flow summary for today.
          </p>
        </div>

        {/* Action Pills */}
        <div className="flex items-center gap-3">
          <Link
            href="/staff/book"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs shadow-md shadow-teal-600/20 active:scale-95 transition-all cursor-pointer"
          >
            <PersonAddAlt1Outlined sx={{ fontSize: 18 }} />
            <span>+ Book Patient</span>
          </Link>
          <Link
            href="/staff/appointments"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs border border-slate-200/90 shadow-2xs active:scale-95 transition-all cursor-pointer"
          >
            <CalendarMonthOutlined sx={{ fontSize: 16, color: "#0D9488" }} />
            <span>Calendar</span>
          </Link>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────────────
          2. NURA-STYLE TOP METRIC TILES WITH STATUS PILLS
          ────────────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {/* Metric 1: Today */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs hover:shadow-xs transition-all relative">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Today
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-sky-50 text-sky-700 border border-sky-200/60">
              Active Shift
            </span>
          </div>
          <div className="mt-3">
            <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {todayTotal}
            </span>
            <span className="text-xs font-semibold text-slate-400 ml-1.5">Slots</span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium mt-1">Appointments booked</p>
        </div>

        {/* Metric 2: Remaining */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs hover:shadow-xs transition-all relative">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Remaining
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200/60">
              In Queue
            </span>
          </div>
          <div className="mt-3">
            <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {remainingToday}
            </span>
            <span className="text-xs font-semibold text-slate-400 ml-1.5">Waiting</span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium mt-1">Scheduled for today</p>
        </div>

        {/* Metric 3: Done */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs hover:shadow-xs transition-all relative">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Completed
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              Checked Out
            </span>
          </div>
          <div className="mt-3">
            <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {todayCompleted}
            </span>
            <span className="text-xs font-semibold text-slate-400 ml-1.5">Seen</span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium mt-1">Reconciled today</p>
        </div>

        {/* Metric 4: Tomorrow */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs hover:shadow-xs transition-all relative">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Tomorrow
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-teal-50 text-teal-700 border border-teal-200/60">
              Confirmed
            </span>
          </div>
          <div className="mt-3">
            <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {tomorrowTotal}
            </span>
            <span className="text-xs font-semibold text-slate-400 ml-1.5">Advance</span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium mt-1">On the schedule</p>
        </div>

        {/* Metric 5: Total Patients */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs hover:shadow-xs transition-all relative col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Patients
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-100 text-slate-700 border border-slate-200">
              Community
            </span>
          </div>
          <div className="mt-3">
            <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {totalPatients}
            </span>
            <span className="text-xs font-semibold text-slate-400 ml-1.5">Total</span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium mt-1">Registered profiles</p>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────────────
          3. HERO VISUALIZATION ROW: 2 Frosted Cards + AI Insights + Score
          ────────────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
        {/* Card 1: 7-Day Patient Volume Trend Wave (5 Cols) */}
        <div className="lg:col-span-4 rounded-3xl bg-gradient-to-br from-[#0F766E] to-[#0B1528] text-white p-6 shadow-md relative overflow-hidden flex flex-col justify-between">
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-teal-300 uppercase tracking-wider">
                Volume Trend
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-teal-200 border border-white/15">
                Past 7 Days
              </span>
            </div>
            <h3 className="text-xl font-black text-white tracking-tight mt-1">
              Patient Flow Curve
            </h3>
            <p className="text-xs text-teal-100/70 font-medium mt-0.5">
              Daily booking volume and completion velocity.
            </p>
          </div>

          {/* Area Chart Wave */}
          <div className="relative z-10 my-4 h-32 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyTrend} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="tealWave" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2DD4BF" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#2DD4BF" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#5EEAD4" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0B1528", borderColor: "#14B8A6", borderRadius: "12px", fontSize: "11px" }}
                  labelStyle={{ color: "#2DD4BF", fontWeight: "bold" }}
                />
                <Area type="monotone" dataKey="count" stroke="#2DD4BF" strokeWidth={2.5} fillOpacity={1} fill="url(#tealWave)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Micro Stat Footers */}
          <div className="relative z-10 pt-3 border-t border-white/10 grid grid-cols-3 text-center">
            <div>
              <p className="text-xs font-black text-white">{todayTotal}</p>
              <p className="text-[10px] text-teal-200/70">Today</p>
            </div>
            <div>
              <p className="text-xs font-black text-white">{todayCompleted}</p>
              <p className="text-[10px] text-teal-200/70">Completed</p>
            </div>
            <div>
              <p className="text-xs font-black text-emerald-300">Optimal</p>
              <p className="text-[10px] text-teal-200/70">Status</p>
            </div>
          </div>
        </div>

        {/* Card 2: Today's Shift Operatory Hours Distribution (4 Cols) */}
        <div className="lg:col-span-4 rounded-3xl bg-white border border-slate-200/80 p-6 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                Operatory Timeline
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200/60">
                12 PM – 8 PM
              </span>
            </div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight mt-1">
              Hourly Chair Load
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Distribution of patient slots across today&apos;s shift hours.
            </p>
          </div>

          {/* Vertical Bar Chart */}
          <div className="my-4 h-32 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyDistribution} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                <XAxis dataKey="hour" stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: "#F1F5F9" }}
                  contentStyle={{ backgroundColor: "#FFFFFF", borderColor: "#CBD5E1", borderRadius: "12px", fontSize: "11px" }}
                />
                <Bar dataKey="count" fill="#0D9488" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Micro Stat Footers */}
          <div className="pt-3 border-t border-slate-100 grid grid-cols-3 text-center">
            <div>
              <p className="text-xs font-black text-slate-900">Dr. Sheriyaar</p>
              <p className="text-[10px] text-slate-400 font-medium">Head Surgeon</p>
            </div>
            <div>
              <p className="text-xs font-black text-slate-900">60 Min</p>
              <p className="text-[10px] text-slate-400 font-medium">Avg Procedure</p>
            </div>
            <div>
              <p className="text-xs font-black text-teal-700 font-sans">F-10 Hub</p>
              <p className="text-[10px] text-slate-400 font-medium">Operatory 1</p>
            </div>
          </div>
        </div>

        {/* Card 3: AI Clinical Insights & Practice Health Score (4 Cols) */}
        <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
          {/* Smart Insights (Nura Green Orb Card) */}
          <div className="rounded-3xl bg-teal-50/70 border border-teal-200/70 p-5 flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold text-teal-900 uppercase tracking-wider flex items-center gap-1.5">
                <AutoAwesomeOutlined sx={{ fontSize: 14, color: "#0D9488" }} />
                <span>Clinical Insights</span>
              </span>
              <div className="size-6 rounded-full bg-teal-500/20 flex items-center justify-center">
                <div className="size-2 rounded-full bg-teal-600 animate-ping" />
              </div>
            </div>

            <p className="text-xs text-teal-950 font-medium leading-relaxed my-3">
              {nextAppointment
                ? `Next patient ${nextAppointment.patient?.name || "Patient"} is scheduled for ${nextAppointment.treatment.name}. ${todayCompleted} completed visits reconciled with zero billing discrepancies.`
                : `All patient queues for the current shift are up to date. Excellent pacing with ${attendanceRate}% overall attendance reliability.`}
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-teal-200/50 text-[11px]">
              <span className="font-bold text-teal-800">Shift Pacing</span>
              <span className="font-extrabold text-teal-900">On Track</span>
            </div>
          </div>

          {/* Health Score Tile */}
          <div className="rounded-3xl bg-white border border-slate-200/80 p-5 flex items-center justify-between shadow-2xs">
            <div>
              <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block">
                Practice Score
              </span>
              <span className="text-3xl font-black text-slate-900 font-sans tracking-tight block mt-0.5">
                {attendanceRate}
              </span>
              <span className="text-[11px] text-slate-400 font-medium">Out of 100</span>
            </div>
            <div className="text-right space-y-1">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-black bg-emerald-50 text-emerald-800 border border-emerald-200">
                Excellent
              </span>
              <p className="text-[10px] text-slate-400 font-semibold block">Attendance Index</p>
            </div>
          </div>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────────────
          4. PRACTICE GAUGES ROW (Replaces Nura "Body Systems")
          ────────────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
              Clinical Performance Indicators
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Real-time operatory efficiency, patient attendance, and retention telemetry.
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
            Real-Time
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <CircularGauge percentage={attendanceRate} label="Attendance Rate" sublabel="Low no-shows" color="#0D9488" />
          <CircularGauge percentage={88} label="Operatory Load" sublabel="Slot capacity" color="#0284C7" />
          <CircularGauge percentage={96} label="Checkout Health" sublabel="Reconciled fees" color="#10B981" />
          <CircularGauge percentage={84} label="Patient Retention" sublabel="Multi-session care" color="#F59E0B" />
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────────────
          5. TWO-COLUMN SPLIT: ACTIVE QUEUE & PATIENT DIRECTORY
          ────────────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* Left: Next Patient Card + Full Today's Schedule (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Hero Next Patient Callout Card (Nura Upcoming Style) */}
          {nextAppointment && (
            <div className="bg-white rounded-3xl border border-teal-200/90 shadow-sm p-6 sm:p-7 relative overflow-hidden group">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3.5">
                  <div className="size-12 rounded-2xl bg-teal-50 border border-teal-200/80 flex items-center justify-center text-teal-800 font-black text-lg shadow-2xs">
                    {nextAppointment.patient?.name?.charAt(0) || "P"}
                  </div>
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-[10px] font-extrabold uppercase tracking-wider">
                      <AccessTimeOutlined sx={{ fontSize: 12 }} />
                      Next In Chair
                    </span>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight mt-0.5">
                      {nextAppointment.patient?.name || "Patient"}
                    </h3>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-2xl font-black text-slate-900 font-sans tracking-tight block">
                    {formatTime(nextAppointment.startTime)}
                  </span>
                  <span className="text-xs font-bold text-teal-700">
                    {nextAppointment.treatment.durationMin} min scheduled
                  </span>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 text-slate-800 font-bold text-xs">
                    <CheckCircleOutlineOutlined sx={{ fontSize: 14, color: "#0d9488" }} />
                    {nextAppointment.treatment.name}
                  </span>
                  <span className="text-xs font-extrabold text-teal-700">
                    Fee: {formatPKR(nextAppointment.treatment.price)}
                  </span>
                </div>

                {nextAppointment.patient?.phone && (
                  <div className="flex items-center gap-2">
                    <a
                      href={`https://wa.me/${nextAppointment.patient.phone.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 text-xs font-bold transition-colors cursor-pointer"
                    >
                      <WhatsApp sx={{ fontSize: 15, color: "#10b981" }} />
                      <span>WhatsApp Patient</span>
                    </a>
                    <a
                      href={`tel:${nextAppointment.patient.phone}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                    >
                      <PhoneOutlined sx={{ fontSize: 14 }} />
                      <span>{nextAppointment.patient.phone}</span>
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Today's Schedule Table */}
          <TodayAppointments initialAppointments={todayAppointments as any} />
        </div>

        {/* Right: Tomorrow's Schedule & Quick Clinical Shortcuts (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Tomorrow's Schedule (Nura Lab Overview Style) */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <WbTwilightOutlined sx={{ fontSize: 18, color: "#0D9488" }} />
                <span>Tomorrow&apos;s Bookings</span>
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-teal-50 text-teal-800 border border-teal-200">
                {tomorrowTotal} scheduled
              </span>
            </div>
            <div className="p-6">
              {tomorrowAppointments.length === 0 ? (
                <p className="text-xs text-slate-500 font-medium text-center py-4">
                  No appointments booked for tomorrow yet
                </p>
              ) : (
                <div className="divide-y divide-slate-100 space-y-2.5">
                  {tomorrowAppointments.slice(0, 6).map((apt: AppointmentItem) => (
                    <div key={apt.id} className="flex items-center gap-3 pt-2">
                      <div className="size-8 rounded-xl bg-teal-50 text-teal-700 font-bold text-xs flex items-center justify-center shrink-0">
                        {apt.patient?.name?.charAt(0) || "P"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">
                          {apt.patient?.name}
                        </p>
                        <p className="text-[11px] text-slate-400 font-medium truncate">
                          {apt.treatment.name}
                        </p>
                      </div>
                      <div className="text-xs font-extrabold text-slate-700 shrink-0 font-sans">
                        {formatTime(apt.startTime)}
                      </div>
                    </div>
                  ))}
                  {tomorrowAppointments.length > 6 && (
                    <p className="text-xs text-teal-700 font-bold text-center pt-3">
                      +{tomorrowAppointments.length - 6} more booked tomorrow
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Doctors on Duty / Live Operatories */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MedicalServicesOutlined sx={{ fontSize: 18, color: "#0D9488" }} />
                <h3 className="text-sm font-extrabold text-slate-900">Doctors on Duty</h3>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200">
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>3 Active On-Site</span>
              </div>
            </div>
            <div className="p-6 space-y-3.5">
              {/* Lead Surgeon: Dr. Sheriyaar */}
              <div className="p-3.5 rounded-2xl bg-teal-50/50 border border-teal-200/70 hover:border-teal-300 transition-all">
                <div className="flex items-center gap-3">
                  <div className="relative size-11 rounded-2xl overflow-hidden ring-2 ring-teal-500/30 shrink-0 bg-slate-100">
                    <Image
                      src="/images/dr_sheriyaar.jpg"
                      alt="Dr. Sheriyaar"
                      fill
                      className="object-cover object-top"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-black text-slate-900 truncate">
                        Dr. Sheriyaar
                      </p>
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-extrabold bg-teal-600 text-white shrink-0">
                        Lead Surgeon
                      </span>
                    </div>
                    <p className="text-[11px] font-semibold text-teal-800 truncate">
                      Chair 1 · Surgical Suite
                    </p>
                    <p className="text-[10px] text-slate-500 font-medium mt-0.5 flex items-center gap-1">
                      <AccessTimeOutlined sx={{ fontSize: 11 }} />
                      <span>12:00 PM – 8:00 PM (Active)</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Consultant Orthodontist: Dr. Ayesha Malik */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70 hover:border-slate-300 transition-all">
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-xl bg-teal-100 text-teal-800 font-extrabold text-xs flex items-center justify-center shrink-0">
                    AM
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        Dr. Ayesha Malik
                      </p>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                        In Operatory
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Chair 2 · Orthodontics Bay
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                      2:00 PM – 6:00 PM
                    </p>
                  </div>
                </div>
              </div>

              {/* Consultant Endodontist: Dr. Hamza Tariq */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/70 hover:border-slate-300 transition-all">
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-xl bg-slate-200 text-slate-800 font-extrabold text-xs flex items-center justify-center shrink-0">
                    HT
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        Dr. Hamza Tariq
                      </p>
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                        Next Shift (4 PM)
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Chair 3 · Rotary Endodontics
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                      4:00 PM – 8:00 PM
                    </p>
                  </div>
                </div>
              </div>

              <Button
                asChild
                variant="outline"
                className="w-full h-9 rounded-xl border-slate-200 text-xs font-bold text-teal-800 hover:bg-teal-50 hover:text-teal-900 cursor-pointer"
              >
                <Link href="/staff/doctors">
                  <span>View Full Specialist Roster</span>
                  <ArrowForwardOutlined sx={{ fontSize: 13, ml: 1 }} />
                </Link>
              </Button>
            </div>
          </div>

          {/* Quick Desk Actions */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/60">
              <h3 className="text-sm font-extrabold text-slate-900">Front Desk Actions</h3>
            </div>
            <div className="p-6 space-y-2.5">
              <Button
                asChild
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-2xl justify-start h-11 transition-all active:scale-[0.98] shadow-xs cursor-pointer"
              >
                <Link href="/staff/book">
                  <PersonAddAlt1Outlined sx={{ fontSize: 18, mr: 1.5 }} />
                  Book New Walk-In
                </Link>
              </Button>
              <Button
                asChild
                variant="secondary"
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold justify-start h-11 border border-slate-200/80 rounded-2xl transition-all cursor-pointer"
              >
                <Link href="/staff/appointments">
                  <CalendarMonthOutlined sx={{ fontSize: 18, mr: 1.5, color: "#0d9488" }} />
                  <span>Calendar Schedule</span>
                  <ArrowForwardOutlined sx={{ fontSize: 14, ml: "auto", color: "#64748b" }} />
                </Link>
              </Button>
              <Button
                asChild
                variant="secondary"
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold justify-start h-11 border border-slate-200/80 rounded-2xl transition-all cursor-pointer"
              >
                <Link href="/staff/patients">
                  <PeopleAltOutlined sx={{ fontSize: 18, mr: 1.5, color: "#0d9488" }} />
                  <span>Patients Directory</span>
                  <ArrowForwardOutlined sx={{ fontSize: 14, ml: "auto", color: "#64748b" }} />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

