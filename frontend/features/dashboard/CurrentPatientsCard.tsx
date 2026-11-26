"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import PersonAddAlt1Outlined from "@mui/icons-material/PersonAddAlt1Outlined";
import { FilterBar, Pagination, SearchInput } from "@/components/admin/shared";
import { APPOINTMENT_STATUS_LIST } from "@/lib/constants/status";
import { getKarachiDateKey } from "@/lib/format";
import PatientQueueTable from "./PatientQueueTable";
import QueueDateFilter from "./QueueDateFilter";
import type { DashboardQueueAppointment } from "./types";

interface CurrentPatientsCardProps {
    role: "ADMIN" | "STAFF";
    appointments: DashboardQueueAppointment[];
    busyId: string | null;
    onStatusChange: (aptId: string, nextStatus: string) => void;
    onCheckout: (apt: DashboardQueueAppointment) => void;
    onReschedule: (apt: DashboardQueueAppointment) => void;
    onRequestCancel: (apt: DashboardQueueAppointment) => void;
    onAddPatientClick?: () => void;
}

export default function CurrentPatientsCard({
    role,
    appointments,
    busyId,
    onStatusChange,
    onCheckout,
    onReschedule,
    onRequestCancel,
    onAddPatientClick,
}: CurrentPatientsCardProps) {
    const todayKey = getKarachiDateKey(new Date());
    const [dateFilter, setDateFilter] = useState<string>(todayKey);
    const [statusFilter, setStatusFilter] = useState<string>("ALL");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const pageSize = 6;

    const isToday = dateFilter === todayKey;

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        return appointments.filter((a) => {
            if (dateFilter && dateFilter !== "ALL" && a.dateKey !== dateFilter) return false;
            if (statusFilter !== "ALL" && a.status !== statusFilter) return false;
            if (!q) return true;
            return (
                (a.patient?.name || "").toLowerCase().includes(q) ||
                (a.patient?.phone || "").toLowerCase().includes(q) ||
                a.treatment.name.toLowerCase().includes(q)
            );
        });
    }, [appointments, dateFilter, statusFilter, search]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

    return (
        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-100 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                        <h2 className="text-base font-bold text-slate-900">
                            {isToday ? "Today's patients" : "Current patients"}
                        </h2>
                        <p className="text-xs text-slate-500">
                            {filtered.length} appointment{filtered.length === 1 ? "" : "s"} shown
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <SearchInput
                            value={search}
                            onChange={(v) => { setSearch(v); setPage(1); }}
                            placeholder="Search name, phone, service..."
                            className="w-full sm:w-52"
                        />
                        {onAddPatientClick ? (
                            <button
                                type="button"
                                onClick={onAddPatientClick}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold cursor-pointer"
                            >
                                <PersonAddAlt1Outlined sx={{ fontSize: 15 }} />
                                <span>Add patient</span>
                            </button>
                        ) : (
                            <Link
                                href={`/${role === "ADMIN" ? "admin" : "staff"}/walk-in`}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold"
                            >
                                <PersonAddAlt1Outlined sx={{ fontSize: 15 }} />
                                <span>Add patient</span>
                            </Link>
                        )}
                    </div>
                </div>

                <FilterBar
                    value={statusFilter}
                    onChange={(v) => { setStatusFilter(v); setPage(1); }}
                    options={[
                        { value: "ALL", label: "All statuses" },
                        ...APPOINTMENT_STATUS_LIST.map((s) => ({ value: s.value, label: s.label })),
                    ]}
                    rightSlot={
                        <QueueDateFilter
                            dateFilter={dateFilter}
                            todayKey={todayKey}
                            onChange={(v) => { setDateFilter(v); setPage(1); }}
                        />
                    }
                />
            </div>

            <PatientQueueTable
                appointments={paged}
                role={role}
                busyId={busyId}
                onStatusChange={onStatusChange}
                onCheckout={onCheckout}
                onReschedule={onReschedule}
                onRequestCancel={onRequestCancel}
            />

            <Pagination
                page={page}
                totalPages={totalPages}
                totalItems={filtered.length}
                pageSize={pageSize}
                onPageChange={setPage}
            />
        </div>
    );
}
