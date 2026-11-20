"use client";

import React from "react";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";

interface PatientDossierHeaderProps {
    patient: {
        id: string;
        name: string;
        phone: string | null;
        email: string | null;
        patientCode?: number | null;
    };
    visitsCount: number;
    patientAllChannels: string[];
    channelBadgeRenderer: (channel?: string) => React.ReactNode;
    onClearSelection: () => void;
}

export default function PatientDossierHeader({
    patient,
    visitsCount,
    patientAllChannels,
    channelBadgeRenderer,
    onClearSelection,
}: PatientDossierHeaderProps) {
    return (
        <div className="space-y-4">
            {/* Top Navigation Bar: Back to Directory & Switch Patient */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs">
                <button
                    type="button"
                    onClick={onClearSelection}
                    className="inline-flex items-center gap-2 text-xs sm:text-sm font-black text-teal-800 bg-teal-50 hover:bg-teal-100/80 border border-teal-200/80 px-4 py-2.5 rounded-xl shadow-2xs transition-all cursor-pointer w-fit"
                >
                    <ArrowBackOutlinedIcon sx={{ fontSize: 16 }} />
                    <span>Back to Patient Directory</span>
                </button>

                <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-xs text-slate-500 font-medium">
                        Active Patient: <strong className="text-slate-900">{patient.name}</strong>{" "}
                        {patient.patientCode && (
                            <span className="font-mono text-teal-700 font-black ml-1">
                                MRN #{patient.patientCode}
                            </span>
                        )}
                    </span>
                    <button
                        type="button"
                        onClick={onClearSelection}
                        className="inline-flex items-center gap-1 text-xs font-black text-slate-600 hover:text-red-700 bg-slate-50 hover:bg-red-50 border border-slate-200 hover:border-red-200 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
                    >
                        <CloseOutlinedIcon sx={{ fontSize: 14 }} />
                        <span>Switch Patient</span>
                    </button>
                </div>
            </div>

            {/* Selected Patient Dossier Header Card */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs relative overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-3.5 min-w-0">
                        <div className="size-13 rounded-2xl bg-gradient-to-br from-[#0F766E] to-[#0B1528] text-white flex items-center justify-center font-black text-lg shadow-sm shrink-0">
                            {(patient.name || "P").charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h2 className="text-lg sm:text-xl font-black text-slate-900 truncate tracking-tight">
                                    {patient.name}
                                </h2>
                                {patient.patientCode && (
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-black bg-teal-50 text-teal-800 border border-teal-200">
                                        MRN #{patient.patientCode}
                                    </span>
                                )}
                            </div>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mt-1">
                                {patient.phone && (
                                    <span className="flex items-center gap-1 text-slate-700 font-semibold">
                                        <PhoneOutlinedIcon sx={{ fontSize: 13, color: "#0D9488" }} />
                                        <span>{patient.phone}</span>
                                    </span>
                                )}
                                {patient.email && (
                                    <span className="text-slate-400 truncate">{patient.email}</span>
                                )}
                                <span className="text-teal-800 font-extrabold">
                                    {visitsCount} {visitsCount === 1 ? "Visit" : "Visits"} Recorded
                                </span>
                            </div>

                            {/* Booking Channels Source Bar */}
                            {patientAllChannels.length > 0 && (
                                <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                        Booked via:
                                    </span>
                                    {patientAllChannels.map((ch) => (
                                        <span key={ch}>{channelBadgeRenderer(ch)}</span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action Shortcuts */}
                    <div className="flex items-center gap-2 shrink-0">
                        {patient.phone && (
                            <a
                                href={`https://wa.me/${patient.phone.replace(/[^0-9]/g, "")}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-all cursor-pointer shadow-2xs"
                                title="Open WhatsApp message with patient"
                            >
                                <WhatsAppIcon sx={{ fontSize: 15, color: "#10B981" }} />
                                <span className="hidden sm:inline">WhatsApp</span>
                            </a>
                        )}
                        <button
                            type="button"
                            onClick={onClearSelection}
                            className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                            title="Close dossier"
                        >
                            <CloseOutlinedIcon sx={{ fontSize: 15 }} />
                            <span className="ml-1 hidden sm:inline">Deselect</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
