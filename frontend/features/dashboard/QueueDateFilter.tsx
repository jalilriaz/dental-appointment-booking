"use client";

interface QueueDateFilterProps {
    dateFilter: string;
    todayKey: string;
    onChange: (next: string) => void;
}

export default function QueueDateFilter({
    dateFilter,
    todayKey,
    onChange,
}: QueueDateFilterProps) {
    return (
        <div className="flex items-center gap-1.5">
            <input
                type="date"
                aria-label="Filter appointments by date"
                value={dateFilter === "ALL" ? "" : dateFilter}
                onChange={(e) => onChange(e.target.value || "ALL")}
                className="px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 text-xs text-slate-700"
            />
            {dateFilter !== todayKey && (
                <button
                    type="button"
                    onClick={() => onChange(todayKey)}
                    className="px-2 py-1 rounded-lg border border-teal-200 bg-teal-50 text-teal-800 text-xs font-semibold cursor-pointer"
                >
                    Today
                </button>
            )}
            {dateFilter !== "ALL" && (
                <button
                    type="button"
                    onClick={() => onChange("ALL")}
                    className="px-2 py-1 rounded-lg border border-slate-200 text-slate-600 text-xs font-semibold cursor-pointer"
                >
                    All dates
                </button>
            )}
        </div>
    );
}
