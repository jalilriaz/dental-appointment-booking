"use client";

import React from "react";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import AutorenewOutlinedIcon from "@mui/icons-material/AutorenewOutlined";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import DirectionsWalkOutlinedIcon from "@mui/icons-material/DirectionsWalkOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import ChevronLeftOutlinedIcon from "@mui/icons-material/ChevronLeftOutlined";
import type { PatientResult } from "./types";

interface PatientDirectorySearchProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    channelFilter: "ALL" | "WEBSITE" | "WHATSAPP_BOT" | "WALK_IN";
    setChannelFilter: (filter: "ALL" | "WEBSITE" | "WHATSAPP_BOT" | "WALK_IN") => void;
    results: PatientResult[];
    searching: boolean;
    totalPatients: number;
    currentPage: number;
    totalPages: number;
    goToPage: (page: number) => void;
    onSelectPatient: (patientId: string) => void;
    channelPillsRenderer: (appointments?: { bookedBy?: string }[]) => React.ReactNode;
}

export default function PatientDirectorySearch({
    searchQuery,
    setSearchQuery,
    channelFilter,
    setChannelFilter,
    results,
    searching,
    totalPatients,
    currentPage,
    totalPages,
    goToPage,
    onSelectPatient,
    channelPillsRenderer,
}: PatientDirectorySearchProps) {
    return (
        <div className="space-y-6">
            {/* Box 1: Patient Directory Search & Origin Channel Filters */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <span className="text-xs font-black text-teal-800 uppercase tracking-wider flex items-center gap-2">
                            <SearchOutlinedIcon sx={{ fontSize: 16 }} />
                            <span>Patient Directory</span>
                        </span>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                            Search registered patients across Website, WhatsApp Bot, and Walk-In to review clinical history and schedule appointments.
                        </p>
                    </div>
                    <span className="text-xs font-black text-teal-900 bg-teal-50 px-3.5 py-1 rounded-full border border-teal-200/80 w-fit shrink-0">
                        {totalPatients} Registered Patients
                    </span>
                </div>

                {/* Search Input Box */}
                <div className="relative">
                    <SearchOutlinedIcon sx={{ fontSize: 18 }} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by name, phone (03xx / +92), or MRN (1001)..."
                        className="w-full pl-10 pr-9 py-2.5 bg-slate-50 hover:bg-slate-50/80 focus:bg-white border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all font-medium"
                    />
                    {searchQuery && (
                        <button
                            type="button"
                            onClick={() => setSearchQuery("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                            title="Clear search"
                        >
                            <ClearOutlinedIcon sx={{ fontSize: 16 }} />
                        </button>
                    )}
                    {searching && !searchQuery && (
                        <AutorenewOutlinedIcon sx={{ fontSize: 16 }} className="absolute right-3 top-1/2 -translate-y-1/2 text-teal-600 animate-spin" />
                    )}
                </div>

                {/* Booking Origin Channel Quick Filter Chips */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">Origin Channel:</span>
                    <button
                        type="button"
                        onClick={() => setChannelFilter("ALL")}
                        className={`px-3 py-1.5 rounded-xl text-[11px] font-extrabold transition-all cursor-pointer border ${
                            channelFilter === "ALL"
                                ? "bg-teal-600 text-white border-teal-600 shadow-2xs"
                                : "bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200/80"
                        }`}
                    >
                        All Channels
                    </button>
                    <button
                        type="button"
                        onClick={() => setChannelFilter("WHATSAPP_BOT")}
                        className={`px-3 py-1.5 rounded-xl text-[11px] font-extrabold transition-all cursor-pointer flex items-center gap-1.5 border ${
                            channelFilter === "WHATSAPP_BOT"
                                ? "bg-emerald-600 text-white border-emerald-600 shadow-2xs"
                                : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border-emerald-200/80"
                        }`}
                    >
                        <WhatsAppIcon sx={{ fontSize: 13 }} />
                        <span>WhatsApp Bot</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setChannelFilter("WEBSITE")}
                        className={`px-3 py-1.5 rounded-xl text-[11px] font-extrabold transition-all cursor-pointer flex items-center gap-1.5 border ${
                            channelFilter === "WEBSITE"
                                ? "bg-teal-700 text-white border-teal-700 shadow-2xs"
                                : "bg-teal-50 text-teal-800 hover:bg-teal-100 border-teal-200/80"
                        }`}
                    >
                        <LanguageOutlinedIcon sx={{ fontSize: 13 }} />
                        <span>Website</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setChannelFilter("WALK_IN")}
                        className={`px-3 py-1.5 rounded-xl text-[11px] font-extrabold transition-all cursor-pointer flex items-center gap-1.5 border ${
                            channelFilter === "WALK_IN"
                                ? "bg-slate-800 text-white border-slate-800 shadow-2xs"
                                : "bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200/80"
                        }`}
                    >
                        <DirectionsWalkOutlinedIcon sx={{ fontSize: 13 }} />
                        <span>Walk-In</span>
                    </button>
                </div>
            </div>

            {/* Box 2: Registered Patients Responsive Cards */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between text-xs text-slate-500 font-semibold">
                    <span className="font-extrabold text-slate-700">
                        {searchQuery.trim().length >= 2 ? (
                            <>Results for <span className="text-teal-700 font-bold">&quot;{searchQuery}&quot;</span></>
                        ) : (
                            <>Registered Patients Directory</>
                        )}
                    </span>
                    {totalPages > 1 && (
                        <span className="text-[11px] text-slate-400 font-bold">Page {currentPage} of {totalPages}</span>
                    )}
                </div>

                {results.length === 0 ? (
                    <div className="p-12 text-center space-y-3">
                        <PersonOutlineOutlinedIcon sx={{ fontSize: 44 }} className="text-slate-300 mx-auto" />
                        <p className="text-base font-black text-slate-800">
                            {searchQuery.length >= 2 ? "No matching patients" : "No registered patients"}
                        </p>
                        <p className="text-xs text-slate-400 max-w-sm mx-auto">
                            {searchQuery.length >= 2
                                ? "Try searching by phone number (e.g. 03xx or +92) or click '+ Register New Walk-In'."
                                : "Use the '+ Register New Walk-In' tab above to register a new arrival."}
                        </p>
                    </div>
                ) : (
                    <div className="p-4 sm:p-5 lg:p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {results.map((patient) => {
                                const visitCount = patient._count?.appointments ?? patient.appointments?.length ?? 0;
                                const hasActivePlan = Boolean(patient.patientTreatments && patient.patientTreatments.length > 0);

                                return (
                                    <div
                                        key={patient.id}
                                        onClick={() => onSelectPatient(patient.id)}
                                        className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 hover:border-teal-400 hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer relative"
                                    >
                                        {/* Card Top: Avatar, Name & MRN */}
                                        <div className="space-y-3">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <div className="size-11 rounded-2xl bg-teal-50 text-teal-800 border border-teal-200/80 flex items-center justify-center font-black text-sm shrink-0 group-hover:bg-teal-600 group-hover:text-white transition-all shadow-2xs">
                                                        {(patient.name || "P").charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <h4 className="text-sm font-black text-slate-900 group-hover:text-teal-700 transition-colors truncate">
                                                            {patient.name}
                                                        </h4>
                                                        {patient.patientCode ? (
                                                            <span className="inline-block mt-0.5 text-[10px] font-mono font-extrabold px-1.5 py-0.2 rounded bg-teal-100/80 text-teal-800 border border-teal-200">
                                                                MRN #{patient.patientCode}
                                                            </span>
                                                        ) : (
                                                            <span className="text-[10px] text-slate-400 font-medium">No MRN</span>
                                                        )}
                                                    </div>
                                                </div>

                                                {patient.medicalAlerts && (
                                                    <div
                                                        className="size-7 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center shrink-0"
                                                        title={patient.medicalAlerts}
                                                    >
                                                        <SecurityOutlinedIcon sx={{ fontSize: 14, color: "#DC2626" }} />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Card Body: Phone, Visits, Channels */}
                                            <div className="space-y-2 text-xs">
                                                <div className="flex items-center justify-between text-slate-600 pt-2 border-t border-slate-100">
                                                    <span className="flex items-center gap-1 font-semibold text-[11px] truncate">
                                                        <PhoneOutlinedIcon sx={{ fontSize: 13, color: "#0D9488" }} />
                                                        <span>{patient.phone || "No phone"}</span>
                                                    </span>
                                                    <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md text-[10px] shrink-0">
                                                        {visitCount} {visitCount === 1 ? "Visit" : "Visits"}
                                                    </span>
                                                </div>

                                                {/* Origin Channels */}
                                                <div className="pt-0.5 flex flex-wrap gap-1">
                                                    {channelPillsRenderer(patient.appointments)}
                                                </div>

                                                {/* Active Plan Tag */}
                                                {hasActivePlan && (
                                                    <div className="flex items-center gap-1 text-[10px] font-black text-teal-800 bg-teal-50 px-2 py-1 rounded-lg border border-teal-200/70">
                                                        <AutoAwesomeOutlinedIcon sx={{ fontSize: 11 }} />
                                                        <span className="truncate">Active Plan: {patient.patientTreatments![0].treatment.name}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Card Footer: Action Button */}
                                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                                            <span className="text-[11px] font-extrabold text-teal-700 group-hover:text-teal-900 flex items-center gap-1">
                                                <EventAvailableOutlinedIcon sx={{ fontSize: 14 }} />
                                                <span>Schedule Appointment</span>
                                            </span>
                                            <ChevronRightOutlinedIcon
                                                sx={{ fontSize: 16 }}
                                                className="text-slate-300 group-hover:text-teal-600 group-hover:translate-x-0.5 transition-all"
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Pagination Bar */}
                {totalPages > 1 && (
                    <div className="px-5 py-3.5 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between text-xs font-bold text-slate-700">
                        <button
                            type="button"
                            onClick={() => goToPage(currentPage - 1)}
                            disabled={currentPage <= 1}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-2xs"
                        >
                            <ChevronLeftOutlinedIcon sx={{ fontSize: 14 }} />
                            <span>Prev</span>
                        </button>

                        <span className="text-[11px] font-bold text-slate-500">
                            Page {currentPage} of {totalPages}
                        </span>

                        <button
                            type="button"
                            onClick={() => goToPage(currentPage + 1)}
                            disabled={currentPage >= totalPages}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-2xs"
                        >
                            <span>Next</span>
                            <ChevronRightOutlinedIcon sx={{ fontSize: 14 }} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
