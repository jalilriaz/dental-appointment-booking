"use client";

import { useState } from "react";
import PaymentsOutlined from "@mui/icons-material/PaymentsOutlined";
import ReceiptLongOutlined from "@mui/icons-material/ReceiptLongOutlined";
import TrendingUpOutlined from "@mui/icons-material/TrendingUpOutlined";
import UndoOutlined from "@mui/icons-material/UndoOutlined";
import { StatCard } from "@/components/admin/shared";
import { getExpenseCategoryLabel, getPaymentMethodLabel } from "@/lib/constants/payment-methods";
import { formatKarachiDate, formatPKR } from "@/lib/format";
import RefundDialog, { type RefundTargetPayment } from "@/components/admin/patients/RefundDialog";
import type { ProfitReportData } from "./types";

interface ProfitOverviewTabProps {
    data: ProfitReportData;
    onRefunded: () => void;
}

export default function ProfitOverviewTab({ data, onRefunded }: ProfitOverviewTabProps) {
    const [refundTarget, setRefundTarget] = useState<RefundTargetPayment | null>(null);

    return (
        <div className="space-y-5">
            <div className="p-3 rounded-xl bg-teal-50/70 border border-teal-200/80 text-xs text-teal-900">
                <strong>Cash-basis profit definition:</strong> Profit = Payments received − Refunds issued − Clinic expenses for {data.startDateKey} to {data.endDateKey} (computed from payment, refund, and expense ledgers).
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <StatCard label="Payments received" value={formatPKR(data.paymentsTotal)} subtext="Gross cash & digital receipts" icon={<PaymentsOutlined sx={{ fontSize: 18 }} />} />
                <StatCard label="Refunds issued" value={formatPKR(data.refundsTotal)} subtext="Returned to patients" icon={<UndoOutlined sx={{ fontSize: 18 }} />} iconTone="amber" />
                <StatCard label="Operating expenses" value={formatPKR(data.expensesTotal)} subtext="All recorded expense bills" icon={<ReceiptLongOutlined sx={{ fontSize: 18 }} />} iconTone="sky" />
                <StatCard label="Cash-basis profit" value={formatPKR(data.profit)} subtext={`Net revenue: ${formatPKR(data.netRevenue)}`} trendPositive={data.profit >= 0} icon={<TrendingUpOutlined sx={{ fontSize: 18 }} />} iconTone="emerald" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-3">
                    <h3 className="text-sm font-bold text-slate-900">Collections by payment method</h3>
                    <table className="w-full text-xs text-left">
                        <thead className="text-slate-500 border-b border-slate-100">
                            <tr><th className="py-2">Method</th><th className="py-2 text-right">Collected</th><th className="py-2 text-right">Refunded</th><th className="py-2 text-right">Net</th></tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {data.methodBreakdown.map((m) => (
                                <tr key={m.method}>
                                    <td className="py-2 font-medium text-slate-800">{m.label}</td>
                                    <td className="py-2 text-right">{formatPKR(m.payments)}</td>
                                    <td className="py-2 text-right text-rose-700">{formatPKR(m.refunds)}</td>
                                    <td className="py-2 text-right font-bold text-slate-900">{formatPKR(m.net)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-3">
                    <h3 className="text-sm font-bold text-slate-900">Expenses by category</h3>
                    {data.expenseBreakdown.length === 0 ? (
                        <p className="text-xs text-slate-500 py-6 text-center">No expenses recorded in this date range.</p>
                    ) : (
                        <div className="space-y-2 text-xs">
                            {data.expenseBreakdown.map((e) => (
                                <div key={e.category} className="flex items-center justify-between py-1.5 border-b border-slate-100 last:border-0">
                                    <span className="font-medium text-slate-700">{getExpenseCategoryLabel(e.category)}</span>
                                    <span className="font-bold text-slate-900">{formatPKR(e.amount)}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900">Recent payments &amp; refunds ({data.recentPayments.length})</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                            <tr><th className="px-4 py-2.5">Date</th><th className="px-4 py-2.5">Patient</th><th className="px-4 py-2.5">Service</th><th className="px-4 py-2.5">Method</th><th className="px-4 py-2.5 text-right">Amount</th><th className="px-4 py-2.5 text-right no-print">Action</th></tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {data.recentPayments.length === 0 ? (
                                <tr><td colSpan={6} className="py-8 text-center text-slate-500">No payments or refunds in this period.</td></tr>
                            ) : data.recentPayments.map((p) => {
                                const isRef = p.type === "REFUND";
                                const refundable = Math.max(0, p.amount - p.priorRefunded);
                                return (
                                    <tr key={p.id} className="hover:bg-slate-50/60">
                                        <td className="px-4 py-2.5 whitespace-nowrap text-slate-600">{formatKarachiDate(p.date, "medium")}</td>
                                        <td className="px-4 py-2.5 font-semibold text-slate-900">{p.patientName}</td>
                                        <td className="px-4 py-2.5 text-slate-700">{p.treatmentName}{p.notes ? <span className="block text-[11px] text-slate-400 truncate max-w-xs">{p.notes}</span> : null}</td>
                                        <td className="px-4 py-2.5">{getPaymentMethodLabel(p.method)}{isRef ? <span className="ml-1.5 px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 text-[10px] font-semibold">Refund</span> : null}</td>
                                        <td className={`px-4 py-2.5 text-right font-bold whitespace-nowrap ${isRef ? "text-rose-700" : "text-slate-900"}`}>{isRef ? "− " : ""}{formatPKR(p.amount)}</td>
                                        <td className="px-4 py-2.5 text-right no-print">
                                            {!isRef && refundable > 0 && (
                                                <button type="button" onClick={() => setRefundTarget({ id: p.id, amount: refundable, method: p.method, treatmentName: p.treatmentName })} className="px-2.5 py-1 rounded-lg border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 font-semibold cursor-pointer">
                                                    Refund
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            <RefundDialog target={refundTarget} onClose={() => setRefundTarget(null)} onSuccess={onRefunded} />
        </div>
    );
}
