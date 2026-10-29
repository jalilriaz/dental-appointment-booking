"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { checkoutAppointment } from "@/app/actions/billing";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Filter, ChevronLeft, ChevronRight, Eye, RefreshCw, Trash2, Loader2, Calendar, Clock, X, CheckCircle2, UserX, AlertTriangle, CalendarX, Receipt, History, MessageSquareShare } from "lucide-react";
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
            <DialogContent className="sm:max-w-lg bg-slate-900 border-white/[0.06] text-white">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <RefreshCw className="size-5 text-teal-400" />
                        Reschedule Appointment
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Current appointment info */}
                    <div className="bg-white/[0.03] border border-white/[0.06] rounded-lg p-4">
                        <p className="text-xs text-slate-400 uppercase tracking-wide mb-2">Current Appointment</p>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div><span className="text-slate-400">Patient:</span> <span className="font-medium text-white">{appointment.patient?.name || "Unknown"}</span></div>
                            <div><span className="text-slate-400">Treatment:</span> <span className="font-medium text-white">{appointment.treatment.name}</span></div>
                            <div>
                                <span className="text-slate-400">Date:</span>{" "}
                                <span className="font-medium text-white">
                                    {formatDate(appointment.startTime, "short")}
                                </span>
                            </div>
                            <div>
                                <span className="text-slate-400">Time:</span>{" "}
                                <span className="font-medium text-white">
                                    {formatTime(appointment.startTime)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* New date picker */}
                    <div>
                        <Label className="text-sm font-medium text-slate-300 mb-2 block">
                            <Calendar className="size-4 inline mr-1 text-teal-400" />
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
                            <Label className="text-sm font-medium text-slate-300 mb-2 block">
                                <Clock className="size-4 inline mr-1 text-teal-400" />
                                Select New Time
                                <span className="font-normal text-muted-foreground ml-2">
                                    ({appointment.treatment.durationMin} min appointment)
                                </span>
                            </Label>

                            {loadingSlots ? (
                                <div className="flex items-center justify-center py-6">
                                    <Loader2 className="size-5 animate-spin text-teal-400" />
                                    <span className="ml-2 text-sm text-muted-foreground">Loading slots...</span>
                                </div>
                            ) : dayOff ? (
                                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-300 text-sm">
                                    ⚠️ Sunday is a clinic off day. Please select another date.
                                </div>
                            ) : slots.length === 0 ? (
                                <div className="p-3 bg-white/[0.03] border border-white/[0.06] rounded-lg text-slate-400 text-sm">
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
                                                ? "border-white/[0.04] bg-white/[0.02] text-slate-600 cursor-not-allowed line-through"
                                                : selectedTime === slot.value
                                                    ? "border-teal-500/50 bg-teal-500/10 text-teal-400 ring-1 ring-teal-500/30 font-semibold"
                                                    : "border-white/[0.06] text-slate-300 hover:border-teal-500/30 hover:bg-teal-500/5"
                                                }`}
                                        >
                                            {slot.label}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {selectedTime && selectedSlot && (
                                <div className="mt-3 p-3 bg-teal-500/10 border border-teal-500/20 rounded-lg">
                                    <p className="text-sm text-teal-300 font-medium">
                                        ⏰ New time: <strong className="text-teal-200">{selectedSlot.label} – {selectedSlot.endLabel}</strong> ({appointment.treatment.durationMin} min)
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <div className="p-3 text-sm text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg">
                            {error}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex justify-end gap-2 pt-2">
                        <Button variant="outline" onClick={() => onOpenChange(false)} className="border-slate-700 text-slate-200 hover:bg-white/[0.04]">
                            Cancel
                        </Button>
                        <Button
                            onClick={handleReschedule}
                            disabled={!selectedDate || !selectedTime || submitting}
                            className="btn-brand border-0"
                        >
                            {submitting ? (
                                <><Loader2 className="mr-2 size-4 animate-spin" /> Rescheduling...</>
                            ) : (
                                <><RefreshCw className="mr-2 size-4" /> Confirm Reschedule</>
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

    const perPage = 10;

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
            return matchSearch && matchStatus && matchDateFrom && matchDateTo && matchTreatment;
        });
    }, [appointments, search, statusFilter, dateFrom, dateTo, treatmentFilter]);

    const totalPages = Math.ceil(filtered.length / perPage);
    const paged = filtered.slice((page - 1) * perPage, page * perPage);

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

    const hasActiveFilters = search || statusFilter.length > 0 || dateFrom || dateTo || treatmentFilter;

    function clearAllFilters() {
        setSearch("");
        setStatusFilter([]);
        setDateFrom("");
        setDateTo("");
        setTreatmentFilter("");
        setPage(1);
    }

    return (
        <div className="space-y-4">
            {/* Filters */}
            <div className="glass-card rounded-xl p-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                    <div className="flex bg-white/[0.04] p-1 rounded-lg border border-white/10">
                        <button
                            onClick={() => setViewMode("list")}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-2 ${viewMode === "list" ? "bg-teal-500/20 text-teal-400 shadow-sm" : "text-slate-400 hover:text-slate-200"}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
                            List
                        </button>
                        <button
                            onClick={() => setViewMode("calendar")}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-2 ${viewMode === "calendar" ? "bg-teal-500/20 text-teal-400 shadow-sm" : "text-slate-400 hover:text-slate-200"}`}
                        >
                            <Calendar className="size-4" />
                            Calendar
                        </button>
                    </div>
                </div>
                <div className="flex flex-wrap gap-3">
                    <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                        <Input placeholder="Search patients, treatments, phone..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="pl-10 bg-white/[0.04] border-white/10 text-white placeholder:text-slate-500 focus:border-teal-500/50 focus:ring-teal-500/20" />
                    </div>
                    <select
                        value={treatmentFilter}
                        onChange={(e) => { setTreatmentFilter(e.target.value); setPage(1); }}
                        className="h-10 px-3 rounded-md bg-white/[0.04] border border-white/10 text-sm text-slate-300 focus:border-teal-500/50 focus:ring-teal-500/20 focus:outline-none min-w-[160px]"
                    >
                        <option value="" className="bg-slate-900">All Treatments</option>
                        {uniqueTreatments.map((t) => (
                            <option key={t} value={t} className="bg-slate-900">{t}</option>
                        ))}
                    </select>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <span className="text-xs text-slate-400 flex items-center gap-1"><Calendar className="size-3" /> Date:</span>
                    <DatePicker
                        value={dateFrom}
                        onChange={(val) => { setDateFrom(val); setPage(1); }}
                        placeholder="From"
                        compact
                    />
                    <span className="text-slate-600">→</span>
                    <DatePicker
                        value={dateTo}
                        onChange={(val) => { setDateTo(val); setPage(1); }}
                        placeholder="To"
                        compact
                    />
                    {hasActiveFilters && (
                        <button
                            onClick={clearAllFilters}
                            className="ml-auto text-xs text-slate-500 hover:text-red-400 flex items-center gap-1 transition-colors"
                        >
                            <X className="size-3" /> Clear all
                        </button>
                    )}
                </div>
                <div className="flex flex-wrap gap-2">
                    <span className="text-xs text-slate-400 flex items-center gap-1"><Filter className="size-3" /> Status:</span>
                    {["SCHEDULED", "RESCHEDULED", "COMPLETED", "CANCELLED", "NO_SHOW"].map((s) => (
                        <button
                            key={s}
                            onClick={() => toggleStatus(s)}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-premium cursor-pointer ${statusFilter.includes(s)
                                ? (statusColors[s] || "bg-slate-500/15 text-slate-400") + " ring-2 ring-offset-1 ring-offset-slate-900"
                                : "bg-white/[0.06] text-slate-400 hover:bg-white/[0.1]"
                                }`}
                        >
                            {s === "NO_SHOW" ? "Missed" : s.replace("_", " ")}
                        </button>
                    ))}
                </div>
                {/* Active Filters Summary */}
                {hasActiveFilters && (
                    <div className="pt-2 border-t border-white/[0.04]">
                        <p className="text-xs text-slate-500">
                            Showing <strong className="text-slate-300">{filtered.length}</strong> of {appointments.length} appointments
                            {treatmentFilter && <> · Treatment: <strong className="text-teal-400">{treatmentFilter}</strong></>}
                            {dateFrom && <> · From: <strong className="text-slate-300">{dateFrom}</strong></>}
                            {dateTo && <> · To: <strong className="text-slate-300">{dateTo}</strong></>}
                        </p>
                    </div>
                )}
            </div>

            {viewMode === "calendar" ? (
                <AppointmentsCalendar appointments={filtered} onEventClick={setDetailId} />
            ) : (
                <div className="glass-card rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-white/[0.03] border-b border-white/[0.06]">
                                <tr>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase">Patient</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase">Treatment</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase">Date & Time</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase">Status</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase">Source</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.04]">
                                {paged.map((apt) => {
                                    const start = new Date(apt.startTime);
                                    const isPastDate = new Date(apt.startTime).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0);

                                    return (
                                        <tr key={apt.id} className="hover:bg-white/[0.03] transition-premium cursor-pointer">
                                            <td className="px-4 py-3">
                                                <p className="font-medium text-white flex items-center gap-2">
                                                    {apt.patient?.name || "Unknown"}
                                                    {(apt.patient?.noShowCount ?? 0) > 0 && (
                                                        <span className="inline-flex items-center gap-1 rounded bg-red-500/10 px-1.5 py-0.5 text-[10px] font-medium text-red-400 border border-red-500/20" title={`${apt.patient?.noShowCount} previous No-Shows`}>
                                                            <AlertTriangle className="size-3" />
                                                            {apt.patient?.noShowCount} No-Show
                                                        </span>
                                                    )}
                                                </p>
                                                <p className="text-xs text-slate-400">{apt.patient?.phone}</p>
                                            </td>
                                            <td className="px-4 py-3">
                                                <p className="text-slate-200">{apt.treatment.name}</p>
                                                <p className="text-xs text-slate-400">{formatPKR(apt.treatment.price)}</p>
                                            </td>
                                            <td className="px-4 py-3 text-slate-300">
                                                {formatDate(start)}
                                                <br />
                                                <span className="text-xs text-slate-400">
                                                    {formatTime(start)}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <StatusBadge status={apt.status} />
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="text-xs text-slate-400">{apt.bookedBy?.replace("_", " ") || "WEBSITE"}</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex gap-1">
                                                    <button onClick={() => setDetailId(apt.id)} className="p-1.5 rounded-lg hover:bg-white/[0.06] text-slate-400 cursor-pointer transition-premium" title="View Details">
                                                        <Eye className="size-4" />
                                                    </button>
                                                    <button onClick={() => apt.patient?.id && setHistoryPatientId(apt.patient.id)} className="p-1.5 rounded-lg hover:bg-blue-500/10 text-blue-400 cursor-pointer transition-premium" title="Patient History">
                                                        <History className="size-4" />
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
                                                                    className="p-1.5 rounded-lg hover:bg-teal-500/10 text-teal-400 cursor-pointer transition-premium"
                                                                    title="Check Out — Mark as Completed"
                                                                    disabled={checkingOutId === apt.id}
                                                                >
                                                                    {checkingOutId === apt.id ? <Loader2 className="size-4 animate-spin" /> : <CheckCircle2 className="size-4" />}
                                                                </button>
                                                            )}
                                                            <button
                                                                onClick={() => handleStatusChange(apt.id, "NO_SHOW")}
                                                                className="p-1.5 rounded-lg hover:bg-amber-500/10 text-amber-400 cursor-pointer transition-premium"
                                                                title="Mark as No Show"
                                                            >
                                                                <UserX className="size-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => setRescheduleApt(apt)}
                                                                className="p-1.5 rounded-lg hover:bg-blue-500/10 text-blue-400 cursor-pointer transition-premium"
                                                                title="Reschedule"
                                                            >
                                                                <RefreshCw className="size-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => setConfirmCancelId(apt.id)}
                                                                className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-400 cursor-pointer transition-premium"
                                                                title="Cancel"
                                                                disabled={cancellingId === apt.id}
                                                            >
                                                                {cancellingId === apt.id ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
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
                                                                className="p-1.5 rounded-lg hover:bg-emerald-500/10 text-emerald-400 cursor-pointer transition-premium"
                                                                title="Send WhatsApp Precautions"
                                                            >
                                                                <MessageSquareShare className="size-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => setReceiptApt(apt)}
                                                                className="p-1.5 rounded-lg hover:bg-teal-500/10 text-teal-400 cursor-pointer transition-premium"
                                                                title="Download Receipt"
                                                            >
                                                                <Receipt className="size-4" />
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {paged.length === 0 && (
                                    <tr><td colSpan={6} className="py-0"><EmptyState icon={CalendarX} title="No Appointments Found" description="No appointments match your current filters. Try adjusting your search or status filter." /></td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between px-4 py-3 border-t border-white/[0.06] bg-white/[0.02]">
                            <p className="text-sm text-slate-400">Showing {(page - 1) * perPage + 1}-{Math.min(page * perPage, filtered.length)} of {filtered.length}</p>
                            <div className="flex gap-1">
                                <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)} className="cursor-pointer">
                                    <ChevronLeft className="size-4" />
                                </Button>
                                {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => (
                                    <Button key={i} variant={page === i + 1 ? "default" : "outline"} size="sm" onClick={() => setPage(i + 1)} className={`cursor-pointer ${page === i + 1 ? "btn-brand border-0" : "border-slate-700 text-slate-200 hover:bg-white/[0.04]"}`}>
                                        {i + 1}
                                    </Button>
                                ))}
                                <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)} className="cursor-pointer">
                                    <ChevronRight className="size-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Detail Dialog */}
            <Dialog open={!!detailId} onOpenChange={() => setDetailId(null)}>
                <DialogContent className="sm:max-w-lg bg-slate-900 border-white/[0.06] text-white">
                    <DialogHeader>
                        <DialogTitle>Appointment Details</DialogTitle>
                    </DialogHeader>
                    {selectedApt && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div><p className="text-slate-400">Patient</p><p className="font-medium text-white">{selectedApt.patient?.name}</p></div>
                                <div><p className="text-slate-400">Phone</p><p className="font-medium text-white">{selectedApt.patient?.phone || "—"}</p></div>
                                <div><p className="text-slate-400">Treatment</p><p className="font-medium text-white">{selectedApt.treatment.name}</p></div>
                                <div><p className="text-slate-400">Duration</p><p className="font-medium text-white">{selectedApt.treatment.durationMin} minutes</p></div>
                                <div>
                                    <p className="text-slate-400">Date & Time</p>
                                    <p className="font-medium">
                                        {formatDate(selectedApt.startTime, "long")}<br />
                                        {formatTime(selectedApt.startTime)} –{" "}
                                        {formatTime(selectedApt.endTime)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-slate-400">Price</p>
                                    <p className="font-medium text-teal-400">
                                        {formatPKR(selectedApt.treatment.price)}
                                    </p>
                                </div>
                                <div><p className="text-slate-400">Status</p><StatusBadge status={selectedApt.status} /></div>
                                <div><p className="text-slate-400">Booked By</p><p className="font-medium text-white">{selectedApt.bookedBy?.replace("_", " ") || "WEBSITE"}</p></div>
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
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <div className="mx-auto size-12 rounded-full bg-red-500/10 flex items-center justify-center mb-2">
                            <AlertTriangle className="size-6 text-red-400" />
                        </div>
                        <AlertDialogTitle className="text-center">Cancel Appointment</AlertDialogTitle>
                        <AlertDialogDescription className="text-center">
                            Are you sure you want to cancel this appointment? This action cannot be undone and the patient will need to rebook.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="sm:justify-center gap-3">
                        <AlertDialogCancel>Keep Appointment</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => confirmCancelId && handleCancelConfirmed(confirmCancelId)}
                            className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white border-0"
                        >
                            Yes, Cancel It
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Admin Override Checkout Confirmation */}
            <AlertDialog open={!!adminConfirmPastApt} onOpenChange={(open) => { if (!open) setAdminConfirmPastApt(null); }}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <div className="mx-auto size-12 rounded-full bg-amber-500/10 flex items-center justify-center mb-2">
                            <AlertTriangle className="size-6 text-amber-500" />
                        </div>
                        <AlertDialogTitle className="text-center">Retroactive Check Out warning</AlertDialogTitle>
                        <AlertDialogDescription className="text-center text-slate-300">
                            This appointment was scheduled for a past date (<strong className="text-white">{adminConfirmPastApt && formatDate(adminConfirmPastApt.startTime)}</strong>).
                            Are you absolutely sure this patient visited on that date but was not checked out in the system? Unattended appointments should be marked as "No Show" instead.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="sm:justify-center gap-3">
                        <AlertDialogCancel>Go Back</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                if (adminConfirmPastApt) {
                                    setCheckoutApt(adminConfirmPastApt);
                                    setAmountValue("");
                                    setDiscountValue("0");
                                    setAdminConfirmPastApt(null);
                                }
                            }}
                            className="bg-teal-600 hover:bg-teal-500 text-white border-0"
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
                onConfirm={async (amount, price, discount) => {
                    if (checkoutApt) {
                        const targetApt = checkoutApt;
                        setCheckingOutId(targetApt.id);
                        setCheckoutApt(null);
                        try {
                            const result = await checkoutAppointment(targetApt.id, amount, undefined, price, discount);
                            if (!result.success) {
                                toast.error("Checkout Failed", { description: result.error });
                            } else {
                                setAppointments((prev) =>
                                    prev.map((a) => a.id === targetApt.id ? { ...a, status: "COMPLETED", amountPaid: amount } : a)
                                );
                                toast.success("Checked Out", { description: `Rs. ${amount.toLocaleString()} recorded for visit.` });
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


