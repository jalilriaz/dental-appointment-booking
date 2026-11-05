"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import AutorenewOutlinedIcon from "@mui/icons-material/AutorenewOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import MedicalServicesOutlinedIcon from "@mui/icons-material/MedicalServicesOutlined";
import MedicationOutlinedIcon from "@mui/icons-material/MedicationOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import { Badge } from "@/components/ui/badge";
import OdontogramChart, { type OdontogramData } from "@/components/admin/OdontogramChart";

interface ClinicalNote {
    id: string;
    diagnosis: string | null;
    treatmentDone: string;
    prescription: string | null;
    remarks: string | null;
    odontogramData?: OdontogramData | null;
    createdAt: string;
    updatedAt: string;
}

interface ClinicalNoteDialogProps {
    appointmentId: string;
    patientName: string;
    treatmentName: string;
    appointmentDate: string;
    existingNote?: ClinicalNote | null;
    onNoteSaved?: () => void;
    readOnly?: boolean;
}

export default function ClinicalNoteDialog({
    appointmentId,
    patientName,
    treatmentName,
    appointmentDate,
    existingNote,
    onNoteSaved,
    readOnly = false,
}: ClinicalNoteDialogProps) {
    const [open, setOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const [diagnosis, setDiagnosis] = useState(existingNote?.diagnosis || "");
    const [treatmentDone, setTreatmentDone] = useState(existingNote?.treatmentDone || "");
    const [prescription, setPrescription] = useState(existingNote?.prescription || "");
    const [remarks, setRemarks] = useState(existingNote?.remarks || "");
    const [odontogramData, setOdontogramData] = useState<OdontogramData>(
        (existingNote?.odontogramData as OdontogramData) || {}
    );

    const hasNote = !!existingNote;

    // If read-only and no note, don't show anything
    if (readOnly && !hasNote) return null;

    async function handleSave() {
        if (readOnly) return;
        if (!treatmentDone.trim()) {
            setError("Treatment done is required");
            return;
        }
        setError("");
        setSaving(true);
        setSuccess(false);

        try {
            const res = await fetch(`/api/appointments/${appointmentId}/notes`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    diagnosis: diagnosis.trim() || null,
                    treatmentDone: treatmentDone.trim(),
                    prescription: prescription.trim() || null,
                    remarks: remarks.trim() || null,
                    odontogramData: Object.keys(odontogramData).length > 0 ? odontogramData : null,
                    noteId: existingNote?.id || undefined,
                }),
            });

            const data = await res.json();
            if (res.ok && data.success) {
                setSuccess(true);
                onNoteSaved?.();
                setTimeout(() => {
                    setOpen(false);
                    setSuccess(false);
                }, 1000);
            } else {
                setError(data.error || "Failed to save note");
            }
        } catch {
            setError("Something went wrong");
        } finally {
            setSaving(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant={hasNote ? "outline" : "default"}
                    size="sm"
                    className={hasNote
                        ? "text-emerald-700 border-emerald-300 hover:bg-emerald-50 gap-1.5 cursor-pointer transition-premium bg-emerald-50/50"
                        : "bg-teal-600 hover:bg-teal-700 text-white gap-1.5 cursor-pointer transition-premium shadow-xs border-0"
                    }
                >
                    <DescriptionOutlinedIcon className="size-3.5" />
                    {hasNote ? "View Notes" : "Add Notes"}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl bg-white border-slate-200 text-slate-900 shadow-2xl flex flex-col p-0 max-h-[90vh] overflow-hidden">
                {/* Sticky Header */}
                <div className="px-6 pt-6 pb-4 border-b border-slate-200 shrink-0">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-lg text-slate-900">
                            <AssignmentOutlinedIcon className="size-5 text-teal-600" />
                            {readOnly ? "View Clinical Notes" : "Clinical Notes"}
                        </DialogTitle>
                        <DialogDescription className="text-slate-600">
                            <span className="font-semibold text-slate-900">{patientName}</span>
                            {" · "}
                            <span className="font-medium text-slate-700">{treatmentName}</span>
                            {" · "}
                            <span className="text-slate-500">{appointmentDate}</span>
                        </DialogDescription>
                    </DialogHeader>
                </div>
                {/* Scrollable Body */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden px-6 py-4">

                    {success ? (
                        <div className="py-8 text-center">
                            <div className="size-12 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-3">
                                <SaveOutlinedIcon className="size-6 text-emerald-600" />
                            </div>
                            <p className="font-semibold text-slate-900">Notes saved successfully!</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* Diagnosis */}
                            <div className="space-y-2">
                                <Label className="flex items-center gap-1.5 text-slate-700 font-semibold text-xs">
                                    <MedicalServicesOutlinedIcon className="size-3.5 text-blue-600" />
                                    Diagnosis
                                    {!readOnly && <Badge variant="secondary" className="text-[10px] ml-1 bg-slate-100 text-slate-700">Optional</Badge>}
                                </Label>
                                <Textarea
                                    placeholder={readOnly ? "No diagnosis recorded" : "e.g. Mild gingivitis on lower left quadrant..."}
                                    value={diagnosis}
                                    onChange={(e) => setDiagnosis(e.target.value)}
                                    className="resize-none min-h-[70px] bg-white border-slate-200 text-slate-900 focus:border-teal-500"
                                    disabled={readOnly}
                                />
                            </div>

                            {/* Treatment Done */}
                            <div className="space-y-2">
                                <Label className="flex items-center gap-1.5 text-slate-700 font-semibold text-xs">
                                    <AssignmentOutlinedIcon className="size-3.5 text-teal-600" />
                                    Treatment Done {!readOnly && <span className="text-red-500">*</span>}
                                </Label>
                                <Textarea
                                    placeholder={readOnly ? "-" : "e.g. Scaling and polishing performed, composite filling on tooth #36..."}
                                    value={treatmentDone}
                                    onChange={(e) => setTreatmentDone(e.target.value)}
                                    className="resize-none min-h-[80px] bg-white border-slate-200 text-slate-900 focus:border-teal-500"
                                    disabled={readOnly}
                                />
                            </div>

                            {/* Prescription */}
                            <div className="space-y-2">
                                <Label className="flex items-center gap-1.5 text-slate-700 font-semibold text-xs">
                                    <MedicationOutlinedIcon className="size-3.5 text-teal-600" />
                                    Prescription
                                    {!readOnly && <Badge variant="secondary" className="text-[10px] ml-1 bg-slate-100 text-slate-700">Optional</Badge>}
                                </Label>
                                <Textarea
                                    placeholder={readOnly ? "No prescription recorded" : "e.g. Amoxicillin 500mg TID x 5 days, Ibuprofen 400mg PRN..."}
                                    value={prescription}
                                    onChange={(e) => setPrescription(e.target.value)}
                                    className="resize-none min-h-[70px] bg-white border-slate-200 text-slate-900 focus:border-teal-500"
                                    disabled={readOnly}
                                />
                            </div>

                            {/* Remarks */}
                            <div className="space-y-2">
                                <Label className="flex items-center gap-1.5 text-slate-700 font-semibold text-xs">
                                    <ChatBubbleOutlineOutlinedIcon className="size-3.5 text-amber-600" />
                                    Remarks / Follow-up
                                    {!readOnly && <Badge variant="secondary" className="text-[10px] ml-1 bg-slate-100 text-slate-700">Optional</Badge>}
                                </Label>
                                <Textarea
                                    placeholder={readOnly ? "No remarks" : "e.g. Follow up in 2 weeks, avoid hard food for 24 hours..."}
                                    value={remarks}
                                    onChange={(e) => setRemarks(e.target.value)}
                                    className="resize-none min-h-[60px] bg-white border-slate-200 text-slate-900 focus:border-teal-500"
                                    disabled={readOnly}
                                />
                            </div>

                            {/* Odontogram - Dental Chart */}
                            <div className="space-y-2 pt-2 border-t border-slate-200">
                                <Label className="flex items-center gap-1.5 text-slate-700 font-semibold text-xs">
                                    🦷 Visual Dental Chart (Odontogram)
                                    {!readOnly && <Badge variant="secondary" className="text-[10px] ml-1 bg-slate-100 text-slate-700">Optional</Badge>}
                                </Label>
                                <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-x-auto">
                                    <div className="min-w-max p-4">
                                        <OdontogramChart
                                            value={odontogramData}
                                            onChange={setOdontogramData}
                                            readOnly={readOnly}
                                        />
                                    </div>
                                </div>
                            </div>

                            {error && (
                                <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2 border border-red-200">{error}</p>
                            )}
                        </div>
                    )}
                </div>

                {!success && !readOnly && (
                    <div className="px-6 py-4 border-t border-slate-200 shrink-0">
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setOpen(false)} className="border-slate-300 text-slate-700 hover:bg-slate-100">
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSave}
                                disabled={saving}
                                className="bg-teal-600 hover:bg-teal-700 text-white font-semibold"
                            >
                                {saving ? (
                                    <>
                                        <AutorenewOutlinedIcon className="size-4 mr-2 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <SaveOutlinedIcon className="size-4 mr-2" />
                                        {hasNote ? "Update Notes" : "Save Notes"}
                                    </>
                                )}
                            </Button>
                        </DialogFooter>
                    </div>
                )}
                {!success && readOnly && (
                    <div className="px-6 py-4 border-t border-slate-200 shrink-0">
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setOpen(false)} className="border-slate-300 text-slate-700 hover:bg-slate-100">
                                Close
                            </Button>
                        </DialogFooter>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
