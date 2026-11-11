import prisma from "@/lib/prisma";
import PatientsTable from "./PatientsTable";

export default async function AdminPatientsPage() {
    const patients = await prisma.user.findMany({
        where: { role: "PATIENT" },
        include: {
            appointments: {
                select: {
                    id: true,
                    status: true,
                    startTime: true,
                    treatment: { select: { name: true } },
                },
                orderBy: { startTime: "desc" },
                take: 1,
            },
            patientTreatments: {
                include: { treatment: true },
                orderBy: { startDate: "desc" },
            },
            _count: { select: { appointments: true } },
        },
        orderBy: { createdAt: "desc" },
    });

    // Serialize data for client component
    const serialized = patients.map((p) => {
        const activePlan = p.patientTreatments.find(
            (pt) => pt.clinicalStatus === "IN_PROGRESS" || pt.status === "ONGOING"
        );

        return {
            id: p.id,
            patientCode: p.patientCode,
            name: p.name,
            email: p.email,
            phone: p.phone,
            gender: p.gender,
            dateOfBirth: p.dateOfBirth?.toISOString() || null,
            medicalAlerts: p.medicalAlerts,
            address: p.address,
            createdAt: p.createdAt.toISOString(),
            appointmentCount: p._count.appointments,
            lastAppointment: p.appointments[0]
                ? {
                      startTime: p.appointments[0].startTime.toISOString(),
                      treatmentName: p.appointments[0].treatment?.name,
                      status: p.appointments[0].status,
                  }
                : null,
            activePlan: activePlan
                ? {
                      id: activePlan.id,
                      treatmentName: activePlan.treatment.name,
                      totalSessions: activePlan.totalSessions,
                      totalCost: activePlan.totalCost,
                      clinicalStatus: activePlan.clinicalStatus,
                      financialStatus: activePlan.financialStatus,
                  }
                : null,
        };
    });

    return <PatientsTable patients={serialized} />;
}
