"use client";

import { useState, useEffect, useCallback, useMemo, FormEvent } from "react";
import { useRouter } from "next/navigation";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import DirectionsWalkOutlinedIcon from "@mui/icons-material/DirectionsWalkOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import AutorenewOutlinedIcon from "@mui/icons-material/AutorenewOutlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";

import { fetchApi } from "@/lib/api-client";
import { isSundayInKarachi } from "@/lib/timezone";
import { PremiumLoader } from "@/components/ui/premium-loader";

import PatientDirectorySearch from "./PatientDirectorySearch";
import PatientDossierHeader from "./PatientDossierHeader";
import ActivePlanBanner from "./ActivePlanBanner";
import WalkInBookingForm from "./WalkInBookingForm";
import PatientHistoryTimeline from "./PatientHistoryTimeline";

import type {
    TreatmentOption,
    PatientResult,
    PatientHistory,
    BookingForm,
    SuccessData,
} from "./types";

interface RegisteredPatientWorkspaceProps {
    treatments: TreatmentOption[];
    onSuccess: (data: SuccessData) => void;
}

export function getChannelBadge(bookedBy?: string) {
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
                <span>Website Portal</span>
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

export function getPatientChannelPills(appointments?: { bookedBy?: string }[]) {
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

function SundayWarning({ date }: { date: string }) {
    if (!date || !isSundayInKarachi(date)) return null;
    return (
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
            <span>Clinic is closed on Sundays for scheduled appointments.</span>
        </div>
    );
}

export default function RegisteredPatientWorkspace({
    treatments,
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
    });
    const [booking, setBooking] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeDetailTab, setActiveDetailTab] = useState<"book" | "history">("book");
    const router = useRouter();

    // Fetch patient directory with channel filter and phone normalization
    const fetchPatients = useCallback(async (q: string, page: number, ch: string = channelFilter) => {
        setSearching(true);
        try {
            const chParam = ch !== "ALL" ? `&channel=${ch}` : "";
            const res = await fetchApi(`/api/admin/walk-in/search?q=${encodeURIComponent(q)}&page=${page}&limit=12${chParam}`);
            if (res.ok) {
                const data = await res.json();
                setResults(data.patients || []);
                setTotalPages(data.pagination?.totalPages || 1);
                setTotalPatients(data.pagination?.total || 0);
            }
        } catch (err) {
            console.error("Patient search error:", err);
        } finally {
            setSearching(false);
        }
    }, [channelFilter]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            fetchPatients(searchQuery, currentPage, channelFilter);
        }, 300);
        return () => clearTimeout(timeout);
    }, [searchQuery, currentPage, channelFilter, fetchPatients]);

    const goToPage = (p: number) => {
        if (p >= 1 && p <= totalPages) {
            setCurrentPage(p);
        }
    };

    // Load Patient Clinical History
    const loadHistory = async (patientId: string) => {
        setSelectedPatientId(patientId);
        setLoadingHistory(true);
        setError(null);
        try {
            const res = await fetchApi(`/api/patients/${patientId}/history`);
            if (res.ok) {
                const data: PatientHistory = await res.json();
                setHistory(data);

                // Auto-fill active plan if available
                const activePlan = data.plans?.find((p) => p.clinicalStatus === "IN_PROGRESS");
                if (activePlan) {
                    setBookingForm((prev) => ({
                        ...prev,
                        treatmentId: activePlan.treatment.id,
                        patientTreatmentId: activePlan.id,
                    }));
                } else {
                    setBookingForm((prev) => ({
                        ...prev,
                        treatmentId: treatments[0]?.id || "",
                        patientTreatmentId: undefined,
                    }));
                }
            } else {
                throw new Error("Failed to load patient history");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error loading patient dossier");
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
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong while booking");
        } finally {
            setBooking(false);
        }
    };

    // Selected Patient Object
    const currentPatient = useMemo(() => {
        if (!selectedPatientId) return null;
        return results.find((p) => p.id === selectedPatientId) || (history?.patient ? { ...history.patient, _count: { appointments: history.appointments?.length || 0 } } : null);
    }, [selectedPatientId, results, history]);

    // Unique channels patient has used across their entire history
    const patientAllChannels = useMemo(() => {
        if (!history?.appointments) return [];
        return Array.from(new Set(history.appointments.map((a) => a.bookedBy).filter(Boolean))) as string[];
    }, [history]);

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

            {/* CONDITIONAL FULL-WIDTH WORKSPACE */}
            {!selectedPatientId ? (
                <PatientDirectorySearch
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    channelFilter={channelFilter}
                    setChannelFilter={setChannelFilter}
                    results={results}
                    searching={searching}
                    totalPatients={totalPatients}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    goToPage={goToPage}
                    onSelectPatient={loadHistory}
                    channelPillsRenderer={getPatientChannelPills}
                />
            ) : (
                /* SELECTED PATIENT DOSSIER & FAST BOOKING STUDIO */
                <div className="space-y-5 animate-fade-in">
                    {loadingHistory ? (
                        <div className="bg-white rounded-3xl border border-slate-200/80 p-16 text-center shadow-2xs space-y-3">
                            <AutorenewOutlinedIcon sx={{ fontSize: 32 }} className="text-teal-600 animate-spin mx-auto" />
                            <p className="text-sm font-extrabold text-slate-900">Loading Clinical Records...</p>
                            <p className="text-xs text-slate-400">Retrieving patient treatment history and clinical profile.</p>
                        </div>
                    ) : history && currentPatient ? (
                        <div className="space-y-5">
                            {/* 1. Patient Dossier Header */}
                            <PatientDossierHeader
                                patient={history.patient}
                                visitsCount={history.appointments?.length || 0}
                                patientAllChannels={patientAllChannels}
                                channelBadgeRenderer={getChannelBadge}
                                onClearSelection={handleClearSelection}
                            />

                            {/* 2. Active Multi-Session Treatment Plans Banner */}
                            <ActivePlanBanner plans={history.plans} />

                            {/* 3. Segmented Action Switcher Tabs */}
                            <div className="flex items-center gap-2 pt-1">
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

                            {/* 4. Sub-Panel Switcher */}
                            {activeDetailTab === "book" ? (
                                <WalkInBookingForm
                                    patientName={history.patient.name}
                                    treatments={treatments}
                                    bookingForm={bookingForm}
                                    setBookingForm={setBookingForm}
                                    booking={booking}
                                    onSubmit={handleBook}
                                    sundayWarningRenderer={(d) => <SundayWarning date={d} />}
                                    isSundayChecker={isSundayInKarachi}
                                />
                            ) : (
                                <PatientHistoryTimeline
                                    appointments={history.appointments || []}
                                    historyChannelFilter={historyChannelFilter}
                                    setHistoryChannelFilter={setHistoryChannelFilter}
                                    channelBadgeRenderer={getChannelBadge}
                                />
                            )}
                        </div>
                    ) : null}
                </div>
            )}

            {booking && <PremiumLoader text="Securing operatory appointment slot..." variant="inline" />}
        </div>
    );
}
