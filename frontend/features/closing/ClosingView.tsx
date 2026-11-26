"use client";

import { useState } from "react";
import { PageHeader } from "@/components/admin/shared";
import DailyClosingForm from "./DailyClosingForm";
import ClosingHistoryPanel from "./ClosingHistoryPanel";
import type { ClosingAggregateRow, ClosingDailyRow, ClosingPreviewData, DaysNotClosedItem } from "./types";

interface ClosingViewProps {
    role: "ADMIN" | "STAFF";
    initialPreview: ClosingPreviewData;
    initialDaily?: ClosingDailyRow[];
    initialAggregated?: ClosingAggregateRow[];
    initialDaysNotClosed?: DaysNotClosedItem[];
}

export default function ClosingView({
    role,
    initialPreview,
    initialDaily = [],
    initialAggregated = [],
    initialDaysNotClosed = [],
}: ClosingViewProps) {
    const isAdmin = role === "ADMIN";
    const [dateKey, setDateKey] = useState(initialPreview.dateKey);
    const [preview, setPreview] = useState<ClosingPreviewData>(initialPreview);
    const [view, setView] = useState<"daily" | "monthly" | "yearly">("daily");
    const [daily, setDaily] = useState<ClosingDailyRow[]>(initialDaily);
    const [aggregated, setAggregated] = useState<ClosingAggregateRow[]>(initialAggregated);
    const [daysNotClosed, setDaysNotClosed] = useState<DaysNotClosedItem[]>(initialDaysNotClosed);

    const loadDatePreview = async (targetDate: string) => {
        setDateKey(targetDate);
        const res = await fetch(`/api/closing/submit?date=${encodeURIComponent(targetDate)}`);
        if (res.ok) setPreview(await res.json());
    };

    const loadHistory = async (targetView: "daily" | "monthly" | "yearly") => {
        setView(targetView);
        if (!isAdmin) return;
        const res = await fetch(`/api/closing?view=${targetView}`);
        if (res.ok) {
            const data = await res.json();
            setDaily(data.daily || []);
            setAggregated(data.aggregated || []);
            setDaysNotClosed(data.daysNotClosed || []);
        }
    };

    const refreshAll = async () => {
        await loadDatePreview(dateKey);
        if (isAdmin) await loadHistory(view);
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Daily cash closing"
                subtitle={isAdmin ? "Reconcile cash drawer, approve closings, and review closing history" : "Submit end-of-shift counted cash for doctor approval"}
                actions={
                    <input
                        type="date"
                        aria-label="Closing date"
                        value={dateKey}
                        onChange={(e) => e.target.value && loadDatePreview(e.target.value)}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800"
                    />
                }
            />

            <DailyClosingForm role={role} preview={preview} onUpdated={refreshAll} />

            {isAdmin && (
                <ClosingHistoryPanel
                    view={view}
                    onViewChange={loadHistory}
                    daily={daily}
                    aggregated={aggregated}
                    daysNotClosed={daysNotClosed}
                    onSelectDate={loadDatePreview}
                />
            )}
        </div>
    );
}
