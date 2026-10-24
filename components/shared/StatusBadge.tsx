import { statusColors } from "@/lib/utils";

const fallback = "bg-slate-500/15 text-slate-400";

export default function StatusBadge({ status, className = "" }: { status: string; className?: string }) {
    return (
        <span
            className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[status] || fallback} ${className}`}
        >
            {status}
        </span>
    );
}
