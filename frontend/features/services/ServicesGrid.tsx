"use client";

import EditOutlined from "@mui/icons-material/EditOutlined";
import ArchiveOutlined from "@mui/icons-material/ArchiveOutlined";
import DeleteOutlineOutlined from "@mui/icons-material/DeleteOutlineOutlined";
import { formatPKR } from "@/lib/format";
import { totalRefs, type ServiceItem } from "./types";

interface ServicesGridProps {
    services: ServiceItem[];
    busyId: string | null;
    onEdit: (item: ServiceItem) => void;
    onRequestRemove: (item: ServiceItem) => void;
}

export default function ServicesGrid({
    services,
    busyId,
    onEdit,
    onRequestRemove,
}: ServicesGridProps) {
    if (services.length === 0) {
        return (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-10 text-center text-xs text-slate-500">
                No services match the current filters.
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {services.map((s) => {
                const refs = totalRefs(s);
                const busy = busyId === s.id;
                return (
                    <div key={s.id} className="bg-white rounded-2xl border border-slate-200/80 p-4 flex flex-col justify-between gap-3">
                        <div className="space-y-2">
                            <div className="flex items-start justify-between gap-2">
                                <div>
                                    <span className="text-[11px] font-semibold text-teal-700">{s.category}</span>
                                    <h3 className="text-sm font-bold text-slate-900">{s.name}</h3>
                                </div>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${s.showOnWeb ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}>
                                    {s.showOnWeb ? "Web" : "Hidden"}
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 line-clamp-2">{s.description || "No clinical description added."}</p>
                        </div>

                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                            <div className="text-xs">
                                <span className="font-bold text-slate-900">
                                    {formatPKR(s.discountedPrice && s.discountedPrice < s.price ? s.discountedPrice : s.price)}
                                </span>
                                {s.discountedPrice && s.discountedPrice < s.price && (
                                    <span className="ml-1.5 line-through text-slate-400">{formatPKR(s.price)}</span>
                                )}
                                <span className="text-slate-400 ml-2">· {s.durationMin}m</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <button type="button" onClick={() => onEdit(s)} aria-label={`Edit ${s.name}`} className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 cursor-pointer">
                                    <EditOutlined sx={{ fontSize: 15 }} />
                                </button>
                                <button type="button" disabled={busy} onClick={() => onRequestRemove(s)} aria-label={refs > 0 ? `Archive ${s.name}` : `Delete ${s.name}`} className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 cursor-pointer">
                                    {refs > 0 ? <ArchiveOutlined sx={{ fontSize: 15 }} /> : <DeleteOutlineOutlined sx={{ fontSize: 15 }} />}
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
