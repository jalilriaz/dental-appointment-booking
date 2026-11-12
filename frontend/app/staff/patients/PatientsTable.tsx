"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
    SearchOutlined,
    PhoneOutlined,
    WhatsApp,
    ChevronLeftOutlined,
    ChevronRightOutlined,
    CalendarMonthOutlined,
    PersonOutlineOutlined,
    WarningAmberOutlined,
    AutoAwesomeOutlined,
    MedicalServicesOutlined,
    BadgeOutlined,
    FilterListOutlined,
    ClearOutlined,
    AddOutlined,
    VisibilityOutlined,
    CheckCircleOutlineOutlined,
    PeopleAltOutlined,
} from "@mui/icons-material";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDate, formatPKR } from "@/lib/utils";
import PatientHistoryDialog from "@/components/shared/PatientHistoryDialog";
import RegisterPatientDialog from "@/components/admin/RegisterPatientDialog";

export interface PatientRow {
    id: string;
    patientCode?: number | null;
    name: string | null;
    email: string | null;
    phone: string | null;
    gender?: string | null;
    dateOfBirth?: string | null;
    medicalAlerts?: string | null;
    address?: string | null;
    createdAt: string;
    appointmentCount: number;
    lastAppointment: {
        startTime: string;
        treatmentName?: string;
        status?: string;
    } | null;
    activePlan?: {
        id: string;
        treatmentName: string;
        totalSessions: number;
        totalCost: number;
        clinicalStatus: string;
        financialStatus: string;
    } | null;
}

type FilterMode = "ALL" | "ACTIVE_PLANS" | "MEDICAL_ALERTS" | "WITH_VISITS";
type SortOption = "NAME_ASC" | "NAME_DESC" | "RECENT_VISIT" | "MOST_VISITS" | "CODE_ASC";

