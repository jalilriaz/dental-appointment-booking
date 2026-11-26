"use client";

import DownloadOutlined from "@mui/icons-material/DownloadOutlined";
import WarningAmberOutlined from "@mui/icons-material/WarningAmberOutlined";
import { formatPKR } from "@/lib/format";
import type { ClosingAggregateRow, ClosingDailyRow, DaysNotClosedItem } from "./types";

interface ClosingHistoryPanelProps {
    view: "daily" | "monthly" | "yearly";
    onViewChange: (v: "daily" | "monthly" | "yearly") => void;
    daily: ClosingDailyRow[];
    aggregated: ClosingAggregateRow[];
    daysNotClosed: DaysNotClosedItem[];
    onSelectDate: (dateKey: string) => void;
}

export default function ClosingHistoryPanel({
    view,
    onViewChange,
    daily,
    aggregated,
    daysNotClosed,
    onSelectDate,
}: ClosingHistoryPanelProps) {
    return (
        <div className="space-y-5">
            {daysNotClosed.length > 0 && (
                <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                        <WarningAmberOutlined sx={{ fontSize: 16 }} />
                        <span>Days with activity not yet closed ({daysNotClosed.length})</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {daysNotClosed.map((d) => (
                            <button
                                key={d.dateKey}
                                type="button"
                                onClick={() => onSelectDate(d.dateKey)}
                                className="px-2.5 py-1 rounded-lg bg-white border border-amber-200 text-xs text-slate-800 hover:bg-amber-100 cursor-pointer"
                            >
                                <strong>{d.dateKey}</strong> · {d.paymentsCount} pay, {d.expensesCount} exp
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h3 className="text-base font-bold text-slate-900">Closing history</h3>
                        <p className="text-xs text-slate-500">Monthly and yearly figures aggregate directly from daily closing rows</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <div className="flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200/70 text-xs font-semibold">
                            {(["daily", "monthly", "yearly"] as const).map((v) => (
                                <button
                                    key={v}
                                    type="button"
                                    onClick={() => onViewChange(v)}
                                    className={`px-2.5 py-1 rounded-lg capitalize cursor-pointer ${view === v ? "bg-white text-teal-800 shadow-2xs" : "text-slate-600"}`}
                                >
                                    {v}
                                </button>
                            ))}
                        </div>
                        <a
                            href={`/api/closing/export?view=${view}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700"
                        >
                            <DownloadOutlined sx={{ fontSize: 15 }} />
                            <span>Export CSV</span>
                        </a>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {view === "daily" ? (
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                                <tr>
                                    <th className="px-4 py-3">Date</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3 text-right">Collected</th>
                                    <th className="px-4 py-3 text-right">Refunds</th>
                                    <th className="px-4 py-3 text-right">Expenses</th>
                                    <th className="px-4 py-3 text-right">Counted Cash</th>
                                    <th className="px-4 py-3 text-right">Difference</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {daily.length === 0 ? (
                                    <tr><td colSpan={7} className="py-8 text-center text-slate-500">No daily closing records yet.</td></tr>
                                ) : daily.map((r) => (
                                    <tr key={r.id} onClick={() => onSelectDate(r.dateKey)} className="hover:bg-slate-50 cursor-pointer">
                                        <td className="px-4 py-3 font-semibold text-slate-900">{r.dateKey}</td>
                                        <td className="px-4 py-3">{r.status}</td>
                                        <td className="px-4 py-3 text-right font-semibold">{formatPKR(r.collected)}</td>
                                        <td className="px-4 py-3 text-right text-rose-700">{formatPKR(r.refunds)}</td>
                                        <td className="px-4 py-3 text-right text-slate-700">{formatPKR(r.expenses)}</td>
                                        <td className="px-4 py-3 text-right font-bold">{formatPKR(r.actualCash)}</td>
                                        <td className={`px-4 py-3 text-right font-bold ${r.variance === 0 ? "text-emerald-700" : "text-amber-700"}`}>{formatPKR(r.variance)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                                <tr>
                                    <th className="px-4 py-3">Period</th>
                                    <th className="px-4 py-3 text-right">Days closed</th>
                                    <th className="px-4 py-3 text-right">Collected</th>
                                    <th className="px-4 py-3 text-right">Refunds</th>
                                    <th className="px-4 py-3 text-right">Expenses</th>
                                    <th className="px-4 py-3 text-right">Cash difference</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {aggregated.length === 0 ? (
                                    <tr><td colSpan={6} className="py-8 text-center text-slate-500">No closing rows for this view.</td></tr>
                                ) : aggregated.map((r) => (
                                    <tr key={r.period} className="hover:bg-slate-50">
                                        <td className="px-4 py-3 font-semibold text-slate-900">{r.period}</td>
                                        <td className="px-4 py-3 text-right">{r.daysClosed}</td>
                                        <td className="px-4 py-3 text-right font-semibold">{formatPKR(r.collected)}</td>
                                        <td className="px-4 py-3 text-right text-rose-700">{formatPKR(r.refunds)}</td>
                                        <td className="px-4 py-3 text-right">{formatPKR(r.expenses)}</td>
                                        <td className={`px-4 py-3 text-right font-bold ${r.variance === 0 ? "text-emerald-700" : "text-amber-700"}`}>{formatPKR(r.variance)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
