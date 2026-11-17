"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { fetchApi } from "@/lib/api-client";
import {
    SaveOutlined,
    CalendarTodayOutlined,
    CheckCircleOutlineOutlined,
    AccessTimeOutlined,
    WbSunnyOutlined,
    NightsStayOutlined,
    InfoOutlined,
    SyncOutlined,
    CloudDoneOutlined,
    BusinessOutlined,
    LocationOnOutlined,
    PhoneOutlined,
    WhatsApp,
    EmailOutlined,
    BadgeOutlined,
    ReceiptLongOutlined,
    EventBusyOutlined,
    AddOutlined,
    DeleteOutlineOutlined,
    CampaignOutlined,
    WarningAmberOutlined,
} from "@mui/icons-material";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";

export interface ClinicHolidayItem {
    id: string;
    title: string;
    startDate: string;
    endDate: string;
    reason?: string;
    showOnWeb: boolean;
    isActive: boolean;
}

interface SettingsFormProps {
    initialSettings: {
        clinicName?: string;
        clinicAddress?: string;
        landlinePhone?: string;
        mobilePhone?: string;
        whatsappNumber?: string;
        clinicEmail?: string;
        pmdcRegNumber?: string;
        receiptFooter?: string;
        workingHoursStart?: string;
        workingHoursEnd?: string;
        slotDurationMin?: number;
        weeklyWorkingDays?: string;
    } | null;
    initialHolidays?: ClinicHolidayItem[];
    googleCalendarConnected?: boolean;
}

const ALL_DAYS = [
    { key: "Monday", label: "Mon" },
    { key: "Tuesday", label: "Tue" },
    { key: "Wednesday", label: "Wed" },
    { key: "Thursday", label: "Thu" },
    { key: "Friday", label: "Fri" },
    { key: "Saturday", label: "Sat" },
    { key: "Sunday", label: "Sun" },
];

