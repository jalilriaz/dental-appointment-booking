"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fetchApi } from "@/lib/api-client";
import { SERVICE_CATEGORIES, type ServiceItem } from "./types";

interface ServiceFormDialogProps {
    open: boolean;
    editing: ServiceItem | null;
    onOpenChange: (open: boolean) => void;
    onSaved: (item: ServiceItem, isNew: boolean) => void;
}

export default function ServiceFormDialog({
    open, editing, onOpenChange, onSaved,
}: ServiceFormDialogProps) {
    const [name, setName] = useState("");
    const [category, setCategory] = useState("General");
    const [durationMin, setDurationMin] = useState("30");
    const [price, setPrice] = useState("");
    const [discountedPrice, setDiscountedPrice] = useState("");
    const [description, setDescription] = useState("");
    const [instructions, setInstructions] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [isActive, setIsActive] = useState(true);
    const [showOnWeb, setShowOnWeb] = useState(true);
    const [isMultiSession, setIsMultiSession] = useState(false);
    const [defaultSessions, setDefaultSessions] = useState("2");
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!open) return;
        setName(editing?.name || "");
        setCategory(editing?.category || "General");
        setDurationMin(String(editing?.durationMin || 30));
        setPrice(editing ? String(editing.price) : "");
        setDiscountedPrice(editing?.discountedPrice ? String(editing.discountedPrice) : "");
        setDescription(editing?.description || "");
        setInstructions(editing?.instructions || "");
        setImageUrl(editing?.imageUrl || "");
        setIsActive(editing ? editing.isActive : true);
        setShowOnWeb(editing ? editing.showOnWeb : true);
        setIsMultiSession(editing ? editing.isMultiSession : false);
        setDefaultSessions(String(editing?.defaultSessions || 2));
    }, [open, editing]);

    const handleUpload = async (file?: File) => {
        if (!file) return;
        setUploading(true);
        try {
            const fd = new FormData();
            fd.append("file", file);
            const res = await fetchApi("/api/upload", { method: "POST", body: fd });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Upload failed");
            setImageUrl(data.url);
            toast.success("Image uploaded");
        } catch (err: unknown) { toast.error(err instanceof Error ? err.message : "Upload failed"); } finally { setUploading(false); }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetchApi(editing ? `/api/treatments/${editing.id}` : "/api/treatments", {
                method: editing ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name, category, durationMin: Number(durationMin), price: Number(price),
                    discountedPrice: discountedPrice ? Number(discountedPrice) : null,
                    description, instructions, imageUrl: imageUrl || null,
                    isActive, showOnWeb, isMultiSession, defaultSessions: Number(defaultSessions),
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to save service");
            toast.success(editing ? "Service updated" : "Service created");
            onSaved(data.treatment, !editing);
            onOpenChange(false);
        } catch (err: unknown) { toast.error(err instanceof Error ? err.message : "Failed to save service"); } finally { setSaving(false); }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto bg-white">
                <DialogHeader>
                    <DialogTitle>{editing ? "Edit service" : "Add dental service"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <Label>Service name</Label>
                            <Input required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Ceramic Crown" />
                        </div>
                        <div>
                            <Label>Category</Label>
                            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full h-9 px-3 rounded-md border border-slate-200 bg-white text-xs">
                                {SERVICE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <Label>Duration (minutes)</Label>
                            <Input required type="number" min={5} step={5} value={durationMin} onChange={(e) => setDurationMin(e.target.value)} />
                        </div>
                        <div>
                            <Label>Standard fee (PKR)</Label>
                            <Input required type="number" min={0} value={price} onChange={(e) => setPrice(e.target.value)} />
                        </div>
                        <div>
                            <Label>Discounted fee (optional)</Label>
                            <Input type="number" min={0} value={discountedPrice} onChange={(e) => setDiscountedPrice(e.target.value)} placeholder="Leave blank for none" />
                        </div>
                        <div>
                            <Label>Service image</Label>
                            <input type="file" accept="image/*" disabled={uploading} onChange={(e) => handleUpload(e.target.files?.[0])} className="w-full text-[11px] text-slate-600 file:mr-2 file:px-2.5 file:py-1 file:rounded-md file:border file:border-slate-200 file:bg-slate-50" />
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-4 pt-1">
                        <label className="inline-flex items-center gap-1.5 cursor-pointer"><input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} /> Active in clinic</label>
                        <label className="inline-flex items-center gap-1.5 cursor-pointer"><input type="checkbox" checked={showOnWeb} onChange={(e) => setShowOnWeb(e.target.checked)} /> Show on website</label>
                        <label className="inline-flex items-center gap-1.5 cursor-pointer"><input type="checkbox" checked={isMultiSession} onChange={(e) => setIsMultiSession(e.target.checked)} /> Multi-session plan</label>
                        {isMultiSession && (
                            <input type="number" min={2} max={24} value={defaultSessions} onChange={(e) => setDefaultSessions(e.target.value)} className="w-16 px-2 py-0.5 border border-slate-200 rounded" aria-label="Default sessions" />
                        )}
                    </div>
                    <div><Label>Clinical description</Label><textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2 rounded-md border border-slate-200 text-xs" placeholder="Patient-facing description..." /></div>
                    <div><Label>Pre-visit WhatsApp instructions</Label><textarea rows={2} value={instructions} onChange={(e) => setInstructions(e.target.value)} className="w-full p-2 rounded-md border border-slate-200 text-xs" placeholder="Optional instructions sent before the appointment..." /></div>
                    <DialogFooter>
                        <button type="button" onClick={() => onOpenChange(false)} className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 font-semibold cursor-pointer">Cancel</button>
                        <button type="submit" disabled={saving || uploading} className="px-4 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold cursor-pointer disabled:opacity-50">{saving ? "Saving..." : editing ? "Save changes" : "Create service"}</button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
