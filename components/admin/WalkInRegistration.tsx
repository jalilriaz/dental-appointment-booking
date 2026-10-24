"use client";

import { useState, useEffect, useCallback, FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
    UserPlus, Phone, CreditCard, User, Calendar, Clock,
    CalendarPlus, Search, Info, AlertTriangle, ShieldCheck, UserCheck, SearchX, MapPin, Building, Briefcase, Activity, Upload, Plus, History, LogOut, ChevronRight, Lock, Key, Moon, Sun, Monitor, Bell, Settings as SettingsIcon, Menu, FileText, ChevronDown, Check, Download, Mail, Filter, Pill, PlusCircle, CheckCircle, ClipboardList, MessageSquare, BadgeCheck, Syringe, Sparkles, Droplet, UserCog, Loader2,
    ChevronLeft, X, ShieldAlert, Stethoscope, AlertCircle, Copy, CheckCircle2
} from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";
import { TimeSlotSelector } from "@/components/ui/time-slot-selector";
import { formatDate, formatTime, isSunday } from "@/lib/utils";
import StatusBadge from "@/components/shared/StatusBadge";
import SundayWarning from "@/components/shared/SundayWarning";
import { PremiumLoader } from "@/components/ui/premium-loader";


import type { TreatmentOption, PatientResult } from "@/lib/types";

interface PatientHistory {
    patient: {
        id: string;
        name: string;
        phone: string | null;
        email: string | null;
    };
    appointments: {
        id: string;
        startTime: string;
        endTime: string;
        status: string;
        price: number;
        notes: string | null;
        treatment: { name: string; price: number; durationMin: number };
        clinicalNotes: {
            id: string;
            diagnosis: string | null;
            treatmentDone: string;
            prescription: string | null;
            remarks: string | null;
            createdAt: string;
        }[];
    }[];
}

interface BookingForm {
    date: string;
    time: string;
    treatmentId: string;
    notes: string;
}

interface NewPatientForm extends BookingForm {
    phone: string;
    cnic: string;
    fullName: string;
    age: string;
}

interface SuccessData {
    patientId: number | null;
    patientName: string;
    appointment: {
        id: string;
        date: string;
        time: string;
        serviceType: string;
        status: string;
    };
}

// ─── Helpers ────────────────────────────────────────────

// ─── Main Component ─────────────────────────────────────

