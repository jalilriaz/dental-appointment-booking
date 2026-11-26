"use client";

import Link from "next/link";
import PeopleAltOutlined from "@mui/icons-material/PeopleAltOutlined";
import RepeatOutlined from "@mui/icons-material/RepeatOutlined";
import NotificationsActiveOutlined from "@mui/icons-material/NotificationsActiveOutlined";
import { StatCard, StatusBadge } from "@/components/admin/shared";
import { formatKarachiDate } from "@/lib/format";
import type { AppointmentReportData, RetentionReportData } from "./types";

export function AppointmentReportTab({ data }: { data: AppointmentReportData }) {
    return (
        <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-2">
                    <h3 className="text-sm font-bold text-slate-900">Total appointments ({data.total})</h3>
                    {data.statusCounts.map((s) => (
                        <div key={s.status} className="flex items-center justify-between text-xs py-1">
                            <StatusBadge status={s.status} />
                            <span className="font-bold text-slate-900">{s.count}</span>
                        </div>
                    ))}
                </div>
                <div className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-2">
                    <h3 className="text-sm font-bold text-slate-900">By booking channel</h3>
                    {data.sourceCounts.map((s) => (
                        <div key={s.source} className="flex items-center justify-between text-xs py-1 border-b border-slate-100 last:border-0">
                            <span className="text-slate-700 font-medium">{s.source}</span>
                            <span className="font-bold text-slate-900">{s.count}</span>
                        </div>
                    ))}
                </div>
                <div className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-2">
                    <h3 className="text-sm font-bold text-slate-900">Top treatments</h3>
                    {data.topTreatments.map((t) => (
                        <div key={t.name} className="flex items-center justify-between text-xs py-1 border-b border-slate-100 last:border-0">
                            <span className="text-slate-700 font-medium truncate pr-2">{t.name}</span>
                            <span className="font-bold text-slate-900">{t.count}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 overflow-x-auto">
                <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                        <tr><th className="px-4 py-3">Date</th><th className="px-4 py-3">Patient</th><th className="px-4 py-3">Treatment</th><th className="px-4 py-3">Channel</th><th className="px-4 py-3">Status</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {data.appointments.length === 0 ? (
                            <tr><td colSpan={5} className="py-8 text-center text-slate-500">No appointments in this range.</td></tr>
                        ) : data.appointments.map((a) => (
                            <tr key={a.id} className="hover:bg-slate-50/60">
                                <td className="px-4 py-2.5 text-slate-600 whitespace-nowrap">{formatKarachiDate(a.startTime, "medium")}</td>
                                <td className="px-4 py-2.5 font-semibold text-slate-900">{a.patientName}</td>
                                <td className="px-4 py-2.5 text-slate-700">{a.treatmentName}</td>
                                <td className="px-4 py-2.5 text-slate-600">{a.bookedBy}</td>
                                <td className="px-4 py-2.5"><StatusBadge status={a.status} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export function RetentionReportTab({ data }: { data: RetentionReportData }) {
    return (
        <div className="space-y-5">
            <div className="p-3 rounded-xl bg-teal-50/70 border border-teal-200/80 text-xs text-teal-900">
                <strong>Retention definition:</strong> Percentage of patients with a completed visit in the preceding equal period ({data.prevStartKey} to {data.prevEndKey}) who returned for a completed visit in {data.startDateKey} to {data.endDateKey}. Recall overdue lists active patients whose last completed visit was 180+ days ago with no future visit booked.
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <StatCard label="Retention rate" value={data.retentionRate !== null ? `${data.retentionRate}%` : "—"} subtext="Returned vs previous period" icon={<RepeatOutlined sx={{ fontSize: 18 }} />} />
                <StatCard label="Previous cohort" value={data.previousCohortCount} subtext="Completed patients prior period" icon={<PeopleAltOutlined sx={{ fontSize: 18 }} />} />
                <StatCard label="Returned patients" value={data.returnedCount} subtext="Visited again this period" icon={<PeopleAltOutlined sx={{ fontSize: 18 }} />} iconTone="emerald" />
                <StatCard label="Overdue for recall" value={data.overdueRecall.length} subtext="180+ days since last visit" icon={<NotificationsActiveOutlined sx={{ fontSize: 18 }} />} iconTone="amber" />
            </div>
            <div className="bg-white rounded-2xl border border-slate-200/80 overflow-x-auto">
                <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                        <tr><th className="px-4 py-3">Patient</th><th className="px-4 py-3">Phone</th><th className="px-4 py-3">Last completed visit</th><th className="px-4 py-3">Procedure</th><th className="px-4 py-3 text-right">Days overdue</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {data.overdueRecall.length === 0 ? (
                            <tr><td colSpan={5} className="py-8 text-center text-slate-500">No patients currently overdue for 6-month recall.</td></tr>
                        ) : data.overdueRecall.map((r) => (
                            <tr key={r.patientId} className="hover:bg-slate-50/60">
                                <td className="px-4 py-2.5"><Link href={`/admin/patients/${r.patientId}`} className="font-semibold text-teal-800 hover:underline">{r.patientName}</Link></td>
                                <td className="px-4 py-2.5 text-slate-600">{r.phone || "—"}</td>
                                <td className="px-4 py-2.5 text-slate-600">{formatKarachiDate(r.lastVisitDate, "medium")}</td>
                                <td className="px-4 py-2.5 text-slate-800">{r.lastTreatment}</td>
                                <td className="px-4 py-2.5 text-right font-bold text-amber-800">{r.daysSinceVisit}d</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
