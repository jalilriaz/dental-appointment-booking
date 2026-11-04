"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import {
    Loader2, History, CalendarDays, Activity, CheckCircle2,
    Sparkles, CreditCard, Banknote, Globe, Phone, FileText,
    Clock, AlertCircle, ChevronRight, Hash
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { formatPKR } from "@/lib/utils";

interface PatientHistory {
    patient: {
        id: string;
        name: string;
        email: string;
        phone: string;
        patientCode?: number | null;
        createdAt?: string;
    };
    plans?: {
        id: string;
        totalCost: number;
        totalSessions: number;
        clinicalStatus: string;
        financialStatus: string;
        totalPaid: number;
        remainingBalance: number;
        completedSessions: number;
        scheduledSessions: number;
        startDate: string;
        treatment: {
            id: string;
            name: string;
            price: number;
            durationMin: number;
        };
        payments: {
            id: string;
            amount: number;
            date: string;
            method: string;
            notes?: string;
        }[];
        appointments: {
            id: string;
            startTime: string;
            status: string;
            sessionNumber?: number | null;
            sessionLabel?: string | null;
            treatment: { name: string };
        }[];
    }[];
    appointments: {
        id: string;
        startTime: string;
        status: string;
        sessionNumber?: number | null;
        sessionLabel?: string | null;
        treatment: {
            name: string;
            price: number;
            durationMin: number;
        };
        clinicalNotes: any[];
    }[];
    allPayments?: {
        id: string;
        amount: number;
        date: string;
        method: string;
        notes?: string;
        appointment?: {
            treatment: { name: string };
            sessionLabel?: string | null;
        };
    }[];
    totalRevenueCollected?: number;
}

