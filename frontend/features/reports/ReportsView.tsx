"use client";

import { useState } from "react";
import { toast } from "sonner";
import DownloadOutlined from "@mui/icons-material/DownloadOutlined";
import PrintOutlined from "@mui/icons-material/PrintOutlined";
import { PageHeader } from "@/components/admin/shared";
import ProfitOverviewTab from "./ProfitOverviewTab";
import AgingReportTab from "./AgingReportTab";
import { AppointmentReportTab, RetentionReportTab } from "./ClinicalReportsTab";
import type { ReportsBundle, ReportTabKey } from "./types";

const TABS: { key: ReportTabKey; label: string }[] = [
    { key: "profit", label: "Profit & refunds" },
    { key: "aging", label: "Balance aging" },
    { key: "appointments", label: "Appointments" },
    { key: "retention", label: "Patient retention" },
];

export default function ReportsView({ initialData }: { initialData: ReportsBundle }) {
    const [tab, setTab] = useState<ReportTabKey>("profit");
    const [start, setStart] = useState(initialData.profit.startDateKey);
    const [end, setEnd] = useState(initialData.profit.endDateKey);
    const [data, setData] = useState<ReportsBundle>(initialData);
    const [loading, setLoading] = useState(false);

    const refreshReports = async (nextStart = start, nextEnd = end) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/reports?start=${encodeURIComponent(nextStart)}&end=${encodeURIComponent(nextEnd)}`);
            if (!res.ok) throw new Error("Failed to load report");
            setData(await res.json());
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to refresh report");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-5">
            <PageHeader
                title="Financial & practice reports"
                subtitle="Cash-basis profit, receivables aging, appointments, and 6-month patient retention"
                actions={
                    <div className="flex flex-wrap items-center gap-2 no-print">
                        <a
                            href={`/api/reports/export?type=${tab}&start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700"
                        >
                            <DownloadOutlined sx={{ fontSize: 15 }} />
                            <span>Export CSV</span>
                        </a>
                        <button
                            type="button"
                            onClick={() => window.print()}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold cursor-pointer"
                        >
                            <PrintOutlined sx={{ fontSize: 15 }} />
                            <span>Print PDF</span>
                        </button>
                    </div>
                }
            />

            <div className="bg-white rounded-2xl border border-slate-200/80 p-3 flex flex-wrap items-center justify-between gap-3 no-print">
                <div className="flex flex-wrap gap-1.5">
                    {TABS.map((t) => (
                        <button
                            key={t.key}
                            type="button"
                            onClick={() => setTab(t.key)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${tab === t.key ? "bg-teal-50 text-teal-800 border border-teal-200" : "text-slate-600 hover:bg-slate-50 border border-transparent"}`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                    <input type="date" aria-label="Start date" value={start} onChange={(e) => setStart(e.target.value)} className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50" />
                    <span className="text-slate-400">to</span>
                    <input type="date" aria-label="End date" value={end} onChange={(e) => setEnd(e.target.value)} className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50" />
                    <button type="button" disabled={loading} onClick={() => refreshReports(start, end)} className="px-3 py-1.5 rounded-lg bg-slate-900 text-white font-semibold cursor-pointer disabled:opacity-50">
                        {loading ? "Loading..." : "Apply"}
                    </button>
                </div>
            </div>

            {tab === "profit" && <ProfitOverviewTab data={data.profit} onRefunded={() => refreshReports()} />}
            {tab === "aging" && <AgingReportTab data={data.aging} />}
            {tab === "appointments" && <AppointmentReportTab data={data.appointments} />}
            {tab === "retention" && <RetentionReportTab data={data.retention} />}
        </div>
    );
}
