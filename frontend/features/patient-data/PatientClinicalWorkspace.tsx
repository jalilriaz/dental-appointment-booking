"use client";

import { useState } from "react";
import FolderOutlined from "@mui/icons-material/FolderOutlined";
import HistoryEduOutlined from "@mui/icons-material/HistoryEduOutlined";
import CompareOutlined from "@mui/icons-material/CompareOutlined";
import MedicationOutlined from "@mui/icons-material/MedicationOutlined";
import PatientFilesSection from "./PatientFilesSection";
import ConsentFormsSection from "./ConsentFormsSection";
import BeforeAfterSection from "./BeforeAfterSection";
import PrescriptionsSection from "./PrescriptionsSection";
import type {
    BeforeAfterRow,
    ClinicHeaderInfo,
    ConsentFormRow,
    PatientFileRow,
    PrescriptionRow,
} from "./types";

type SubTab = "files" | "consents" | "beforeAfter" | "prescriptions";

interface Props {
    patientId: string;
    patientName: string;
    patientCode: number | null;
    patientPhone: string | null;
    allergies: string[];
    isAdmin: boolean;
    clinicInfo: ClinicHeaderInfo;
    files: PatientFileRow[];
    consents: ConsentFormRow[];
    beforeAfterPhotos: BeforeAfterRow[];
    prescriptions: PrescriptionRow[];
}

export default function PatientClinicalWorkspace(props: Props) {
    const [tab, setTab] = useState<SubTab>(props.isAdmin ? "files" : "consents");

    const tabs: Array<{ id: SubTab; label: string; count: number; icon: React.ReactNode }> = [
        { id: "files", label: "Files & X-rays", count: props.files.length, icon: <FolderOutlined sx={{ fontSize: 15 }} /> },
        { id: "consents", label: "Consent forms", count: props.consents.length, icon: <HistoryEduOutlined sx={{ fontSize: 15 }} /> },
        { id: "beforeAfter", label: "Before / After", count: props.beforeAfterPhotos.length, icon: <CompareOutlined sx={{ fontSize: 15 }} /> },
        { id: "prescriptions", label: "Prescriptions", count: props.prescriptions.length, icon: <MedicationOutlined sx={{ fontSize: 15 }} /> },
    ];

    return (
        <section className="rounded-2xl border border-slate-200/80 bg-white shadow-sm p-4 sm:p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                    <h2 className="text-sm font-bold text-slate-900">Clinical records &amp; prescriptions</h2>
                    <p className="text-xs text-slate-500">Encrypted X-rays, signed consents, clinical photos, and printable Rx slips</p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                    {tabs.map((item) => (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => setTab(item.id)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                                tab === item.id
                                    ? "bg-teal-600 text-white shadow-xs"
                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                            <span className={`px-1.5 py-0.2 rounded text-[10px] ${tab === item.id ? "bg-teal-700 text-white" : "bg-white text-slate-600"}`}>
                                {item.count}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {tab === "files" && (
                <PatientFilesSection patientId={props.patientId} isAdmin={props.isAdmin} initialFiles={props.files} />
            )}
            {tab === "consents" && (
                <ConsentFormsSection patientId={props.patientId} patientName={props.patientName} initialConsents={props.consents} />
            )}
            {tab === "beforeAfter" && (
                <BeforeAfterSection patientId={props.patientId} isAdmin={props.isAdmin} initialPhotos={props.beforeAfterPhotos} />
            )}
            {tab === "prescriptions" && (
                <PrescriptionsSection
                    patientId={props.patientId}
                    patientName={props.patientName}
                    patientCode={props.patientCode}
                    patientPhone={props.patientPhone}
                    allergies={props.allergies}
                    isAdmin={props.isAdmin}
                    clinicInfo={props.clinicInfo}
                    initialPrescriptions={props.prescriptions}
                />
            )}
        </section>
    );
}
