import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/auth";
import { redirect } from "next/navigation";
import WalkInRegistration from "@/components/admin/WalkInRegistration";

export default async function WalkInPage() {
    const cookie = (await cookies()).get("session")?.value;
    if (!cookie) redirect("/login");

    try {
        const session = await decrypt(cookie);
        if (session.role !== "ADMIN" && session.role !== "STAFF") {
            redirect("/login");
        }
    } catch {
        redirect("/login");
    }

    // Fetch active treatments and doctors from DB
    const [treatments, doctors] = await Promise.all([
        prisma.treatment.findMany({
            where: { isActive: true },
            orderBy: { name: "asc" },
            select: {
                id: true,
                name: true,
                price: true,
                durationMin: true,
            },
        }),
        prisma.doctor.findMany({
            where: { isActive: true },
            orderBy: [{ isLead: "desc" }, { name: "asc" }],
            select: {
                id: true,
                name: true,
                role: true,
                operatory: true,
                isLead: true,
            },
        }),
    ]);

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 text-xs font-bold mb-2">
                        <span className="size-2 rounded-full bg-teal-600" />
                        <span>Front Desk Clinical Intake &amp; Triage</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                        Walk-In Patient Registration &amp; Triage
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                        Direct reception check-in, real-time procedural scheduling across all 4 operatories, and instant patient dossier lookup.
                    </p>
                </div>
            </div>

            <WalkInRegistration treatments={treatments} doctors={doctors} />
        </div>
    );
}
