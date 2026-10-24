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
            <div className="flex items-center gap-2 p-3 text-sm text-slate-400 bg-white/[0.02] border border-white/[0.05] rounded-xl italic">
                <Clock className="size-4" />
                Please select a date first
            </div>
        );
    }

    if (!treatmentId) {
        return (
            <div className="flex items-center gap-2 p-3 text-sm text-slate-400 bg-white/[0.02] border border-white/[0.05] rounded-xl italic">
                <Clock className="size-4" />
                Please select a treatment first
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-8 bg-white/[0.02] border border-white/[0.05] rounded-xl">
                <Loader2 className="size-6 text-teal-500 animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center gap-2 p-4 text-sm text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                <AlertCircle className="size-4 shrink-0" />
                {error}
            </div>
        );
    }

    if (slots.length === 0) {
        return (
            <div className="flex items-center justify-center p-6 text-sm text-slate-400 bg-white/[0.02] border border-white/[0.05] rounded-xl">
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
                        className={`relative px-3 py-2 text-xs font-medium rounded-lg border transition-all duration-200 overflow-hidden group
                            ${isDisabled
                                ? "bg-white/[0.01] border-white/[0.02] text-slate-600 cursor-not-allowed opacity-50"
                                : isSelected
                                    ? "bg-teal-500/20 border-teal-500 text-teal-300 shadow-[0_0_15px_rgba(20,184,166,0.2)] shadow-teal-500/20 scale-[0.98] cursor-pointer"
                                    : "bg-white/[0.04] border-white/[0.08] text-slate-300 hover:bg-white/[0.08] hover:border-teal-500/30 hover:text-white cursor-pointer"
                            }
                        `}
                    >
                        {isSelected && (
                            <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-transparent pointer-events-none" />
                        )}
                        <div className="flex flex-col items-center gap-0.5 relative z-10">
                            <span>{slot.label}</span>
                            {isSelected && (
                                <span className="text-[9px] text-teal-400/80">Selected</span>
                            )}
                        </div>
                    </button>
                );
            })}
        </div>
    );
}
