"use client";

import Link from "next/link";
import AccountBalanceWalletOutlined from "@mui/icons-material/AccountBalanceWalletOutlined";
import AccessTimeOutlined from "@mui/icons-material/AccessTimeOutlined";
import { StatCard } from "@/components/admin/shared";
import { formatKarachiDate, formatPKR } from "@/lib/format";
import type { AgingReportData } from "./types";

export default function AgingReportTab({ data }: { data: AgingReportData }) {
    const { summary, rows } = data;
    return (
        <div className="space-y-5">
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                <StatCard label="Total receivable" value={formatPKR(summary.total)} subtext={`${rows.length} open account(s)`} icon={<AccountBalanceWalletOutlined sx={{ fontSize: 18 }} />} />
                <StatCard label="0–30 days" value={formatPKR(summary.bucket0_30)} subtext="Current balance" icon={<AccessTimeOutlined sx={{ fontSize: 18 }} />} />
                <StatCard label="31–60 days" value={formatPKR(summary.bucket31_60)} subtext="Follow-up due" icon={<AccessTimeOutlined sx={{ fontSize: 18 }} />} iconTone="sky" />
                <StatCard label="61–90 days" value={formatPKR(summary.bucket61_90)} subtext="Overdue" icon={<AccessTimeOutlined sx={{ fontSize: 18 }} />} iconTone="amber" />
                <StatCard label="90+ days" value={formatPKR(summary.bucket90Plus)} subtext="High priority" icon={<AccessTimeOutlined sx={{ fontSize: 18 }} />} iconTone="amber" />
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                            <tr>
                                <th className="px-4 py-3">Patient</th>
                                <th className="px-4 py-3">Type</th>
                                <th className="px-4 py-3">Service</th>
                                <th className="px-4 py-3">Started</th>
                                <th className="px-4 py-3 text-right">Age</th>
                                <th className="px-4 py-3 text-right">Billed</th>
                                <th className="px-4 py-3 text-right">Net Paid</th>
                                <th className="px-4 py-3 text-right">Balance</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {rows.length === 0 ? (
                                <tr><td colSpan={8} className="py-10 text-center text-slate-500">All patient balances are settled.</td></tr>
                            ) : rows.map((r) => (
                                <tr key={`${r.kind}-${r.id}`} className="hover:bg-slate-50/60">
                                    <td className="px-4 py-3">
                                        <Link href={`/admin/patients/${r.patientId}`} className="font-semibold text-teal-800 hover:underline">{r.patientName}</Link>
                                        {r.patientPhone && <p className="text-[11px] text-slate-500">{r.patientPhone}</p>}
                                    </td>
                                    <td className="px-4 py-3 text-slate-600">{r.kind}</td>
                                    <td className="px-4 py-3 font-medium text-slate-800">{r.treatmentName}</td>
                                    <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{formatKarachiDate(r.referenceDate, "medium")}</td>
                                    <td className="px-4 py-3 text-right font-semibold">{r.ageDays}d</td>
                                    <td className="px-4 py-3 text-right">{formatPKR(r.totalCost)}</td>
                                    <td className="px-4 py-3 text-right text-emerald-700">{formatPKR(r.paid)}</td>
                                    <td className="px-4 py-3 text-right font-bold text-rose-700">{formatPKR(r.balance)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
