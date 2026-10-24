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
                className="text-xs gap-1.5 text-slate-400 border-white/10 hover:bg-white/[0.04] hover:text-white"
            >
                <Pencil className="size-3" />
                {initialAlerts ? "Edit Alerts" : "Add Alerts"}
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-md bg-slate-900 border-white/[0.06] text-white">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <ShieldAlert className="size-5 text-red-400" />
                            Medical Alerts
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3 py-2">
                        <Label className="text-sm text-slate-300">
                            Record any critical health information for this patient
                        </Label>
                        <Textarea
                            placeholder="e.g. Diabetic, Allergic to Penicillin, Heart condition, Blood thinner medication..."
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            className="resize-none min-h-[100px] bg-white/[0.04] border-white/10 text-white placeholder:text-slate-500 focus:border-red-500/50"
                        />
                        <p className="text-[10px] text-slate-500 italic">
                            This will be prominently displayed as a warning on the patient&apos;s profile and today&apos;s appointments.
                        </p>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpen(false)} className="border-slate-700 text-slate-300 hover:bg-white/5">
                            Cancel
                        </Button>
                        <Button onClick={handleSave} disabled={saving} className="bg-red-600 hover:bg-red-700 text-white border-0">
                            {saving ? <><Loader2 className="size-4 mr-2 animate-spin" /> Saving...</> : <><Save className="size-4 mr-2" /> Save Alerts</>}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
