"use client";

import { useState } from "react";
import { toast } from "sonner";
import DrawOutlined from "@mui/icons-material/DrawOutlined";
import HistoryEduOutlined from "@mui/icons-material/HistoryEduOutlined";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatKarachiDate } from "@/lib/format";
import SignaturePad from "./SignaturePad";
import type { ConsentFormRow } from "./types";

const DEFAULT_CONSENT_TEXT =
    "I acknowledge that I have been informed of the nature of the proposed dental treatment, expected benefits, potential risks, and alternative options. I authorize the attending dental surgeon to perform the procedure.";

export default function ConsentFormsSection({
    patientId,
    patientName,
    initialConsents,
}: {
    patientId: string;
    patientName: string;
    initialConsents: ConsentFormRow[];
}) {
    const [consents, setConsents] = useState<ConsentFormRow[]>(initialConsents);
    const [open, setOpen] = useState(false);
    const [supersedeTarget, setSupersedeTarget] = useState<ConsentFormRow | null>(null);
    const [title, setTitle] = useState("Informed Dental Procedure Consent");
    const [procedureName, setProcedureName] = useState("");
    const [content, setContent] = useState(DEFAULT_CONSENT_TEXT);
    const [signedByName, setSignedByName] = useState(patientName);
    const [witnessName, setWitnessName] = useState("");
    const [signatureData, setSignatureData] = useState("");
    const [saving, setSaving] = useState(false);

    const openSignModal = (base?: ConsentFormRow) => {
        setSupersedeTarget(base || null);
        setTitle(base?.title || "Informed Dental Procedure Consent");
        setProcedureName(base?.procedureName || "");
        setContent(base?.content || DEFAULT_CONSENT_TEXT);
        setSignedByName(base?.signedByName || patientName);
        setWitnessName(base?.witnessName || "");
        setSignatureData("");
        setOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!signatureData) {
            toast.error("Please capture patient signature before saving.");
            return;
        }
        setSaving(true);
        try {
            const res = await fetch("/api/consents", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    patientId, supersedeId: supersedeTarget?.id || null,
                    title, procedureName, content, signatureData, signedByName, witnessName,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to save consent");
            setConsents((prev) => [
                data.consent,
                ...prev.map((c) => (c.id === supersedeTarget?.id ? { ...c, supersededById: data.consent.id } : c)),
            ]);
            toast.success(`Signed consent v${data.consent.version} archived immutably`);
            setOpen(false);
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to save consent");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <p className="text-xs text-slate-500">Signed consents are immutable; updates create a superseding version.</p>
                <button type="button" onClick={() => openSignModal()} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold cursor-pointer">
                    <DrawOutlined sx={{ fontSize: 15 }} /> Sign new consent
                </button>
            </div>

            {consents.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-6">No signed consent forms on file yet.</p>
            ) : (
                <div className="space-y-3">
                    {consents.map((c) => (
                        <div key={c.id} className="p-3.5 rounded-xl border border-slate-200 bg-white text-xs space-y-2">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <div>
                                    <span className="font-bold text-slate-900">{c.title}</span>
                                    <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-teal-50 text-teal-800 border border-teal-200">v{c.version}</span>
                                    {c.supersededById && <span className="ml-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-500">Superseded</span>}
                                    <p className="text-[11px] text-slate-500 mt-0.5">Signed by {c.signedByName} on {formatKarachiDate(c.signedAt, "medium")}{c.createdBy?.name ? ` · Captured by ${c.createdBy.name}` : ""}</p>
                                </div>
                                {!c.supersededById && (
                                    <button type="button" onClick={() => openSignModal(c)} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 font-semibold text-slate-700 cursor-pointer">
                                        <HistoryEduOutlined sx={{ fontSize: 14 }} /> Supersede (v{c.version + 1})
                                    </button>
                                )}
                            </div>
                            <p className="text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">{c.content}</p>
                            {c.signatureData && (
                                <img src={c.signatureData} alt={`Signature of ${c.signedByName}`} className="h-14 border border-slate-200 rounded-lg bg-slate-50 px-2" />
                            )}
                        </div>
                    ))}
                </div>
            )}

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto bg-white">
                    <DialogHeader><DialogTitle>{supersedeTarget ? `New consent version (v${supersedeTarget.version + 1})` : "Capture patient consent"}</DialogTitle></DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div><Label>Form title</Label><Input required value={title} onChange={(e) => setTitle(e.target.value)} /></div>
                            <div><Label>Procedure</Label><Input value={procedureName} onChange={(e) => setProcedureName(e.target.value)} placeholder="e.g. Surgical Extraction" /></div>
                            <div><Label>Signed by (name)</Label><Input required value={signedByName} onChange={(e) => setSignedByName(e.target.value)} /></div>
                            <div><Label>Witness (optional)</Label><Input value={witnessName} onChange={(e) => setWitnessName(e.target.value)} /></div>
                        </div>
                        <div><Label>Exact consent text</Label><textarea required rows={3} value={content} onChange={(e) => setContent(e.target.value)} className="w-full p-2 rounded-md border border-slate-200 text-xs" /></div>
                        <SignaturePad onChange={setSignatureData} />
                        <DialogFooter>
                            <button type="button" onClick={() => setOpen(false)} className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 font-semibold cursor-pointer">Cancel</button>
                            <button type="submit" disabled={saving} className="px-4 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold cursor-pointer disabled:opacity-50">{saving ? "Saving..." : "Lock & sign consent"}</button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
