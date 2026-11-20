"use client";

import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import {
    CalendarMonthOutlined,
    AccessTimeOutlined,
    MedicalServicesOutlined,
    AutoAwesomeOutlined,
    AutorenewOutlined,
    CloseOutlined,
    CheckCircleOutlineOutlined,
    DescriptionOutlined,
    BadgeOutlined,
} from "@mui/icons-material";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { TimeSlotSelector } from "@/components/ui/time-slot-selector";
import { fetchApi } from "@/lib/api-client";
import { toast } from "sonner";
import { formatPKR } from "@/lib/utils";

export interface PlanBookingContext {
    id: string;
    treatmentId: string;
    treatmentName: string;
    sessionNumber?: number;
    totalSessions?: number;
}

export interface SchedulePatientSessionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    patient: {
        id: string;
        name: string;
        phone: string;
        patientCode?: number | null;
    };
    plan?: PlanBookingContext | null;
    availableTreatments?: Array<{
        id: string;
        name: string;
        price: number;
        durationMin: number;
    }>;
    onSuccess?: () => void;
}

export default function SchedulePatientSessionDialog({
    open,
    onOpenChange,
    patient,
    plan,
    availableTreatments: initialTreatments,
    onSuccess,
}: SchedulePatientSessionDialogProps) {
    const todayStr = format(new Date(), "yyyy-MM-dd");

    const [treatments, setTreatments] = useState(initialTreatments || []);
    const [selectedTreatmentId, setSelectedTreatmentId] = useState(plan?.treatmentId || "");
    const [date, setDate] = useState(todayStr);
    const [time, setTime] = useState("");
    const [notes, setNotes] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch active treatments if not provided
    useEffect(() => {
        if (!open) return;

        if (plan) {
            setSelectedTreatmentId(plan.treatmentId);
        }

        if (!initialTreatments || initialTreatments.length === 0) {
            fetchApi("/api/treatments")
                .then((res) => res.json())
                .then((data) => {
                    if (data.treatments) {
                        setTreatments(data.treatments);
                        if (!plan && data.treatments.length > 0 && !selectedTreatmentId) {
                            setSelectedTreatmentId(data.treatments[0].id);
                        }
                    }
                })
                .catch(() => {});
        } else if (!plan && !selectedTreatmentId && initialTreatments.length > 0) {
            setSelectedTreatmentId(initialTreatments[0].id);
        }
    }, [open, plan, initialTreatments]);

    const activeTreatment = treatments.find((t) => t.id === selectedTreatmentId);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!date) {
            toast.error("Please pick an appointment date.");
            return;
        }

        if (new Date(date).getDay() === 0) {
            toast.error("Elite Dental Centre is closed on Sundays. Please select Monday through Saturday.");
            return;
        }

        if (!selectedTreatmentId) {
            toast.error("Please select a clinical procedure.");
            return;
        }

        if (!time) {
            toast.error("Please select an available time slot.");
            return;
        }

        try {
            setIsSubmitting(true);

            const payload: any = {
                patientId: patient.id,
                fullName: patient.name,
                phone: patient.phone,
                treatmentId: selectedTreatmentId,
                date,
                time,
                notes: notes.trim() || undefined,
            };

            if (plan?.id) {
                payload.patientTreatmentId = plan.id;
            }

            const res = await fetchApi("/api/admin/walk-in", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to schedule appointment.");
            }

            const successMsg = plan
                ? `Session ${plan.sessionNumber || ""} for ${plan.treatmentName} scheduled successfully!`
                : `Appointment for ${patient.name} booked successfully!`;

            toast.success(successMsg);
            onOpenChange(false);
            onSuccess?.();

            // Reset form
            setTime("");
            setNotes("");
        } catch (err: any) {
            toast.error(err.message || "An error occurred while booking.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-xl bg-white border border-slate-200 text-slate-900 shadow-2xl rounded-3xl p-0 overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <DialogHeader className="p-5 sm:p-6 border-b border-slate-100 bg-slate-50/70 shrink-0 pr-14">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-black uppercase tracking-wider text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200/90 inline-flex items-center gap-1">
                            <CalendarMonthOutlined sx={{ fontSize: 13 }} className="text-teal-600" />
                            {plan ? "Plan Session Scheduling" : "Clinical Appointment Booking"}
                        </span>
                        {patient.patientCode && (
                            <span className="text-[11px] font-mono font-bold text-slate-500">
                                #{patient.patientCode}
                            </span>
                        )}
                    </div>
                    <DialogTitle className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                        {plan ? `Schedule Next Session` : `Book Appointment`}
                    </DialogTitle>
                    <DialogDescription className="text-xs text-slate-500 font-medium">
                        Patient: <strong className="text-slate-800">{patient.name}</strong> · {patient.phone}
                    </DialogDescription>
                </DialogHeader>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 custom-scrollbar">
                    {/* Active Plan Context Banner */}
                    {plan ? (
                        <div className="p-3.5 rounded-2xl bg-teal-50/80 border border-teal-200/90 flex items-start justify-between gap-3 shadow-2xs">
                            <div className="flex items-start gap-2.5">
                                <div className="size-8 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                                    <AutoAwesomeOutlined sx={{ fontSize: 16 }} />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-teal-950">
                                        {plan.treatmentName}
                                    </p>
                                    <p className="text-[11px] font-semibold text-teal-700 mt-0.5">
                                        Scheduling Session {plan.sessionNumber || "Next"}{" "}
                                        {plan.totalSessions ? `of ${plan.totalSessions}` : ""}
                                    </p>
                                </div>
                            </div>
                            <span className="text-[10px] font-extrabold uppercase bg-white/80 text-teal-800 border border-teal-300 px-2 py-0.5 rounded-full shrink-0">
                                Linked Session
                            </span>
                        </div>
                    ) : (
                        /* Regular Procedure Selector */
                        <div className="space-y-1.5">
                            <Label className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
                                <MedicalServicesOutlined sx={{ fontSize: 14 }} className="text-teal-600" />
                                <span>Clinical Procedure / Treatment *</span>
                            </Label>
                            <Select
                                value={selectedTreatmentId}
                                onValueChange={(val) => {
                                    setSelectedTreatmentId(val);
                                    setTime("");
                                }}
                            >
                                <SelectTrigger className="w-full h-11 bg-slate-50/90 border-slate-200 rounded-xl text-xs sm:text-sm font-semibold">
                                    <SelectValue placeholder="Select dental procedure..." />
                                </SelectTrigger>
                                <SelectContent className="max-h-64 bg-white border-slate-200 shadow-xl rounded-xl">
                                    {treatments.map((t) => (
                                        <SelectItem key={t.id} value={t.id} className="text-xs sm:text-sm font-medium">
                                            {t.name} — {formatPKR(t.price)} ({t.durationMin} min)
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    {/* Date Picker */}
                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                            <Label className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
                                <CalendarMonthOutlined sx={{ fontSize: 14 }} className="text-teal-600" />
                                <span>Appointment Date *</span>
                            </Label>
                            <span className="text-[10px] font-semibold text-slate-400">
                                Closed Sundays
                            </span>
                        </div>
                        <DatePicker
                            value={date}
                            onChange={(val) => {
                                setDate(val);
                                setTime("");
                            }}
                            min={todayStr}
                            disabledDays={(d) => d.getDay() === 0}
                            placeholder="Select appointment date"
                        />
                    </div>

                    {/* Available Time Slots */}
                    <div className="space-y-1.5 pt-1">
                        <div className="flex items-center justify-between">
                            <Label className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
                                <AccessTimeOutlined sx={{ fontSize: 14 }} className="text-teal-600" />
                                <span>Operatory Time Slot *</span>
                            </Label>
                            <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                                12:00 PM – 8:00 PM
                            </span>
                        </div>
                        <TimeSlotSelector
                            date={date}
                            treatmentId={selectedTreatmentId}
                            value={time}
                            onChange={setTime}
                        />
                    </div>

                    {/* Notes */}
                    <div className="space-y-1.5 pt-1">
                        <Label className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
                            <DescriptionOutlined sx={{ fontSize: 14 }} className="text-slate-500" />
                            <span>Clinical / Receptionist Notes (Optional)</span>
                        </Label>
                        <Input
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder={plan ? `e.g. Session ${plan.sessionNumber} arch check & wire adjustment` : "e.g. Patient prefers Chair 1, routine follow-up"}
                            className="h-10 bg-slate-50/80 border-slate-200 text-xs sm:text-sm rounded-xl font-medium"
                        />
                    </div>

                    {/* Footer Actions */}
                    <DialogFooter className="pt-4 border-t border-slate-100 flex flex-row items-center justify-end gap-2.5">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isSubmitting}
                            className="rounded-xl border-slate-200 text-xs font-bold h-10 px-4 cursor-pointer"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting || !date || !time || !selectedTreatmentId}
                            className="bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold h-10 px-5 shadow-xs transition-all active:scale-[0.98] cursor-pointer flex items-center gap-1.5"
                        >
                            {isSubmitting ? (
                                <>
                                    <AutorenewOutlined sx={{ fontSize: 16 }} className="animate-spin" />
                                    <span>Scheduling...</span>
                                </>
                            ) : (
                                <>
                                    <CheckCircleOutlineOutlined sx={{ fontSize: 16 }} />
                                    <span>Confirm &amp; Schedule Visit</span>
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
