"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getKarachiDateKey } from "@/lib/format";
import { EXPENSE_CATEGORIES, type PaymentMethodValue } from "@/lib/constants/payment-methods";
import PaymentMethodSelector from "@/components/shared/PaymentMethodSelector";
import type { ExpenseRow } from "./types";

interface ExpenseFormDialogProps {
    open: boolean;
    editing: ExpenseRow | null;
    onOpenChange: (open: boolean) => void;
    onSaved: (row: ExpenseRow, isNew: boolean) => void;
}

export default function ExpenseFormDialog({ open, editing, onOpenChange, onSaved }: ExpenseFormDialogProps) {
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("SUPPLIES");
    const [amount, setAmount] = useState("");
    const [method, setMethod] = useState<PaymentMethodValue>("CASH");
    const [expenseDate, setExpenseDate] = useState(getKarachiDateKey(new Date()));
    const [vendor, setVendor] = useState("");
    const [notes, setNotes] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!open) return;
        setTitle(editing?.title || "");
        setCategory(editing?.category || "SUPPLIES");
        setAmount(editing ? String(editing.amount) : "");
        setMethod((editing?.method as PaymentMethodValue) || "CASH");
        setExpenseDate(editing ? getKarachiDateKey(editing.expenseDate) : getKarachiDateKey(new Date()));
        setVendor(editing?.vendor || "");
        setNotes(editing?.notes || "");
    }, [open, editing]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const url = editing ? `/api/expenses/${editing.id}` : "/api/expenses";
            const res = await fetch(url, {
                method: editing ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title, category, amount: Number(amount), method, expenseDate, vendor, notes,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to save expense");
            toast.success(editing ? "Expense updated" : "Expense recorded");
            onSaved({ ...data.expense, isDayLocked: false }, !editing);
            onOpenChange(false);
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to save expense");
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg bg-white">
                <DialogHeader>
                    <DialogTitle>{editing ? "Edit expense" : "Record clinic expense"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="sm:col-span-2">
                            <Label>Expense description</Label>
                            <Input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Composite resin refill / Electricity bill" />
                        </div>
                        <div>
                            <Label>Category</Label>
                            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full h-9 px-3 rounded-md border border-slate-200 bg-white text-xs">
                                {EXPENSE_CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                            </select>
                        </div>
                        <div>
                            <Label>Amount (PKR)</Label>
                            <Input required type="number" min={1} value={amount} onChange={(e) => setAmount(e.target.value)} />
                        </div>
                        <div>
                            <Label>Date</Label>
                            <Input required type="date" value={expenseDate} onChange={(e) => setExpenseDate(e.target.value)} />
                        </div>
                        <div>
                            <Label>Vendor (optional)</Label>
                            <Input value={vendor} onChange={(e) => setVendor(e.target.value)} placeholder="Supplier or payee" />
                        </div>
                    </div>
                    <div>
                        <Label className="mb-1.5 block">Payment method</Label>
                        <PaymentMethodSelector value={method} onChange={setMethod} />
                    </div>
                    <div>
                        <Label>Note (optional)</Label>
                        <textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full p-2 rounded-md border border-slate-200 text-xs" />
                    </div>
                    <DialogFooter>
                        <button type="button" onClick={() => onOpenChange(false)} className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 font-semibold cursor-pointer">Cancel</button>
                        <button type="submit" disabled={saving} className="px-4 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold cursor-pointer disabled:opacity-50">{saving ? "Saving..." : editing ? "Save changes" : "Record expense"}</button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
