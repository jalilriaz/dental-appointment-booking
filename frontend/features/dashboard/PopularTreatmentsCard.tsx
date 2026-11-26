"use client";

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { formatPKR } from "@/lib/format";
import type { PopularTreatmentItem } from "./types";

export default function PopularTreatmentsCard({
    items,
    showRevenue,
}: {
    items: PopularTreatmentItem[];
    showRevenue: boolean;
}) {
    return (
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80">
            <div className="pb-3 border-b border-slate-100">
                <h2 className="text-base font-bold text-slate-900">Popular treatments</h2>
                <p className="text-xs text-slate-500">Top procedures by bookings</p>
            </div>

            {items.length === 0 ? (
                <div className="h-48 flex items-center justify-center text-xs text-slate-500">
                    No treatment bookings yet.
                </div>
            ) : (
                <div className="space-y-3 pt-4">
                    <div className="h-36 w-full min-w-0" style={{ height: 144 }}>
                        <ResponsiveContainer width="100%" height={144}>
                            <BarChart data={items} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                                <XAxis
                                    dataKey="name"
                                    tick={{ fill: "#64748b", fontSize: 10 }}
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={(v: string) => (v.length > 13 ? `${v.slice(0, 11)}…` : v)}
                                />
                                <YAxis tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
                                <Tooltip
                                    formatter={(val: unknown) => [Number(val) || 0, "Bookings"]}
                                    contentStyle={{ backgroundColor: "#fff", borderColor: "#e2e8f0", borderRadius: "10px", fontSize: "12px" }}
                                />
                                <Bar dataKey="bookings" fill="#0d9488" radius={[6, 6, 0, 0]} isAnimationActive={false} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="divide-y divide-slate-100 text-xs">
                        {items.map((item) => (
                            <div key={item.name} className="py-1.5 flex items-center justify-between gap-2">
                                <span className="font-medium text-slate-800 truncate">{item.name}</span>
                                <span className="text-slate-600 whitespace-nowrap">
                                    {item.bookings} visits
                                    {showRevenue && item.revenue !== null ? ` · ${formatPKR(item.revenue)}` : ""}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
