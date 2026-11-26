"use client";

import { useState } from "react";
import { toast } from "sonner";
import StarOutlined from "@mui/icons-material/StarOutlined";
import SendOutlined from "@mui/icons-material/SendOutlined";
import ContentCopyOutlined from "@mui/icons-material/ContentCopyOutlined";
import VisibilityOutlined from "@mui/icons-material/VisibilityOutlined";
import { FilterBar, PageHeader, StatCard } from "@/components/admin/shared";
import { formatKarachiDate } from "@/lib/format";
import type { FeedbackReviewRow, PendingFeedbackRow } from "./types";

export default function FeedbackPanel({
    initialReviews,
    initialPending,
    isAdmin,
}: {
    initialReviews: FeedbackReviewRow[];
    initialPending: PendingFeedbackRow[];
    isAdmin: boolean;
}) {
    const [reviews, setReviews] = useState<FeedbackReviewRow[]>(initialReviews);
    const [pending] = useState<PendingFeedbackRow[]>(initialPending);
    const [tab, setTab] = useState<"collect" | "reviews">("collect");
    const [sendingId, setSendingId] = useState<string | null>(null);
    const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});

    const sendInvite = async (appointmentId: string) => {
        setSendingId(appointmentId);
        try {
            const res = await fetch("/api/feedback-admin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ appointmentId }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Invite failed");
            toast.success(`Feedback request processed (${data.status})`);
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to send feedback request");
        } finally {
            setSendingId(null);
        }
    };

    const copyLink = async (row: PendingFeedbackRow) => {
        const url = `${window.location.origin}/feedback?appointmentId=${encodeURIComponent(row.appointmentId)}&name=${encodeURIComponent(row.patientName)}&treatment=${encodeURIComponent(row.treatmentName)}`;
        await navigator.clipboard.writeText(url);
        toast.success("Post-visit feedback link copied");
    };

    const saveReview = async (id: string, patch: { isPublished?: boolean; clinicResponse?: string | null }) => {
        try {
            const res = await fetch(`/api/feedback-admin/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(patch),
            });
            if (!res.ok) throw new Error("Failed");
            setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
            toast.success("Feedback updated");
        } catch {
            toast.error("Failed to update feedback");
        }
    };

    const avgRating = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : "—";

    return (
        <div className="space-y-6">
            <PageHeader title="Post-visit patient feedback" subtitle="Collect verified reviews after completed visits and manage public clinic responses." />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard label="Completed visits awaiting feedback" value={pending.length} icon={<SendOutlined sx={{ fontSize: 18 }} />} iconTone="amber" />
                <StatCard label="Published reviews" value={reviews.filter((r) => r.isPublished).length} icon={<VisibilityOutlined sx={{ fontSize: 18 }} />} iconTone="teal" />
                <StatCard label="Average rating" value={avgRating} icon={<StarOutlined sx={{ fontSize: 18 }} />} iconTone="emerald" />
            </div>

            <FilterBar
                options={[
                    { value: "collect", label: "Collect after completed visits", count: pending.length },
                    { value: "reviews", label: "Submitted reviews", count: reviews.length },
                ]}
                value={tab}
                onChange={(v) => setTab(v as typeof tab)}
            />

            {tab === "collect" ? (
                <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                            <tr>
                                <th className="px-4 py-3">Patient</th>
                                <th className="px-4 py-3">Completed treatment</th>
                                <th className="px-4 py-3">Visit date</th>
                                <th className="px-4 py-3 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {pending.length === 0 ? (
                                <tr><td colSpan={4} className="py-10 text-center text-slate-500">All recent completed visits have feedback recorded.</td></tr>
                            ) : pending.map((row) => (
                                <tr key={row.appointmentId} className="hover:bg-slate-50/70">
                                    <td className="px-4 py-3"><p className="font-semibold text-slate-900">{row.patientName}</p><p className="text-[11px] text-slate-500">{row.patientPhone || row.patientEmail || "No contact"}</p></td>
                                    <td className="px-4 py-3 text-slate-700">{row.treatmentName}</td>
                                    <td className="px-4 py-3 text-slate-600">{formatKarachiDate(row.visitDate, "short")}</td>
                                    <td className="px-4 py-3 text-right space-x-1.5">
                                        <button type="button" onClick={() => copyLink(row)} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold cursor-pointer"><ContentCopyOutlined sx={{ fontSize: 13 }} /> Copy link</button>
                                        <button type="button" disabled={sendingId === row.appointmentId} onClick={() => sendInvite(row.appointmentId)} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold cursor-pointer disabled:opacity-50"><SendOutlined sx={{ fontSize: 13 }} /> Send request</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="space-y-3">
                    {reviews.length === 0 ? (
                        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-xs text-slate-500">No patient feedback submitted yet.</div>
                    ) : reviews.map((r) => (
                        <div key={r.id} className="rounded-2xl border border-slate-200 bg-white p-4 text-xs space-y-2">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <div>
                                    <span className="font-bold text-slate-900">{r.patientName}</span>
                                    <span className="ml-2 text-amber-600 font-bold">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span>
                                    <span className="ml-2 text-slate-500">{r.treatmentName} · {formatKarachiDate(r.createdAt, "short")}</span>
                                </div>
                                {isAdmin && (
                                    <button type="button" onClick={() => saveReview(r.id, { isPublished: !r.isPublished })} className={`px-2.5 py-1 rounded-lg border font-semibold cursor-pointer ${r.isPublished ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-slate-200 text-slate-600"}`}>
                                        {r.isPublished ? "Published on web" : "Hidden"}
                                    </button>
                                )}
                            </div>
                            <p className="text-slate-700">{r.comment}</p>
                            {isAdmin && (
                                <div className="flex gap-2 pt-1">
                                    <input placeholder="Write official clinic response..." value={replyDrafts[r.id] ?? r.clinicResponse ?? ""} onChange={(e) => setReplyDrafts((p) => ({ ...p, [r.id]: e.target.value }))} className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200" />
                                    <button type="button" onClick={() => saveReview(r.id, { clinicResponse: replyDrafts[r.id] ?? r.clinicResponse ?? "" })} className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold cursor-pointer">Save reply</button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