export default function WalkInRegistration({ treatments }: { treatments: TreatmentOption[] }) {
    const [activeTab, setActiveTab] = useState<"registered" | "new">("registered");
    const [success, setSuccess] = useState<SuccessData | null>(null);
    const [copied, setCopied] = useState(false);

    const copyMRN = () => {
        if (success?.patientId) {
            navigator.clipboard.writeText(String(success.patientId));
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="relative">
            {/* ── Success Modal ── */}
            {success && (
                <SuccessModal
                    success={success}
                    onClose={() => setSuccess(null)}
                    onCopy={copyMRN}
                    copied={copied}
                />
            )}

            {/* ── Tab Headers ── */}
            <div className="flex gap-1 mb-6 bg-white/[0.03] p-1 rounded-xl border border-white/[0.06]">
                <button
                    onClick={() => setActiveTab("registered")}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-medium transition-all cursor-pointer ${activeTab === "registered"
                        ? "bg-gradient-to-r from-teal-500/20 to-emerald-500/20 text-teal-400 border border-teal-500/30 shadow-lg shadow-teal-500/10"
                        : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
                        }`}
                >
                    <Search className="size-4" />
                    Registered Patient
                </button>
                <button
                    onClick={() => setActiveTab("new")}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-medium transition-all cursor-pointer ${activeTab === "new"
                        ? "bg-gradient-to-r from-teal-500/20 to-emerald-500/20 text-teal-400 border border-teal-500/30 shadow-lg shadow-teal-500/10"
                        : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
                        }`}
                >
                    <UserPlus className="size-4" />
                    New Patient
                </button>
            </div>

            {/* ── Tab Content ── */}
            {activeTab === "registered" ? (
                <RegisteredPatientTab treatments={treatments} onSuccess={setSuccess} />
            ) : (
                <NewPatientTab treatments={treatments} onSuccess={setSuccess} />
            )}
        </div>
    );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TAB 1: REGISTERED PATIENT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function RegisteredPatientTab({ treatments, onSuccess }: {
    treatments: TreatmentOption[];
    onSuccess: (data: SuccessData) => void;
}) {
    const [searchQuery, setSearchQuery] = useState("");
    const [results, setResults] = useState<PatientResult[]>([]);
    const [searching, setSearching] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalPatients, setTotalPatients] = useState(0);
    const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
    const [history, setHistory] = useState<PatientHistory | null>(null);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [bookingForm, setBookingForm] = useState<BookingForm>({ date: "", time: "", treatmentId: "", notes: "" });
    const [booking, setBooking] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showBooking, setShowBooking] = useState(false);
    const router = useRouter();

    // Fetch patients (on mount + on search/page change)
    const fetchPatients = useCallback(async (q: string, page: number) => {
        setSearching(true);
        try {
            const params = new URLSearchParams({ page: String(page) });
            if (q.length >= 2) params.set("q", q);
            const res = await fetch(`/api/admin/walk-in/search?${params}`);
            const data = await res.json();
            setResults(data.patients || []);
            setTotalPages(data.totalPages || 1);
            setTotalPatients(data.total || 0);
        } catch {
            setResults([]);
        } finally {
            setSearching(false);
        }
    }, []);

    // Load on mount
    useEffect(() => {
        fetchPatients("", 1);
    }, [fetchPatients]);

    // Debounced search — resets to page 1
    useEffect(() => {
        const timer = setTimeout(() => {
            setCurrentPage(1);
            fetchPatients(searchQuery, 1);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery, fetchPatients]);

    // Page change
    const goToPage = (page: number) => {
        setCurrentPage(page);
        fetchPatients(searchQuery, page);
    };

    // Load patient history
    const loadHistory = async (patientId: string) => {
        setSelectedPatient(patientId);
        setLoadingHistory(true);
        setShowBooking(false);
        setError(null);
        try {
            const res = await fetch(`/api/patients/${patientId}/history`);
            const data = await res.json();
            setHistory(data);
        } catch {
            setHistory(null);
        } finally {
            setLoadingHistory(false);
        }
    };

    // Book appointment
    const handleBook = async (e: FormEvent) => {
        e.preventDefault();
        if (!selectedPatient) return;
        setBooking(true);
        setError(null);
        try {
            const res = await fetch("/api/admin/walk-in", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    patientId: selectedPatient,
                    date: bookingForm.date,
                    time: bookingForm.time,
                    treatmentId: bookingForm.treatmentId,
                    notes: bookingForm.notes || undefined,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to book");
            onSuccess(data);
            router.refresh();
            setBookingForm({ date: "", time: "", treatmentId: "", notes: "" });
            setShowBooking(false);
            setSelectedPatient(null);
            setHistory(null);
            setSearchQuery("");
            fetchPatients("", 1);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setBooking(false);
        }
    };

    const today = new Date().toISOString().split("T")[0];
    const selectedTreatment = treatments.find(t => t.id === bookingForm.treatmentId);



    return (
        <div className="relative space-y-4">
            {/* Search Bar */}
            <div className="glass-card rounded-xl p-4">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => { setSearchQuery(e.target.value); setSelectedPatient(null); setHistory(null); }}
                        placeholder="Search by patient name or phone number..."
                        className="w-full pl-11 pr-4 py-3 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/20 transition-all"
                    />
                    {searching && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-teal-400 animate-spin" />}
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 flex items-start gap-3">
                    <AlertCircle className="size-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-300">{error}</p>
                    <button onClick={() => setError(null)} className="ml-auto text-red-400/60 hover:text-red-300"><X className="size-4" /></button>
                </div>
            )}

            {/* Patient List (always visible when no patient selected) */}
            {!selectedPatient && !loadingHistory && (
                <div className="glass-card rounded-xl overflow-hidden">
                    <div className="px-5 py-3 border-b border-white/[0.06] flex items-center justify-between">
                        <p className="text-xs text-slate-400 font-medium">
                            {totalPatients} registered patient{totalPatients !== 1 ? "s" : ""}
                            {searchQuery.length >= 2 && <span className="text-teal-400"> matching &quot;{searchQuery}&quot;</span>}
                        </p>
                        {totalPages > 1 && (
                            <p className="text-xs text-slate-500">Page {currentPage} of {totalPages}</p>
                        )}
                    </div>
                    {results.length === 0 ? (
                        <div className="p-8 text-center">
                            <User className="size-10 text-slate-600 mx-auto mb-3" />
                            <h3 className="text-sm font-medium text-white">
                                {searchQuery.length >= 2 ? "No patients found" : "No registered patients"}
                            </h3>
                            <p className="text-xs text-slate-400 mt-1">
                                {searchQuery.length >= 2
                                    ? "Try a different name or phone number, or register as a new patient."
                                    : "Register your first walk-in patient using the New Patient tab."}
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="divide-y divide-white/[0.04]">
                                {results.map(p => (
                                    <button
                                        key={p.id}
                                        onClick={() => loadHistory(p.id)}
                                        className="w-full flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3 sm:py-4 hover:bg-white/[0.03] transition-all text-left group cursor-pointer"
                                    >
                                        <div className="size-11 rounded-full bg-teal-500/15 flex items-center justify-center text-teal-400 font-bold text-sm border-2 border-teal-500/20 group-hover:border-teal-400/40 transition-all shrink-0">
                                            {(p.name || "P").charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="font-medium text-white group-hover:text-teal-400 transition-all truncate">{p.name}</p>
                                                {p.patientCode && (
                                                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-teal-500/15 text-teal-400 border border-teal-500/20 shrink-0">
                                                        ID: {p.patientCode}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-slate-500 mt-0.5">
                                                {p.phone && <span className="flex items-center gap-1"><Phone className="size-3" />{p.phone}</span>}
                                                <span>{p._count.appointments} visit{p._count.appointments !== 1 ? "s" : ""}</span>
                                                {p.appointments[0] && (
                                                    <span className="hidden sm:inline">Last: {formatDate(p.appointments[0].startTime, "short")}</span>
                                                )}
                                            </div>
                                        </div>
                                        {p.medicalAlerts && (
                                            <div className="p-1.5 rounded-lg bg-red-500/15 shrink-0" title={p.medicalAlerts}>
                                                <ShieldAlert className="size-4 text-red-400" />
                                            </div>
                                        )}
                                        <ChevronRight className="size-4 text-slate-600 group-hover:text-teal-400 transition-all shrink-0" />
                                    </button>
                                ))}
                            </div>
                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-between px-5 py-3 border-t border-white/[0.06] bg-white/[0.02]">
                                    <button
                                        onClick={() => goToPage(currentPage - 1)}
                                        disabled={currentPage <= 1}
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/[0.08] text-xs text-slate-300 hover:bg-white/[0.04] disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                                    >
                                        <ChevronLeft className="size-3.5" /> Previous
                                    </button>
                                    <div className="flex gap-1">
                                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                            let pageNum: number;
                                            if (totalPages <= 5) {
                                                pageNum = i + 1;
                                            } else if (currentPage <= 3) {
                                                pageNum = i + 1;
                                            } else if (currentPage >= totalPages - 2) {
                                                pageNum = totalPages - 4 + i;
                                            } else {
                                                pageNum = currentPage - 2 + i;
                                            }
                                            return (
                                                <button
                                                    key={pageNum}
                                                    onClick={() => goToPage(pageNum)}
                                                    className={`size-8 rounded-lg text-xs font-medium transition-all cursor-pointer ${currentPage === pageNum
                                                        ? "bg-teal-500/20 text-teal-400 border border-teal-500/30"
                                                        : "text-slate-400 hover:bg-white/[0.04] hover:text-white"
                                                        }`}
                                                >
                                                    {pageNum}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <button
                                        onClick={() => goToPage(currentPage + 1)}
                                        disabled={currentPage >= totalPages}
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/[0.08] text-xs text-slate-300 hover:bg-white/[0.04] disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                                    >
                                        Next <ChevronRight className="size-3.5" />
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}

            {/* Loading History */}
            {loadingHistory && (
                <div className="glass-card rounded-xl p-12 text-center">
                    <Loader2 className="size-8 text-teal-400 animate-spin mx-auto mb-3" />
                    <p className="text-sm text-slate-400">Loading patient records...</p>
                </div>
            )}

            {/* ── Selected Patient: History + Book ── */}
            {history && !loadingHistory && (
                <div className="space-y-4">
                    {/* Patient Header */}
                    <div className="glass-card rounded-xl p-4 sm:p-5">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                                <div className="size-11 sm:size-14 rounded-full bg-teal-500/15 flex items-center justify-center text-teal-400 font-bold text-lg sm:text-xl border-4 border-teal-500/20 shrink-0">
                                    {(history.patient.name || "P").charAt(0).toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                    <h3 className="text-base sm:text-lg font-bold text-white truncate">{history.patient.name}</h3>
                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-slate-500 mt-1">
                                        {history.patient.phone && <span className="flex items-center gap-1"><Phone className="size-3" />{history.patient.phone}</span>}
                                        {history.patient.email && <span className="truncate">{history.patient.email}</span>}
                                    </div>
                                    <p className="text-xs text-slate-500 mt-0.5">{history.appointments.length} appointment{history.appointments.length !== 1 ? "s" : ""} on record</p>
                                </div>
                            </div>
                            <div className="flex gap-2 self-end sm:self-auto shrink-0">
                                <button
                                    onClick={() => setShowBooking(!showBooking)}
                                    className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-gradient-to-r from-teal-500 to-emerald-500 text-white text-xs sm:text-sm font-semibold hover:from-teal-400 hover:to-emerald-400 transition-all shadow-lg shadow-teal-500/20"
                                >
                                    <CalendarPlus className="size-4" />
                                    Book Appointment
                                </button>
                                <button
                                    onClick={() => { setSelectedPatient(null); setHistory(null); setShowBooking(false); }}
                                    className="p-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-slate-400 hover:text-white hover:bg-white/[0.08] transition-all"
                                >
                                    <X className="size-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* ── Inline Booking Form ── */}
                    {showBooking && (
                        <div className="glass-card rounded-xl overflow-hidden border-2 border-teal-500/20">
                            <div className="px-5 py-4 border-b border-white/[0.06] bg-teal-500/5">
                                <h4 className="text-sm font-semibold text-teal-400 flex items-center gap-2">
                                    <CalendarPlus className="size-4" /> New Appointment for {history.patient.name}
                                </h4>
                            </div>
                            <form onSubmit={handleBook} className="p-5 space-y-4">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-slate-300 flex items-center gap-1.5">
                                            <Calendar className="size-3.5 text-teal-400" /> Date <span className="text-red-400">*</span>
                                        </label>
                                        <DatePicker
                                            value={bookingForm.date}
                                            onChange={(val) => setBookingForm(p => ({ ...p, date: val, time: "" }))}
                                            min={today}
                                            placeholder="Select appointment date"
                                            disabledDays={(date) => date.getDay() === 0}
                                        />
                                        {bookingForm.date && isSunday(bookingForm.date) && <SundayWarning />}
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-slate-300 flex items-center gap-1.5">
                                            <Stethoscope className="size-3.5 text-emerald-400" /> Treatment <span className="text-red-400">*</span>
                                        </label>
                                        <select value={bookingForm.treatmentId} onChange={e => setBookingForm(p => ({ ...p, treatmentId: e.target.value, time: "" }))} required
                                            className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-white focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/20 transition-all appearance-none cursor-pointer [color-scheme:dark]">
                                            <option value="" className="bg-slate-900 text-slate-400">Select treatment...</option>
                                            {treatments.map(t => (
                                                <option key={t.id} value={t.id} className="bg-slate-900 text-white">{t.name} — Rs. {t.price.toLocaleString()}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300 flex items-center gap-1.5">
                                        <Clock className="size-3.5 text-blue-400" /> Available Time Slots <span className="text-red-400">*</span>
                                    </label>
                                    <TimeSlotSelector
                                        date={bookingForm.date}
                                        treatmentId={bookingForm.treatmentId}
                                        value={bookingForm.time}
                                        onChange={(val) => setBookingForm(p => ({ ...p, time: val }))}
                                    />
                                    <input type="text" name="time" value={bookingForm.time} required className="sr-only" readOnly tabIndex={-1} />
                                </div>
                                {selectedTreatment && (
                                    <div className="flex items-center gap-3 text-xs text-slate-400 bg-white/[0.03] rounded-lg px-4 py-2.5">
                                        <span>⏱ {selectedTreatment.durationMin} min</span>
                                        <span className="text-white/10">|</span>
                                        <span className="text-teal-400 font-semibold">Rs. {selectedTreatment.price.toLocaleString()}</span>
                                    </div>
                                )}
                                <textarea placeholder="Notes (optional)" value={bookingForm.notes} onChange={e => setBookingForm(p => ({ ...p, notes: e.target.value }))} rows={2}
                                    className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/20 transition-all resize-none" />
                                <button type="submit" disabled={booking || isSunday(bookingForm.date)}
                                    className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-semibold hover:from-teal-400 hover:to-emerald-400 transition-all shadow-lg shadow-teal-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                                    {booking ? <><Loader2 className="size-5 animate-spin" />Booking...</> : <><CalendarPlus className="size-5" />Confirm Appointment</>}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* ── Treatment History ── */}
                    <div className="glass-card rounded-xl overflow-hidden">
                        <div className="px-5 py-4 border-b border-white/[0.06]">
                            <h4 className="text-sm font-semibold text-white">Treatment History</h4>
                            <p className="text-xs text-slate-500 mt-0.5">Past appointments with clinical notes</p>
                        </div>
                        {history.appointments.length === 0 ? (
                            <div className="p-8 text-center">
                                <ClipboardList className="size-10 text-slate-600 mx-auto mb-3" />
                                <p className="text-sm text-slate-400">No medical history yet</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-white/[0.04]">
                                {history.appointments.map(apt => (
                                    <div key={apt.id} className="px-4 sm:px-5 py-3 sm:py-4">
                                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-0">
                                            <div className="flex items-center gap-3">
                                                <div className="size-10 rounded-lg bg-white/[0.04] flex items-center justify-center shrink-0">
                                                    <Stethoscope className="size-4 text-teal-400" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-white text-sm">{apt.treatment.name}</p>
                                                    <p className="text-xs text-slate-500 mt-0.5">
                                                        {formatDate(apt.startTime, "short")}
                                                        {" · "}
                                                        {formatTime(apt.startTime)}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 ml-13 sm:ml-0">
                                                <span className="text-sm font-semibold text-teal-400">Rs. {apt.price.toLocaleString()}</span>
                                                <StatusBadge status={apt.status} />
                                            </div>
                                        </div>
                                        {/* Clinical Notes */}
                                        {apt.clinicalNotes.length > 0 && (
                                            <div className="mt-3 ml-13 pl-4 border-l-2 border-teal-500/20 space-y-2">
                                                {apt.clinicalNotes.map(note => (
                                                    <div key={note.id} className="grid sm:grid-cols-2 gap-2 text-xs">
                                                        {note.diagnosis && (
                                                            <div className="flex items-start gap-1.5">
                                                                <Stethoscope className="size-3.5 text-blue-400 mt-0.5 shrink-0" />
                                                                <span><span className="font-semibold text-slate-400">Diagnosis:</span> <span className="text-slate-300">{note.diagnosis}</span></span>
                                                            </div>
                                                        )}
                                                        <div className="flex items-start gap-1.5">
                                                            <ClipboardList className="size-3.5 text-teal-400 mt-0.5 shrink-0" />
                                                            <span><span className="font-semibold text-slate-400">Treatment:</span> <span className="text-slate-300">{note.treatmentDone}</span></span>
                                                        </div>
                                                        {note.prescription && (
                                                            <div className="flex items-start gap-1.5">
                                                                <Pill className="size-3.5 text-purple-400 mt-0.5 shrink-0" />
                                                                <span><span className="font-semibold text-slate-400">Rx:</span> <span className="text-slate-300">{note.prescription}</span></span>
                                                            </div>
                                                        )}
                                                        {note.remarks && (
                                                            <div className="flex items-start gap-1.5">
                                                                <MessageSquare className="size-3.5 text-amber-400 mt-0.5 shrink-0" />
                                                                <span><span className="font-semibold text-slate-400">Notes:</span> <span className="text-slate-300">{note.remarks}</span></span>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
            {booking && <PremiumLoader text="Processing Booking..." variant="inline" />}
        </div>
    );
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TAB 2: NEW PATIENT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const initialNew: NewPatientForm = { phone: "", cnic: "", fullName: "", age: "", date: "", time: "", treatmentId: "", notes: "" };

function NewPatientTab({ treatments, onSuccess }: {
    treatments: TreatmentOption[];
    onSuccess: (data: SuccessData) => void;
}) {
    const [formData, setFormData] = useState<NewPatientForm>(initialNew);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const selectedTreatment = treatments.find(t => t.id === formData.treatmentId);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        let name = e.target.name;
        let value = e.target.value;

        if (name === "phone" || name === "age") {
            value = value.replace(/[^0-9]/g, "");
        } else if (name === "cnic") {
            value = value.replace(/[^0-9-]/g, "");
        } else if (name === "fullName") {
            value = value.replace(/[0-9]/g, "");
        }

        setFormData(prev => ({ ...prev, [name]: value }));
        if (error) setError(null);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/admin/walk-in", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    phone: formData.phone,
                    cnic: formData.cnic || undefined,
                    fullName: formData.fullName,
                    age: parseInt(formData.age),
                    date: formData.date,
                    time: formData.time,
                    treatmentId: formData.treatmentId,
                    notes: formData.notes || undefined,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to register walk-in patient");
            onSuccess(data);
            router.refresh();
            setFormData(initialNew);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const today = new Date().toISOString().split("T")[0];

    return (
        <div className="glass-card rounded-2xl overflow-hidden relative">
            <div className="relative px-6 py-5 border-b border-white/[0.06] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500/5 to-transparent" />
                <div className="relative flex items-center gap-3">
                    <div className="size-10 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-teal-500/20">
                        <UserPlus className="size-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-white">New Patient Registration</h2>
                        <p className="text-xs text-slate-400">Register a new walk-in patient and book their appointment</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 flex items-start gap-3">
                        <AlertCircle className="size-5 text-red-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium text-red-300">Registration Failed</p>
                            <p className="text-xs text-red-400/80 mt-0.5">{error}</p>
                        </div>
                        <button type="button" onClick={() => setError(null)} className="ml-auto text-red-400/60 hover:text-red-300"><X className="size-4" /></button>
                    </div>
                )}

                {/* Patient Information */}
                <div>
                    <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold mb-4 flex items-center gap-2">
                        <User className="size-3.5" /> Patient Information
                    </p>
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label htmlFor="new-phone" className="text-sm font-medium text-slate-300 flex items-center gap-1.5">
                                <Phone className="size-3.5 text-teal-400" /> Phone Number <span className="text-red-400">*</span>
                            </label>
                            <input id="new-phone" type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="03001234567" required
                                className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/20 transition-all" />
                        </div>
                        <div className="space-y-1.5">
                            <label htmlFor="new-cnic" className="text-sm font-medium text-slate-300 flex items-center gap-1.5">
                                <CreditCard className="size-3.5 text-blue-400" /> CNIC <span className="text-slate-600 text-xs">(Optional)</span>
                            </label>
                            <input id="new-cnic" type="text" name="cnic" value={formData.cnic} onChange={handleChange} placeholder="12345-1234567-1"
                                className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/20 transition-all" />
                        </div>
                        <div className="space-y-1.5">
                            <label htmlFor="new-name" className="text-sm font-medium text-slate-300 flex items-center gap-1.5">
                                <User className="size-3.5 text-purple-400" /> Full Name <span className="text-red-400">*</span>
                            </label>
                            <input id="new-name" type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Muhammad Ahmed" required
                                className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/20 transition-all" />
                        </div>
                        <div className="space-y-1.5">
                            <label htmlFor="new-age" className="text-sm font-medium text-slate-300 flex items-center gap-1.5">
                                <User className="size-3.5 text-amber-400" /> Age <span className="text-red-400">*</span>
                            </label>
                            <input id="new-age" type="number" name="age" value={formData.age} onChange={handleChange} placeholder="28" min="1" max="150" required
                                onKeyDown={(e) => { if (['e', 'E', '+', '-'].includes(e.key)) e.preventDefault() }}
                                className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/20 transition-all" />
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/[0.06]" />

                {/* Appointment Details */}
                <div>
                    <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold mb-4 flex items-center gap-2">
                        <Calendar className="size-3.5" /> Appointment Details
                    </p>
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label htmlFor="new-date" className="text-sm font-medium text-slate-300 flex items-center gap-1.5">
                                <Calendar className="size-3.5 text-teal-400" /> Date <span className="text-red-400">*</span>
                            </label>
                            <DatePicker
                                value={formData.date}
                                onChange={(val) => setFormData(prev => ({ ...prev, date: val, time: "" }))}
                                min={today}
                                placeholder="Select appointment date"
                                disabledDays={(date) => date.getDay() === 0}
                            />
                            {formData.date && isSunday(formData.date) && <SundayWarning />}
                        </div>
                        <div className="space-y-1.5">
                            <label htmlFor="new-treatment" className="text-sm font-medium text-slate-300 flex items-center gap-1.5">
                                <Stethoscope className="size-3.5 text-emerald-400" /> Treatment <span className="text-red-400">*</span>
                            </label>
                            <select id="new-treatment" name="treatmentId" value={formData.treatmentId} onChange={(e) => setFormData(prev => ({ ...prev, treatmentId: e.target.value, time: "" }))} required
                                className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-white focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/20 transition-all appearance-none cursor-pointer [color-scheme:dark]">
                                <option value="" className="bg-slate-900 text-slate-400">Select treatment...</option>
                                {treatments.map(t => (
                                    <option key={t.id} value={t.id} className="bg-slate-900 text-white">{t.name} — Rs. {t.price.toLocaleString()}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="space-y-2 mt-4">
                        <label className="text-sm font-medium text-slate-300 flex items-center gap-1.5">
                            <Clock className="size-3.5 text-blue-400" /> Available Time Slots <span className="text-red-400">*</span>
                        </label>
                        <TimeSlotSelector
                            date={formData.date}
                            treatmentId={formData.treatmentId}
                            value={formData.time}
                            onChange={(val) => setFormData(prev => ({ ...prev, time: val }))}
                        />
                        <input type="text" name="time" value={formData.time} required className="sr-only" readOnly tabIndex={-1} />
                    </div>
                    {selectedTreatment && (
                        <div className="mt-3 flex items-center gap-3 text-xs text-slate-400 bg-white/[0.03] rounded-lg px-4 py-2.5">
                            <span>⏱ {selectedTreatment.durationMin} min</span>
                            <span className="text-white/10">|</span>
                            <span className="text-teal-400 font-semibold">Rs. {selectedTreatment.price.toLocaleString()}</span>
                        </div>
                    )}
                    <div className="mt-4 space-y-1.5">
                        <label htmlFor="new-notes" className="text-sm font-medium text-slate-300">Notes <span className="text-slate-600 text-xs">(Optional)</span></label>
                        <textarea id="new-notes" name="notes" value={formData.notes} onChange={handleChange} rows={2} placeholder="Any notes for this visit..."
                            className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/20 transition-all resize-none" />
                    </div>
                </div>

                <button type="submit" disabled={loading || isSunday(formData.date)}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-semibold hover:from-teal-400 hover:to-emerald-400 transition-all shadow-lg shadow-teal-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                    {loading ? <><Loader2 className="size-5 animate-spin" />Processing...</> : <><UserPlus className="size-5" />Register &amp; Book Appointment</>}
                </button>
            </form>
            {loading && <PremiumLoader text="Processing Registration & Booking..." variant="inline" />}
        </div>
    );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SUCCESS MODAL
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function SuccessModal({ success, onClose, onCopy, copied }: {
    success: SuccessData;
    onClose: () => void;
    onCopy: () => void;
    copied: boolean;
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="relative w-full max-w-md animate-fade-in-up">
                <button onClick={onClose}
                    className="absolute -top-2 -right-2 z-10 size-8 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-all">
                    <X className="size-4" />
                </button>
                <div className="bg-gradient-to-b from-slate-900 to-slate-950 rounded-2xl border border-white/10 overflow-hidden shadow-2xl shadow-teal-500/10">
                    <div className="relative px-6 pt-8 pb-6 text-center overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 to-transparent" />
                        <div className="relative">
                            <div className="mx-auto size-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mb-4">
                                <CheckCircle2 className="size-8 text-emerald-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white">Appointment Booked!</h3>
                            <p className="text-sm text-slate-400 mt-1">{success.patientName}</p>
                        </div>
                    </div>

                    {/* MRN (only for new patients) */}
                    {success.patientId && (
                        <>
                            <div className="px-6 pb-4">
                                <div className="bg-gradient-to-br from-teal-500/10 to-emerald-500/5 border-2 border-dashed border-teal-500/40 rounded-xl p-6 text-center">
                                    <p className="text-xs uppercase tracking-widest text-teal-400/80 font-semibold mb-2">Medical Record Number (MRN)</p>
                                    <div className="flex items-center justify-center gap-3">
                                        <span className="text-5xl font-black text-white tracking-wider font-mono">{success.patientId}</span>
                                        <button onClick={onCopy} className="size-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-teal-400 hover:border-teal-500/30 transition-all" title="Copy MRN">
                                            {copied ? <BadgeCheck className="size-5 text-emerald-400" /> : <Copy className="size-5" />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="mx-6 mb-4 bg-amber-500/10 border border-amber-500/20 rounded-lg px-4 py-3">
                                <div className="flex gap-2">
                                    <AlertCircle className="size-5 text-amber-400 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-semibold text-amber-300">Important</p>
                                        <p className="text-xs text-amber-400/80 mt-0.5">
                                            Write this MRN <span className="font-bold text-amber-300">({success.patientId})</span> on the patient&apos;s physical card for their next visit.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Appointment Details */}
                    <div className="px-6 pb-6">
                        <div className="bg-white/[0.03] rounded-lg p-4 space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-500">Service</span>
                                <span className="text-slate-200 font-medium">{success.appointment.serviceType}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Date</span>
                                <span className="text-slate-200 font-medium">
                                    {new Date(success.appointment.date).toLocaleDateString("en-PK", { weekday: "short", year: "numeric", month: "short", day: "numeric" })}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Time</span>
                                <span className="text-slate-200 font-medium">
                                    {(() => {
                                        if (!success.appointment.time) return "";
                                        const [h, m] = success.appointment.time.split(":");
                                        const dateObj = new Date();
                                        dateObj.setHours(parseInt(h, 10), parseInt(m, 10));
                                        return dateObj.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
                                    })()}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Status</span>
                                <span className="text-emerald-400 font-medium">{success.appointment.status}</span>
                            </div>
                        </div>
                    </div>

                    <div className="px-6 pb-6">
                        <button onClick={onClose}
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-semibold hover:from-teal-400 hover:to-emerald-400 transition-all shadow-lg shadow-teal-500/20">
                            Done
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
