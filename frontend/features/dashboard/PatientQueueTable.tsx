"use client";

import PatientQueueRow from "./PatientQueueRow";
import type { DashboardQueueAppointment } from "./types";

interface PatientQueueTableProps {
    appointments: DashboardQueueAppointment[];
    role: "ADMIN" | "STAFF";
    busyId: string | null;
    onStatusChange: (aptId: string, nextStatus: string) => void;
    onCheckout: (apt: DashboardQueueAppointment) => void;
    onReschedule: (apt: DashboardQueueAppointment) => void;
    onRequestCancel: (apt: DashboardQueueAppointment) => void;
}

export default function PatientQueueTable({
    appointments,
    role,
    busyId,
    onStatusChange,
    onCheckout,
    onReschedule,
    onRequestCancel,
}: PatientQueueTableProps) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/90 border-b border-slate-200/80 text-slate-500 font-semibold">
                    <tr>
                        <th className="px-3 py-2.5 whitespace-nowrap">Patient</th>
                        <th className="px-3 py-2.5 whitespace-nowrap">Phone</th>
                        <th className="px-3 py-2.5 whitespace-nowrap">Treatment</th>
                        <th className="px-3 py-2.5 whitespace-nowrap">Schedule</th>
                        <th className="px-3 py-2.5 whitespace-nowrap">Status</th>
                        <th className="px-3 py-2.5 text-right whitespace-nowrap">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                    {appointments.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="py-10 text-center text-slate-500">
                                No appointments match the selected date or status.
                            </td>
                        </tr>
                    ) : (
                        appointments.map((apt) => (
                            <PatientQueueRow
                                key={apt.id}
                                apt={apt}
                                role={role}
                                busyId={busyId}
                                onStatusChange={onStatusChange}
                                onCheckout={onCheckout}
                                onReschedule={onReschedule}
                                onRequestCancel={onRequestCancel}
                            />
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
