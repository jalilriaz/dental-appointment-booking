"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Pencil, Loader2, ShieldAlert, Save } from "lucide-react";
import { useRouter } from "next/navigation";

interface MedicalAlertEditorProps {
    patientId: string;
    initialAlerts: string | null;
}

export default function MedicalAlertEditor({ patientId, initialAlerts }: MedicalAlertEditorProps) {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(initialAlerts || "");
    const [saving, setSaving] = useState(false);
    const router = useRouter();

    async function handleSave() {
        setSaving(true);
        try {
            const res = await fetch(`/api/patients/${patientId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ medicalAlerts: value.trim() }),
            });
            if (res.ok) {
                toast.success("Medical alerts updated");
                setOpen(false);
                router.refresh();
            } else {
                toast.error("Failed to update");
            }
        } catch {
            toast.error("Something went wrong");
        } finally {
            setSaving(false);
        }
    }

    return (
        <>
            <Button
                variant="outline"
                size="sm"
                onClick={() => setOpen(true)}
                className="text-xs gap-1.5 text-slate-700 border-slate-200 bg-white hover:bg-slate-50 font-medium rounded-xl shadow-xs transition-premium"
            >
                <Pencil className="size-3 text-teal-600" />
                {initialAlerts ? "Edit Alerts" : "Add Alerts"}
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-md bg-white border border-slate-200 text-slate-900 shadow-2xl rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-lg font-bold text-slate-900">
                            <ShieldAlert className="size-5 text-rose-600" />
                            Medical Alerts
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3 py-2">
                        <Label className="text-sm font-semibold text-slate-700">
                            Record any critical health information for this patient
                        </Label>
                        <Textarea
                            placeholder="e.g. Diabetic, Allergic to Penicillin, Heart condition, Blood thinner medication..."
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            className="resize-none min-h-[100px] bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-rose-500 focus:ring-rose-500/20 rounded-xl"
                        />
                        <p className="text-[11px] text-slate-500 italic">
                            This will be prominently displayed as a warning on the patient&apos;s profile and today&apos;s appointments.
                        </p>
                    </div>
                    <DialogFooter className="gap-2">
                        <Button variant="outline" onClick={() => setOpen(false)} className="border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-xl">
                            Cancel
                        </Button>
                        <Button onClick={handleSave} disabled={saving} className="bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl shadow-xs border-0">
                            {saving ? <><Loader2 className="size-4 mr-2 animate-spin" /> Saving...</> : <><Save className="size-4 mr-2" /> Save Alerts</>}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
