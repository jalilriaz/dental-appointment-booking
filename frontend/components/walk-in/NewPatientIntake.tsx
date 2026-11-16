"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { fetchApi } from "@/lib/api-client";

// Material UI Icons
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import AutorenewOutlinedIcon from "@mui/icons-material/AutorenewOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";

import { DatePicker } from "@/components/ui/date-picker";
import { TimeSlotSelector } from "@/components/ui/time-slot-selector";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { isSunday } from "@/lib/utils";
import SundayWarning from "@/components/shared/SundayWarning";
import { PremiumLoader } from "@/components/ui/premium-loader";

import type {
  TreatmentOption,
  DoctorOption,
  NewPatientForm,
  SuccessData,
} from "./types";

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

interface NewPatientIntakeProps {
    treatments: TreatmentOption[];
    doctors?: DoctorOption[];
    onSuccess: (data: SuccessData) => void;
}

export default function NewPatientIntake({
    treatments,
    doctors = [],
    onSuccess,
}: NewPatientIntakeProps) {
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

                        {/* Attending Specialist / Doctor */}
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
