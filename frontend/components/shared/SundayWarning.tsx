import { AlertTriangle } from "lucide-react";
import { isSunday } from "@/lib/utils";

/** Shows a warning banner when the selected date falls on a Sunday (clinic off-day). */
export default function SundayWarning({ date }: { date: string }) {
    if (!isSunday(date)) return null;
    return (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs mt-2">
            <AlertTriangle className="size-4 shrink-0" />
            <span>Sunday is a clinic off day. Please select another date.</span>
        </div>
    );
}
