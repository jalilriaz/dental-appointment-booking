"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
    label: string;
    value: string | number;
    icon: React.ReactNode;
    iconTone?: "teal" | "sky" | "emerald" | "amber" | "gold";
    trendText?: string;
    trendPositive?: boolean;
    subtext?: string;
    progressPct?: number;
    accent?: boolean;
    className?: string;
}

const TONE_CLASSES: Record<NonNullable<StatCardProps["iconTone"]>, string> = {
    teal: "bg-teal-50 text-teal-700 border-teal-200/80",
    sky: "bg-sky-50 text-sky-700 border-sky-200/80",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
    amber: "bg-amber-50 text-amber-700 border-amber-200/80",
    gold: "bg-[var(--accent-gold-soft)] text-[var(--accent-gold)] border-[var(--accent-gold-border)]",
};

export default function StatCard({
    label,
    value,
    icon,
    iconTone = "teal",
    trendText,
    trendPositive = true,
    subtext,
    progressPct,
    accent = false,
    className,
}: StatCardProps) {
    return (
        <div
            className={cn(
                "bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 transition-colors hover:border-teal-300/80",
                accent && "border-[var(--accent-gold-border)]",
                className
            )}
        >
            <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-slate-500">{label}</span>
                <div
                    className={cn(
                        "size-8 rounded-xl border flex items-center justify-center shrink-0",
                        TONE_CLASSES[iconTone]
                    )}
                >
                    {icon}
                </div>
            </div>

            <div className="mt-2.5">
                <p className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight break-words">
                    {value}
                </p>

                {typeof progressPct === "number" && (
                    <div className="mt-2 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                            className="bg-teal-600 h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${Math.max(0, Math.min(100, progressPct))}%` }}
                        />
                    </div>
                )}

                {(trendText || subtext) && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1.5 flex-wrap">
                        {trendText && (
                            <span
                                className={cn(
                                    "inline-flex items-center px-1.5 py-0.5 rounded-md text-[11px] font-semibold",
                                    trendText === "-"
                                        ? "bg-slate-100 text-slate-600"
                                        : trendPositive
                                            ? "bg-emerald-50 text-emerald-700"
                                            : "bg-rose-50 text-rose-700"
                                )}
                            >
                                {trendText}
                            </span>
                        )}
                        {subtext && <span>{subtext}</span>}
                    </div>
                )}
            </div>
        </div>
    );
}
