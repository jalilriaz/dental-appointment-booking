import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AppointmentsSkeleton } from "@/components/LoadingSpinner";
import AppointmentsTable from "@/app/admin/appointments/AppointmentsTable";
import { Suspense } from "react";
import Link from "next/link";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";

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
            patientTreatment: {
                select: {
                    id: true,
                    totalCost: true,
                    totalSessions: true,
                    clinicalStatus: true,
                    financialStatus: true,
                },
            },
            clinicalNotes: { orderBy: { createdAt: "desc" } },
        },
        orderBy: { startTime: "asc" },
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
        <div className="w-full space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <Link href="/staff" className="text-xs text-teal-700 hover:text-teal-800 flex items-center gap-1.5 mb-1.5 font-bold transition-premium">
                        <ArrowBackOutlinedIcon sx={{ fontSize: 14 }} /> Back to Dashboard
                    </Link>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">All Appointments</h1>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">Manage schedule, operatory allocations, and view patient details.</p>
                </div>
                <Link
                    href="/staff/book"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-bold rounded-2xl shadow-xs transition-premium active:scale-95"
                >
                    <CalendarTodayOutlinedIcon sx={{ fontSize: 16 }} />
                    <span>Book for Patient</span>
                </Link>
            </div>

            <Suspense fallback={<AppointmentsSkeleton />}>
                <AppointmentsTable appointments={serialized} userRole={session.role as string} />
            </Suspense>
        </div>
    );
}
