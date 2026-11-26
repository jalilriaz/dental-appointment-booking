import prisma from "@/lib/prisma";
import { requireRole } from "@/lib/auth/permissions";
import DeskBookingClient from "@/components/shared/DeskBookingClient";

export default async function AdminBookPage() {
    await requireRole(["ADMIN"], { callbackUrl: "/admin/book" });

    // Fetch all patients
    const patients = await prisma.user.findMany({
        where: { role: "PATIENT" },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
        },
        orderBy: { name: "asc" },
    });

    // Fetch treatments
    const treatments = await prisma.treatment.findMany({
        where: { isActive: true, deletedAt: null },
        orderBy: { name: "asc" },
    });

    const formattedTreatments = treatments.map((t) => ({
        id: t.id,
        name: t.name,
        price: t.price,
        durationMin: t.durationMin,
        description: t.description || "",
    }));

    return (
        <div className="max-w-3xl mx-auto py-8 px-4">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white">Book Appointment</h1>
                <p className="text-slate-400 mt-2">
                    Schedule an appointment for a patient.
                </p>
            </div>

            <DeskBookingClient
                patients={patients}
                treatments={formattedTreatments}
                backUrl="/admin"
            />
        </div>
    );
}
