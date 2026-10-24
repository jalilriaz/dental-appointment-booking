"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Search, Plus, Pencil, Trash2, Loader2, AlertTriangle, Package } from "lucide-react";
import { useRouter } from "next/navigation";
import EmptyState from "@/components/shared/EmptyState";

interface InventoryItem {
    id: string;
    itemName: string;
    quantity: number;
    minThreshold: number;
    createdAt: string;
    updatedAt: string;
}

export default function InventoryManager({ initialItems }: { initialItems: InventoryItem[] }) {
    const router = useRouter();
    const [items, setItems] = useState(initialItems);
    const [search, setSearch] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editItem, setEditItem] = useState<InventoryItem | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    // Form state
    const [formName, setFormName] = useState("");
    const [formQty, setFormQty] = useState("0");
    const [formThreshold, setFormThreshold] = useState("5");

    const filtered = useMemo(() => {
        if (!search) return items;
        return items.filter(i => i.itemName.toLowerCase().includes(search.toLowerCase()));
    }, [items, search]);

    const lowStockCount = items.filter(i => i.quantity <= i.minThreshold).length;

    function openAdd() {
        setEditItem(null);
        setFormName("");
        setFormQty("0");
        setFormThreshold("5");
        setDialogOpen(true);
    }

    function openEdit(item: InventoryItem) {
        setEditItem(item);
        setFormName(item.itemName);
        setFormQty(String(item.quantity));
        setFormThreshold(String(item.minThreshold));
        setDialogOpen(true);
    }

    async function handleSave() {
        if (!formName.trim()) {
            toast.error("Item name is required");
            return;
        }
        setSaving(true);
        try {
            const body = {
                itemName: formName.trim(),
                quantity: Number(formQty) || 0,
                minThreshold: Number(formThreshold) || 5,
            };

            if (editItem) {
                const res = await fetch(`/api/inventory/${editItem.id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body),
                });
                if (res.ok) {
                    const data = await res.json();
                    setItems(prev => prev.map(i => i.id === editItem.id ? { ...i, ...body, updatedAt: new Date().toISOString() } : i));
                    toast.success("Item updated");
                } else {
                    toast.error("Failed to update");
                }
            } else {
                const res = await fetch("/api/inventory", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body),
                });
                if (res.ok) {
                    const data = await res.json();
                    setItems(prev => [...prev, data.item]);
                    toast.success("Item added");
                } else {
                    toast.error("Failed to add");
                }
            }
            setDialogOpen(false);
            router.refresh();
        } catch {
            toast.error("Something went wrong");
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete() {
        if (!deleteId) return;
        setDeleting(true);
        try {
            const res = await fetch(`/api/inventory/${deleteId}`, { method: "DELETE" });
            if (res.ok) {
                setItems(prev => prev.filter(i => i.id !== deleteId));
                toast.success("Item deleted");
            } else {
                toast.error("Failed to delete");
            }
            setDeleteId(null);
            router.refresh();
        } catch {
            toast.error("Something went wrong");
        } finally {
            setDeleting(false);
        }
    }

    return (
        <>
            {/* Stats bar */}
            <div className="glass-card rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex gap-4">
                    <div>
                        <p className="text-xs text-slate-400 uppercase font-semibold">Total Items</p>
                        <p className="text-xl font-bold text-white">{items.length}</p>
                    </div>
                    {lowStockCount > 0 && (
                        <div>
                            <p className="text-xs text-amber-400 uppercase font-semibold">Low Stock</p>
                            <p className="text-xl font-bold text-amber-400">{lowStockCount}</p>
                        </div>
                    )}
                </div>
                <div className="flex gap-2 items-center">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                        <Input
                            placeholder="Search items..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10 w-56 bg-white/[0.04] border-white/10 text-white placeholder:text-slate-500 focus:border-teal-500/50 focus:ring-teal-500/20"
                        />
                    </div>
                    <Button onClick={openAdd} className="btn-brand border-0 gap-1.5 shadow-lg shadow-teal-500/20">
                        <Plus className="size-4" />
                        Add Item
                    </Button>
                </div>
            </div>

            {/* Table */}
            <div className="glass-card rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-white/[0.03] border-b border-white/[0.06]">
                            <tr>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase">Item Name</th>
                                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-400 uppercase">Quantity</th>
                                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-400 uppercase">Min Threshold</th>
                                <th className="text-center px-4 py-3 text-xs font-semibold text-slate-400 uppercase">Status</th>
                                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-400 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.04]">
                            {filtered.map((item) => {
                                const isLow = item.quantity <= item.minThreshold;
                                return (
                                    <tr
                                        key={item.id}
                                        className={`transition-premium ${isLow
                                            ? "bg-amber-500/[0.06] hover:bg-amber-500/[0.1]"
                                            : "hover:bg-white/[0.03]"
                                            }`}
                                    >
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <Package className={`size-4 ${isLow ? "text-amber-400" : "text-slate-400"}`} />
                                                <span className="font-medium text-white">{item.itemName}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className={`font-bold ${isLow ? "text-amber-400" : "text-slate-200"}`}>
                                                {item.quantity}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center text-slate-400">{item.minThreshold}</td>
                                        <td className="px-4 py-3 text-center">
                                            {isLow ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                                                    <AlertTriangle className="size-3" />
                                                    Low Stock
                                                </span>
                                            ) : (
                                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-emerald-500/15 text-emerald-400">
                                                    In Stock
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex justify-end gap-1">
                                                <button
                                                    onClick={() => openEdit(item)}
                                                    className="p-1.5 rounded-lg hover:bg-white/[0.06] text-slate-400 hover:text-white cursor-pointer transition-premium"
                                                    title="Edit"
                                                >
                                                    <Pencil className="size-4" />
                                                </button>
                                                <button
                                                    onClick={() => setDeleteId(item.id)}
                                                    className="p-1.5 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-400 cursor-pointer transition-premium"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="size-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="py-0">
                                        <EmptyState
                                            icon={Package}
                                            title="No Items Found"
                                            description={search ? "No items match your search." : "Add your first inventory item to start tracking stock levels."}
                                        />
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-md bg-slate-900 border-white/[0.06] text-white">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Package className="size-5 text-teal-400" />
                            {editItem ? "Edit Item" : "Add New Item"}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="space-y-2">
                            <Label className="text-slate-300">Item Name <span className="text-red-500">*</span></Label>
                            <Input
                                value={formName}
                                onChange={(e) => setFormName(e.target.value)}
                                placeholder="e.g. Disposable Gloves, Composite Resin..."
                                className="bg-white/[0.04] border-white/10 text-white placeholder:text-slate-500 focus:border-teal-500/50"
                                autoFocus
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-slate-300">Current Quantity</Label>
                                <Input
                                    type="number"
                                    value={formQty}
                                    onChange={(e) => setFormQty(e.target.value)}
                                    className="bg-white/[0.04] border-white/10 text-white focus:border-teal-500/50"
                                    min={0}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-300">Min Threshold</Label>
                                <Input
                                    type="number"
                                    value={formThreshold}
                                    onChange={(e) => setFormThreshold(e.target.value)}
                                    className="bg-white/[0.04] border-white/10 text-white focus:border-teal-500/50"
                                    min={0}
                                />
                                <p className="text-[10px] text-slate-500 italic">Alert when stock falls to or below this level</p>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDialogOpen(false)} className="border-slate-700 text-slate-300 hover:bg-white/5">
                            Cancel
                        </Button>
                        <Button onClick={handleSave} disabled={saving} className="btn-brand border-0">
                            {saving ? <><Loader2 className="size-4 mr-2 animate-spin" /> Saving...</> : editItem ? "Update Item" : "Add Item"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <AlertDialog open={!!deleteId} onOpenChange={(open) => { if (!open) setDeleteId(null); }}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <div className="mx-auto size-12 rounded-full bg-red-500/10 flex items-center justify-center mb-2">
                            <AlertTriangle className="size-6 text-red-400" />
                        </div>
                        <AlertDialogTitle className="text-center">Delete Inventory Item</AlertDialogTitle>
                        <AlertDialogDescription className="text-center">
                            Are you sure you want to delete this item? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="sm:justify-center gap-3">
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white border-0"
                            disabled={deleting}
                        >
                            {deleting ? <><Loader2 className="size-4 mr-2 animate-spin" /> Deleting...</> : "Yes, Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
