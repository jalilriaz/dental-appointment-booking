"use client";

import WarningAmberOutlined from "@mui/icons-material/WarningAmberOutlined";
import { cn } from "@/lib/utils";

interface MedicalAlertBannerProps {
    alerts?: string | null;
    allergies?: string[] | null;
    medications?: string[] | null;
    variant?: "banner" | "badge";
    className?: string;
    actionSlot?: React.ReactNode;
}

export default function MedicalAlertBanner({
    alerts,
    allergies,
    medications,
    variant = "banner",
    className,
    actionSlot,
}: MedicalAlertBannerProps) {
    const clean = alerts?.trim();
    const allergyList = (allergies || []).map((x) => x.trim()).filter(Boolean);
    const medList = (medications || []).map((x) => x.trim()).filter(Boolean);
    const summaryText = [
        allergyList.length > 0 ? `Allergies: ${allergyList.join(", ")}` : "",
        medList.length > 0 ? `Meds: ${medList.join(", ")}` : "",
        clean || "",
    ].filter(Boolean).join(" · ");

    if (variant === "badge") {
        if (!summaryText) return null;
        return (
            <span
                className={cn(
                    "inline-flex items-center gap-1 rounded-md bg-rose-50 px-1.5 py-0.5 text-[10px] font-bold text-rose-700 border border-rose-200 max-w-full",
                    className
                )}
                title={`Medical safety: ${summaryText}`}
            >
                <WarningAmberOutlined sx={{ fontSize: 12 }} className="shrink-0 text-rose-600" />
                <span className="truncate max-w-[190px]">{summaryText}</span>
            </span>
        );
    }

    if (!summaryText) return null;

    return (
        <div
            role="alert"
            className={cn(
                "rounded-2xl border border-rose-200 bg-rose-50/90 px-4 py-3 flex items-start justify-between gap-3",
                className
            )}
        >
            <div className="flex items-start gap-2.5 min-w-0">
                <div className="size-8 rounded-xl bg-rose-100 border border-rose-200 text-rose-700 flex items-center justify-center shrink-0 mt-0.5">
                    <WarningAmberOutlined sx={{ fontSize: 18 }} />
                </div>
                <div className="min-w-0 space-y-1">
                    <p className="text-xs font-bold text-rose-900">
                        Allergies, Medications &amp; Medical Alerts
                    </p>
                    {allergyList.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                            {allergyList.map((a) => (
                                <span key={a} className="px-2 py-0.5 rounded-full bg-rose-200/80 text-rose-900 text-[11px] font-semibold">
                                    Allergy: {a}
                                </span>
                            ))}
                        </div>
                    )}
                    {medList.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                            {medList.map((m) => (
                                <span key={m} className="px-2 py-0.5 rounded-full bg-amber-100 border border-amber-200 text-amber-900 text-[11px] font-semibold">
                                    Med: {m}
                                </span>
                            ))}
                        </div>
                    )}
                    {clean && (
                        <p className="text-xs sm:text-sm font-medium text-rose-800 break-words">
                            {clean}
                        </p>
                    )}
                </div>
            </div>
            {actionSlot && <div className="shrink-0">{actionSlot}</div>}
        </div>
    );
}
