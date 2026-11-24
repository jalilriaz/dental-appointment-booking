"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { fetchApi } from "@/lib/api-client";
import { checkoutAppointment } from "@/app/actions/billing";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import {
  AttachMoneyOutlined,
  CalendarMonthOutlined,
  PeopleAltOutlined,
  AccountBalanceWalletOutlined,
  TrendingUpOutlined,
  TrendingDownOutlined,
  PersonAddAlt1Outlined,
  AccessTimeOutlined,
  SearchOutlined,
  CheckCircleOutlineOutlined,
  PersonOffOutlined,
  ChevronLeftOutlined,
  ChevronRightOutlined,
  Circle,
  LocalHospitalOutlined,
  ArrowForwardOutlined,
  MedicalServicesOutlined,
  EventAvailableOutlined,
  PhoneOutlined,
  FiberManualRecordOutlined,
} from "@mui/icons-material";
import CheckoutDialog, {
  CheckoutAppointment,
} from "@/components/shared/CheckoutDialog";
import StatusBadge from "@/components/shared/StatusBadge";
import { formatPKR, formatDate, formatTime, cn } from "@/lib/utils";

// ─── Interfaces ──────────────────────────────────────────────

export interface DashboardKPIs {
  revenueThisMonth: number;
  revenueLastMonth: number;
  revenueTrendPct: number;
  appointmentsTodayDone: number;
  appointmentsTodayTotal: number;
  appointmentsTodayNoShow: number;
  totalPatients: number;
  newPatientsThisMonth: number;
  outstandingBalance: number;
}

export interface ChartDataPoint {
  label: string;
  revenue: number;
  appointments: number;
  dateStr?: string;
}

export interface ChartDatasets {
  weekly: ChartDataPoint[];
  monthly: ChartDataPoint[];
  yearly: ChartDataPoint[];
}

export interface QueuePatientAppointment {
  id: string;
  startTime: string;
  endTime: string;
  status: string;
  amountPaid: number;
  price: number;
  discount: number;
  patient: {
    id?: string;
    name: string | null;
    phone: string | null;
    medicalAlerts?: string | null;
    isFirstVisit: boolean;
  } | null;
  treatment: {
    id?: string;
    name: string;
    durationMin: number;
    price: number;
  };
}

export interface UpcomingAppointmentItem {
  id: string;
  startTime: string;
  endTime: string;
  status: string;
  patient: {
    name: string | null;
    phone: string | null;
    isFirstVisit: boolean;
  } | null;
  treatment: {
    name: string;
    durationMin: number;
  };
}

export interface StatusDistribution {
  completed: number;
  upcoming: number;
  cancelled: number;
  noShow: number;
  total: number;
}

export interface PopularTreatmentItem {
  name: string;
  bookings: number;
  revenue: number;
  category: string;
}

interface AdminExecutiveDashboardProps {
  doctorName?: string;
  kpis: DashboardKPIs;
  chartData: ChartDatasets;
  queueAppointments: QueuePatientAppointment[];
  upcomingAppointments: UpcomingAppointmentItem[];
  statusDistribution: StatusDistribution;
  popularTreatments: PopularTreatmentItem[];
}

