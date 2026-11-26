"use client";

import { useState } from "react";
import { toast } from "sonner";
import NotificationsActiveOutlined from "@mui/icons-material/NotificationsActiveOutlined";
import CheckCircleOutlineOutlined from "@mui/icons-material/CheckCircleOutlineOutlined";
import EventAvailableOutlined from "@mui/icons-material/EventAvailableOutlined";
import BlockOutlined from "@mui/icons-material/BlockOutlined";
import SendOutlined from "@mui/icons-material/SendOutlined";
import { FilterBar, PageHeader, StatCard } from "@/components/admin/shared";
import { formatKarachiDate } from "@/lib/format";
import type { RecallDashboardPayload } from "./types";

export default function RecallsPanel({ initialData }: { initialData: RecallDashboardPayload }) {
    const [data, setData] = useState<RecallDashboardPayload>(initialData);
    const [tab, setTab] = useState<"due" | "sent" | "booked" | "optedOut">("due");
    const [sending, setSending] = useState(false);

    const refreshData = async () => {
        const res = await fetch("/api/recalls");
        if (res.ok) setData(await res.json());
    };

    const sendRecalls = async (patientIds: string[]) => {
        if (patientIds.length === 0) return;
        setSending(true);
        try {
            const res = await fetch("/api/recalls", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ patientIds }),
            });
            const out = await res.json();
            if (!res.ok) throw new Error(out.error || "Failed to send recall");
            if (out.blockedByNight) {
                toast.warning(`Night quiet hours active (Asia/Karachi): ${out.skipped} recall(s) logged as skipped.`);
            } else {
                toast.success(`Recalls processed: ${out.sent} sent, ${out.failed} failed, ${out.skipped} skipped`);
            }
            await refreshData();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to send recall");
        } finally {
            setSending(false);
        }
    };

    const toggleOptOut = async (patientId: string, optOut: boolean) => {
        try {
            const res = await fetch("/api/recalls", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ patientId, optOut }),
            });
            if (!res.ok) throw new Error("Update failed");
            toast.success(optOut ? "Patient opted out of recall messages" : "Patient re-enrolled in recalls");
            await refreshData();
        } catch {
            toast.error("Failed to update recall opt-out status");
        }
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="6-month preventive recalls"
                subtitle="Eligible patients ~6 months post-visit with no future booking. Sends through n8n, pauses during Karachi night hours, and respects opt-out."
                actions={
                    tab === "due" && data.due.length > 0 ? (
                        <button type="button" disabled={sending} onClick={() => sendRecalls(data.due.map((d) => d.patientId))} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold cursor-pointer disabled:opacity-50">
                            <SendOutlined sx={{ fontSize: 15 }} /> {sending ? "Dispatching..." : `Send all due (${data.due.length})`}
                        </button>
                    ) : undefined
                }
            />

            {data.isNightHours && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-xs font-medium text-amber-900">
                    Night quiet hours active (21:00–07:59 Asia/Karachi). Automated recall sends will be logged as skipped until morning.
                </div>
            )}

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Due for recall" value={data.due.length} icon={<NotificationsActiveOutlined sx={{ fontSize: 18 }} />} iconTone="amber" />
                <StatCard label="Reminders sent" value={data.sent.length} icon={<CheckCircleOutlineOutlined sx={{ fontSize: 18 }} />} iconTone="teal" />
                <StatCard label="Booked after recall" value={data.booked.length} icon={<EventAvailableOutlined sx={{ fontSize: 18 }} />} iconTone="emerald" />
                <StatCard label="Opted out" value={data.optedOut.length} icon={<BlockOutlined sx={{ fontSize: 18 }} />} iconTone="sky" />
            </div>

            <FilterBar
                options={[
                    { value: "due", label: "Due", count: data.due.length },
                    { value: "sent", label: "Sent", count: data.sent.length },
                    { value: "booked", label: "Booked", count: data.booked.length },
                    { value: "optedOut", label: "Opted out", count: data.optedOut.length },
                ]}
                value={tab}
                onChange={(v) => setTab(v as typeof tab)}
            />

            <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                        <tr>
                            <th className="px-4 py-3">Patient</th>
                            <th className="px-4 py-3">Phone</th>
                            <th className="px-4 py-3">Details</th>
                            <th className="px-4 py-3 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {tab === "due" && (data.due.length === 0 ? <tr><td colSpan={4} className="py-10 text-center text-slate-500">No patients currently due for 6-month recall.</td></tr> : data.due.map((r) => (
                            <tr key={r.patientId} className="hover:bg-slate-50/70">
                                <td className="px-4 py-3 font-semibold text-slate-900">{r.name}</td>
                                <td className="px-4 py-3 text-slate-600">{r.phone || "—"}</td>
                                <td className="px-4 py-3 text-slate-600">Last visit: {formatKarachiDate(r.lastVisit, "short")} · {r.treatmentName}</td>
                                <td className="px-4 py-3 text-right space-x-1.5">
                                    <button type="button" disabled={sending} onClick={() => sendRecalls([r.patientId])} className="px-2.5 py-1 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold cursor-pointer">Send recall</button>
                                    <button type="button" onClick={() => toggleOptOut(r.patientId, true)} className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer">Opt out</button>
                                </td>
                            </tr>
                        )))}
                        {tab === "sent" && (data.sent.length === 0 ? <tr><td colSpan={4} className="py-10 text-center text-slate-500">No active sent recalls awaiting booking.</td></tr> : data.sent.map((r) => (
                            <tr key={r.patientId}>
                                <td className="px-4 py-3 font-semibold text-slate-900">{r.name}</td><td className="px-4 py-3 text-slate-600">{r.phone || "—"}</td>
                                <td className="px-4 py-3 text-slate-600">Recall sent on {formatKarachiDate(r.sentAt, "medium")}</td>
                                <td className="px-4 py-3 text-right"><button type="button" onClick={() => toggleOptOut(r.patientId, true)} className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600 font-semibold cursor-pointer">Opt out</button></td>
                            </tr>
                        )))}
                        {tab === "booked" && (data.booked.length === 0 ? <tr><td colSpan={4} className="py-10 text-center text-slate-500">No booked recalls recorded yet.</td></tr> : data.booked.map((r) => (
                            <tr key={r.patientId}>
                                <td className="px-4 py-3 font-semibold text-slate-900">{r.name}</td><td className="px-4 py-3 text-slate-600">{r.phone || "—"}</td>
                                <td className="px-4 py-3 text-emerald-700 font-medium">Re-booked for {formatKarachiDate(r.bookedFor, "medium")}</td>
                                <td className="px-4 py-3 text-right text-slate-400">Converted</td>
                            </tr>
                        )))}
                        {tab === "optedOut" && (data.optedOut.length === 0 ? <tr><td colSpan={4} className="py-10 text-center text-slate-500">No patients opted out of recalls.</td></tr> : data.optedOut.map((r) => (
                            <tr key={r.patientId}>
                                <td className="px-4 py-3 font-semibold text-slate-900">{r.name}</td><td className="px-4 py-3 text-slate-600">{r.phone || "—"}</td>
                                <td className="px-4 py-3 text-slate-500">Excluded from recall campaigns</td>
                                <td className="px-4 py-3 text-right"><button type="button" onClick={() => toggleOptOut(r.patientId, false)} className="px-2.5 py-1 rounded-lg border border-teal-200 text-teal-700 hover:bg-teal-50 font-semibold cursor-pointer">Re-enroll</button></td>
                            </tr>
                        )))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
