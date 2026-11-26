"use client";

import { useState, useEffect } from "react";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
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
import { formatPKR, isSunday } from "@/lib/utils";
import { DatePicker } from "@/components/ui/date-picker";
import PaymentMethodSelector from "@/components/shared/PaymentMethodSelector";
import type { PaymentMethodValue } from "@/lib/constants/payment-methods";

export interface CheckoutAppointment {
    id?: string;
    patient: { id?: string; name: string | null; phone?: string | null } | null;
    treatment: {
        id?: string;
        name: string;
        price: number;
        isMultiSession?: boolean;
        defaultSessions?: number;
    };
    price?: number | null;
    discount?: number | null;
    patientTreatment?: {
        id: string;
        totalCost: number;
        totalSessions: number;
        clinicalStatus: string;
        financialStatus: string;
        payments?: { amount: number }[];
    } | null;
    sessionNumber?: number | null;
    sessionLabel?: string | null;
}

export interface CheckoutConfirmData {
    amountPaid: number;
    billedPrice: number;
    discount: number;
    paymentMethod: PaymentMethodValue;
    discountPercent?: number;
    packageCost?: number;
    totalSessions?: number;
    nextSessionDate?: string;
    nextSessionTime?: string;
    nextSessionFee?: number;
    nextSessionLabel?: string;
}

