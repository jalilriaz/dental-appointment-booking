"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import AddOutlined from "@mui/icons-material/AddOutlined";
import DeleteOutlineOutlined from "@mui/icons-material/DeleteOutlineOutlined";
import MedicationOutlined from "@mui/icons-material/MedicationOutlined";
import PrintOutlined from "@mui/icons-material/PrintOutlined";
import WarningAmberOutlined from "@mui/icons-material/WarningAmberOutlined";
import { formatKarachiDate } from "@/lib/format";
import { detectAllergyConflicts } from "@/lib/services/allergyConflicts";
import PrescriptionPrintDialog from "./PrescriptionPrintDialog";
import type { ClinicHeaderInfo, PrescriptionEntryRow, PrescriptionRow } from "./types";

const EMPTY_ENTRY = (): PrescriptionEntryRow => ({ drug: "", dose: "", frequency: "1+0+1", duration: "5 days", instructions: "" });

interface Props {
    patientId: string;
    patientName: string;
    patientCode: number | null;
    patientPhone: string | null;
    allergies: string[];
    isAdmin: boolean;
    clinicInfo: ClinicHeaderInfo;
    initialPrescriptions: PrescriptionRow[];
}

export default function PrescriptionsSection(props: Props) {
    const [list, setList] = useState<PrescriptionRow[]>(props.initialPrescriptions);
    const [entries, setEntries] = useState<PrescriptionEntryRow[]>([EMPTY_ENTRY()]);
    const [notes, setNotes] = useState("");
    const [confirmConflict, setConfirmConflict] = useState(false);
    const [saving, setSaving] = useState(false);
    const [printTarget, setPrintTarget] = useState<PrescriptionRow | null>(null);

    const conflicts = useMemo(() => detectAllergyConflicts(entries, props.allergies), [entries, props.allergies]);

    const updateRow = (i: number, key: keyof PrescriptionEntryRow, value: string) => {
        setEntries((prev) => prev.map((row, idx) => (idx === i ? { ...row, [key]: value } : row)));
        setConfirmConflict(false);
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (conflicts.length > 0 && !confirmConflict) {
            toast.error("Allergy conflict detected — review and confirm override before issuing Rx.");
            return;
        }
        setSaving(true);
        try {
            const res = await fetch("/api/prescriptions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    patientId: props.patientId,
                    entries,
                    notes: notes.trim() || null,
                    acknowledgedWarnings: confirmConflict ? conflicts : [],
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to save prescription");
            setList((prev) => [data.prescription, ...prev]);
            setEntries([EMPTY_ENTRY()]);
            setNotes("");
            setConfirmConflict(false);
            setPrintTarget(data.prescription);
            toast.success("Prescription issued");
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to save prescription");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-4">
            {props.isAdmin && (
                <form onSubmit={handleCreate} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs">
                    <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800 inline-flex items-center gap-1.5">
                            <MedicationOutlined sx={{ fontSize: 16 }} className="text-teal-700" /> Write structured prescription (Rx)
                        </span>
                        <button type="button" onClick={() => setEntries((p) => [...p, EMPTY_ENTRY()])} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 font-semibold text-teal-700 hover:bg-teal-50 cursor-pointer">
                            <AddOutlined sx={{ fontSize: 14 }} /> Add medicine
                        </button>
                    </div>
                    {entries.map((row, i) => (
                        <div key={i} className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center bg-white p-2 rounded-lg border border-slate-200">
                            <input required placeholder="Medicine (e.g. Amoxicillin)" value={row.drug} onChange={(e) => updateRow(i, "drug", e.target.value)} className="sm:col-span-3 px-2.5 py-1.5 rounded-md border border-slate-200" />
                            <input required placeholder="Dose (e.g. 500 mg)" value={row.dose} onChange={(e) => updateRow(i, "dose", e.target.value)} className="sm:col-span-2 px-2.5 py-1.5 rounded-md border border-slate-200" />
                            <input required placeholder="Freq (1+0+1)" value={row.frequency} onChange={(e) => updateRow(i, "frequency", e.target.value)} className="sm:col-span-2 px-2.5 py-1.5 rounded-md border border-slate-200" />
                            <input required placeholder="Duration (5 days)" value={row.duration} onChange={(e) => updateRow(i, "duration", e.target.value)} className="sm:col-span-2 px-2.5 py-1.5 rounded-md border border-slate-200" />
                            <input placeholder="Notes (after meals)" value={row.instructions || ""} onChange={(e) => updateRow(i, "instructions", e.target.value)} className="sm:col-span-2 px-2.5 py-1.5 rounded-md border border-slate-200" />
                            <button type="button" aria-label="Remove medicine" disabled={entries.length <= 1} onClick={() => setEntries((p) => p.filter((_, idx) => idx !== i))} className="sm:col-span-1 justify-self-end p-1.5 rounded-md text-slate-400 hover:text-rose-600 disabled:opacity-30 cursor-pointer">
                                <DeleteOutlineOutlined sx={{ fontSize: 16 }} />
                            </button>
                        </div>
                    ))}
                    {conflicts.length > 0 && (
                        <div className="rounded-lg border border-rose-300 bg-rose-50 p-2.5 text-rose-800 space-y-1.5">
                            <p className="font-bold flex items-center gap-1.5"><WarningAmberOutlined sx={{ fontSize: 16 }} /> Allergy conflict detected</p>
                            <ul className="list-disc pl-5 text-[11px]">{conflicts.map((w) => <li key={w}>{w}</li>)}</ul>
                            <label className="flex items-center gap-2 text-[11px] font-semibold cursor-pointer pt-0.5">
                                <input type="checkbox" checked={confirmConflict} onChange={(e) => setConfirmConflict(e.target.checked)} />
                                I acknowledge the allergy warning and confirm issuing this prescription.
                            </label>
                        </div>
                    )}
                    <div className="flex flex-col sm:flex-row gap-2">
                        <input placeholder="Additional clinical instructions (optional)" value={notes} onChange={(e) => setNotes(e.target.value)} className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white" />
                        <button type="submit" disabled={saving} className="px-4 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold cursor-pointer disabled:opacity-50">
                            {saving ? "Saving..." : "Issue prescription"}
                        </button>
                    </div>
                </form>
            )}

            {list.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-8 border border-dashed border-slate-200 rounded-xl">No prescriptions issued yet.</p>
            ) : (
                <div className="space-y-2">
                    {list.map((rx) => (
                        <div key={rx.id} className="p-3 rounded-xl border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                            <div className="min-w-0">
                                <p className="font-semibold text-slate-900">{rx.entries.map((e) => `${e.drug} (${e.dose})`).join(", ")}</p>
                                <p className="text-[11px] text-slate-500 mt-0.5">
                                    {rx.doctorName}{rx.doctorPmdc ? ` · PMDC ${rx.doctorPmdc}` : ""} · {formatKarachiDate(rx.createdAt)}
                                </p>
                            </div>
                            <button type="button" onClick={() => setPrintTarget(rx)} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold shrink-0 cursor-pointer">
                                <PrintOutlined sx={{ fontSize: 15 }} /> View &amp; Print
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <PrescriptionPrintDialog prescription={printTarget} patientName={props.patientName} patientCode={props.patientCode} patientPhone={props.patientPhone} allergies={props.allergies} clinicInfo={props.clinicInfo} onClose={() => setPrintTarget(null)} />
        </div>
    );
}
