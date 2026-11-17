"use client";

import React, { useEffect, useState } from "react";
import { CampaignOutlined } from "@mui/icons-material";

export interface ActiveHoliday {
    id: string;
    title: string;
    startDate: string;
    endDate: string;
    reason?: string;
    showOnWeb: boolean;
}

export default function NoticeBanner() {
    const [holiday, setHoliday] = useState<ActiveHoliday | null>(null);

    useEffect(() => {
        let isMounted = true;
        async function fetchNotice() {
            try {
                const res = await fetch("/api/settings/public");
                if (!res.ok) return;
                const data = await res.json();
                if (!isMounted) return;

                if (data.activeHolidays && data.activeHolidays.length > 0) {
                    const todayStr = new Date().toISOString().split("T")[0];
                    // Find the nearest active holiday with showOnWeb = true
                    const active = data.activeHolidays.find((h: any) => {
                        const endStr = typeof h.endDate === "string" ? h.endDate.split("T")[0] : "";
                        return h.showOnWeb && endStr >= todayStr;
                    });
                    if (active) {
                        setHoliday({
                            id: active.id,
                            title: active.title,
                            startDate: active.startDate.split("T")[0],
                            endDate: active.endDate.split("T")[0],
                            reason: active.reason,
                            showOnWeb: active.showOnWeb,
                        });
                    }
                }
            } catch {
                // Silently ignore if offline
            }
        }
        fetchNotice();
        return () => {
            isMounted = false;
        };
    }, []);

    if (!holiday) return null;

    const formatDateDisplay = (dateStr: string) => {
        try {
            const [y, m, d] = dateStr.split("-").map(Number);
            const date = new Date(y, m - 1, d);
            return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        } catch {
            return dateStr;
        }
    };

    const startDisplay = formatDateDisplay(holiday.startDate);
    const endDisplay = formatDateDisplay(holiday.endDate);
    const dateRangeLabel =
        startDisplay === endDisplay ? startDisplay : `${startDisplay} – ${endDisplay}`;

    return (
        <aside
            aria-label="Clinic Announcement"
            style={{
                backgroundColor: "#b45309",
                background: "linear-gradient(90deg, #92400e 0%, #b45309 50%, #92400e 100%)",
            }}
            className="w-full text-white text-xs py-2 px-4 sm:px-6 border-b border-amber-900/40 shadow-sm transition-all duration-300 relative z-50 font-sans"
        >
            <div className="max-w-7xl mx-auto flex items-center justify-center">
                {/* Center Announcement Content */}
                <div className="flex items-center justify-center gap-2 sm:gap-3 text-center min-w-0">
                    {/* Announcement Icon & Badge */}
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/25 text-amber-100 border border-amber-300/30 text-[10px] font-black uppercase tracking-wider shrink-0 shadow-2xs">
                        <CampaignOutlined sx={{ fontSize: 14, color: "#fef3c7" }} />
                        <span className="relative flex size-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-200 opacity-80"></span>
                            <span className="relative inline-flex rounded-full size-1.5 bg-amber-300"></span>
                        </span>
                        Announcement
                    </span>

                    {/* Announcement Text */}
                    <p className="text-[11px] sm:text-xs font-semibold text-amber-50 truncate sm:overflow-visible drop-shadow-xs">
                        Closed for <strong className="font-black text-white">{holiday.title}</strong>
                        <span className="text-amber-100 font-extrabold ml-1.5 bg-black/30 border border-white/20 px-2 py-0.5 rounded-md inline-block shadow-2xs">
                            {dateRangeLabel}
                        </span>
                        {holiday.reason && (
                            <span className="text-amber-100/90 font-medium ml-2 hidden md:inline">
                                — {holiday.reason}
                            </span>
                        )}
                    </p>
                </div>
            </div>
        </aside>
    );
}




