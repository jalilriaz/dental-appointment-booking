"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import CloseOutlined from "@mui/icons-material/CloseOutlined";
import { ConfirmDialog } from "@/components/admin/shared";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { PatientEditableFields } from "./types";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    patient: PatientEditableFields;
    isAdmin: boolean;
    baseRoute: string;
}

export default function PatientSafetyEditDialog({ open, onOpenChange, patient, isAdmin, baseRoute }: Props) {
    const router = useRouter();
    const [name, setName] = useState(patient.name || "");
    const [phone, setPhone] = useState(patient.phone || "");
    const [email, setEmail] = useState(patient.email || "");
    const [gender, setGender] = useState(patient.gender || "");
    const [dob, setDob] = useState(patient.dateOfBirth ? patient.dateOfBirth.slice(0, 10) : "");
    const [address, setAddress] = useState(patient.address || "");
    const [alerts, setAlerts] = useState(patient.medicalAlerts || "");
    const [allergies, setAllergies] = useState<string[]>(patient.allergies);
    const [meds, setMeds] = useState<string[]>(patient.medications);
    const [newAllergy, setNewAllergy] = useState("");
    const [newMed, setNewMed] = useState("");
    const [saving, setSaving] = useState(false);
    const [archiveConfirm, setArchiveConfirm] = useState(false);

    const addChip = (val: string, list: string[], setter: (x: string[]) => void, clear: () => void) => {
        const clean = val.trim();
        if (clean && !list.includes(clean)) setter([...list, clean]);
        clear();
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch(`/api/patient-records/${patient.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, phone, email, gender, dateOfBirth: dob, address, medicalAlerts: alerts, allergies, medications: meds }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Update failed");
            toast.success("Patient details updated");
            onOpenChange(false);
            router.refresh();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to save");
        } finally {
            setSaving(false);
        }
    };

    const handleArchive = async () => {
        setSaving(true);
        try {
            const res = await fetch(`/api/patient-records/${patient.id}`, { method: "DELETE" });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Archive blocked");
            toast.success("Patient archived");
            setArchiveConfirm(false);
            onOpenChange(false);
            router.push(`${baseRoute}/patients`);
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Could not archive patient");
            setArchiveConfirm(false);
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto bg-white">
                    <DialogHeader><DialogTitle>Edit patient &amp; medical safety</DialogTitle></DialogHeader>
                    <form onSubmit={handleSave} className="space-y-3 text-xs">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div><Label>Full name</Label><Input required value={name} onChange={(e) => setName(e.target.value)} /></div>
                            <div><Label>Phone</Label><Input required value={phone} onChange={(e) => setPhone(e.target.value)} /></div>
                            <div><Label>Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
                            <div><Label>Gender</Label><Input value={gender} onChange={(e) => setGender(e.target.value)} placeholder="Male / Female" /></div>
                            <div><Label>Date of birth</Label><Input type="date" value={dob} onChange={(e) => setDob(e.target.value)} /></div>
                            <div><Label>Address</Label><Input value={address} onChange={(e) => setAddress(e.target.value)} /></div>
                        </div>

                        <div className="space-y-1.5">
                            <Label>Structured allergies (checked on prescriptions)</Label>
                            <div className="flex gap-2">
                                <Input value={newAllergy} onChange={(e) => setNewAllergy(e.target.value)} placeholder="e.g. Penicillin, Ibuprofen..." />
                                <button type="button" onClick={() => addChip(newAllergy, allergies, setAllergies, () => setNewAllergy(""))} className="px-3 rounded-md bg-slate-100 border border-slate-200 font-semibold cursor-pointer">Add</button>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                                {allergies.map((a) => (
                                    <span key={a} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200 font-semibold">
                                        {a}
                                        <button type="button" onClick={() => setAllergies(allergies.filter((x) => x !== a))} aria-label={`Remove allergy ${a}`} className="cursor-pointer"><CloseOutlined sx={{ fontSize: 12 }} /></button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label>Current medications</Label>
                            <div className="flex gap-2">
                                <Input value={newMed} onChange={(e) => setNewMed(e.target.value)} placeholder="e.g. Aspirin 75mg, Metformin..." />
                                <button type="button" onClick={() => addChip(newMed, meds, setMeds, () => setNewMed(""))} className="px-3 rounded-md bg-slate-100 border border-slate-200 font-semibold cursor-pointer">Add</button>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                                {meds.map((m) => (
                                    <span key={m} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200 font-semibold">
                                        {m}
                                        <button type="button" onClick={() => setMeds(meds.filter((x) => x !== m))} aria-label={`Remove medication ${m}`} className="cursor-pointer"><CloseOutlined sx={{ fontSize: 12 }} /></button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div><Label>Medical notes &amp; systemic alerts</Label><textarea rows={2} value={alerts} onChange={(e) => setAlerts(e.target.value)} placeholder="Diabetic, pacemaker, pregnancy..." className="w-full p-2 rounded-md border border-slate-200 text-xs" /></div>

                        <DialogFooter className="flex sm:justify-between gap-2 pt-2">
                            {isAdmin ? (
                                <button type="button" onClick={() => setArchiveConfirm(true)} className="px-3 py-1.5 rounded-lg border border-rose-200 text-rose-700 hover:bg-rose-50 font-semibold cursor-pointer">Archive patient</button>
                            ) : <span />}
                            <div className="flex gap-2">
                                <button type="button" onClick={() => onOpenChange(false)} className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 font-semibold cursor-pointer">Cancel</button>
                                <button type="submit" disabled={saving} className="px-4 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold cursor-pointer disabled:opacity-50">{saving ? "Saving..." : "Save details"}</button>
                            </div>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
            <ConfirmDialog open={archiveConfirm} onOpenChange={setArchiveConfirm} title="Archive patient?" description="Archiving hides the patient from booking and directory search while preserving appointments and payment ledgers. Patients with unpaid balances or upcoming visits cannot be archived." confirmLabel="Archive patient" variant="danger" loading={saving} onConfirm={handleArchive} />
        </>
    );
}
