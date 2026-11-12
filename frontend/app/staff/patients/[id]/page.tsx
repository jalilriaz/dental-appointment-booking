import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import PatientProfileView from "@/components/admin/patients/PatientProfileView";

export default async function StaffPatientProfilePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const patient = await prisma.user.findUnique({
        where: { id },
        include: {
            appointments: {
                include: {
                    treatment: { select: { id: true, name: true, price: true, durationMin: true } },
                    clinicalNotes: { orderBy: { createdAt: "desc" } },
                    payments: { orderBy: { date: "desc" } },
                },
                orderBy: { startTime: "desc" },
            },
            patientTreatments: {
                include: {
                    treatment: { select: { id: true, name: true, description: true, price: true, durationMin: true } },
                    payments: { orderBy: { date: "desc" } },
                    appointments: {
                        include: {
                            treatment: { select: { name: true } },
                        },
                        orderBy: { startTime: "asc" },
                    },
                },
                orderBy: { startDate: "desc" },
            },
        },
    });

    if (!patient) return notFound();

    const treatments = await prisma.treatment.findMany({
        where: { isActive: true },
        select: { id: true, name: true, price: true, durationMin: true },
        orderBy: { name: "asc" },
    });

    return (
        <PatientProfileView
            patient={patient}
            availableTreatments={treatments}
            baseRoute="/staff"
        />
    );
}
