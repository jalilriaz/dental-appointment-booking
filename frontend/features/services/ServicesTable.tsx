"use client";

import EditOutlined from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlined from "@mui/icons-material/DeleteOutlineOutlined";
import ArchiveOutlined from "@mui/icons-material/ArchiveOutlined";
import PublicOutlined from "@mui/icons-material/PublicOutlined";
import PublicOffOutlined from "@mui/icons-material/PublicOffOutlined";
import { formatPKR } from "@/lib/format";
import { totalRefs, type ServiceItem } from "./types";

interface ServicesTableProps {
    services: ServiceItem[];
    busyId: string | null;
    onEdit: (item: ServiceItem) => void;
    onToggleWeb: (item: ServiceItem) => void;
    onToggleActive: (item: ServiceItem) => void;
    onRequestRemove: (item: ServiceItem) => void;
}

export default function ServicesTable({
    services,
    busyId,
    onEdit,
    onToggleWeb,
    onToggleActive,
    onRequestRemove,
}: ServicesTableProps) {
    return (
        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50/90 border-b border-slate-200/80 text-slate-500 font-semibold">
                        <tr>
                            <th className="px-4 py-3">Service</th>
                            <th className="px-4 py-3">Category</th>
                            <th className="px-4 py-3">Duration</th>
                            <th className="px-4 py-3">Fee</th>
                            <th className="px-4 py-3">Visibility</th>
                            <th className="px-4 py-3">Bookings</th>
                            <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {services.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="py-10 text-center text-slate-500">
                                    No services match the current filters.
                                </td>
                            </tr>
                        ) : services.map((s) => {
                            const refs = totalRefs(s);
                            const busy = busyId === s.id;
                            return (
                                <tr key={s.id} className="hover:bg-slate-50/60 transition-colors">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2.5">
                                            {s.imageUrl ? (
                                                <img src={s.imageUrl} alt={s.name} className="size-9 rounded-lg object-cover border border-slate-200 shrink-0" />
                                            ) : (
                                                <div className="size-9 rounded-lg bg-teal-50 border border-teal-200/70 text-teal-800 font-bold flex items-center justify-center shrink-0">
                                                    {s.name.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                            <div className="min-w-0">
                                                <p className="font-semibold text-slate-900 truncate">{s.name}</p>
                                                {s.isMultiSession && (
                                                    <span className="text-[10px] font-medium text-teal-700">
                                                        Multi-session ({s.defaultSessions} visits)
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-slate-600">{s.category}</td>
                                    <td className="px-4 py-3 text-slate-700 whitespace-nowrap">{s.durationMin} min</td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        {s.discountedPrice && s.discountedPrice < s.price ? (
                                            <div className="flex items-center gap-1.5">
                                                <span className="font-bold text-slate-900">{formatPKR(s.discountedPrice)}</span>
                                                <span className="line-through text-slate-400">{formatPKR(s.price)}</span>
                                            </div>
                                        ) : (
                                            <span className="font-bold text-slate-900">{formatPKR(s.price)}</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                            <button
                                                type="button"
                                                disabled={busy}
                                                onClick={() => onToggleActive(s)}
                                                className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border cursor-pointer ${s.isActive ? "bg-teal-50 text-teal-800 border-teal-200" : "bg-slate-100 text-slate-600 border-slate-200"}`}
                                            >
                                                {s.isActive ? "Active" : "Inactive"}
                                            </button>
                                            <button
                                                type="button"
                                                disabled={busy}
                                                onClick={() => onToggleWeb(s)}
                                                title={s.showOnWeb ? "Visible on website (click to hide)" : "Hidden from website"}
                                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border cursor-pointer ${s.showOnWeb ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}
                                            >
                                                {s.showOnWeb ? <PublicOutlined sx={{ fontSize: 12 }} /> : <PublicOffOutlined sx={{ fontSize: 12 }} />}
                                                <span>{s.showOnWeb ? "Web" : "Hidden"}</span>
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-slate-700 font-semibold">{s._count?.appointments || 0}</td>
                                    <td className="px-4 py-3 text-right whitespace-nowrap">
                                        <div className="inline-flex items-center gap-1">
                                            <button type="button" onClick={() => onEdit(s)} aria-label={`Edit ${s.name}`} className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 cursor-pointer">
                                                <EditOutlined sx={{ fontSize: 15 }} />
                                            </button>
                                            <button
                                                type="button"
                                                disabled={busy}
                                                onClick={() => onRequestRemove(s)}
                                                aria-label={refs > 0 ? `Archive ${s.name}` : `Delete ${s.name}`}
                                                title={refs > 0 ? "Archive (preserves appointment history)" : "Delete service"}
                                                className={`p-1.5 rounded-lg border cursor-pointer ${refs > 0 ? "border-amber-200 text-amber-700 hover:bg-amber-50" : "border-rose-200 text-rose-600 hover:bg-rose-50"}`}
                                            >
                                                {refs > 0 ? <ArchiveOutlined sx={{ fontSize: 15 }} /> : <DeleteOutlineOutlined sx={{ fontSize: 15 }} />}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
