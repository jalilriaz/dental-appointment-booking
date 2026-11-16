"use client";

import AppointmentsTable from "@/components/appointments/AppointmentsTable";
import type { Appointment, DoctorOption } from "@/lib/types";

export default function AdminAppointmentsTable({
    appointments,
    doctors = [],
    userRole = "ADMIN"
}: {
    appointments: Appointment[];
    doctors?: DoctorOption[];
    userRole?: string;
}) {
    return <AppointmentsTable appointments={appointments} doctors={doctors} userRole={userRole} />;
}

export type { Appointment, DoctorOption };
