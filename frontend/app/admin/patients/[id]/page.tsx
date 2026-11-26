import { requireRole } from "@/lib/auth/permissions";
import { notFound } from "next/navigation";
import PatientProfileView from "@/components/admin/patients/PatientProfileView";
import { loadPatientProfileBundle } from "@/lib/data/patientClinicalData";

export default async function AdminPatientProfilePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    await requireRole(["ADMIN"], { callbackUrl: `/admin/patients/${id}` });

    const bundle = await loadPatientProfileBundle(id, "ADMIN");
    if (!bundle) return notFound();

    return (
        <PatientProfileView
            patient={bundle.patient}
            availableTreatments={bundle.treatments}
            clinicalBundle={bundle.clinicalBundle}
            baseRoute="/admin"
        />
    );
}
