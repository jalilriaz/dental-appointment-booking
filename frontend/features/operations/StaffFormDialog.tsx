"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { StaffAccountRow } from "./types";

interface Props {
    open: boolean;
    editing: StaffAccountRow | null;
    onOpenChange: (open: boolean) => void;
    onSaved: (staff: StaffAccountRow, created: boolean) => void;
}

export default function StaffFormDialog({ open, editing, onOpenChange, onSaved }: Props) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [role, setRole] = useState<"ADMIN" | "STAFF">("STAFF");
    const [password, setPassword] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (editing) {
            setName(editing.name);
            setEmail(editing.email || "");
            setPhone(editing.phone || "");
            setRole(editing.role);
            setPassword("");
        } else {
            setName("");
            setEmail("");
            setPhone("");
            setRole("STAFF");
            setPassword("");
        }
    }, [editing, open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const url = editing ? `/api/staff-accounts/${editing.id}` : "/api/staff-accounts";
            const method = editing ? "PATCH" : "POST";
            const payload = editing ? { name, email, phone, role } : { name, email, phone, role, password };
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Save failed");
            onSaved(data.staff, !editing);
            onOpenChange(false);
            toast.success(editing ? "Staff account updated" : "Staff account created");
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to save staff account");
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md bg-white">
                <DialogHeader>
                    <DialogTitle>{editing ? "Edit staff account" : "Add staff account"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                    <div>
                        <Label>Full name</Label>
                        <Input required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Sara Raza" />
                    </div>
                    <div>
                        <Label>Email address</Label>
                        <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="sara@elitedental.com" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <Label>Phone (optional)</Label>
                            <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0300 1234567" />
                        </div>
                        <div>
                            <Label>Role</Label>
                            <select value={role} onChange={(e) => setRole(e.target.value as "ADMIN" | "STAFF")} className="w-full h-9 px-2.5 rounded-md border border-slate-200 bg-white">
                                <option value="STAFF">Staff / Receptionist</option>
                                <option value="ADMIN">Admin / Doctor</option>
                            </select>
                        </div>
                    </div>
                    {!editing && (
                        <div>
                            <Label>Initial password (min 8 chars)</Label>
                            <Input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                    )}
                    <DialogFooter>
                        <button type="button" onClick={() => onOpenChange(false)} className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 font-semibold cursor-pointer">
                            Cancel
                        </button>
                        <button type="submit" disabled={saving} className="px-4 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold cursor-pointer disabled:opacity-50">
                            {saving ? "Saving..." : editing ? "Save changes" : "Create account"}
                        </button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