export default function SettingsForm({
    initialSettings,
    initialHolidays = [],
    googleCalendarConnected = false,
}: SettingsFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [syncing, setSyncing] = useState(false);

    // Form Data State
    const [formData, setFormData] = useState({
        clinicName: initialSettings?.clinicName || "Elite Dental & Aesthetic Centre",
        clinicAddress:
            initialSettings?.clinicAddress ||
            "Office# 6, 1st Floor, Doctors Plaza, G-8 Markaz (next to IDC), Islamabad",
        landlinePhone: initialSettings?.landlinePhone || "051-2340093",
        mobilePhone: initialSettings?.mobilePhone || "0303-5080011",
        whatsappNumber: initialSettings?.whatsappNumber || "+92 314 5475528",
        clinicEmail: initialSettings?.clinicEmail || "info@elitedental.com",
        pmdcRegNumber: initialSettings?.pmdcRegNumber || "14820-D",
        receiptFooter:
            initialSettings?.receiptFooter ||
            "Thank you for trusting Elite Dental & Aesthetic Centre. Valid for clinical record & tax submission.",
        workingHoursStart: initialSettings?.workingHoursStart || "12:00",
        workingHoursEnd: initialSettings?.workingHoursEnd || "20:00",
        slotDurationMin: initialSettings?.slotDurationMin || 30,
        weeklyWorkingDays:
            initialSettings?.weeklyWorkingDays ||
            "Monday,Tuesday,Wednesday,Thursday,Friday,Saturday",
    });

    // Holidays State
    const [holidays, setHolidays] = useState<ClinicHolidayItem[]>(initialHolidays);
    const [isAddHolidayOpen, setIsAddHolidayOpen] = useState(false);
    const [isHolidaySubmitting, setIsHolidaySubmitting] = useState(false);
    const [holidayFormData, setHolidayFormData] = useState({
        title: "",
        startDate: "",
        endDate: "",
        reason: "",
        showOnWeb: true,
    });

    // Delete Holiday Confirmation
    const [holidayToDelete, setHolidayToDelete] = useState<ClinicHolidayItem | null>(null);

    const activeDaysList = formData.weeklyWorkingDays
        .split(",")
        .map((d) => d.trim().toLowerCase());

    const toggleWorkingDay = (dayKey: string) => {
        const lowerKey = dayKey.toLowerCase();
        let updated: string[];
        if (activeDaysList.includes(lowerKey)) {
            // Cannot remove all days
            if (activeDaysList.length <= 1) {
                toast.error("At least one working day must remain active");
                return;
            }
            updated = activeDaysList.filter((d) => d !== lowerKey);
        } else {
            updated = [...activeDaysList, lowerKey];
        }

        // Map back to proper case matching ALL_DAYS
        const resultString = ALL_DAYS.filter((d) =>
            updated.includes(d.key.toLowerCase())
        )
            .map((d) => d.key)
            .join(",");

        setFormData((prev) => ({ ...prev, weeklyWorkingDays: resultString }));
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // ──────────────────────────────────────────────────────────────────
    // SAVE GLOBAL SETTINGS
    // ──────────────────────────────────────────────────────────────────
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetchApi("/api/settings", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    clinicName: formData.clinicName.trim(),
                    clinicAddress: formData.clinicAddress.trim(),
                    landlinePhone: formData.landlinePhone.trim(),
                    mobilePhone: formData.mobilePhone.trim(),
                    whatsappNumber: formData.whatsappNumber.trim(),
                    clinicEmail: formData.clinicEmail.trim(),
                    pmdcRegNumber: formData.pmdcRegNumber.trim(),
                    receiptFooter: formData.receiptFooter.trim(),
                    workDayStart: formData.workingHoursStart,
                    workDayEnd: formData.workingHoursEnd,
                    slotDurationMin: Number(formData.slotDurationMin) || 30,
                    weeklyWorkingDays: formData.weeklyWorkingDays,
                }),
            });

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.error || "Failed to update settings");
            }

            router.refresh();
            toast.success("Clinic Settings Saved", {
                description:
                    "Clinic profile, working hours, and official receipt information updated successfully.",
            });
        } catch (error: any) {
            console.error(error);
            toast.error("Save Failed", {
                description: error.message || "Failed to update settings. Please try again.",
            });
        } finally {
            setLoading(false);
        }
    };

    // ──────────────────────────────────────────────────────────────────
    // GOOGLE CALENDAR SYNC
    // ──────────────────────────────────────────────────────────────────
    const handleSyncAppointments = async () => {
        setSyncing(true);
        try {
            const res = await fetchApi("/api/admin/sync-calendar", { method: "POST" });
            const data = await res.json();
            if (data.success) {
                toast.success("Calendar Synced", { description: data.message });
            } else {
                toast.error("Sync Failed", {
                    description: data.error || "Could not sync appointments",
                });
            }
        } catch {
            toast.error("Sync Failed", { description: "Network error occurred." });
        } finally {
            setSyncing(false);
        }
    };

    // ──────────────────────────────────────────────────────────────────
    // HOLIDAY MANAGEMENT (ADD, TOGGLE, DELETE)
    // ──────────────────────────────────────────────────────────────────
    const handleAddHolidaySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!holidayFormData.title.trim() || !holidayFormData.startDate || !holidayFormData.endDate) {
            toast.error("Please provide Holiday Title, Start Date, and End Date");
            return;
        }

        if (new Date(holidayFormData.endDate) < new Date(holidayFormData.startDate)) {
            toast.error("End date cannot be earlier than start date");
            return;
        }

        try {
            setIsHolidaySubmitting(true);
            const res = await fetchApi("/api/settings/holidays", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(holidayFormData),
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || "Failed to create holiday");
            }

            toast.success(`Holiday "${holidayFormData.title}" created successfully!`);
            const created: ClinicHolidayItem = {
                id: data.holiday.id,
                title: data.holiday.title,
                startDate: data.holiday.startDate.split("T")[0],
                endDate: data.holiday.endDate.split("T")[0],
                reason: data.holiday.reason || "",
                showOnWeb: data.holiday.showOnWeb,
                isActive: data.holiday.isActive,
            };
            setHolidays((prev) => [created, ...prev]);
            setIsAddHolidayOpen(false);
            setHolidayFormData({
                title: "",
                startDate: "",
                endDate: "",
                reason: "",
                showOnWeb: true,
            });
            router.refresh();
        } catch (err: any) {
            toast.error(err.message || "Failed to create holiday");
        } finally {
            setIsHolidaySubmitting(false);
        }
    };

    const handleToggleHolidayActive = async (holiday: ClinicHolidayItem) => {
        const nextActive = !holiday.isActive;
        setHolidays((prev) =>
            prev.map((h) => (h.id === holiday.id ? { ...h, isActive: nextActive } : h))
        );

        try {
            const res = await fetchApi(`/api/settings/holidays/${holiday.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isActive: nextActive }),
            });

            if (!res.ok) throw new Error("Failed to update status");

            toast.success(
                `Holiday "${holiday.title}" is now ${nextActive ? "Active" : "Disabled"}`
            );
        } catch (err: any) {
            // Revert
            setHolidays((prev) =>
                prev.map((h) => (h.id === holiday.id ? { ...h, isActive: !nextActive } : h))
            );
            toast.error("Failed to toggle holiday");
        }
    };

    const handleDeleteHoliday = async () => {
        if (!holidayToDelete) return;
        try {
            const res = await fetchApi(`/api/settings/holidays/${holidayToDelete.id}`, {
                method: "DELETE",
            });

            if (!res.ok) throw new Error("Failed to delete holiday");

            toast.success(`Holiday "${holidayToDelete.title}" deleted.`);
            setHolidays((prev) => prev.filter((h) => h.id !== holidayToDelete.id));
            setHolidayToDelete(null);
            router.refresh();
        } catch (err: any) {
            toast.error(err.message || "Failed to delete holiday");
        }
    };

    // ──────────────────────────────────────────────────────────────────
    // HELPERS & CAPACITY CALCULATOR
    // ──────────────────────────────────────────────────────────────────
    const formatTime = (time: string) => {
        if (!time) return "—";
        const [h, m] = time.split(":").map(Number);
        const period = h >= 12 ? "PM" : "AM";
        const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h;
        return `${displayH}:${m.toString().padStart(2, "0")} ${period}`;
    };

    const calcHours = () => {
        const [sH, sM] = formData.workingHoursStart.split(":").map(Number);
        const [eH, eM] = formData.workingHoursEnd.split(":").map(Number);
        const diff = eH * 60 + eM - (sH * 60 + sM);
        if (diff <= 0) return "—";
        const hours = Math.floor(diff / 60);
        const mins = diff % 60;
        return mins > 0 ? `${hours}h ${mins}m` : `${hours} hours`;
    };

    const calcSlots = () => {
        const [sH, sM] = formData.workingHoursStart.split(":").map(Number);
        const [eH, eM] = formData.workingHoursEnd.split(":").map(Number);
        const diff = eH * 60 + eM - (sH * 60 + sM);
        if (diff <= 0) return 0;
        const inc = Number(formData.slotDurationMin) || 30;
        return Math.floor(diff / inc);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-7 font-sans">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* ─────────────────────────────────────────────────────────────
                    CARD 1: CLINIC PROFILE & OFFICIAL RECEIPT INFORMATION
                    ───────────────────────────────────────────────────────────── */}
                <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs space-y-5">
                    <div className="flex items-start gap-4 pb-2 border-b border-slate-100">
                        <div className="size-11 rounded-2xl bg-teal-50 border border-teal-200/80 flex items-center justify-center text-teal-700 shadow-2xs shrink-0">
                            <BusinessOutlined sx={{ fontSize: 22 }} />
                        </div>
                        <div>
                            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                                Clinic Profile &amp; Receipt Identity
                            </h2>
                            <p className="text-xs text-slate-500 font-medium">
                                Official clinic details displayed on public headers, footers, and patient invoices.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {/* Clinic Name */}
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                                <BusinessOutlined sx={{ fontSize: 15, color: "#0d9488" }} />
                                <span>Official Clinic Name</span>
                            </Label>
                            <Input
                                name="clinicName"
                                value={formData.clinicName}
                                onChange={handleChange}
                                required
                                className="rounded-xl border-slate-200 text-xs h-10 font-bold"
                            />
                        </div>

                        {/* Physical Address */}
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                                <LocationOnOutlined sx={{ fontSize: 15, color: "#0d9488" }} />
                                <span>Physical Location &amp; Plaza Address</span>
                            </Label>
                            <Input
                                name="clinicAddress"
                                value={formData.clinicAddress}
                                onChange={handleChange}
                                required
                                className="rounded-xl border-slate-200 text-xs h-10"
                            />
                        </div>

                        {/* Phones */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                                    <PhoneOutlined sx={{ fontSize: 15, color: "#0d9488" }} />
                                    <span>Landline Phone</span>
                                </Label>
                                <Input
                                    name="landlinePhone"
                                    value={formData.landlinePhone}
                                    onChange={handleChange}
                                    placeholder="051-2340093"
                                    className="rounded-xl border-slate-200 text-xs h-10"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                                    <PhoneOutlined sx={{ fontSize: 15, color: "#0d9488" }} />
                                    <span>Clinic Mobile</span>
                                </Label>
                                <Input
                                    name="mobilePhone"
                                    value={formData.mobilePhone}
                                    onChange={handleChange}
                                    placeholder="0303-5080011"
                                    className="rounded-xl border-slate-200 text-xs h-10"
                                />
                            </div>
                        </div>

                        {/* WhatsApp & Email */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                                    <WhatsApp sx={{ fontSize: 15, color: "#16a34a" }} />
                                    <span>WhatsApp Support No.</span>
                                </Label>
                                <Input
                                    name="whatsappNumber"
                                    value={formData.whatsappNumber}
                                    onChange={handleChange}
                                    placeholder="+92 314 5475528"
                                    className="rounded-xl border-slate-200 text-xs h-10"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                                    <EmailOutlined sx={{ fontSize: 15, color: "#0d9488" }} />
                                    <span>Official Contact Email</span>
                                </Label>
                                <Input
                                    type="email"
                                    name="clinicEmail"
                                    value={formData.clinicEmail}
                                    onChange={handleChange}
                                    placeholder="info@elitedental.com"
                                    className="rounded-xl border-slate-200 text-xs h-10"
                                />
                            </div>
                        </div>

                        {/* PMDC Registration */}
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                                <BadgeOutlined sx={{ fontSize: 15, color: "#0d9488" }} />
                                <span>PMDC / Regulatory Registration No.</span>
                            </Label>
                            <Input
                                name="pmdcRegNumber"
                                value={formData.pmdcRegNumber}
                                onChange={handleChange}
                                placeholder="14820-D"
                                className="rounded-xl border-slate-200 text-xs h-10"
                            />
                        </div>

                        {/* Receipt Footer Disclaimer */}
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                                <ReceiptLongOutlined sx={{ fontSize: 15, color: "#0d9488" }} />
                                <span>Official Invoice &amp; Receipt Footer Note</span>
                            </Label>
                            <textarea
                                name="receiptFooter"
                                value={formData.receiptFooter}
                                onChange={handleChange}
                                rows={2}
                                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 outline-none transition-all resize-none"
                            />
                        </div>
                    </div>
                </div>

                {/* ─────────────────────────────────────────────────────────────
                    CARD 2: WORKING HOURS & CLINICAL SHIFT CAPACITY
                    ───────────────────────────────────────────────────────────── */}
                <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs space-y-5 flex flex-col justify-between">
                    <div>
                        <div className="flex items-start gap-4 pb-2 border-b border-slate-100">
                            <div className="size-11 rounded-2xl bg-teal-50 border border-teal-200/80 flex items-center justify-center text-teal-700 shadow-2xs shrink-0">
                                <AccessTimeOutlined sx={{ fontSize: 22 }} />
                            </div>
                            <div>
                                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                                    Operational Hours &amp; Schedule
                                </h2>
                                <p className="text-xs text-slate-500 font-medium">
                                    Controls bookable appointment windows across Website, Walk-In Desk, and WhatsApp.
                                </p>
                            </div>
                        </div>

                        <div className="mt-4 space-y-4">
                            {/* Opening & Closing Times */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                                        <WbSunnyOutlined sx={{ fontSize: 15, color: "#f59e0b" }} />
                                        <span>Opening Time</span>
                                    </Label>
                                    <Input
                                        name="workingHoursStart"
                                        type="time"
                                        value={formData.workingHoursStart}
                                        onChange={handleChange}
                                        required
                                        className="rounded-xl border-slate-200 text-xs h-10 font-bold"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                                        <NightsStayOutlined sx={{ fontSize: 15, color: "#0d9488" }} />
                                        <span>Closing Time</span>
                                    </Label>
                                    <Input
                                        name="workingHoursEnd"
                                        type="time"
                                        value={formData.workingHoursEnd}
                                        onChange={handleChange}
                                        required
                                        className="rounded-xl border-slate-200 text-xs h-10 font-bold"
                                    />
                                </div>
                            </div>

                            {/* Slot Duration */}
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold text-slate-700">
                                    Appointment Slot Duration
                                </Label>
                                <select
                                    name="slotDurationMin"
                                    value={formData.slotDurationMin}
                                    onChange={handleChange}
                                    className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white focus:border-teal-500 outline-none"
                                >
                                    <option value="15">15 minutes (Quick triage / Consult)</option>
                                    <option value="20">20 minutes</option>
                                    <option value="30">30 minutes (Standard clinic slot)</option>
                                    <option value="45">45 minutes (Comprehensive visit)</option>
                                    <option value="60">60 minutes (Surgical / Procedure block)</option>
                                </select>
                            </div>

                            {/* Weekly Working Days */}
                            <div className="space-y-2 pt-1">
                                <Label className="text-xs font-bold text-slate-700 block">
                                    Weekly Working Days
                                </Label>
                                <div className="flex flex-wrap items-center gap-2">
                                    {ALL_DAYS.map((day) => {
                                        const isSelected = activeDaysList.includes(day.key.toLowerCase());
                                        return (
                                            <button
                                                type="button"
                                                key={day.key}
                                                onClick={() => toggleWorkingDay(day.key)}
                                                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer border ${
                                                    isSelected
                                                        ? "bg-teal-600 text-white border-teal-600 shadow-2xs"
                                                        : "bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100 hover:text-slate-700"
                                                }`}
                                            >
                                                {day.label}
                                            </button>
                                        );
                                    })}
                                </div>
                                <p className="text-[11px] text-slate-500 font-medium">
                                    Click any day to enable or disable it. Days unselected are automatically closed on the booking calendar.
                                </p>
                            </div>

                            {/* Shift Summary Cards */}
                            <div className="rounded-2xl bg-slate-50/80 border border-slate-200/80 p-4 space-y-3">
                                <div className="grid grid-cols-3 gap-2">
                                    <div className="p-3 rounded-xl bg-white border border-slate-200/90 text-center shadow-2xs">
                                        <p className="text-sm sm:text-base font-black text-teal-700">
                                            {formatTime(formData.workingHoursStart)}
                                        </p>
                                        <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mt-0.5">
                                            Opens
                                        </p>
                                    </div>

                                    <div className="p-3 rounded-xl bg-white border border-slate-200/90 text-center shadow-2xs">
                                        <p className="text-sm sm:text-base font-black text-slate-800">
                                            {formatTime(formData.workingHoursEnd)}
                                        </p>
                                        <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mt-0.5">
                                            Closes
                                        </p>
                                    </div>

                                    <div className="p-3 rounded-xl bg-white border border-slate-200/90 text-center shadow-2xs">
                                        <p className="text-sm sm:text-base font-black text-slate-900">
                                            {calcHours()}
                                        </p>
                                        <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mt-0.5">
                                            Shift
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 text-xs font-medium text-slate-600 pt-1">
                                    <InfoOutlined sx={{ fontSize: 16, color: "#0d9488" }} className="shrink-0" />
                                    <span>
                                        Daily Capacity: Generates up to{" "}
                                        <strong className="font-extrabold text-slate-900">
                                            {calcSlots()} appointment slots
                                        </strong>{" "}
                                        per active working day.
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ─────────────────────────────────────────────────────────────
                    CARD 3: HOLIDAYS & SPECIAL CLINIC CLOSURES
                    ───────────────────────────────────────────────────────────── */}
                <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs space-y-5 lg:col-span-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                        <div className="flex items-start gap-4">
                            <div className="size-11 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-700 shadow-2xs shrink-0">
                                <EventBusyOutlined sx={{ fontSize: 22 }} />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                                        Holidays &amp; Special Clinic Closures
                                    </h2>
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800">
                                        {holidays.filter((h) => h.isActive).length} Active Closures
                                    </span>
                                </div>
                                <p className="text-xs text-slate-500 font-medium mt-0.5">
                                    Manage Eid holidays, official gazetted days off, and emergency closures. When active, dates are blocked from booking and alerted on the website.
                                </p>
                            </div>
                        </div>

                        <Button
                            type="button"
                            onClick={() => setIsAddHolidayOpen(true)}
                            className="bg-amber-600 hover:bg-amber-700 text-white rounded-2xl h-10 px-4 text-xs font-bold shadow-2xs cursor-pointer inline-flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
                        >
                            <AddOutlined sx={{ fontSize: 16 }} />
                            <span>Add Holiday / Closure</span>
                        </Button>
                    </div>

                    {/* Holidays List */}
                    <div className="space-y-3">
                        {holidays.length === 0 ? (
                            <div className="p-8 rounded-2xl bg-slate-50/70 border border-dashed border-slate-200 text-center">
                                <EventBusyOutlined sx={{ fontSize: 32, color: "#94a3b8", mb: 1 }} />
                                <p className="text-xs font-bold text-slate-700">No Clinic Holidays Scheduled</p>
                                <p className="text-[11px] text-slate-500 mt-0.5">
                                    Add upcoming holidays (like Eid or renovation off-periods) to notify patients and block booking slots.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                                {holidays.map((h) => {
                                    const todayStr = new Date().toISOString().split("T")[0];
                                    const isOngoing = h.startDate <= todayStr && h.endDate >= todayStr;
                                    const isUpcoming = h.startDate > todayStr;
                                    const isPast = h.endDate < todayStr;

                                    return (
                                        <div
                                            key={h.id}
                                            className={`p-4 rounded-2xl border transition-all ${
                                                !h.isActive
                                                    ? "bg-slate-50/50 border-slate-200 opacity-60"
                                                    : isOngoing
                                                    ? "bg-amber-50/40 border-amber-300 shadow-2xs"
                                                    : "bg-white border-slate-200/90 hover:border-slate-300 shadow-2xs"
                                            }`}
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center flex-wrap gap-1.5 mb-1">
                                                        <h4 className="text-xs sm:text-sm font-black text-slate-900 truncate">
                                                            {h.title}
                                                        </h4>
                                                        {isOngoing && h.isActive && (
                                                            <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-rose-500 text-white uppercase tracking-wider animate-pulse">
                                                                Closed Today
                                                            </span>
                                                        )}
                                                        {isUpcoming && h.isActive && (
                                                            <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-teal-600 text-white uppercase tracking-wider">
                                                                Upcoming
                                                            </span>
                                                        )}
                                                        {isPast && (
                                                            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-slate-100 text-slate-500">
                                                                Concluded
                                                            </span>
                                                        )}
                                                    </div>

                                                    <p className="text-xs font-bold text-slate-700">
                                                        {h.startDate} → {h.endDate}
                                                    </p>
                                                    {h.reason && (
                                                        <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                                                            {h.reason}
                                                        </p>
                                                    )}

                                                    {h.showOnWeb && h.isActive && (
                                                        <div className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-md bg-teal-50 border border-teal-200 text-teal-800 text-[10px] font-bold">
                                                            <CampaignOutlined sx={{ fontSize: 13 }} />
                                                            <span>Website Alert Active</span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Actions */}
                                                <div className="flex items-center gap-2 shrink-0">
                                                    <div className="flex flex-col items-end">
                                                        <span className="text-[10px] font-bold text-slate-400 mb-1">
                                                            {h.isActive ? "Active" : "Off"}
                                                        </span>
                                                        <Switch
                                                            checked={h.isActive}
                                                            onCheckedChange={() => handleToggleHolidayActive(h)}
                                                        />
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => setHolidayToDelete(h)}
                                                        className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl size-8"
                                                    >
                                                        <DeleteOutlineOutlined sx={{ fontSize: 16 }} />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* ─────────────────────────────────────────────────────────────
                    CARD 4: GOOGLE CALENDAR CLOUD SYNC
                    ───────────────────────────────────────────────────────────── */}
                <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs space-y-5 lg:col-span-2">
                    <div className="flex items-start gap-4 pb-2 border-b border-slate-100">
                        <div className="size-11 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-700 shadow-2xs shrink-0">
                            <CalendarTodayOutlined sx={{ fontSize: 22 }} />
                        </div>
                        <div>
                            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                                Google Calendar Cloud Integration
                            </h2>
                            <p className="text-xs text-slate-500 font-medium">
                                Two-way synchronization for Dr. Sheriyaar. Appointments sync directly to Google Calendar in real time.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/90">
                        <div className="flex items-center gap-3">
                            <div className="size-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-2xs shrink-0">
                                <CloudDoneOutlined sx={{ fontSize: 20 }} />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-black text-slate-900">
                                        Active &amp; Syncing
                                    </span>
                                    <span className="size-2 rounded-full bg-emerald-500 animate-ping" />
                                </div>
                                <p className="text-[11px] font-medium text-slate-500">
                                    Target Account: <strong>jalilriaz990@gmail.com</strong> · Timezone: Asia/Karachi
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                disabled={syncing}
                                onClick={handleSyncAppointments}
                                className="rounded-xl h-9 text-xs font-bold gap-1.5 border-slate-200 bg-white"
                            >
                                <SyncOutlined sx={{ fontSize: 14 }} className={syncing ? "animate-spin" : ""} />
                                <span>{syncing ? "Syncing..." : "Sync Bookings"}</span>
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.push("/api/auth/google")}
                                className="rounded-xl h-9 text-xs font-bold text-slate-700 border-slate-200 bg-white"
                            >
                                Reconnect
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ─────────────────────────────────────────────────────────────
                SAVE BUTTON FIXED BAR
                ───────────────────────────────────────────────────────────── */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <Button
                    type="submit"
                    disabled={loading}
                    className="bg-teal-600 hover:bg-teal-700 text-white font-extrabold rounded-2xl h-12 px-7 text-xs shadow-sm cursor-pointer inline-flex items-center gap-2 transition-all active:scale-[0.98]"
                >
                    <SaveOutlined sx={{ fontSize: 18 }} />
                    <span>{loading ? "Saving Settings..." : "Save Clinic Settings"}</span>
                </Button>
            </div>

            {/* ─────────────────────────────────────────────────────────────
                ADD HOLIDAY DIALOG
                ───────────────────────────────────────────────────────────── */}
            <Dialog open={isAddHolidayOpen} onOpenChange={setIsAddHolidayOpen}>
                <DialogContent className="max-w-md rounded-3xl p-6 bg-white border border-slate-200 shadow-2xl">
                    <DialogHeader className="pb-3 border-b border-slate-100">
                        <DialogTitle className="text-base font-black text-slate-900 flex items-center gap-2">
                            <EventBusyOutlined sx={{ color: "#d97706", fontSize: 20 }} />
                            <span>Add Clinic Holiday / Closure</span>
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleAddHolidaySubmit} className="space-y-4 pt-2">
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-slate-700">
                                Holiday Title <span className="text-rose-500">*</span>
                            </Label>
                            <Input
                                placeholder="e.g. Eid-ul-Fitr Holidays, National Day"
                                value={holidayFormData.title}
                                onChange={(e) =>
                                    setHolidayFormData({ ...holidayFormData, title: e.target.value })
                                }
                                required
                                className="rounded-xl border-slate-200 text-xs h-10 font-bold"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold text-slate-700">
                                    Start Date <span className="text-rose-500">*</span>
                                </Label>
                                <Input
                                    type="date"
                                    value={holidayFormData.startDate}
                                    onChange={(e) =>
                                        setHolidayFormData({ ...holidayFormData, startDate: e.target.value })
                                    }
                                    required
                                    className="rounded-xl border-slate-200 text-xs h-10"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold text-slate-700">
                                    End Date <span className="text-rose-500">*</span>
                                </Label>
                                <Input
                                    type="date"
                                    value={holidayFormData.endDate}
                                    onChange={(e) =>
                                        setHolidayFormData({ ...holidayFormData, endDate: e.target.value })
                                    }
                                    required
                                    className="rounded-xl border-slate-200 text-xs h-10"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-slate-700">
                                Closure Details / Note (Optional)
                            </Label>
                            <textarea
                                placeholder="e.g. Regular appointments and walk-in consultations resume on Tuesday morning."
                                value={holidayFormData.reason}
                                onChange={(e) =>
                                    setHolidayFormData({ ...holidayFormData, reason: e.target.value })
                                }
                                rows={2}
                                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 outline-none resize-none"
                            />
                        </div>

                        {/* Show on website banner switch */}
                        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-teal-50/50 border border-teal-200/60">
                            <div>
                                <Label className="text-xs font-bold text-slate-800 block">
                                    Display Notice on Website
                                </Label>
                                <span className="text-[11px] text-slate-500 font-medium">
                                    Shows prominent alert banner on homepage &amp; booking portal
                                </span>
                            </div>
                            <Switch
                                checked={holidayFormData.showOnWeb}
                                onCheckedChange={(checked) =>
                                    setHolidayFormData({ ...holidayFormData, showOnWeb: checked })
                                }
                            />
                        </div>

                        <DialogFooter className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                disabled={isHolidaySubmitting}
                                onClick={() => setIsAddHolidayOpen(false)}
                                className="rounded-xl h-10 text-xs font-bold"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isHolidaySubmitting}
                                className="bg-amber-600 hover:bg-amber-700 text-white rounded-xl h-10 px-5 text-xs font-bold cursor-pointer"
                            >
                                {isHolidaySubmitting ? "Adding..." : "Add Holiday"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* ─────────────────────────────────────────────────────────────
                DELETE HOLIDAY CONFIRMATION DIALOG
                ───────────────────────────────────────────────────────────── */}
            <Dialog open={!!holidayToDelete} onOpenChange={(open) => !open && setHolidayToDelete(null)}>
                <DialogContent className="max-w-md rounded-3xl p-6 bg-white border border-slate-200 shadow-2xl">
                    <DialogHeader className="pb-3 border-b border-slate-100">
                        <DialogTitle className="text-base font-black text-slate-900 flex items-center gap-2">
                            <WarningAmberOutlined sx={{ color: "#e11d48", fontSize: 22 }} />
                            <span>Delete Clinic Holiday</span>
                        </DialogTitle>
                    </DialogHeader>

                    <div className="py-3 space-y-2">
                        <p className="text-xs text-slate-600 font-medium">
                            Are you sure you want to delete the holiday closure:
                        </p>
                        <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900">
                            <p className="text-xs font-extrabold">{holidayToDelete?.title}</p>
                            <p className="text-[11px] font-medium text-rose-700 mt-0.5">
                                {holidayToDelete?.startDate} → {holidayToDelete?.endDate}
                            </p>
                        </div>
                        <p className="text-[11px] text-slate-500">
                            Removing this holiday will immediately unblock these dates for patient appointments.
                        </p>
                    </div>

                    <DialogFooter className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setHolidayToDelete(null)}
                            className="rounded-xl h-10 text-xs font-bold"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={handleDeleteHoliday}
                            className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl h-10 px-5 text-xs font-bold cursor-pointer"
                        >
                            Delete Holiday
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </form>
    );
}
