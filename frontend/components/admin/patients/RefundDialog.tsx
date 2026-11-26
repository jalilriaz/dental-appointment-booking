"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatPKR } from "@/lib/format";
import { getPaymentMethodLabel, type PaymentMethodValue } from "@/lib/constants/payment-methods";
import PaymentMethodSelector from "@/components/shared/PaymentMethodSelector";

export interface RefundTargetPayment {
    id: string;
    amount: number;
    method: string;
    treatmentName: string;
}

interface RefundDialogProps {
    target: RefundTargetPayment | null;
    onClose: () => void;
    onSuccess: () => void;
}

export default function RefundDialog({ target, onClose, onSuccess }: RefundDialogProps) {
    const [amount, setAmount] = useState("");
    const [method, setMethod] = useState<PaymentMethodValue>("CASH");
    const [notes, setNotes] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!target) return;
        setAmount(String(target.amount));
        setMethod((target.method as PaymentMethodValue) || "CASH");
        setNotes("");
    }, [target]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!target) return;
        setSaving(true);
        try {
            const res = await fetch("/api/refunds", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    refundedPaymentId: target.id,
                    amount: Number(amount),
                    method,
                    notes,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Refund failed");
            toast.success("Refund recorded", {
                description: `${formatPKR(Number(amount))} refunded via ${getPaymentMethodLabel(method)}.`,
            });
            onSuccess();
            onClose();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to issue refund");
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={Boolean(target)} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md bg-white">
                <DialogHeader>
                    <DialogTitle>Issue payment refund</DialogTitle>
                </DialogHeader>
                {target && (
                    <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                            <div>
                                <p className="font-semibold text-slate-900">{target.treatmentName}</p>
                                <p className="text-slate-500">Original method: {getPaymentMethodLabel(target.method)}</p>
                            </div>
                            <span className="font-bold text-slate-900">{formatPKR(target.amount)}</span>
                        </div>
                        <div>
                            <Label>Refund amount (PKR)</Label>
                            <Input
                                required
                                type="number"
                                min={1}
                                max={target.amount}
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                        </div>
                        <div>
                            <Label className="mb-1.5 block">Refund method</Label>
                            <PaymentMethodSelector value={method} onChange={setMethod} />
                        </div>
                        <div>
                            <Label>Reason (required)</Label>
                            <textarea
                                required
                                rows={2}
                                minLength={3}
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="e.g. Treatment cancelled by patient, duplicate charge..."
                                className="w-full p-2 rounded-md border border-slate-200 text-xs"
                            />
                        </div>
                        <DialogFooter>
                            <button type="button" onClick={onClose} className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 font-semibold cursor-pointer">
                                Cancel
                            </button>
                            <button type="submit" disabled={saving} className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold cursor-pointer disabled:opacity-50">
                                {saving ? "Processing..." : "Confirm refund"}
                            </button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
