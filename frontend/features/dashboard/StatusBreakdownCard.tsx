"use client";

import { PieChart, Pie, Cell, Tooltip } from "recharts";
import type { StatusDistribution } from "./types";

export default function StatusBreakdownCard({
    distribution,
}: {
    distribution: StatusDistribution;
}) {
    const total = distribution.total || 0;
    const slices = [
        { name: "Completed", value: distribution.completed, color: "#10b981" },
        { name: "Upcoming", value: distribution.upcoming, color: "#0d9488" },
        { name: "Cancelled", value: distribution.cancelled, color: "#f43f5e" },
        { name: "No-show", value: distribution.noShow, color: "#f59e0b" },
    ];
    const nonZero = slices.filter((s) => s.value > 0);

    return (
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 flex flex-col">
            <div className="pb-3 border-b border-slate-100">
                <h2 className="text-base font-bold text-slate-900">Appointment status breakdown</h2>
                <p className="text-xs text-slate-500">All recorded visits ({total})</p>
            </div>

            {nonZero.length === 0 ? (
                <div className="h-48 flex items-center justify-center text-xs text-slate-500">
                    No appointments recorded yet.
                </div>
            ) : (
                <div className="flex-1 flex flex-col sm:flex-row items-center gap-6 pt-5">
                    <div className="relative w-44 h-44 shrink-0 flex items-center justify-center">
                        <PieChart width={176} height={176}>
                            <Pie
                                data={nonZero}
                                dataKey="value"
                                cx="50%"
                                cy="50%"
                                innerRadius={52}
                                outerRadius={76}
                                paddingAngle={3}
                                strokeWidth={0}
                                isAnimationActive={false}
                            >
                                {nonZero.map((entry) => (
                                    <Cell key={entry.name} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(val: unknown, name: unknown) => [Number(val) || 0, String(name || "")]}
                                contentStyle={{
                                    backgroundColor: "#ffffff",
                                    borderColor: "#e2e8f0",
                                    borderRadius: "10px",
                                    fontSize: "12px",
                                }}
                            />
                        </PieChart>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-xl font-bold text-slate-900 tabular-nums leading-none">
                                {total}
                            </span>
                            <span className="text-[11px] font-medium text-slate-500 mt-1">Total</span>
                        </div>
                    </div>

                    <div className="flex-1 w-full min-w-0 space-y-2">
                        {slices.map((s) => {
                            const pct = total > 0 ? Math.round((s.value / total) * 100) : 0;
                            return (
                                <div
                                    key={s.name}
                                    className="flex items-center justify-between gap-3 px-3 py-2 rounded-xl bg-slate-50/80 border border-slate-100"
                                >
                                    <span className="flex items-center gap-2.5 min-w-0">
                                        <span
                                            className="size-2.5 rounded-full shrink-0"
                                            style={{ backgroundColor: s.color }}
                                        />
                                        <span className="text-xs font-semibold text-slate-700 whitespace-nowrap">
                                            {s.name}
                                        </span>
                                    </span>
                                    <span className="flex items-center gap-2 shrink-0 tabular-nums">
                                        <span className="text-xs font-bold text-slate-900">{s.value}</span>
                                        <span className="text-[11px] font-medium text-slate-400 w-8 text-right">
                                            {pct}%
                                        </span>
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
