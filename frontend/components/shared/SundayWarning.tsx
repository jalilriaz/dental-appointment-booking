import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import { isSunday } from "@/lib/utils";

/** Shows a warning banner when the selected date falls on a Sunday (clinic off-day). */
export default function SundayWarning({ date }: { date: string }) {
    if (!isSunday(date)) return null;
    return (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs mt-2 font-medium">
            <WarningAmberOutlinedIcon className="size-4 shrink-0 text-amber-600" />
            <span>Sunday is a clinic off day. Please select another date.</span>
        </div>
    );
}
