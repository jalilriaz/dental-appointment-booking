"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Download, CalendarIcon, DollarSign, TrendingUp, Activity, Users, ArrowUp, ArrowDown } from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid, ComposedChart, Line 
} from "recharts";
import { format } from "date-fns";
import { getRevenueData } from "@/app/actions/revenue";
import { formatPKR, formatDate } from "@/lib/utils";

// Category Colors (Legacy)
const CATEGORY_COLORS = {
  Cosmetic: "#0ea5e9",      // Sky Blue
  Restorative: "#f59e0b",   // Amber
  General: "#10b981",       // Emerald
  Consultations: "#8b5cf6"  // Violet
};

// AWS Cost Explorer Inspired Palette for Treatments (Expanded for 18+ services)
const SERVICE_COLORS = [
  "#6366f1", // Indigo
  "#ec4899", // Pink
  "#14b8a6", // Teal
  "#f59e0b", // Amber
  "#3b82f6", // Blue
  "#8b5cf6", // Violet
  "#10b981", // Emerald
  "#f43f5e", // Rose
  "#06b6d4", // Cyan
  "#f97316", // Orange
  "#84cc16", // Lime
  "#eab308", // Yellow
  "#0ea5e9", // Sky
  "#d946ef", // Fuchsia
  "#ef4444", // Red
  "#22c55e", // Green
  "#a855f7", // Purple
  "#f472b6", // Light Pink
  "#2dd4bf", // Light Teal
  "#fbbf24", // Light Amber
  "#60a5fa", // Light Blue
  "#c084fc", // Light Violet
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
    // Only overwrite if we are viewing the default range that initialData represents
    if (dateRange === "last6Months") {
      setData(initialData);
    }
  }, [initialData, dateRange]);

  // Fetch data dynamically and enable REAL-TIME Background Polling
  useEffect(() => {
    let ignore = false;
    
    async function loadData(isSilentPolling = false) {
      if (dateRange === "custom" && (!customStart || !customEnd)) return;
      
      // Don't show loading spinner for silent background auto-updates
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
    
    // Initial fetch on filter change
    const timer = setTimeout(() => {
        loadData(false);
    }, 50);
    
    // Live Auto-Refresh (Polling) every 15 seconds to catch new checkouts
    const liveUpdateInterval = setInterval(() => {
        loadData(true);
    }, 15000); 

    return () => {
        ignore = true;
        clearTimeout(timer);
        clearInterval(liveUpdateInterval);
    };
  }, [dateRange, customStart, customEnd]);

  // Export to CSV Logic
  const handleExportCSV = () => {
    if (!data.rawDataForExport || !data.rawDataForExport.length) return;
    
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

  // Custom Tooltip for Stacked Bar Chart (AWS Style)
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const parentData = payload[0].payload;
      const total = parentData.total || 0;
      
      // Filter out empty values and the trendline 'total'
      const activeServices = payload.filter((entry: any) => entry.dataKey !== "total" && entry.value > 0);

      // Sort by value descending so biggest bars are at top
      activeServices.sort((a: any, b: any) => b.value - a.value);

      return (
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xl z-50 text-slate-800 min-w-[320px]">
          <p className="font-bold text-base mb-3 text-slate-900">{label}</p>
          <div className="space-y-1.5">
            {activeServices.map((entry: any, index: number) => {
              const bgOpacity = hoveredCategory && hoveredCategory !== entry.name ? "opacity-30" : "";
              return (
                <div key={index} className={`flex items-center justify-between gap-6 text-sm ${bgOpacity} transition-opacity duration-200`}>
                  <div className="flex items-center gap-2">
                    <div className="w-3.5 h-3.5 rounded-[2px]" style={{ backgroundColor: entry.color }} />
                    <span className="text-slate-600 truncate max-w-[180px]" title={entry.name}>{entry.name}</span>
                  </div>
                  <span className="text-slate-900 min-w-[80px] text-right">
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
  }

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
    <div className="space-y-6">
      
      <div>
          <h1 className="text-2xl font-bold text-white">Revenue Dashboard</h1>
          <p className="text-sm text-slate-400">
              Financial overview based on {appointmentsCount} completed appointments
          </p>
      </div>

      {/* 1. Top Control Bar */}
      <div className="glass-card p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-l-4 border-l-teal-500">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-slate-300 bg-slate-800/50 px-3 py-2 rounded-lg border border-slate-700">
            <CalendarIcon className="size-4 text-teal-400" />
            <select 
              className="bg-transparent border-none text-sm font-medium focus:ring-0 cursor-pointer outline-none"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="thisMonth" className="bg-slate-900">This Month</option>
              <option value="last6Months" className="bg-slate-900">Last 6 Months</option>
              <option value="last12Months" className="bg-slate-900">Last 12 Months</option>
              <option value="thisYear" className="bg-slate-900">This Year</option>
              <option value="allTime" className="bg-slate-900">All Time</option>
              <option value="custom" className="bg-slate-900">Custom Range</option>
            </select>
          </div>

          {dateRange === "custom" && (
            <div className="flex items-center gap-2 animate-fade-in">
              <input 
                type="date" 
                className="bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white focus:border-teal-500 outline-none"
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
              />
              <span className="text-slate-500">to</span>
              <input 
                type="date" 
                className="bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white focus:border-teal-500 outline-none"
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
              />
            </div>
          )}
        </div>

        <button 
          onClick={handleExportCSV}
          disabled={loading || !data?.rawDataForExport?.length}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg border border-slate-600 transition-colors disabled:opacity-50"
        >
          <Download className="size-4 text-emerald-400" />
          <span className="text-sm font-medium">Export to CSV</span>
        </button>
      </div>

      {loading ? (
        <div className="grid lg:grid-cols-2 gap-6 animate-pulse">
            <div className="glass-card p-6 rounded-xl border border-slate-800 h-[400px] lg:col-span-2 flex flex-col gap-4">
                <div className="h-6 w-48 bg-slate-800 rounded"></div>
                <div className="flex-1 bg-slate-800/50 rounded flex items-end justify-between p-4 gap-4">
                    <div className="w-12 bg-slate-700/50 h-1/4 rounded"></div>
                    <div className="w-12 bg-slate-700/50 h-1/2 rounded"></div>
                    <div className="w-12 bg-slate-700/50 h-3/4 rounded"></div>
                    <div className="w-12 bg-slate-700/50 h-1/2 rounded"></div>
                    <div className="w-12 bg-slate-700/50 h-full rounded"></div>
                </div>
            </div>
            <div className="glass-card p-6 rounded-xl border border-slate-800 h-[300px]">
                <div className="h-6 w-32 bg-slate-800 rounded mb-6"></div>
                <div className="space-y-4">
                    <div className="h-10 bg-slate-800/50 rounded"></div>
                    <div className="h-10 bg-slate-800/50 rounded w-4/5"></div>
                    <div className="h-10 bg-slate-800/50 rounded w-3/5"></div>
                </div>
            </div>
            <div className="glass-card p-6 rounded-xl border border-slate-800 h-[300px]">
                <div className="h-6 w-32 bg-slate-800 rounded mb-6"></div>
                <div className="space-y-4">
                    <div className="h-8 bg-slate-800/50 rounded"></div>
                    <div className="h-8 bg-slate-800/50 rounded w-4/5"></div>
                    <div className="h-8 bg-slate-800/50 rounded w-3/5"></div>
                </div>
            </div>
        </div>
      ) : !data || data.monthlyChartData.length === 0 ? (
        <div className="glass-card h-64 flex flex-col items-center justify-center text-center rounded-xl border border-slate-800">
            <CalendarIcon className="size-10 text-slate-500 mb-3" />
            <h3 className="text-lg font-medium text-white">No revenue data found</h3>
            <p className="text-sm text-slate-400 mt-1">There are no completed appointments for this date range.</p>
        </div>
      ) : (
        <>
            {/* ── Main Summary Cards ───────────────────────────── */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="glass-card rounded-xl p-5 border-l-4 border-l-emerald-500">
                    <div className="flex items-center justify-between">
                        <p className="text-xs font-medium text-slate-400 uppercase">Collected ({getLabel()})</p>
                        <DollarSign className="size-4 text-emerald-400" />
                    </div>
                    <p className="text-2xl font-bold text-emerald-400 mt-2">{formatPKR(filteredTotal)}</p>
                    <p className="text-[10px] text-slate-500 mt-1">
                        Appointments: {formatPKR(filteredAptRevenue)} + Installments: {formatPKR(filteredInstallmentRevenue)}
                    </p>
                </div>
                <div className="glass-card rounded-xl p-5 border-l-4 border-l-blue-400">
                    <div className="flex items-center justify-between">
                        <p className="text-xs font-medium text-slate-400 uppercase">Projected</p>
                        <TrendingUp className="size-4 text-blue-400" />
                    </div>
                    <p className="text-2xl font-bold text-blue-400 mt-2">{formatPKR(totalProjected)}</p>
                    <p className="text-[10px] text-slate-500 mt-1">
                        + {formatPKR(projectedFromScheduled)} from {scheduledCount} upcoming
                    </p>
                </div>
                <div className="glass-card rounded-xl p-5 border-l-4 border-l-indigo-400">
                    <div className="flex items-center justify-between">
                        <p className="text-xs font-medium text-slate-400 uppercase">Avg. Per Visit ({getLabel()})</p>
                        <Activity className="size-4 text-indigo-400" />
                    </div>
                    <p className="text-2xl font-bold text-indigo-400 mt-2">{formatPKR(filteredAvg)}</p>
                    <p className="text-[10px] text-slate-500 mt-1">
                        Across {appointmentsCount} visits
                    </p>
                </div>
                <div className="glass-card rounded-xl p-5 border-l-4 border-l-amber-400">
                    <div className="flex items-center justify-between">
                        <p className="text-xs font-medium text-slate-400 uppercase">Discounts ({getLabel()})</p>
                        <Users className="size-4 text-amber-400" />
                    </div>
                    <p className="text-2xl font-bold text-amber-400 mt-2">{formatPKR(filteredDiscount)}</p>
                    <p className="text-[10px] text-slate-500 mt-1">
                        Total discounts in this period
                    </p>
                </div>
            </div>

          {/* 2. Stacked Bar Chart (Category Breakdown) */}
          <div className="glass-card p-6 rounded-xl border border-slate-800 max-w-5xl mx-auto">
            {/* KPI Header & MoM Badge */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-6 border-b border-white/[0.06] gap-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Revenue by Category</h3>
                <div className="flex flex-wrap items-baseline gap-4">
                  <span className="text-4xl font-bold text-white tracking-tight">
                    {formatPKR(
                      data.monthlyChartData.reduce((sum: number, month: any) => sum + (month.total || 0), 0)
                    )}
                  </span>
                  {momData && (
                    <span className={`px-2.5 py-1 rounded-full text-sm font-semibold flex items-center gap-1.5 ${momData.isPositive ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20" : "bg-rose-500/15 text-rose-400 border border-rose-500/20"}`}>
                      {momData.isPositive ? (
                        <ArrowUp className="size-4" />
                      ) : (
                        <ArrowDown className="size-4" />
                      )}
                      {momData.value}% vs {momData.prevMonthLabel}
                    </span>
                  )}
                </div>
              </div>
              <p className="text-sm text-slate-400 max-w-[200px] sm:text-right">
                Monthly Breakdown of Services Provided
              </p>
            </div>

            {/* The Stacked Bar Graph */}
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={data.monthlyChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }} barSize={45}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    stroke="#94a3b8" 
                    tick={{ fill: "#94a3b8" }} 
                    axisLine={{ stroke: "#475569" }}
                  />
                  <YAxis 
                    stroke="#94a3b8" 
                    tickFormatter={(value) => `${(value / 1000)}k`}
                    width={80}
                    axisLine={{ stroke: "#475569" }}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.05)" }} />
                  
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
                        stroke="#0f172a" 
                        strokeWidth={2}
                        onMouseEnter={() => setHoveredCategory(category)}
                        onMouseLeave={() => setHoveredCategory(null)}
                        style={{ cursor: "pointer", transition: "opacity 0.2s ease" }}
                      />
                    );
                  })}
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* Custom Interactive Legend AWS Style */}
            <div className="mt-8 pt-6 border-t border-slate-800">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-2 justify-center">
                {(data.categoriesList || []).map((category: string, index: number) => (
                  <div 
                    key={category} 
                    className={`flex items-center gap-2 cursor-pointer transition-all duration-300 rounded-lg px-3 py-1.5 ${hoveredCategory === category ? "bg-white/[0.08]" : "hover:bg-white/[0.04]"}`}
                    onMouseEnter={() => setHoveredCategory(category)}
                    onMouseLeave={() => setHoveredCategory(null)}
                  >
                    <div 
                      className={`w-3.5 h-3.5 rounded-[2px] shadow-sm transition-transform duration-300 ${hoveredCategory === category ? "scale-110 ring-2 ring-white/20" : ""}`} 
                      style={{ backgroundColor: SERVICE_COLORS[index % SERVICE_COLORS.length] }} 
                    />
                    <span className={`text-sm transition-colors duration-300 ${
                      hoveredCategory === category ? "text-white font-semibold" : 
                      hoveredCategory ? "text-slate-500" : "text-slate-300"
                    }`}>
                      {category}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-slate-800/50 flex justify-center">
              <button 
                onClick={() => document.getElementById('appointments-table')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-sm font-medium text-blue-400 hover:text-blue-300 cursor-pointer transition-colors flex items-center gap-2 group"
              >
                Analyze your detailed revenue in Reports
                <svg className="size-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </button>
            </div>
          </div>

            {/* ── Filtered Appointments Table ───────────────────── */}
            <div id="appointments-table" className="glass-card rounded-xl overflow-hidden mt-6 scroll-mt-6">
                <div className="px-6 py-4 border-b border-white/[0.06]">
                    <h2 className="text-lg font-semibold text-white">
                        Completed Appointments ({getLabel()})
                    </h2>
                    <p className="text-xs text-slate-400">
                        {data.serializedAppointments.length} appointment{data.serializedAppointments.length !== 1 ? "s" : ""} in this period
                    </p>
                </div>
                <div className="overflow-x-auto max-h-[500px] overflow-y-auto custom-scrollbar">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-900/50 sticky top-0 z-10 border-b border-white/[0.06]">
                            <tr>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase">Date</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase">Patient</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase">Treatment</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase">Collected</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase">Discount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.04]">
                            {data.serializedAppointments.map((apt: any) => (
                                <tr key={apt.id} className="hover:bg-white/[0.03] transition-premium">
                                    <td className="px-6 py-3 text-slate-300">
                                        {formatDate(apt.startTime)}
                                    </td>
                                    <td className="px-6 py-3 font-medium text-white">{apt.patient?.name || "Unknown"}</td>
                                    <td className="px-6 py-3 text-slate-300">{apt.treatment.name}</td>
                                    <td className="px-6 py-3 font-semibold text-teal-400">{formatPKR(apt.amountPaid ?? 0)}</td>
                                    <td className="px-6 py-3 text-amber-400/80">
                                        {(apt.discount ?? 0) > 0 ? `-${formatPKR(apt.discount)}` : "—"}
                                    </td>
                                </tr>
                            ))}
                            {data.serializedAppointments.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">No completed appointments in this period.</td>
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
