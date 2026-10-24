import prisma from "@/lib/prisma"
import { Suspense } from "react"
import AppointmentsTable from "./AppointmentsTable"
import { AppointmentsSkeleton } from "@/components/LoadingSpinner"
import Link from "next/link"
import { CalendarPlus } from "lucide-react"

import { startOfDay, endOfDay } from "date-fns"

export default async function AdminAppointmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; filter?: string }>
}) {
  const { status, filter } = await searchParams
  const where: any = {}

  if (status) {
    where.status = status
    if (status === "SCHEDULED") {
      where.startTime = {
        gte: startOfDay(new Date()),
      }
    }
  }

  if (filter === "today") {
    const today = new Date()
    where.startTime = {
      gte: startOfDay(today),
      lte: endOfDay(today),
    }
  }

  const appointments = await prisma.appointment.findMany({
    where,
    include: {
      patient: { select: { id: true, name: true, email: true, phone: true } },
      treatment: {
        select: { id: true, name: true, price: true, durationMin: true },
      },
      clinicalNotes: { orderBy: { createdAt: "desc" } },
    },
    orderBy: { startTime: status === "SCHEDULED" ? "asc" : "desc" },
  })

  // Serialize dates for client component
  const serialized = appointments.map((a) => ({
    ...a,
    startTime: a.startTime.toISOString(),
    endTime: a.endTime.toISOString(),
    createdAt: a.createdAt.toISOString(),
    amountPaid: a.amountPaid ?? 0, // Convert null to 0
    clinicalNotes: a.clinicalNotes.map((n) => ({
      ...n,
      createdAt: n.createdAt.toISOString(),
      updatedAt: n.updatedAt.toISOString(),
    })),
  }))

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Appointments
          </h1>
          <p className="text-sm text-slate-400">
            Manage and track all appointments.
          </p>
        </div>
        <Link
          href="/admin/walk-in"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-white text-sm font-semibold hover:from-teal-400 hover:to-emerald-400 transition-all shadow-lg shadow-teal-500/20 cursor-pointer mt-3 sm:mt-0 self-start sm:self-auto"
        >
          <CalendarPlus className="size-4" />
          Book Appointment
        </Link>
      </div>
      <Suspense fallback={<AppointmentsSkeleton />}>
        <AppointmentsTable appointments={serialized} />
      </Suspense>
    </div>
  )
}
