"use client";

import PatientsTable from "@/app/staff/patients/PatientsTable";
import type { PatientRow } from "@/app/staff/patients/PatientsTable";

export default function AdminPatientsTable({ patients }: { patients: PatientRow[] }) {
    return <PatientsTable patients={patients} baseRoute="/admin" />;
}
