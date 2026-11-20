"use client";

import React from "react";
import MedicalServicesOutlinedIcon from "@mui/icons-material/MedicalServicesOutlined";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import DirectionsWalkOutlinedIcon from "@mui/icons-material/DirectionsWalkOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import StatusBadge from "@/components/shared/StatusBadge";
import { formatDate, formatTime } from "@/lib/utils";

interface PatientHistoryTimelineProps {
    appointments: {
        id: string;
        startTime: string;
        endTime: string;
        status: string;
        bookedBy?: string;
        price: number;
        notes: string | null;
        doctor?: {
            id: string;
            name: string;
            role?: string;
            operatory?: string;
        } | null;
        treatment: { name: string; price: number; durationMin: number };
    }[];
    historyChannelFilter: "ALL" | "WEBSITE" | "WHATSAPP_BOT" | "WALK_IN";
    setHistoryChannelFilter: (filter: "ALL" | "WEBSITE" | "WHATSAPP_BOT" | "WALK_IN") => void;
    channelBadgeRenderer: (channel?: string) => React.ReactNode;
}

export default function PatientHistoryTimeline({
    appointments,
    historyChannelFilter,
    setHistoryChannelFilter,
    channelBadgeRenderer,
}: PatientHistoryTimelineProps) {
    const filteredAppointments = appointments.filter((a) => {
        if (historyChannelFilter === "ALL") return true;
        return a.bookedBy === historyChannelFilter;
    });

    const botCount = appointments.filter((a) => a.bookedBy === "WHATSAPP_BOT").length;
    const webCount = appointments.filter((a) => a.bookedBy === "WEBSITE").length;
    const walkInCount = appointments.filter((a) => a.bookedBy === "WALK_IN").length;

    return (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h3 className="text-sm font-extrabold text-slate-900">Treatment &amp; Visit Log</h3>
                    <p className="text-[11px] text-slate-500 font-medium">All visits from Website, WhatsApp Chatbot, and Reception Walk-Ins</p>
                </div>

                {/* History Channel Filter */}
                <div className="flex items-center gap-1 bg-white border border-slate-200/90 p-1 rounded-xl shadow-2xs">
                    <button
                        type="button"
                        onClick={() => setHistoryChannelFilter("ALL")}
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer ${
                            historyChannelFilter === "ALL" ? "bg-teal-600 text-white" : "text-slate-600 hover:text-slate-900"
                        }`}
                    >
                        All ({appointments.length})
                    </button>
                    <button
                        type="button"
                        onClick={() => setHistoryChannelFilter("WHATSAPP_BOT")}
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer flex items-center gap-0.5 ${
                            historyChannelFilter === "WHATSAPP_BOT" ? "bg-emerald-600 text-white" : "text-emerald-700 hover:text-emerald-900"
                        }`}
                    >
                        <WhatsAppIcon sx={{ fontSize: 11 }} />
                        <span>Bot ({botCount})</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setHistoryChannelFilter("WEBSITE")}
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer flex items-center gap-0.5 ${
                            historyChannelFilter === "WEBSITE" ? "bg-teal-600 text-white" : "text-teal-700 hover:text-teal-900"
                        }`}
                    >
                        <LanguageOutlinedIcon sx={{ fontSize: 11 }} />
                        <span>Web ({webCount})</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setHistoryChannelFilter("WALK_IN")}
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer flex items-center gap-0.5 ${
                            historyChannelFilter === "WALK_IN" ? "bg-slate-700 text-white" : "text-slate-600 hover:text-slate-900"
                        }`}
                    >
                        <DirectionsWalkOutlinedIcon sx={{ fontSize: 11 }} />
                        <span>Desk ({walkInCount})</span>
                    </button>
                </div>
            </div>

            {filteredAppointments.length === 0 ? (
                <div className="p-10 text-center space-y-2">
                    <AssignmentOutlinedIcon sx={{ fontSize: 32 }} className="text-slate-300 mx-auto" />
                    <p className="text-xs font-bold text-slate-700">No Appointments Found</p>
                    <p className="text-[11px] text-slate-400">No visits recorded under this channel filter.</p>
                </div>
            ) : (
                <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
                    {filteredAppointments.map((apt) => (
                        <div key={apt.id} className="p-4 sm:p-5 space-y-2.5 hover:bg-slate-50/60 transition-colors">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5">
                                <div className="flex items-center gap-2.5">
                                    <div className="size-9 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center shrink-0">
                                        <MedicalServicesOutlinedIcon sx={{ fontSize: 16, color: "#0D9488" }} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <p className="text-xs sm:text-sm font-black text-slate-900">
                                                {apt.treatment.name}
                                            </p>
                                            {channelBadgeRenderer(apt.bookedBy)}
                                        </div>
                                        <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                                            {formatDate(apt.startTime, "short")} · {formatTime(apt.startTime)}
                                            {apt.doctor && (
                                                <span className="text-slate-600 font-bold ml-1.5">
                                                    · {apt.doctor.name} {apt.doctor.operatory ? `(${apt.doctor.operatory.split("·")[0].trim()})` : ""}
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2.5 self-end sm:self-auto">
                                    <span className="text-xs font-black text-slate-800">
                                        Rs. {apt.price.toLocaleString()}
                                    </span>
                                    <StatusBadge status={apt.status} />
                                </div>
                            </div>

                            {/* Booking notes / presenting complaints */}
                            {apt.notes && (
                                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-[11px] text-slate-600">
                                    <span className="font-extrabold text-slate-800">Booking Note:</span> {apt.notes}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
