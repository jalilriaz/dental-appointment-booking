"use client";

import { useState, useEffect } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { formatPKR } from "@/lib/utils";

interface CheckoutAppointment {
    patient: { name: string | null } | null;
    treatment: { name: string; price: number };
    price?: number | null;
}

/**
 * Unified Checkout Dialog used by both TodayAppointments and AppointmentsTable.
 *
 * - `editablePrice` (default true): when true, the billed price field is shown and editable (TodayAppointments mode).
 *   When false, the treatment price is fixed (AppointmentsTable mode).
 * - `onConfirm` receives (amountPaid, billedPrice, discount) so the caller can handle both shapes.
 */
export default function CheckoutDialog({
    apt,
    onClose,
    onConfirm,
    amountValue,
    setAmountValue,
    discountValue: controlledDiscount,
    setDiscountValue: controlledSetDiscount,
    editablePrice = true,
}: {
    apt: CheckoutAppointment | null;
    onClose: () => void;
    onConfirm: (amountPaid: number, billedPrice: number, discount: number) => void;
    amountValue: string;
    setAmountValue: (val: string) => void;
    discountValue?: string;
    setDiscountValue?: (val: string) => void;
    editablePrice?: boolean;
}) {
    // Internal discount state (used when caller doesn't control it)
    const [internalDiscount, setInternalDiscount] = useState("0");
    const discountValue = controlledDiscount ?? internalDiscount;
    const setDiscountValue = controlledSetDiscount ?? setInternalDiscount;

    // Internal price state for editable-price mode
    const [priceValue, setPriceValue] = useState<string>("");

    // Initialize price & amount safely in useEffect when dialog opens
    useEffect(() => {
        if (apt) {
            const initialPrice = (apt.price && apt.price > 0) ? apt.price : (apt.treatment?.price || 0);
            setPriceValue(String(initialPrice));
            setAmountValue(String(initialPrice));
        } else {
            setPriceValue("");
            setInternalDiscount("0");
        }
    }, [apt]);

    const billedPrice = editablePrice ? (Number(priceValue) || 0) : (apt?.treatment.price || 0);
    const discount = Math.max(0, Number(discountValue) || 0);
    const netTotal = Math.max(0, billedPrice - discount);

    return (
        <Dialog open={!!apt} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[420px] bg-slate-900 border-white/[0.06] text-white">
                <DialogHeader>
                    <div className="mx-auto size-12 rounded-full bg-emerald-500/10 flex items-center justify-center mb-2">
                        <CheckCircle2 className="size-6 text-emerald-400" />
                    </div>
                    <DialogTitle className="text-center">Check Out Patient</DialogTitle>
                    <DialogDescription className="text-center">
                        Recording visit for <strong>{apt?.patient?.name}</strong>.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Treatment info */}
                    <div className="p-3 bg-white/[0.03] rounded-lg border border-white/[0.06] space-y-1">
                        <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Treatment</p>
                        <p className="text-sm font-medium text-slate-200">{apt?.treatment.name}</p>
                        {!editablePrice && (
                            <p className="text-sm text-teal-400 font-bold">Price: {formatPKR(apt?.treatment.price || 0)}</p>
                        )}
                    </div>

                    {/* Price + Discount inputs */}
                    <div className={editablePrice ? "grid grid-cols-2 gap-4" : "space-y-2"}>
                        {editablePrice && (
                            <div className="space-y-2">
                                <Label htmlFor="checkout-price" className="text-slate-300 text-xs">Billed Price</Label>
                                <div className="relative">
                                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs">Rs.</span>
                                    <Input
                                        id="checkout-price"
                                        type="number"
                                        value={priceValue}
                                        onChange={(e) => setPriceValue(e.target.value)}
                                        min={0}
                                        className="bg-white/[0.04] border-white/10 pl-8 h-9 text-sm focus:border-teal-500/50 transition-premium"
                                    />
                                </div>
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="checkout-discount" className="text-slate-300 text-xs">Discount (PKR)</Label>
                            <div className="relative">
                                <span className={`absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 ${editablePrice ? "text-xs" : "px-1 border-r border-white/10"}`}>Rs.</span>
                                <Input
                                    id="checkout-discount"
                                    type="number"
                                    value={discountValue}
                                    onChange={(e) => setDiscountValue(e.target.value)}
                                    className={`bg-white/[0.04] border-white/10 focus:border-teal-500/50 transition-premium ${editablePrice ? "pl-8 h-9 text-sm" : "pl-12 h-11"}`}
                                    min={0}
                                    max={billedPrice}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Dynamic total */}
                    <div className="p-3 rounded-lg border border-teal-500/20 bg-teal-500/5 space-y-1">
                        <div className={`flex justify-between ${editablePrice ? "text-xs" : "text-sm"}`}>
                            <span className="text-slate-400">{editablePrice ? "Billed Price" : "Treatment Price"}</span>
                            <span className="text-slate-300">{editablePrice ? `Rs. ${billedPrice.toLocaleString("en-PK")}` : formatPKR(billedPrice)}</span>
                        </div>
                        {discount > 0 && (
                            <div className={`flex justify-between ${editablePrice ? "text-xs" : "text-sm"}`}>
                                <span className="text-red-400">Discount</span>
                                <span className="text-red-400">- {editablePrice ? `Rs. ${discount.toLocaleString("en-PK")}` : formatPKR(discount)}</span>
                            </div>
                        )}
                        <div className={`flex justify-between font-bold pt-1 border-t border-teal-500/20 ${editablePrice ? "text-sm" : "text-sm mt-1"}`}>
                            <span className="text-teal-300">Net Total</span>
                            <span className="text-teal-300">{editablePrice ? `Rs. ${netTotal.toLocaleString("en-PK")}` : formatPKR(netTotal)}</span>
                        </div>
                    </div>

                    {/* Amount collected */}
                    <div className="space-y-2">
                        <Label htmlFor="checkout-amount" className="text-slate-300 text-xs">{editablePrice ? "Paid Today" : "Amount Collected (Rs.)"}</Label>
                        <div className="relative">
                            <span className={`absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 ${editablePrice ? "text-xs" : "px-1 border-r border-white/10"}`}>Rs.</span>
                            <Input
                                id="checkout-amount"
                                type="number"
                                value={amountValue}
                                onChange={(e) => setAmountValue(e.target.value)}
                                min={0}
                                className={`bg-white/[0.04] border-white/10 focus:border-teal-500/50 transition-premium ${editablePrice ? "pl-8 h-9 text-sm" : "pl-12 h-11"}`}
                                autoFocus
                            />
                        </div>
                        <p className="text-[10px] text-slate-500 italic text-center">
                            {editablePrice
                                ? 'Set "Billed Price" to 0 for free follow-ups.'
                                : "Pre-filled with treatment price. Edit for partial/installment payments."}
                        </p>
                    </div>
                </div>

                <DialogFooter className="sm:justify-center gap-2">
                    <Button variant="outline" onClick={onClose} className="border-slate-700 text-slate-300 hover:bg-white/5">
                        Cancel
                    </Button>
                    <Button
                        onClick={() => onConfirm(Number(amountValue !== "" ? amountValue : netTotal), billedPrice, discount)}
                        className="btn-brand border-0 px-8 shadow-lg shadow-teal-500/20"
                    >
                        {editablePrice ? "Confirm" : "Save & Check Out"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
