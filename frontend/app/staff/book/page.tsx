import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/auth";
import { redirect } from "next/navigation";
import WalkInRegistration from "@/components/admin/WalkInRegistration";

export default async function StaffBookingPage() {
    const cookie = (await cookies()).get("session")?.value;
    if (!cookie) redirect("/login");

    try {
        const session = await decrypt(cookie);
        if (session.role !== "STAFF" && session.role !== "ADMIN") {
            redirect("/login");
        }
    } catch {
        redirect("/login");
    }

    // Fetch active treatments from DB (same as admin walk-in)
    const treatments = await prisma.treatment.findMany({
        where: { isActive: true },
        orderBy: { name: "asc" },
    });

    const formattedTreatments = treatments.map((t) => ({
        id: t.id,
        name: t.name,
        price: t.price,
        durationMin: t.durationMin,
    }));

    return (
        <div className="max-w-4xl mx-auto py-6 px-2 sm:px-4 space-y-6">
            <div className="border-b border-slate-200/80 pb-5">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200 inline-block mb-2">
                    Reception Intake
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-[#0B1528] tracking-tight font-sans">
                    Walk-In & Appointment Booking
                </h1>
                <p className="text-slate-600 text-sm mt-1.5 font-medium">
                    Search registered patients by phone or name, or register new walk-in patients with instant slot scheduling.
                </p>
            </div>

            <WalkInRegistration treatments={formattedTreatments} />
        </div>
    );
}