export default function AdminExecutiveDashboard({
  doctorName = "Dr. Sheriyaar",
  kpis,
  chartData,
  queueAppointments: initialQueue,
  upcomingAppointments,
  statusDistribution,
  popularTreatments,
}: AdminExecutiveDashboardProps) {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [greeting, setGreeting] = useState("Good afternoon");
  const [dateDisplay, setDateDisplay] = useState("");

  // Chart toggles
  const [chartMetric, setChartMetric] = useState<"revenue" | "appointments">("revenue");
  const [chartRange, setChartRange] = useState<"weekly" | "monthly" | "yearly">("monthly");

  // Queue state
  const [queue, setQueue] = useState<QueuePatientAppointment[]>(initialQueue);
  const [queueSearch, setQueueSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Checkout modal
  const [checkoutApt, setCheckoutApt] = useState<CheckoutAppointment | null>(null);
  const [amountValue, setAmountValue] = useState("");
  const [loadingActionId, setLoadingActionId] = useState<string | null>(null);

  // Week strip state
  const [selectedDayOffset, setSelectedDayOffset] = useState<number>(0); // 0 = today

  useEffect(() => {
    setIsMounted(true);
    const now = new Date();
    const hour = now.getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");

    setDateDisplay(
      now.toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    );
  }, []);

  // Update queue when initialQueue changes
  useEffect(() => {
    setQueue(initialQueue);
  }, [initialQueue]);

  // ─── Active Chart Dataset ──────────────────────────────────
  const activeSeries = useMemo(() => {
    if (chartRange === "weekly") return chartData.weekly || [];
    if (chartRange === "yearly") return chartData.yearly || [];
    return chartData.monthly || [];
  }, [chartData, chartRange]);

  // ─── Week Strip Days Generation ────────────────────────────
  const weekStripDays = useMemo(() => {
    const today = new Date();
    const currentDayOfWeek = today.getDay(); // 0 is Sun, 1 is Mon...
    // Calculate Monday of current week
    const mondayOffset = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;
    const monday = new Date(today);
    monday.setDate(today.getDate() + mondayOffset);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const isToday =
        d.getDate() === today.getDate() &&
        d.getMonth() === today.getMonth() &&
        d.getFullYear() === today.getFullYear();
      
      const diffFromToday = Math.round(
        (d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );

      days.push({
        dateObj: d,
        dayName: d.toLocaleDateString("en-US", { weekday: "short" }),
        dateNum: d.getDate(),
        monthName: d.toLocaleDateString("en-US", { month: "short" }),
        isToday,
        offset: diffFromToday,
      });
    }
    return days;
  }, []);

  // ─── Filtered Queue ────────────────────────────────────────
  const filteredQueue = useMemo(() => {
    if (!queueSearch.trim()) return queue;
    const q = queueSearch.toLowerCase().trim();
    return queue.filter((item) => {
      const pName = (item.patient?.name || "").toLowerCase();
      const pPhone = (item.patient?.phone || "").toLowerCase();
      const tName = (item.treatment?.name || "").toLowerCase();
      return pName.includes(q) || pPhone.includes(q) || tName.includes(q);
    });
  }, [queue, queueSearch]);

  const totalPages = Math.max(1, Math.ceil(filteredQueue.length / pageSize));
  const paginatedQueue = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredQueue.slice(start, start + pageSize);
  }, [filteredQueue, currentPage]);

  // ─── Status Update Actions ─────────────────────────────────
  const handleNoShow = async (aptId: string) => {
    try {
      setLoadingActionId(aptId);
      const res = await fetchApi(`/api/appointments/${aptId}/status`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "NO_SHOW" }),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error("Failed to mark as no-show", { description: data.error });
        return;
      }

      setQueue((prev) =>
        prev.map((item) =>
          item.id === aptId ? { ...item, status: "NO_SHOW" } : item
        )
      );
      toast.success("Appointment updated to No-show");
      router.refresh();
    } catch {
      toast.error("Network error while updating appointment");
    } finally {
      setLoadingActionId(null);
    }
  };

  const handleMarkArrived = async (aptId: string) => {
    try {
      setLoadingActionId(aptId);
      // Keep status SCHEDULED or touch appointment
      toast.success("Patient marked as arrived at reception");
    } finally {
      setLoadingActionId(null);
    }
  };

  const handleOpenCheckout = (apt: QueuePatientAppointment) => {
    const checkoutData: CheckoutAppointment = {
      id: apt.id,
      patient: apt.patient,
      treatment: {
        id: apt.treatment.id,
        name: apt.treatment.name,
        price: apt.treatment.price,
      },
      price: apt.price,
      discount: apt.discount,
    };
    setAmountValue(String(apt.treatment.price || 0));
    setCheckoutApt(checkoutData);
  };

  const handleConfirmCheckout = async (
    amountPaid: number,
    billedPrice: number,
    discount: number,
    options?: {
      paymentMethod?: "CASH" | "CARD" | "ONLINE";
      discountPercent?: number;
      packageCost?: number;
      totalSessions?: number;
      nextSessionDate?: string;
      nextSessionTime?: string;
      nextSessionFee?: number;
      nextSessionLabel?: string;
    }
  ) => {
    if (!checkoutApt?.id) return;
    try {
      const result = await checkoutAppointment({
        appointmentId: checkoutApt.id,
        amountCollected: amountPaid,
        billedPrice: billedPrice,
        discount: discount,
        paymentMethod: options?.paymentMethod,
        discountPercent: options?.discountPercent,
        packageCost: options?.packageCost,
        totalSessions: options?.totalSessions,
        nextSessionDate: options?.nextSessionDate,
        nextSessionTime: options?.nextSessionTime,
        nextSessionLabel: options?.nextSessionLabel,
        nextSessionFee: options?.nextSessionFee,
      });

      if (!result.success) {
        toast.error("Checkout Failed", { description: result.error });
        return;
      }

      toast.success("Checkout completed", {
        description: `Payment of Rs. ${amountPaid.toLocaleString()} recorded.`,
      });

      setQueue((prev) =>
        prev.map((item) =>
          item.id === checkoutApt.id
            ? {
                ...item,
                status: "COMPLETED",
                amountPaid: (item.amountPaid || 0) + amountPaid,
              }
            : item
        )
      );
      setCheckoutApt(null);
      router.refresh();
    } catch {
      toast.error("Error processing checkout. Please try again.");
    }
  };

  // Donut chart data
  const donutData = useMemo(() => {
    return [
      { name: "Completed", value: statusDistribution.completed, color: "#10b981" },
      { name: "Upcoming", value: statusDistribution.upcoming, color: "#0d9488" },
      { name: "No-show", value: statusDistribution.noShow, color: "#f59e0b" },
      { name: "Cancelled", value: statusDistribution.cancelled, color: "#f43f5e" },
    ].filter((d) => d.value > 0);
  }, [statusDistribution]);

  // Group upcoming appointments
  const groupedUpcoming = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const dayAfter = new Date(tomorrow);
    dayAfter.setDate(tomorrow.getDate() + 1);

    const todayItems: UpcomingAppointmentItem[] = [];
    const tomorrowItems: UpcomingAppointmentItem[] = [];
    const laterItems: UpcomingAppointmentItem[] = [];

    upcomingAppointments.forEach((item) => {
      const itemDate = new Date(item.startTime);
      itemDate.setHours(0, 0, 0, 0);

      if (itemDate.getTime() === today.getTime()) {
        todayItems.push(item);
      } else if (itemDate.getTime() === tomorrow.getTime()) {
        tomorrowItems.push(item);
      } else {
        laterItems.push(item);
      }
    });

    return { todayItems, tomorrowItems, laterItems };
  }, [upcomingAppointments]);

  return (
    <div className="space-y-6">
      {/* ─────────────────────────────────────────────────────────────
          1. SLIM WELCOME HEADER
          ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {greeting}, {doctorName}
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
              <Circle sx={{ fontSize: 7, color: "#10b981" }} className="animate-pulse" />
              <span>Shift active (12 PM – 8 PM)</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            {dateDisplay || "Today"} · G-8 Markaz Clinical Suite
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            href="/admin/walk-in"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 hover:text-teal-700 text-xs font-bold border border-slate-200/90 shadow-2xs transition-all cursor-pointer"
          >
            <PersonAddAlt1Outlined sx={{ fontSize: 16 }} className="text-teal-600" />
            <span>New walk-in patient</span>
          </Link>

          <Link
            href="/admin/walk-in"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs hover:shadow-teal-600/20 active:scale-95 transition-all cursor-pointer"
          >
            <CalendarMonthOutlined sx={{ fontSize: 16 }} />
            <span>New appointment</span>
          </Link>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. ROW OF 4 COMPACT KPI CARDS
          ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Revenue this month */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs hover:border-teal-300 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Revenue this month</span>
            <div className="size-9 rounded-xl bg-teal-50 border border-teal-200/80 flex items-center justify-center text-teal-700">
              <AttachMoneyOutlined sx={{ fontSize: 20 }} />
            </div>
          </div>
          <div className="mt-2.5">
            <p className="text-2xl font-black text-slate-900 tracking-tight font-sans">
              {formatPKR(kpis.revenueThisMonth)}
            </p>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mt-1">
              <span
                className={cn(
                  "inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[11px] font-bold",
                  kpis.revenueTrendPct >= 0
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-rose-50 text-rose-700"
                )}
              >
                {kpis.revenueTrendPct >= 0 ? (
                  <TrendingUpOutlined sx={{ fontSize: 13 }} />
                ) : (
                  <TrendingDownOutlined sx={{ fontSize: 13 }} />
                )}
                <span>
                  {kpis.revenueTrendPct >= 0 ? "+" : ""}
                  {kpis.revenueTrendPct}%
                </span>
              </span>
              <span>vs last month</span>
            </div>
          </div>
        </div>

        {/* KPI 2: Today's appointments */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs hover:border-teal-300 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Today&apos;s appointments</span>
            <div className="size-9 rounded-xl bg-sky-50 border border-sky-200/80 flex items-center justify-center text-sky-700">
              <AccessTimeOutlined sx={{ fontSize: 20 }} />
            </div>
          </div>
          <div className="mt-2.5">
            <div className="flex items-baseline gap-1.5">
              <p className="text-2xl font-black text-slate-900 tracking-tight font-sans">
                {kpis.appointmentsTodayDone} / {kpis.appointmentsTodayTotal}
              </p>
              <span className="text-xs font-bold text-slate-500">done</span>
            </div>
            <div className="mt-2">
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-teal-600 h-1.5 rounded-full transition-all duration-500"
                  style={{
                    width: `${
                      kpis.appointmentsTodayTotal > 0
                        ? Math.min(
                            100,
                            Math.round(
                              (kpis.appointmentsTodayDone / kpis.appointmentsTodayTotal) * 100
                            )
                          )
                        : 0
                    }%`,
                  }}
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1 font-medium">
                {kpis.appointmentsTodayTotal === 0
                  ? "No visits scheduled today"
                  : `${kpis.appointmentsTodayTotal - kpis.appointmentsTodayDone} remaining`}
              </p>
            </div>
          </div>
        </div>

        {/* KPI 3: Total patients */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs hover:border-teal-300 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Total patients</span>
            <div className="size-9 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-700">
              <PeopleAltOutlined sx={{ fontSize: 20 }} />
            </div>
          </div>
          <div className="mt-2.5">
            <p className="text-2xl font-black text-slate-900 tracking-tight font-sans">
              {kpis.totalPatients}
            </p>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[11px] font-bold">
                +{kpis.newPatientsThisMonth} new
              </span>
              <span>this month</span>
            </div>
          </div>
        </div>

        {/* KPI 4: Outstanding balance */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs hover:border-teal-300 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Outstanding balance</span>
            <div className="size-9 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-700">
              <AccountBalanceWalletOutlined sx={{ fontSize: 20 }} />
            </div>
          </div>
          <div className="mt-2.5">
            <p className="text-2xl font-black text-slate-900 tracking-tight font-sans">
              {formatPKR(kpis.outstandingBalance)}
            </p>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-800 text-[11px] font-bold">
                Pending collection
              </span>
              <span>across visits</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. MAIN TWO-COLUMN SPLIT (68% Left / 32% Right)
          ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: ~68% (lg:col-span-8) */}
        <div className="lg:col-span-8 space-y-6 min-w-0">
          {/* Chart Card */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs">
            {/* Chart Header + Dual Toggles */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                  {chartMetric === "revenue" ? "Revenue Velocity" : "Appointment Volume"}
                </h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  {chartMetric === "revenue"
                    ? "Realized collections trend"
                    : "Scheduled & completed visits"}
                </p>
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* Metric toggle: Revenue vs Appointments */}
                <div className="flex items-center p-1 rounded-xl bg-slate-100/90 border border-slate-200/80 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setChartMetric("revenue")}
                    className={cn(
                      "px-2.5 py-1 rounded-lg transition-all cursor-pointer",
                      chartMetric === "revenue"
                        ? "bg-white text-teal-800 shadow-2xs"
                        : "text-slate-600 hover:text-slate-900"
                    )}
                  >
                    Revenue
                  </button>
                  <button
                    type="button"
                    onClick={() => setChartMetric("appointments")}
                    className={cn(
                      "px-2.5 py-1 rounded-lg transition-all cursor-pointer",
                      chartMetric === "appointments"
                        ? "bg-white text-teal-800 shadow-2xs"
                        : "text-slate-600 hover:text-slate-900"
                    )}
                  >
                    Appointments
                  </button>
                </div>

                {/* Range toggle: Weekly vs Monthly vs Yearly */}
                <div className="flex items-center p-1 rounded-xl bg-slate-100/90 border border-slate-200/80 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setChartRange("weekly")}
                    className={cn(
                      "px-2 py-1 rounded-lg transition-all cursor-pointer",
                      chartRange === "weekly"
                        ? "bg-white text-slate-900 shadow-2xs"
                        : "text-slate-500 hover:text-slate-900"
                    )}
                  >
                    Weekly
                  </button>
                  <button
                    type="button"
                    onClick={() => setChartRange("monthly")}
                    className={cn(
                      "px-2 py-1 rounded-lg transition-all cursor-pointer",
                      chartRange === "monthly"
                        ? "bg-white text-slate-900 shadow-2xs"
                        : "text-slate-500 hover:text-slate-900"
                    )}
                  >
                    Monthly
                  </button>
                  <button
                    type="button"
                    onClick={() => setChartRange("yearly")}
                    className={cn(
                      "px-2 py-1 rounded-lg transition-all cursor-pointer",
                      chartRange === "yearly"
                        ? "bg-white text-slate-900 shadow-2xs"
                        : "text-slate-500 hover:text-slate-900"
                    )}
                  >
                    Yearly
                  </button>
                </div>
              </div>
            </div>

            {/* Recharts Flat Single-Color Area Chart */}
            <div className="h-64 sm:h-72 w-full pt-4 min-w-0">
              {isMounted && (
                <ResponsiveContainer width="100%" height={260}>
                  <AreaChart
                    data={activeSeries}
                    margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="tealAreaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0d9488" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#0d9488" stopOpacity={0.01} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis
                      dataKey="label"
                      stroke="#94a3b8"
                      fontSize={11}
                      tickLine={false}
                      axisLine={{ stroke: "#e2e8f0" }}
                    />
                    <YAxis
                      stroke="#94a3b8"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(val) =>
                        chartMetric === "revenue"
                          ? val >= 1000
                            ? `${(val / 1000).toFixed(0)}k`
                            : val
                          : val
                      }
                    />
                    <RechartsTooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload as ChartDataPoint;
                          return (
                            <div className="rounded-xl bg-[#0B1528] text-white p-3 shadow-xl border border-slate-800 text-xs space-y-1">
                              <p className="font-bold text-slate-300">
                                {data.dateStr || data.label}
                              </p>
                              <p className="text-sm font-black text-teal-300 font-sans">
                                {chartMetric === "revenue"
                                  ? formatPKR(data.revenue)
                                  : `${data.appointments} Appointments`}
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey={chartMetric}
                      stroke="#0d9488"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#tealAreaGrad)"
                      isAnimationActive={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Current Patients Queue Table */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
            {/* Table Header with Search & Add Patient */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 border-b border-slate-100">
              <div>
                <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                  Current Patients
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Active queue and clinical status reconciliation
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                {/* Search Box */}
                <div className="relative">
                  <SearchOutlined
                    sx={{ fontSize: 16 }}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />
                  <input
                    type="text"
                    value={queueSearch}
                    onChange={(e) => {
                      setQueueSearch(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Search patients..."
                    className="w-40 sm:w-48 pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:bg-white focus:border-teal-500 outline-hidden font-medium"
                  />
                </div>

                {/* Add Patient Button */}
                <Link
                  href="/admin/walk-in"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-2xs transition-all cursor-pointer shrink-0"
                >
                  <PersonAddAlt1Outlined sx={{ fontSize: 14 }} />
                  <span>Add patient</span>
                </Link>
              </div>
            </div>

            {/* Table Body */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 whitespace-nowrap">Patient</th>
                    <th className="px-4 py-3 whitespace-nowrap">Treatment</th>
                    <th className="px-4 py-3 whitespace-nowrap">Date</th>
                    <th className="px-4 py-3 whitespace-nowrap">Time</th>
                    <th className="px-4 py-3 whitespace-nowrap">Duration</th>
                    <th className="px-4 py-3 whitespace-nowrap">Status</th>
                    <th className="px-4 sm:pr-6 py-3 text-right whitespace-nowrap">Quick actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {paginatedQueue.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-10 text-slate-500">
                        <p className="font-bold text-slate-700">No patients in queue</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Patients booked for today or matching search will appear here.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    paginatedQueue.map((apt) => {
                      const pName = apt.patient?.name || "Patient";
                      const initial = pName.charAt(0).toUpperCase();
                      const isFirst = apt.patient?.isFirstVisit ?? false;

                      return (
                        <tr key={apt.id} className="hover:bg-slate-50/80 transition-colors">
                          {/* Patient info */}
                          <td className="px-4 sm:px-6 py-3.5">
                            <div className="flex items-center gap-2.5">
                              <div className="size-8 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 font-extrabold flex items-center justify-center text-xs shrink-0">
                                {initial}
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-extrabold text-slate-900 truncate">
                                    {pName}
                                  </span>
                                  <span
                                    className={cn(
                                      "px-1.5 py-0.5 rounded text-[9px] font-bold tracking-tight",
                                      isFirst
                                        ? "bg-amber-50 text-amber-800 border border-amber-200/70"
                                        : "bg-slate-100 text-slate-600 border border-slate-200/60"
                                    )}
                                  >
                                    {isFirst ? "1st visit" : "Returning"}
                                  </span>
                                </div>
                                {apt.patient?.phone && (
                                  <span className="text-[10px] text-slate-400 font-medium block">
                                    {apt.patient.phone}
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Treatment */}
                          <td className="px-4 py-3.5 font-semibold text-slate-800">
                            {apt.treatment.name}
                          </td>

                          {/* Date */}
                          <td className="px-4 py-3.5 text-slate-600 font-medium whitespace-nowrap">
                            {formatDate(apt.startTime, "short")}
                          </td>

                          {/* Time */}
                          <td className="px-4 py-3.5 text-slate-600 font-semibold whitespace-nowrap">
                            {formatTime(apt.startTime)}
                          </td>

                          {/* Duration (In place of Chair) */}
                          <td className="px-4 py-3.5 text-slate-600 whitespace-nowrap">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium text-[11px]">
                              {apt.treatment.durationMin} mins
                            </span>
                          </td>

                          {/* Status Badge */}
                          <td className="px-4 py-3.5 whitespace-nowrap">
                            <StatusBadge status={apt.status} />
                          </td>

                          {/* Quick Actions */}
                          <td className="px-4 sm:pr-6 py-3.5 text-right whitespace-nowrap">
                            <div className="inline-flex items-center gap-1.5 justify-end">
                              {apt.status === "SCHEDULED" && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => handleMarkArrived(apt.id)}
                                    disabled={loadingActionId === apt.id}
                                    className="px-2 py-1 rounded-lg text-[11px] font-bold text-teal-700 hover:bg-teal-50 border border-teal-200 transition-colors cursor-pointer"
                                    title="Mark patient as arrived in reception"
                                  >
                                    Arrived
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleOpenCheckout(apt)}
                                    disabled={loadingActionId === apt.id}
                                    className="px-2 py-1 rounded-lg text-[11px] font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-2xs transition-colors cursor-pointer"
                                    title="Complete procedure and checkout"
                                  >
                                    Complete
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleNoShow(apt.id)}
                                    disabled={loadingActionId === apt.id}
                                    className="px-2 py-1 rounded-lg text-[11px] font-bold text-amber-700 hover:bg-amber-50 border border-amber-200 transition-colors cursor-pointer"
                                    title="Mark appointment as no-show"
                                  >
                                    No-show
                                  </button>
                                </>
                              )}

                              {apt.status === "COMPLETED" && (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                                  <CheckCircleOutlineOutlined sx={{ fontSize: 13 }} />
                                  <span>Checked out</span>
                                </span>
                              )}

                              {apt.status === "NO_SHOW" && (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800">
                                  <PersonOffOutlined sx={{ fontSize: 13 }} />
                                  <span>No show</span>
                                </span>
                              )}

                              {apt.status === "CANCELLED" && (
                                <span className="text-[11px] text-slate-400 font-medium">
                                  Cancelled
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-t border-slate-100 bg-slate-50/50 text-xs">
                <span className="text-slate-500 font-medium">
                  Showing {(currentPage - 1) * pageSize + 1} to{" "}
                  {Math.min(currentPage * pageSize, filteredQueue.length)} of {filteredQueue.length}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-40 transition-colors cursor-pointer"
                  >
                    <ChevronLeftOutlined sx={{ fontSize: 16 }} />
                  </button>

                  {Array.from({ length: totalPages }).map((_, idx) => {
                    const pageNum = idx + 1;
                    return (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => setCurrentPage(pageNum)}
                        className={cn(
                          "size-7 rounded-lg text-xs font-bold transition-all cursor-pointer",
                          currentPage === pageNum
                            ? "bg-teal-600 text-white shadow-2xs"
                            : "text-slate-600 hover:bg-white border border-slate-200"
                        )}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-40 transition-colors cursor-pointer"
                  >
                    <ChevronRightOutlined sx={{ fontSize: 16 }} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: ~32% (lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-6 min-w-0">
          {/* Upcoming Appointments Panel */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                  Upcoming Appointments
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Chronological patient schedule
                </p>
              </div>
            </div>

            {/* Interactive Mon–Sun Week Strip Date Picker */}
            <div className="py-3 border-b border-slate-100">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2.5">
                <span>
                  {weekStripDays[0]?.monthName}{" "}
                  {weekStripDays[0]?.dateObj.getFullYear()}
                </span>
                <span className="text-[10px] text-teal-700 font-semibold bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200/70">
                  Week view
                </span>
              </div>

              {/* Day Pills: 7 equal-width columns horizontally */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
                  gap: "6px",
                  width: "100%",
                }}
              >
                {weekStripDays.map((day) => {
                  const isSelected = selectedDayOffset === day.offset;
                  return (
                    <button
                      key={day.dayName + day.dateNum}
                      type="button"
                      onClick={() => setSelectedDayOffset(day.offset)}
                      className={cn(
                        "py-2 px-1 rounded-xl text-center transition-all cursor-pointer flex flex-col items-center justify-center relative",
                        isSelected
                          ? "bg-[#0B1528] text-white shadow-xs ring-2 ring-teal-500/30 font-bold"
                          : day.isToday
                          ? "bg-teal-50 text-teal-800 border border-teal-200/80 font-bold"
                          : "hover:bg-slate-100 text-slate-600 border border-slate-100 font-medium"
                      )}
                    >
                      <span className="text-[10px] font-bold block uppercase tracking-tight">
                        {day.dayName}
                      </span>
                      <span className="text-xs font-black block mt-0.5">
                        {day.dateNum}
                      </span>
                      {day.isToday && !isSelected && (
                        <span className="size-1 rounded-full bg-teal-600 mt-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Grouped Chronological Cards */}
            <div className="pt-3 space-y-4 max-h-[480px] overflow-y-auto pr-1">
              {/* Today Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-teal-600" />
                    <span>Today</span>
                  </span>
                  <span className="text-[11px] text-slate-400 font-semibold">
                    {groupedUpcoming.todayItems.length} visits
                  </span>
                </div>

                {groupedUpcoming.todayItems.length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-1 pl-3">
                    No remaining visits scheduled for today.
                  </p>
                ) : (
                  groupedUpcoming.todayItems.map((item) => {
                    const isFirst = item.patient?.isFirstVisit ?? false;
                    return (
                      <div
                        key={item.id}
                        className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 transition-all flex items-center justify-between gap-3 group"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-slate-900 truncate">
                              {item.patient?.name || "Patient"}
                            </span>
                            {isFirst && (
                              <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 text-[9px] font-bold">
                                New patient
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] font-medium text-slate-500 truncate mt-0.5">
                            {item.treatment.name} · {item.treatment.durationMin}m
                          </p>
                        </div>
                        <div className="shrink-0 text-right">
                          <span className="inline-block px-2 py-1 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-800 font-sans shadow-2xs">
                            {formatTime(item.startTime)}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Tomorrow Section */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-sky-500" />
                    <span>Tomorrow</span>
                  </span>
                  <span className="text-[11px] text-slate-400 font-semibold">
                    {groupedUpcoming.tomorrowItems.length} visits
                  </span>
                </div>

                {groupedUpcoming.tomorrowItems.length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-1 pl-3">
                    No visits scheduled for tomorrow.
                  </p>
                ) : (
                  groupedUpcoming.tomorrowItems.map((item) => {
                    const isFirst = item.patient?.isFirstVisit ?? false;
                    return (
                      <div
                        key={item.id}
                        className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 transition-all flex items-center justify-between gap-3"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-slate-900 truncate">
                              {item.patient?.name || "Patient"}
                            </span>
                            {isFirst && (
                              <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 text-[9px] font-bold">
                                New patient
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] font-medium text-slate-500 truncate mt-0.5">
                            {item.treatment.name} · {item.treatment.durationMin}m
                          </p>
                        </div>
                        <div className="shrink-0 text-right">
                          <span className="inline-block px-2 py-1 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-800 font-sans shadow-2xs">
                            {formatTime(item.startTime)}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Later This Week Section */}
              {groupedUpcoming.laterItems.length > 0 && (
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span className="flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-slate-400" />
                      <span>Later this week</span>
                    </span>
                    <span className="text-[11px] text-slate-400 font-semibold">
                      {groupedUpcoming.laterItems.length} visits
                    </span>
                  </div>

                  {groupedUpcoming.laterItems.slice(0, 3).map((item) => {
                    return (
                      <div
                        key={item.id}
                        className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 transition-all flex items-center justify-between gap-3"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-black text-slate-900 truncate">
                            {item.patient?.name || "Patient"}
                          </p>
                          <p className="text-[11px] font-medium text-slate-500 truncate mt-0.5">
                            {item.treatment.name} · {formatDate(item.startTime, "short")}
                          </p>
                        </div>
                        <div className="shrink-0 text-right">
                          <span className="inline-block px-2 py-1 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-800 font-sans shadow-2xs">
                            {formatTime(item.startTime)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          4. BOTTOM ROW (50% / 50% split)
          ───────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Appointment Status Donut */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                Appointment Status
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Attendance, completion, and cancellation distribution
              </p>
            </div>
            <span className="text-xs font-bold text-slate-500">
              {statusDistribution.total} Total
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center pt-4">
            {/* Donut Chart */}
            <div className="sm:col-span-5 h-52 relative flex items-center justify-center">
              {isMounted && (
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={donutData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={52}
                      outerRadius={74}
                      paddingAngle={4}
                      isAnimationActive={false}
                    >
                      {donutData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      formatter={(val: any, name: any) => [
                        `${val} (${Math.round(
                          (Number(val) / (statusDistribution.total || 1)) * 100
                        )}%)`,
                        name,
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
              {/* Donut Center Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-black text-slate-900 leading-none">
                  {statusDistribution.total}
                </span>
                <span className="text-[10px] text-slate-500 font-bold uppercase mt-0.5">
                  Visits
                </span>
              </div>
            </div>

            {/* Legend & Benchmarks (Visits completed vs no-shows) */}
            <div className="sm:col-span-7 space-y-3">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-1 sm:gap-1.5">
                {/* Completed */}
                <div className="flex items-center justify-between text-xs p-1.5 rounded-lg bg-slate-50/70 border border-slate-100">
                  <span className="flex items-center gap-1.5 text-slate-600 font-semibold truncate">
                    <span className="size-2 rounded-full bg-emerald-500 shrink-0" />
                    <span>Completed</span>
                  </span>
                  <span className="font-extrabold text-slate-900 font-sans ml-2 shrink-0">
                    {statusDistribution.completed}{" "}
                    <span className="text-slate-400 font-medium text-[10px]">
                      ({Math.round((statusDistribution.completed / (statusDistribution.total || 1)) * 100)}%)
                    </span>
                  </span>
                </div>

                {/* Upcoming */}
                <div className="flex items-center justify-between text-xs p-1.5 rounded-lg bg-slate-50/70 border border-slate-100">
                  <span className="flex items-center gap-1.5 text-slate-600 font-semibold truncate">
                    <span className="size-2 rounded-full bg-teal-600 shrink-0" />
                    <span>Upcoming</span>
                  </span>
                  <span className="font-extrabold text-slate-900 font-sans ml-2 shrink-0">
                    {statusDistribution.upcoming}{" "}
                    <span className="text-slate-400 font-medium text-[10px]">
                      ({Math.round((statusDistribution.upcoming / (statusDistribution.total || 1)) * 100)}%)
                    </span>
                  </span>
                </div>

                {/* No-show */}
                <div className="flex items-center justify-between text-xs p-1.5 rounded-lg bg-slate-50/70 border border-slate-100">
                  <span className="flex items-center gap-1.5 text-slate-600 font-semibold truncate">
                    <span className="size-2 rounded-full bg-amber-500 shrink-0" />
                    <span>No-show</span>
                  </span>
                  <span className="font-extrabold text-slate-900 font-sans ml-2 shrink-0">
                    {statusDistribution.noShow}{" "}
                    <span className="text-slate-400 font-medium text-[10px]">
                      ({Math.round((statusDistribution.noShow / (statusDistribution.total || 1)) * 100)}%)
                    </span>
                  </span>
                </div>

                {/* Cancelled */}
                <div className="flex items-center justify-between text-xs p-1.5 rounded-lg bg-slate-50/70 border border-slate-100">
                  <span className="flex items-center gap-1.5 text-slate-600 font-semibold truncate">
                    <span className="size-2 rounded-full bg-rose-500 shrink-0" />
                    <span>Cancelled</span>
                  </span>
                  <span className="font-extrabold text-slate-900 font-sans ml-2 shrink-0">
                    {statusDistribution.cancelled}{" "}
                    <span className="text-slate-400 font-medium text-[10px]">
                      ({Math.round((statusDistribution.cancelled / (statusDistribution.total || 1)) * 100)}%)
                    </span>
                  </span>
                </div>
              </div>

              {/* Completed vs No-Show Comparison Box */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-1.5">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-slate-700">Completed vs Missed visits</span>
                  <span className="text-teal-800 font-sans">
                    {statusDistribution.completed} / {statusDistribution.noShow}
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 flex overflow-hidden">
                  <div
                    className="bg-emerald-500 h-1.5 transition-all"
                    style={{
                      width: `${
                        statusDistribution.completed + statusDistribution.noShow > 0
                          ? (statusDistribution.completed /
                              (statusDistribution.completed + statusDistribution.noShow)) *
                            100
                          : 0
                      }%`,
                    }}
                  />
                  <div
                    className="bg-amber-400 h-1.5 transition-all"
                    style={{
                      width: `${
                        statusDistribution.completed + statusDistribution.noShow > 0
                          ? (statusDistribution.noShow /
                              (statusDistribution.completed + statusDistribution.noShow)) *
                            100
                          : 0
                      }%`,
                    }}
                  />
                </div>
                <p className="text-[10px] text-slate-500">
                  Green indicates attended visits, amber indicates patient no-shows.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Popular Treatments Bar Chart */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                Top Treatments
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Highest booked procedures and revenue contributions
              </p>
            </div>
            <Link
              href="/admin/services"
              className="text-xs text-teal-700 hover:text-teal-800 font-bold inline-flex items-center gap-1 transition-colors"
            >
              <span>Manage all</span>
              <ArrowForwardOutlined sx={{ fontSize: 13 }} />
            </Link>
          </div>

          <div className="pt-4 space-y-3.5">
            {popularTreatments.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">
                No treatment booking history recorded yet.
              </p>
            ) : (
              popularTreatments.map((treatment, idx) => {
                const maxBookings = Math.max(
                  ...popularTreatments.map((t) => t.bookings),
                  1
                );
                const percent = Math.round((treatment.bookings / maxBookings) * 100);

                return (
                  <div key={treatment.name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="size-5 rounded-md bg-teal-50 border border-teal-200/60 text-teal-800 font-black text-[10px] flex items-center justify-center">
                          #{idx + 1}
                        </span>
                        <span className="font-extrabold text-slate-900">
                          {treatment.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-slate-600">
                          {treatment.bookings} bookings
                        </span>
                        <span className="font-black text-teal-700 font-sans min-w-[70px] text-right">
                          {formatPKR(treatment.revenue)}
                        </span>
                      </div>
                    </div>
                    {/* Horizontal Bar */}
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-teal-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Checkout Dialog */}
      <CheckoutDialog
        apt={checkoutApt}
        amountValue={amountValue}
        setAmountValue={setAmountValue}
        editablePrice={true}
        onClose={() => setCheckoutApt(null)}
        onConfirm={handleConfirmCheckout}
      />
    </div>
  );
}
