"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, User, Clock, Shield, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

// type WorkingHour = { ... } (Removed)
// type WorkingHoursMap = Record<string, WorkingHour>; (Removed)

type Staff = {
    id: string;
    name: string | null;
    email: string | null;
    phone: string | null;
    role: "ADMIN" | "STAFF";
};

// const defaultWorkingHours ... (Removed)


const days = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

export default function StaffManager({ initialStaff }: { initialStaff: any[] }) { // Using any[] to bypass strict Prisma Role vs string mismatch
    const router = useRouter();

    // Cast initialStaff to Staff[] safely
    const [staffList, setStaffList] = useState<Staff[]>(initialStaff.map(s => ({
        ...s,
        role: s.role as "ADMIN" | "STAFF"
    })));

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null); // For delete confirmation dialog
    const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Form State
    // Form State
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        role: "STAFF" as "ADMIN" | "STAFF",
        password: "",
    });

    const resetForm = () => {
        setFormData({
            name: "",
            email: "",
            phone: "",
            role: "STAFF",
            password: "",
        });
        setEditingStaff(null);
    };

    const handleOpenDialog = (staff?: Staff) => {
        if (staff) {
            setEditingStaff(staff);
            setFormData({
                name: staff.name || "",
                email: staff.email || "",
                phone: staff.phone || "",
                role: staff.role || "STAFF",
                password: "",
            });
        } else {
            resetForm();
        }
        setIsDialogOpen(true);
    };

    // handleWorkingHourChange removed

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const url = editingStaff ? `/api/staff/${editingStaff.id}` : "/api/staff";
            const method = editingStaff ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || "Failed to save staff");
            }

            // Force reload to ensure data consistency
            window.location.reload();

        } catch (error: any) {
            console.error(error);
            toast.error("Save Failed", { description: error.message || "Failed to save staff member. Please try again." });
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        setIsDeleting(true);
        try {
            const res = await fetch(`/api/staff/${deleteId}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to delete");

            setStaffList((prev) => prev.filter((s) => s.id !== deleteId));
            setDeleteId(null);
            toast.success("Staff Deleted", { description: "Staff member has been removed." });
            router.refresh();
        } catch (error) {
            console.error(error);
            toast.error("Delete Failed", { description: "Failed to delete staff member. Please try again." });
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">Staff Management</h1>
                    <p className="text-sm text-slate-400">Manage doctors, receptionists, and their access.</p>
                </div>
                <Button onClick={() => handleOpenDialog()} className="btn-brand border-0 shadow-lg shadow-teal-500/20 cursor-pointer">
                    <Plus className="size-4 mr-2" />
                    Add Staff
                </Button>
            </div>

            {/* Edit/Add Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-slate-900 border-white/[0.06] text-white">
                    <DialogHeader>
                        <DialogTitle>{editingStaff ? "Edit Profile" : "Add New Staff"}</DialogTitle>
                        <DialogDescription>
                            Configure account details, role, and working hours.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit}>
                        {/* Simplified Form - No Tabs */}
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="role">Role</Label>
                                    <Select value={formData.role} onValueChange={(val: "ADMIN" | "STAFF") => setFormData({ ...formData, role: val })}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="STAFF">Staff (Receptionist)</SelectItem>
                                            <SelectItem value="ADMIN">Admin (Doctor)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="Optional" disabled={!!editingStaff} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone <span className="text-red-500">*</span></Label>
                                    <Input id="phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required placeholder="Required" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">{editingStaff ? "New Password (Optional)" : "Password"}</Label>
                                <Input id="password" type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required={!editingStaff} placeholder={editingStaff ? "Unchanged" : "Create password"} />
                            </div>
                        </div>

                        <DialogFooter className="mt-6">
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                            <Button type="submit" className="btn-brand border-0" disabled={isLoading}>
                                {isLoading ? "Saving..." : "Save Staff"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Staff Account?</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this account? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={isDeleting} className="bg-red-600 hover:bg-red-700">
                            {isDeleting ? (<><Loader2 className="size-4 mr-2 animate-spin" /> Deleting...</>) : "Delete"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {staffList.map((s) => (
                    <div key={s.id} className="glass-card rounded-xl p-6 hover:border-white/[0.1] transition-premium relative group">
                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon" className="size-8 cursor-pointer" onClick={() => handleOpenDialog(s)}>
                                <Pencil className="size-4 text-slate-500" />
                            </Button>
                            <Button variant="ghost" size="icon" className="size-8 hover:text-red-600 cursor-pointer" onClick={() => setDeleteId(s.id)}>
                                <Trash2 className="size-4" />
                            </Button>
                        </div>

                        <div className="flex items-center gap-4 mb-4">
                            <div className="size-14 rounded-full bg-teal-500/15 flex items-center justify-center text-teal-400 font-bold text-xl relative border-2 border-teal-500/20">
                                {(s.name || "S").charAt(0)}
                                {s.role === "ADMIN" && (
                                    <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-1 rounded-full border-2 border-slate-900" title="Admin">
                                        <Shield className="size-3" />
                                    </div>
                                )}
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-white">{s.name}</h3>
                                <div className="flex items-center gap-2">
                                    <Badge variant="secondary" className="text-[10px] font-normal">{s.role}</Badge>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2 text-sm text-slate-300">
                            <div className="flex items-center gap-2">
                                <User className="size-3.5 text-slate-400" />
                                <span className="truncate" title={s.email || ""}>{s.email || "No Email"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <User className="size-3.5 text-slate-400" />
                                <span className="truncate">{s.phone}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
