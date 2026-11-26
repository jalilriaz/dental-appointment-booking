"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface FilterOption {
    value: string;
    label: string;
    count?: number;
}

interface FilterBarProps {
    options: FilterOption[];
    value: string;
    onChange: (value: string) => void;
    rightSlot?: React.ReactNode;
    className?: string;
}

export default function FilterBar({
    options,
    value,
    onChange,
    rightSlot,
    className,
}: FilterBarProps) {
    return (
        <div className={cn("flex flex-wrap items-center justify-between gap-2.5", className)}>
            <div className="flex flex-wrap items-center gap-1.5">
                {options.map((opt) => {
                    const active = value === opt.value;
                    return (
                        <button
                            key={opt.value}
                            type="button"
                            onClick={() => onChange(opt.value)}
                            className={cn(
                                "px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-teal-500",
                                active
                                    ? "bg-teal-50 text-teal-800 border-teal-300"
                                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                            )}
                        >
                            <span>{opt.label}</span>
                            {opt.count !== undefined && (
                                <span className="ml-1 text-[11px] opacity-75">({opt.count})</span>
                            )}
                        </button>
                    );
                })}
            </div>
            {rightSlot && <div className="flex flex-wrap items-center gap-2">{rightSlot}</div>}
        </div>
    );
}
