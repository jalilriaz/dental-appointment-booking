"use client";

import { useState, useMemo, useCallback, useEffect, Fragment } from "react";
import { checkoutAppointment } from "@/app/actions/billing";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import FilterListOutlinedIcon from "@mui/icons-material/FilterListOutlined";
import ChevronLeftOutlinedIcon from "@mui/icons-material/ChevronLeftOutlined";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import AutorenewOutlinedIcon from "@mui/icons-material/AutorenewOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PersonOffOutlinedIcon from "@mui/icons-material/PersonOffOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import EventBusyOutlinedIcon from "@mui/icons-material/EventBusyOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import MedicalServicesOutlinedIcon from "@mui/icons-material/MedicalServicesOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import DirectionsWalkOutlinedIcon from "@mui/icons-material/DirectionsWalkOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import { format } from "date-fns";
import { DatePicker } from "@/components/ui/date-picker";
import { PremiumLoader } from "@/components/ui/premium-loader";
import { fetchApi } from "@/lib/api-client";
import ClinicalNoteDialog from "@/components/admin/ClinicalNoteDialog";
import ReceiptDialog from "@/components/admin/ReceiptDialog";
import PatientHistoryDialog from "@/components/shared/PatientHistoryDialog";
import CheckoutDialog from "@/components/shared/CheckoutDialog";
import SendPrecautionsModal from "@/components/shared/SendPrecautionsModal";
import StatusBadge from "@/components/shared/StatusBadge";
import AppointmentsCalendar from "@/components/admin/AppointmentsCalendar";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";
import EmptyState from "@/components/shared/EmptyState";
import { formatPKR, formatDate, formatTime, statusColors } from "@/lib/utils";
import type { Appointment, TimeSlot } from "@/lib/types";





// ─── Reschedule Dialog ──────────────────────────────────────

