"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import AddOutlined from "@mui/icons-material/AddOutlined";
import BiotechOutlined from "@mui/icons-material/BiotechOutlined";
import LocalShippingOutlined from "@mui/icons-material/LocalShippingOutlined";
import CheckCircleOutlineOutlined from "@mui/icons-material/CheckCircleOutlineOutlined";
import { FilterBar, PageHeader, SearchInput, StatCard, StatusBadge } from "@/components/admin/shared";
import { formatKarachiDate, formatPKR } from "@/lib/format";
import LabOrderDialog from "./LabOrderDialog";
import type { LabOrderRow } from "./types";

export default function LabOrdersPanel({
    initialOrders,
    patients,
    isAdmin,
}: {
    initialOrders: LabOrderRow[];
    patients: Array<{ id: string; name: string; phone: string | null }>;
    isAdmin: boolean;
}) {
    const [orders, setOrders] = useState<LabOrderRow[]>(initialOrders);
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [query, setQuery] = useState("");
    const [open, setOpen] = useState(false);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return orders.filter((o) => {
            if (statusFilter !== "ALL" && o.status !== statusFilter) return false;
            if (!q) return true;
            return (
                o.patientName.toLowerCase().includes(q) ||
                o.labName.toLowerCase().includes(q) ||
                o.workType.toLowerCase().includes(q)
            );
        });
    }, [orders, statusFilter, query]);

    const updateStatus = async (id: string, status: string) => {
        try {
            const res = await fetch(`/api/lab-orders/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Update failed");
            setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: data.order.status, receivedDate: data.order.receivedDate, deliveredDate: data.order.deliveredDate } : o)));
            toast.success(`Lab case marked as ${status.toLowerCase().replace("_", " ")}`);
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to update lab status");
        }
    };

    const inLab = orders.filter((o) => o.status === "SENT" || o.status === "IN_PROGRESS").length;
    const received = orders.filter((o) => o.status === "RECEIVED").length;
    const delivered = orders.filter((o) => o.status === "DELIVERED").length;

    return (
        <div className="space-y-6">
            <PageHeader
                title="Dental lab order tracking"
                subtitle="Track crowns, bridges, aligners, and prosthetics from dispatch to patient delivery."
                actions={isAdmin ? (
                    <button type="button" onClick={() => setOpen(true)} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold cursor-pointer">
                        <AddOutlined sx={{ fontSize: 16 }} /> New lab order
                    </button>
                ) : undefined}
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard label="At lab (active)" value={inLab} icon={<BiotechOutlined sx={{ fontSize: 18 }} />} iconTone="amber" />
                <StatCard label="Ready at clinic" value={received} icon={<LocalShippingOutlined sx={{ fontSize: 18 }} />} iconTone="teal" />
                <StatCard label="Delivered to patient" value={delivered} icon={<CheckCircleOutlineOutlined sx={{ fontSize: 18 }} />} iconTone="emerald" />
            </div>

            <FilterBar
                options={[
                    { value: "ALL", label: "All orders", count: orders.length },
                    { value: "SENT", label: "Sent", count: orders.filter((o) => o.status === "SENT").length },
                    { value: "IN_PROGRESS", label: "In progress", count: orders.filter((o) => o.status === "IN_PROGRESS").length },
                    { value: "RECEIVED", label: "Received", count: received },
                    { value: "DELIVERED", label: "Delivered", count: delivered },
                ]}
                value={statusFilter}
                onChange={setStatusFilter}
                rightSlot={<SearchInput value={query} onChange={setQuery} placeholder="Search patient, lab, work..." className="w-60" />}
            />

            <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                        <tr>
                            <th className="px-4 py-3">Patient</th>
                            <th className="px-4 py-3">Work &amp; Lab</th>
                            <th className="px-4 py-3">Expected</th>
                            {isAdmin && <th className="px-4 py-3 text-right">Lab cost</th>}
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3 text-right">Update status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filtered.length === 0 ? (
                            <tr><td colSpan={isAdmin ? 6 : 5} className="py-10 text-center text-slate-500">No lab orders match this filter.</td></tr>
                        ) : filtered.map((o) => (
                            <tr key={o.id} className="hover:bg-slate-50/70">
                                <td className="px-4 py-3 font-semibold text-slate-900">{o.patientName}</td>
                                <td className="px-4 py-3">
                                    <p className="font-semibold text-slate-800">{o.workType}{o.toothNumbers ? ` · ${o.toothNumbers}` : ""}{o.shade ? ` (${o.shade})` : ""}</p>
                                    <p className="text-[11px] text-slate-500">{o.labName}</p>
                                </td>
                                <td className="px-4 py-3 text-slate-600">{o.expectedDate ? formatKarachiDate(o.expectedDate, "short") : "—"}</td>
                                {isAdmin && <td className="px-4 py-3 text-right font-semibold">{formatPKR(o.cost)}</td>}
                                <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                                <td className="px-4 py-3 text-right whitespace-nowrap space-x-1">
                                    {(o.status === "SENT" || o.status === "IN_PROGRESS") && (
                                        <button type="button" onClick={() => updateStatus(o.id, "RECEIVED")} className="px-2.5 py-1 rounded-lg border border-teal-200 text-teal-700 hover:bg-teal-50 font-semibold cursor-pointer">Mark received</button>
                                    )}
                                    {o.status === "RECEIVED" && (
                                        <button type="button" onClick={() => updateStatus(o.id, "DELIVERED")} className="px-2.5 py-1 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold cursor-pointer">Mark delivered</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isAdmin && <LabOrderDialog open={open} onOpenChange={setOpen} patients={patients} onCreated={(row) => setOrders((p) => [row, ...p])} />}
        </div>
    );
}
