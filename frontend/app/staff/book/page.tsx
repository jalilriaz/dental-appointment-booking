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
        <div className="w-full space-y-6 sm:space-y-8 font-sans">
            {/* Reception Intake Hero Banner */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-slate-200/80 pb-6">
                <div>
                    <div className="flex items-center gap-2.5 mb-1.5">
                        <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xs font-extrabold uppercase tracking-widest text-teal-800">
                            Reception Desk · Patient Intake & Scheduling
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-teal-50 text-teal-800 border border-teal-200/80 shadow-2xs">
                            Live Terminal
                        </span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0B1528] tracking-tight font-sans">
                        Walk-In & Appointment Booking
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                        Search registered patients by MRN, phone or name, review treatment plans, or register new walk-in arrivals instantly.
                    </p>
                </div>

                {/* Telemetry Chips */}
                <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                    <div className="px-3.5 py-2 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-center gap-2">
                        <span className="text-[11px] font-bold text-slate-400 uppercase">Catalog</span>
                        <span className="text-xs font-black text-slate-900">{formattedTreatments.length} Procedures</span>
                    </div>
                    <div className="px-3.5 py-2 rounded-2xl bg-teal-50/70 border border-teal-200/80 shadow-2xs flex items-center gap-2">
                        <span className="text-[11px] font-bold text-teal-700 uppercase">Chairs Active</span>
                        <span className="text-xs font-black text-teal-900">4 Operatories (12–8 PM)</span>
                    </div>
                </div>
            </div>

            <WalkInRegistration treatments={formattedTreatments} />
        </div>
    );
}
