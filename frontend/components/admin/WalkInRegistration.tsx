"use client";

import { useState } from "react";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";

import RegisteredPatientWorkspace from "@/components/walk-in/RegisteredPatientWorkspace";
import NewPatientIntake from "@/components/walk-in/NewPatientIntake";
import SuccessModal from "@/components/walk-in/SuccessModal";
import type { TreatmentOption, DoctorOption, SuccessData } from "@/components/walk-in/types";

// ─── Main Orchestrator ──────────────────────────────────

export default function WalkInRegistration({
    treatments,
    doctors = [],
}: {
    treatments: TreatmentOption[];
    doctors?: DoctorOption[];
}) {
    const [activeTab, setActiveTab] = useState<"registered" | "new">("registered");
    const [success, setSuccess] = useState<SuccessData | null>(null);
    const [copied, setCopied] = useState(false);

    const copyMRN = () => {
        const mrn =
            success?.patientCode ||
            success?.patientId ||
            success?.appointment?.patient?.patientCode ||
            success?.appointment?.patientCode;
        if (mrn) {
            navigator.clipboard.writeText(String(mrn));
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="relative font-sans space-y-6">
            {/* Success Modal Confirmation */}
            {success && (
                <SuccessModal
                    success={success}
                    onClose={() => setSuccess(null)}
                    onCopy={copyMRN}
                    copied={copied}
                />
            )}

            {/* Segmented Mode Switcher (Tactile Clinical Pill Bar) */}
            <div className="bg-white p-1.5 rounded-2xl border border-slate-200/90 shadow-2xs inline-flex w-full sm:w-auto">
                <div className="grid grid-cols-2 gap-1.5 w-full sm:w-auto">
                    <button
                        type="button"
                        onClick={() => setActiveTab("registered")}
                        className={`flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${activeTab === "registered"
                            ? "bg-teal-600 text-white shadow-xs"
                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                            }`}
                    >
                        <SearchOutlinedIcon sx={{ fontSize: 18 }} />
                        <span>Registered Patient Lookup</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab("new")}
                        className={`flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer ${activeTab === "new"
                            ? "bg-teal-600 text-white shadow-xs"
                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                            }`}
                    >
                        <PersonAddOutlinedIcon sx={{ fontSize: 18 }} />
                        <span>+ Register New Walk-In</span>
                    </button>
                </div>
            </div>

            {/* Tab Workspace */}
            {activeTab === "registered" ? (
                <RegisteredPatientWorkspace
                    treatments={treatments}
                    doctors={doctors}
                    onSuccess={setSuccess}
                />
            ) : (
                <NewPatientIntake
                    treatments={treatments}
                    doctors={doctors}
                    onSuccess={setSuccess}
                />
            )}
        </div>
    );
}

export type { TreatmentOption, DoctorOption, SuccessData };
