"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { formatKarachiTime, getKarachiDateKey, getKarachiWeekStrip } from "@/lib/format";
import type { UpcomingScheduleItem } from "./types";

interface UpcomingScheduleCardProps {
    appointments: UpcomingScheduleItem[];
}

export default function UpcomingScheduleCard({ appointments }: UpcomingScheduleCardProps) {
    const weekDays = useMemo(() => getKarachiWeekStrip(), []);
    const todayKey = useMemo(() => getKarachiDateKey(new Date()), []);
    const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);

    const grouped = useMemo(() => {
        const tomorrowDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
        const tomorrowKey = getKarachiDateKey(tomorrowDate);
        const list = selectedDateKey
            ? appointments.filter((a) => a.dateKey === selectedDateKey)
            : appointments;

        return {
            today: list.filter((a) => a.dateKey === todayKey),
            tomorrow: list.filter((a) => a.dateKey === tomorrowKey),
            later: list.filter((a) => a.dateKey > tomorrowKey),
        };
    }, [appointments, selectedDateKey, todayKey]);

    return (
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                    <h2 className="text-base font-bold text-slate-900">Upcoming appointments</h2>
                    <p className="text-xs text-slate-500">Schedule in Asia/Karachi time</p>
                </div>
                {selectedDateKey && (
                    <button
                        type="button"
                        onClick={() => setSelectedDateKey(null)}
                        className="text-xs font-semibold text-teal-700 hover:underline cursor-pointer"
                    >
                        Show all
                    </button>
                )}
            </div>

            <div className="py-3 border-b border-slate-100">
                <p className="text-xs font-semibold text-slate-600 mb-2">
                    {weekDays[0]?.monthName} {weekDays[0]?.year}
                </p>
                <div className="grid grid-cols-7 gap-1.5" style={{ gridTemplateColumns: "repeat(7, minmax(0, 1fr))" }}>
                    {weekDays.map((day) => {
                        const active = selectedDateKey === day.dateKey;
                        return (
                            <button
                                key={day.dateKey}
                                type="button"
                                onClick={() => setSelectedDateKey(active ? null : day.dateKey)}
                                className={cn(
                                    "py-2 px-1 rounded-xl text-center cursor-pointer transition-colors flex flex-col items-center",
                                    active
                                        ? "bg-slate-900 text-white"
                                        : day.isToday
                                            ? "bg-teal-50 text-teal-800 border border-teal-200"
                                            : "border border-slate-100 text-slate-600 hover:bg-slate-50"
                                )}
                            >
                                <span className="text-[10px] font-semibold">{day.dayName}</span>
                                <span className="text-xs font-bold mt-0.5">{day.dateNum}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="pt-3 space-y-4 max-h-[420px] overflow-y-auto pr-1">
                <ScheduleGroup label="Today" items={grouped.today} />
                <ScheduleGroup label="Tomorrow" items={grouped.tomorrow} />
                <ScheduleGroup label="Later" items={grouped.later.slice(0, 6)} />
                {grouped.today.length === 0 && grouped.tomorrow.length === 0 && grouped.later.length === 0 && (
                    <p className="text-xs text-slate-500 text-center py-6">No upcoming visits found.</p>
                )}
            </div>
        </div>
    );
}

function ScheduleGroup({ label, items }: { label: string; items: UpcomingScheduleItem[] }) {
    if (items.length === 0) return null;
    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                <span>{label}</span>
                <span className="text-slate-400">{items.length}</span>
            </div>
            <div className="space-y-2">
                {items.map((item) => (
                    <div
                        key={item.id}
                        className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/50 flex items-center justify-between gap-3"
                    >
                        <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-xs font-semibold text-slate-900 truncate">
                                    {item.patient?.name || "Patient"}
                                </span>
                                {item.patient?.isFirstVisit && (
                                    <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[var(--accent-gold-soft)] text-[var(--accent-gold)] border border-[var(--accent-gold-border)]">
                                        New patient
                                    </span>
                                )}
                            </div>
                            <p className="text-[11px] text-slate-500 truncate mt-0.5">
                                {item.treatment.name} · {item.treatment.durationMin}m
                            </p>
                        </div>
                        <span className="text-xs font-semibold text-teal-800 whitespace-nowrap">
                            {formatKarachiTime(item.startTime)}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
