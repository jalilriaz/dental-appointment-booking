"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { LabOrderRow } from "./types";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    patients: Array<{ id: string; name: string; phone: string | null }>;
    onCreated: (order: LabOrderRow) => void;
}

export default function LabOrderDialog({ open, onOpenChange, patients, onCreated }: Props) {
    const [patientId, setPatientId] = useState(patients[0]?.id || "");
    const [labName, setLabName] = useState("");
    const [workType, setWorkType] = useState("");
    const [toothNumbers, setToothNumbers] = useState("");
    const [shade, setShade] = useState("");
    const [cost, setCost] = useState("0");
    const [expectedDate, setExpectedDate] = useState("");
    const [notes, setNotes] = useState("");
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch("/api/lab-orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    patientId,
                    labName,
                    workType,
                    toothNumbers: toothNumbers || null,
                    shade: shade || null,
                    cost: Number(cost) || 0,
                    expectedDate: expectedDate || null,
                    notes: notes || null,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to create lab order");
            const o = data.order;
            onCreated({
                id: o.id,
                patientId: o.patientId,
                patientName: o.patient?.name || "Patient",
                patientPhone: o.patient?.phone || null,
                labName: o.labName,
                workType: o.workType,
                toothNumbers: o.toothNumbers,
                shade: o.shade,
                cost: o.cost,
                status: o.status,
                sentDate: o.sentDate,
                expectedDate: o.expectedDate,
                receivedDate: o.receivedDate,
                deliveredDate: o.deliveredDate,
                notes: o.notes,
            });
            setLabName("");
            setWorkType("");
            setToothNumbers("");
            setShade("");
            setCost("0");
            setExpectedDate("");
            setNotes("");
            onOpenChange(false);
            toast.success("Lab order recorded");
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to save lab order");
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg bg-white">
                <DialogHeader><DialogTitle>New dental lab order</DialogTitle></DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                    <div>
                        <Label>Patient</Label>
                        <select required value={patientId} onChange={(e) => setPatientId(e.target.value)} className="w-full h-9 px-2.5 rounded-md border border-slate-200 bg-white">
                            {patients.map((p) => (
                                <option key={p.id} value={p.id}>{p.name}{p.phone ? ` (${p.phone})` : ""}</option>
                            ))}
                        </select>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div><Label>Dental lab name</Label><Input required value={labName} onChange={(e) => setLabName(e.target.value)} placeholder="e.g. Precision Ceramics Lab" /></div>
                        <div><Label>Work type</Label><Input required value={workType} onChange={(e) => setWorkType(e.target.value)} placeholder="e.g. Zirconia Crown" /></div>
                        <div><Label>Tooth #</Label><Input value={toothNumbers} onChange={(e) => setToothNumbers(e.target.value)} placeholder="e.g. #16, #17" /></div>
                        <div><Label>Shade</Label><Input value={shade} onChange={(e) => setShade(e.target.value)} placeholder="e.g. A2" /></div>
                        <div><Label>Lab cost (PKR)</Label><Input type="number" min={0} value={cost} onChange={(e) => setCost(e.target.value)} /></div>
                        <div><Label>Expected return date</Label><Input type="date" value={expectedDate} onChange={(e) => setExpectedDate(e.target.value)} /></div>
                    </div>
                    <div><Label>Instructions / notes</Label><Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Margin notes or bite details" /></div>
                    <DialogFooter>
                        <button type="button" onClick={() => onOpenChange(false)} className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 font-semibold cursor-pointer">Cancel</button>
                        <button type="submit" disabled={saving} className="px-4 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold cursor-pointer disabled:opacity-50">{saving ? "Saving..." : "Create lab order"}</button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
