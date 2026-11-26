"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import AddOutlined from "@mui/icons-material/AddOutlined";
import HourglassTopOutlined from "@mui/icons-material/HourglassTopOutlined";
import NotificationsActiveOutlined from "@mui/icons-material/NotificationsActiveOutlined";
import EventAvailableOutlined from "@mui/icons-material/EventAvailableOutlined";
import { FilterBar, PageHeader, SearchInput, StatCard, StatusBadge } from "@/components/admin/shared";
import { formatKarachiDate } from "@/lib/format";
import WaitlistDialog from "./WaitlistDialog";
import type { WaitlistRow } from "./types";

export default function WaitlistPanel({
    initialEntries,
    treatments,
}: {
    initialEntries: WaitlistRow[];
    treatments: Array<{ id: string; name: string }>;
}) {
    const [entries, setEntries] = useState<WaitlistRow[]>(initialEntries);
    const [filter, setFilter] = useState("ALL");
    const [query, setQuery] = useState("");
    const [open, setOpen] = useState(false);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return entries.filter((e) => {
            if (filter !== "ALL" && e.status !== filter) return false;
            if (!q) return true;
            return e.patientName.toLowerCase().includes(q) || e.patientPhone.includes(q);
        });
    }, [entries, filter, query]);

    const handleNotify = async (id: string) => {
        try {
            const res = await fetch(`/api/waitlist/${id}`, { method: "POST" });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Notify failed");
            setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, status: data.entry.status, notifiedAt: data.entry.notifiedAt } : e)));
            toast.success(`Candidate notified (${data.deliveryStatus})`);
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to notify patient");
        }
    };

    const handleStatus = async (id: string, status: string) => {
        try {
            const res = await fetch(`/api/waitlist/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Update failed");
            setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, status: data.entry.status } : e)));
            toast.success("Waitlist updated");
        } catch {
            toast.error("Failed to update waitlist status");
        }
    };

    const waiting = entries.filter((e) => e.status === "WAITING").length;
    const notified = entries.filter((e) => e.status === "NOTIFIED").length;
    const booked = entries.filter((e) => e.status === "BOOKED").length;

    return (
        <div className="space-y-6">
            <PageHeader
                title="Cancellation waitlist & backfill"
                subtitle="Capture standby patients and fill opened slots as soon as an appointment cancels."
                actions={
                    <button type="button" onClick={() => setOpen(true)} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold cursor-pointer">
                        <AddOutlined sx={{ fontSize: 16 }} /> Add waitlist patient
                    </button>
                }
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard label="Waiting" value={waiting} icon={<HourglassTopOutlined sx={{ fontSize: 18 }} />} iconTone="amber" />
                <StatCard label="Slot offered (notified)" value={notified} icon={<NotificationsActiveOutlined sx={{ fontSize: 18 }} />} iconTone="sky" />
                <StatCard label="Backfilled / booked" value={booked} icon={<EventAvailableOutlined sx={{ fontSize: 18 }} />} iconTone="emerald" />
            </div>

            <FilterBar
                options={[
                    { value: "ALL", label: "All", count: entries.length },
                    { value: "WAITING", label: "Waiting", count: waiting },
                    { value: "NOTIFIED", label: "Notified", count: notified },
                    { value: "BOOKED", label: "Booked", count: booked },
                ]}
                value={filter}
                onChange={setFilter}
                rightSlot={<SearchInput value={query} onChange={setQuery} placeholder="Search name or phone..." className="w-60" />}
            />

            <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                        <tr>
                            <th className="px-4 py-3">Patient</th>
                            <th className="px-4 py-3">Preferred date &amp; window</th>
                            <th className="px-4 py-3">Treatment</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filtered.length === 0 ? (
                            <tr><td colSpan={5} className="py-10 text-center text-slate-500">No patients on the waitlist.</td></tr>
                        ) : filtered.map((e) => (
                            <tr key={e.id} className="hover:bg-slate-50/70">
                                <td className="px-4 py-3"><p className="font-semibold text-slate-900">{e.patientName}</p><p className="text-[11px] text-slate-500">{e.patientPhone}</p></td>
                                <td className="px-4 py-3 text-slate-700">{formatKarachiDate(e.preferredDate, "short")}{e.preferredTimeSlot ? ` · ${e.preferredTimeSlot}` : ""}</td>
                                <td className="px-4 py-3 text-slate-600">{e.treatmentName || "Any consultation"}</td>
                                <td className="px-4 py-3"><StatusBadge status={e.status} /></td>
                                <td className="px-4 py-3 text-right whitespace-nowrap space-x-1">
                                    {e.status === "WAITING" && (
                                        <button type="button" onClick={() => handleNotify(e.id)} className="px-2.5 py-1 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold cursor-pointer">Notify slot</button>
                                    )}
                                    {(e.status === "WAITING" || e.status === "NOTIFIED") && (
                                        <>
                                            <button type="button" onClick={() => handleStatus(e.id, "BOOKED")} className="px-2.5 py-1 rounded-lg border border-emerald-200 text-emerald-700 hover:bg-emerald-50 font-semibold cursor-pointer">Mark booked</button>
                                            <button type="button" onClick={() => handleStatus(e.id, "CANCELLED")} className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer">Cancel</button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <WaitlistDialog open={open} onOpenChange={setOpen} treatments={treatments} onCreated={(row) => setEntries((p) => [row, ...p])} />
        </div>
    );
}
