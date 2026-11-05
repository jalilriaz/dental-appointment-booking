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
import PersonOffOutlinedIcon from "@mui/icons-material/PersonOffOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import EventBusyOutlinedIcon from "@mui/icons-material/EventBusyOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import { format } from "date-fns";
import { DatePicker } from "@/components/ui/date-picker";
import { PremiumLoader } from "@/components/ui/premium-loader";
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
            const res = await fetch(`/api/appointments/availability?${params}`);
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
            const res = await fetch(`/api/appointments/${appointment.id}/reschedule`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
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

            // Timeline filter
            const bucket = getAptBucket(a.startTime);
            let matchTimeline = true;
            if (timelineFilter === "today") matchTimeline = bucket === "today";
            else if (timelineFilter === "tomorrow") matchTimeline = bucket === "tomorrow";
            else if (timelineFilter === "upcoming") matchTimeline = bucket === "upcoming";
            else if (timelineFilter === "past") matchTimeline = bucket === "past";
            else if (timelineFilter === "all_active") matchTimeline = bucket !== "past" || a.status === "SCHEDULED" || a.status === "RESCHEDULED";

            return matchSearch && matchStatus && matchDateFrom && matchDateTo && matchTreatment && matchTimeline;
        });
    }, [appointments, search, statusFilter, dateFrom, dateTo, treatmentFilter, timelineFilter, getAptBucket]);

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
            const res = await fetch(`/api/appointments/${aptId}/reschedule`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
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
            const res = await fetch(`/api/appointments/${aptId}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
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
        <div className="space-y-4">
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
                        <AutoAwesomeOutlinedIcon className="size-3.5 text-teal-600" />
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
                        <CalendarMonthOutlinedIcon className="size-3.5 text-slate-500" />
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
                        <AccessTimeOutlinedIcon className="size-3.5 text-slate-500" />
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
                        <HistoryOutlinedIcon className="size-3.5 text-slate-500" />
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
                        <CalendarTodayOutlinedIcon className="size-3.5" />
                        Calendar
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-xs">
                <div className="flex flex-wrap gap-3">
                    <div className="relative flex-1 min-w-[200px]">
                        <SearchOutlinedIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                        <Input placeholder="Search patients, treatments, phone..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="pl-10 h-10 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-teal-600 focus:ring-teal-500/20 rounded-xl" />
                    </div>
                    <select
                        value={treatmentFilter}
                        onChange={(e) => { setTreatmentFilter(e.target.value); setPage(1); }}
                        className="h-10 px-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-800 focus:bg-white focus:border-teal-600 focus:ring-teal-500/20 focus:outline-none min-w-[160px]"
                    >
                        <option value="">All Treatments</option>
                        {uniqueTreatments.map((t) => (
                            <option key={t} value={t}>{t}</option>
                        ))}
                    </select>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <span className="text-xs text-slate-500 uppercase tracking-wider font-bold flex items-center gap-1"><CalendarTodayOutlinedIcon className="size-3 text-teal-600" /> Date:</span>
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
                            className="ml-auto text-xs text-slate-500 hover:text-red-600 flex items-center gap-1 transition-colors font-semibold"
                        >
                            <CloseOutlinedIcon className="size-3" /> Clear all
                        </button>
                    )}
                </div>
                <div className="flex flex-wrap gap-2 items-center">
                    <span className="text-xs text-slate-500 uppercase tracking-wider font-bold flex items-center gap-1"><FilterListOutlinedIcon className="size-3 text-teal-600" /> Status:</span>
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
                {/* Active Filters Summary */}
                {hasActiveFilters && (
                    <div className="pt-2 border-t border-slate-100">
                        <p className="text-xs text-slate-500">
                            Showing <strong className="text-slate-800 font-bold">{filtered.length}</strong> of {appointments.length} appointments
                            {treatmentFilter && <> · Treatment: <strong className="text-teal-700">{treatmentFilter}</strong></>}
                            {dateFrom && <> · From: <strong className="text-slate-800">{dateFrom}</strong></>}
                            {dateTo && <> · To: <strong className="text-slate-800">{dateTo}</strong></>}
                        </p>
                    </div>
                )}
            </div>

            {viewMode === "calendar" ? (
                <AppointmentsCalendar appointments={filtered} onEventClick={setDetailId} />
            ) : (
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50/90 border-b border-slate-200">
                                <tr>
                                    <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Patient</th>
                                    <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Treatment</th>
                                    <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Date & Time</th>
                                    <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                    <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Source</th>
                                    <th className="text-left px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {paged.map((apt, index) => {
                                    const start = new Date(apt.startTime);
                                    const isPastDate = new Date(apt.startTime).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0);
                                    const currentDateKey = format(start, "yyyy-MM-dd");
                                    const prevApt = index > 0 ? paged[index - 1] : null;
                                    const prevDateKey = prevApt ? format(new Date(prevApt.startTime), "yyyy-MM-dd") : null;
                                    const isNewDayGroup = currentDateKey !== prevDateKey;
                                    const bucket = getAptBucket(apt.startTime);

                                    return (
                                        <Fragment key={apt.id}>
                                            {isNewDayGroup && (
                                                <tr key={`header-${currentDateKey}`} className="bg-slate-50/90 border-y border-slate-200">
                                                    <td colSpan={6} className="px-4 py-2.5">
                                                        <div className="flex items-center justify-between flex-wrap gap-2">
                                                            <div className="flex items-center gap-2.5">
                                                                {bucket === "today" ? (
                                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-300 shadow-2xs">
                                                                        <span className="relative flex h-2 w-2">
                                                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                                                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-600"></span>
                                                                        </span>
                                                                        TODAY
                                                                    </span>
                                                                ) : bucket === "tomorrow" ? (
                                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-300 shadow-2xs">
                                                                        <CalendarMonthOutlinedIcon className="size-3.5" />
                                                                        TOMORROW
                                                                    </span>
                                                                ) : bucket === "upcoming" ? (
                                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-50 text-sky-800 border border-sky-300">
                                                                        <AccessTimeOutlinedIcon className="size-3.5" />
                                                                        UPCOMING
                                                                    </span>
                                                                ) : (
                                                                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-300">
                                                                        <HistoryOutlinedIcon className="size-3" />
                                                                        PAST RECORD
                                                                    </span>
                                                                )}
                                                                <span className="text-sm font-bold text-slate-900 tracking-tight">
                                                                    {format(start, "EEEE, d MMMM yyyy")}
                                                                </span>
                                                            </div>
                                                            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                                                                Sequential Time Order
                                                            </span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                            <tr className="hover:bg-slate-50/80 transition-premium">
                                                <td className="px-4 py-3">
                                                    <p className="font-semibold text-slate-900 flex items-center gap-2">
                                                        {apt.patient?.name || "Unknown"}
                                                        {(apt.patient?.noShowCount ?? 0) > 0 && (
                                                            <span className="inline-flex items-center gap-1 rounded bg-red-50 px-1.5 py-0.5 text-[10px] font-bold text-red-700 border border-red-200" title={`${apt.patient?.noShowCount} previous No-Shows`}>
                                                                <WarningAmberOutlinedIcon className="size-3" />
                                                                {apt.patient?.noShowCount} No-Show
                                                            </span>
                                                        )}
                                                    </p>
                                                    <p className="text-xs text-slate-500 font-medium">{apt.patient?.phone}</p>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <p className="text-slate-800 font-semibold">{apt.treatment.name}</p>
                                                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                                        <p className="text-xs text-slate-600 font-semibold">{formatPKR(apt.price || apt.treatment.price)}</p>
                                                        {apt.sessionNumber ? (
                                                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                                                                Session {apt.sessionNumber}{apt.patientTreatment?.totalSessions ? ` of ${apt.patientTreatment.totalSessions}` : ""}
                                                            </span>
                                                        ) : null}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-slate-700">
                                                    <div className="flex items-center gap-2">
                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 font-bold text-sm tracking-tight shadow-xs">
                                                            <AccessTimeOutlinedIcon className="size-3.5 text-teal-600" />
                                                            {formatTime(start)}
                                                        </span>
                                                        <span className="text-[11px] font-semibold text-slate-600 px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200">
                                                            {apt.treatment.durationMin}m
                                                        </span>
                                                    </div>
                                                    <div className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                                                        <span>{formatDate(start)}</span>
                                                        {bucket === "today" && (
                                                            <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                                                                Today
                                                            </span>
                                                        )}
                                                        {bucket === "tomorrow" && (
                                                            <span className="text-[10px] text-teal-700 font-bold bg-teal-50 px-1.5 py-0.2 rounded border border-teal-200">
                                                                Tomorrow
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <StatusBadge status={apt.status} />
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="text-xs text-slate-600 font-medium">{apt.bookedBy?.replace("_", " ") || "WEBSITE"}</span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex gap-1">
                                                        <button onClick={() => setDetailId(apt.id)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 cursor-pointer transition-premium" title="View Details">
                                                            <VisibilityOutlinedIcon className="size-4" />
                                                        </button>
                                                        <button onClick={() => apt.patient?.id && setHistoryPatientId(apt.patient.id)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 cursor-pointer transition-premium" title="Patient History">
                                                            <HistoryOutlinedIcon className="size-4" />
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
                                                                        className="p-1.5 rounded-lg hover:bg-teal-50 text-teal-600 cursor-pointer transition-premium"
                                                                        title="Check Out — Mark as Completed"
                                                                        disabled={checkingOutId === apt.id}
                                                                    >
                                                                        {checkingOutId === apt.id ? <AutorenewOutlinedIcon className="size-4 animate-spin" /> : <CheckCircleOutlineOutlinedIcon className="size-4" />}
                                                                    </button>
                                                                )}
                                                                <button
                                                                    onClick={() => handleStatusChange(apt.id, "NO_SHOW")}
                                                                    className="p-1.5 rounded-lg hover:bg-amber-50 text-amber-600 cursor-pointer transition-premium"
                                                                    title="Mark as No Show"
                                                                >
                                                                    <PersonOffOutlinedIcon className="size-4" />
                                                                </button>
                                                                <button
                                                                    onClick={() => setRescheduleApt(apt)}
                                                                    className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 cursor-pointer transition-premium"
                                                                    title="Reschedule"
                                                                >
                                                                    <RefreshOutlinedIcon className="size-4" />
                                                                </button>
                                                                <button
                                                                    onClick={() => setConfirmCancelId(apt.id)}
                                                                    className="p-1.5 rounded-lg hover:bg-red-50 text-red-600 cursor-pointer transition-premium"
                                                                    title="Cancel"
                                                                    disabled={cancellingId === apt.id}
                                                                >
                                                                    {cancellingId === apt.id ? <AutorenewOutlinedIcon className="size-4 animate-spin" /> : <DeleteOutlineOutlinedIcon className="size-4" />}
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
                                                        {apt.status === "COMPLETED" && (
                                                            <>
                                                                <button
                                                                    onClick={() => setPrecautionsApt(apt)}
                                                                    className="p-1.5 rounded-lg hover:bg-emerald-50 text-emerald-600 cursor-pointer transition-premium"
                                                                    title="Send WhatsApp Precautions"
                                                                >
                                                                    <ChatBubbleOutlineOutlinedIcon className="size-4" />
                                                                </button>
                                                                <button
                                                                    onClick={() => setReceiptApt(apt)}
                                                                    className="p-1.5 rounded-lg hover:bg-teal-50 text-teal-600 cursor-pointer transition-premium"
                                                                    title="Download Receipt"
                                                                >
                                                                    <ReceiptLongOutlinedIcon className="size-4" />
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
                                    <tr><td colSpan={6} className="py-0"><EmptyState icon={EventBusyOutlinedIcon} title="No Appointments Found" description="No appointments match your current filters. Try adjusting your search or status filter." /></td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex flex-wrap items-center justify-between px-4 py-3 border-t border-slate-200 bg-slate-50/50 gap-3">
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

            {/* Detail Dialog */}
            <Dialog open={!!detailId} onOpenChange={() => setDetailId(null)}>
                <DialogContent className="sm:max-w-lg bg-white border-slate-200 text-slate-900 shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-slate-900">Appointment Details</DialogTitle>
                    </DialogHeader>
                    {selectedApt && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 text-sm bg-slate-50 p-4 rounded-xl border border-slate-200">
                                <div><p className="text-slate-500 text-xs font-semibold uppercase">Patient</p><p className="font-semibold text-slate-900">{selectedApt.patient?.name}</p></div>
                                <div><p className="text-slate-500 text-xs font-semibold uppercase">Phone</p><p className="font-semibold text-slate-900">{selectedApt.patient?.phone || "—"}</p></div>
                                <div><p className="text-slate-500 text-xs font-semibold uppercase">Treatment</p><p className="font-semibold text-slate-900">{selectedApt.treatment.name}</p></div>
                                <div><p className="text-slate-500 text-xs font-semibold uppercase">Duration</p><p className="font-semibold text-slate-900">{selectedApt.treatment.durationMin} minutes</p></div>
                                <div>
                                    <p className="text-slate-500 text-xs font-semibold uppercase">Date & Time</p>
                                    <p className="font-semibold text-slate-900">
                                        {formatDate(selectedApt.startTime, "long")}<br />
                                        {formatTime(selectedApt.startTime)} –{" "}
                                        {formatTime(selectedApt.endTime)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-slate-500 text-xs font-semibold uppercase">Price</p>
                                    <p className="font-bold text-teal-700">
                                        {formatPKR(selectedApt.treatment.price)}
                                    </p>
                                </div>
                                <div><p className="text-slate-500 text-xs font-semibold uppercase">Status</p><StatusBadge status={selectedApt.status} /></div>
                                <div><p className="text-slate-500 text-xs font-semibold uppercase">Booked By</p><p className="font-semibold text-slate-900">{selectedApt.bookedBy?.replace("_", " ") || "WEBSITE"}</p></div>
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
                data={receiptApt ? {
                    patientName: receiptApt.patient?.name || "Unknown",
                    patientPhone: receiptApt.patient?.phone || undefined,
                    treatmentName: receiptApt.treatment.name,
                    appointmentDate: formatDate(receiptApt.startTime),
                    treatmentPrice: receiptApt.treatment.price,
                    discount: receiptApt.discount || 0,
                    amountPaid: receiptApt.amountPaid || 0,
                } : null}
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


