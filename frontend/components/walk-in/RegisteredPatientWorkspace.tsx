"use client";

import { useState, useEffect, useCallback, FormEvent, useMemo } from "react";
import { useRouter } from "next/navigation";
import { fetchApi } from "@/lib/api-client";

// Material UI Icons (100% SVG, Zero Emojis)
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import ChevronLeftOutlinedIcon from "@mui/icons-material/ChevronLeftOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import AutorenewOutlinedIcon from "@mui/icons-material/AutorenewOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import MedicalServicesOutlinedIcon from "@mui/icons-material/MedicalServicesOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import ChairOutlinedIcon from "@mui/icons-material/ChairOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import DirectionsWalkOutlinedIcon from "@mui/icons-material/DirectionsWalkOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";

import { DatePicker } from "@/components/ui/date-picker";
import { TimeSlotSelector } from "@/components/ui/time-slot-selector";
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

import type {
  TreatmentOption,
  DoctorOption,
  PatientResult,
  PatientHistory,
  BookingForm,
  SuccessData,
} from "./types";

interface RegisteredPatientWorkspaceProps {
    treatments: TreatmentOption[];
    doctors?: DoctorOption[];
    onSuccess: (data: SuccessData) => void;
}

function getChannelBadge(bookedBy?: string) {
    if (bookedBy === "WHATSAPP_BOT") {
        return (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs">
                <WhatsAppIcon sx={{ fontSize: 13, color: "#10B981" }} />
                <span>WhatsApp Chatbot</span>
            </span>
        );
    }
    if (bookedBy === "WEBSITE") {
        return (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-teal-50 text-teal-800 border border-teal-200 shadow-2xs">
                <LanguageOutlinedIcon sx={{ fontSize: 13, color: "#0D9488" }} />
                <span>Website Booking</span>
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-100 text-slate-800 border border-slate-200 shadow-2xs">
            <DirectionsWalkOutlinedIcon sx={{ fontSize: 13, color: "#475569" }} />
            <span>Walk-In Desk</span>
        </span>
    );
}

function getPatientChannelPills(appointments?: { bookedBy?: string }[]) {
    if (!appointments || appointments.length === 0) return null;
    const channels = Array.from(new Set(appointments.map((a) => a.bookedBy).filter(Boolean)));
    if (channels.length === 0) return null;

    return (
        <div className="flex items-center gap-1 flex-wrap mt-1">
            {channels.map((ch) => {
                if (ch === "WHATSAPP_BOT") {
                    return (
                        <span key={ch} className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            <WhatsAppIcon sx={{ fontSize: 11, color: "#10B981" }} />
                            <span>Bot</span>
                        </span>
                    );
                }
                if (ch === "WEBSITE") {
                    return (
                        <span key={ch} className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-teal-50 text-teal-800 border border-teal-200">
                            <LanguageOutlinedIcon sx={{ fontSize: 11, color: "#0D9488" }} />
                            <span>Web</span>
                        </span>
                    );
                }
                return (
                    <span key={ch} className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-slate-100 text-slate-700 border border-slate-200">
                        <DirectionsWalkOutlinedIcon sx={{ fontSize: 11, color: "#475569" }} />
                        <span>Walk-In</span>
                    </span>
                );
            })}
        </div>
    );
}

export default function RegisteredPatientWorkspace({
    treatments,
    doctors = [],
    onSuccess,
}: RegisteredPatientWorkspaceProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [channelFilter, setChannelFilter] = useState<"ALL" | "WEBSITE" | "WHATSAPP_BOT" | "WALK_IN">("ALL");
    const [historyChannelFilter, setHistoryChannelFilter] = useState<"ALL" | "WEBSITE" | "WHATSAPP_BOT" | "WALK_IN">("ALL");
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

    // Fetch patient directory with channel filter and phone normalization
    const fetchPatients = useCallback(async (q: string, page: number, ch: string = channelFilter) => {
        setSearching(true);
        try {
            const params = new URLSearchParams({ page: String(page) });
            if (q.trim().length >= 2) params.set("q", q.trim());
            if (ch && ch !== "ALL") params.set("channel", ch);
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
    }, [channelFilter]);

    // Initial load
    useEffect(() => {
        fetchPatients("", 1, channelFilter);
    }, [fetchPatients, channelFilter]);

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            setCurrentPage(1);
            fetchPatients(searchQuery, 1, channelFilter);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery, channelFilter, fetchPatients]);

    // Page navigation
    const goToPage = (page: number) => {
        setCurrentPage(page);
        fetchPatients(searchQuery, page, channelFilter);
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

    // Unique channels patient has used across their entire history
    const patientAllChannels = useMemo(() => {
        if (!history?.appointments) return [];
        return Array.from(new Set(history.appointments.map((a) => a.bookedBy).filter(Boolean)));
    }, [history]);

    // Filtered appointments in Visit History tab
    const filteredHistoryAppointments = useMemo(() => {
        if (!history?.appointments) return [];
        if (historyChannelFilter === "ALL") return history.appointments;
        return history.appointments.filter((a) => a.bookedBy === historyChannelFilter);
    }, [history, historyChannelFilter]);

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
                {/* LEFT PANEL: Searchable Patient Stream */}
                <div className={`lg:col-span-5 xl:col-span-4 space-y-4 ${selectedPatientId ? "hidden lg:block" : "block"}`}>
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
                                placeholder="Search by name, phone (03xx / +92), or MRN (1001)..."
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

                        {/* Booking Origin Channel Quick Filter Chips */}
                        <div className="flex items-center gap-1.5 pt-1 overflow-x-auto no-scrollbar">
                            <button
                                type="button"
                                onClick={() => { setChannelFilter("ALL"); setCurrentPage(1); }}
                                className={`px-2.5 py-1 rounded-xl text-[10px] font-extrabold transition-all cursor-pointer border ${channelFilter === "ALL"
                                    ? "bg-teal-600 text-white border-teal-600 shadow-2xs"
                                    : "bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200/80"
                                }`}
                            >
                                All Channels
                            </button>
                            <button
                                type="button"
                                onClick={() => { setChannelFilter("WHATSAPP_BOT"); setCurrentPage(1); }}
                                className={`px-2.5 py-1 rounded-xl text-[10px] font-extrabold transition-all cursor-pointer flex items-center gap-1 border ${channelFilter === "WHATSAPP_BOT"
                                    ? "bg-emerald-600 text-white border-emerald-600 shadow-2xs"
                                    : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border-emerald-200/80"
                                }`}
                            >
                                <WhatsAppIcon sx={{ fontSize: 12 }} />
                                <span>WhatsApp Bot</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => { setChannelFilter("WEBSITE"); setCurrentPage(1); }}
                                className={`px-2.5 py-1 rounded-xl text-[10px] font-extrabold transition-all cursor-pointer flex items-center gap-1 border ${channelFilter === "WEBSITE"
                                    ? "bg-teal-700 text-white border-teal-700 shadow-2xs"
                                    : "bg-teal-50 text-teal-800 hover:bg-teal-100 border-teal-200/80"
                                }`}
                            >
                                <LanguageOutlinedIcon sx={{ fontSize: 12 }} />
                                <span>Website</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => { setChannelFilter("WALK_IN"); setCurrentPage(1); }}
                                className={`px-2.5 py-1 rounded-xl text-[10px] font-extrabold transition-all cursor-pointer flex items-center gap-1 border ${channelFilter === "WALK_IN"
                                    ? "bg-slate-800 text-white border-slate-800 shadow-2xs"
                                    : "bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200/80"
                                }`}
                            >
                                <DirectionsWalkOutlinedIcon sx={{ fontSize: 12 }} />
                                <span>Walk-In</span>
                            </button>
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
                                        ? "Try searching by phone number (e.g. 03xx or +92) or click '+ Register New Walk-In'."
                                        : "Use the '+ Register New Walk-In' tab to register a new walk-in arrival."}
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
                                            <div
                                                className={`size-11 rounded-2xl flex items-center justify-center font-black text-xs shrink-0 transition-all ${
                                                    isSelected
                                                        ? "bg-teal-600 text-white shadow-xs"
                                                        : "bg-teal-50 text-teal-800 border border-teal-200/80 group-hover:border-teal-400"
                                                }`}
                                            >
                                                {(patient.name || "P").charAt(0).toUpperCase()}
                                            </div>

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
                                                    <span className="font-bold text-slate-700">
                                                        {visitCount} {visitCount === 1 ? "Visit" : "Visits"}
                                                    </span>
                                                </div>

                                                {/* Channels this patient booked through */}
                                                {getPatientChannelPills(patient.appointments)}

                                                {/* Plan or Medical Tag */}
                                                {hasActivePlan && (
                                                    <div className="mt-1 flex items-center gap-1 text-[10px] font-extrabold text-teal-700 bg-teal-50/90 px-2 py-0.5 rounded-md border border-teal-200/60 w-fit">
                                                        <AutoAwesomeOutlinedIcon sx={{ fontSize: 11 }} />
                                                        <span>Active Plan: {patient.patientTreatments![0].treatment.name}</span>
                                                    </div>
                                                )}
                                            </div>

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

                {/* RIGHT PANEL: Patient Dossier & Fast Booking Studio */}
                <div className={`lg:col-span-7 xl:col-span-8 space-y-5 ${selectedPatientId ? "block" : "hidden lg:block"}`}>
                    {loadingHistory ? (
                        <div className="bg-white rounded-3xl border border-slate-200/80 p-16 text-center shadow-2xs space-y-3">
                            <AutorenewOutlinedIcon sx={{ fontSize: 32 }} className="text-teal-600 animate-spin mx-auto" />
                            <p className="text-sm font-extrabold text-slate-900">Loading Clinical Records...</p>
                            <p className="text-xs text-slate-400">Retrieving patient treatment history and operatory telemetry.</p>
                        </div>
                    ) : history && currentPatient ? (
                        <div className="space-y-5 animate-fade-in">
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

                                            {/* Booking Channels Source Bar */}
                                            {patientAllChannels.length > 0 && (
                                                <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Booked via:</span>
                                                    {patientAllChannels.map((ch) => (
                                                        <span key={ch}>
                                                            {getChannelBadge(ch)}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
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

                            {/* 2. Active Multi-Session Treatment Plans Card */}
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
                                            <div>
                                                <h3 className="text-sm font-extrabold text-slate-900">
                                                    New Booking for {history.patient.name}
                                                </h3>
                                                <p className="text-[11px] text-slate-500 font-medium">
                                                    This visit will append directly to this patient&apos;s records and sync across Website, WhatsApp, and Google Calendar.
                                                </p>
                                            </div>
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

                                            {/* Attending Specialist / Doctor */}
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
                                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                        <div>
                                            <h3 className="text-sm font-extrabold text-slate-900">Treatment & Visit Log</h3>
                                            <p className="text-[11px] text-slate-500 font-medium">All visits from Website, WhatsApp Chatbot, and Reception Walk-Ins</p>
                                        </div>

                                        {/* History Channel Filter */}
                                        <div className="flex items-center gap-1 bg-white border border-slate-200/90 p-1 rounded-xl shadow-2xs">
                                            <button
                                                type="button"
                                                onClick={() => setHistoryChannelFilter("ALL")}
                                                className={`px-2 py-0.5 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer ${historyChannelFilter === "ALL" ? "bg-teal-600 text-white" : "text-slate-600 hover:text-slate-900"}`}
                                            >
                                                All ({history.appointments.length})
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setHistoryChannelFilter("WHATSAPP_BOT")}
                                                className={`px-2 py-0.5 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer flex items-center gap-0.5 ${historyChannelFilter === "WHATSAPP_BOT" ? "bg-emerald-600 text-white" : "text-emerald-700 hover:text-emerald-900"}`}
                                            >
                                                <WhatsAppIcon sx={{ fontSize: 11 }} />
                                                <span>Bot ({history.appointments.filter(a => a.bookedBy === "WHATSAPP_BOT").length})</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setHistoryChannelFilter("WEBSITE")}
                                                className={`px-2 py-0.5 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer flex items-center gap-0.5 ${historyChannelFilter === "WEBSITE" ? "bg-teal-600 text-white" : "text-teal-700 hover:text-teal-900"}`}
                                            >
                                                <LanguageOutlinedIcon sx={{ fontSize: 11 }} />
                                                <span>Web ({history.appointments.filter(a => a.bookedBy === "WEBSITE").length})</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setHistoryChannelFilter("WALK_IN")}
                                                className={`px-2 py-0.5 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer flex items-center gap-0.5 ${historyChannelFilter === "WALK_IN" ? "bg-slate-700 text-white" : "text-slate-600 hover:text-slate-900"}`}
                                            >
                                                <DirectionsWalkOutlinedIcon sx={{ fontSize: 11 }} />
                                                <span>Desk ({history.appointments.filter(a => a.bookedBy === "WALK_IN").length})</span>
                                            </button>
                                        </div>
                                    </div>

                                    {!filteredHistoryAppointments || filteredHistoryAppointments.length === 0 ? (
                                        <div className="p-10 text-center space-y-2">
                                            <AssignmentOutlinedIcon sx={{ fontSize: 32 }} className="text-slate-300 mx-auto" />
                                            <p className="text-xs font-bold text-slate-700">No Appointments Found</p>
                                            <p className="text-[11px] text-slate-400">No visits recorded under this channel filter.</p>
                                        </div>
                                    ) : (
                                        <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
                                            {filteredHistoryAppointments.map((apt) => (
                                                <div key={apt.id} className="p-4 sm:p-5 space-y-2.5 hover:bg-slate-50/60 transition-colors">
                                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5">
                                                        <div className="flex items-center gap-2.5">
                                                            <div className="size-9 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center shrink-0">
                                                                <MedicalServicesOutlinedIcon sx={{ fontSize: 16, color: "#0D9488" }} />
                                                            </div>
                                                            <div>
                                                                <div className="flex items-center gap-2 flex-wrap">
                                                                    <p className="text-xs sm:text-sm font-black text-slate-900">
                                                                        {apt.treatment.name}
                                                                    </p>
                                                                    {getChannelBadge(apt.bookedBy)}
                                                                </div>
                                                                <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                                                                    {formatDate(apt.startTime, "short")} · {formatTime(apt.startTime)}
                                                                    {apt.doctor && (
                                                                        <span className="text-slate-600 font-bold ml-1.5">
                                                                            · {apt.doctor.name} {apt.doctor.operatory ? `(${apt.doctor.operatory.split("·")[0].trim()})` : ""}
                                                                        </span>
                                                                    )}
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

                                                    {/* Booking notes / presenting complaints from website or WhatsApp bot */}
                                                    {apt.notes && (
                                                        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-[11px] text-slate-600">
                                                            <span className="font-extrabold text-slate-800">Booking Note:</span> {apt.notes}
                                                        </div>
                                                    )}

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
                        /* EMPTY WORKSPACE CANVAS */
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
                                        Click any patient in the directory on the left or search by MRN, phone, or name. You can view all their past visits from Website, WhatsApp Chatbot, or Walk-In, and instantly schedule their next visit.
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
