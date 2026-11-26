import { getStatusMeta } from "@/lib/constants/status";

export default function StatusBadge({
    status,
    className = "",
}: {
    status: string;
    className?: string;
}) {
    const meta = getStatusMeta(status);

    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${meta.badgeClass} ${className}`}
        >
            {meta.label}
        </span>
    );
}