export default function CheckoutDialog({
    apt,
    onClose,
    onConfirm,
    amountValue,
    setAmountValue,
    discountValue: controlledDiscount,
    setDiscountValue: controlledSetDiscount,
    discountPercent: controlledDiscountPercent,
    setDiscountPercent: controlledSetDiscountPercent,
    editablePrice = true,
}: {
    apt: CheckoutAppointment | null;
    onClose: () => void;
    onConfirm: (
        amountPaid: number,
        billedPrice: number,
        discount: number,
        options?: {
            paymentMethod?: PaymentMethodValue;
            discountPercent?: number;
            packageCost?: number;
            totalSessions?: number;
            nextSessionDate?: string;
            nextSessionTime?: string;
            nextSessionFee?: number;
            nextSessionLabel?: string;
        }
    ) => void;
    amountValue: string;
    setAmountValue: (val: string) => void;
    discountValue?: string;
    setDiscountValue?: (val: string) => void;
    discountPercent?: string;
    setDiscountPercent?: (val: string) => void;
    editablePrice?: boolean;
}) {
    const [internalDiscountPercent, setInternalDiscountPercent] = useState("0");
    const discountPercent = controlledDiscountPercent ?? (controlledDiscount !== undefined ? controlledDiscount : internalDiscountPercent);
    const setDiscountPercent = controlledSetDiscountPercent ?? controlledSetDiscount ?? setInternalDiscountPercent;

    const [priceValue, setPriceValue] = useState<string>("");
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethodValue>("CASH");

    // Multi-session fields
    const isLinkedPlan = Boolean(apt?.patientTreatment);
    const isNewMultiSession = !isLinkedPlan && Boolean(apt?.treatment?.isMultiSession);
    const isMultiSession = isLinkedPlan || isNewMultiSession;

    const [packageCost, setPackageCost] = useState<string>("");
    const [totalSessions, setTotalSessions] = useState<string>("4");

    // Next session scheduling fields
    const [scheduleNextSession, setScheduleNextSession] = useState(false);
    const [nextSessionDate, setNextSessionDate] = useState("");
    const [nextSessionTime, setNextSessionTime] = useState("14:00");
    const [nextSessionFee, setNextSessionFee] = useState<string>("");
    const [nextSessionLabel, setNextSessionLabel] = useState<string>("");

    // Calculate existing plan balance if linked
    const existingTotalCost = apt?.patientTreatment?.totalCost || 0;
    const existingPaid = (apt?.patientTreatment?.payments || []).reduce((sum, p) => sum + p.amount, 0);
    const remainingBalance = Math.max(0, existingTotalCost - existingPaid);
    const currentSessionNumber = apt?.sessionNumber || (isLinkedPlan ? 2 : 1);
    const planTotalSessions = apt?.patientTreatment?.totalSessions ?? (Number(totalSessions) > 0 ? Number(totalSessions) : 1);

    useEffect(() => {
        if (apt) {
            const initialPrice = (apt.price && apt.price > 0) ? apt.price : (apt.treatment?.price || 0);
            setPriceValue(String(initialPrice));

            let initialPct = 0;
            if (apt.discount && apt.discount > 0 && initialPrice > 0) {
                initialPct = Math.min(100, Math.round((apt.discount / initialPrice) * 100));
            }
            setDiscountPercent(String(initialPct));

            const initialDiscountAmount = Math.round((initialPrice * initialPct) / 100);
            const initialNet = Math.max(0, initialPrice - initialDiscountAmount);

            if (isLinkedPlan) {
                // For an ongoing plan, default "Paid Today" to 0 or remaining balance
                setAmountValue(String(remainingBalance > 0 ? "" : "0"));
            } else if (isNewMultiSession) {
                setPackageCost(String(initialPrice));
                setTotalSessions(String(apt.treatment?.defaultSessions || 4));
                setAmountValue(""); // Doctor/receptionist enters initial installment (e.g. 24,000)
            } else {
                setAmountValue(String(initialNet));
            }

            setScheduleNextSession(false);
            setNextSessionDate("");
            setNextSessionTime("14:00");
            setNextSessionFee("");
            setNextSessionLabel("");
        } else {
            setPriceValue("");
            setInternalDiscountPercent("0");
            setScheduleNextSession(false);
            setNextSessionFee("");
            setNextSessionLabel("");
        }
    }, [apt]);

    const billedPrice = editablePrice ? (Number(priceValue) || 0) : (apt?.treatment?.price || 0);
    const numDiscountPercent = Math.min(100, Math.max(0, Number(discountPercent) || 0));
    const discountAmount = Math.round((billedPrice * numDiscountPercent) / 100);
    const netTotal = Math.max(0, billedPrice - discountAmount);

    const enteredPaid = amountValue !== "" ? Number(amountValue) : (isLinkedPlan ? 0 : netTotal);
    const remainingBalanceDue = isLinkedPlan
        ? Math.max(0, remainingBalance - enteredPaid)
        : Math.max(0, netTotal - enteredPaid);

    const handlePriceChange = (newPrice: string) => {
        setPriceValue(newPrice);
        if (!isLinkedPlan && !isNewMultiSession) {
            const p = Number(newPrice) || 0;
            const pct = Math.min(100, Math.max(0, Number(discountPercent) || 0));
            const disc = Math.round((p * pct) / 100);
            const net = Math.max(0, p - disc);
            setAmountValue(String(net));
        }
    };

    const handleDiscountPercentChange = (newPctStr: string) => {
        setDiscountPercent(newPctStr);
        if (!isLinkedPlan && !isNewMultiSession) {
            const pct = newPctStr === "" ? 0 : Math.min(100, Math.max(0, Number(newPctStr) || 0));
            const disc = Math.round((billedPrice * pct) / 100);
            const net = Math.max(0, billedPrice - disc);
            setAmountValue(String(net));
        }
    };

    const handleConfirm = () => {
        const paid = Number(amountValue !== "" ? amountValue : (isLinkedPlan ? 0 : netTotal));

        onConfirm(paid, billedPrice, discountAmount, {
            paymentMethod,
            discountPercent: numDiscountPercent,
            packageCost: isNewMultiSession ? Number(packageCost || billedPrice) : undefined,
            totalSessions: isNewMultiSession ? Number(totalSessions || 4) : undefined,
            nextSessionDate: scheduleNextSession && nextSessionDate ? nextSessionDate : undefined,
            nextSessionTime: scheduleNextSession && nextSessionDate ? nextSessionTime : undefined,
            nextSessionFee: scheduleNextSession && nextSessionFee ? Number(nextSessionFee) : undefined,
            nextSessionLabel: scheduleNextSession && nextSessionLabel ? nextSessionLabel : undefined,
        });
    };

    const todayStr = new Date().toISOString().split("T")[0];

    return (
        <Dialog open={!!apt} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[480px] bg-white border-slate-200 text-slate-900 shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
                <DialogHeader>
                    <div className="mx-auto size-12 rounded-full bg-teal-50 border border-teal-100 flex items-center justify-center mb-2">
                        <CheckCircleOutlineOutlinedIcon className="size-6 text-teal-600" />
                    </div>
                    <DialogTitle className="text-center text-lg font-bold text-slate-900">Check Out Visit</DialogTitle>
                    <DialogDescription className="text-center text-slate-500">
                        Recording clinical visit & payment for <strong className="text-slate-900">{apt?.patient?.name}</strong>.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    {/* Multi-Session Linked Plan Ledger Card */}
                    {isLinkedPlan && apt?.patientTreatment && (
                        <div className="p-3.5 bg-teal-50/70 rounded-xl border border-teal-200/80 space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold uppercase tracking-wider text-teal-700 flex items-center gap-1.5">
                                    <AutoAwesomeOutlinedIcon className="size-3.5" /> Ongoing Treatment Plan
                                </span>
                                <span className="text-xs bg-teal-100 text-teal-800 px-2.5 py-0.5 rounded-full font-bold border border-teal-200">
                                    Session #{currentSessionNumber} (Ongoing)
                                </span>
                            </div>
                            <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                                <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-xs">
                                    <p className="text-[10px] text-slate-500 font-medium">Package Total</p>
                                    <p className="text-xs sm:text-sm font-bold text-slate-900">{formatPKR(existingTotalCost)}</p>
                                </div>
                                <div className="bg-emerald-50 p-2 rounded-lg border border-emerald-200 shadow-xs">
                                    <p className="text-[10px] text-emerald-700 font-medium">Paid So Far</p>
                                    <p className="text-xs sm:text-sm font-bold text-emerald-700">{formatPKR(existingPaid)}</p>
                                </div>
                                <div className="bg-amber-50 p-2 rounded-lg border border-amber-200 shadow-xs">
                                    <p className="text-[10px] text-amber-700 font-medium">Remaining</p>
                                    <p className="text-xs sm:text-sm font-bold text-amber-700">{formatPKR(remainingBalance)}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* New Multi-Session Treatment Initial Setup */}
                    {isNewMultiSession && (
                        <div className="p-3.5 bg-sky-50/70 rounded-xl border border-sky-200 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold uppercase tracking-wider text-sky-800 flex items-center gap-1.5">
                                    <AutoAwesomeOutlinedIcon className="size-3.5" /> Multi-Session Plan (Session 1)
                                </span>
                                <span className="text-xs bg-sky-100 text-sky-800 px-2 py-0.5 rounded-full font-semibold border border-sky-200">
                                    New Package
                                </span>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <Label className="text-[11px] font-bold text-slate-700">Agreed Package Fee (PKR) *</Label>
                                    <Input
                                        type="number"
                                        value={packageCost}
                                        onChange={(e) => setPackageCost(e.target.value)}
                                        min={0}
                                        placeholder="e.g. 130,000"
                                        className="bg-white border-slate-300 h-8 text-xs text-slate-900 font-bold focus:border-teal-600"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-[11px] font-semibold text-slate-700">Est. Visits (Optional)</Label>
                                    <Input
                                        type="number"
                                        value={totalSessions}
                                        onChange={(e) => setTotalSessions(e.target.value)}
                                        min={1}
                                        max={36}
                                        placeholder="Dynamic (12-24)"
                                        className="bg-white border-slate-300 h-8 text-xs text-slate-900 focus:border-teal-600"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Standard Treatment Details */}
                    {!isLinkedPlan && !isNewMultiSession && (
                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Treatment</p>
                            <p className="text-sm font-semibold text-slate-900">{apt?.treatment?.name}</p>
                            {!editablePrice && (
                                <p className="text-sm text-teal-700 font-bold">Price: {formatPKR(apt?.treatment?.price || 0)}</p>
                            )}
                        </div>
                    )}

                    {/* Single Visit Price / Discount (only for non-linked plans) */}
                    {!isLinkedPlan && !isNewMultiSession && (
                        <div className={editablePrice ? "grid grid-cols-2 gap-3" : "space-y-2"}>
                            {editablePrice && (
                                <div className="space-y-1.5">
                                    <Label htmlFor="checkout-price" className="text-slate-700 text-xs font-semibold">Billed Price</Label>
                                    <div className="relative">
                                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">Rs.</span>
                                        <Input
                                            id="checkout-price"
                                            type="number"
                                            value={priceValue}
                                            onChange={(e) => handlePriceChange(e.target.value)}
                                            min={0}
                                            className="bg-white border-slate-300 pl-8 h-9 text-sm text-slate-900 focus:border-teal-600"
                                        />
                                    </div>
                                </div>
                            )}
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="checkout-discount" className="text-slate-700 text-xs font-semibold">
                                        Discount (%)
                                    </Label>
                                    {numDiscountPercent > 0 && (
                                        <span className="text-[11px] font-bold text-teal-700">
                                            - {formatPKR(discountAmount)}
                                        </span>
                                    )}
                                </div>
                                <div className="relative">
                                    <Input
                                        id="checkout-discount"
                                        type="number"
                                        value={discountPercent}
                                        onChange={(e) => handleDiscountPercentChange(e.target.value)}
                                        className="bg-white border-slate-300 pr-8 h-9 text-sm text-slate-900 font-semibold focus:border-teal-600"
                                        min={0}
                                        max={100}
                                        step="any"
                                        placeholder="0"
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-teal-700 font-bold text-xs select-none pointer-events-none">
                                        %
                                    </span>
                                </div>
                                {/* Preset percentage buttons */}
                                <div className="flex items-center gap-1 pt-0.5 flex-wrap">
                                    {[0, 5, 10, 15, 20, 25].map((pct) => (
                                        <button
                                            key={pct}
                                            type="button"
                                            onClick={() => handleDiscountPercentChange(String(pct))}
                                            className={`text-[10px] font-bold px-2 py-0.5 rounded transition-all cursor-pointer ${
                                                Number(discountPercent) === pct
                                                    ? "bg-teal-600 text-white shadow-2xs"
                                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                            }`}
                                        >
                                            {pct === 0 ? "None" : `${pct}%`}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Amount Collected / Paid Today */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="checkout-amount" className="text-slate-800 text-xs font-bold">
                                {isMultiSession ? "Installment Paid Today (PKR)" : "Amount Collected (PKR)"}
                            </Label>
                            {isLinkedPlan && remainingBalance > 0 ? (
                                <button
                                    type="button"
                                    onClick={() => setAmountValue(String(remainingBalance))}
                                    className="text-[11px] text-teal-700 hover:text-teal-800 underline font-semibold cursor-pointer"
                                >
                                    Pay Full Balance ({formatPKR(remainingBalance)})
                                </button>
                            ) : !isLinkedPlan && !isNewMultiSession && netTotal > 0 && amountValue !== String(netTotal) ? (
                                <button
                                    type="button"
                                    onClick={() => setAmountValue(String(netTotal))}
                                    className="text-[11px] text-teal-700 hover:text-teal-800 underline font-semibold cursor-pointer"
                                >
                                    Match Net Total ({formatPKR(netTotal)})
                                </button>
                            ) : null}
                        </div>
                        <div className="relative">
                            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">Rs.</span>
                            <Input
                                id="checkout-amount"
                                type="number"
                                value={amountValue}
                                onChange={(e) => setAmountValue(e.target.value)}
                                min={0}
                                placeholder={isLinkedPlan ? "Enter installment amount..." : String(netTotal)}
                                className="bg-white border-slate-300 pl-8 h-10 text-sm text-slate-900 font-semibold focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20"
                                autoFocus
                            />
                        </div>

                        {/* Live Balance Summary */}
                        <div className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition-all ${remainingBalanceDue > 0
                            ? "bg-amber-50/90 border-amber-200 text-amber-950"
                            : "bg-emerald-50/80 border-emerald-200 text-emerald-900"
                            }`}>
                            <div className="flex items-center gap-1.5 font-bold">
                                {remainingBalanceDue > 0 ? (
                                    <>
                                        <span className="size-2 rounded-full bg-amber-500 animate-pulse" />
                                        <span>Remaining Balance Due:</span>
                                    </>
                                ) : (
                                    <>
                                        <CheckCircleOutlineOutlinedIcon className="size-4 text-emerald-600" />
                                        <span>Account Settled in Full</span>
                                    </>
                                )}
                            </div>
                            <span className={`font-black text-xs sm:text-sm ${remainingBalanceDue > 0 ? "text-amber-900" : "text-emerald-800"}`}>
                                {remainingBalanceDue > 0 ? formatPKR(remainingBalanceDue) : "Rs. 0 (Cleared)"}
                            </span>
                        </div>
                    </div>

                    {/* Payment Method Selector */}
                    <div className="space-y-1.5">
                        <Label className="text-slate-700 text-xs font-semibold">Payment Method</Label>
                        <PaymentMethodSelector value={paymentMethod} onChange={setPaymentMethod} />
                    </div>

                    {/* Next Session & Follow-up Scheduling Section */}
                    <div className="pt-3 border-t border-slate-200 space-y-3">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-slate-800 flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={scheduleNextSession}
                                    onChange={(e) => {
                                        setScheduleNextSession(e.target.checked);
                                        if (e.target.checked) {
                                            if (!nextSessionFee) {
                                                const defaultInstallment = remainingBalanceDue > 0 ? Math.min(5000, remainingBalanceDue) : 5000;
                                                setNextSessionFee(String(defaultInstallment));
                                            }
                                            if (!nextSessionLabel) {
                                                setNextSessionLabel(`Session #${currentSessionNumber + 1} - Follow-Up / Adjustment`);
                                            }
                                        }
                                    }}
                                    className="rounded border-slate-300 text-teal-600 focus:ring-teal-500/20 size-4 cursor-pointer"
                                />
                                <span>
                                    {isMultiSession
                                        ? `Schedule Session #${currentSessionNumber + 1} Adjustment Visit`
                                        : "Schedule Next Session / Follow-up Visit"}
                                </span>
                            </label>
                            {remainingBalanceDue > 0 ? (
                                <span className="text-[10px] bg-amber-100 text-amber-800 border border-amber-300 px-2 py-0.5 rounded-full font-bold">
                                    Balance Due · Recommended
                                </span>
                            ) : isMultiSession ? (
                                <span className="text-[10px] bg-teal-50 text-teal-700 border border-teal-200 px-2 py-0.5 rounded-full font-bold">
                                    Recommended
                                </span>
                            ) : (
                                <span className="text-[10px] bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 rounded-full font-semibold">
                                    Optional
                                </span>
                            )}
                        </div>

                        {scheduleNextSession && (
                            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 shadow-2xs">
                                <div className="grid grid-cols-2 gap-2.5">
                                    <div className="space-y-1">
                                        <Label className="text-[11px] font-bold text-slate-700">Next Session Date</Label>
                                        <DatePicker
                                            value={nextSessionDate}
                                            onChange={(val) => setNextSessionDate(val)}
                                            min={todayStr}
                                            placeholder="Select next visit date"
                                            disabledDays={(date) => date.getDay() === 0}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[11px] font-bold text-slate-700">Preferred Time Slot</Label>
                                        <Input
                                            type="time"
                                            value={nextSessionTime}
                                            onChange={(e) => setNextSessionTime(e.target.value)}
                                            className="bg-white border-slate-300 h-9 text-xs text-slate-900 focus:border-teal-600 rounded-lg"
                                        />
                                    </div>
                                </div>

                                {/* Next Appointment Planned Price / Expected Amount */}
                                <div className="space-y-1 pt-1 border-t border-slate-200/80">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-[11px] font-bold text-slate-800 flex items-center gap-1">
                                            <span>Next Session Expected Amount (PKR)</span>
                                            <span className="text-[10px] font-normal text-slate-400">(Optional)</span>
                                        </Label>
                                        {remainingBalanceDue > 0 && (
                                            <button
                                                type="button"
                                                onClick={() => setNextSessionFee(String(remainingBalanceDue))}
                                                className="text-[10px] text-teal-700 hover:text-teal-800 font-bold underline cursor-pointer"
                                            >
                                                Set Full Balance ({formatPKR(remainingBalanceDue)})
                                            </button>
                                        )}
                                    </div>
                                    <div className="relative">
                                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">Rs.</span>
                                        <Input
                                            type="number"
                                            value={nextSessionFee}
                                            onChange={(e) => setNextSessionFee(e.target.value)}
                                            min={0}
                                            placeholder={remainingBalanceDue > 0 ? String(remainingBalanceDue) : "e.g. 15000"}
                                            className="bg-white border-slate-300 pl-8 h-9 text-xs text-slate-900 font-bold focus:border-teal-600 rounded-lg"
                                        />
                                    </div>
                                    <p className="text-[10px] text-slate-500 font-medium">
                                        {remainingBalanceDue > 0
                                            ? `Amount expected to be collected at the next appointment to clear remaining balance.`
                                            : `Custom session installment or procedure fee for the subsequent visit.`}
                                    </p>
                                </div>

                                {/* Optional Stage / Session Label */}
                                <div className="space-y-1">
                                    <Label className="text-[11px] font-semibold text-slate-700">Next Stage / Follow-Up Note (Optional)</Label>
                                    <Input
                                        type="text"
                                        value={nextSessionLabel}
                                        onChange={(e) => setNextSessionLabel(e.target.value)}
                                        placeholder={isMultiSession ? `Session ${currentSessionNumber + 1} Follow-up` : "Follow-up & Balance Clearance"}
                                        className="bg-white border-slate-300 h-8 text-xs text-slate-900 focus:border-teal-600 rounded-lg"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter className="sm:justify-center gap-2 pt-3 border-t border-slate-200">
                    <Button variant="outline" onClick={onClose} className="border-slate-300 text-slate-700 hover:bg-slate-100 text-xs h-9">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        className="btn-brand border-0 px-6 h-9 text-xs font-semibold shadow-md shadow-teal-600/20"
                    >
                        {scheduleNextSession ? "Collect & Book Next Session" : "Confirm & Complete Visit"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
