"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { fetchApi } from "@/lib/api-client";
import AutorenewOutlinedIcon from "@mui/icons-material/AutorenewOutlined";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import OpenInNewOutlinedIcon from "@mui/icons-material/OpenInNewOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import NightsStayOutlinedIcon from "@mui/icons-material/NightsStayOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import SyncOutlinedIcon from "@mui/icons-material/SyncOutlined";
import CloudDoneOutlinedIcon from "@mui/icons-material/CloudDoneOutlined";

interface SettingsFormProps {
    initialSettings: {
        workingHoursStart: string;
        workingHoursEnd: string;
    } | null;
    googleCalendarConnected?: boolean;
}

export default function SettingsForm({ initialSettings, googleCalendarConnected = false }: SettingsFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [syncing, setSyncing] = useState(false);

    const [formData, setFormData] = useState({
        clinicName: "Elite Dental Centre",
        workingHoursStart: initialSettings?.workingHoursStart || "12:00",
        workingHoursEnd: initialSettings?.workingHoursEnd || "20:00",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSyncAppointments = async () => {
        setSyncing(true);
        try {
            const res = await fetchApi("/api/admin/sync-calendar", { method: "POST" });
            const data = await res.json();
            if (data.success) {
                toast.success("Calendar Synced", { description: data.message });
            } else {
                toast.error("Sync Failed", { description: data.error || "Could not sync appointments" });
            }
        } catch {
            toast.error("Sync Failed", { description: "Network error occurred." });
        } finally {
            setSyncing(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetchApi("/api/settings", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    clinicName: formData.clinicName,
                    workDayStart: formData.workingHoursStart,
                    workDayEnd: formData.workingHoursEnd,
                    slotDurationMin: 30,
                }),
            });

            if (!res.ok) throw new Error("Failed to update settings");

            router.refresh();
            toast.success("Settings Saved", { description: "Clinic working hours have been updated. New bookings will reflect these times." });
        } catch (error) {
            console.error(error);
            toast.error("Save Failed", { description: "Failed to update settings. Please try again." });
        } finally {
            setLoading(false);
        }
    };

    // Helper: format "HH:mm" to "h:mm AM/PM"
    const formatTime = (time: string) => {
        if (!time) return "—";
        const [h, m] = time.split(":").map(Number);
        const period = h >= 12 ? "PM" : "AM";
        const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h;
        return `${displayH}:${m.toString().padStart(2, "0")} ${period}`;
    };

    // Calculate total working hours
    const calcHours = () => {
        const [sH, sM] = formData.workingHoursStart.split(":").map(Number);
        const [eH, eM] = formData.workingHoursEnd.split(":").map(Number);
        const diff = (eH * 60 + eM) - (sH * 60 + sM);
        if (diff <= 0) return "—";
        const hours = Math.floor(diff / 60);
        const mins = diff % 60;
        return mins > 0 ? `${hours}h ${mins}m` : `${hours} hours`;
    };

    // Calculate total slots
    const calcSlots = () => {
        const [sH, sM] = formData.workingHoursStart.split(":").map(Number);
        const [eH, eM] = formData.workingHoursEnd.split(":").map(Number);
        const diff = (eH * 60 + eM) - (sH * 60 + sM);
        if (diff <= 0) return 0;
        return Math.floor(diff / 30);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 font-sans">
            <div className="grid lg:grid-cols-2 gap-6">
                {/* ─────────────────────────────────────────────────────────────
                    CARD 1: WORKING HOURS & SHIFT SCHEDULE
                    ───────────────────────────────────────────────────────────── */}
                <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm hover:shadow-md transition-all space-y-6 flex flex-col justify-between">
                    <div className="space-y-6">
                        {/* Card Header */}
                        <div className="flex items-start gap-4">
                            <div className="size-12 rounded-2xl bg-teal-50 border border-teal-200/80 flex items-center justify-center text-teal-700 shadow-2xs shrink-0">
                                <AccessTimeOutlinedIcon sx={{ fontSize: 24 }} />
                            </div>
                            <div className="space-y-1">
                                <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                                    Working Hours &amp; Schedule
                                </h2>
                                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
                                    Define the daily clinical shift. These hours dictate time slot generation across website bookings, walk-in reception, and chatbot.
                                </p>
                            </div>
                        </div>

                        {/* Input Fields */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label htmlFor="workingHoursStart" className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                                    <WbSunnyOutlinedIcon sx={{ fontSize: 16, color: "#F59E0B" }} />
                                    <span>Opening Time</span>
                                </label>
                                <input
                                    id="workingHoursStart"
                                    name="workingHoursStart"
                                    type="time"
                                    value={formData.workingHoursStart}
                                    onChange={handleChange}
                                    required
                                    className="w-full h-12 px-4 rounded-2xl bg-slate-50/70 border border-slate-200 text-slate-900 font-bold text-sm focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all outline-none"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="workingHoursEnd" className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                                    <NightsStayOutlinedIcon sx={{ fontSize: 16, color: "#0D9488" }} />
                                    <span>Closing Time</span>
                                </label>
                                <input
                                    id="workingHoursEnd"
                                    name="workingHoursEnd"
                                    type="time"
                                    value={formData.workingHoursEnd}
                                    onChange={handleChange}
                                    required
                                    className="w-full h-12 px-4 rounded-2xl bg-slate-50/70 border border-slate-200 text-slate-900 font-bold text-sm focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all outline-none"
                                />
                            </div>
                        </div>

                        {/* Schedule Summary (Light Clinical Tiles - 0% Purple) */}
                        <div className="rounded-2xl bg-slate-50/80 border border-slate-200/80 p-4 sm:p-5 space-y-3.5">
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                                    Shift Summary
                                </span>
                                <span className="text-[11px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200/60">
                                    30-min increments
                                </span>
                            </div>

                            <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
                                <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 text-center shadow-2xs">
                                    <p className="text-lg sm:text-2xl font-black text-teal-700 font-sans tracking-tight">
                                        {formatTime(formData.workingHoursStart)}
                                    </p>
                                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mt-1">
                                        Opens
                                    </p>
                                </div>

                                <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 text-center shadow-2xs">
                                    <p className="text-lg sm:text-2xl font-black text-slate-800 font-sans tracking-tight">
                                        {formatTime(formData.workingHoursEnd)}
                                    </p>
                                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mt-1">
                                        Closes
                                    </p>
                                </div>

                                <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 text-center shadow-2xs">
                                    <p className="text-lg sm:text-2xl font-black text-slate-900 font-sans tracking-tight">
                                        {calcHours()}
                                    </p>
                                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mt-1">
                                        Daily Shift
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 text-xs font-medium text-slate-600 pt-1">
                                <InfoOutlinedIcon sx={{ fontSize: 16, color: "#0D9488" }} className="shrink-0" />
                                <span>
                                    Generates up to <strong className="font-extrabold text-slate-900">{calcSlots()} appointment slots</strong> per day. Sundays are clinic off-days.
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ─────────────────────────────────────────────────────────────
                    CARD 2: GOOGLE CALENDAR INTEGRATION
                    ───────────────────────────────────────────────────────────── */}
                <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm hover:shadow-md transition-all space-y-6 flex flex-col justify-between">
                    <div className="space-y-6">
                        {/* Card Header */}
                        <div className="flex items-start gap-4">
                            <div className="size-12 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-700 shadow-2xs shrink-0">
                                <CalendarTodayOutlinedIcon sx={{ fontSize: 24 }} />
                            </div>
                            <div className="space-y-1">
                                <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                                    Google Calendar Integration
                                </h2>
                                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-normal">
                                    Real-time two-way synchronization for Dr. Sheriyaar. Appointments booked on the website, walk-in desk, or WhatsApp bot sync directly to Google Calendar.
                                </p>
                            </div>
                        </div>

                        {/* Integration Status Block */}
                        {googleCalendarConnected ? (
                            <div className="rounded-2xl bg-emerald-50/70 border border-emerald-200/90 p-5 sm:p-6 space-y-4 shadow-2xs">
                                <div className="flex items-start gap-3.5">
                                    <div className="size-11 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/25">
                                        <CloudDoneOutlinedIcon sx={{ fontSize: 22 }} />
                                    </div>
                                    <div className="space-y-0.5">
                                        <div className="flex items-center gap-2">
                                            <p className="font-black text-emerald-950 text-base tracking-tight">
                                                Connected &amp; Syncing
                                            </p>
                                            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                                        </div>
                                        <p className="text-xs font-semibold text-emerald-800 leading-relaxed">
                                            All appointments, reschedules, and cancellations are reflected in real-time in Asia/Karachi timezone.
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3 pt-1">
                                    <div className="p-3.5 rounded-xl bg-white border border-emerald-200/80 text-center shadow-2xs">
                                        <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                                            Channel Status
                                        </p>
                                        <p className="text-xs sm:text-sm font-black text-emerald-800 mt-0.5">
                                            Active · Live Sync
                                        </p>
                                    </div>
                                    <div className="p-3.5 rounded-xl bg-white border border-emerald-200/80 text-center shadow-2xs">
                                        <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                                            Target Account
                                        </p>
                                        <p className="text-xs sm:text-sm font-black text-slate-900 mt-0.5 truncate" title="jalilriaz990@gmail.com">
                                            jalilriaz990@gmail.com
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                                    <button
                                        type="button"
                                        onClick={handleSyncAppointments}
                                        disabled={syncing}
                                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 active:scale-95 transition-all cursor-pointer disabled:opacity-60"
                                    >
                                        <SyncOutlinedIcon sx={{ fontSize: 16 }} className={syncing ? "animate-spin" : ""} />
                                        <span>{syncing ? "Syncing..." : "Sync Bookings to Calendar"}</span>
                                    </button>
                                    <a
                                        href="/api/auth/google"
                                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-extrabold text-xs shadow-2xs active:scale-95 transition-all cursor-pointer"
                                    >
                                        <OpenInNewOutlinedIcon sx={{ fontSize: 16 }} />
                                        <span>Reconnect Calendar</span>
                                    </a>
                                </div>
                            </div>
                        ) : (
                            <div className="rounded-2xl bg-slate-50/80 border border-slate-200/90 p-5 sm:p-6 space-y-4">
                                <div className="flex items-start gap-3.5">
                                    <div className="size-11 rounded-2xl bg-slate-200 text-slate-700 flex items-center justify-center shrink-0">
                                        <CalendarTodayOutlinedIcon sx={{ fontSize: 22 }} />
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="font-black text-slate-900 text-base">
                                            Google Calendar Not Connected
                                        </p>
                                        <p className="text-xs text-slate-500 font-medium leading-relaxed">
                                            Link your clinic Google account to automatically push all patient appointments into Dr. Sheriyaar&apos;s daily calendar.
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-2 text-xs font-semibold text-slate-600 pt-1">
                                    <div className="flex items-center gap-2">
                                        <CheckCircleOutlineOutlinedIcon sx={{ fontSize: 16, color: "#0D9488" }} />
                                        <span>Auto-create calendar entries for Website, Walk-in, and Chatbot</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircleOutlineOutlinedIcon sx={{ fontSize: 16, color: "#0D9488" }} />
                                        <span>Instant calendar updates when an appointment is rescheduled</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircleOutlineOutlinedIcon sx={{ fontSize: 16, color: "#0D9488" }} />
                                        <span>Automatic deletion of canceled bookings</span>
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <a
                                        href="/api/auth/google"
                                        className="inline-flex items-center justify-center gap-2 w-full px-5 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs shadow-md shadow-teal-600/25 active:scale-95 transition-all cursor-pointer"
                                    >
                                        <OpenInNewOutlinedIcon sx={{ fontSize: 16 }} />
                                        <span>Connect Google Calendar</span>
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom Save Bar */}
            <div className="flex items-center justify-end pt-2">
                <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-black text-xs sm:text-sm shadow-lg shadow-teal-600/25 active:scale-95 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <>
                            <AutorenewOutlinedIcon sx={{ fontSize: 18 }} className="animate-spin" />
                            <span>Saving Changes...</span>
                        </>
                    ) : (
                        <>
                            <SaveOutlinedIcon sx={{ fontSize: 18 }} />
                            <span>Save Clinic Settings</span>
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
