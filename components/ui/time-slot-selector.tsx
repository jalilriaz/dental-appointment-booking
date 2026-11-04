import { useState, useEffect } from "react";
import { Loader2, Clock, AlertCircle } from "lucide-react";

import type { TimeSlot } from "@/lib/types";

interface TimeSlotSelectorProps {
    date: string;
    treatmentId: string;
    value: string;
    onChange: (val: string) => void;
    onSlotSelect?: (slot: TimeSlot) => void;
}

export function TimeSlotSelector({ date, treatmentId, value, onChange, onSlotSelect }: TimeSlotSelectorProps) {
    const [slots, setSlots] = useState<TimeSlot[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;

        async function fetchSlots() {
            if (!date || !treatmentId) {
                setSlots([]);
                return;
            }

            setIsLoading(true);
            setError(null);

            try {
                const searchParams = new URLSearchParams({
                    date,
                    treatmentId,
                });

                const response = await fetch(`/api/appointments/availability?${searchParams.toString()}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch available time slots");
                }

                const data = await response.json();
                if (mounted) {
                    if (data.dayOff) {
                        setError("Clinic is closed on this day.");
                        setSlots([]);
                    } else {
                        setSlots(data.slots || []);
                    }
                }
            } catch (err: any) {
                if (mounted) {
                    setError(err.message || "An error occurred fetching slots");
                    setSlots([]);
                }
            } finally {
                if (mounted) {
                    setIsLoading(false);
                }
            }
        }

        fetchSlots();

        return () => {
            mounted = false;
        };
    }, [date, treatmentId]);

    if (!date) {
        return (
            <div className="flex items-center gap-2 p-3 text-sm text-slate-500 bg-slate-50 border border-slate-200 rounded-xl italic">
                <Clock className="size-4 text-slate-400" />
                Please select a date first
            </div>
        );
    }

    if (!treatmentId) {
        return (
            <div className="flex items-center gap-2 p-3 text-sm text-slate-500 bg-slate-50 border border-slate-200 rounded-xl italic">
                <Clock className="size-4 text-slate-400" />
                Please select a treatment first
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-8 bg-slate-50 border border-slate-200 rounded-xl">
                <Loader2 className="size-6 text-teal-600 animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center gap-2 p-4 text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-xl font-medium">
                <AlertCircle className="size-4 shrink-0 text-amber-600" />
                {error}
            </div>
        );
    }

    if (slots.length === 0) {
        return (
            <div className="flex items-center justify-center p-6 text-sm text-slate-500 bg-slate-50 border border-slate-200 rounded-xl font-medium">
                No slots available on this date.
            </div>
        );
    }

    return (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
            {slots.map((slot) => {
                const isSelected = value === slot.value;
                const isDisabled = !slot.available;

                return (
                    <button
                        key={slot.value}
                        type="button"
                        disabled={isDisabled}
                        onClick={() => {
                            onChange(slot.value);
                            if (onSlotSelect) onSlotSelect(slot);
                        }}
                        className={`relative px-3 py-2 text-xs font-semibold rounded-lg border transition-all duration-150 overflow-hidden group
                            ${isDisabled
                                ? "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed opacity-60"
                                : isSelected
                                    ? "bg-teal-600 border-teal-600 text-white shadow-md shadow-teal-600/20 scale-[0.98] cursor-pointer"
                                    : "bg-white border-slate-200 text-slate-700 hover:bg-teal-50/60 hover:border-teal-400 hover:text-teal-900 cursor-pointer shadow-2xs"
                            }
                        `}
                    >
                        <div className="flex flex-col items-center gap-0.5 relative z-10">
                            <span>{slot.label}</span>
                            {isSelected && (
                                <span className="text-[9px] text-white/90 font-medium">Selected</span>
                            )}
                        </div>
                    </button>
                );
            })}
        </div>
    );
}
