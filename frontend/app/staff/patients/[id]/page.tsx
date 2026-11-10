import React from "react";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowBackOutlined,
  PhoneOutlined,
  MailOutlineOutlined,
  CalendarMonthOutlined,
  ShieldOutlined,
  LocalHospitalOutlined,
  ReceiptLongOutlined,
  CheckCircleOutlineOutlined,
  AccessTimeOutlined,
} from "@mui/icons-material";
import { formatPKR, formatDate, formatTime } from "@/lib/utils";
import StatusBadge from "@/components/shared/StatusBadge";
import PatientBillingHistory from "@/components/admin/patients/PatientBillingHistory";
import MedicalAlertEditor from "@/components/admin/patients/MedicalAlertEditor";
import CreateTreatmentPlan from "@/components/admin/patients/CreateTreatmentPlan";
import SendPrecautionsButton from "@/components/admin/SendPrecautionsButton";

export default async function StaffPatientProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const patient = await prisma.user.findUnique({
        where: { id },
        include: {
            appointments: {
                include: {
                    treatment: { select: { name: true, price: true, durationMin: true } },
                    clinicalNotes: { orderBy: { createdAt: "desc" } },
                },
                orderBy: { startTime: "desc" },
            },
            patientTreatments: {
                include: {
                    treatment: { select: { name: true, description: true } },
                    payments: { orderBy: { date: "desc" } },
                },
                orderBy: { startDate: "desc" },
            },
            _count: { select: { appointments: true } },
        },
    });

    const treatments = await prisma.treatment.findMany({
        where: { isActive: true },
        select: { id: true, name: true, price: true, durationMin: true },
        orderBy: { name: "asc" }
    });

    if (!patient) return notFound();

    const lastVisit = patient.appointments[0];
    const upcomingAppointment = patient.appointments.find(a => new Date(a.startTime) > new Date());

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 mb-6">
                <Link
                    href="/staff/patients"
                    className="p-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs inline-flex items-center justify-center cursor-pointer"
                    aria-label="Back to patients directory"
                >
                    <ArrowBackOutlined sx={{ fontSize: 18 }} />
                </Link>
                <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                        Reception EHR
                    </span>
                    <h1 className="text-2xl font-black text-[#0B1528] tracking-tight font-sans mt-0.5">
                        Patient Health Record
                    </h1>
                </div>
            </div>

            {/* ── Medical Alert Banner ── */}
            {patient.medicalAlerts && (
                <div className="relative overflow-hidden rounded-2xl border border-rose-200 bg-rose-50/90 p-4 shadow-xs">
                    <div className="relative flex items-start gap-3">
                        <div className="p-2 rounded-xl bg-rose-100 border border-rose-200 shrink-0 text-rose-700">
                            <ShieldOutlined sx={{ fontSize: 20 }} />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs font-bold text-rose-700 uppercase tracking-wider mb-0.5">
                                Critical Medical Alert
                            </p>
                            <p className="text-sm font-semibold text-rose-950">
                                {patient.medicalAlerts}
                            </p>
                        </div>
                        <MedicalAlertEditor patientId={patient.id} initialAlerts={patient.medicalAlerts} />
                    </div>
                </div>
            )}

            {/* Header Card */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 md:p-8">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                    <div className="size-20 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-700 font-extrabold text-2xl shrink-0 border border-teal-200 shadow-2xs">
                        {(patient.name || "P").charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 space-y-4 w-full">
                        <div className="flex items-center gap-3 flex-wrap">
                            <h2 className="text-2xl font-black text-[#0B1528] tracking-tight font-sans">
                                {patient.name || "Anonymous Patient"}
                            </h2>
                            {!patient.medicalAlerts && (
                                <MedicalAlertEditor patientId={patient.id} initialAlerts={patient.medicalAlerts} />
                            )}
                        </div>
                        <p className="text-slate-500 text-xs font-medium -mt-2">
                            Registered with Elite Dental since {formatDate(patient.createdAt, "month-year")}
                        </p>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-4 border-t border-slate-100">
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                                <div className="p-2 bg-sky-50 text-sky-700 border border-sky-200 rounded-lg shrink-0">
                                    <PhoneOutlined sx={{ fontSize: 16 }} />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Phone</p>
                                    <p className="text-xs font-bold text-slate-900 truncate">{patient.phone || "—"}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                                <div className="p-2 bg-slate-100 text-slate-700 border border-slate-200 rounded-lg shrink-0">
                                    <MailOutlineOutlined sx={{ fontSize: 16 }} />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Email</p>
                                    <p className="text-xs font-bold text-slate-900 truncate" title={patient.email || undefined}>
                                        {patient.email || "—"}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                                <div className="p-2 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg shrink-0">
                                    <CalendarMonthOutlined sx={{ fontSize: 16 }} />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Last Visit</p>
                                    <p className="text-xs font-bold text-slate-900 truncate">
                                        {lastVisit ? formatDate(lastVisit.startTime) : "None yet"}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                                <div className="p-2 bg-teal-50 text-teal-700 border border-teal-200 rounded-lg shrink-0">
                                    <AccessTimeOutlined sx={{ fontSize: 16 }} />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Next Session</p>
                                    <p className="text-xs font-bold text-slate-900 truncate">
                                        {upcomingAppointment ? formatDate(upcomingAppointment.startTime, "short") : "None booked"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Billing Section Header */}
            <div className="flex items-center justify-between mb-2">
                <div>
                    <h3 className="text-lg font-black text-[#0B1528] tracking-tight font-sans">
                        Treatment Plans & Clinical Ledger
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">Multi-session dental packages and payment installments</p>
                </div>
                <CreateTreatmentPlan patientId={patient.id} availableTreatments={treatments} />
            </div>

            {/* Billing Section */}
            <PatientBillingHistory
                treatments={patient.patientTreatments.map(pt => ({
                    ...pt,
                    startDate: pt.startDate.toISOString(),
                    payments: pt.payments.map(p => ({
                        ...p,
                        date: p.date.toISOString(),
                    })),
                }))}
            />

            {/* Clinical History */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200/90 bg-slate-50/70">
                    <h3 className="text-sm font-extrabold text-[#0B1528] tracking-tight">Clinical Procedure History</h3>
                    <p className="text-xs text-slate-500 font-medium">All completed & scheduled visits with medical charting</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50/90 border-b border-slate-200/90 text-slate-500 uppercase text-[11px] font-bold tracking-wider">
                            <tr>
                                <th className="px-6 py-3.5">Date & Time</th>
                                <th className="px-6 py-3.5">Treatment Protocol</th>
                                <th className="px-6 py-3.5">Status</th>
                                <th className="px-6 py-3.5 text-right">Fee</th>
                                <th className="px-6 py-3.5 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                            {patient.appointments.map((apt) => (
                                <React.Fragment key={apt.id}>
                                    <tr className="hover:bg-slate-50/80 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-slate-900">{formatDate(apt.startTime)}</div>
                                            <div className="text-xs text-slate-500 font-medium">{formatTime(apt.startTime)}</div>
                                            {apt.checkoutTime && (
                                                <div className="text-[10px] text-teal-800 font-semibold mt-1 flex items-center gap-1">
                                                    <span className="inline-block size-1.5 rounded-full bg-teal-600"></span>
                                                    <span>Checked out: {formatDate(apt.checkoutTime)} at {formatTime(apt.checkoutTime)}</span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-slate-800 font-semibold">{apt.treatment.name}</td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={apt.status} />
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {apt.price > 0 || (apt.discount && apt.discount > 0) ? (
                                                <div className="flex flex-col items-end gap-0.5">
                                                    {apt.discount && apt.discount > 0 ? (
                                                        <>
                                                            <span className="text-slate-400 line-through text-xs font-medium">
                                                                {formatPKR(apt.price + apt.discount)}
                                                            </span>
                                                            <span className="font-bold text-teal-800">
                                                                {formatPKR(apt.price)}
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <span className="font-bold text-teal-800">
                                                            {formatPKR(apt.price)}
                                                        </span>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="font-bold text-slate-900">{formatPKR(apt.treatment.price)}</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <SendPrecautionsButton
                                                appointmentId={apt.id}
                                                patientPhone={patient.phone}
                                                patientName={patient.name || "Patient"}
                                                treatmentName={apt.treatment.name}
                                            />
                                        </td>
                                    </tr>

                                    {/* Clinical Charting Notes */}
                                    {apt.clinicalNotes && apt.clinicalNotes.length > 0 && (
                                        <tr className="bg-slate-50/40">
                                            <td colSpan={5} className="px-6 py-3 border-t border-slate-100">
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                                                        <LocalHospitalOutlined sx={{ fontSize: 14, color: "#0d9488" }} />
                                                        <span>Doctor&apos;s Clinical Charting</span>
                                                    </div>
                                                    <div className="grid md:grid-cols-2 gap-3 pl-4 border-l-2 border-teal-500">
                                                        {apt.clinicalNotes.map((note) => (
                                                            <div key={note.id} className="text-xs space-y-1 bg-white p-3 rounded-xl border border-slate-200/70 shadow-2xs">
                                                                <div className="font-bold text-slate-900">
                                                                    Treatment Rendered: <span className="font-semibold text-slate-700">{note.treatmentDone}</span>
                                                                </div>
                                                                {note.diagnosis && (
                                                                    <div className="text-slate-600">
                                                                        <span className="font-semibold text-slate-800">Diagnosis:</span> {note.diagnosis}
                                                                    </div>
                                                                )}
                                                                {note.prescription && (
                                                                    <div className="text-slate-600">
                                                                        <span className="font-semibold text-slate-800">Prescription:</span> {note.prescription}
                                                                    </div>
                                                                )}
                                                                {note.remarks && (
                                                                    <div className="text-slate-500 italic mt-1">
                                                                        Note: {note.remarks}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
