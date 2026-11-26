"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import LockOutlined from "@mui/icons-material/LockOutlined";
import LockOpenOutlined from "@mui/icons-material/LockOpenOutlined";
import CheckCircleOutlineOutlined from "@mui/icons-material/CheckCircleOutlineOutlined";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatPKR } from "@/lib/format";
import type { ClosingPreviewData } from "./types";

interface DailyClosingFormProps {
    role: "ADMIN" | "STAFF";
    preview: ClosingPreviewData;
    onUpdated: () => void;
}

export default function DailyClosingForm({ role, preview, onUpdated }: DailyClosingFormProps) {
    const isAdmin = role === "ADMIN";
    const isLocked = preview.closing?.status === "APPROVED";
    const [openingCash, setOpeningCash] = useState(String(preview.openingCash));
    const [openingNote, setOpeningNote] = useState(preview.closing?.openingNote || "");
    const [actualCash, setActualCash] = useState(String(preview.closing?.actualCash ?? preview.expectedCash));
    const [notes, setNotes] = useState(preview.closing?.notes || "");
    const [reopenMode, setReopenMode] = useState(false);
    const [reopenReason, setReopenReason] = useState("");
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        setOpeningCash(String(preview.openingCash));
        setOpeningNote(preview.closing?.openingNote || "");
        setActualCash(String(preview.closing?.actualCash ?? preview.expectedCash));
        setNotes(preview.closing?.notes || "");
        setReopenMode(false);
        setReopenReason("");
    }, [preview]);

    const openNum = Math.max(0, Number(openingCash) || 0);
    const expectedCash = openNum + preview.totals.cashCollected - preview.totals.cashRefundsTotal - preview.totals.cashExpensesTotal;
    const countedNum = Math.max(0, Number(actualCash) || 0);
    const diff = countedNum - expectedCash;

    const callClosingApi = async (url: string, payload: Record<string, unknown>, okMsg: string) => {
        setBusy(true);
        try {
            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Operation failed");
            toast.success(okMsg);
            onUpdated();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Request failed");
        } finally {
            setBusy(false);
        }
    };

    const payload = { dateKey: preview.dateKey, openingCash: openNum, openingNote, actualCash: countedNum, notes };

    return (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div>
                    <h2 className="text-base font-bold text-slate-900">Cash drawer reconciliation · {preview.dateKey}</h2>
                    <p className="text-xs text-slate-500">Reconciles cash only (Opening + Cash collected − Cash refunds − Cash expenses)</p>
                </div>
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${isLocked ? "bg-emerald-50 text-emerald-700 border-emerald-200" : preview.closing?.status === "SUBMITTED" ? "bg-amber-50 text-amber-800 border-amber-200" : "bg-slate-100 text-slate-600 border-slate-200"}`}>
                    {isLocked ? <LockOutlined sx={{ fontSize: 13 }} /> : <LockOpenOutlined sx={{ fontSize: 13 }} />}
                    {isLocked ? "Approved & locked" : preview.closing?.status === "SUBMITTED" ? "Submitted (awaiting admin)" : preview.closing?.status === "REOPENED" ? "Reopened" : "Open"}
                </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70"><span className="text-slate-500">Cash payments</span><p className="font-bold text-slate-900 mt-1">{formatPKR(preview.totals.cashCollected)}</p></div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70"><span className="text-slate-500">Cash refunds</span><p className="font-bold text-rose-700 mt-1">− {formatPKR(preview.totals.cashRefundsTotal)}</p></div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70"><span className="text-slate-500">Cash expenses</span><p className="font-bold text-rose-700 mt-1">− {formatPKR(preview.totals.cashExpensesTotal)}</p></div>
                <div className="p-3 rounded-xl bg-teal-50/70 border border-teal-200"><span className="text-teal-800">Expected cash</span><p className="font-bold text-teal-900 mt-1">{formatPKR(expectedCash)}</p></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div><Label>Opening cash (prev close: {formatPKR(preview.defaultOpeningCash)})</Label><Input type="number" min={0} disabled={isLocked} value={openingCash} onChange={(e) => setOpeningCash(e.target.value)} /></div>
                <div><Label>Counted cash in drawer (PKR)</Label><Input type="number" min={0} disabled={isLocked} value={actualCash} onChange={(e) => setActualCash(e.target.value)} /></div>
                <div className={`p-2.5 rounded-xl border flex flex-col justify-center ${diff === 0 ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-amber-50 border-amber-200 text-amber-900"}`}>
                    <span className="text-[11px]">Difference (Counted − Expected)</span>
                    <span className="text-sm font-bold">{diff > 0 ? `+${formatPKR(diff)}` : formatPKR(diff)}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div><Label>Opening cash adjustment note</Label><Input disabled={isLocked} value={openingNote} onChange={(e) => setOpeningNote(e.target.value)} placeholder="Optional if opening cash adjusted" /></div>
                <div><Label>Closing note</Label><Input disabled={isLocked} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Drawer notes, discrepancies, handover..." /></div>
            </div>

            {isAdmin && reopenMode && isLocked && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 space-y-2 text-xs">
                    <Label>Reason to reopen locked day (audit logged)</Label>
                    <Input value={reopenReason} onChange={(e) => setReopenReason(e.target.value)} placeholder="e.g. Missed afternoon refund entry..." />
                    <div className="flex gap-2">
                        <button type="button" disabled={busy || reopenReason.trim().length < 3} onClick={() => callClosingApi("/api/closing", { action: "reopen", dateKey: preview.dateKey, reason: reopenReason }, "Closing reopened")} className="px-3 py-1.5 rounded-lg bg-amber-700 text-white font-semibold cursor-pointer disabled:opacity-50">Confirm reopen</button>
                        <button type="button" onClick={() => setReopenMode(false)} className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 font-semibold cursor-pointer">Cancel</button>
                    </div>
                </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
                <p className="text-[11px] text-slate-500">
                    Non-cash: Card {formatPKR(preview.totals.cardCollected)} · Bank {formatPKR(preview.totals.bankTransferCollected)} · JazzCash {formatPKR(preview.totals.jazzcashCollected)} · EasyPaisa {formatPKR(preview.totals.easypaisaCollected)}
                </p>
                <div className="flex items-center gap-2">
                    {!isLocked && (
                        <button type="button" disabled={busy} onClick={() => callClosingApi("/api/closing/submit", payload, "Cash count submitted")} className="px-3.5 py-2 rounded-xl border border-teal-200 bg-teal-50 text-teal-800 text-xs font-semibold cursor-pointer disabled:opacity-50">
                            Submit count
                        </button>
                    )}
                    {isAdmin && !isLocked && (
                        <button type="button" disabled={busy} onClick={() => callClosingApi("/api/closing", payload, "Day approved and locked")} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold cursor-pointer disabled:opacity-50">
                            <CheckCircleOutlineOutlined sx={{ fontSize: 15 }} /> Approve &amp; lock day
                        </button>
                    )}
                    {isAdmin && isLocked && !reopenMode && (
                        <button type="button" onClick={() => setReopenMode(true)} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-amber-300 bg-amber-50 text-amber-800 text-xs font-semibold cursor-pointer">
                            <LockOpenOutlined sx={{ fontSize: 15 }} /> Reopen day
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
