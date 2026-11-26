"use client";

import React, { FormEvent } from "react";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import MedicalServicesOutlinedIcon from "@mui/icons-material/MedicalServicesOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import AutorenewOutlinedIcon from "@mui/icons-material/AutorenewOutlined";
import { DatePicker } from "@/components/ui/date-picker";
import { TimeSlotSelector } from "@/components/ui/time-slot-selector";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import type { TreatmentOption, BookingForm } from "./types";

interface WalkInBookingFormProps {
    patientName: string;
    treatments: TreatmentOption[];
    bookingForm: BookingForm;
    setBookingForm: React.Dispatch<React.SetStateAction<BookingForm>>;
    booking: boolean;
    onSubmit: (e: FormEvent) => Promise<void>;
    sundayWarningRenderer: (date: string) => React.ReactNode;
    isSundayChecker: (date: string) => boolean;
}

export default function WalkInBookingForm({
    patientName,
    treatments,
    bookingForm,
    setBookingForm,
    booking,
    onSubmit,
    sundayWarningRenderer,
    isSundayChecker,
}: WalkInBookingFormProps) {
    const today = new Date().toISOString().split("T")[0];
    const selectedTreatment = treatments.find((t) => t.id === bookingForm.treatmentId);

    return (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                    <EventAvailableOutlinedIcon sx={{ fontSize: 18, color: "#0D9488" }} />
                    <div>
                        <h3 className="text-sm font-extrabold text-slate-900">
                            New Booking for {patientName}
                        </h3>
                        <p className="text-[11px] text-slate-500 font-medium">
                            This visit will append directly to this patient&apos;s records and sync across Website, WhatsApp, and Google Calendar.
                        </p>
                    </div>
                </div>
                <span className="text-[11px] font-bold text-slate-400">G-8 Clinical Suite</span>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                    {/* Date Picker */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
                            <CalendarTodayOutlinedIcon sx={{ fontSize: 14, color: "#0D9488" }} />
                            <span>Appointment Date</span>
                            <span className="text-red-500">*</span>
                        </label>
                        <DatePicker
                            value={bookingForm.date}
                            onChange={(val: string) => setBookingForm((p) => ({ ...p, date: val, time: "" }))}
                            min={today}
                            placeholder="Select appointment date"
                            disabledDays={(date: Date) => date.getDay() === 0}
                        />
                        {sundayWarningRenderer(bookingForm.date)}
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
                        onChange={(val: string) => setBookingForm((p) => ({ ...p, time: val }))}
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
                        Clinical &amp; Desk Notes (Optional)
                    </label>
                    <textarea
                        rows={2}
                        value={bookingForm.notes}
                        onChange={(e) => setBookingForm((p) => ({ ...p, notes: e.target.value }))}
                        placeholder="e.g., Patient prefers afternoon slot, medical alert check..."
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all resize-none font-medium"
                    />
                    <label className="inline-flex items-center gap-2 pt-1 text-xs font-semibold text-rose-800 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={Boolean(bookingForm.isEmergency)}
                            onChange={(e) => setBookingForm((p) => ({ ...p, isEmergency: e.target.checked }))}
                        />
                        <span>Mark as Emergency / urgent pain visit</span>
                    </label>
                </div>

                {/* Submit Action */}
                <button
                    type="submit"
                    disabled={booking || !bookingForm.date || !bookingForm.time || (Boolean(bookingForm.date) && isSundayChecker(bookingForm.date))}
                    className="w-full py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs sm:text-sm transition-all shadow-md shadow-teal-600/20 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                >
                    {booking ? (
                        <>
                            <AutorenewOutlinedIcon sx={{ fontSize: 18 }} className="animate-spin" />
                            <span>Securing Operatory Slot...</span>
                        </>
                    ) : (
                        <>
                            <EventAvailableOutlinedIcon sx={{ fontSize: 18 }} />
                            <span>Confirm &amp; Register Walk-In Appointment</span>
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
