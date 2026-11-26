"use client";

import { useState } from "react";
import { toast } from "sonner";
import RuleOutlined from "@mui/icons-material/RuleOutlined";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { BookingRulesState } from "./types";

export default function BookingRulesCard({ initialRules }: { initialRules: BookingRulesState }) {
    const [rules, setRules] = useState<BookingRulesState>(initialRules);
    const [saving, setSaving] = useState(false);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch("/api/settings/rules", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ rules }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to save booking rules");
            toast.success("Break window, buffer time, and booking rules saved");
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to save rules");
        } finally {
            setSaving(false);
        }
    };

    return (
        <section id="booking-rules" className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <div className="size-10 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center">
                    <RuleOutlined sx={{ fontSize: 20 }} />
                </div>
                <div>
                    <h2 className="text-base font-bold text-slate-900">Break windows, buffer &amp; booking rules</h2>
                    <p className="text-xs text-slate-500">Enforced live on slot availability, website booking, WhatsApp bot, and cancellations.</p>
                </div>
            </div>

            <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                    <Label>Daily break start (HH:MM)</Label>
                    <Input type="time" value={rules.breakStart} onChange={(e) => setRules((p) => ({ ...p, breakStart: e.target.value }))} />
                </div>
                <div>
                    <Label>Daily break end (HH:MM)</Label>
                    <Input type="time" value={rules.breakEnd} onChange={(e) => setRules((p) => ({ ...p, breakEnd: e.target.value }))} />
                </div>
                <div>
                    <Label>Buffer between visits (minutes)</Label>
                    <Input type="number" min={0} max={120} value={rules.bufferMin} onChange={(e) => setRules((p) => ({ ...p, bufferMin: Number(e.target.value) || 0 }))} />
                </div>
                <div>
                    <Label>Online advance notice (minutes)</Label>
                    <Input type="number" min={0} max={10080} value={rules.advanceNoticeMin} onChange={(e) => setRules((p) => ({ ...p, advanceNoticeMin: Number(e.target.value) || 0 }))} />
                </div>
                <div>
                    <Label>Max booking horizon (days)</Label>
                    <Input type="number" min={1} max={365} value={rules.maxBookingDaysAhead} onChange={(e) => setRules((p) => ({ ...p, maxBookingDaysAhead: Number(e.target.value) || 60 }))} />
                </div>
                <div>
                    <Label>Self-cancel cutoff (hours before visit)</Label>
                    <Input type="number" min={0} max={168} value={rules.cancellationCutoffHours} onChange={(e) => setRules((p) => ({ ...p, cancellationCutoffHours: Number(e.target.value) || 0 }))} />
                </div>
                <div className="sm:col-span-3 flex justify-end">
                    <button type="submit" disabled={saving} className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold cursor-pointer disabled:opacity-50">
                        {saving ? "Saving..." : "Save booking rules"}
                    </button>
                </div>
            </form>
        </section>
    );
}
