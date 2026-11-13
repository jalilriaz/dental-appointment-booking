"use client";

import { useState, useEffect, useCallback, FormEvent, useMemo } from "react";
import { useRouter } from "next/navigation";
import { fetchApi } from "@/lib/api-client";

// Material UI Icons (100% SVG, Zero Emojis)
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import ChevronLeftOutlinedIcon from "@mui/icons-material/ChevronLeftOutlined";
import MedicationOutlinedIcon from "@mui/icons-material/MedicationOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import AutorenewOutlinedIcon from "@mui/icons-material/AutorenewOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import MedicalServicesOutlinedIcon from "@mui/icons-material/MedicalServicesOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import ChairOutlinedIcon from "@mui/icons-material/ChairOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import FilterListOutlinedIcon from "@mui/icons-material/FilterListOutlined";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";

import { DatePicker } from "@/components/ui/date-picker";
import { TimeSlotSelector } from "@/components/ui/time-slot-selector";
import type { DoctorOption } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDate, formatTime, isSunday, formatPKR } from "@/lib/utils";
import StatusBadge from "@/components/shared/StatusBadge";
import SundayWarning from "@/components/shared/SundayWarning";
import { PremiumLoader } from "@/components/ui/premium-loader";

import type { TreatmentOption, PatientResult } from "@/lib/types";

// ─── Interfaces ─────────────────────────────────────────

interface PatientHistory {
    patient: {
        id: string;
        name: string;
        phone: string | null;
        email: string | null;
        patientCode?: number | null;
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
        treatment: { id: string; name: string; price: number };
    }[];
    appointments: {
        id: string;
        startTime: string;
        endTime: string;
        status: string;
        price: number;
        notes: string | null;
        sessionNumber?: number | null;
        sessionLabel?: string | null;
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
    patientTreatmentId?: string;
    doctorId?: string;
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

// ─── Main Orchestrator ──────────────────────────────────

export default function WalkInRegistration({
    treatments,
    doctors = [],
}: {
    treatments: TreatmentOption[];
    doctors?: DoctorOption[];
}) {
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
        <div className="relative font-sans space-y-6">
            {/* Success Modal Confirmation */}
            {success && (
                <SuccessModal
                    success={success}
                    onClose={() => setSuccess(null)}
                    onCopy={copyMRN}
                    copied={copied}
                />
            )}

            {/* Segmented Mode Switcher (Tactile Clinical Pill Bar) */}
            <div className="bg-white p-1.5 rounded-2xl border border-slate-200/90 shadow-2xs inline-flex w-full sm:w-auto">
                <div className="grid grid-cols-2 gap-1.5 w-full sm:w-auto">
                    <button
                        type="button"
                        onClick={() => setActiveTab("registered")}
                        className={`flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                            activeTab === "registered"
                                ? "bg-teal-600 text-white shadow-xs"
                                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                        }`}
                    >
                        <SearchOutlinedIcon sx={{ fontSize: 18 }} />
                        <span>Registered Patient Lookup</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab("new")}
                        className={`flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
                            activeTab === "new"
                                ? "bg-teal-600 text-white shadow-xs"
                                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                        }`}
                    >
                        <PersonAddOutlinedIcon sx={{ fontSize: 18 }} />
                        <span>+ Register New Walk-In</span>
                    </button>
                </div>
            </div>

            {/* Tab Workspace */}
            {activeTab === "registered" ? (
                <RegisteredPatientWorkspace treatments={treatments} doctors={doctors} onSuccess={setSuccess} />
            ) : (
                <NewPatientIntake treatments={treatments} doctors={doctors} onSuccess={setSuccess} />
            )}
        </div>
    );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TAB 1: REGISTERED PATIENT — MASTER-DETAIL WORKSPACE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function RegisteredPatientWorkspace({
    treatments,
    doctors = [],
    onSuccess,
}: {
    treatments: TreatmentOption[];
    doctors?: DoctorOption[];
    onSuccess: (data: SuccessData) => void;
}) {
    const [searchQuery, setSearchQuery] = useState("");
    const [results, setResults] = useState<PatientResult[]>([]);
    const [searching, setSearching] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalPatients, setTotalPatients] = useState(0);

    // Active Selection State
    const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
    const [history, setHistory] = useState<PatientHistory | null>(null);
    const [loadingHistory, setLoadingHistory] = useState(false);

