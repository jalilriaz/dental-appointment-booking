"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { formatPKR } from "@/lib/utils";
import {
    Plus,
    Pencil,
    Trash2,
    Loader2,
    Search,
    Clock,
    DollarSign,
    ToggleLeft,
    ToggleRight,
    AlertTriangle,
    Stethoscope,
    Tag,
} from "lucide-react";

import type { Treatment } from "@/lib/types";

export default function TreatmentManager({ initialTreatments }: { initialTreatments: Treatment[] }) {
    const [treatments, setTreatments] = useState<Treatment[]>(initialTreatments);
    const [search, setSearch] = useState("");
    const [filterActive, setFilterActive] = useState<"all" | "active" | "inactive">("all");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editingTreatment, setEditingTreatment] = useState<Treatment | null>(null);
    const [deletingTreatment, setDeletingTreatment] = useState<Treatment | null>(null);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [togglingId, setTogglingId] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        durationMin: "30",
        price: "",
        discountedPrice: "",
        description: "",
        instructions: "",
        isActive: true,
        imageUrl: "",
    });

    async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setError("");

        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to upload image");

            setFormData((prev) => ({ ...prev, imageUrl: data.url }));
        } catch (err) {
            setError(err instanceof Error ? err.message : "Image upload failed");
        } finally {
            setUploading(false);
        }
    }

    const filtered = treatments.filter((t) => {
        const matchesSearch =
            t.name.toLowerCase().includes(search.toLowerCase()) ||
            t.description?.toLowerCase().includes(search.toLowerCase());
        const matchesFilter =
            filterActive === "all" ||
            (filterActive === "active" && t.isActive) ||
            (filterActive === "inactive" && !t.isActive);
        return matchesSearch && matchesFilter;
    });

    const activeCount = treatments.filter((t) => t.isActive).length;
    const inactiveCount = treatments.filter((t) => !t.isActive).length;

    function openAddDialog() {
        setEditingTreatment(null);
        setFormData({ name: "", durationMin: "30", price: "", discountedPrice: "", description: "", instructions: "", isActive: true, imageUrl: "" });
        setError("");
        setDialogOpen(true);
    }

    function openEditDialog(t: Treatment) {
        setEditingTreatment(t);
        setFormData({
            name: t.name,
            durationMin: String(t.durationMin),
            price: String(t.price),
            discountedPrice: t.discountedPrice ? String(t.discountedPrice) : "",
            description: t.description || "",
            instructions: t.instructions || "",
            isActive: t.isActive,
            imageUrl: t.imageUrl || "",
        });
        setError("");
        setDialogOpen(true);
    }

    function openDeleteDialog(t: Treatment) {
        setDeletingTreatment(t);
        setError("");
        setDeleteDialogOpen(true);
    }

    async function handleSave() {
        if (!formData.name.trim() || !formData.price) {
            setError("Name and price are required.");
            return;
        }

        setSaving(true);
        setError("");

        try {
            const isEdit = !!editingTreatment;
            const url = isEdit ? `/api/treatments/${editingTreatment.id}` : "/api/treatments";
            const method = isEdit ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    durationMin: formData.durationMin,
                    price: formData.price,
                    discountedPrice: formData.discountedPrice || null,
                    description: formData.description,
                    instructions: formData.instructions,
                    isActive: formData.isActive,
                    imageUrl: formData.imageUrl || null,
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Something went wrong");

            if (isEdit) {
                setTreatments((prev) =>
                    prev.map((t) => (t.id === editingTreatment.id ? { ...t, ...data.treatment } : t))
                );
            } else {
                setTreatments((prev) => [...prev, { ...data.treatment, _count: { appointments: 0 } }].sort((a, b) => a.name.localeCompare(b.name)));
            }

            setDialogOpen(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to save");
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete() {
        if (!deletingTreatment) return;
        setDeleting(true);
        setError("");

        try {
            const res = await fetch(`/api/treatments/${deletingTreatment.id}`, { method: "DELETE" });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to delete");

            setTreatments((prev) => prev.filter((t) => t.id !== deletingTreatment.id));
            setDeleteDialogOpen(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to delete");
        } finally {
            setDeleting(false);
        }
    }

    async function toggleActive(t: Treatment) {
        setTogglingId(t.id);
        try {
            const res = await fetch(`/api/treatments/${t.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isActive: !t.isActive }),
            });
            if (!res.ok) throw new Error("Failed to update");
            setTreatments((prev) =>
                prev.map((item) => (item.id === t.id ? { ...item, isActive: !item.isActive } : item))
            );
        } catch {
            toast.error("Update Failed", { description: "Failed to toggle treatment status. Please try again." });
        } finally {
            setTogglingId(null);
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Treatments & Services</h1>
                    <p className="text-sm text-slate-400 mt-1">
                        {treatments.length} treatments · {activeCount} active · {inactiveCount} inactive
                    </p>
                </div>
                <Button onClick={openAddDialog} className="btn-brand border-0 shadow-lg shadow-teal-500/20 cursor-pointer">
                    <Plus className="size-4 mr-2" />
                    Add Treatment
                </Button>
            </div>

            {/* Search + Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <Input
                        placeholder="Search treatments..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10 bg-white/[0.04] border-white/10 text-white placeholder:text-slate-500 focus:border-teal-500/50"
                    />
                </div>
                <div className="flex gap-1 bg-white/[0.04] rounded-lg p-1">
                    {(["all", "active", "inactive"] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilterActive(f)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-premium capitalize cursor-pointer ${filterActive === f
                                ? "bg-white/[0.1] text-white shadow-sm"
                                : "text-slate-400 hover:text-slate-200"
                                }`}
                        >
                            {f} {f === "active" ? `(${activeCount})` : f === "inactive" ? `(${inactiveCount})` : `(${treatments.length})`}
                        </button>
                    ))}
                </div>
            </div>

            {/* Treatment Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((t) => (
                    <div
                        key={t.id}
                        className={`group glass-card rounded-xl overflow-hidden transition-premium hover:border-white/[0.1] ${!t.isActive ? "opacity-60" : ""
                            }`}
                    >
                        <div className="p-5 space-y-3">
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-3 flex-1 min-w-0">
                                    <div className={`p-2 rounded-lg shrink-0 ${t.isActive ? "bg-teal-500/15 text-teal-400" : "bg-white/[0.04] text-slate-500"}`}>
                                        <Stethoscope className="size-5" />
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="font-semibold text-white truncate">{t.name}</h3>
                                        {t.description && (
                                            <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{t.description}</p>
                                        )}
                                    </div>
                                </div>
                                <Badge
                                    variant="secondary"
                                    className={t.isActive ? "bg-teal-500/15 text-teal-400 border-0" : "bg-white/[0.06] text-slate-500 border-0"}
                                >
                                    {t.isActive ? "Active" : "Inactive"}
                                </Badge>
                            </div>

                            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-white/[0.06]">
                                <div>
                                    <div className="flex items-center gap-1 text-xs text-slate-400 mb-0.5">
                                        <Clock className="size-3" /> Duration
                                    </div>
                                    <p className="text-sm font-semibold text-white">{t.durationMin} min</p>
                                </div>
                                <div>
                                    <div className="flex items-center gap-1 text-xs text-slate-400 mb-0.5">
                                        <DollarSign className="size-3" /> Price
                                    </div>
                                    {t.discountedPrice ? (
                                        <div>
                                            <p className="text-xs text-slate-500 line-through">{formatPKR(t.price)}</p>
                                            <p className="text-sm font-semibold text-emerald-400">{formatPKR(t.discountedPrice)}</p>
                                        </div>
                                    ) : (
                                        <p className="text-sm font-semibold text-teal-400">{formatPKR(t.price)}</p>
                                    )}
                                </div>
                                <div>
                                    <div className="text-xs text-slate-400 mb-0.5">Bookings</div>
                                    <p className="text-sm font-semibold text-white">{t._count?.appointments || 0}</p>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex border-t border-white/[0.06] divide-x divide-white/[0.06] bg-white/[0.02]">
                            <button
                                onClick={() => openEditDialog(t)}
                                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-premium cursor-pointer"
                            >
                                <Pencil className="size-3.5" /> Edit
                            </button>
                            <button
                                onClick={() => toggleActive(t)}
                                disabled={togglingId === t.id}
                                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 transition-premium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {togglingId === t.id ? (
                                    <><Loader2 className="size-3.5 animate-spin" /> Updating...</>
                                ) : t.isActive ? (
                                    <><ToggleRight className="size-3.5" /> Deactivate</>
                                ) : (
                                    <><ToggleLeft className="size-3.5" /> Activate</>
                                )}
                            </button>
                            <button
                                onClick={() => openDeleteDialog(t)}
                                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-premium cursor-pointer"
                            >
                                <Trash2 className="size-3.5" /> Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {filtered.length === 0 && (
                <div className="text-center py-12 text-slate-400">
                    <Stethoscope className="size-10 mx-auto mb-3 text-slate-600" />
                    <p className="font-medium text-white">No treatments found</p>
                    <p className="text-sm mt-1">
                        {search ? "Try a different search term." : "Add your first treatment to get started."}
                    </p>
                </div>
            )}

            {/* Add/Edit Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-[520px] bg-slate-900 border-white/[0.06] text-white">
                    <DialogHeader>
                        <DialogTitle>{editingTreatment ? "Edit Treatment" : "Add New Treatment"}</DialogTitle>
                        <DialogDescription>
                            {editingTreatment ? "Update the treatment details below." : "Fill in the details for the new treatment."}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-2">
                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-300 flex items-center gap-2">
                                <AlertTriangle className="size-4 shrink-0" />
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="name">Treatment Name *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g. Teeth Whitening"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="durationMin">Duration (minutes) *</Label>
                                <Input
                                    id="durationMin"
                                    type="number"
                                    min="5"
                                    max="480"
                                    value={formData.durationMin}
                                    onChange={(e) => setFormData({ ...formData, durationMin: e.target.value })}
                                    placeholder="30"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="price">Price (PKR) *</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    min="0"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    placeholder="20000"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="discountedPrice" className="flex items-center gap-1.5">
                                <Tag className="size-3.5 text-emerald-400" />
                                Discounted Price (PKR)
                                <span className="text-xs text-slate-500 ml-1">optional</span>
                            </Label>
                            <Input
                                id="discountedPrice"
                                type="number"
                                min="0"
                                value={formData.discountedPrice}
                                onChange={(e) => setFormData({ ...formData, discountedPrice: e.target.value })}
                                placeholder="e.g. 17000 — leave empty if no discount"
                            />
                            {formData.price && formData.discountedPrice && Number(formData.discountedPrice) < Number(formData.price) && (
                                <p className="text-xs text-emerald-400 flex items-center gap-1">
                                    💰 {Math.round(((Number(formData.price) - Number(formData.discountedPrice)) / Number(formData.price)) * 100)}% discount applied
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <textarea
                                id="description"
                                rows={2}
                                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Brief description of the treatment..."
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="instructions">
                                Post-Treatment Instructions
                                <span className="text-xs text-slate-400 ml-1">(optional, used in WhatsApp bot)</span>
                            </Label>
                            <textarea
                                id="instructions"
                                rows={2}
                                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                value={formData.instructions}
                                onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                                placeholder="e.g. Avoid hot drinks for 2 hours..."
                            />
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-white/[0.03] border border-white/[0.06] rounded-lg">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.isActive ? "bg-teal-500" : "bg-slate-600"
                                    }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.isActive ? "translate-x-6" : "translate-x-1"
                                        }`}
                                />
                            </button>
                            <div>
                                <p className="text-sm font-medium text-white">
                                    {formData.isActive ? "Active" : "Inactive"}
                                </p>
                                <p className="text-xs text-slate-400">
                                    {formData.isActive ? "Visible in booking forms" : "Hidden from booking forms"}
                                </p>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDialogOpen(false)} className="border-slate-700 text-slate-200 hover:bg-white/[0.04]">Cancel</Button>
                        <Button onClick={handleSave} disabled={saving} className="btn-brand border-0">
                            {saving ? (
                                <><Loader2 className="size-4 mr-2 animate-spin" /> Saving...</>
                            ) : editingTreatment ? (
                                "Update Treatment"
                            ) : (
                                "Create Treatment"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent className="sm:max-w-[420px] bg-slate-900 border-white/[0.06] text-white">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-red-600">
                            <AlertTriangle className="size-5" />
                            Delete Treatment
                        </DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete <strong className="text-white">{deletingTreatment?.name}</strong>?
                            This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>

                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-300 flex items-center gap-2">
                            <AlertTriangle className="size-4 shrink-0" />
                            {error}
                        </div>
                    )}

                    {(deletingTreatment?._count?.appointments || 0) > 0 && (
                        <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-sm text-amber-300">
                            ⚠️ This treatment has <strong>{deletingTreatment?._count?.appointments}</strong> appointment(s).
                            Consider deactivating instead.
                        </div>
                    )}

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} className="border-slate-700 text-slate-200 hover:bg-white/[0.04]">Cancel</Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={deleting}
                        >
                            {deleting ? (
                                <><Loader2 className="size-4 mr-2 animate-spin" /> Deleting...</>
                            ) : (
                                "Delete Treatment"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
