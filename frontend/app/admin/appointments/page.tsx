import prisma from "@/lib/prisma"
import { Suspense } from "react"
import AppointmentsTable from "./AppointmentsTable"
import { AppointmentsSkeleton } from "@/components/LoadingSpinner"
import Link from "next/link"
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined"

import { startOfDay, endOfDay } from "date-fns"
import { expirePastAppointments } from "@/lib/appointment-status"

export default async function AdminAppointmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; filter?: string }>
}) {
  // Auto catch-up: expire any past unattended appointments before rendering table
  await expirePastAppointments()

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

  const [appointments, doctors] = await Promise.all([
    prisma.appointment.findMany({
      where,
      include: {
        patient: { select: { id: true, name: true, email: true, phone: true } },
        treatment: {
          select: { id: true, name: true, price: true, durationMin: true },
        },
        doctor: {
          select: { id: true, name: true, role: true, operatory: true, isLead: true },
        },
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
    }),
    prisma.doctor.findMany({
      where: { isActive: true },
      orderBy: [{ isLead: "desc" }, { name: "asc" }],
      select: { id: true, name: true, role: true, operatory: true, isLead: true },
    }),
  ])

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
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Appointments
          </h1>
          <p className="text-sm text-slate-600 font-medium">
            Manage and track all appointments.
          </p>
        </div>
        <Link
          href="/admin/walk-in"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold transition-all shadow-xs cursor-pointer mt-3 sm:mt-0 self-start sm:self-auto"
        >
          <EventAvailableOutlinedIcon className="size-4" />
          Book Appointment
        </Link>
      </div>
      <Suspense fallback={<AppointmentsSkeleton />}>
        <AppointmentsTable appointments={serialized} doctors={doctors} />
      </Suspense>
    </div>
  )
}