function RescheduleDialog({
    appointment,
    open,
    onOpenChange,
    onSuccess,
}: {
    appointment: Appointment;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}) {
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("");
    const [slots, setSlots] = useState<TimeSlot[]>([]);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [dayOff, setDayOff] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const today = new Date().toISOString().split("T")[0];
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 90);
    const maxDateStr = maxDate.toISOString().split("T")[0];

    const selectedSlot = slots.find((s) => s.value === selectedTime);

    const fetchSlots = useCallback(async () => {
        if (!selectedDate) return;
        setLoadingSlots(true);
        setSlots([]);
        setSelectedTime("");
        setDayOff(false);
        setError("");
        try {
            const params = new URLSearchParams({
                date: selectedDate,
                treatmentId: appointment.treatment?.id || "",
                excludeAppointmentId: appointment.id,
            });
            const res = await fetchApi(`/api/appointments/availability?${params}`);
            const data = await res.json();
            if (data.dayOff) {
                setDayOff(true);
                setSlots([]);
            } else {
                setSlots(data.slots || []);
            }
        } catch {
            setError("Failed to load available time slots");
        } finally {
            setLoadingSlots(false);
        }
    }, [selectedDate, appointment.treatment.id, appointment.id]);

    useEffect(() => {
        if (selectedDate) fetchSlots();
    }, [selectedDate, fetchSlots]);

    // Reset state when dialog opens
    useEffect(() => {
        if (open) {
            setSelectedDate("");
            setSelectedTime("");
            setSlots([]);
            setError("");
            setDayOff(false);
        }
    }, [open]);

    function handleDateChange(value: string) {
        const [y, m, d] = value.split("-").map(Number);
        const date = new Date(y, m - 1, d);
        if (date.getDay() === 0) {
            toast.warning("Clinic Closed", { description: "Sunday is a clinic off day. Please select another date." });
            setSelectedDate("");
            return;
        }
        setSelectedDate(value);
        setSelectedTime("");
    }

    async function handleReschedule() {
        if (!selectedDate || !selectedTime) return;
        setSubmitting(true);
        setError("");
        try {
            const res = await fetchApi(`/api/appointments/${appointment.id}/reschedule`, {
                method: "PATCH",
                body: JSON.stringify({ date: selectedDate, time: selectedTime }),
            });
            const data = await res.json();
            if (res.ok && data.success) {
                toast.success("Appointment Rescheduled", { description: "The appointment has been moved to the new date and time." });
                onOpenChange(false);
                onSuccess();
            } else {
                setError(data.error || "Failed to reschedule appointment");
                if (data.code === "DOUBLE_BOOKING") fetchSlots();
            }
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg bg-white border-slate-200 text-slate-900 shadow-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-slate-900">
                        <RefreshOutlinedIcon className="size-5 text-teal-600" />
                        Reschedule Appointment
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Current appointment info */}
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                        <p className="text-xs text-slate-500 uppercase tracking-wide mb-2 font-semibold">Current Appointment</p>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div><span className="text-slate-500">Patient:</span> <span className="font-semibold text-slate-900">{appointment.patient?.name || "Unknown"}</span></div>
                            <div><span className="text-slate-500">Treatment:</span> <span className="font-semibold text-slate-900">{appointment.treatment.name}</span></div>
                            <div>
                                <span className="text-slate-500">Date:</span>{" "}
                                <span className="font-semibold text-slate-900">
                                    {formatDate(appointment.startTime, "short")}
                                </span>
                            </div>
                            <div>
                                <span className="text-slate-500">Time:</span>{" "}
                                <span className="font-semibold text-slate-900">
                                    {formatTime(appointment.startTime)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* New date picker */}
                    <div>
                        <Label className="text-sm font-semibold text-slate-700 mb-2 block">
                            <CalendarTodayOutlinedIcon className="size-4 inline mr-1 text-teal-600" />
                            Select New Date
                        </Label>
                        <DatePicker
                            value={selectedDate}
                            onChange={(val) => handleDateChange(val)}
                            min={today}
                            max={maxDateStr}
                            placeholder="Pick a new date"
                            disabledDays={(date) => date.getDay() === 0}
                        />
                    </div>

                    {/* Time slots */}
                    {selectedDate && (
                        <div>
                            <Label className="text-sm font-semibold text-slate-700 mb-2 block">
                                <AccessTimeOutlinedIcon className="size-4 inline mr-1 text-teal-600" />
                                Select New Time
                                <span className="font-normal text-slate-500 ml-2">
                                    ({appointment.treatment.durationMin} min appointment)
                                </span>
                            </Label>

                            {loadingSlots ? (
                                <div className="flex items-center justify-center py-6">
                                    <AutorenewOutlinedIcon className="size-5 animate-spin text-teal-600" />
                                    <span className="ml-2 text-sm text-slate-500">Loading slots...</span>
                                </div>
                            ) : dayOff ? (
                                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm">
                                    ⚠️ Sunday is a clinic off day. Please select another date.
                                </div>
                            ) : slots.length === 0 ? (
                                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 text-sm">
                                    No available slots for this date.
                                </div>
                            ) : (
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto">
                                    {slots.map((slot) => (
                                        <button
                                            key={slot.value}
                                            type="button"
                                            disabled={!slot.available}
                                            onClick={() => setSelectedTime(slot.value)}
                                            className={`p-2.5 rounded-lg border-2 text-center transition-premium text-xs ${!slot.available
                                                ? "border-slate-100 bg-slate-50 text-slate-400 cursor-not-allowed line-through"
                                                : selectedTime === slot.value
                                                    ? "border-teal-600 bg-teal-50 text-teal-800 ring-1 ring-teal-500 font-semibold"
                                                    : "border-slate-200 text-slate-700 hover:border-teal-500 hover:bg-teal-50/50"
                                                }`}
                                        >
                                            {slot.label}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {selectedTime && selectedSlot && (
                                <div className="mt-3 p-3 bg-teal-50 border border-teal-200 rounded-lg">
                                    <p className="text-sm text-teal-900 font-medium">
                                        ⏰ New time: <strong className="text-teal-950">{selectedSlot.label} – {selectedSlot.endLabel}</strong> ({appointment.treatment.durationMin} min)
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
                            {error}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex justify-end gap-2 pt-2">
                        <Button variant="outline" onClick={() => onOpenChange(false)} className="border-slate-300 text-slate-700 hover:bg-slate-100">
                            Cancel
                        </Button>
                        <Button
                            onClick={handleReschedule}
                            disabled={!selectedDate || !selectedTime || submitting}
                            className="bg-teal-600 hover:bg-teal-700 text-white font-semibold border-0"
                        >
                            {submitting ? (
                                <><AutorenewOutlinedIcon className="mr-2 size-4 animate-spin" /> Rescheduling...</>
                            ) : (
                                <><RefreshOutlinedIcon className="mr-2 size-4" /> Confirm Reschedule</>
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
            {submitting && <PremiumLoader text="Rescheduling Appointment..." />}
        </Dialog>
    );
}

// ─── Main Table ─────────────────────────────────────────────

export default function AppointmentsTable({
    appointments: initialAppointments,
    userRole = "ADMIN"
}: {
    appointments: Appointment[],
    userRole?: string
}) {
    const router = useRouter();
    const [appointments, setAppointments] = useState(initialAppointments);

    // Sync server-refreshed data into local state so that router.refresh()
    // after reschedule/booking/cancel is immediately reflected in the table
    useEffect(() => {
        setAppointments(initialAppointments);
    }, [initialAppointments]);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<string[]>([]);
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [treatmentFilter, setTreatmentFilter] = useState("");
    const [page, setPage] = useState(1);
    const [timelineFilter, setTimelineFilter] = useState<"all_active" | "today" | "tomorrow" | "upcoming" | "past" | "all">("all_active");
    const [perPage, setPerPage] = useState(25);
    const [detailId, setDetailId] = useState<string | null>(null);
    const [rescheduleApt, setRescheduleApt] = useState<Appointment | null>(null);
    const [cancellingId, setCancellingId] = useState<string | null>(null);
    const [checkingOutId, setCheckingOutId] = useState<string | null>(null);
    const [confirmCancelId, setConfirmCancelId] = useState<string | null>(null);
    const [checkoutApt, setCheckoutApt] = useState<Appointment | null>(null);
    const [amountValue, setAmountValue] = useState<string>("");
    const [discountValue, setDiscountValue] = useState<string>("0");
    const [receiptApt, setReceiptApt] = useState<Appointment | null>(null);
    const [historyPatientId, setHistoryPatientId] = useState<string | null>(null);
    const [precautionsApt, setPrecautionsApt] = useState<Appointment | null>(null);
    const [adminConfirmPastApt, setAdminConfirmPastApt] = useState<Appointment | null>(null);
    const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
    const [doctorFilter, setDoctorFilter] = useState("");

    // Helper to determine the bucket of an appointment based on today's local date
    const getAptBucket = useCallback((startTimeStr: string) => {
        const aptDate = new Date(startTimeStr);
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        const startOfTomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime();
        const startOfDayAfter = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2).getTime();

        const aptDayStart = new Date(aptDate.getFullYear(), aptDate.getMonth(), aptDate.getDate()).getTime();

        if (aptDayStart === startOfToday) return "today";
        if (aptDayStart === startOfTomorrow) return "tomorrow";
        if (aptDayStart >= startOfDayAfter) return "upcoming";
        return "past";
    }, []);

    // 4 KPI Summary Metrics from Screen 1
    const kpiStats = useMemo(() => {
        let today = 0;
        let upcoming = 0;
        let completed = 0;
        let cancelled = 0;

        for (const a of appointments) {
            const bucket = getAptBucket(a.startTime);
            if (bucket === "today") {
                today++;
            } else if (bucket === "tomorrow" || bucket === "upcoming") {
                upcoming++;
            }
            if (a.status === "COMPLETED") {
                completed++;
            } else if (a.status === "CANCELLED" || a.status === "NO_SHOW") {
                cancelled++;
            }
        }
        return { today, upcoming, completed, cancelled };
    }, [appointments, getAptBucket]);

    // Assigned specialist mapping
    const getDoctorForAppointment = useCallback((treatmentName: string) => {
        const t = treatmentName.toLowerCase();
        if (t.includes("brace") || t.includes("ortho") || t.includes("align")) {
            return { name: "Dr. Ayesha Malik", role: "Orthodontist", operatory: "Chair 2 · Ortho Bay" };
        }
        if (t.includes("rct") || t.includes("canal") || t.includes("scaling") || t.includes("cleaning")) {
            return { name: "Dr. Hamza Tariq", role: "Endodontist", operatory: "Chair 3 · Rotary Bay" };
        }
        return { name: "Dr. Sheriyaar", role: "Lead Surgeon", operatory: "Chair 1 · Surgical Suite" };
    }, []);

    // Quick counts for the timeline switcher
    const timelineCounts = useMemo(() => {
        let today = 0;
        let tomorrow = 0;
        let upcoming = 0;
        let past = 0;
        let active = 0;

        for (const a of appointments) {
            const bucket = getAptBucket(a.startTime);
            if (bucket === "today") {
                today++;
                if (a.status !== "CANCELLED") active++;
            } else if (bucket === "tomorrow") {
                tomorrow++;
                if (a.status !== "CANCELLED") active++;
            } else if (bucket === "upcoming") {
                upcoming++;
                if (a.status !== "CANCELLED") active++;
            } else {
                past++;
            }
        }
        return { today, tomorrow, upcoming, past, active, total: appointments.length };
    }, [appointments, getAptBucket]);

    // Get unique treatments for the dropdown
    const uniqueTreatments = useMemo(() => {
        const names = new Set(appointments.map(a => a.treatment.name));
        return Array.from(names).sort();
    }, [appointments]);

    const filtered = useMemo(() => {
        return appointments.filter((a) => {
            const matchSearch = !search ||
                a.patient?.name?.toLowerCase().includes(search.toLowerCase()) ||
                a.treatment.name.toLowerCase().includes(search.toLowerCase()) ||
                a.patient?.phone?.toLowerCase().includes(search.toLowerCase());
            const matchStatus = statusFilter.length === 0 || statusFilter.includes(a.status);
            const aptDate = new Date(a.startTime);
            const matchDateFrom = !dateFrom || aptDate >= new Date(dateFrom + "T00:00:00");
            const matchDateTo = !dateTo || aptDate <= new Date(dateTo + "T23:59:59");
            const matchTreatment = !treatmentFilter || a.treatment.name === treatmentFilter;

            const matchDoctor = !doctorFilter || (
                doctorFilter === "sheriyaar" ? (a.treatment.name.toLowerCase().includes("implant") || a.treatment.name.toLowerCase().includes("surgery") || a.treatment.name.toLowerCase().includes("whitening") || a.bookedBy === "WEBSITE") :
                doctorFilter === "ayesha" ? (a.treatment.name.toLowerCase().includes("brace") || a.treatment.name.toLowerCase().includes("ortho") || a.treatment.name.toLowerCase().includes("align")) :
                doctorFilter === "hamza" ? (a.treatment.name.toLowerCase().includes("rct") || a.treatment.name.toLowerCase().includes("canal") || a.treatment.name.toLowerCase().includes("scaling") || a.treatment.name.toLowerCase().includes("cleaning")) : true
            );

            // Timeline filter
            const bucket = getAptBucket(a.startTime);
            let matchTimeline = true;
            if (timelineFilter === "today") matchTimeline = bucket === "today";
            else if (timelineFilter === "tomorrow") matchTimeline = bucket === "tomorrow";
            else if (timelineFilter === "upcoming") matchTimeline = bucket === "upcoming";
            else if (timelineFilter === "past") matchTimeline = bucket === "past";
            else if (timelineFilter === "all_active") matchTimeline = bucket !== "past" || a.status === "SCHEDULED" || a.status === "RESCHEDULED";

            return matchSearch && matchStatus && matchDateFrom && matchDateTo && matchTreatment && matchTimeline && matchDoctor;
        });
    }, [appointments, search, statusFilter, dateFrom, dateTo, treatmentFilter, doctorFilter, timelineFilter, getAptBucket]);

    // Strict chronological sequence:
    // Today comes first (sorted by 2 PM, then 3 PM, etc.)
    // Tomorrow comes next (sorted by 10 AM, then 2 PM, etc.)
    // Upcoming comes next (sorted day by day, time by time)
    // Past comes next (most recent first)
    const sorted = useMemo(() => {
        return [...filtered].sort((a, b) => {
            const timeA = new Date(a.startTime).getTime();
            const timeB = new Date(b.startTime).getTime();
            const bucketA = getAptBucket(a.startTime);
            const bucketB = getAptBucket(b.startTime);

            if (timelineFilter === "all_active" || timelineFilter === "all") {
                const rank: Record<string, number> = {
                    today: 1,
                    tomorrow: 2,
                    upcoming: 3,
                    past: 4,
                };
                const rankA = rank[bucketA] ?? 5;
                const rankB = rank[bucketB] ?? 5;

                if (rankA !== rankB) {
                    return rankA - rankB; // Today first, then Tomorrow, then Upcoming, then Past
                }

                // If in same bucket (e.g. both Today):
                // Strict chronological sequence: 2 PM comes before 3 PM!
                if (bucketA === "past") {
                    return timeB - timeA;
                }
                return timeA - timeB;
            }

            if (timelineFilter === "past") {
                return timeB - timeA;
            }

            // For "today", "tomorrow", "upcoming":
            return timeA - timeB; // Earliest time slot first
        });
    }, [filtered, timelineFilter, getAptBucket]);

    const totalPages = Math.ceil(sorted.length / perPage);
    const paged = sorted.slice((page - 1) * perPage, page * perPage);

    const toggleStatus = (s: string) => {
        setStatusFilter((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);
        setPage(1);
    };

    const selectedApt = detailId ? appointments.find((a) => a.id === detailId) : null;

    function handleRescheduleSuccess() {
        // Refresh server components to get fresh data instantly
        router.refresh();
    }

    async function handleCancelConfirmed(aptId: string) {
        setCancellingId(aptId);
        setConfirmCancelId(null);
        try {
            const res = await fetchApi(`/api/appointments/${aptId}/reschedule`, {
                method: "PATCH",
                body: JSON.stringify({ cancel: true }),
            });
            setAppointments((prev) =>
                prev.map((a) => a.id === aptId ? { ...a, status: "CANCELLED" } : a)
            );
            toast.success("Appointment Cancelled", { description: "The appointment has been cancelled successfully." });
        } catch {
            toast.error("Cancellation Failed", { description: "Failed to cancel appointment. Please try again." });
        } finally {
            setCancellingId(null);
        }
    }

    async function handleStatusChange(aptId: string, status: string, amountPaid?: number, discount?: number) {
        setCheckingOutId(aptId);
        try {
            const res = await fetchApi(`/api/appointments/${aptId}/status`, {
                method: "PATCH",
                body: JSON.stringify({
                    status,
                    amountPaid: status === "COMPLETED" ? (amountPaid ?? 0) : undefined,
                    discount: status === "COMPLETED" ? (discount ?? 0) : undefined,
                }),
            });
            if (res.ok) {
                const data = await res.json();
                setAppointments((prev) =>
                    prev.map((a) => a.id === aptId ? {
                        ...a,
                        status,
                        amountPaid: status === "COMPLETED" ? (amountPaid || 0) : a.amountPaid
                    } : a)
                );
                if (status === "COMPLETED") {
                    toast.success("Checked Out", { description: `Rs. ${(amountPaid || 0).toLocaleString()} recorded for visit.` });
                }
            } else {
                toast.error("Update Failed", { description: "Failed to update appointment status." });
            }
        } catch {
            toast.error("Update Failed", { description: "Failed to update appointment status. Please try again." });
        } finally {
            setCheckingOutId(null);
        }
    }

    const hasActiveFilters = search || statusFilter.length > 0 || dateFrom || dateTo || treatmentFilter || timelineFilter !== "all_active";

    function clearAllFilters() {
        setSearch("");
        setStatusFilter([]);
        setDateFrom("");
        setDateTo("");
        setTreatmentFilter("");
        setTimelineFilter("all_active");
        setPage(1);
    }

    return (
        <div className="space-y-5 font-sans">
            {/* Top 4 KPI Summary Cards Styled to Reception Dashboard Theme */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {/* Today's Appointments */}
                <div
                    onClick={() => {
                        setTimelineFilter("today");
                        setStatusFilter([]);
                        setPage(1);
                    }}
                    className={`p-5 rounded-3xl border transition-all cursor-pointer ${
                        timelineFilter === "today" && statusFilter.length === 0
                            ? "bg-teal-50/60 border-teal-500 ring-2 ring-teal-500/20 shadow-xs"
                            : "bg-white border-slate-200/80 hover:border-teal-300 shadow-2xs hover:shadow-xs"
                    }`}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Today&apos;s Appointments</p>
                            <p className="text-3xl font-black text-slate-900 tracking-tight mt-1">{kpiStats.today}</p>
                        </div>
                        <div className="size-12 rounded-2xl bg-teal-50 border border-teal-200/80 text-teal-700 flex items-center justify-center shadow-2xs">
                            <CalendarTodayOutlinedIcon sx={{ fontSize: 20 }} />
                        </div>
                    </div>
                    <p className="text-[11px] font-semibold text-teal-700 mt-2 flex items-center gap-1.5">
                        <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Live on-site schedule</span>
                    </p>
                </div>

                {/* Upcoming Appointments */}
                <div
                    onClick={() => {
                        setTimelineFilter("upcoming");
                        setStatusFilter([]);
                        setPage(1);
                    }}
                    className={`p-5 rounded-3xl border transition-all cursor-pointer ${
                        timelineFilter === "upcoming" && statusFilter.length === 0
                            ? "bg-teal-50/60 border-teal-500 ring-2 ring-teal-500/20 shadow-xs"
                            : "bg-white border-slate-200/80 hover:border-teal-300 shadow-2xs hover:shadow-xs"
                    }`}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Upcoming Appointments</p>
                            <p className="text-3xl font-black text-slate-900 tracking-tight mt-1">{kpiStats.upcoming}</p>
                        </div>
                        <div className="size-12 rounded-2xl bg-teal-50/70 border border-teal-200/60 text-teal-700 flex items-center justify-center shadow-2xs">
                            <AccessTimeOutlinedIcon sx={{ fontSize: 20 }} />
                        </div>
                    </div>
                    <p className="text-[11px] font-semibold text-slate-500 mt-2">
                        Next 40 days booked
                    </p>
                </div>

                {/* Completed Appointments */}
                <div
                    onClick={() => {
                        setStatusFilter(["COMPLETED"]);
                        setTimelineFilter("all");
                        setPage(1);
                    }}
                    className={`p-5 rounded-3xl border transition-all cursor-pointer ${
                        statusFilter.includes("COMPLETED")
                            ? "bg-emerald-50/60 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs"
                            : "bg-white border-slate-200/80 hover:border-emerald-300 shadow-2xs hover:shadow-xs"
                    }`}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Completed Appointments</p>
                            <p className="text-3xl font-black text-slate-900 tracking-tight mt-1">{kpiStats.completed}</p>
                        </div>
                        <div className="size-12 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-emerald-700 flex items-center justify-center shadow-2xs">
                            <CheckCircleOutlineOutlinedIcon sx={{ fontSize: 20 }} />
                        </div>
                    </div>
                    <p className="text-[11px] font-semibold text-emerald-700 mt-2">
                        Discharged &amp; reconciled
                    </p>
                </div>

                {/* Cancelled / Missed Appointments */}
                <div
                    onClick={() => {
                        setStatusFilter(["CANCELLED", "NO_SHOW"]);
                        setTimelineFilter("all");
                        setPage(1);
                    }}
                    className={`p-5 rounded-3xl border transition-all cursor-pointer ${
                        statusFilter.includes("CANCELLED") || statusFilter.includes("NO_SHOW")
                            ? "bg-rose-50/60 border-rose-500 ring-2 ring-rose-500/20 shadow-xs"
                            : "bg-white border-slate-200/80 hover:border-rose-300 shadow-2xs hover:shadow-xs"
                    }`}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Cancelled / Missed</p>
                            <p className="text-3xl font-black text-slate-900 tracking-tight mt-1">{kpiStats.cancelled}</p>
                        </div>
                        <div className="size-12 rounded-2xl bg-rose-50 border border-rose-200/80 text-rose-600 flex items-center justify-center shadow-2xs">
                            <PersonOffOutlinedIcon sx={{ fontSize: 20 }} />
                        </div>
                    </div>
                    <p className="text-[11px] font-semibold text-rose-600 mt-2">
                        Released chair slots
                    </p>
                </div>
            </div>

            {/* Quick Timeline Selector & View Toggle */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                {/* Timeline Segmented Tabs */}
                <div className="inline-flex flex-wrap items-center gap-1 p-1 bg-slate-100/90 border border-slate-200/80 rounded-xl shadow-xs">
                    <button
                        onClick={() => { setTimelineFilter("all_active"); setPage(1); }}
                        className={`px-3 py-1.5 text-xs rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
                            timelineFilter === "all_active"
                                ? "bg-white text-teal-900 font-bold shadow-xs border border-slate-200/90"
                                : "text-slate-600 hover:text-slate-900 hover:bg-white/50 font-medium"
                        }`}
                    >
                        <AutoAwesomeOutlinedIcon sx={{ fontSize: 14 }} className="text-teal-600" />
                        <span>Active Schedule</span>
                        <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                            timelineFilter === "all_active" ? "bg-teal-50 text-teal-800 border border-teal-200" : "bg-slate-200/70 text-slate-600"
                        }`}>
                            {timelineCounts.active}
                        </span>
                    </button>

                    <button
                        onClick={() => { setTimelineFilter("today"); setPage(1); }}
                        className={`px-3 py-1.5 text-xs rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
                            timelineFilter === "today"
                                ? "bg-white text-teal-900 font-bold shadow-xs border border-slate-200/90"
                                : "text-slate-600 hover:text-slate-900 hover:bg-white/50 font-medium"
                        }`}
                    >
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span>Today</span>
                        <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                            timelineFilter === "today" ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-slate-200/70 text-slate-600"
                        }`}>
                            {timelineCounts.today}
                        </span>
                    </button>

                    <button
                        onClick={() => { setTimelineFilter("tomorrow"); setPage(1); }}
                        className={`px-3 py-1.5 text-xs rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
                            timelineFilter === "tomorrow"
                                ? "bg-white text-teal-900 font-bold shadow-xs border border-slate-200/90"
                                : "text-slate-600 hover:text-slate-900 hover:bg-white/50 font-medium"
                        }`}
                    >
                        <CalendarMonthOutlinedIcon sx={{ fontSize: 14 }} className="text-slate-500" />
                        <span>Tomorrow</span>
                        <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                            timelineFilter === "tomorrow" ? "bg-teal-50 text-teal-800 border border-teal-200" : "bg-slate-200/70 text-slate-600"
                        }`}>
                            {timelineCounts.tomorrow}
                        </span>
                    </button>

                    <button
                        onClick={() => { setTimelineFilter("upcoming"); setPage(1); }}
                        className={`px-3 py-1.5 text-xs rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
                            timelineFilter === "upcoming"
                                ? "bg-white text-teal-900 font-bold shadow-xs border border-slate-200/90"
                                : "text-slate-600 hover:text-slate-900 hover:bg-white/50 font-medium"
                        }`}
                    >
                        <AccessTimeOutlinedIcon sx={{ fontSize: 14 }} className="text-slate-500" />
                        <span>Upcoming</span>
                        <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                            timelineFilter === "upcoming" ? "bg-teal-50 text-teal-800 border border-teal-200" : "bg-slate-200/70 text-slate-600"
                        }`}>
                            {timelineCounts.upcoming}
                        </span>
                    </button>

                    <button
                        onClick={() => { setTimelineFilter("past"); setPage(1); }}
                        className={`px-3 py-1.5 text-xs rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
                            timelineFilter === "past"
                                ? "bg-white text-slate-900 font-bold shadow-xs border border-slate-200/90"
                                : "text-slate-600 hover:text-slate-900 hover:bg-white/50 font-medium"
                        }`}
                    >
                        <HistoryOutlinedIcon sx={{ fontSize: 14 }} className="text-slate-500" />
                        <span>Past & History</span>
                        <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                            timelineFilter === "past" ? "bg-slate-100 text-slate-800 border border-slate-300" : "bg-slate-200/70 text-slate-600"
                        }`}>
                            {timelineCounts.past}
                        </span>
                    </button>

                    <button
                        onClick={() => { setTimelineFilter("all"); setPage(1); }}
                        className={`px-3 py-1.5 text-xs rounded-lg transition-all cursor-pointer ${
                            timelineFilter === "all"
                                ? "bg-white text-slate-900 font-bold shadow-xs border border-slate-200/90"
                                : "text-slate-600 hover:text-slate-900 hover:bg-white/50 font-medium"
                        }`}
                    >
                        All ({timelineCounts.total})
                    </button>
                </div>

                {/* List / Calendar Toggle */}
                <div className="inline-flex items-center gap-1 p-1 bg-slate-100/90 border border-slate-200/80 rounded-xl shadow-xs">
                    <button
                        onClick={() => setViewMode("list")}
                        className={`px-3 py-1.5 text-xs rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${viewMode === "list" ? "bg-white text-teal-900 font-bold shadow-xs border border-slate-200/90" : "text-slate-600 hover:text-slate-900 font-medium"}`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
                        List
                    </button>
                    <button
                        onClick={() => setViewMode("calendar")}
                        className={`px-3 py-1.5 text-xs rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${viewMode === "calendar" ? "bg-white text-teal-900 font-bold shadow-xs border border-slate-200/90" : "text-slate-600 hover:text-slate-900 font-medium"}`}
                    >
                        <CalendarTodayOutlinedIcon sx={{ fontSize: 14 }} />
                        Calendar
                    </button>
                </div>
            </div>

            {/* Screen 1: Filter Command Center */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-4 sm:p-5 space-y-3.5 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                        <span className="text-base font-black text-slate-900 tracking-tight">Appointments List</span>
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-teal-50 text-teal-800 border border-teal-200">
                            {filtered.length} Results
                        </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                        <span>Active Filter Mode:</span>
                        <strong className="text-slate-800 uppercase font-bold">{timelineFilter.replace("_", " ")}</strong>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                    {/* Search */}
                    <div className="relative md:col-span-5">
                        <SearchOutlinedIcon sx={{ fontSize: 16 }} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <Input
                            placeholder="Search doctor, patient, phone..."
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                            className="pl-10 h-10 bg-slate-50/80 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-teal-600 focus:ring-teal-500/20 rounded-xl text-xs sm:text-sm font-medium"
                        />
                    </div>

                    {/* Doctor Selector (From Screen 1) */}
                    <div className="md:col-span-3">
                        <select
                            value={doctorFilter}
                            onChange={(e) => { setDoctorFilter(e.target.value); setPage(1); }}
                            className="w-full h-10 px-3 rounded-xl bg-slate-50/80 border border-slate-200 text-xs font-bold text-slate-800 focus:bg-white focus:border-teal-600 focus:ring-teal-500/20 focus:outline-none"
                        >
                            <option value="">All Doctors (On-Duty Roster)</option>
                            <option value="sheriyaar">Dr. Sheriyaar (Lead Surgeon)</option>
                            <option value="ayesha">Dr. Ayesha Malik (Orthodontist)</option>
                            <option value="hamza">Dr. Hamza Tariq (Endodontist)</option>
                        </select>
                    </div>

                    {/* Treatment Selector */}
                    <div className="md:col-span-4">
                        <select
                            value={treatmentFilter}
                            onChange={(e) => { setTreatmentFilter(e.target.value); setPage(1); }}
                            className="w-full h-10 px-3 rounded-xl bg-slate-50/80 border border-slate-200 text-xs font-bold text-slate-800 focus:bg-white focus:border-teal-600 focus:ring-teal-500/20 focus:outline-none truncate"
                        >
                            <option value="">All Procedures &amp; Treatments</option>
                            {uniqueTreatments.map((t) => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                    {/* Status Pill Filters */}
                    <div className="flex flex-wrap gap-2 items-center">
                        <span className="text-[11px] text-slate-500 uppercase tracking-wider font-extrabold flex items-center gap-1">
                            <FilterListOutlinedIcon sx={{ fontSize: 13 }} className="text-teal-600" /> Status:
                        </span>
                        {["SCHEDULED", "RESCHEDULED", "COMPLETED", "CANCELLED", "NO_SHOW"].map((s) => {
                            const isSelected = statusFilter.includes(s);
                            let activeBadge = "bg-teal-50 text-teal-800 border-teal-300 font-bold";
                            if (s === "SCHEDULED") activeBadge = "bg-sky-50 text-sky-800 border-sky-300 font-bold";
                            if (s === "RESCHEDULED") activeBadge = "bg-teal-50 text-teal-800 border-teal-300 font-bold";
                            if (s === "COMPLETED") activeBadge = "bg-emerald-50 text-emerald-800 border-emerald-300 font-bold";
                            if (s === "CANCELLED") activeBadge = "bg-rose-50 text-rose-800 border-rose-300 font-bold";
                            if (s === "NO_SHOW") activeBadge = "bg-amber-50 text-amber-800 border-amber-300 font-bold";

                            return (
                                <button
                                    key={s}
                                    onClick={() => toggleStatus(s)}
                                    className={`px-3 py-1 rounded-full text-xs transition-premium cursor-pointer border ${
                                        isSelected
                                            ? `${activeBadge} shadow-2xs`
                                            : "bg-slate-100/80 text-slate-600 hover:bg-slate-200/80 border-slate-200/60 font-medium"
                                    }`}
                                >
                                    {s === "NO_SHOW" ? "Missed" : s.replace("_", " ")}
                                </button>
                            );
                        })}
                    </div>

                    {/* Date Range Picker */}
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[11px] text-slate-500 uppercase tracking-wider font-extrabold flex items-center gap-1">
                            <CalendarTodayOutlinedIcon sx={{ fontSize: 12 }} className="text-teal-600" /> Date:
                        </span>
                        <DatePicker
                            value={dateFrom}
                            onChange={(val) => { setDateFrom(val); setPage(1); }}
                            placeholder="From"
                            compact
                        />
                        <span className="text-slate-400">→</span>
                        <DatePicker
                            value={dateTo}
                            onChange={(val) => { setDateTo(val); setPage(1); }}
                            placeholder="To"
                            compact
                        />
                        {hasActiveFilters && (
                            <button
                                onClick={clearAllFilters}
                                className="text-xs text-slate-500 hover:text-red-600 flex items-center gap-1 transition-colors font-bold ml-1 cursor-pointer"
                            >
                                <CloseOutlinedIcon sx={{ fontSize: 12 }} /> Reset Filters
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {viewMode === "calendar" ? (
                <AppointmentsCalendar appointments={filtered} onEventClick={setDetailId} />
            ) : (
                <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-xs">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50/95 border-b border-slate-200/90">
                                <tr>
                                    <th className="text-left px-4 py-3.5 text-xs font-extrabold text-slate-500 uppercase tracking-wider w-12">#</th>
                                    <th className="text-left px-4 py-3.5 text-xs font-extrabold text-slate-500 uppercase tracking-wider">Patient Name</th>
                                    <th className="text-left px-4 py-3.5 text-xs font-extrabold text-slate-500 uppercase tracking-wider">Doctor</th>
                                    <th className="text-left px-4 py-3.5 text-xs font-extrabold text-slate-500 uppercase tracking-wider">Department / Treatment</th>
                                    <th className="text-left px-4 py-3.5 text-xs font-extrabold text-slate-500 uppercase tracking-wider">Appointment Date</th>
                                    <th className="text-left px-4 py-3.5 text-xs font-extrabold text-slate-500 uppercase tracking-wider">Appointment Time</th>
                                    <th className="text-left px-4 py-3.5 text-xs font-extrabold text-slate-500 uppercase tracking-wider">Status</th>
                                    <th className="text-left px-4 py-3.5 text-xs font-extrabold text-slate-500 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100/90">
                                {paged.map((apt, index) => {
                                    const start = new Date(apt.startTime);
                                    const isPastDate = new Date(apt.startTime).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0);
                                    const currentDateKey = format(start, "yyyy-MM-dd");
                                    const prevApt = index > 0 ? paged[index - 1] : null;
                                    const prevDateKey = prevApt ? format(new Date(prevApt.startTime), "yyyy-MM-dd") : null;
                                    const isNewDayGroup = currentDateKey !== prevDateKey;
                                    const bucket = getAptBucket(apt.startTime);
                                    const patientInitial = (apt.patient?.name || "P").charAt(0).toUpperCase();
                                    const assignedDoc = getDoctorForAppointment(apt.treatment.name);
                                    const rowNumber = (page - 1) * perPage + index + 1;

                                    return (
                                        <Fragment key={apt.id}>
                                            {isNewDayGroup && (
                                                <tr key={`header-${currentDateKey}`} className="bg-slate-50/90 border-y border-slate-200/90">
                                                    <td colSpan={8} className="px-5 py-3">
                                                        <div className="flex items-center justify-between flex-wrap gap-2">
                                                            <div className="flex items-center gap-2.5">
                                                                {bucket === "today" ? (
                                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-teal-50 text-teal-800 border border-teal-300 shadow-2xs">
                                                                        <span className="relative flex h-2 w-2">
                                                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
                                                                        </span>
                                                                        TODAY
                                                                    </span>
                                                                ) : bucket === "tomorrow" ? (
                                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-teal-50 text-teal-800 border border-teal-300 shadow-2xs">
                                                                        <CalendarMonthOutlinedIcon sx={{ fontSize: 14 }} className="text-teal-700" />
                                                                        TOMORROW
                                                                    </span>
                                                                ) : bucket === "upcoming" ? (
                                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-sky-50 text-sky-800 border border-sky-300">
                                                                        <AccessTimeOutlinedIcon sx={{ fontSize: 14 }} className="text-sky-700" />
                                                                        UPCOMING
                                                                    </span>
                                                                ) : (
                                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-300">
                                                                        <HistoryOutlinedIcon sx={{ fontSize: 13 }} className="text-slate-600" />
                                                                        PAST RECORD
                                                                    </span>
                                                                )}
                                                                <span className="text-sm font-black text-slate-900 tracking-tight">
                                                                    {format(start, "EEEE, d MMMM yyyy")}
                                                                </span>
                                                            </div>
                                                            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                                                                Sequential Time Order
                                                            </span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                            <tr className="hover:bg-slate-50/70 transition-colors group">
                                                {/* Row Number */}
                                                <td className="px-4 py-3.5 text-xs font-bold text-slate-400">
                                                    {rowNumber}
                                                </td>

                                                {/* Patient Name */}
                                                <td className="px-4 py-3.5">
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="size-8 rounded-xl bg-teal-50/90 border border-teal-200/90 text-teal-900 font-black text-xs flex items-center justify-center shrink-0 shadow-2xs">
                                                            {patientInitial}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p
                                                                onClick={() => setDetailId(apt.id)}
                                                                className="font-bold text-slate-900 text-sm flex items-center gap-2 hover:text-teal-700 transition-colors cursor-pointer"
                                                            >
                                                                <span className="truncate">{apt.patient?.name || "Unknown"}</span>
                                                                {(apt.patient?.noShowCount ?? 0) > 0 && (
                                                                    <span className="inline-flex items-center gap-1 rounded bg-red-50 px-1.5 py-0.5 text-[10px] font-bold text-red-700 border border-red-200 shrink-0" title={`${apt.patient?.noShowCount} previous No-Shows`}>
                                                                        <WarningAmberOutlinedIcon sx={{ fontSize: 12 }} />
                                                                        {apt.patient?.noShowCount} No-Show
                                                                    </span>
                                                                )}
                                                            </p>
                                                            {apt.patient?.phone ? (
                                                                <a
                                                                    href={`https://wa.me/${apt.patient.phone.replace(/[^0-9]/g, "")}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-emerald-700 font-medium transition-colors cursor-pointer group/wa mt-0.5"
                                                                    title="Open WhatsApp Chat"
                                                                >
                                                                    <WhatsAppIcon sx={{ fontSize: 12 }} className="text-emerald-600 group-hover/wa:scale-110 transition-transform" />
                                                                    <span>{apt.patient.phone}</span>
                                                                </a>
                                                            ) : (
                                                                <span className="text-[11px] text-slate-400">No phone</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Doctor (From Screen 1) */}
                                                <td className="px-4 py-3.5">
                                                    <p className="font-extrabold text-slate-900 text-xs">{assignedDoc.name}</p>
                                                    <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 mt-0.5">
                                                        {assignedDoc.role}
                                                    </span>
                                                </td>

                                                {/* Department & Treatment (From Screen 1) */}
                                                <td className="px-4 py-3.5">
                                                    <p className="font-bold text-slate-900 text-xs leading-snug">{apt.treatment.name}</p>
                                                    <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                                                        <span className="text-[10px] text-teal-800 font-extrabold">{assignedDoc.operatory}</span>
                                                        <span className="text-slate-300">·</span>
                                                        <span className="text-[11px] font-black text-slate-700">{formatPKR(apt.price || apt.treatment.price)}</span>
                                                        {apt.sessionNumber ? (
                                                            <span className="inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-teal-50 text-teal-800 border border-teal-200/90 shadow-2xs">
                                                                Session {apt.sessionNumber}{apt.patientTreatment?.totalSessions ? ` of ${apt.patientTreatment.totalSessions}` : ""}
                                                            </span>
                                                        ) : null}
                                                    </div>
                                                </td>

                                                {/* Appointment Date (From Screen 1) */}
                                                <td className="px-4 py-3.5 text-xs font-semibold text-slate-700">
                                                    <div className="flex items-center gap-1.5">
                                                        <span>{formatDate(start)}</span>
                                                        {bucket === "today" && (
                                                            <span className="text-[9px] text-emerald-800 font-extrabold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                                                                Today
                                                            </span>
                                                        )}
                                                        {bucket === "tomorrow" && (
                                                            <span className="text-[9px] text-teal-800 font-extrabold bg-teal-50 px-1.5 py-0.2 rounded border border-teal-200">
                                                                Tomorrow
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>

                                                {/* Appointment Time (From Screen 1) */}
                                                <td className="px-4 py-3.5 text-slate-700">
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-teal-50/90 border border-teal-200/90 text-teal-950 font-black text-xs shadow-2xs">
                                                            <AccessTimeOutlinedIcon sx={{ fontSize: 13 }} className="text-teal-700" />
                                                            {formatTime(start)}
                                                        </span>
                                                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                                                            {apt.treatment.durationMin}m
                                                        </span>
                                                    </div>
                                                </td>

                                                {/* Status (From Screen 1) */}
                                                <td className="px-4 py-3.5">
                                                    <StatusBadge status={apt.status} />
                                                </td>

                                                {/* Action (From Screen 1) */}
                                                <td className="px-4 py-3.5">
                                                    <div className="flex items-center gap-1.5 flex-wrap">
                                                        {/* Primary View Button (Exact Screen 1 Style) */}
                                                        <button
                                                            onClick={() => setDetailId(apt.id)}
                                                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white hover:bg-teal-50 text-teal-800 border border-teal-200 text-xs font-bold transition-all shadow-2xs active:scale-95 cursor-pointer"
                                                            title="View Encounter Dossier"
                                                        >
                                                            <VisibilityOutlinedIcon sx={{ fontSize: 13 }} />
                                                            <span>View</span>
                                                        </button>

                                                        {(apt.status === "SCHEDULED" || apt.status === "RESCHEDULED") && (
                                                            <>
                                                                {(!isPastDate || userRole === "ADMIN") && (
                                                                    <button
                                                                        onClick={() => {
                                                                            if (isPastDate) {
                                                                                setAdminConfirmPastApt(apt);
                                                                            } else {
                                                                                setCheckoutApt(apt);
                                                                                setAmountValue("");
                                                                                setDiscountValue("0");
                                                                            }
                                                                        }}
                                                                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                                                                        title="Check Out & Bill Patient"
                                                                        disabled={checkingOutId === apt.id}
                                                                    >
                                                                        {checkingOutId === apt.id ? <AutorenewOutlinedIcon sx={{ fontSize: 13 }} className="animate-spin" /> : <CheckCircleOutlineOutlinedIcon sx={{ fontSize: 13 }} />}
                                                                        <span>Check Out</span>
                                                                    </button>
                                                                )}
                                                            </>
                                                        )}

                                                        {apt.status === "COMPLETED" && (
                                                            <>
                                                                <button
                                                                    onClick={() => setPrecautionsApt(apt)}
                                                                    className="p-1 rounded-lg hover:bg-emerald-50 text-emerald-700 transition-colors cursor-pointer"
                                                                    title="Send WhatsApp Precautions"
                                                                >
                                                                    <WhatsAppIcon sx={{ fontSize: 15 }} className="text-emerald-600" />
                                                                </button>
                                                                <button
                                                                    onClick={() => setReceiptApt(apt)}
                                                                    className="p-1 rounded-lg hover:bg-teal-50 text-teal-700 transition-colors cursor-pointer"
                                                                    title="Download Receipt"
                                                                >
                                                                    <ReceiptLongOutlinedIcon sx={{ fontSize: 15 }} />
                                                                </button>
                                                            </>
                                                        )}

                                                        <ClinicalNoteDialog
                                                            appointmentId={apt.id}
                                                            patientName={apt.patient?.name || "Unknown"}
                                                            treatmentName={apt.treatment.name}
                                                            appointmentDate={formatDate(apt.startTime)}
                                                            existingNote={apt.clinicalNotes?.[0] || null}
                                                            onNoteSaved={() => router.refresh()}
                                                            readOnly={userRole !== "ADMIN"}
                                                        />

                                                        {(apt.status === "SCHEDULED" || apt.status === "RESCHEDULED") && (
                                                            <>
                                                                <button
                                                                    onClick={() => setRescheduleApt(apt)}
                                                                    className="p-1 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors cursor-pointer"
                                                                    title="Reschedule Appointment"
                                                                >
                                                                    <RefreshOutlinedIcon sx={{ fontSize: 15 }} />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleStatusChange(apt.id, "NO_SHOW")}
                                                                    className="p-1 rounded-lg hover:bg-amber-50 text-amber-600 transition-colors cursor-pointer"
                                                                    title="Mark as No Show"
                                                                >
                                                                    <PersonOffOutlinedIcon sx={{ fontSize: 15 }} />
                                                                </button>
                                                                <button
                                                                    onClick={() => setConfirmCancelId(apt.id)}
                                                                    className="p-1 rounded-lg hover:bg-red-50 text-red-600 transition-colors cursor-pointer"
                                                                    title="Cancel Appointment"
                                                                    disabled={cancellingId === apt.id}
                                                                >
                                                                    {cancellingId === apt.id ? <AutorenewOutlinedIcon sx={{ fontSize: 15 }} className="animate-spin" /> : <DeleteOutlineOutlinedIcon sx={{ fontSize: 15 }} />}
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        </Fragment>
                                    );
                                })}
                                {paged.length === 0 && (
                                    <tr><td colSpan={8} className="py-0"><EmptyState icon={EventBusyOutlinedIcon} title="No Appointments Found" description="No appointments match your current filters. Try adjusting your search or status filter." /></td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex flex-wrap items-center justify-between px-5 py-3.5 border-t border-slate-200 bg-slate-50/50 gap-3">
                        <div className="flex items-center gap-3">
                            <p className="text-sm text-slate-600">
                                Showing <strong className="text-slate-900">{sorted.length > 0 ? (page - 1) * perPage + 1 : 0}</strong>–<strong className="text-slate-900">{Math.min(page * perPage, sorted.length)}</strong> of <strong className="text-slate-900">{sorted.length}</strong>
                            </p>
                            <div className="flex items-center gap-1 text-xs text-slate-500">
                                <span>Per page:</span>
                                {[10, 25, 50, 100].map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => { setPerPage(size); setPage(1); }}
                                        className={`px-2 py-0.5 rounded text-xs transition-colors cursor-pointer ${perPage === size ? "bg-teal-50 text-teal-700 font-bold border border-teal-200" : "text-slate-500 hover:text-slate-900"}`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                        {totalPages > 1 && (
                            <div className="flex gap-1">
                                <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)} className="border-slate-200 text-slate-700 hover:bg-slate-100 cursor-pointer">
                                    <ChevronLeftOutlinedIcon className="size-4" />
                                </Button>
                                {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => (
                                    <Button key={i} variant={page === i + 1 ? "default" : "outline"} size="sm" onClick={() => setPage(i + 1)} className={`cursor-pointer ${page === i + 1 ? "bg-teal-600 hover:bg-teal-700 text-white font-semibold border-0" : "border-slate-200 text-slate-700 hover:bg-slate-100"}`}>
                                        {i + 1}
                                    </Button>
                                ))}
                                <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)} className="border-slate-200 text-slate-700 hover:bg-slate-100 cursor-pointer">
                                    <ChevronRightOutlinedIcon className="size-4" />
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Screen 2: Encounter Dossier Dialog */}
            <Dialog open={!!detailId} onOpenChange={() => setDetailId(null)}>
                <DialogContent className="sm:max-w-4xl max-h-[92vh] overflow-y-auto bg-white border border-slate-200/90 text-slate-900 shadow-2xl rounded-3xl p-5 sm:p-7">
                    <DialogHeader className="border-b border-slate-100 pb-4 pr-10">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-1">
                                    <span>Appointments List</span>
                                    <span>&gt;</span>
                                    <span className="text-teal-700">Encounter Dossier</span>
                                </div>
                                <DialogTitle className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                                    <span>Appointment Details</span>
                                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                                        #{selectedApt?.id.slice(-6).toUpperCase()}
                                    </span>
                                </DialogTitle>
                            </div>

                            {selectedApt && (
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-slate-500">Status:</span>
                                    <StatusBadge status={selectedApt.status} />
                                </div>
                            )}
                        </div>
                    </DialogHeader>

                    {selectedApt && (
                        <div className="space-y-6 pt-2">
                            {/* Actions Header Bar */}
                            <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                                <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                                    <CalendarTodayOutlinedIcon sx={{ fontSize: 16 }} className="text-teal-600" />
                                    <span>{formatDate(selectedApt.startTime, "long")} · {formatTime(selectedApt.startTime)}</span>
                                </div>

                                <div className="flex flex-wrap items-center gap-2">
                                    {(selectedApt.status === "SCHEDULED" || selectedApt.status === "RESCHEDULED") && (
                                        <>
                                            <button
                                                onClick={() => {
                                                    setDetailId(null);
                                                    setCheckoutApt(selectedApt);
                                                    setAmountValue("");
                                                    setDiscountValue("0");
                                                }}
                                                className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-extrabold transition-all shadow-xs cursor-pointer flex items-center gap-1.5 active:scale-95"
                                            >
                                                <CheckCircleOutlineOutlinedIcon sx={{ fontSize: 14 }} />
                                                <span>Check Out</span>
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setDetailId(null);
                                                    setRescheduleApt(selectedApt);
                                                }}
                                                className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                                            >
                                                <RefreshOutlinedIcon sx={{ fontSize: 14 }} className="text-blue-600" />
                                                <span>Reschedule</span>
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setDetailId(null);
                                                    setConfirmCancelId(selectedApt.id);
                                                }}
                                                className="px-3 py-1.5 rounded-xl bg-white border border-red-200 hover:bg-red-50 text-red-700 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                                            >
                                                <DeleteOutlineOutlinedIcon sx={{ fontSize: 14 }} />
                                                <span>Cancel</span>
                                            </button>
                                        </>
                                    )}

                                    {selectedApt.status === "COMPLETED" && (
                                        <>
                                            <button
                                                onClick={() => {
                                                    setDetailId(null);
                                                    setPrecautionsApt(selectedApt);
                                                }}
                                                className="px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5"
                                            >
                                                <WhatsAppIcon sx={{ fontSize: 14 }} className="text-emerald-600" />
                                                <span>WhatsApp Precautions</span>
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setDetailId(null);
                                                    setReceiptApt(selectedApt);
                                                }}
                                                className="px-3.5 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-300 text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5"
                                            >
                                                <ReceiptLongOutlinedIcon sx={{ fontSize: 14 }} className="text-teal-700" />
                                                <span>Download Receipt</span>
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Dual Column Layout Matching Screen 2 */}
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                                {/* Left Column: Encounter Details & Patient Info (7 cols) */}
                                <div className="lg:col-span-7 space-y-4">
                                    {/* Appointment Details Card */}
                                    <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
                                        <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                                            <BadgeOutlinedIcon sx={{ fontSize: 15 }} className="text-teal-600" />
                                            Appointment Specifications
                                        </h3>

                                        <div className="grid grid-cols-2 gap-3 text-xs">
                                            <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-100">
                                                <p className="text-slate-400 uppercase font-bold text-[10px]">Appointment ID</p>
                                                <p className="font-extrabold text-slate-900 mt-0.5">#{selectedApt.id.slice(-6).toUpperCase()}</p>
                                            </div>
                                            <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-100">
                                                <p className="text-slate-400 uppercase font-bold text-[10px]">Booked On</p>
                                                <p className="font-extrabold text-slate-900 mt-0.5">{formatDate(selectedApt.createdAt || selectedApt.startTime)}</p>
                                            </div>
                                            <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-100">
                                                <p className="text-slate-400 uppercase font-bold text-[10px]">Doctor Assigned</p>
                                                <p className="font-extrabold text-teal-900 mt-0.5">{getDoctorForAppointment(selectedApt.treatment.name).name}</p>
                                                <p className="text-[10px] text-slate-500 font-semibold">{getDoctorForAppointment(selectedApt.treatment.name).role}</p>
                                            </div>
                                            <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-100">
                                                <p className="text-slate-400 uppercase font-bold text-[10px]">Operatory Department</p>
                                                <p className="font-extrabold text-slate-900 mt-0.5">{getDoctorForAppointment(selectedApt.treatment.name).operatory}</p>
                                            </div>
                                            <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-100">
                                                <p className="text-slate-400 uppercase font-bold text-[10px]">Clinical Procedure</p>
                                                <p className="font-extrabold text-slate-900 mt-0.5">{selectedApt.treatment.name}</p>
                                                <p className="text-[10px] font-bold text-teal-700 mt-0.5">{formatPKR(selectedApt.price || selectedApt.treatment.price)}</p>
                                            </div>
                                            <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-100">
                                                <p className="text-slate-400 uppercase font-bold text-[10px]">Consultation Mode</p>
                                                <p className="font-extrabold text-slate-900 mt-0.5">{selectedApt.bookedBy?.replace("_", " ") || "In-Person Clinic"}</p>
                                                <p className="text-[10px] text-slate-500 font-semibold">{selectedApt.treatment.durationMin} minutes allotted</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Patient Profile Card */}
                                    <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
                                        <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                                            <MedicalServicesOutlinedIcon sx={{ fontSize: 15 }} className="text-teal-600" />
                                            Patient Demographics
                                        </h3>

                                        <div className="grid grid-cols-2 gap-3 text-xs">
                                            <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-100">
                                                <p className="text-slate-400 uppercase font-bold text-[10px]">Patient Name</p>
                                                <p className="font-extrabold text-slate-900 mt-0.5">{selectedApt.patient?.name || "Unknown"}</p>
                                            </div>
                                            <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-100">
                                                <p className="text-slate-400 uppercase font-bold text-[10px]">Contact Phone</p>
                                                {selectedApt.patient?.phone ? (
                                                    <a
                                                        href={`https://wa.me/${selectedApt.patient.phone.replace(/[^0-9]/g, "")}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1 font-bold text-emerald-700 hover:text-emerald-800 transition-colors mt-0.5"
                                                    >
                                                        <WhatsAppIcon sx={{ fontSize: 13 }} />
                                                        <span>{selectedApt.patient.phone}</span>
                                                    </a>
                                                ) : (
                                                    <p className="text-slate-400 mt-0.5">—</p>
                                                )}
                                            </div>
                                            <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-100">
                                                <p className="text-slate-400 uppercase font-bold text-[10px]">Email Address</p>
                                                <p className="font-medium text-slate-700 truncate mt-0.5">{selectedApt.patient?.email || "patient@elitedental.pk"}</p>
                                            </div>
                                            <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-100">
                                                <p className="text-slate-400 uppercase font-bold text-[10px]">Clinical Location</p>
                                                <p className="font-semibold text-slate-800 mt-0.5">Doctors Plaza, G-8 Markaz</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Clinical Notes Card */}
                                    <div className="p-4 rounded-2xl bg-teal-50/50 border border-teal-200/80 shadow-2xs space-y-2">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-xs font-black text-teal-950 uppercase tracking-wider flex items-center gap-1.5">
                                                <ChatBubbleOutlineOutlinedIcon sx={{ fontSize: 14 }} className="text-teal-700" />
                                                Doctor Clinical Notes
                                            </h3>
                                            <ClinicalNoteDialog
                                                appointmentId={selectedApt.id}
                                                patientName={selectedApt.patient?.name || "Unknown"}
                                                treatmentName={selectedApt.treatment.name}
                                                appointmentDate={formatDate(selectedApt.startTime)}
                                                existingNote={selectedApt.clinicalNotes?.[0] || null}
                                                onNoteSaved={() => router.refresh()}
                                                readOnly={userRole !== "ADMIN"}
                                            />
                                        </div>
                                        {selectedApt.clinicalNotes && selectedApt.clinicalNotes.length > 0 ? (
                                            <div className="p-3 bg-white rounded-xl border border-teal-200/60 text-xs text-slate-700 space-y-1">
                                                <p className="font-bold text-slate-900">{selectedApt.clinicalNotes[0].diagnosis || "Clinical Procedure Note"}</p>
                                                <p className="text-slate-600">{selectedApt.clinicalNotes[0].treatmentDone || selectedApt.clinicalNotes[0].remarks || "Patient tolerated procedure well. Instructions provided."}</p>
                                            </div>
                                        ) : (
                                            <p className="text-xs text-slate-500 italic p-2 bg-white/60 rounded-xl border border-teal-100">
                                                No doctor notes recorded yet for this session. Click &quot;Add Note&quot; above to log diagnosis.
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Right Column: Appointment History Timeline (5 cols) */}
                                <div className="lg:col-span-5 p-4 rounded-2xl bg-slate-50/80 border border-slate-200/90 shadow-2xs space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                                            <HistoryOutlinedIcon sx={{ fontSize: 15 }} className="text-teal-600" />
                                            Appointment History
                                        </h3>
                                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
                                            {appointments.filter(a => a.patient?.id === selectedApt.patient?.id).length} Total Visits
                                        </span>
                                    </div>

                                    {/* Vertical Timeline Tree */}
                                    <div className="space-y-3 pt-2 max-h-[420px] overflow-y-auto pr-1">
                                        {appointments
                                            .filter(a => a.patient?.id === selectedApt.patient?.id)
                                            .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
                                            .map((hist, idx, arr) => {
                                                const isCurrent = hist.id === selectedApt.id;
                                                const isDone = hist.status === "COMPLETED";

                                                return (
                                                    <div key={hist.id} className="relative pl-6 pb-2 group">
                                                        {/* Vertical connecting line */}
                                                        {idx < arr.length - 1 && (
                                                            <div className="absolute left-2.5 top-3.5 bottom-0 w-0.5 bg-slate-200" />
                                                        )}

                                                        {/* Timeline node icon */}
                                                        <div className={`absolute left-0 top-1 size-5 rounded-full border-2 flex items-center justify-center ${
                                                            isDone
                                                                ? "bg-emerald-500 border-white text-white shadow-2xs"
                                                                : isCurrent
                                                                ? "bg-teal-600 border-teal-200 text-white animate-pulse"
                                                                : "bg-slate-200 border-white text-slate-500"
                                                        }`}>
                                                            {isDone ? (
                                                                <CheckCircleIcon sx={{ fontSize: 12 }} />
                                                            ) : (
                                                                <div className="size-1.5 rounded-full bg-current" />
                                                            )}
                                                        </div>

                                                        <div className={`p-3 rounded-xl border transition-all ${
                                                            isCurrent
                                                                ? "bg-teal-50 border-teal-300 shadow-2xs"
                                                                : isDone
                                                                ? "bg-emerald-50/60 border-emerald-200/80"
                                                                : "bg-white border-slate-200/80"
                                                        }`}>
                                                            <div className="flex items-center justify-between text-[11px] mb-1">
                                                                <span className="font-extrabold text-slate-900">
                                                                    {formatDate(hist.startTime)}
                                                                </span>
                                                                <span className="text-slate-500 font-semibold">
                                                                    {formatTime(hist.startTime)}
                                                                </span>
                                                            </div>
                                                            <p className="text-xs font-bold text-slate-800 leading-snug">
                                                                {hist.treatment.name}
                                                            </p>
                                                            <div className="flex items-center justify-between mt-1 text-[10px]">
                                                                <span className="text-slate-500 font-medium">
                                                                    {formatPKR(hist.price || hist.treatment.price)}
                                                                </span>
                                                                <span className={`font-bold px-1.5 py-0.2 rounded ${
                                                                    isDone ? "text-emerald-800 bg-emerald-100" : "text-sky-800 bg-sky-100"
                                                                }`}>
                                                                    {hist.status}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Reschedule Dialog */}
            {rescheduleApt && (
                <RescheduleDialog
                    appointment={rescheduleApt}
                    open={!!rescheduleApt}
                    onOpenChange={(open) => { if (!open) setRescheduleApt(null); }}
                    onSuccess={handleRescheduleSuccess}
                />
            )}

            {/* Cancel Confirmation Dialog */}
            <AlertDialog open={!!confirmCancelId} onOpenChange={(open) => { if (!open) setConfirmCancelId(null); }}>
                <AlertDialogContent className="bg-white border-slate-200 text-slate-900 shadow-2xl">
                    <AlertDialogHeader>
                        <div className="mx-auto size-12 rounded-full bg-red-50 border border-red-200 flex items-center justify-center mb-2">
                            <WarningAmberOutlinedIcon className="size-6 text-red-600" />
                        </div>
                        <AlertDialogTitle className="text-center text-slate-900">Cancel Appointment</AlertDialogTitle>
                        <AlertDialogDescription className="text-center text-slate-600">
                            Are you sure you want to cancel this appointment? This action cannot be undone and the patient will need to rebook.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="sm:justify-center gap-3">
                        <AlertDialogCancel className="border-slate-300 text-slate-700 hover:bg-slate-100">Keep Appointment</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => confirmCancelId && handleCancelConfirmed(confirmCancelId)}
                            className="bg-red-600 hover:bg-red-700 text-white border-0 font-semibold"
                        >
                            Yes, Cancel It
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Admin Override Checkout Confirmation */}
            <AlertDialog open={!!adminConfirmPastApt} onOpenChange={(open) => { if (!open) setAdminConfirmPastApt(null); }}>
                <AlertDialogContent className="bg-white border-slate-200 text-slate-900 shadow-2xl">
                    <AlertDialogHeader>
                        <div className="mx-auto size-12 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mb-2">
                            <WarningAmberOutlinedIcon className="size-6 text-amber-600" />
                        </div>
                        <AlertDialogTitle className="text-center text-slate-900">Retroactive Check Out Warning</AlertDialogTitle>
                        <AlertDialogDescription className="text-center text-slate-600">
                            This appointment was scheduled for a past date (<strong className="text-slate-900">{adminConfirmPastApt && formatDate(adminConfirmPastApt.startTime)}</strong>).
                            Are you absolutely sure this patient visited on that date but was not checked out in the system? Unattended appointments should be marked as "No Show" instead.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="sm:justify-center gap-3">
                        <AlertDialogCancel className="border-slate-300 text-slate-700 hover:bg-slate-100">Go Back</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                if (adminConfirmPastApt) {
                                    setCheckoutApt(adminConfirmPastApt);
                                    setAmountValue("");
                                    setDiscountValue("0");
                                    setAdminConfirmPastApt(null);
                                }
                            }}
                            className="bg-teal-600 hover:bg-teal-700 text-white border-0 font-semibold"
                        >
                            Yes, Verify & Check Out
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Checkout Dialog */}
            <CheckoutDialog
                apt={checkoutApt}
                amountValue={amountValue}
                setAmountValue={setAmountValue}
                discountValue={discountValue}
                setDiscountValue={setDiscountValue}
                editablePrice={true}
                onClose={() => setCheckoutApt(null)}
                onConfirm={async (amount, price, discount, options) => {
                    if (checkoutApt) {
                        const targetApt = checkoutApt;
                        setCheckingOutId(targetApt.id);
                        setCheckoutApt(null);
                        try {
                            const result = await checkoutAppointment(targetApt.id, amount, undefined, price, discount, options);
                            if (!result.success) {
                                toast.error("Checkout Failed", { description: result.error });
                            } else {
                                setAppointments((prev) =>
                                    prev.map((a) => a.id === targetApt.id ? { ...a, status: "COMPLETED", amountPaid: amount } : a)
                                );
                                toast.success(result.message || "Checked Out", { description: `Rs. ${amount.toLocaleString()} recorded for visit.` });
                                router.refresh();
                                setPrecautionsApt(targetApt);
                            }
                        } catch {
                            toast.error("Checkout Failed", { description: "Something went wrong. Please try again." });
                        } finally {
                            setCheckingOutId(null);
                        }
                    }
                }}
            />

            {/* Receipt Dialog */}
            <ReceiptDialog
                open={!!receiptApt}
                onOpenChange={(open) => { if (!open) setReceiptApt(null); }}
                data={receiptApt ? (() => {
                    const price = receiptApt.price || receiptApt.treatment.price;
                    const discount = receiptApt.discount || 0;
                    const netTotal = Math.max(0, price - discount);
                    const amountPaid = typeof receiptApt.amountPaid === "number"
                        ? receiptApt.amountPaid
                        : (receiptApt.status === "COMPLETED" ? netTotal : 0);
                    const remainingBalance = Math.max(0, netTotal - amountPaid);

                    return {
                        receiptNumber: `REC-${receiptApt.id.slice(-6).toUpperCase()}`,
                        clinicName: "Elite Dental & Aesthetic Centre",
                        patientName: receiptApt.patient?.name || "Unknown",
                        patientPhone: receiptApt.patient?.phone || undefined,
                        patientId: receiptApt.patient?.id ? `#${receiptApt.patient.id.slice(-4).toUpperCase()}` : undefined,
                        treatmentName: receiptApt.treatment.name,
                        appointmentDate: formatDate(receiptApt.startTime),
                        appointmentTime: formatTime(receiptApt.startTime),
                        doctorName: getDoctorForAppointment(receiptApt.treatment.name).name,
                        operatory: getDoctorForAppointment(receiptApt.treatment.name).operatory,
                        treatmentPrice: price,
                        discount: discount,
                        amountPaid: amountPaid,
                        remainingBalance: remainingBalance,
                        sessionNumber: receiptApt.sessionNumber,
                        totalSessions: receiptApt.patientTreatment?.totalSessions,
                        paymentMethod: remainingBalance > 0
                            ? "Cash / Counter Settlement (Partial Payment)"
                            : "Cash / Clinical Counter Settlement",
                    };
                })() : null}
            />

            {/* Patient History Dialog */}
            <PatientHistoryDialog
                patientId={historyPatientId}
                open={!!historyPatientId}
                onOpenChange={(open) => { if (!open) setHistoryPatientId(null); }}
            />

            {/* Send Precautions Modal */}
            <SendPrecautionsModal
                appointmentId={precautionsApt?.id || null}
                patientName={precautionsApt?.patient?.name || undefined}
                patientPhone={precautionsApt?.patient?.phone}
                treatmentName={precautionsApt?.treatment?.name}
                isOpen={!!precautionsApt}
                onClose={() => setPrecautionsApt(null)}
            />
        </div>
    );
}


