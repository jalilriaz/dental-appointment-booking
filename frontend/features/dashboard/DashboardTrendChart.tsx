"use client";

import { useState, useMemo } from "react";
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
} from "recharts";
import { cn } from "@/lib/utils";
import { formatPKR } from "@/lib/format";
import type { ChartDatasets } from "./types";

interface DashboardTrendChartProps {
    role: "ADMIN" | "STAFF";
    chartData: ChartDatasets;
}

export default function DashboardTrendChart({ role, chartData }: DashboardTrendChartProps) {
    const canViewRevenue = role === "ADMIN";
    const [metric, setMetric] = useState<"revenue" | "appointments">(
        canViewRevenue ? "revenue" : "appointments"
    );
    const [range, setRange] = useState<"weekly" | "monthly" | "yearly">("monthly");

    const series = useMemo(() => chartData[range] || [], [chartData, range]);
    const dataKey = canViewRevenue && metric === "revenue" ? "revenue" : "appointments";
    const hasData = series.some((pt) => (Number(pt[dataKey]) || 0) > 0);

    return (
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                    <h2 className="text-base font-bold text-slate-900">
                        {dataKey === "revenue" ? "Revenue trend" : "Appointment volume"}
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                        {dataKey === "revenue" ? "Collections over time" : "Visits booked over time"}
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    {canViewRevenue && (
                        <div className="flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200/70 text-xs font-semibold">
                            {(["revenue", "appointments"] as const).map((m) => (
                                <button
                                    key={m}
                                    type="button"
                                    onClick={() => setMetric(m)}
                                    className={cn(
                                        "px-2.5 py-1 rounded-lg capitalize cursor-pointer transition-colors",
                                        metric === m ? "bg-white text-teal-800 shadow-2xs" : "text-slate-600"
                                    )}
                                >
                                    {m}
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200/70 text-xs font-semibold">
                        {(["weekly", "monthly", "yearly"] as const).map((r) => (
                            <button
                                key={r}
                                type="button"
                                onClick={() => setRange(r)}
                                className={cn(
                                    "px-2.5 py-1 rounded-lg capitalize cursor-pointer transition-colors",
                                    range === r ? "bg-white text-slate-900 shadow-2xs" : "text-slate-600"
                                )}
                            >
                                {r}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="h-[260px] w-full pt-4 min-w-0" style={{ height: 260 }}>
                {!hasData ? (
                    <div className="h-full flex items-center justify-center text-center text-xs text-slate-500 bg-slate-50/70 rounded-xl border border-dashed border-slate-200">
                        No data yet for this period.
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={series} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="label" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                            <YAxis
                                tick={{ fill: "#64748b", fontSize: 11 }}
                                axisLine={false}
                                tickLine={false}
                                width={dataKey === "revenue" ? 56 : 36}
                                tickFormatter={(v) =>
                                    dataKey === "revenue" ? (v >= 1000 ? `${Math.round(v / 1000)}k` : String(v)) : String(v)
                                }
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#ffffff",
                                    borderColor: "#e2e8f0",
                                    borderRadius: "10px",
                                    fontSize: "12px",
                                }}
                                formatter={(val: unknown) => {
                                    const n = Number(val) || 0;
                                    return dataKey === "revenue" ? [formatPKR(n), "Revenue"] : [n, "Appointments"];
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey={dataKey}
                                stroke="#0d9488"
                                strokeWidth={2}
                                fill="#0d9488"
                                fillOpacity={0.12}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
}
