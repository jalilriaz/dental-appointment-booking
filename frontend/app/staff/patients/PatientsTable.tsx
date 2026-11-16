"use client";

import PatientsTable from "@/components/patients/PatientsTable";
import type { PatientRow } from "@/components/patients/PatientsTable";

export default function StaffPatientsTable({ patients }: { patients: PatientRow[] }) {
    return <PatientsTable patients={patients} baseRoute="/staff" />;
}

export type { PatientRow };
