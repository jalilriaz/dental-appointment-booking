import prisma from "@/lib/prisma";
import PatientsTable from "./PatientsTable";

export default async function AdminPatientsPage() {
    const patients = await prisma.user.findMany({
        where: { role: "PATIENT" },
        include: {
            appointments: {
                select: { id: true, status: true, startTime: true },
                orderBy: { startTime: "desc" },
                take: 1,
            },
            _count: { select: { appointments: true } },
        },
        orderBy: { createdAt: "desc" },
    });

    // Serialize dates for client component
    const serialized = patients.map((p) => ({
        id: p.id,
        name: p.name,
        email: p.email,
        phone: p.phone,
        createdAt: p.createdAt.toISOString(),
        appointmentCount: p._count.appointments,
        lastAppointment: p.appointments[0]
            ? { startTime: p.appointments[0].startTime.toISOString() }
            : null,
    }));

    return <PatientsTable patients={serialized} />;
}
