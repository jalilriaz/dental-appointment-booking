"use client";

import React, { useState, useEffect, useMemo } from "react";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import ShowChartOutlinedIcon from "@mui/icons-material/ShowChartOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import ArrowUpwardOutlinedIcon from "@mui/icons-material/ArrowUpwardOutlined";
import ArrowDownwardOutlinedIcon from "@mui/icons-material/ArrowDownwardOutlined";
import { 
  Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ComposedChart 
} from "recharts";
import { format } from "date-fns";
import { getRevenueData } from "@/app/actions/revenue";
import { formatPKR, formatDate } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";

// Clinical Color Palette (Purple Ban Compliant - No Purple/Violet/Indigo)
const SERVICE_COLORS = [
  "#0d9488", // Primary Clinical Teal
  "#0284c7", // Sky Blue
  "#059669", // Emerald
  "#d97706", // Amber
  "#2563eb", // Royal Blue
  "#0891b2", // Cyan
  "#ea580c", // Deep Orange
  "#16a34a", // Green
  "#475569", // Slate
  "#0369a1", // Deep Sky
  "#0f766e", // Deep Teal
  "#ca8a04", // Gold Amber
  "#e11d48", // Rose Red
  "#2dd4bf", // Mint Teal
  "#38bdf8", // Light Sky
  "#34d399", // Seafoam
  "#fbbf24", // Yellow Amber
  "#60a5fa", // Light Blue
  "#14b8a6", // Bright Teal
  "#f97316", // Warm Orange
];

