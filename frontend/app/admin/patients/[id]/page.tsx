import React from "react";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import MedicalServicesOutlinedIcon from "@mui/icons-material/MedicalServicesOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import MedicationOutlinedIcon from "@mui/icons-material/MedicationOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import { cn, formatPKR, formatDate, formatTime } from "@/lib/utils";
import StatusBadge from "@/components/shared/StatusBadge";
import PatientBillingHistory from "@/components/admin/patients/PatientBillingHistory";
import MedicalAlertEditor from "@/components/admin/patients/MedicalAlertEditor";
import CreateTreatmentPlan from "@/components/admin/patients/CreateTreatmentPlan";
import SendPrecautionsButton from "@/components/admin/SendPrecautionsButton";



export default async function PatientProfilePage({ params }: { params: Promise<{ id: string }> }) {
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
                <Link href="/admin/patients" className="p-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-premium shadow-xs">
                    <ArrowBackOutlinedIcon className="size-5" />
                </Link>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Patient Profile</h1>
            </div>

            {/* ── Medical Alert Banner ── */}
            {patient.medicalAlerts && (
                <div className="relative overflow-hidden rounded-2xl border border-rose-200 bg-rose-50/80 p-4 shadow-xs">
                    <div className="relative flex items-start gap-3">
                        <div className="p-2 rounded-xl bg-rose-100 border border-rose-200 shrink-0 text-rose-700">
                            <SecurityOutlinedIcon className="size-5" />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs font-bold text-rose-700 uppercase tracking-wider mb-1">⚠ Medical Alert</p>
                            <p className="text-sm font-semibold text-rose-900">{patient.medicalAlerts}</p>
                        </div>
                        <MedicalAlertEditor patientId={patient.id} initialAlerts={patient.medicalAlerts} />
                    </div>
                </div>
            )}

            {/* Header Card */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 md:p-8">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                    <div className="size-24 rounded-full bg-teal-50 flex items-center justify-center text-teal-700 font-bold text-3xl shrink-0 border border-teal-200">
                        {(patient.name || "P").charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 space-y-4 w-full">
                        <div className="flex items-center gap-3 flex-wrap">
                            <h2 className="text-2xl font-extrabold text-slate-900">{patient.name}</h2>
                            {!patient.medicalAlerts && (
                                <MedicalAlertEditor patientId={patient.id} initialAlerts={patient.medicalAlerts} />
                            )}
                        </div>
                        <p className="text-slate-600 text-sm font-medium -mt-2">Patient since {formatDate(patient.createdAt, "month-year")}</p>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-sky-50 text-sky-600 border border-sky-100 rounded-xl">
                                    <PhoneOutlinedIcon className="size-4" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Phone</p>
                                    <p className="text-sm font-bold text-slate-900">{patient.phone || "—"}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-slate-100 text-slate-600 border border-slate-200 rounded-xl">
                                    <EmailOutlinedIcon className="size-4" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Email</p>
                                    <p className="text-sm font-bold text-slate-900 truncate max-w-[150px]" title={patient.email || undefined}>{patient.email || "—"}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-amber-50 text-amber-600 border border-amber-100 rounded-xl">
                                    <CalendarTodayOutlinedIcon className="size-4" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Last Visit</p>
                                    <p className="text-sm font-bold text-slate-900">
                                        {lastVisit ? formatDate(lastVisit.startTime) : "Never"}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-teal-50 text-teal-600 border border-teal-100 rounded-xl">
                                    <CalendarTodayOutlinedIcon className="size-4" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Upcoming</p>
                                    <p className="text-sm font-bold text-slate-900">
                                        {upcomingAppointment ? formatDate(upcomingAppointment.startTime, "short") : "None"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Billing Section Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Treatment Plans & Billing</h3>
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
                    <h3 className="text-base font-bold text-slate-900">Treatment History</h3>
                    <p className="text-xs text-slate-500 font-medium">Appointments with doctor&apos;s clinical notes</p>
                </div>
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50/90 border-b border-slate-200/90 text-slate-500 uppercase text-[11px] font-bold tracking-wider">
                        <tr>
                            <th className="px-6 py-3.5">Date & Time</th>
                            <th className="px-6 py-3.5">Treatment</th>
                            <th className="px-6 py-3.5">Status</th>
                            <th className="px-6 py-3.5 text-right">Amount</th>
                            <th className="px-6 py-3.5 text-right">Care Precautions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                        {patient.appointments.map((apt) => (
                            <React.Fragment key={apt.id}>
                                <tr className="hover:bg-slate-50/80 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-slate-900">{formatDate(apt.startTime)}</div>
                                        <div className="text-xs text-slate-500 font-medium">{formatTime(apt.startTime)}</div>
                                        {apt.checkoutTime && (
                                            <div className="text-[10px] text-emerald-700 font-semibold mt-1 flex items-center gap-1">
                                                <span className="inline-block size-1.5 rounded-full bg-emerald-600"></span>
                                                Checked out: {formatDate(apt.checkoutTime)} at {formatTime(apt.checkoutTime)}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-slate-700 font-medium">{apt.treatment.name}</td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={apt.status} />
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {(() => {
                                            // Find related patient treatment to get accurate total payments including installments
                                            const relatedTreatment = apt.patientTreatmentId
                                                ? patient.patientTreatments.find(pt => pt.id === apt.patientTreatmentId)
                                                : null;

                                            // Calculate actual total paid
                                            const totalPaid = relatedTreatment
                                                ? relatedTreatment.payments.reduce((sum, p) => sum + p.amount, 0)
                                                : (apt.amountPaid || 0);

                                            return (
                                                <>
                                                    {/* Billed Price vs Net Price logic */}
                                                    {apt.price > 0 || apt.discount > 0 ? (
                                                        <div className="flex flex-col items-end gap-0.5">
                                                            {apt.discount > 0 ? (
                                                                <>
                                                                    <span className="text-slate-400 line-through text-xs font-medium" title="Billed Price">
                                                                        {formatPKR(apt.price + apt.discount)}
                                                                    </span>
                                                                    <span className="font-bold text-teal-700" title="Net Price">
                                                                        {formatPKR(apt.price)}
                                                                    </span>
                                                                </>
                                                            ) : (
                                                                <span className="font-bold text-teal-700" title="Billed Price">
                                                                    {formatPKR(apt.price)}
                                                                </span>
                                                            )}

                                                            {totalPaid > 0 ? (
                                                                <span className="text-[10px] text-emerald-700 font-semibold px-2 py-0.5 bg-emerald-50 rounded-full border border-emerald-200 mt-1">
                                                                    Paid: {formatPKR(totalPaid)}
                                                                </span>
                                                            ) : null}
                                                        </div>
                                                    ) : totalPaid > 0 ? /* Installment logic */ (
                                                        <div className="flex flex-col items-end gap-0.5">
                                                            <span className="text-slate-500 text-xs font-medium">Price: Rs. 0</span>
                                                            <span className="text-[10px] text-sky-700 font-semibold px-2 py-0.5 bg-sky-50 rounded-full border border-sky-200 mt-1">
                                                                Installment Paid: {formatPKR(totalPaid)}
                                                            </span>
                                                        </div>
                                                    ) : /* Fallback if no price and no payment yet */ (
                                                        <span className="font-bold text-teal-700">
                                                            {formatPKR(apt.treatment.price)}
                                                        </span>
                                                    )}
                                                </>
                                            );
                                        })()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <SendPrecautionsButton
                                            appointmentId={apt.id}
                                            patientName={patient.name}
                                            patientPhone={patient.phone}
                                            treatmentName={apt.treatment.name}
                                        />
                                    </td>
                                </tr>
                                {/* Clinical Notes Row */}
                                {apt.clinicalNotes.length > 0 && (
                                    <tr className="bg-teal-50/40 border-t border-teal-100/60">
                                        <td colSpan={5} className="px-6 py-3.5">
                                            {apt.clinicalNotes.map((note) => (
                                                <div key={note.id} className="grid sm:grid-cols-2 gap-3 text-xs">
                                                    {note.diagnosis && (
                                                        <div className="flex items-start gap-1.5">
                                                            <MedicalServicesOutlinedIcon className="size-3.5 text-sky-600 mt-0.5 shrink-0" />
                                                            <div>
                                                                <span className="font-bold text-slate-600">Diagnosis:</span>
                                                                <span className="text-slate-800 ml-1 font-medium">{note.diagnosis}</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                    <div className="flex items-start gap-1.5">
                                                        <AssignmentOutlinedIcon className="size-3.5 text-teal-600 mt-0.5 shrink-0" />
                                                        <div>
                                                                <span className="font-bold text-slate-600">Treatment:</span>
                                                                <span className="text-slate-800 ml-1 font-medium">{note.treatmentDone}</span>
                                                        </div>
                                                    </div>
                                                    {note.prescription && (
                                                        <div className="flex items-start gap-1.5">
                                                            <MedicationOutlinedIcon className="size-3.5 text-emerald-600 mt-0.5 shrink-0" />
                                                            <div>
                                                                <span className="font-bold text-slate-600">Rx:</span>
                                                                <span className="text-slate-800 ml-1 font-medium">{note.prescription}</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {note.remarks && (
                                                        <div className="flex items-start gap-1.5">
                                                            <ChatBubbleOutlineOutlinedIcon className="size-3.5 text-amber-600 mt-0.5 shrink-0" />
                                                            <div>
                                                                <span className="font-bold text-slate-600">Notes:</span>
                                                                <span className="text-slate-800 ml-1 font-medium">{note.remarks}</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