    // Booking State
    const [bookingForm, setBookingForm] = useState<BookingForm>({
        date: "",
        time: "",
        treatmentId: "",
        notes: "",
        doctorId: doctors[0]?.id || "",
    });
    const [booking, setBooking] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeDetailTab, setActiveDetailTab] = useState<"book" | "history">("book");
    const router = useRouter();

    // Fetch patient directory
    const fetchPatients = useCallback(async (q: string, page: number) => {
        setSearching(true);
        try {
            const params = new URLSearchParams({ page: String(page) });
            if (q.trim().length >= 2) params.set("q", q.trim());
            const res = await fetchApi(`/api/admin/walk-in/search?${params}`);
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

    // Initial load
    useEffect(() => {
        fetchPatients("", 1);
    }, [fetchPatients]);

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            setCurrentPage(1);
            fetchPatients(searchQuery, 1);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery, fetchPatients]);

    // Page navigation
    const goToPage = (page: number) => {
        setCurrentPage(page);
        fetchPatients(searchQuery, page);
    };

    // Load full clinical dossier
    const loadHistory = async (patientId: string) => {
        setSelectedPatientId(patientId);
        setLoadingHistory(true);
        setError(null);
        try {
            const res = await fetchApi(`/api/patients/${patientId}/history`);
            const data = await res.json();
            setHistory(data);
            setActiveDetailTab("book");
        } catch {
            setHistory(null);
        } finally {
            setLoadingHistory(false);
        }
    };

    // Clear selection
    const handleClearSelection = () => {
        setSelectedPatientId(null);
        setHistory(null);
        setBookingForm({
            date: "",
            time: "",
            treatmentId: "",
            notes: "",
            patientTreatmentId: undefined,
            doctorId: doctors[0]?.id || "",
        });
    };

    // Handle Appointment Booking
    const handleBook = async (e: FormEvent) => {
        e.preventDefault();
        if (!selectedPatientId) return;
        setBooking(true);
        setError(null);

        try {
            const res = await fetchApi("/api/admin/walk-in", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    patientId: selectedPatientId,
                    date: bookingForm.date,
                    time: bookingForm.time,
                    treatmentId: bookingForm.treatmentId,
                    patientTreatmentId: bookingForm.patientTreatmentId,
                    doctorId: bookingForm.doctorId || (doctors.length > 0 ? doctors[0].id : undefined),
                    notes: bookingForm.notes || undefined,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to book appointment");

            onSuccess(data);
            router.refresh();

            // Refresh patient's dossier so the newly booked appointment is reflected
            await loadHistory(selectedPatientId);
            setBookingForm({
                date: "",
                time: "",
                treatmentId: "",
                notes: "",
                patientTreatmentId: undefined,
                doctorId: doctors[0]?.id || "",
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong while booking");
        } finally {
            setBooking(false);
        }
    };

    const today = new Date().toISOString().split("T")[0];
    const selectedTreatment = treatments.find((t) => t.id === bookingForm.treatmentId);

    const leadDoctor = doctors.find((d) => d.isLead) || doctors[0];
    const chair1Doctor = doctors.find((d) => d.operatory?.toLowerCase().includes("chair 1"))?.name || leadDoctor?.name || "Dr. Sheriyaar";
    const chair2Doctor = doctors.find((d) => d.operatory?.toLowerCase().includes("chair 2") || d.role?.toLowerCase().includes("ortho"))?.name || (doctors.length === 1 ? leadDoctor?.name : "Specialist");
    const chair3Doctor = doctors.find((d) => d.operatory?.toLowerCase().includes("chair 3") || d.role?.toLowerCase().includes("endo"))?.name || (doctors.length === 1 ? leadDoctor?.name : "Specialist");
    const chair4Doctor = doctors.find((d) => d.operatory?.toLowerCase().includes("chair 4") || d.role?.toLowerCase().includes("hygiene"))?.name || (doctors.length === 1 ? leadDoctor?.name : "Duty Doctor");

    // Selected Patient Object
    const currentPatient = useMemo(() => {
        if (!selectedPatientId) return null;
        return results.find((p) => p.id === selectedPatientId) || (history?.patient ? { ...history.patient, _count: { appointments: history.appointments?.length || 0 } } : null);
    }, [selectedPatientId, results, history]);

    return (
        <div className="space-y-6">
            {/* Error Notification */}
            {error && (
                <div className="bg-red-50 border border-red-200/80 rounded-2xl px-5 py-4 flex items-start gap-3.5 shadow-2xs">
                    <ErrorOutlineOutlinedIcon sx={{ fontSize: 20 }} className="text-red-600 shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-black text-red-900 uppercase tracking-wide">Intake Alert</p>
                        <p className="text-xs text-red-700 font-medium mt-0.5">{error}</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setError(null)}
                        className="text-red-400 hover:text-red-700 p-1 rounded-lg transition-colors cursor-pointer"
                        title="Dismiss alert"
                    >
                        <CloseOutlinedIcon sx={{ fontSize: 16 }} />
                    </button>
                </div>
            )}

            {/* ── MASTER-DETAIL DUAL PANE WORKSPACE ── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* ──────────────────────────────────────────────────────────
                    LEFT PANEL (5 COLS on lg, 4 COLS on xl): Searchable Patient Stream
                    ────────────────────────────────────────────────────────── */}
                <div className={`lg:col-span-5 xl:col-span-4 space-y-4 ${selectedPatientId ? "hidden lg:block" : "block"}`}>
                    {/* Search & Filter Header Card */}
                    <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs space-y-3.5">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-extrabold text-teal-800 uppercase tracking-wider flex items-center gap-1.5">
                                <SearchOutlinedIcon sx={{ fontSize: 15 }} />
                                <span>Patient Directory</span>
                            </span>
                            <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                                {totalPatients} Total
                            </span>
                        </div>

                        {/* Search Input Box */}
                        <div className="relative">
                            <SearchOutlinedIcon sx={{ fontSize: 18 }} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by name, phone (03xx), or MRN (1001)..."
                                className="w-full pl-10 pr-9 py-2.5 bg-slate-50 hover:bg-slate-50/80 focus:bg-white border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all font-medium"
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                                    title="Clear search"
                                >
                                    <ClearOutlinedIcon sx={{ fontSize: 16 }} />
                                </button>
                            )}
                            {searching && !searchQuery && (
                                <AutorenewOutlinedIcon sx={{ fontSize: 16 }} className="absolute right-3 top-1/2 -translate-y-1/2 text-teal-600 animate-spin" />
                            )}
                        </div>
                    </div>

                    {/* Patient Stream List */}
                    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
                        <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between text-xs text-slate-500 font-semibold">
                            <span>
                                {searchQuery.trim().length >= 2 ? (
                                    <>Results for <span className="text-teal-700 font-bold">&quot;{searchQuery}&quot;</span></>
                                ) : (
                                    <>Registered Patients</>
                                )}
                            </span>
                            {totalPages > 1 && (
                                <span className="text-[11px] text-slate-400 font-bold">Page {currentPage} of {totalPages}</span>
                            )}
                        </div>

                        {results.length === 0 ? (
                            <div className="p-8 text-center space-y-2">
                                <PersonOutlineOutlinedIcon sx={{ fontSize: 36 }} className="text-slate-300 mx-auto" />
                                <p className="text-sm font-bold text-slate-800">
                                    {searchQuery.length >= 2 ? "No matching patients" : "No registered patients"}
                                </p>
                                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                                    {searchQuery.length >= 2
                                        ? "Try searching by exact phone number or click '+ New Patient' to register a walk-in."
                                        : "Use the '+ New Walk-In Patient' tab to create your first patient profile."}
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100 max-h-[620px] overflow-y-auto">
                                {results.map((patient) => {
                                    const isSelected = selectedPatientId === patient.id;
                                    const visitCount = patient._count?.appointments ?? patient.appointments?.length ?? 0;
                                    const hasActivePlan = Boolean(patient.patientTreatments && patient.patientTreatments.length > 0);

                                    return (
                                        <button
                                            key={patient.id}
                                            type="button"
                                            onClick={() => loadHistory(patient.id)}
                                            className={`w-full text-left p-4 sm:p-4.5 transition-all flex items-center gap-3.5 cursor-pointer relative group ${
                                                isSelected
                                                    ? "bg-teal-50/70 border-l-4 border-l-teal-600"
                                                    : "hover:bg-slate-50/80"
                                            }`}
                                        >
                                            {/* Patient Initial Avatar */}
                                            <div
                                                className={`size-11 rounded-2xl flex items-center justify-center font-black text-xs shrink-0 transition-all ${
                                                    isSelected
                                                        ? "bg-teal-600 text-white shadow-xs"
                                                        : "bg-teal-50 text-teal-800 border border-teal-200/80 group-hover:border-teal-400"
                                                }`}
                                            >
                                                {(patient.name || "P").charAt(0).toUpperCase()}
                                            </div>

                                            {/* Patient Info Column */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-1.5 flex-wrap">
                                                    <p className={`text-xs sm:text-sm font-black truncate tracking-tight ${
                                                        isSelected ? "text-teal-950 font-black" : "text-slate-900 group-hover:text-teal-700"
                                                    }`}>
                                                        {patient.name}
                                                    </p>
                                                    {patient.patientCode && (
                                                        <span className="text-[10px] font-mono font-extrabold px-1.5 py-0.2 rounded bg-teal-100/80 text-teal-800 border border-teal-200 shrink-0">
                                                            MRN #{patient.patientCode}
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="flex items-center gap-2 mt-1 flex-wrap text-[11px] text-slate-500">
                                                    {patient.phone && (
                                                        <span className="flex items-center gap-1 font-semibold text-slate-700">
                                                            <PhoneOutlinedIcon sx={{ fontSize: 12, color: "#0D9488" }} />
                                                            <span>{patient.phone}</span>
                                                        </span>
                                                    )}
                                                    <span className="text-slate-300">·</span>
                                                    <span className="font-medium">
                                                        {visitCount} {visitCount === 1 ? "Visit" : "Visits"}
                                                    </span>
                                                </div>

                                                {/* Plan or Medical Tag */}
                                                {hasActivePlan && (
                                                    <div className="mt-1 flex items-center gap-1 text-[10px] font-extrabold text-teal-700 bg-teal-50/90 px-2 py-0.5 rounded-md border border-teal-200/60 w-fit">
                                                        <AutoAwesomeOutlinedIcon sx={{ fontSize: 11 }} />
                                                        <span>Active Plan: {patient.patientTreatments![0].treatment.name}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Medical Alert Pill */}
                                            {patient.medicalAlerts && (
                                                <div
                                                    className="size-7 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center shrink-0"
                                                    title={patient.medicalAlerts}
                                                >
                                                    <SecurityOutlinedIcon sx={{ fontSize: 15, color: "#DC2626" }} />
                                                </div>
                                            )}

                                            <ChevronRightOutlinedIcon
                                                sx={{ fontSize: 16 }}
                                                className={`transition-transform shrink-0 ${
                                                    isSelected ? "text-teal-700 translate-x-1" : "text-slate-300 group-hover:text-slate-500"
                                                }`}
                                            />
                                        </button>
                                    );
                                })}
                            </div>
                        )}

                        {/* Pagination Bar */}
                        {totalPages > 1 && (
                            <div className="px-5 py-3.5 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between text-xs font-bold text-slate-700">
                                <button
                                    type="button"
                                    onClick={() => goToPage(currentPage - 1)}
                                    disabled={currentPage <= 1}
                                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-2xs"
                                >
                                    <ChevronLeftOutlinedIcon sx={{ fontSize: 14 }} />
                                    <span>Prev</span>
                                </button>

                                <span className="text-[11px] font-bold text-slate-500">
                                    {currentPage} / {totalPages}
                                </span>

                                <button
                                    type="button"
                                    onClick={() => goToPage(currentPage + 1)}
                                    disabled={currentPage >= totalPages}
                                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-2xs"
                                >
                                    <span>Next</span>
                                    <ChevronRightOutlinedIcon sx={{ fontSize: 14 }} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* ──────────────────────────────────────────────────────────
                    RIGHT PANEL (7 COLS on lg, 8 COLS on xl): Patient Dossier & Fast Booking Studio
                    ────────────────────────────────────────────────────────── */}
                <div className={`lg:col-span-7 xl:col-span-8 space-y-5 ${selectedPatientId ? "block" : "hidden lg:block"}`}>
                    {loadingHistory ? (
                        <div className="bg-white rounded-3xl border border-slate-200/80 p-16 text-center shadow-2xs space-y-3">
                            <AutorenewOutlinedIcon sx={{ fontSize: 32 }} className="text-teal-600 animate-spin mx-auto" />
                            <p className="text-sm font-extrabold text-slate-900">Loading Clinical Records...</p>
                            <p className="text-xs text-slate-400">Retrieving patient treatment history and operatory telemetry.</p>
                        </div>
                    ) : history && currentPatient ? (
                        <div className="space-y-5 animate-fade-in">
                            {/* Mobile Back Button */}
                            <button
                                type="button"
                                onClick={handleClearSelection}
                                className="lg:hidden inline-flex items-center gap-1.5 text-xs font-extrabold text-teal-800 bg-white border border-slate-200 px-3 py-2 rounded-xl shadow-2xs mb-2 cursor-pointer"
                            >
                                <ArrowBackOutlinedIcon sx={{ fontSize: 14 }} />
                                <span>Back to Patient Directory</span>
                            </button>

                            {/* 1. Selected Patient Dossier Header */}
                            <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs relative overflow-hidden">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <div className="flex items-center gap-3.5 min-w-0">
                                        <div className="size-13 rounded-2xl bg-gradient-to-br from-[#0F766E] to-[#0B1528] text-white flex items-center justify-center font-black text-lg shadow-sm shrink-0">
                                            {(history.patient.name || "P").charAt(0).toUpperCase()}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h2 className="text-lg sm:text-xl font-black text-slate-900 truncate tracking-tight">
                                                    {history.patient.name}
                                                </h2>
                                                {history.patient.patientCode && (
                                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-black bg-teal-50 text-teal-800 border border-teal-200">
                                                        MRN #{history.patient.patientCode}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mt-1">
                                                {history.patient.phone && (
                                                    <span className="flex items-center gap-1 text-slate-700 font-semibold">
                                                        <PhoneOutlinedIcon sx={{ fontSize: 13, color: "#0D9488" }} />
                                                        <span>{history.patient.phone}</span>
                                                    </span>
                                                )}
                                                {history.patient.email && (
                                                    <span className="text-slate-400 truncate">{history.patient.email}</span>
                                                )}
                                                <span className="text-teal-800 font-extrabold">
                                                    {(history.appointments?.length || 0)} Visits Recorded
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Shortcuts */}
                                    <div className="flex items-center gap-2 shrink-0">
                                        {history.patient.phone && (
                                            <a
                                                href={`https://wa.me/${history.patient.phone.replace(/[^0-9]/g, "")}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-all cursor-pointer shadow-2xs"
                                                title="Open WhatsApp message with patient"
                                            >
                                                <WhatsAppIcon sx={{ fontSize: 15, color: "#10B981" }} />
                                                <span className="hidden sm:inline">WhatsApp</span>
                                            </a>
                                        )}
                                        <button
                                            type="button"
                                            onClick={handleClearSelection}
                                            className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                                            title="Close dossier"
                                        >
                                            <CloseOutlinedIcon sx={{ fontSize: 15 }} />
                                            <span className="ml-1 hidden sm:inline">Deselect</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* 2. Active Multi-Session Treatment Plans Card (Secondary Mint Accent) */}
                            {history.plans && history.plans.filter((p) => p.clinicalStatus === "IN_PROGRESS").length > 0 && (
                                <div className="rounded-3xl bg-teal-50/70 border border-teal-200/90 p-5 sm:p-6 space-y-4 shadow-2xs">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-extrabold text-teal-950 uppercase tracking-wider flex items-center gap-1.5">
                                            <AutoAwesomeOutlinedIcon sx={{ fontSize: 15, color: "#0D9488" }} />
                                            <span>Active Multi-Session Plan</span>
                                        </span>
                                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-white text-teal-800 border border-teal-200/80 shadow-2xs">
                                            Installment Schedule Active
                                        </span>
                                    </div>

                                    {history.plans
                                        .filter((p) => p.clinicalStatus === "IN_PROGRESS")
                                        .map((plan) => (
                                            <div
                                                key={plan.id}
                                                className="bg-white rounded-2xl border border-teal-200/80 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs"
                                            >
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <h4 className="text-sm font-black text-slate-900">{plan.treatment.name}</h4>
                                                        <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-teal-50 text-teal-800 border border-teal-200">
                                                            Session {plan.completedSessions + 1} of {plan.totalSessions}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-slate-600 font-medium">
                                                        Total: <span className="font-bold text-slate-900">{formatPKR(plan.totalCost)}</span> · Paid: <span className="font-bold text-emerald-700">{formatPKR(plan.totalPaid)}</span> · Outstanding: <span className="font-black text-amber-800">{formatPKR(plan.remainingBalance)}</span>
                                                    </p>
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setBookingForm((prev) => ({
                                                            ...prev,
                                                            treatmentId: plan.treatment.id,
                                                            patientTreatmentId: plan.id,
                                                        }));
                                                        setActiveDetailTab("book");
                                                    }}
                                                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-black transition-all shadow-xs shrink-0 cursor-pointer active:scale-95"
                                                >
                                                    <EventAvailableOutlinedIcon sx={{ fontSize: 16 }} />
                                                    <span>Book Session #{plan.completedSessions + 1}</span>
                                                </button>
                                            </div>
                                        ))}
                                </div>
                            )}

                            {/* 3. Sub-View Switcher: Schedule Appointment vs Clinical History */}
                            <div className="flex items-center gap-2 border-b border-slate-200/80 pb-2">
                                <button
                                    type="button"
                                    onClick={() => setActiveDetailTab("book")}
                                    className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                                        activeDetailTab === "book"
                                            ? "bg-teal-600 text-white shadow-xs"
                                            : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
                                    }`}
                                >
                                    <EventAvailableOutlinedIcon sx={{ fontSize: 15 }} />
                                    <span>Schedule Appointment</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setActiveDetailTab("history")}
                                    className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                                        activeDetailTab === "history"
                                            ? "bg-teal-600 text-white shadow-xs"
                                            : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
                                    }`}
                                >
                                    <HistoryOutlinedIcon sx={{ fontSize: 15 }} />
                                    <span>Visit History ({(history.appointments || []).length})</span>
                                </button>
                            </div>

                            {/* 4. Scheduling Workspace */}
                            {activeDetailTab === "book" ? (
                                <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs space-y-5">
                                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                        <div className="flex items-center gap-2">
                                            <EventAvailableOutlinedIcon sx={{ fontSize: 18, color: "#0D9488" }} />
                                            <h3 className="text-sm font-extrabold text-slate-900">
                                                New Booking for {history.patient.name}
                                            </h3>
                                        </div>
                                        <span className="text-[11px] font-bold text-slate-400">G-8 Clinical Suite</span>
                                    </div>

                                    <form onSubmit={handleBook} className="space-y-4">
                                        <div className={`grid ${doctors.length > 1 ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2"} gap-4`}>
                                            {/* Date Picker */}
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
                                                    <CalendarTodayOutlinedIcon sx={{ fontSize: 14, color: "#0D9488" }} />
                                                    <span>Appointment Date</span>
                                                    <span className="text-red-500">*</span>
                                                </label>
                                                <DatePicker
                                                    value={bookingForm.date}
                                                    onChange={(val) => setBookingForm((p) => ({ ...p, date: val, time: "" }))}
                                                    min={today}
                                                    placeholder="Select appointment date"
                                                    disabledDays={(date) => date.getDay() === 0}
                                                />
                                                <SundayWarning date={bookingForm.date} />
                                            </div>

                                            {/* Treatment Selector */}
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
                                                    <MedicalServicesOutlinedIcon sx={{ fontSize: 14, color: "#0D9488" }} />
                                                    <span>Clinical Procedure</span>
                                                    <span className="text-red-500">*</span>
                                                </label>
                                                <Select
                                                    value={bookingForm.treatmentId || "NONE"}
                                                    onValueChange={(val) => setBookingForm((p) => ({ ...p, treatmentId: val === "NONE" ? "" : val, time: "" }))}
                                                >
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select clinical procedure..." />
                                                    </SelectTrigger>
                                                    <SelectContent position="popper" align="start" className="max-h-72">
                                                        <SelectItem value="NONE">Select procedure...</SelectItem>
                                                        {treatments.map((t) => (
                                                            <SelectItem key={t.id} value={t.id}>
                                                                {t.name} — Rs. {t.price.toLocaleString()} ({t.durationMin}m)
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            {/* Attending Specialist / Doctor (Only shown when clinic has multiple doctors) */}
                                            {doctors.length > 1 && (
                                                <div className="space-y-1.5">
                                                    <label className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
                                                        <PersonOutlineOutlinedIcon sx={{ fontSize: 14, color: "#0D9488" }} />
                                                        <span>Attending Specialist</span>
                                                        <span className="text-red-500">*</span>
                                                    </label>
                                                    <Select
                                                        value={bookingForm.doctorId || doctors[0]?.id || ""}
                                                        onValueChange={(val) => setBookingForm((p) => ({ ...p, doctorId: val }))}
                                                    >
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Select attending doctor..." />
                                                        </SelectTrigger>
                                                        <SelectContent position="popper" align="start" className="max-h-72">
                                                            {doctors.map((doc) => (
                                                                <SelectItem key={doc.id} value={doc.id}>
                                                                    {doc.name} {doc.isLead ? "★ Lead Surgeon" : `(${doc.role})`}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            )}
                                        </div>

                                        {/* Available Operatory Time Slots */}
                                        <div className="space-y-2 pt-1">
                                            <div className="flex items-center justify-between">
                                                <label className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
                                                    <AccessTimeOutlinedIcon sx={{ fontSize: 14, color: "#0D9488" }} />
                                                    <span>Available Time Slots (Chairs 1–4)</span>
                                                    <span className="text-red-500">*</span>
                                                </label>
                                                <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                                                    12:00 PM – 8:00 PM
                                                </span>
                                            </div>

                                            <TimeSlotSelector
                                                date={bookingForm.date}
                                                treatmentId={bookingForm.treatmentId}
                                                value={bookingForm.time}
                                                onChange={(val) => setBookingForm((p) => ({ ...p, time: val }))}
                                            />
                                            <input type="text" name="time" value={bookingForm.time} required className="sr-only" readOnly tabIndex={-1} />
                                        </div>

                                        {/* Selected Procedure Preview Chip */}
                                        {selectedTreatment && (
                                            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-teal-50/60 border border-teal-200/80 text-xs text-slate-700 font-semibold">
                                                <div className="flex items-center gap-2">
                                                    <span className="size-2 rounded-full bg-teal-600" />
                                                    <span>{selectedTreatment.name}</span>
                                                    <span className="text-slate-400">·</span>
                                                    <span className="text-slate-500">{selectedTreatment.durationMin} min duration</span>
                                                </div>
                                                <span className="font-black text-teal-900 text-sm">
                                                    Rs. {selectedTreatment.price.toLocaleString()}
                                                </span>
                                            </div>
                                        )}

                                        {/* Optional Receptionist Notes */}
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-extrabold text-slate-700">
                                                Clinical & Desk Notes (Optional)
                                            </label>
                                            <textarea
                                                rows={2}
                                                value={bookingForm.notes}
                                                onChange={(e) => setBookingForm((p) => ({ ...p, notes: e.target.value }))}
                                                placeholder="e.g., Patient prefers Chair 1 with Dr. Sheriyaar, medical alert check..."
                                                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all resize-none font-medium"
                                            />
                                        </div>

                                        {/* Submit Action */}
                                        <button
                                            type="submit"
                                            disabled={booking || isSunday(bookingForm.date) || !bookingForm.time}
                                            className="w-full py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs sm:text-sm transition-all shadow-md shadow-teal-600/20 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                                        >
                                            {booking ? (
                                                <>
                                                    <AutorenewOutlinedIcon sx={{ fontSize: 18 }} className="animate-spin" />
                                                    <span>Securing Operatory Slot...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <CheckCircleOutlineOutlinedIcon sx={{ fontSize: 18 }} />
                                                    <span>Confirm Appointment &amp; Dispatch Confirmation</span>
                                                </>
                                            )}
                                        </button>
                                    </form>
                                </div>
                            ) : (
                                /* 5. Clinical History Log */
                                <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
                                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
                                        <div>
                                            <h3 className="text-sm font-extrabold text-slate-900">Treatment & Visit Log</h3>
                                            <p className="text-[11px] text-slate-500 font-medium">Chronological medical visits and clinical encounters</p>
                                        </div>
                                        <span className="text-xs font-bold text-slate-500">{(history.appointments || []).length} Encounters</span>
                                    </div>

                                    {!history.appointments || history.appointments.length === 0 ? (
                                        <div className="p-10 text-center space-y-2">
                                            <AssignmentOutlinedIcon sx={{ fontSize: 32 }} className="text-slate-300 mx-auto" />
                                            <p className="text-xs font-bold text-slate-700">No Prior Appointments Found</p>
                                            <p className="text-[11px] text-slate-400">New bookings will appear here chronologically.</p>
                                        </div>
                                    ) : (
                                        <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
                                            {(history.appointments || []).map((apt) => (
                                                <div key={apt.id} className="p-4 sm:p-5 space-y-2.5 hover:bg-slate-50/60 transition-colors">
                                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5">
                                                        <div className="flex items-center gap-2.5">
                                                            <div className="size-9 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center shrink-0">
                                                                <MedicalServicesOutlinedIcon sx={{ fontSize: 16, color: "#0D9488" }} />
                                                            </div>
                                                            <div>
                                                                <p className="text-xs sm:text-sm font-black text-slate-900">
                                                                    {apt.treatment.name}
                                                                </p>
                                                                <p className="text-[11px] text-slate-500 font-medium">
                                                                    {formatDate(apt.startTime, "short")} · {formatTime(apt.startTime)}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-2.5 self-end sm:self-auto">
                                                            <span className="text-xs font-black text-slate-800">
                                                                Rs. {apt.price.toLocaleString()}
                                                            </span>
                                                            <StatusBadge status={apt.status} />
                                                        </div>
                                                    </div>

                                                    {/* Clinical Doctor Notes */}
                                                    {apt.clinicalNotes && apt.clinicalNotes.length > 0 && (
                                                        <div className="mt-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5 text-[11px]">
                                                            {apt.clinicalNotes[0].diagnosis && (
                                                                <p className="text-slate-700">
                                                                    <span className="font-extrabold text-slate-900">Diagnosis:</span>{" "}
                                                                    {apt.clinicalNotes[0].diagnosis}
                                                                </p>
                                                            )}
                                                            {apt.clinicalNotes[0].treatmentDone && (
                                                                <p className="text-slate-700">
                                                                    <span className="font-extrabold text-teal-800">Procedure:</span>{" "}
                                                                    {apt.clinicalNotes[0].treatmentDone}
                                                                </p>
                                                            )}
                                                            {apt.clinicalNotes[0].prescription && (
                                                                <p className="text-slate-700">
                                                                    <span className="font-extrabold text-slate-900">Rx:</span>{" "}
                                                                    {apt.clinicalNotes[0].prescription}
                                                                </p>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ) : (
                        /* ──────────────────────────────────────────────────────────
                           EMPTY WORKSPACE CANVAS (Quick Selection Guide)
                           ────────────────────────────────────────────────────────── */
                        <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-12 shadow-2xs space-y-8 text-center">
                            <div className="space-y-4">
                                <div className="size-16 rounded-3xl bg-teal-50 border border-teal-200/80 flex items-center justify-center mx-auto text-teal-700 shadow-2xs">
                                    <SearchOutlinedIcon sx={{ fontSize: 32 }} />
                                </div>

                                <div className="max-w-md mx-auto space-y-1.5">
                                    <h3 className="text-xl font-black text-slate-900 tracking-tight">
                                        Select a Patient to Schedule
                                    </h3>
                                    <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
                                        Click any patient in the directory on the left or search by MRN, phone, or name to view their clinical history, active treatment plans, and book their next visit.
                                    </p>
                                </div>
                            </div>

                            {/* 4 Operatory Chair Telemetry Cards */}
                            <div className="pt-6 border-t border-slate-100 max-w-3xl mx-auto text-left">
                                <div className="flex items-center justify-between mb-4">
                                    <p className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                                        <ChairOutlinedIcon sx={{ fontSize: 16, color: "#0d9488" }} />
                                        <span>Current Operatory Desk Overview</span>
                                    </p>
                                    <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                                        4 Operatories Active
                                    </span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
                                    <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:border-teal-300 transition-all shadow-2xs group">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-[10px] font-black text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200/70">
                                                Chair 1
                                            </span>
                                            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                                        </div>
                                        <p className="text-xs font-black text-slate-900 group-hover:text-teal-700 transition-colors">
                                            Surgical Suite A
                                        </p>
                                        <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                                            Implants &amp; Maxillofacial
                                        </p>
                                        <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px]">
                                            <span className="text-emerald-700 font-extrabold">Live Ready</span>
                                            <span className="text-slate-400 font-semibold">{chair1Doctor}</span>
                                        </div>
                                    </div>

                                    <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:border-teal-300 transition-all shadow-2xs group">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-[10px] font-black text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200/70">
                                                Chair 2
                                            </span>
                                            <span className="size-2 rounded-full bg-emerald-500" />
                                        </div>
                                        <p className="text-xs font-black text-slate-900 group-hover:text-teal-700 transition-colors">
                                            Orthodontics
                                        </p>
                                        <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                                            Braces &amp; Aligners
                                        </p>
                                        <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px]">
                                            <span className="text-emerald-700 font-extrabold">Live Ready</span>
                                            <span className="text-slate-400 font-semibold">{chair2Doctor}</span>
                                        </div>
                                    </div>

                                    <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:border-teal-300 transition-all shadow-2xs group">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-[10px] font-black text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200/70">
                                                Chair 3
                                            </span>
                                            <span className="size-2 rounded-full bg-emerald-500" />
                                        </div>
                                        <p className="text-xs font-black text-slate-900 group-hover:text-teal-700 transition-colors">
                                            Endodontics
                                        </p>
                                        <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                                            Root Canal &amp; Crowns
                                        </p>
                                        <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px]">
                                            <span className="text-emerald-700 font-extrabold">Live Ready</span>
                                            <span className="text-slate-400 font-semibold">{chair3Doctor}</span>
                                        </div>
                                    </div>

                                    <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:border-teal-300 transition-all shadow-2xs group">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-[10px] font-black text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200/70">
                                                Chair 4
                                            </span>
                                            <span className="size-2 rounded-full bg-emerald-500" />
                                        </div>
                                        <p className="text-xs font-black text-slate-900 group-hover:text-teal-700 transition-colors">
                                            Hygiene Bay
                                        </p>
                                        <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                                            Scaling &amp; Whitening
                                        </p>
                                        <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px]">
                                            <span className="text-emerald-700 font-extrabold">Live Ready</span>
                                            <span className="text-slate-400 font-semibold">{chair4Doctor}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {booking && <PremiumLoader text="Securing operatory appointment slot..." variant="inline" />}
        </div>
    );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TAB 2: NEW WALK-IN PATIENT INTAKE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const initialNew: NewPatientForm = {
    phone: "",
    cnic: "",
    fullName: "",
    age: "",
    date: "",
    time: "",
    treatmentId: "",
    notes: "",
    doctorId: "",
};

function NewPatientIntake({
    treatments,
    doctors = [],
    onSuccess,
}: {
    treatments: TreatmentOption[];
    doctors?: DoctorOption[];
    onSuccess: (data: SuccessData) => void;
}) {
    const [formData, setFormData] = useState<NewPatientForm>({
        ...initialNew,
        doctorId: doctors[0]?.id || "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const selectedTreatment = treatments.find((t) => t.id === formData.treatmentId);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        let cleanValue = value;

        if (name === "phone" || name === "age") {
            cleanValue = value.replace(/[^0-9]/g, "");
        } else if (name === "cnic") {
            cleanValue = value.replace(/[^0-9-]/g, "");
        } else if (name === "fullName") {
            cleanValue = value.replace(/[0-9]/g, "");
        }

        setFormData((prev) => ({ ...prev, [name]: cleanValue }));
        if (error) setError(null);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await fetchApi("/api/admin/walk-in", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    phone: formData.phone,
                    cnic: formData.cnic || undefined,
                    fullName: formData.fullName,
                    age: parseInt(formData.age, 10),
                    date: formData.date,
                    time: formData.time,
                    treatmentId: formData.treatmentId,
                    doctorId: formData.doctorId || (doctors.length > 0 ? doctors[0].id : undefined),
                    notes: formData.notes || undefined,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to register walk-in patient");

            onSuccess(data);
            router.refresh();
            setFormData({ ...initialNew, doctorId: doctors[0]?.id || "" });
        } catch (err) {
            setError(err instanceof Error ? err.message : "Registration failed. Check patient phone number.");
        } finally {
            setLoading(false);
        }
    };

    const today = new Date().toISOString().split("T")[0];

    return (
        <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-2xs">
            {/* Intake Header */}
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="size-11 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-xs">
                        <PersonAddOutlinedIcon sx={{ fontSize: 22 }} />
                    </div>
                    <div>
                        <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                            Rapid Walk-In Patient Registration
                        </h2>
                        <p className="text-xs text-slate-500 font-medium">
                            Create permanent MRN record and secure chair slot in one step.
                        </p>
                    </div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200/80">
                    Auto MRN
                </span>
            </div>

            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
                {/* Error Banner */}
                {error && (
                    <div className="bg-red-50 border border-red-200/80 rounded-2xl px-5 py-4 flex items-start gap-3.5 shadow-2xs">
                        <ErrorOutlineOutlinedIcon sx={{ fontSize: 20 }} className="text-red-600 shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-black text-red-900 uppercase tracking-wide">Intake Alert</p>
                            <p className="text-xs text-red-700 font-medium mt-0.5">{error}</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setError(null)}
                            className="text-red-400 hover:text-red-700 p-1 rounded-lg transition-colors cursor-pointer"
                        >
                            <CloseOutlinedIcon sx={{ fontSize: 16 }} />
                        </button>
                    </div>
                )}

                {/* Section 1: Patient Demographics */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                        <PersonOutlineOutlinedIcon sx={{ fontSize: 16, color: "#0D9488" }} />
                        <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                            1. Patient Demographics
                        </h3>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label htmlFor="new-name" className="text-xs font-extrabold text-slate-700 flex items-center gap-1">
                                <span>Full Name</span>
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="new-name"
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                placeholder="e.g. Tariq Mehmood"
                                required
                                className="w-full px-3.5 py-2.5 bg-slate-50/60 focus:bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all font-medium"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label htmlFor="new-phone" className="text-xs font-extrabold text-slate-700 flex items-center gap-1">
                                <span>Phone Number</span>
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="new-phone"
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="03001234567"
                                required
                                className="w-full px-3.5 py-2.5 bg-slate-50/60 focus:bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all font-medium font-mono"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label htmlFor="new-age" className="text-xs font-extrabold text-slate-700 flex items-center gap-1">
                                <span>Age</span>
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="new-age"
                                type="number"
                                name="age"
                                value={formData.age}
                                onChange={handleChange}
                                placeholder="e.g. 29"
                                min="1"
                                max="130"
                                required
                                className="w-full px-3.5 py-2.5 bg-slate-50/60 focus:bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all font-medium"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label htmlFor="new-cnic" className="text-xs font-extrabold text-slate-700">
                                CNIC <span className="text-slate-400 text-[10px] font-normal">(Optional, 13 digits)</span>
                            </label>
                            <input
                                id="new-cnic"
                                type="text"
                                name="cnic"
                                value={formData.cnic}
                                onChange={handleChange}
                                placeholder="37405-1234567-1"
                                className="w-full px-3.5 py-2.5 bg-slate-50/60 focus:bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all font-medium font-mono"
                            />
                        </div>
                    </div>
                </div>

                {/* Section 2: Clinical Procedure & Operatory Slot */}
                <div className="space-y-4 pt-2">
                    <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                        <CalendarTodayOutlinedIcon sx={{ fontSize: 16, color: "#0D9488" }} />
                        <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                            2. Clinical Visit &amp; Schedule
                        </h3>
                    </div>

                    <div className={`grid ${doctors.length > 1 ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2"} gap-4`}>
                        {/* Date Picker */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-extrabold text-slate-700 flex items-center gap-1">
                                <span>Appointment Date</span>
                                <span className="text-red-500">*</span>
                            </label>
                            <DatePicker
                                value={formData.date}
                                onChange={(val) => setFormData((p) => ({ ...p, date: val, time: "" }))}
                                min={today}
                                placeholder="Select appointment date"
                                disabledDays={(date) => date.getDay() === 0}
                            />
                            <SundayWarning date={formData.date} />
                        </div>

                        {/* Treatment Select */}
                        <div className="space-y-1.5">
                            <label htmlFor="new-treatment" className="text-xs font-extrabold text-slate-700 flex items-center gap-1">
                                <span>Clinical Procedure</span>
                                <span className="text-red-500">*</span>
                            </label>
                            <Select
                                value={formData.treatmentId || "NONE"}
                                onValueChange={(val) => setFormData((p) => ({ ...p, treatmentId: val === "NONE" ? "" : val, time: "" }))}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select clinical procedure..." />
                                </SelectTrigger>
                                <SelectContent position="popper" align="start" className="max-h-72">
                                    <SelectItem value="NONE">Select procedure...</SelectItem>
                                    {treatments.map((t) => (
                                        <SelectItem key={t.id} value={t.id}>
                                            {t.name} — Rs. {t.price.toLocaleString()} ({t.durationMin}m)
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Attending Specialist / Doctor (Only shown when clinic has multiple doctors) */}
                        {doctors.length > 1 && (
                            <div className="space-y-1.5">
                                <label className="text-xs font-extrabold text-slate-700 flex items-center gap-1">
                                    <span>Attending Specialist</span>
                                    <span className="text-red-500">*</span>
                                </label>
                                <Select
                                    value={formData.doctorId || doctors[0]?.id || ""}
                                    onValueChange={(val) => setFormData((p) => ({ ...p, doctorId: val }))}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select doctor..." />
                                    </SelectTrigger>
                                    <SelectContent position="popper" align="start" className="max-h-72">
                                        {doctors.map((doc) => (
                                            <SelectItem key={doc.id} value={doc.id}>
                                                {doc.name} {doc.isLead ? "★ Lead Surgeon" : `(${doc.role})`}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>

                    {/* Time Slot Selector */}
                    <div className="space-y-2 pt-1">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
                                <AccessTimeOutlinedIcon sx={{ fontSize: 14, color: "#0D9488" }} />
                                <span>Select Operatory Time Slot</span>
                                <span className="text-red-500">*</span>
                            </label>
                            <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                                12:00 PM – 8:00 PM Shift
                            </span>
                        </div>
                        <TimeSlotSelector
                            date={formData.date}
                            treatmentId={formData.treatmentId}
                            value={formData.time}
                            onChange={(val) => setFormData((p) => ({ ...p, time: val }))}
                        />
                        <input type="text" name="time" value={formData.time} required className="sr-only" readOnly tabIndex={-1} />
                    </div>

                    {/* Selected Procedure Preview */}
                    {selectedTreatment && (
                        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-teal-50/60 border border-teal-200/80 text-xs text-slate-700 font-semibold">
                            <div className="flex items-center gap-2">
                                <span className="size-2 rounded-full bg-teal-600" />
                                <span>{selectedTreatment.name}</span>
                                <span className="text-slate-400">·</span>
                                <span className="text-slate-500">{selectedTreatment.durationMin} min duration</span>
                            </div>
                            <span className="font-black text-teal-900 text-sm">
                                Rs. {selectedTreatment.price.toLocaleString()}
                            </span>
                        </div>
                    )}

                    {/* Notes */}
                    <div className="space-y-1.5">
                        <label htmlFor="new-notes" className="text-xs font-extrabold text-slate-700">
                            Presenting Complaint / Clinical Notes (Optional)
                        </label>
                        <textarea
                            id="new-notes"
                            name="notes"
                            rows={2}
                            value={formData.notes}
                            onChange={handleChange}
                            placeholder="e.g. Severe tooth sensitivity lower right molar..."
                            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all resize-none font-medium"
                        />
                    </div>
                </div>

                {/* Submit Action */}
                <button
                    type="submit"
                    disabled={loading || isSunday(formData.date) || !formData.time}
                    className="w-full py-4 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-sm transition-all shadow-md shadow-teal-600/25 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                >
                    {loading ? (
                        <>
                            <AutorenewOutlinedIcon sx={{ fontSize: 20 }} className="animate-spin" />
                            <span>Creating Patient Profile &amp; Booking...</span>
                        </>
                    ) : (
                        <>
                            <PersonAddOutlinedIcon sx={{ fontSize: 20 }} />
                            <span>Register Patient &amp; Book Appointment</span>
                        </>
                    )}
                </button>
            </form>

            {loading && <PremiumLoader text="Registering patient and booking slot..." variant="inline" />}
        </div>
    );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SUCCESS MODAL (LUXURY CLINICAL RECEIPT & MRN DISPLAY)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function SuccessModal({
    success,
    onClose,
    onCopy,
    copied,
}: {
    success: SuccessData;
    onClose: () => void;
    onCopy: () => void;
    copied: boolean;
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs font-sans">
            <div className="relative w-full max-w-md animate-fade-in-up">
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute -top-3 -right-3 z-10 size-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 shadow-md transition-all cursor-pointer"
                    title="Close modal"
                >
                    <CloseOutlinedIcon sx={{ fontSize: 18 }} />
                </button>

                <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-2xl">
                    {/* Header Banner */}
                    <div className="p-6 text-center bg-teal-50/70 border-b border-teal-100">
                        <div className="mx-auto size-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center mb-3 shadow-md shadow-emerald-500/30">
                            <CheckCircleOutlineOutlinedIcon sx={{ fontSize: 28 }} />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 tracking-tight">
                            Appointment Confirmed!
                        </h3>
                        <p className="text-xs font-bold text-teal-800 mt-1">
                            {success.patientName}
                        </p>
                    </div>

                    {/* MRN Callout (High visibility for receptionist) */}
                    {success.patientId && (
                        <div className="p-6 pb-2 space-y-3">
                            <div className="bg-teal-50/70 border-2 border-dashed border-teal-300 rounded-2xl p-5 text-center">
                                <p className="text-[10px] uppercase tracking-widest text-teal-800 font-extrabold mb-1">
                                    Medical Record Number (MRN)
                                </p>
                                <div className="flex items-center justify-center gap-3">
                                    <span className="text-3xl font-black text-slate-900 tracking-widest font-mono">
                                        {success.patientId}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={onCopy}
                                        className="size-9 rounded-xl bg-white border border-teal-200/80 flex items-center justify-center text-teal-700 hover:bg-teal-50 transition-all shadow-2xs cursor-pointer active:scale-95"
                                        title="Copy MRN to clipboard"
                                    >
                                        {copied ? (
                                            <VerifiedOutlinedIcon sx={{ fontSize: 18, color: "#10B981" }} />
                                        ) : (
                                            <ContentCopyOutlinedIcon sx={{ fontSize: 18 }} />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/80 text-[11px] text-amber-900 flex items-center gap-2">
                                <ErrorOutlineOutlinedIcon sx={{ fontSize: 16, color: "#D97706" }} className="shrink-0" />
                                <span>
                                    Note: Write MRN <strong className="font-mono font-black">{success.patientId}</strong> on patient&apos;s physical card.
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Visit Summary Card */}
                    <div className="px-6 py-4">
                        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-2.5 text-xs">
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400 font-bold uppercase text-[10px]">Procedure</span>
                                <span className="text-slate-900 font-black">{success.appointment.serviceType}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400 font-bold uppercase text-[10px]">Date</span>
                                <span className="text-slate-800 font-bold">
                                    {new Date(success.appointment.date).toLocaleDateString("en-PK", {
                                        weekday: "short",
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                    })}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400 font-bold uppercase text-[10px]">Time Slot</span>
                                <span className="text-teal-800 font-black">
                                    {(() => {
                                        if (!success.appointment.time) return "";
                                        const [h, m] = success.appointment.time.split(":");
                                        const dateObj = new Date();
                                        dateObj.setHours(parseInt(h, 10), parseInt(m, 10));
                                        return dateObj.toLocaleTimeString("en-US", {
                                            hour: "numeric",
                                            minute: "2-digit",
                                            hour12: true,
                                        });
                                    })()}
                                </span>
                            </div>
                            <div className="flex justify-between items-center pt-2 border-t border-slate-200/60">
                                <span className="text-slate-400 font-bold uppercase text-[10px]">Status</span>
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-800 border border-emerald-200">
                                    {success.appointment.status}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 pt-1">
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs transition-all shadow-md shadow-teal-600/20 cursor-pointer"
                        >
                            Complete Intake &amp; Return to Desk
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
