import { requireRole } from "@/lib/auth/permissions";
import { notFound } from "next/navigation";
import PatientProfileView from "@/components/admin/patients/PatientProfileView";
import { loadPatientProfileBundle } from "@/lib/data/patientClinicalData";

export default async function StaffPatientProfilePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    await requireRole(["ADMIN", "STAFF"], { callbackUrl: `/staff/patients/${id}` });

    const bundle = await loadPatientProfileBundle(id, "STAFF");
    if (!bundle) return notFound();

    return (
        <PatientProfileView
            patient={bundle.patient}
            availableTreatments={bundle.treatments}
            clinicalBundle={bundle.clinicalBundle}
            baseRoute="/staff"
        />
    );
}
