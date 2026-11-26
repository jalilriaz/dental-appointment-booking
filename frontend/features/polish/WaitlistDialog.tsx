"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getKarachiDateKey } from "@/lib/format";
import type { WaitlistRow } from "./types";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    treatments: Array<{ id: string; name: string }>;
    onCreated: (entry: WaitlistRow) => void;
}

export default function WaitlistDialog({ open, onOpenChange, treatments, onCreated }: Props) {
    const [patientName, setPatientName] = useState("");
    const [patientPhone, setPatientPhone] = useState("");
    const [treatmentId, setTreatmentId] = useState("");
    const [preferredDate, setPreferredDate] = useState(getKarachiDateKey(new Date()));
    const [preferredTimeSlot, setPreferredTimeSlot] = useState("Afternoon (3 PM - 6 PM)");
    const [notes, setNotes] = useState("");
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch("/api/waitlist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    patientName,
                    patientPhone,
                    treatmentId: treatmentId || null,
                    preferredDate,
                    preferredTimeSlot: preferredTimeSlot || null,
                    notes: notes || null,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to add waitlist entry");
            const eRow = data.entry;
            onCreated({
                id: eRow.id,
                patientId: eRow.patientId,
                patientName: eRow.patientName,
                patientPhone: eRow.patientPhone,
                treatmentId: eRow.treatmentId,
                treatmentName: eRow.treatment?.name || null,
                preferredDate: eRow.preferredDate,
                preferredTimeSlot: eRow.preferredTimeSlot,
                status: eRow.status,
                notes: eRow.notes,
                notifiedAt: eRow.notifiedAt,
            });
            setPatientName("");
            setPatientPhone("");
            setNotes("");
            onOpenChange(false);
            toast.success("Patient added to cancellation waitlist");
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to save waitlist entry");
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md bg-white">
                <DialogHeader><DialogTitle>Add patient to waitlist</DialogTitle></DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                    <div><Label>Patient name</Label><Input required value={patientName} onChange={(e) => setPatientName(e.target.value)} placeholder="e.g. Usman Tariq" /></div>
                    <div><Label>Phone / WhatsApp</Label><Input required value={patientPhone} onChange={(e) => setPatientPhone(e.target.value)} placeholder="0300 1234567" /></div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div><Label>Preferred date</Label><Input type="date" required value={preferredDate} onChange={(e) => setPreferredDate(e.target.value)} /></div>
                        <div><Label>Preferred window</Label><Input value={preferredTimeSlot} onChange={(e) => setPreferredTimeSlot(e.target.value)} /></div>
                    </div>
                    <div>
                        <Label>Treatment (optional)</Label>
                        <select value={treatmentId} onChange={(e) => setTreatmentId(e.target.value)} className="w-full h-9 px-2.5 rounded-md border border-slate-200 bg-white">
                            <option value="">Any dental procedure</option>
                            {treatments.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                        </select>
                    </div>
                    <div><Label>Notes</Label><Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Urgent / flexible timing" /></div>
                    <DialogFooter>
                        <button type="button" onClick={() => onOpenChange(false)} className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 font-semibold cursor-pointer">Cancel</button>
                        <button type="submit" disabled={saving} className="px-4 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold cursor-pointer disabled:opacity-50">{saving ? "Saving..." : "Add to waitlist"}</button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
