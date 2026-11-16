"use client";

import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { formatDate, formatTime } from "@/lib/utils";
import type { SuccessData } from "./types";

interface SuccessModalProps {
    success: SuccessData;
    onClose: () => void;
    onCopy: () => void;
    copied: boolean;
}

export default function SuccessModal({
    success,
    onClose,
    onCopy,
    copied,
}: SuccessModalProps) {
    const rawAppt = success.appointment || {};
    const patientName =
        success.patientName ||
        rawAppt.patient?.name ||
        rawAppt.guestName ||
        "Patient";

    const mrn =
        success.patientCode ||
        success.patientId ||
        rawAppt.patient?.patientCode ||
        rawAppt.patientCode ||
        null;

    const procedureName =
        rawAppt.treatment?.name ||
        rawAppt.serviceType ||
        "Consultation";

    const status = rawAppt.status || "SCHEDULED";

    // Format date & time reliably from startTime or date/time
    let formattedDate = "N/A";
    let formattedTime = "N/A";

    if (rawAppt.startTime) {
        try {
            formattedDate = formatDate(rawAppt.startTime, "long");
            formattedTime = formatTime(rawAppt.startTime);
        } catch {
            formattedDate = "Scheduled Date";
        }
    } else if (rawAppt.date) {
        try {
            formattedDate = formatDate(rawAppt.date, "long");
        } catch {
            formattedDate = rawAppt.date;
        }
        if (rawAppt.time) {
            try {
                const [h, m] = rawAppt.time.split(":");
                const dateObj = new Date();
                dateObj.setHours(parseInt(h, 10), parseInt(m, 10));
                formattedTime = dateObj.toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                });
            } catch {
                formattedTime = rawAppt.time;
            }
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs font-sans">
            <div className="relative w-full max-w-md animate-fade-in-up">
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute -top-3 -right-3 z-10 size-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 shadow-md transition-all cursor-pointer"
                    title="Close modal"
                >
                    <CloseOutlinedIcon sx={{ fontSize: 18 }} />
                </button>

                <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-2xl">
                    {/* Header Banner */}
                    <div className="p-6 text-center bg-teal-50/70 border-b border-teal-100">
                        <div className="mx-auto size-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center mb-3 shadow-md shadow-emerald-500/30">
                            <CheckCircleOutlineOutlinedIcon sx={{ fontSize: 28 }} />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 tracking-tight">
                            Appointment Confirmed!
                        </h3>
                        <p className="text-xs font-bold text-teal-800 mt-1">
                            {patientName}
                        </p>
                    </div>

                    {/* MRN Callout (High visibility for receptionist) */}
                    {mrn && (
                        <div className="p-6 pb-2 space-y-3">
                            <div className="bg-teal-50/70 border-2 border-dashed border-teal-300 rounded-2xl p-5 text-center">
                                <p className="text-[10px] uppercase tracking-widest text-teal-800 font-extrabold mb-1">
                                    Medical Record Number (MRN)
                                </p>
                                <div className="flex items-center justify-center gap-3">
                                    <span className="text-3xl font-black text-slate-900 tracking-widest font-mono">
                                        {mrn}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={onCopy}
                                        className="size-9 rounded-xl bg-white border border-teal-200/80 flex items-center justify-center text-teal-700 hover:bg-teal-50 transition-all shadow-2xs cursor-pointer active:scale-95"
                                        title="Copy MRN to clipboard"
                                    >
                                        {copied ? (
                                            <VerifiedOutlinedIcon sx={{ fontSize: 18, color: "#10B981" }} />
                                        ) : (
                                            <ContentCopyOutlinedIcon sx={{ fontSize: 18 }} />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/80 text-[11px] text-amber-900 flex items-center gap-2">
                                <ErrorOutlineOutlinedIcon sx={{ fontSize: 16, color: "#D97706" }} className="shrink-0" />
                                <span>
                                    Note: Write MRN <strong className="font-mono font-black">{mrn}</strong> on patient&apos;s physical card.
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Visit Summary Card */}
                    <div className="px-6 py-4">
                        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-2.5 text-xs">
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400 font-bold uppercase text-[10px]">Procedure</span>
                                <span className="text-slate-900 font-black">{procedureName}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400 font-bold uppercase text-[10px]">Date</span>
                                <span className="text-slate-800 font-bold">
                                    {formattedDate}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400 font-bold uppercase text-[10px]">Time Slot</span>
                                <span className="text-teal-800 font-black">
                                    {formattedTime}
                                </span>
                            </div>
                            <div className="flex justify-between items-center pt-2 border-t border-slate-200/60">
                                <span className="text-slate-400 font-bold uppercase text-[10px]">Status</span>
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-800 border border-emerald-200">
                                    {status}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 pt-1">
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs transition-all shadow-md shadow-teal-600/20 cursor-pointer"
                        >
                            Complete Intake &amp; Return to Desk
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
