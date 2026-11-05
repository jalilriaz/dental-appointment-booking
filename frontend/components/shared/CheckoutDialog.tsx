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
    paymentMethod: "CASH" | "CARD" | "ONLINE";
    packageCost?: number;
    totalSessions?: number;
    nextSessionDate?: string;
    nextSessionTime?: string;
}

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
    onConfirm: (
        amountPaid: number,
        billedPrice: number,
        discount: number,
        options?: {
            paymentMethod?: "CASH" | "CARD" | "ONLINE";
            packageCost?: number;
            totalSessions?: number;
            nextSessionDate?: string;
            nextSessionTime?: string;
        }
    ) => void;
    amountValue: string;
    setAmountValue: (val: string) => void;
    discountValue?: string;
    setDiscountValue?: (val: string) => void;
    editablePrice?: boolean;
}) {
    const [internalDiscount, setInternalDiscount] = useState("0");
    const discountValue = controlledDiscount ?? internalDiscount;
    const setDiscountValue = controlledSetDiscount ?? setInternalDiscount;

    const [priceValue, setPriceValue] = useState<string>("");
    const [paymentMethod, setPaymentMethod] = useState<"CASH" | "CARD" | "ONLINE">("CASH");

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

    // Calculate existing plan balance if linked
    const existingTotalCost = apt?.patientTreatment?.totalCost || 0;
    const existingPaid = (apt?.patientTreatment?.payments || []).reduce((sum, p) => sum + p.amount, 0);
    const remainingBalance = Math.max(0, existingTotalCost - existingPaid);
    const currentSessionNumber = apt?.sessionNumber || (isLinkedPlan ? 2 : 1);
    const planTotalSessions = apt?.patientTreatment?.totalSessions || Number(totalSessions) || 1;

    useEffect(() => {
        if (apt) {
            const initialPrice = (apt.price && apt.price > 0) ? apt.price : (apt.treatment?.price || 0);
            setPriceValue(String(initialPrice));

            if (isLinkedPlan) {
                // For an ongoing plan, default "Paid Today" to 0 or remaining balance
                setAmountValue(String(remainingBalance > 0 ? "" : "0"));
            } else if (isNewMultiSession) {
                setPackageCost(String(initialPrice));
                setTotalSessions(String(apt.treatment?.defaultSessions || 4));
                setAmountValue(""); // Doctor/receptionist enters initial installment (e.g. 24,000)
            } else {
                setAmountValue(String(initialPrice));
            }

            setScheduleNextSession(false);
            setNextSessionDate("");
            setNextSessionTime("14:00");
        } else {
            setPriceValue("");
            setInternalDiscount("0");
            setScheduleNextSession(false);
        }
    }, [apt]);

    const billedPrice = editablePrice ? (Number(priceValue) || 0) : (apt?.treatment?.price || 0);
    const discount = Math.max(0, Number(discountValue) || 0);
    const netTotal = Math.max(0, billedPrice - discount);

    const handleConfirm = () => {
        const paid = Number(amountValue !== "" ? amountValue : (isLinkedPlan ? 0 : netTotal));

        onConfirm(paid, billedPrice, discount, {
            paymentMethod,
            packageCost: isNewMultiSession ? Number(packageCost || billedPrice) : undefined,
            totalSessions: isNewMultiSession ? Number(totalSessions || 4) : undefined,
            nextSessionDate: scheduleNextSession && nextSessionDate ? nextSessionDate : undefined,
            nextSessionTime: scheduleNextSession && nextSessionDate ? nextSessionTime : undefined,
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
                                <span className="text-xs bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full font-semibold border border-teal-200">
                                    Session {currentSessionNumber} of {planTotalSessions}
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
                                    <Label className="text-[11px] font-semibold text-slate-700">Total Package Price (PKR)</Label>
                                    <Input
                                        type="number"
                                        value={packageCost}
                                        onChange={(e) => setPackageCost(e.target.value)}
                                        min={0}
                                        placeholder="100,000"
                                        className="bg-white border-slate-300 h-8 text-xs text-slate-900 focus:border-teal-600"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-[11px] font-semibold text-slate-700">Total Est. Sessions</Label>
                                    <Input
                                        type="number"
                                        value={totalSessions}
                                        onChange={(e) => setTotalSessions(e.target.value)}
                                        min={1}
                                        max={24}
                                        placeholder="4"
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
                                            onChange={(e) => setPriceValue(e.target.value)}
                                            min={0}
                                            className="bg-white border-slate-300 pl-8 h-9 text-sm text-slate-900 focus:border-teal-600"
                                        />
                                    </div>
                                </div>
                            )}
                            <div className="space-y-1.5">
                                <Label htmlFor="checkout-discount" className="text-slate-700 text-xs font-semibold">Discount (PKR)</Label>
                                <div className="relative">
                                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">Rs.</span>
                                    <Input
                                        id="checkout-discount"
                                        type="number"
                                        value={discountValue}
                                        onChange={(e) => setDiscountValue(e.target.value)}
                                        className="bg-white border-slate-300 pl-8 h-9 text-sm text-slate-900 focus:border-teal-600"
                                        min={0}
                                        max={billedPrice}
                                    />
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
                            {isLinkedPlan && remainingBalance > 0 && (
                                <button
                                    type="button"
                                    onClick={() => setAmountValue(String(remainingBalance))}
                                    className="text-[11px] text-teal-700 hover:text-teal-800 underline font-semibold cursor-pointer"
                                >
                                    Pay Full Balance ({formatPKR(remainingBalance)})
                                </button>
                            )}
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
                    </div>

                    {/* Payment Method Selector */}
                    <div className="space-y-1.5">
                        <Label className="text-slate-700 text-xs font-semibold">Payment Method</Label>
                        <div className="grid grid-cols-3 gap-2">
                            <button
                                type="button"
                                onClick={() => setPaymentMethod("CASH")}
                                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                                    paymentMethod === "CASH"
                                        ? "bg-teal-600 border-teal-600 text-white shadow-sm"
                                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                }`}
                            >
                                <PaymentsOutlinedIcon className="size-3.5" /> Cash
                            </button>
                            <button
                                type="button"
                                onClick={() => setPaymentMethod("CARD")}
                                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                                    paymentMethod === "CARD"
                                        ? "bg-teal-600 border-teal-600 text-white shadow-sm"
                                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                }`}
                            >
                                <CreditCardOutlinedIcon className="size-3.5" /> Card / POS
                            </button>
                            <button
                                type="button"
                                onClick={() => setPaymentMethod("ONLINE")}
                                className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                                    paymentMethod === "ONLINE"
                                        ? "bg-teal-600 border-teal-600 text-white shadow-sm"
                                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                }`}
                            >
                                <LanguageOutlinedIcon className="size-3.5" /> Online / Bank
                            </button>
                        </div>
                    </div>

                    {/* Inline Next Session Scheduling Section */}
                    {isMultiSession && (
                        <div className="pt-2 border-t border-slate-200 space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-semibold text-slate-800 flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={scheduleNextSession}
                                        onChange={(e) => setScheduleNextSession(e.target.checked)}
                                        className="rounded border-slate-300 text-teal-600 focus:ring-teal-500/20 size-4 cursor-pointer"
                                    />
                                    <span>Schedule Session {currentSessionNumber + 1} Now</span>
                                </label>
                                <span className="text-[10px] bg-teal-50 text-teal-700 border border-teal-200 px-2 py-0.5 rounded-full font-bold">Recommended</span>
                            </div>

                            {scheduleNextSession && (
                                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                                    <div className="space-y-1">
                                        <Label className="text-[11px] font-semibold text-slate-700">Next Session Date</Label>
                                        <DatePicker
                                            value={nextSessionDate}
                                            onChange={(val) => setNextSessionDate(val)}
                                            min={todayStr}
                                            placeholder="Select next visit date"
                                            disabledDays={(date) => date.getDay() === 0}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[11px] font-semibold text-slate-700">Preferred Time Slot</Label>
                                        <Input
                                            type="time"
                                            value={nextSessionTime}
                                            onChange={(e) => setNextSessionTime(e.target.value)}
                                            className="bg-white border-slate-300 h-8 text-xs text-slate-900 focus:border-teal-600"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
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
