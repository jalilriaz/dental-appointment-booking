import prisma from "@/lib/prisma";
import TreatmentManager from "@/components/admin/TreatmentManager";

export default async function AdminServicesPage() {
    const treatments = await prisma.treatment.findMany({
        orderBy: { name: "asc" },
        include: { _count: { select: { appointments: true } } },
    });

    // Serialize for client component
    const serialized = treatments.map((t) => ({
        ...t,
    }));

    return <TreatmentManager initialTreatments={serialized} />;
}
