"use client";

import PatientsTable from "@/components/patients/PatientsTable";
import type { PatientRow } from "@/components/patients/PatientsTable";

export default function AdminPatientsTable({ patients }: { patients: PatientRow[] }) {
    return <PatientsTable patients={patients} baseRoute="/admin" />;
}

export type { PatientRow };