export default function RevenueClient({ initialData }: { initialData: any }) {
  const [dateRange, setDateRange] = useState("last6Months");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(initialData);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const momData = useMemo(() => {
    if (!data || !data.monthlyChartData || data.monthlyChartData.length < 2) return null;
    const currentMonth = data.monthlyChartData[data.monthlyChartData.length - 1];
    const prevMonth = data.monthlyChartData[data.monthlyChartData.length - 2];
    
    const currentTotal = currentMonth.total || 0;
    const prevTotal = prevMonth.total || 0;
    
    if (prevTotal === 0) return null;
    const pct = ((currentTotal - prevTotal) / prevTotal) * 100;
    const isPositive = pct >= 0;
    return {
      value: Math.abs(pct).toFixed(1),
      isPositive,
      prevMonthLabel: prevMonth.name
    };
  }, [data]);

  // Sync when initialData changes from soft revalidates (revalidatePath)
  useEffect(() => {
    if (dateRange === "last6Months") {
      setData(initialData);
    }
  }, [initialData, dateRange]);

  // Fetch data dynamically and enable REAL-TIME Background Polling
  useEffect(() => {
    let ignore = false;
    
    async function loadData(isSilentPolling = false) {
      if (dateRange === "custom" && (!customStart || !customEnd)) return;
      
      if (!isSilentPolling) setLoading(true);
      
      try {
        const result = await getRevenueData(dateRange, customStart, customEnd);
        if (!ignore) {
            setData(result);
        }
      } catch (error) {
        console.error("Failed to fetch revenue data", error);
      }
      
      if (!isSilentPolling) setLoading(false);
    }
    
    const timer = setTimeout(() => {
        loadData(false);
    }, 50);
    
    // Live Auto-Refresh (Polling) every 15 seconds
    const liveUpdateInterval = setInterval(() => {
        loadData(true);
    }, 15000); 

    return () => {
      ignore = true;
      clearTimeout(timer);
      clearInterval(liveUpdateInterval);
    };
  }, [dateRange, customStart, customEnd]);

  // CSV Export Trigger
  const handleExportCSV = () => {
    if (!data || !data.rawDataForExport || data.rawDataForExport.length === 0) return;
    
    const headers = Object.keys(data.rawDataForExport[0]).join(",");
    const rows = data.rawDataForExport.map((row: any) => Object.values(row).join(",")).join("\n");
    const csvContent = `data:text/csv;charset=utf-8,${headers}\n${rows}`;
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `revenue_report_${format(new Date(), "yyyy-MM-dd")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Custom Tooltip for Stacked Bar Chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const activeServices = payload.filter((entry: any) => entry.dataKey !== "total" && entry.value > 0);
      activeServices.sort((a: any, b: any) => b.value - a.value);

      return (
        <div className="bg-white border border-slate-200/90 p-4 rounded-2xl shadow-xl z-50 text-slate-800 min-w-[280px]">
          <p className="font-black text-sm mb-2 text-slate-900 border-b border-slate-100 pb-1.5">{label}</p>
          <div className="space-y-1.5 max-h-[240px] overflow-y-auto">
            {activeServices.map((entry: any, index: number) => {
              const bgOpacity = hoveredCategory && hoveredCategory !== entry.name ? "opacity-30" : "";
              return (
                <div key={index} className={`flex items-center justify-between gap-4 text-xs ${bgOpacity} transition-opacity duration-200`}>
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="size-2.5 rounded-[2px] shrink-0" style={{ backgroundColor: entry.color }} />
                    <span className="text-slate-600 truncate max-w-[160px] font-medium" title={entry.name}>{entry.name}</span>
                  </div>
                  <span className="text-slate-900 font-extrabold shrink-0">
                    {formatPKR(entry.value)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
    return null;
  };

  const getLabel = () => {
      if (dateRange === "thisMonth") return "This Month";
      if (dateRange === "last6Months") return "Last 6 Months";
      if (dateRange === "last12Months") return "Last 12 Months";
      if (dateRange === "thisYear") return "This Year";
      if (dateRange === "allTime") return "All Time";
      return "Custom Range";
  };

  const {
      filteredTotal = 0,
      filteredAptRevenue = 0,
      filteredInstallmentRevenue = 0,
      filteredDiscount = 0,
      filteredAvg = 0,
      projectedFromScheduled = 0,
      scheduledCount = 0,
      appointmentsCount = 0
  } = (data?.summaries || {});

  const totalProjected = (data?.summaries?.filteredTotal || 0) + projectedFromScheduled;

  return (
    <div className="space-y-8">
      
      {/* ──────────────────────────────────────────────────────────────────
          1. HEADER & ACTIONS
          ────────────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 text-xs font-bold mb-2">
            <AttachMoneyOutlinedIcon sx={{ fontSize: 14, color: "#0d9488" }} />
            <span>Practice Financial Ledger & Clinical Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Revenue Analytics & Financial Summary
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Financial performance overview based on {appointmentsCount} completed procedures, collected revenues, and projected bookings.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          disabled={loading || !data?.rawDataForExport?.length}
          className="bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-2xl h-11 px-5 shadow-xs transition-all active:scale-[0.98] cursor-pointer inline-flex items-center gap-2 disabled:opacity-50 shrink-0 self-start sm:self-auto"
        >
          <DownloadOutlinedIcon className="size-4" />
          <span>Export to CSV</span>
        </button>
      </div>

      {/* ──────────────────────────────────────────────────────────────────
          2. FILTER & TIME RANGE SELECTOR
          ────────────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="w-48">
            <Select 
              value={dateRange}
              onValueChange={(val) => setDateRange(val)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Range" />
              </SelectTrigger>
              <SelectContent position="popper" align="start">
                <SelectItem value="thisMonth">This Month</SelectItem>
                <SelectItem value="last6Months">Last 6 Months</SelectItem>
                <SelectItem value="last12Months">Last 12 Months</SelectItem>
                <SelectItem value="thisYear">This Year</SelectItem>
                <SelectItem value="allTime">All Time</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {dateRange === "custom" && (
            <div className="flex items-center gap-2 animate-fade-in flex-wrap">
              <DatePicker
                value={customStart}
                onChange={setCustomStart}
                placeholder="From date"
                compact
              />
              <span className="text-slate-400 text-xs font-bold">→</span>
              <DatePicker
                value={customEnd}
                onChange={setCustomEnd}
                placeholder="To date"
                compact
              />
            </div>
          )}
        </div>

        <span className="text-xs font-semibold text-slate-400">
          Cycle: <strong className="text-teal-800 font-bold">{getLabel()}</strong>
        </span>
      </div>

      {loading ? (
        <div className="grid lg:grid-cols-2 gap-6 animate-pulse">
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs h-[400px] lg:col-span-2 flex flex-col gap-4">
                <div className="h-6 w-48 bg-slate-100 rounded-xl"></div>
                <div className="flex-1 bg-slate-50 rounded-2xl flex items-end justify-between p-4 gap-4">
                    <div className="w-12 bg-slate-200/60 h-1/4 rounded-xl"></div>
                    <div className="w-12 bg-slate-200/60 h-1/2 rounded-xl"></div>
                    <div className="w-12 bg-slate-200/60 h-3/4 rounded-xl"></div>
                    <div className="w-12 bg-slate-200/60 h-1/2 rounded-xl"></div>
                    <div className="w-12 bg-slate-200/60 h-full rounded-xl"></div>
                </div>
            </div>
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs h-[300px]">
                <div className="h-6 w-32 bg-slate-100 rounded-xl mb-6"></div>
                <div className="space-y-4">
                    <div className="h-10 bg-slate-50 rounded-xl"></div>
                    <div className="h-10 bg-slate-50 rounded-xl w-4/5"></div>
                    <div className="h-10 bg-slate-50 rounded-xl w-3/5"></div>
                </div>
            </div>
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs h-[300px]">
                <div className="h-6 w-32 bg-slate-100 rounded-xl mb-6"></div>
                <div className="space-y-4">
                    <div className="h-8 bg-slate-50 rounded-xl"></div>
                    <div className="h-8 bg-slate-50 rounded-xl w-4/5"></div>
                    <div className="h-8 bg-slate-50 rounded-xl w-3/5"></div>
                </div>
            </div>
        </div>
      ) : !data || data.monthlyChartData.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 flex flex-col items-center justify-center text-center border border-slate-200/90 shadow-2xs">
            <CalendarTodayOutlinedIcon className="size-10 text-slate-300 mb-3" />
            <h3 className="text-base font-bold text-slate-700">No revenue data found</h3>
            <p className="text-xs text-slate-400 mt-1">There are no completed appointments recorded for this date range.</p>
        </div>
      ) : (
        <>
            {/* ──────────────────────────────────────────────────────────────────
                3. KPI SUMMARY CARDS
                ────────────────────────────────────────────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {/* Collected */}
                <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Collected ({getLabel()})</span>
                        <div className="size-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                            <AttachMoneyOutlinedIcon sx={{ fontSize: 18 }} />
                        </div>
                    </div>
                    <p className="text-2xl sm:text-3xl font-black text-emerald-600 mt-2">{formatPKR(filteredTotal)}</p>
                    <span className="text-[11px] font-semibold text-slate-500 mt-1 block">
                        Appointments: {formatPKR(filteredAptRevenue)} · Installments: {formatPKR(filteredInstallmentRevenue)}
                    </span>
                </div>

                {/* Projected */}
                <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Projected</span>
                        <div className="size-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                            <TrendingUpOutlinedIcon sx={{ fontSize: 18 }} />
                        </div>
                    </div>
                    <p className="text-2xl sm:text-3xl font-black text-blue-600 mt-2">{formatPKR(totalProjected)}</p>
                    <span className="text-[11px] font-semibold text-slate-500 mt-1 block">
                        + {formatPKR(projectedFromScheduled)} from {scheduledCount} upcoming
                    </span>
                </div>

                {/* Avg Per Visit */}
                <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Avg. Per Visit ({getLabel()})</span>
                        <div className="size-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                            <ShowChartOutlinedIcon sx={{ fontSize: 18 }} />
                        </div>
                    </div>
                    <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">{formatPKR(filteredAvg)}</p>
                    <span className="text-[11px] font-semibold text-slate-500 mt-1 block">
                        Across {appointmentsCount} completed visits
                    </span>
                </div>

                {/* Discounts */}
                <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Discounts ({getLabel()})</span>
                        <div className="size-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                            <PeopleAltOutlinedIcon sx={{ fontSize: 18 }} />
                        </div>
                    </div>
                    <p className="text-2xl sm:text-3xl font-black text-amber-600 mt-2">{formatPKR(filteredDiscount)}</p>
                    <span className="text-[11px] font-semibold text-slate-500 mt-1 block">
                        Total discounts in this period
                    </span>
                </div>
            </div>

          {/* ──────────────────────────────────────────────────────────────────
              4. STACKED BAR CHART (REVENUE BY CATEGORY)
              ────────────────────────────────────────────────────────────────── */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs">
            {/* KPI Header & MoM Badge */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-6 border-b border-slate-100 gap-4">
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Revenue by Category</h3>
                <div className="flex flex-wrap items-baseline gap-4">
                  <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                    {formatPKR(
                      data.monthlyChartData.reduce((sum: number, month: any) => sum + (month.total || 0), 0)
                    )}
                  </span>
                  {momData && (
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                      momData.isPositive 
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-200" 
                        : "bg-rose-50 text-rose-800 border border-rose-200"
                    }`}>
                      {momData.isPositive ? (
                        <ArrowUpwardOutlinedIcon sx={{ fontSize: 14 }} />
                      ) : (
                        <ArrowDownwardOutlinedIcon sx={{ fontSize: 14 }} />
                      )}
                      {momData.value}% vs {momData.prevMonthLabel}
                    </span>
                  )}
                </div>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-400 sm:text-right">
                Monthly Breakdown of Services Provided
              </p>
            </div>

            {/* The Stacked Bar Graph */}
            <div className="h-[380px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={data.monthlyChartData} margin={{ top: 20, right: 30, left: 10, bottom: 5 }} barSize={42}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    stroke="#64748b" 
                    tick={{ fill: "#64748b", fontSize: 12, fontWeight: 600 }} 
                    axisLine={{ stroke: "#e2e8f0" }}
                  />
                  <YAxis 
                    stroke="#64748b" 
                    tickFormatter={(value) => `${(value / 1000)}k`}
                    width={70}
                    tick={{ fill: "#64748b", fontSize: 12, fontWeight: 600 }}
                    axisLine={{ stroke: "#e2e8f0" }}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(13, 148, 136, 0.05)" }} />
                  
                  {/* Dynamic Stacked Bars for every active Category */}
                  {(data.categoriesList || []).map((category: string, index: number) => {
                    const color = SERVICE_COLORS[index % SERVICE_COLORS.length];
                    return (
                      <Bar 
                        key={category} 
                        dataKey={category} 
                        stackId="a" 
                        fill={color} 
                        fillOpacity={hoveredCategory && hoveredCategory !== category ? 0.3 : 1}
                        stroke="#ffffff" 
                        strokeWidth={1.5}
                        onMouseEnter={() => setHoveredCategory(category)}
                        onMouseLeave={() => setHoveredCategory(null)}
                        style={{ cursor: "pointer", transition: "opacity 0.2s ease" }}
                      />
                    );
                  })}
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* Custom Interactive Legend */}
            <div className="mt-8 pt-6 border-t border-slate-100">
              <div className="flex flex-wrap items-center gap-2 justify-center">
                {(data.categoriesList || []).map((category: string, index: number) => (
                  <div 
                    key={category} 
                    className={`flex items-center gap-2 cursor-pointer transition-all duration-200 rounded-xl px-3 py-1.5 border ${
                      hoveredCategory === category 
                        ? "bg-slate-100 border-slate-300 shadow-2xs" 
                        : "bg-slate-50 border-slate-200/80 hover:bg-slate-100/70"
                    }`}
                    onMouseEnter={() => setHoveredCategory(category)}
                    onMouseLeave={() => setHoveredCategory(null)}
                  >
                    <div 
                      className={`size-3 rounded-[3px] shadow-2xs transition-transform duration-200 ${
                        hoveredCategory === category ? "scale-125 ring-2 ring-teal-500/30" : ""
                      }`} 
                      style={{ backgroundColor: SERVICE_COLORS[index % SERVICE_COLORS.length] }} 
                    />
                    <span className={`text-xs font-bold transition-colors ${
                      hoveredCategory === category 
                        ? "text-slate-900" 
                        : hoveredCategory 
                        ? "text-slate-400" 
                        : "text-slate-700"
                    }`}>
                      {category}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-center">
              <button 
                onClick={() => document.getElementById('appointments-table')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-xs font-bold text-teal-700 hover:text-teal-800 cursor-pointer transition-colors flex items-center gap-1.5 group"
              >
                <span>View itemized procedure ledger below</span>
                <svg className="size-4 group-hover:translate-y-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </button>
            </div>
          </div>

            {/* ──────────────────────────────────────────────────────────────────
                5. COMPLETED APPOINTMENTS REVENUE LEDGER
                ────────────────────────────────────────────────────────────────── */}
            <div id="appointments-table" className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden scroll-mt-6">
                <div className="px-6 py-4 border-b border-slate-200/90">
                    <h2 className="text-base sm:text-lg font-black text-slate-900">
                        Completed Appointments Ledger ({getLabel()})
                    </h2>
                    <p className="text-xs text-slate-500 font-medium">
                        {data.serializedAppointments.length} procedure{data.serializedAppointments.length !== 1 ? "s" : ""} settled in this financial cycle
                    </p>
                </div>
                <div className="overflow-x-auto max-h-[500px] overflow-y-auto custom-scrollbar">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50/95 sticky top-0 z-10 border-b border-slate-200/90">
                            <tr>
                                <th className="text-left px-5 py-3.5 text-xs font-extrabold text-slate-500 uppercase tracking-wider">Date</th>
                                <th className="text-left px-5 py-3.5 text-xs font-extrabold text-slate-500 uppercase tracking-wider">Patient</th>
                                <th className="text-left px-5 py-3.5 text-xs font-extrabold text-slate-500 uppercase tracking-wider">Treatment</th>
                                <th className="text-left px-5 py-3.5 text-xs font-extrabold text-slate-500 uppercase tracking-wider">Collected</th>
                                <th className="text-left px-5 py-3.5 text-xs font-extrabold text-slate-500 uppercase tracking-wider">Discount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100/90">
                            {data.serializedAppointments.map((apt: any) => (
                                <tr key={apt.id} className="hover:bg-slate-50/80 transition-premium">
                                    <td className="px-5 py-3 text-xs font-semibold text-slate-700 whitespace-nowrap">
                                        {formatDate(apt.startTime)}
                                    </td>
                                    <td className="px-5 py-3 font-bold text-slate-900 text-xs sm:text-sm whitespace-nowrap">{apt.patient?.name || "Unknown"}</td>
                                    <td className="px-5 py-3 text-xs font-medium text-slate-700 whitespace-nowrap">{apt.treatment.name}</td>
                                    <td className="px-5 py-3 font-extrabold text-teal-800 text-xs whitespace-nowrap">{formatPKR(apt.amountPaid ?? 0)}</td>
                                    <td className="px-5 py-3 text-xs font-semibold text-amber-700 whitespace-nowrap">
                                        {(apt.discount ?? 0) > 0 ? `-${formatPKR(apt.discount)}` : "—"}
                                    </td>
                                </tr>
                            ))}
                            {data.serializedAppointments.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-10 text-center text-xs font-semibold text-slate-400">No completed appointments in this period.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

        </>
      )}
    </div>
  );
}