export default function PatientsTable({
    patients,
    baseRoute = "/staff",
}: {
    patients: PatientRow[];
    baseRoute?: "/staff" | "/admin";
}) {
    // ─── Patient Record State (Dynamic Updates) ───
    const [records, setRecords] = useState<PatientRow[]>(patients);
    useEffect(() => {
        setRecords(patients);
    }, [patients]);

    // ─── Filter & Search State ───
    const [searchQuery, setSearchQuery] = useState("");
    const [filterMode, setFilterMode] = useState<FilterMode>("ALL");
    const [sortBy, setSortBy] = useState<SortOption>("RECENT_VISIT");
    const [page, setPage] = useState(1);
    const perPage = 10;

    // ─── Patient Dialogs State ───
    const [dossierPatientId, setDossierPatientId] = useState<string | null>(null);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);

    // ─── Telemetry KPI Metrics ───
    const kpiMetrics = useMemo(() => {
        const total = records.length;
        const activePlans = records.filter((p) => Boolean(p.activePlan)).length;
        const medicalAlerts = records.filter((p) => Boolean(p.medicalAlerts)).length;
        const withVisits = records.filter((p) => p.appointmentCount > 0).length;

        return { total, activePlans, medicalAlerts, withVisits };
    }, [records]);

    // ─── Age Helper ───
    const getAge = (dob: string | null | undefined) => {
        if (!dob) return null;
        const diffMs = Date.now() - new Date(dob).getTime();
        const ageDate = new Date(diffMs);
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    };

    // ─── Filtering & Sorting Pipeline ───
    const filteredPatients = useMemo(() => {
        return records
            .filter((p) => {
                // Quick Category Filters
                if (filterMode === "ACTIVE_PLANS" && !p.activePlan) return false;
                if (filterMode === "MEDICAL_ALERTS" && !p.medicalAlerts) return false;
                if (filterMode === "WITH_VISITS" && p.appointmentCount === 0) return false;

                // Search Query Matching
                if (!searchQuery.trim()) return true;
                const query = searchQuery.toLowerCase().trim();

                const nameMatch = (p.name || "").toLowerCase().includes(query);
                const phoneMatch = (p.phone || "").toLowerCase().includes(query);
                const emailMatch = (p.email || "").toLowerCase().includes(query);
                const codeMatch = p.patientCode ? String(p.patientCode).includes(query) : false;
                const alertMatch = (p.medicalAlerts || "").toLowerCase().includes(query);
                const planMatch = (p.activePlan?.treatmentName || "").toLowerCase().includes(query);

                return nameMatch || phoneMatch || emailMatch || codeMatch || alertMatch || planMatch;
            })
            .sort((a, b) => {
                switch (sortBy) {
                    case "NAME_ASC":
                        return (a.name || "").localeCompare(b.name || "");
                    case "NAME_DESC":
                        return (b.name || "").localeCompare(a.name || "");
                    case "MOST_VISITS":
                        return b.appointmentCount - a.appointmentCount;
                    case "CODE_ASC":
                        return (a.patientCode || 99999) - (b.patientCode || 99999);
                    case "RECENT_VISIT":
                    default: {
                        const dateA = a.lastAppointment ? new Date(a.lastAppointment.startTime).getTime() : 0;
                        const dateB = b.lastAppointment ? new Date(b.lastAppointment.startTime).getTime() : 0;
                        return dateB - dateA;
                    }
                }
            });
    }, [patients, searchQuery, filterMode, sortBy]);

    // ─── Pagination ───
    const totalPages = Math.ceil(filteredPatients.length / perPage) || 1;
    const pagedPatients = useMemo(() => {
        const start = (page - 1) * perPage;
        return filteredPatients.slice(start, start + perPage);
    }, [filteredPatients, page, perPage]);

    // Reset page to 1 when filters change
    const handleFilterModeChange = (mode: FilterMode) => {
        setFilterMode(mode);
        setPage(1);
    };

    const handleSearchChange = (val: string) => {
        setSearchQuery(val);
        setPage(1);
    };

    return (
        <div className="space-y-6 font-sans">
            {/* ─── Header Section ─── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
                <div>
                    <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200/90 inline-flex items-center gap-1.5 shadow-2xs">
                            <MedicalServicesOutlined sx={{ fontSize: 13 }} className="text-teal-600" />
                            Clinical Patient Registry
                        </span>
                        <span className="text-slate-300">·</span>
                        <span className="text-xs font-bold text-slate-500">
                            {kpiMetrics.total} Verified Health Records
                        </span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black text-[#0B1528] tracking-tight">
                        Patient Directory
                    </h1>
                    <p className="text-xs sm:text-sm font-medium text-slate-600 mt-0.5">
                        Centralized electronic patient records, active multi-session treatment plans, and medical history dossiers.
                    </p>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                    <Button
                        type="button"
                        onClick={() => setIsRegisterOpen(true)}
                        className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs gap-1.5 cursor-pointer px-4 h-9"
                    >
                        <AddOutlined sx={{ fontSize: 16 }} />
                        <span>Register New Patient</span>
                    </Button>
                </div>
            </div>

            {/* ─── Top 4 Metric KPI Cards (1-Click Filters) ─── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {/* 1. Total Patients */}
                <button
                    type="button"
                    onClick={() => handleFilterModeChange("ALL")}
                    className={`p-4 rounded-3xl border transition-all text-left cursor-pointer group ${
                        filterMode === "ALL"
                            ? "bg-teal-50/70 border-teal-400 ring-2 ring-teal-500/20 shadow-xs"
                            : "bg-white border-slate-200/80 hover:border-slate-300 shadow-2xs hover:shadow-xs"
                    }`}
                >
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 group-hover:text-slate-800 transition-colors">
                            Total Patients
                        </span>
                        <div className="size-8 rounded-xl bg-teal-50 text-teal-700 border border-teal-200/80 flex items-center justify-center">
                            <PeopleAltOutlined sx={{ fontSize: 16 }} />
                        </div>
                    </div>
                    <p className="text-2xl sm:text-3xl font-black text-[#0B1528] tracking-tight mt-2">
                        {kpiMetrics.total}
                    </p>
                    <p className="text-[11px] font-medium text-slate-500 mt-1 flex items-center gap-1.5">
                        <span className="size-1.5 rounded-full bg-teal-500" />
                        <span>All registered records</span>
                    </p>
                </button>

                {/* 2. Active Multi-Session Plans */}
                <button
                    type="button"
                    onClick={() => handleFilterModeChange("ACTIVE_PLANS")}
                    className={`p-4 rounded-3xl border transition-all text-left cursor-pointer group ${
                        filterMode === "ACTIVE_PLANS"
                            ? "bg-teal-50/70 border-teal-400 ring-2 ring-teal-500/20 shadow-xs"
                            : "bg-white border-slate-200/80 hover:border-slate-300 shadow-2xs hover:shadow-xs"
                    }`}
                >
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 group-hover:text-teal-900 transition-colors">
                            Active Plans
                        </span>
                        <div className="size-8 rounded-xl bg-teal-50 text-teal-700 border border-teal-200/80 flex items-center justify-center">
                            <AutoAwesomeOutlined sx={{ fontSize: 16 }} />
                        </div>
                    </div>
                    <p className="text-2xl sm:text-3xl font-black text-[#0B1528] tracking-tight mt-2">
                        {kpiMetrics.activePlans}
                    </p>
                    <p className="text-[11px] font-medium text-teal-700 mt-1 flex items-center gap-1.5">
                        <span className="size-1.5 rounded-full bg-teal-600 animate-pulse" />
                        <span>Multi-session treatments</span>
                    </p>
                </button>

                {/* 3. Flagged Medical Alerts */}
                <button
                    type="button"
                    onClick={() => handleFilterModeChange("MEDICAL_ALERTS")}
                    className={`p-4 rounded-3xl border transition-all text-left cursor-pointer group ${
                        filterMode === "MEDICAL_ALERTS"
                            ? "bg-amber-50/80 border-amber-400 ring-2 ring-amber-500/20 shadow-xs"
                            : "bg-white border-slate-200/80 hover:border-slate-300 shadow-2xs hover:shadow-xs"
                    }`}
                >
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 group-hover:text-amber-950 transition-colors">
                            Medical Alerts
                        </span>
                        <div className="size-8 rounded-xl bg-amber-50 text-amber-700 border border-amber-200/80 flex items-center justify-center">
                            <WarningAmberOutlined sx={{ fontSize: 16 }} />
                        </div>
                    </div>
                    <p className="text-2xl sm:text-3xl font-black text-[#0B1528] tracking-tight mt-2">
                        {kpiMetrics.medicalAlerts}
                    </p>
                    <p className="text-[11px] font-bold text-amber-700 mt-1 flex items-center gap-1.5">
                        <span className="size-1.5 rounded-full bg-amber-600" />
                        <span>Allergies &amp; precautions</span>
                    </p>
                </button>

                {/* 4. Active Patients with Visits */}
                <button
                    type="button"
                    onClick={() => handleFilterModeChange("WITH_VISITS")}
                    className={`p-4 rounded-3xl border transition-all text-left cursor-pointer group ${
                        filterMode === "WITH_VISITS"
                            ? "bg-teal-50/70 border-teal-400 ring-2 ring-teal-500/20 shadow-xs"
                            : "bg-white border-slate-200/80 hover:border-slate-300 shadow-2xs hover:shadow-xs"
                    }`}
                >
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 group-hover:text-slate-800 transition-colors">
                            Visit History
                        </span>
                        <div className="size-8 rounded-xl bg-slate-50 text-slate-700 border border-slate-200/80 flex items-center justify-center">
                            <CalendarMonthOutlined sx={{ fontSize: 16 }} />
                        </div>
                    </div>
                    <p className="text-2xl sm:text-3xl font-black text-[#0B1528] tracking-tight mt-2">
                        {kpiMetrics.withVisits}
                    </p>
                    <p className="text-[11px] font-medium text-slate-500 mt-1 flex items-center gap-1.5">
                        <span className="size-1.5 rounded-full bg-emerald-500" />
                        <span>Completed appointments</span>
                    </p>
                </button>
            </div>

            {/* ─── Search & Filter Command Center ─── */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-4 sm:p-5 space-y-3.5">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <h2 className="text-sm font-black text-slate-900 tracking-tight">Patient Directory</h2>
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                            {filteredPatients.length} Results
                        </span>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                            Filter Mode:
                        </span>
                        <span className="text-xs font-extrabold text-teal-800 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
                            {filterMode.replace("_", " ")}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                    {/* Live Omnisearch Input */}
                    <div className="sm:col-span-8 relative">
                        <SearchOutlined className="size-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <Input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            placeholder="Search by patient name, phone (+92...), email, or patient code (#1001)..."
                            className="w-full pl-10 pr-9 h-10 text-xs sm:text-sm bg-slate-50/70 border-slate-200/90 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-500/10 transition-all font-medium"
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={() => handleSearchChange("")}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-0.5 rounded-full hover:bg-slate-200/60"
                                title="Clear search"
                            >
                                <ClearOutlined sx={{ fontSize: 16 }} />
                            </button>
                        )}
                    </div>

                    {/* Sort Order Selector */}
                    <div className="sm:col-span-4">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as SortOption)}
                            className="w-full h-10 px-3.5 text-xs font-bold text-slate-800 bg-slate-50/70 border border-slate-200/90 rounded-2xl focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-500/10 cursor-pointer outline-none transition-all"
                        >
                            <option value="RECENT_VISIT">Sort: Most Recent Visit</option>
                            <option value="NAME_ASC">Sort: Patient Name (A – Z)</option>
                            <option value="NAME_DESC">Sort: Patient Name (Z – A)</option>
                            <option value="MOST_VISITS">Sort: Most Visits</option>
                            <option value="CODE_ASC">Sort: Patient Code (#1001+)</option>
                        </select>
                    </div>
                </div>

                {/* Filter Pills */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-100 text-xs">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
                        Quick Views:
                    </span>
                    <button
                        type="button"
                        onClick={() => handleFilterModeChange("ALL")}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            filterMode === "ALL"
                                ? "bg-teal-600 text-white shadow-2xs"
                                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                        }`}
                    >
                        All ({kpiMetrics.total})
                    </button>
                    <button
                        type="button"
                        onClick={() => handleFilterModeChange("ACTIVE_PLANS")}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                            filterMode === "ACTIVE_PLANS"
                                ? "bg-teal-600 text-white shadow-2xs"
                                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                        }`}
                    >
                        <AutoAwesomeOutlined sx={{ fontSize: 13 }} />
                        <span>Active Plans ({kpiMetrics.activePlans})</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => handleFilterModeChange("MEDICAL_ALERTS")}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                            filterMode === "MEDICAL_ALERTS"
                                ? "bg-amber-600 text-white shadow-2xs"
                                : "bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/80"
                        }`}
                    >
                        <WarningAmberOutlined sx={{ fontSize: 13 }} />
                        <span>Medical Alerts ({kpiMetrics.medicalAlerts})</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => handleFilterModeChange("WITH_VISITS")}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            filterMode === "WITH_VISITS"
                                ? "bg-teal-600 text-white shadow-2xs"
                                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                        }`}
                    >
                        Visit History ({kpiMetrics.withVisits})
                    </button>
                </div>
            </div>

            {/* ─── Patient Directory Table ─── */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[10.5px] font-black uppercase tracking-wider text-slate-500">
                                <th className="py-3 px-4 w-16"># Code</th>
                                <th className="py-3 px-4 min-w-[260px]">Patient Profile &amp; Alerts</th>
                                <th className="py-3 px-4 min-w-[190px]">Contact &amp; Reach</th>
                                <th className="py-3 px-4 min-w-[220px]">Active Clinical Plan</th>
                                <th className="py-3 px-4 min-w-[160px]">Visit Timeline</th>
                                <th className="py-3 px-4 text-right min-w-[170px]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs">
                            {pagedPatients.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-16 text-center text-slate-500">
                                        <div className="size-14 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center mx-auto mb-3">
                                            <PersonOutlineOutlined sx={{ fontSize: 28, color: "#94a3b8" }} />
                                        </div>
                                        <p className="font-extrabold text-slate-800 text-sm">No matching patient records</p>
                                        <p className="text-xs text-slate-400 mt-1">
                                            Try adjusting your search keywords or active quick-view filter.
                                        </p>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                setSearchQuery("");
                                                setFilterMode("ALL");
                                            }}
                                            className="mt-3.5 rounded-xl border-slate-300 text-xs font-bold cursor-pointer"
                                        >
                                            Reset Filters
                                        </Button>
                                    </td>
                                </tr>
                            ) : (
                                pagedPatients.map((p) => {
                                    const age = getAge(p.dateOfBirth);
                                    const cleanPhone = (p.phone || "").replace(/[^0-9]/g, "");

                                    return (
                                        <tr
                                            key={p.id}
                                            className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                                            onClick={() => setDossierPatientId(p.id)}
                                        >
                                            {/* 1. Patient Code */}
                                            <td className="py-3.5 px-4 font-black text-slate-400 text-xs group-hover:text-teal-700 transition-colors">
                                                <span className="font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md text-[11px] font-bold border border-slate-200">
                                                    #{p.patientCode || p.id.slice(-4).toUpperCase()}
                                                </span>
                                            </td>

                                            {/* 2. Patient Profile & Demographics */}
                                            <td className="py-3.5 px-4">
                                                <div className="flex items-start gap-3">
                                                    <div className="size-10 rounded-2xl bg-teal-50 text-teal-800 font-black text-sm border border-teal-200/80 flex items-center justify-center shrink-0 shadow-2xs group-hover:border-teal-400 group-hover:scale-105 transition-all">
                                                        {(p.name || "P").charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex items-center gap-1.5 flex-wrap">
                                                            <span className="font-extrabold text-slate-900 text-sm group-hover:text-teal-700 transition-colors">
                                                                {p.name || "Anonymous Patient"}
                                                            </span>
                                                            {(p.gender || age) && (
                                                                <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-1.5 py-0.2 rounded border border-slate-200">
                                                                    {[p.gender, age ? `${age}y` : null].filter(Boolean).join(" · ")}
                                                                </span>
                                                            )}
                                                        </div>

                                                        {p.email && (
                                                            <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                                                                {p.email}
                                                            </p>
                                                        )}

                                                        {/* Medical Alert Warning Pill */}
                                                        {p.medicalAlerts ? (
                                                            <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-300 font-extrabold text-[10px] shadow-2xs">
                                                                <WarningAmberOutlined sx={{ fontSize: 12 }} className="text-amber-600" />
                                                                <span className="truncate max-w-[210px]">{p.medicalAlerts}</span>
                                                            </div>
                                                        ) : (
                                                            <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
                                                                No medical allergies flagged
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>

                                            {/* 3. Contact & Reach */}
                                            <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                                                {p.phone ? (
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                                                            <PhoneOutlined sx={{ fontSize: 13 }} className="text-teal-600" />
                                                            <span>{p.phone}</span>
                                                        </div>
                                                        <a
                                                            href={`https://wa.me/${cleanPhone}?text=Hello%20${encodeURIComponent(p.name || "Patient")},%20this%20is%20Elite%20Dental%20Centre.`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1 text-[10.5px] font-extrabold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/90 px-2 py-0.5 rounded-lg transition-colors cursor-pointer"
                                                        >
                                                            <WhatsApp sx={{ fontSize: 12 }} className="text-emerald-600" />
                                                            <span>WhatsApp Reach</span>
                                                        </a>
                                                    </div>
                                                ) : (
                                                    <span className="text-slate-400 font-mono text-xs">—</span>
                                                )}
                                            </td>

                                            {/* 4. Active Clinical Plan */}
                                            <td className="py-3.5 px-4">
                                                {p.activePlan ? (
                                                    <div className="p-2 rounded-xl bg-teal-50/70 border border-teal-200/80 space-y-0.5">
                                                        <div className="flex items-center gap-1 text-teal-900 font-extrabold text-xs">
                                                            <AutoAwesomeOutlined sx={{ fontSize: 13 }} className="text-teal-600" />
                                                            <span className="truncate">{p.activePlan.treatmentName}</span>
                                                        </div>
                                                        <p className="text-[10px] text-teal-700 font-semibold">
                                                            Multi-Session Plan ({p.activePlan.totalSessions} Sessions)
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <div className="text-slate-500 font-medium text-xs">
                                                        <span className="text-slate-700 font-bold block">Routine General Care</span>
                                                        <span className="text-[10px] text-slate-400">No multi-session plan active</span>
                                                    </div>
                                                )}
                                            </td>

                                            {/* 5. Visit Timeline & History */}
                                            <td className="py-3.5 px-4">
                                                <div className="space-y-1">
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-black bg-slate-100 text-slate-800 border border-slate-200">
                                                        {p.appointmentCount} {p.appointmentCount === 1 ? "Encounter" : "Encounters"}
                                                    </span>
                                                    {p.lastAppointment ? (
                                                        <p className="text-[11px] text-slate-600 font-semibold flex items-center gap-1">
                                                            <CalendarMonthOutlined sx={{ fontSize: 12 }} className="text-slate-400" />
                                                            <span>{formatDate(p.lastAppointment.startTime)}</span>
                                                        </p>
                                                    ) : (
                                                        <p className="text-[10px] text-slate-400">First-time registered</p>
                                                    )}
                                                </div>
                                            </td>

                                            {/* 6. Action Suite (Icon-Only Actions) */}
                                            <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => setDossierPatientId(p.id)}
                                                        className="size-8 p-0 rounded-xl border-slate-200 bg-white hover:bg-teal-50 hover:text-teal-800 text-slate-600 hover:border-teal-300 transition-all cursor-pointer shadow-2xs"
                                                        title="Quick Dossier Modal"
                                                        aria-label="Quick Dossier Modal"
                                                    >
                                                        <VisibilityOutlined sx={{ fontSize: 15 }} />
                                                    </Button>

                                                    <Link href={`${baseRoute}/patients/${p.id}`}>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="size-8 p-0 rounded-xl border-slate-200 bg-white hover:bg-teal-50 hover:text-teal-800 text-slate-600 hover:border-teal-300 transition-all cursor-pointer shadow-2xs"
                                                            title="Full Health Record & Dossier"
                                                            aria-label="Full Health Record & Dossier"
                                                        >
                                                            <BadgeOutlined sx={{ fontSize: 15 }} />
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* ─── Pagination Footer ─── */}
                {totalPages > 1 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50/70 gap-3">
                        <p className="text-xs font-semibold text-slate-500">
                            Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, filteredPatients.length)} of {filteredPatients.length} patients
                        </p>
                        <div className="flex items-center gap-1.5">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={page <= 1}
                                onClick={() => setPage(page - 1)}
                                className="size-8 p-0 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 cursor-pointer disabled:opacity-40"
                                aria-label="Previous page"
                            >
                                <ChevronLeftOutlined sx={{ fontSize: 16 }} />
                            </Button>
                            {Array.from({ length: Math.min(totalPages, 6) }).map((_, i) => (
                                <Button
                                    key={i}
                                    size="sm"
                                    onClick={() => setPage(i + 1)}
                                    className={`size-8 p-0 rounded-xl text-xs font-black transition-all cursor-pointer ${
                                        page === i + 1
                                            ? "bg-[#0B1528] text-white shadow-xs"
                                            : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                                    }`}
                                >
                                    {i + 1}
                                </Button>
                            ))}
                            {totalPages > 6 && <span className="text-slate-400 text-xs px-1">…</span>}
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={page >= totalPages}
                                onClick={() => setPage(page + 1)}
                                className="size-8 p-0 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 cursor-pointer disabled:opacity-40"
                                aria-label="Next page"
                            >
                                <ChevronRightOutlined sx={{ fontSize: 16 }} />
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* ─── In-Page Patient Dossier Dialog ─── */}
            <PatientHistoryDialog
                patientId={dossierPatientId}
                open={Boolean(dossierPatientId)}
                onOpenChange={(open) => {
                    if (!open) setDossierPatientId(null);
                }}
            />

            {/* ─── In-Page Register New Patient Dialog ─── */}
            <RegisterPatientDialog
                open={isRegisterOpen}
                onOpenChange={setIsRegisterOpen}
                onSuccess={(newPatient) => {
                    setRecords((prev) => [newPatient, ...prev]);
                }}
            />
        </div>
    );
}
