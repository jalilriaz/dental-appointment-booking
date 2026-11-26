"use client";

import { useState } from "react";
import { toast } from "sonner";
import EventBusyOutlined from "@mui/icons-material/EventBusyOutlined";
import CampaignOutlined from "@mui/icons-material/CampaignOutlined";
import { ConfirmDialog } from "@/components/admin/shared";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { formatKarachiDate, formatKarachiTime } from "@/lib/format";
import type { AffectedAppointmentRow, DoctorAvailabilityState } from "./types";

export default function DoctorAvailabilityCard({
    initialDoctor,
    initialAffected,
}: {
    initialDoctor: DoctorAvailabilityState;
    initialAffected: AffectedAppointmentRow[];
}) {
    const [isActive, setIsActive] = useState(initialDoctor.isActive);
    const [fromDate, setFromDate] = useState(initialDoctor.unavailableFrom);
    const [toDate, setToDate] = useState(initialDoctor.unavailableTo);
    const [reason, setReason] = useState(initialDoctor.unavailableReason);
    const [affected, setAffected] = useState<AffectedAppointmentRow[]>(initialAffected);
    const [saving, setSaving] = useState(false);
    const [notifying, setNotifying] = useState(false);
    const [confirmNotify, setConfirmNotify] = useState(false);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch("/api/doctor-availability", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    isActive,
                    unavailableFrom: fromDate || null,
                    unavailableTo: toDate || null,
                    unavailableReason: reason || null,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to update availability");
            setAffected(data.affectedAppointments || []);
            toast.success("Doctor availability updated across all booking channels");
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to save availability");
        } finally {
            setSaving(false);
        }
    };

    const handleNotifyAll = async () => {
        setNotifying(true);
        try {
            const res = await fetch("/api/doctor-availability", { method: "POST" });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Notification dispatch failed");
            toast.success(`Processed ${data.total} notice(s): ${data.sent} sent, ${data.failed} failed, ${data.skipped} skipped`);
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Notification dispatch failed");
        } finally {
            setNotifying(false);
            setConfirmNotify(false);
        }
    };

    return (
        <section id="doctor-leave" className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center">
                        <EventBusyOutlined sx={{ fontSize: 20 }} />
                    </div>
                    <div>
                        <h2 className="text-base font-bold text-slate-900">Doctor availability &amp; planned leave</h2>
                        <p className="text-xs text-slate-500">
                            Blocks website, WhatsApp bot, and staff booking slots when inactive or during leave dates.
                        </p>
                    </div>
                </div>
                <label className="inline-flex items-center gap-2.5 text-xs font-semibold text-slate-700 cursor-pointer">
                    <Switch checked={isActive} onCheckedChange={setIsActive} />
                    <span>{isActive ? "Accepting appointments" : "Doctor marked inactive (all slots blocked)"}</span>
                </label>
            </div>

            <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end text-xs">
                <div className="sm:col-span-3">
                    <Label>Unavailable from</Label>
                    <Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
                </div>
                <div className="sm:col-span-3">
                    <Label>Unavailable to</Label>
                    <Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
                </div>
                <div className="sm:col-span-4">
                    <Label>Reason shown internally / leave note</Label>
                    <Input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. Surgical conference / Annual leave" />
                </div>
                <div className="sm:col-span-2">
                    <button type="submit" disabled={saving} className="w-full h-9 px-3 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold cursor-pointer disabled:opacity-50">
                        {saving ? "Saving..." : "Save leave"}
                    </button>
                </div>
            </form>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                        <p className="text-xs font-bold text-slate-900">Affected upcoming appointments ({affected.length})</p>
                        <p className="text-[11px] text-slate-500">Scheduled or rescheduled visits overlapping the leave range or inactive status.</p>
                    </div>
                    {affected.length > 0 && (
                        <button type="button" onClick={() => setConfirmNotify(true)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold cursor-pointer">
                            <CampaignOutlined sx={{ fontSize: 15 }} /> Notify patients
                        </button>
                    )}
                </div>
                {affected.length === 0 ? (
                    <p className="text-xs text-slate-500 py-2">No upcoming appointments overlap the selected unavailability window.</p>
                ) : (
                    <div className="divide-y divide-slate-200 bg-white rounded-xl border border-slate-200 overflow-hidden text-xs">
                        {affected.map((apt) => (
                            <div key={apt.id} className="px-3.5 py-2.5 flex flex-wrap items-center justify-between gap-2">
                                <div><span className="font-semibold text-slate-900">{apt.patientName}</span><span className="text-slate-500 ml-2">{apt.treatmentName}</span></div>
                                <div className="text-slate-600 font-medium">{formatKarachiDate(apt.startTime, "short")} · {formatKarachiTime(apt.startTime)}{apt.patientPhone ? ` · ${apt.patientPhone}` : " · No phone"}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <ConfirmDialog
                open={confirmNotify}
                onOpenChange={setConfirmNotify}
                title={`Notify ${affected.length} affected patient(s)?`}
                description="Sends the doctor-leave rescheduling notice using your configured template and records each attempt in Notification Log and AuditLog."
                confirmLabel="Send notices"
                loading={notifying}
                onConfirm={handleNotifyAll}
            />
        </section>
    );
}
