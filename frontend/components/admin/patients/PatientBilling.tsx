"use client";

import { DollarSign, TrendingUp, CreditCard } from "lucide-react";
import { cn, formatPKR, formatDate } from "@/lib/utils";

interface PatientBillingProps {
    appointments: {
        id: string;
        startTime: Date | string;
        status: string;
        treatment: {
            name: string;
        };
        price: number;
        amountPaid: number | null;
    }[];
}



export default function PatientBilling({ appointments }: PatientBillingProps) {
    // Only consider COMPLETED appointments for "Billed" and "Paid" to avoid confusing stats with future/cancelled ones
    // OR: You might want to show "Projected" for scheduled ones.
    // Let's go with: 
    // - Billed: Sum of price for COMPLETED appointments
    // - Paid: Sum of amountPaid for COMPLETED appointments
    // - Due: Billed - Paid

    // NOTE: If you want to show 'Pending' for scheduled appointments, that's a different metric.
    // For now, let's stick to "Realized Billing" (Completed visits).

    const completedAppts = appointments.filter(a => a.status === "COMPLETED");

    const totalBilled = completedAppts.reduce((sum, a) => sum + (a.price || 0), 0);
    const totalPaid = completedAppts.reduce((sum, a) => sum + (a.amountPaid || 0), 0);
    const totalDue = totalBilled - totalPaid;

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                    <div className="flex items-center gap-2 mb-1">
                        <DollarSign className="size-4 text-blue-400" />
                        <span className="text-xs font-semibold text-blue-400 uppercase">Total Billed</span>
                    </div>
                    <p className="text-xl font-bold text-white">{formatPKR(totalBilled)}</p>
                    <p className="text-[10px] text-slate-400">For {completedAppts.length} completed visits</p>
                </div>
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <div className="flex items-center gap-2 mb-1">
                        <CreditCard className="size-4 text-emerald-400" />
                        <span className="text-xs font-semibold text-emerald-400 uppercase">Total Paid</span>
                    </div>
                    <p className="text-xl font-bold text-white">{formatPKR(totalPaid)}</p>
                    <p className="text-[10px] text-slate-400">Recieved to date</p>
                </div>
                <div className={cn(
                    "p-4 rounded-xl border",
                    totalDue > 0
                        ? "bg-red-500/10 border-red-500/20"
                        : "bg-slate-500/10 border-slate-500/20"
                )}>
                    <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className={cn("size-4", totalDue > 0 ? "text-red-400" : "text-slate-400")} />
                        <span className={cn("text-xs font-semibold uppercase", totalDue > 0 ? "text-red-400" : "text-slate-400")}>
                            Balance Due
                        </span>
                    </div>
                    <p className={cn("text-xl font-bold", totalDue > 0 ? "text-white" : "text-slate-300")}>
                        {formatPKR(totalDue)}
                    </p>
                    <p className="text-[10px] text-slate-400">Outstanding amount</p>
                </div>
            </div>

            {/* Billing History Table */}
            <div className="rounded-xl border border-white/[0.06] overflow-hidden">
                <div className="px-4 py-3 bg-white/[0.03] border-b border-white/[0.06]">
                    <h3 className="text-sm font-semibold text-white">Billing History</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-white/[0.02] text-xs uppercase text-slate-400 font-semibold">
                            <tr>
                                <th className="px-4 py-3">Date</th>
                                <th className="px-4 py-3">Treatment</th>
                                <th className="px-4 py-3 text-right">Billed Price</th>
                                <th className="px-4 py-3 text-right">Paid</th>
                                <th className="px-4 py-3 text-right">Balance</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.04]">
                            {completedAppts.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-8 text-center text-slate-500 text-xs">
                                        No completed billing records found.
                                    </td>
                                </tr>
                            ) : (
                                completedAppts.map((apt) => {
                                    const balance = (apt.price || 0) - (apt.amountPaid || 0);
                                    return (
                                        <tr key={apt.id} className="hover:bg-white/[0.02] transition-colors">
                                            <td className="px-4 py-3 text-slate-300">
                                                {formatDate(apt.startTime)}
                                            </td>
                                            <td className="px-4 py-3 text-slate-300">{apt.treatment.name}</td>
                                            <td className="px-4 py-3 text-right text-slate-200 font-medium">
                                                {formatPKR(apt.price || 0)}
                                            </td>
                                            <td className="px-4 py-3 text-right text-emerald-400 font-medium">
                                                {formatPKR(apt.amountPaid || 0)}
                                            </td>
                                            <td className={cn(
                                                "px-4 py-3 text-right font-medium",
                                                balance > 0 ? "text-red-400" : "text-slate-500"
                                            )}>
                                                {balance > 0 ? formatPKR(balance) : "—"}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
