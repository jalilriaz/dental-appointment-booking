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

    // Fetch active treatments from DB
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
        <div className="max-w-3xl mx-auto py-8 px-4">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white">Walk-In Registration</h1>
                <p className="text-slate-400 mt-2">
                    Register walk-in patients and book their appointments instantly.
                </p>
            </div>

            <WalkInRegistration treatments={formattedTreatments} />
        </div>
    );
}
