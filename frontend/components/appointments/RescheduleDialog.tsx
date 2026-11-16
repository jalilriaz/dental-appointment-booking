"use client";

import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { PremiumLoader } from "@/components/ui/premium-loader";
import { fetchApi } from "@/lib/api-client";
import { formatDate, formatTime } from "@/lib/utils";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import AutorenewOutlinedIcon from "@mui/icons-material/AutorenewOutlined";
import type { Appointment, TimeSlot } from "@/lib/types";

interface RescheduleDialogProps {
    appointment: Appointment;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export default function RescheduleDialog({
    appointment,
    open,
    onOpenChange,
    onSuccess,
}: RescheduleDialogProps) {
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
                            <div><span className="text-slate-500">Patient:</span> <span className="font-semibold text-slate-900">{appointment.guestName || appointment.patient?.name || "Unknown"}</span></div>
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
