"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import MarkEmailReadOutlined from "@mui/icons-material/MarkEmailReadOutlined";
import ErrorOutlineOutlined from "@mui/icons-material/ErrorOutlineOutlined";
import SkipNextOutlined from "@mui/icons-material/SkipNextOutlined";
import ReplayOutlined from "@mui/icons-material/ReplayOutlined";
import { FilterBar, PageHeader, SearchInput, StatCard, StatusBadge } from "@/components/admin/shared";
import { formatKarachiDate, formatKarachiTime } from "@/lib/format";
import type { NotificationLogRow } from "./types";

export default function NotificationLogPanel({ initialLogs }: { initialLogs: NotificationLogRow[] }) {
    const [logs, setLogs] = useState<NotificationLogRow[]>(initialLogs);
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [channelFilter, setChannelFilter] = useState("ALL");
    const [query, setQuery] = useState("");
    const [retryingId, setRetryingId] = useState<string | null>(null);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return logs.filter((l) => {
            if (statusFilter !== "ALL" && l.status !== statusFilter) return false;
            if (channelFilter !== "ALL" && l.channel !== channelFilter) return false;
            if (!q) return true;
            return (
                l.recipient.toLowerCase().includes(q) ||
                (l.patientName || "").toLowerCase().includes(q) ||
                l.templateKey.toLowerCase().includes(q)
            );
        });
    }, [logs, statusFilter, channelFilter, query]);

    const counts = useMemo(() => ({
        sent: logs.filter((l) => l.status === "SENT").length,
        failed: logs.filter((l) => l.status === "FAILED").length,
        skipped: logs.filter((l) => l.status === "SKIPPED").length,
    }), [logs]);

    const handleRetry = async (logId: string) => {
        setRetryingId(logId);
        try {
            const res = await fetch(`/api/notifications/logs/${logId}/retry`, { method: "POST" });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Retry failed");
            const nextRow: NotificationLogRow = {
                id: data.log.id,
                channel: data.log.channel,
                recipient: data.log.recipient,
                templateKey: data.log.templateKey,
                messagePreview: data.log.messagePreview,
                status: data.log.status,
                errorMessage: data.log.errorMessage,
                sentAt: data.log.sentAt,
                createdAt: data.log.createdAt,
                patientName: null,
            };
            setLogs((prev) => [nextRow, ...prev]);
            toast.success(`Retry recorded with status: ${nextRow.status}`);
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Retry failed");
        } finally {
            setRetryingId(null);
        }
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Notification log"
                subtitle="Delivery ledger for WhatsApp and email dispatches. Note: current n8n webhook sends free-form text; configure Meta Cloud templates in n8n for sends past 24 hours."
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard label="Delivered (sent)" value={counts.sent} icon={<MarkEmailReadOutlined sx={{ fontSize: 18 }} />} iconTone="emerald" />
                <StatCard label="Failed attempts" value={counts.failed} icon={<ErrorOutlineOutlined sx={{ fontSize: 18 }} />} iconTone="gold" />
                <StatCard label="Skipped (policy/quiet)" value={counts.skipped} icon={<SkipNextOutlined sx={{ fontSize: 18 }} />} iconTone="amber" />
            </div>

            <FilterBar
                options={[
                    { value: "ALL", label: "All statuses", count: logs.length },
                    { value: "SENT", label: "Sent", count: counts.sent },
                    { value: "FAILED", label: "Failed", count: counts.failed },
                    { value: "SKIPPED", label: "Skipped", count: counts.skipped },
                ]}
                value={statusFilter}
                onChange={setStatusFilter}
                rightSlot={
                    <div className="flex flex-wrap items-center gap-2">
                        <select value={channelFilter} onChange={(e) => setChannelFilter(e.target.value)} aria-label="Filter by channel" className="h-9 px-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium">
                            <option value="ALL">All channels</option>
                            <option value="WHATSAPP">WhatsApp</option>
                            <option value="EMAIL">Email</option>
                        </select>
                        <SearchInput value={query} onChange={setQuery} placeholder="Search recipient, patient, template..." className="w-60" />
                    </div>
                }
            />

            <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                        <tr>
                            <th className="px-4 py-3">Timestamp</th>
                            <th className="px-4 py-3">Channel</th>
                            <th className="px-4 py-3">Recipient</th>
                            <th className="px-4 py-3">Template &amp; summary</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filtered.length === 0 ? (
                            <tr><td colSpan={6} className="py-10 text-center text-slate-500">No notification attempts match this filter.</td></tr>
                        ) : filtered.map((l) => (
                            <tr key={l.id} className="hover:bg-slate-50/70">
                                <td className="px-4 py-3 whitespace-nowrap text-slate-600">{formatKarachiDate(l.createdAt, "short")} · {formatKarachiTime(l.createdAt)}</td>
                                <td className="px-4 py-3 font-semibold text-slate-800">{l.channel}</td>
                                <td className="px-4 py-3">
                                    <p className="font-semibold text-slate-900">{l.patientName || "Patient"}</p>
                                    <p className="text-[11px] text-slate-500">{l.recipient}</p>
                                </td>
                                <td className="px-4 py-3 max-w-xs">
                                    <p className="font-medium text-slate-800">{l.templateKey}</p>
                                    {l.errorMessage ? (
                                        <p className="text-[11px] text-rose-700 truncate" title={l.errorMessage}>{l.errorMessage}</p>
                                    ) : l.messagePreview ? (
                                        <p className="text-[11px] text-slate-500 truncate">{l.messagePreview}</p>
                                    ) : null}
                                </td>
                                <td className="px-4 py-3"><StatusBadge status={l.status} /></td>
                                <td className="px-4 py-3 text-right">
                                    {(l.status === "FAILED" || l.status === "SKIPPED") && (
                                        <button type="button" disabled={retryingId === l.id} onClick={() => handleRetry(l.id)} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-teal-200 text-teal-700 hover:bg-teal-50 font-semibold cursor-pointer disabled:opacity-50">
                                            <ReplayOutlined sx={{ fontSize: 14 }} /> {retryingId === l.id ? "..." : "Retry"}
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
