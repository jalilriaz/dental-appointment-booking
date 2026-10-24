"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; // Assuming you have this, otherwise use Input
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import type { ServiceTreatment as Treatment, Category } from "@/lib/types";

export default function ServiceManager({
    categories,
    initialTreatments,
}: {
    categories: Category[];
    initialTreatments: Treatment[];
}) {
    const router = useRouter();
    const [treatments, setTreatments] = useState(initialTreatments);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingTreatment, setEditingTreatment] = useState<Treatment | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        categoryId: "",
        originalPrice: "",
        discountedPrice: "",
        durationMin: "30",
        description: "",
    });

    const resetForm = () => {
        setFormData({
            name: "",
            categoryId: categories[0]?.id || "",
            originalPrice: "",
            discountedPrice: "",
            durationMin: "30",
            description: "",
        });
        setEditingTreatment(null);
    };

    const handleOpenDialog = (treatment?: Treatment) => {
        if (treatment) {
            setEditingTreatment(treatment);
            setFormData({
                name: treatment.name,
                categoryId: treatment.categoryId,
                originalPrice: treatment.originalPrice.toString(),
                discountedPrice: treatment.discountedPrice?.toString() || "",
                durationMin: treatment.durationMin.toString(),
                description: treatment.description || "",
            });
        } else {
            resetForm();
        }
        setIsDialogOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const url = editingTreatment
                ? `/api/treatments/${editingTreatment.id}`
                : "/api/treatments";
            const method = editingTreatment ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    isActive: true,
                }),
            });

            if (!res.ok) throw new Error("Failed to save service");

            const { treatment } = await res.json();

            if (editingTreatment) {
                setTreatments((prev) =>
                    prev.map((t) => (t.id === treatment.id ? treatment : t))
                );
            } else {
                setTreatments((prev) => [...prev, treatment]);
            }

            setIsDialogOpen(false);
            router.refresh(); // Refresh server components to update counts etc
        } catch (error) {
            console.error(error);
            toast.error("Save Failed", { description: "Failed to save service. Please try again." });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        setIsDeleting(true);
        try {
            const res = await fetch(`/api/treatments/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to delete");
            setTreatments((prev) => prev.filter((t) => t.id !== id));
            toast.success("Service Deleted", { description: "The service has been removed." });
            router.refresh();
        } catch (error) {
            console.error(error);
            toast.error("Delete Failed", { description: "Failed to delete service. Please try again." });
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Services & Treatments</h1>
                    <p className="text-sm text-slate-500">Manage your clinic's offerings.</p>
                </div>
                <Button onClick={() => handleOpenDialog()} className="btn-brand border-0 shadow-lg shadow-teal-500/20">
                    <Plus className="size-4 mr-2" />
                    Add Service
                </Button>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px] bg-slate-900 border-white/[0.06] text-white">
                    <DialogHeader>
                        <DialogTitle>{editingTreatment ? "Edit Service" : "Add New Service"}</DialogTitle>
                        <DialogDescription>
                            Enter the details for the treatment or service.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="category">Category</Label>
                            <Select
                                value={formData.categoryId}
                                onValueChange={(val) => setFormData({ ...formData, categoryId: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((c) => (
                                        <SelectItem key={c.id} value={c.id}>
                                            {c.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="price">Price (Rs.)</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    value={formData.originalPrice}
                                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="discount">Discounted (Rs.)</Label>
                                <Input
                                    id="discount"
                                    type="number"
                                    value={formData.discountedPrice}
                                    onChange={(e) => setFormData({ ...formData, discountedPrice: e.target.value })}
                                    placeholder="Optional"
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="duration">Duration (Min)</Label>
                            <Select
                                value={formData.durationMin}
                                onValueChange={(val) => setFormData({ ...formData, durationMin: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select duration" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="15">15 min</SelectItem>
                                    <SelectItem value="30">30 min</SelectItem>
                                    <SelectItem value="45">45 min</SelectItem>
                                    <SelectItem value="60">60 min</SelectItem>
                                    <SelectItem value="90">90 min</SelectItem>
                                    <SelectItem value="120">120 min</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Description (Optional)</Label>
                            <Input
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" className="btn-brand border-0" disabled={isLoading}>
                                {isLoading ? "Saving..." : "Save Service"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <div className="space-y-8">
                {categories.map((cat) => {
                    const catTreatments = treatments.filter((t) => t.categoryId === cat.id);
                    if (catTreatments.length === 0) return null;

                    return (
                        <div key={cat.id} className="glass-card rounded-xl overflow-hidden">
                            <div className="px-6 py-4 border-b border-white/[0.06] bg-white/[0.02] flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">{cat.name === 'Implants' ? '🦷' : '✨'}</span>
                                    <div>
                                        <h2 className="text-lg font-semibold text-white">{cat.name}</h2>
                                        <p className="text-xs text-slate-400">{catTreatments.length} treatments</p>
                                    </div>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Treatment</th>
                                            <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Price</th>
                                            <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Discounted</th>
                                            <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Duration</th>
                                            <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/[0.04]">
                                        {catTreatments.map((t) => (
                                            <tr key={t.id} className="hover:bg-white/[0.03] group">
                                                <td className="px-6 py-3">
                                                    <p className="font-medium text-white">{t.name}</p>
                                                    {t.description && <p className="text-xs text-slate-400 mt-0.5 max-w-xs truncate">{t.description}</p>}
                                                </td>
                                                <td className="px-6 py-3 text-slate-300">Rs. {t.originalPrice.toLocaleString()}</td>
                                                <td className="px-6 py-3">
                                                    {t.discountedPrice ? (
                                                        <span className="text-teal-400 font-medium">Rs. {t.discountedPrice.toLocaleString()}</span>
                                                    ) : <span className="text-slate-400">—</span>}
                                                </td>
                                                <td className="px-6 py-3 text-slate-300">{t.durationMin} min</td>
                                                <td className="px-6 py-3 text-right">
                                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="size-8"
                                                            onClick={() => handleOpenDialog(t)}
                                                        >
                                                            <Pencil className="size-4 text-slate-500" />
                                                        </Button>

                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <Button variant="ghost" size="icon" className="size-8 hover:text-red-600">
                                                                    <Trash2 className="size-4" />
                                                                </Button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        This will permanently delete the service "{t.name}".
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                    <AlertDialogAction onClick={() => handleDelete(t.id)} disabled={isDeleting} className="bg-red-600 hover:bg-red-700">
                                                                        {isDeleting ? (<><Loader2 className="size-4 mr-2 animate-spin" /> Deleting...</>) : "Delete"}
                                                                    </AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