export default function PatientHistoryDialog({
    patientId,
    open,
    onOpenChange,
}: {
    patientId: string | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const [history, setHistory] = useState<PatientHistory | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<"plans" | "appointments" | "payments">("plans");

    useEffect(() => {
        if (!open || !patientId) {
            setHistory(null);
            setError(null);
            return;
        }

        const fetchHistory = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`/api/patients/${patientId}/history`);
                if (!res.ok) throw new Error("Failed to fetch patient history");
                const data = await res.json();
                setHistory(data);
                if (data.plans && data.plans.length > 0) {
                    setActiveTab("plans");
                } else {
                    setActiveTab("appointments");
                }
            } catch (err: any) {
                setError(err.message || "An error occurred");
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [open, patientId]);

    const completedVisits = history?.appointments.filter(a => a.status === "COMPLETED").length || 0;
    const activePlans = (history?.plans || []).filter(p => p.clinicalStatus === "IN_PROGRESS");
    const totalRevenue = history?.totalRevenueCollected ?? 0;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-3xl bg-white border-slate-200 text-slate-900 shadow-2xl max-h-[88vh] overflow-hidden flex flex-col p-0">
                {/* Header */}
                <DialogHeader className="p-5 border-b border-slate-200 bg-white shrink-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <div className="size-11 rounded-full bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 font-bold text-lg shrink-0">
                                {(history?.patient?.name || "P").charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <DialogTitle className="text-lg font-bold text-slate-900">
                                        {history?.patient?.name || "Patient Profile"}
                                    </DialogTitle>
                                    {history?.patient?.patientCode && (
                                        <span className="text-[11px] font-mono bg-teal-50 text-teal-700 border border-teal-200 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                                            <Hash className="size-3" /> {history.patient.patientCode}
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                                    {history?.patient?.phone && (
                                        <span className="flex items-center gap-1 text-slate-600 font-medium">
                                            <Phone className="size-3 text-slate-400" /> {history.patient.phone}
                                        </span>
                                    )}
                                    {history?.patient?.email && (
                                        <span className="truncate">{history.patient.email}</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Top Financial Stats */}
                        <div className="flex items-center gap-2">
                            <div className="px-3.5 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-right">
                                <p className="text-[10px] text-emerald-800 uppercase tracking-wider font-semibold">Total Revenue Collected</p>
                                <p className="text-sm font-bold text-emerald-700">{formatPKR(totalRevenue)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex items-center gap-2 pt-4 border-t border-slate-100 mt-3">
                        <button
                            onClick={() => setActiveTab("plans")}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                                activeTab === "plans"
                                    ? "bg-teal-600 text-white shadow-xs"
                                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                            }`}
                        >
                            <Sparkles className="size-3.5" />
                            Treatment Plans ({history?.plans?.length || 0})
                        </button>
                        <button
                            onClick={() => setActiveTab("appointments")}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                                activeTab === "appointments"
                                    ? "bg-teal-600 text-white shadow-xs"
                                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                            }`}
                        >
                            <CalendarDays className="size-3.5" />
                            Visits ({history?.appointments?.length || 0})
                        </button>
                        <button
                            onClick={() => setActiveTab("payments")}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                                activeTab === "payments"
                                    ? "bg-teal-600 text-white shadow-xs"
                                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                            }`}
                        >
                            <CreditCard className="size-3.5" />
                            Payment Ledger ({history?.allPayments?.length || 0})
                        </button>
                    </div>
                </DialogHeader>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar bg-slate-50/50">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-16 text-slate-500">
                            <Loader2 className="size-8 animate-spin mb-3 text-teal-600" />
                            <p className="text-sm font-medium">Loading clinical records & financial ledger...</p>
                        </div>
                    ) : error ? (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm text-center font-medium">
                            {error}
                        </div>
                    ) : history ? (
                        <>
                            {/* TAB 1: TREATMENT PLANS */}
                            {activeTab === "plans" && (
                                <div className="space-y-4">
                                    {(!history.plans || history.plans.length === 0) ? (
                                        <div className="text-center py-12 text-slate-500 text-sm bg-white rounded-xl border border-slate-200 shadow-xs">
                                            <Sparkles className="size-8 text-slate-300 mx-auto mb-2" />
                                            No multi-session treatment plans found for this patient.
                                        </div>
                                    ) : (
                                        history.plans.map((plan) => {
                                            const progressPct = Math.min(100, Math.round((plan.completedSessions / Math.max(1, plan.totalSessions)) * 100));
                                            const isPaid = plan.financialStatus === "FULLY_PAID" || plan.remainingBalance === 0;

                                            return (
                                                <div key={plan.id} className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3 hover:border-teal-400 transition-all">
                                                    {/* Plan Header */}
                                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <h4 className="text-base font-bold text-slate-900">{plan.treatment.name}</h4>
                                                                <Badge variant="outline" className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                                                                    plan.clinicalStatus === "COMPLETED"
                                                                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                                                        : "bg-blue-50 text-blue-700 border-blue-200"
                                                                }`}>
                                                                    {plan.clinicalStatus.replace("_", " ")}
                                                                </Badge>
                                                                <Badge variant="outline" className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                                                                    isPaid
                                                                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                                                        : "bg-amber-50 text-amber-800 border-amber-200"
                                                                }`}>
                                                                    {isPaid ? "Fully Paid" : "Partial Payment"}
                                                                </Badge>
                                                            </div>
                                                            <p className="text-xs text-slate-500 mt-0.5">
                                                                Started on {format(new Date(plan.startDate), "MMM d, yyyy")}
                                                            </p>
                                                        </div>

                                                        {/* Session Counter */}
                                                        <div className="text-right">
                                                            <span className="text-xs font-semibold text-teal-800 bg-teal-50 border border-teal-200 px-2.5 py-1 rounded-lg">
                                                                Session {plan.completedSessions} of {plan.totalSessions} Completed
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Progress Bar */}
                                                    <div className="space-y-1">
                                                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                                            <div
                                                                className="bg-gradient-to-r from-teal-600 to-emerald-500 h-full rounded-full transition-all duration-500"
                                                                style={{ width: `${progressPct}%` }}
                                                            />
                                                        </div>
                                                        <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                                                            <span>{progressPct}% Completed</span>
                                                            <span>{plan.totalSessions - plan.completedSessions} session{plan.totalSessions - plan.completedSessions !== 1 ? "s" : ""} remaining</span>
                                                        </div>
                                                    </div>

                                                    {/* Financial Breakdown */}
                                                    <div className="grid grid-cols-3 gap-2 p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-center">
                                                        <div>
                                                            <p className="text-[10px] text-slate-500 font-medium">Total Package</p>
                                                            <p className="text-xs sm:text-sm font-bold text-slate-900">{formatPKR(plan.totalCost)}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] text-emerald-700 font-medium">Total Paid</p>
                                                            <p className="text-xs sm:text-sm font-bold text-emerald-700">{formatPKR(plan.totalPaid)}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] text-amber-700 font-medium">Balance Due</p>
                                                            <p className="text-xs sm:text-sm font-bold text-amber-700">{formatPKR(plan.remainingBalance)}</p>
                                                        </div>
                                                    </div>

                                                    {/* Linked Sessions List */}
                                                    {plan.appointments && plan.appointments.length > 0 && (
                                                        <div className="space-y-1.5 pt-2 border-t border-slate-100">
                                                            <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Scheduled & Completed Sessions</p>
                                                            <div className="grid gap-1.5">
                                                                {plan.appointments.map((apt) => (
                                                                    <div key={apt.id} className="flex items-center justify-between text-xs py-1.5 px-3 bg-slate-50 rounded-lg border border-slate-200">
                                                                        <span className="font-semibold text-slate-800">
                                                                            {apt.sessionLabel || `Session ${apt.sessionNumber || "-"}`}
                                                                        </span>
                                                                        <div className="flex items-center gap-2">
                                                                            <span className="text-slate-500">
                                                                                {format(new Date(apt.startTime), "MMM d, yyyy h:mm a")}
                                                                            </span>
                                                                            <Badge variant="outline" className={`text-[9px] uppercase px-1.5 py-0 font-bold rounded ${
                                                                                apt.status === "COMPLETED" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                                                                                apt.status === "SCHEDULED" ? "bg-blue-50 text-blue-700 border-blue-200" :
                                                                                "bg-slate-100 text-slate-600 border-slate-200"
                                                                            }`}>
                                                                                {apt.status}
                                                                            </Badge>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            )}

                            {/* TAB 2: ALL VISITS */}
                            {activeTab === "appointments" && (
                                <div className="space-y-3">
                                    {history.appointments.length === 0 ? (
                                        <div className="text-center py-12 text-slate-500 text-sm bg-white rounded-xl border border-slate-200 shadow-xs">
                                            No appointments found for this patient.
                                        </div>
                                    ) : (
                                        <div className="space-y-3 relative border-l border-slate-200 ml-3 pl-5">
                                            {history.appointments.map((apt) => {
                                                const statusColor =
                                                    apt.status === "COMPLETED" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                                                    apt.status === "SCHEDULED" ? "bg-blue-50 text-blue-700 border-blue-200" :
                                                    apt.status === "CANCELLED" ? "bg-red-50 text-red-700 border-red-200" :
                                                    apt.status === "NO_SHOW" ? "bg-amber-50 text-amber-700 border-amber-200" :
                                                    "bg-slate-100 text-slate-600 border-slate-200";

                                                return (
                                                    <div key={apt.id} className="relative">
                                                        <div className={`absolute -left-[27px] top-2 size-3 rounded-full border-2 border-white shadow-xs ${apt.status === "COMPLETED" ? "bg-emerald-600" : "bg-slate-400"}`} />
                                                        <div className="bg-white border border-slate-200 shadow-xs rounded-xl p-3.5 space-y-1.5 hover:border-teal-400 transition-all">
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-2">
                                                                    <p className="font-bold text-slate-900">{apt.treatment.name}</p>
                                                                    {apt.sessionLabel && (
                                                                        <span className="bg-teal-50 text-teal-700 border border-teal-200 px-1.5 py-0.5 rounded text-[10px] font-bold">
                                                                            {apt.sessionLabel}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <Badge variant="outline" className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${statusColor}`}>
                                                                    {apt.status.replace("_", " ")}
                                                                </Badge>
                                                            </div>
                                                            <p className="text-xs text-slate-500 flex items-center gap-2">
                                                                <Clock className="size-3 text-slate-400" />
                                                                {format(new Date(apt.startTime), "EEEE, MMM d, yyyy · h:mm a")}
                                                            </p>
                                                            {apt.clinicalNotes && apt.clinicalNotes.length > 0 && (
                                                                <div className="mt-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200 space-y-1">
                                                                    <p><span className="text-slate-900 font-bold">Diagnosis/Work:</span> {apt.clinicalNotes[0].treatmentDone}</p>
                                                                    {apt.clinicalNotes[0].prescription && (
                                                                        <p><span className="text-slate-900 font-bold">Prescription:</span> {apt.clinicalNotes[0].prescription}</p>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* TAB 3: PAYMENT LEDGER */}
                            {activeTab === "payments" && (
                                <div className="space-y-3">
                                    {(!history.allPayments || history.allPayments.length === 0) ? (
                                        <div className="text-center py-12 text-slate-500 text-sm bg-white rounded-xl border border-slate-200 shadow-xs">
                                            <CreditCard className="size-8 text-slate-300 mx-auto mb-2" />
                                            No payments recorded for this patient yet.
                                        </div>
                                    ) : (
                                        <div className="divide-y divide-slate-100 bg-white border border-slate-200 shadow-xs rounded-xl overflow-hidden">
                                            {history.allPayments.map((payment) => (
                                                <div key={payment.id} className="p-3.5 flex items-center justify-between gap-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="size-9 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
                                                            {payment.method === "CASH" ? <Banknote className="size-4" /> : payment.method === "CARD" ? <CreditCard className="size-4" /> : <Globe className="size-4" />}
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <p className="text-xs font-bold text-slate-900">
                                                                    {payment.appointment?.treatment?.name || "Treatment Payment"}
                                                                </p>
                                                                {payment.appointment?.sessionLabel && (
                                                                    <span className="text-[10px] text-teal-700 font-bold bg-teal-50 border border-teal-200 px-1.5 py-0.2 rounded">
                                                                        {payment.appointment.sessionLabel}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <p className="text-[11px] text-slate-500 mt-0.5">
                                                                {format(new Date(payment.date), "MMM d, yyyy · h:mm a")} · <span className="uppercase font-semibold text-slate-700">{payment.method}</span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm font-bold text-emerald-700">{formatPKR(payment.amount)}</p>
                                                        <span className="text-[10px] text-emerald-600 font-semibold">Received</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </>
                    ) : null}
                </div>
            </DialogContent>
        </Dialog>
    );
}
