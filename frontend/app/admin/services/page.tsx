import prisma from "@/lib/prisma";
import { requireRole } from "@/lib/auth/permissions";
import ServicesView from "@/features/services/ServicesView";

export default async function AdminServicesPage() {
    await requireRole(["ADMIN"], { callbackUrl: "/admin/services" });

    const treatments = await prisma.treatment.findMany({
        where: { deletedAt: null },
        orderBy: { name: "asc" },
        include: { _count: { select: { appointments: true, patientTreatments: true } } },
    });

    return <ServicesView initialServices={treatments} />;
}
