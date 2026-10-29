import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AppointmentsSkeleton } from "@/components/LoadingSpinner";
import AppointmentsTable from "@/app/admin/appointments/AppointmentsTable";
import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar } from "lucide-react";

import { startOfDay, endOfDay } from "date-fns";

export default async function StaffAppointmentsPage({ searchParams }: { searchParams: Promise<{ status?: string; filter?: string }> }) {
    const cookie = (await cookies()).get("session")?.value;
    if (!cookie) redirect("/login?callbackUrl=/staff/appointments");

    let session;
    try {
        session = await decrypt(cookie);
        if (session.role !== "STAFF" && session.role !== "ADMIN") {
            redirect("/login");
        }
    } catch {
        redirect("/login");
    }

    const { status, filter } = await searchParams;
    const where: any = {};

    if (status) {
        where.status = status;
        if (status === "SCHEDULED") {
            where.startTime = {
                gte: startOfDay(new Date()),
            };
        }
    }

    if (filter === "today") {
        const today = new Date();
        where.startTime = {
            gte: startOfDay(today),
            lte: endOfDay(today),
        };
    } else if (filter === "tomorrow") {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        where.startTime = {
            gte: startOfDay(tomorrow),
            lte: endOfDay(tomorrow),
        };
    }

    const appointments = await prisma.appointment.findMany({
        where,
        include: {
            patient: { select: { id: true, name: true, email: true, phone: true } },
            treatment: { select: { id: true, name: true, price: true, durationMin: true } },
            clinicalNotes: { orderBy: { createdAt: "desc" } },
        },
        orderBy: { startTime: status === "SCHEDULED" ? "asc" : "desc" },
    });

    // Serialize dates for client component
    const serialized = appointments.map((a) => ({
        ...a,
        startTime: a.startTime.toISOString(),
        endTime: a.endTime.toISOString(),
        createdAt: a.createdAt.toISOString(),
        amountPaid: a.amountPaid ?? undefined,
        discount: a.discount ?? undefined,
        bookedBy: a.bookedBy ?? undefined,
        clinicalNotes: a.clinicalNotes.map((n) => ({
            ...n,
            odontogramData: n.odontogramData ?? undefined,
            createdAt: n.createdAt.toISOString(),
            updatedAt: n.updatedAt.toISOString(),
        })),
    }));

    return (
        <div className="max-w-6xl mx-auto py-8 px-4 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <Link href="/staff" className="text-sm text-teal-400 hover:text-teal-300 flex items-center gap-1 mb-2 font-medium transition-premium">
                        <ArrowLeft className="size-4" /> Back to Dashboard
                    </Link>
                    <h1 className="text-2xl font-bold text-white">All Appointments</h1>
                    <p className="text-sm text-slate-400">Manage schedule and view patient details.</p>
                </div>
                <Link
                    href="/staff/book"
                    className="inline-flex items-center gap-2 px-5 py-2.5 btn-brand text-sm font-medium rounded-full transition-premium active:scale-95"
                >
                    <Calendar className="size-4" />
                    Book for Patient
                </Link>
            </div>

            <Suspense fallback={<AppointmentsSkeleton />}>
                <AppointmentsTable appointments={serialized} userRole={session.role as string} />
            </Suspense>
        </div>
    );
}
