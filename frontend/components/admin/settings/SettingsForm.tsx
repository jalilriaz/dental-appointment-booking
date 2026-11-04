"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Save, Calendar, CheckCircle2, ExternalLink, Clock, SunMedium, Moon, Info } from "lucide-react";
import { useRouter } from "next/navigation";

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

    const [formData, setFormData] = useState({
        clinicName: "Elite Dental Centre",
        workingHoursStart: initialSettings?.workingHoursStart || "09:00",
        workingHoursEnd: initialSettings?.workingHoursEnd || "17:00",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/settings", {
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
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Scheduling Configuration */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="size-5 text-teal-400" />
                            Working Hours
                        </CardTitle>
                        <CardDescription>Set the clinic&apos;s opening and closing times. These control which time slots appear on the appointment booking page.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="workingHoursStart" className="flex items-center gap-1.5">
                                    <SunMedium className="size-3.5 text-amber-400" />
                                    Opening Time
                                </Label>
                                <Input
                                    id="workingHoursStart"
                                    name="workingHoursStart"
                                    type="time"
                                    value={formData.workingHoursStart}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="workingHoursEnd" className="flex items-center gap-1.5">
                                    <Moon className="size-3.5 text-indigo-400" />
                                    Closing Time
                                </Label>
                                <Input
                                    id="workingHoursEnd"
                                    name="workingHoursEnd"
                                    type="time"
                                    value={formData.workingHoursEnd}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        {/* Live Preview */}
                        <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4 space-y-3">
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Schedule Summary</p>
                            <div className="grid grid-cols-3 gap-2 sm:gap-3">
                                <div className="text-center p-3 rounded-lg bg-teal-500/10 border border-teal-500/15">
                                    <p className="text-lg sm:text-2xl font-bold text-teal-400">{formatTime(formData.workingHoursStart)}</p>
                                    <p className="text-xs text-slate-500 mt-1">Opens</p>
                                </div>
                                <div className="text-center p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/15">
                                    <p className="text-lg sm:text-2xl font-bold text-indigo-400">{formatTime(formData.workingHoursEnd)}</p>
                                    <p className="text-xs text-slate-500 mt-1">Closes</p>
                                </div>
                                <div className="text-center p-3 rounded-lg bg-white/[0.04] border border-white/[0.08]">
                                    <p className="text-lg sm:text-2xl font-bold text-white">{calcHours()}</p>
                                    <p className="text-xs text-slate-500 mt-1">Total</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                <Info className="size-3 shrink-0" />
                                <span>Up to <strong className="text-slate-400">{calcSlots()} appointment slots</strong> per day (30 min each). Sundays are off.</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Google Calendar Integration */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="size-5 text-teal-400" />
                            Google Calendar
                        </CardTitle>
                        <CardDescription>
                            Sync appointments to your Google Calendar automatically. New bookings, cancellations, and reschedules will be reflected in real-time.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {googleCalendarConnected ? (
                            <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-5 space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="size-10 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                                        <CheckCircle2 className="size-5 text-emerald-400" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-emerald-300">Connected & Syncing</p>
                                        <p className="text-sm text-emerald-400/70 mt-0.5">All new appointments are automatically added to your Google Calendar.</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/15 text-center">
                                        <p className="text-xs text-emerald-400/60">Status</p>
                                        <p className="text-sm font-medium text-emerald-300 mt-1">Active</p>
                                    </div>
                                    <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/15 text-center">
                                        <p className="text-xs text-emerald-400/60">Sync</p>
                                        <p className="text-sm font-medium text-emerald-300 mt-1">Real-time</p>
                                    </div>
                                </div>
                                <a
                                    href="/api/auth/google"
                                    className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/20 text-emerald-300 rounded-lg text-sm font-medium transition-colors"
                                >
                                    <ExternalLink className="size-4" />
                                    Reconnect Google Calendar
                                </a>
                            </div>
                        ) : (
                            <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-5 space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="size-10 rounded-full bg-white/[0.06] flex items-center justify-center shrink-0">
                                        <Calendar className="size-5 text-slate-400" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-white">Not Connected</p>
                                        <p className="text-sm text-slate-400 mt-0.5">Connect your Google account to automatically sync all appointments.</p>
                                    </div>
                                </div>
                                <div className="space-y-2 text-sm text-slate-500">
                                    <p className="flex items-center gap-2"><CheckCircle2 className="size-3.5 text-slate-600" /> Auto-create calendar events for bookings</p>
                                    <p className="flex items-center gap-2"><CheckCircle2 className="size-3.5 text-slate-600" /> Remove events on cancellation</p>
                                    <p className="flex items-center gap-2"><CheckCircle2 className="size-3.5 text-slate-600" /> Update events on reschedule</p>
                                </div>
                                <a
                                    href="/api/auth/google"
                                    className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                                >
                                    <ExternalLink className="size-4" />
                                    Connect Google Calendar
                                </a>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <div className="flex justify-end">
                <Button type="submit" disabled={loading} className="btn-brand border-0 min-w-[150px]">
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                        </>
                    ) : (
                        <>
                            <Save className="mr-2 h-4 w-4" /> Save Settings
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
}
