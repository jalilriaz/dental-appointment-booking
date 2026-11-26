"use client";

import { useState } from "react";
import { toast } from "sonner";
import AddPhotoAlternateOutlined from "@mui/icons-material/AddPhotoAlternateOutlined";
import LockOutlined from "@mui/icons-material/LockOutlined";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { BeforeAfterRow } from "./types";

export default function BeforeAfterSection({
    patientId,
    isAdmin,
    initialPhotos,
}: {
    patientId: string;
    isAdmin: boolean;
    initialPhotos: BeforeAfterRow[];
}) {
    const [photos, setPhotos] = useState<BeforeAfterRow[]>(initialPhotos);
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [notes, setNotes] = useState("");
    const [beforeFile, setBeforeFile] = useState<File | null>(null);
    const [afterFile, setAfterFile] = useState<File | null>(null);
    const [saving, setSaving] = useState(false);

    if (!isAdmin) {
        return (
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1.5">
                <LockOutlined className="text-slate-400" sx={{ fontSize: 22 }} />
                <p className="text-xs font-semibold text-slate-700">Doctor / Admin only</p>
                <p className="text-xs text-slate-500">Clinical before/after photos and website publishing consent are managed by the doctor.</p>
            </div>
        );
    }

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!beforeFile || !afterFile || !title.trim()) return;
        setSaving(true);
        try {
            const fd = new FormData();
            fd.append("patientId", patientId);
            fd.append("title", title.trim());
            if (notes.trim()) fd.append("notes", notes.trim());
            fd.append("beforeFile", beforeFile);
            fd.append("afterFile", afterFile);
            const res = await fetch("/api/before-after", { method: "POST", body: fd });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Upload failed");
            setPhotos((prev) => [data.photo, ...prev]);
            setTitle("");
            setNotes("");
            setBeforeFile(null);
            setAfterFile(null);
            setOpen(false);
            toast.success("Before/After case saved privately (consent pending)");
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Upload failed");
        } finally {
            setSaving(false);
        }
    };

    const toggleFlag = async (row: BeforeAfterRow, patch: { hasConsent?: boolean; showOnWeb?: boolean }) => {
        try {
            const res = await fetch("/api/before-after", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: row.id, ...patch }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Update failed");
            setPhotos((prev) => prev.map((p) => (p.id === row.id ? data.photo : p)));
            toast.success(data.photo.hasConsent ? "Visibility updated" : "Consent withdrawn — hidden from website");
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Update failed");
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <p className="text-xs text-slate-500">Public gallery requires both patient consent and explicit publishing.</p>
                <button type="button" onClick={() => setOpen(true)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold cursor-pointer">
                    <AddPhotoAlternateOutlined sx={{ fontSize: 15 }} /> Upload case photos
                </button>
            </div>

            {photos.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-6">No before/after cases uploaded for this patient.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {photos.map((p) => (
                        <div key={p.id} className="p-3.5 rounded-xl border border-slate-200 bg-white text-xs space-y-2.5">
                            <p className="font-bold text-slate-900">{p.title}</p>
                            <div className="grid grid-cols-2 gap-2">
                                <div><span className="text-[10px] font-semibold text-slate-500">Before</span><img src={`/api/before-after/${p.id}/image?side=before`} alt="Before" className="w-full h-32 object-cover rounded-lg border border-slate-200 mt-0.5" /></div>
                                <div><span className="text-[10px] font-semibold text-slate-500">After</span><img src={`/api/before-after/${p.id}/image?side=after`} alt="After" className="w-full h-32 object-cover rounded-lg border border-slate-200 mt-0.5" /></div>
                            </div>
                            <div className="flex flex-wrap gap-4 pt-1">
                                <label className="inline-flex items-center gap-1.5 cursor-pointer font-medium">
                                    <input type="checkbox" checked={p.hasConsent} onChange={(e) => toggleFlag(p, { hasConsent: e.target.checked })} />
                                    Patient consent obtained
                                </label>
                                <label className="inline-flex items-center gap-1.5 cursor-pointer font-medium">
                                    <input type="checkbox" disabled={!p.hasConsent} checked={p.showOnWeb} onChange={(e) => toggleFlag(p, { showOnWeb: e.target.checked })} />
                                    Publish on website
                                </label>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-md bg-white">
                    <DialogHeader><DialogTitle>Upload before &amp; after case</DialogTitle></DialogHeader>
                    <form onSubmit={handleUpload} className="space-y-3 text-xs">
                        <div><Label>Case title</Label><Input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Composite Veneers Smile Makeover" /></div>
                        <div><Label>Before image</Label><input required type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => setBeforeFile(e.target.files?.[0] || null)} className="w-full text-[11px]" /></div>
                        <div><Label>After image</Label><input required type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => setAfterFile(e.target.files?.[0] || null)} className="w-full text-[11px]" /></div>
                        <div><Label>Clinical note (optional)</Label><Input value={notes} onChange={(e) => setNotes(e.target.value)} /></div>
                        <DialogFooter>
                            <button type="button" onClick={() => setOpen(false)} className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 font-semibold cursor-pointer">Cancel</button>
                            <button type="submit" disabled={saving} className="px-4 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold cursor-pointer disabled:opacity-50">{saving ? "Uploading..." : "Upload securely"}</button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
