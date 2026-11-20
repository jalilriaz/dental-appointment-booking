"use client";

import AppointmentsTable from "@/components/appointments/AppointmentsTable";
import type { Appointment } from "@/lib/types";

export default function AdminAppointmentsTable({
    appointments,
    userRole = "ADMIN"
}: {
    appointments: Appointment[];
    userRole?: string;
}) {
    return <AppointmentsTable appointments={appointments} userRole={userRole} />;
}

export type { Appointment };
