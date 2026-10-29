import React from "react";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Phone, Mail, Calendar, ArrowLeft, Stethoscope, ClipboardList, Pill, MessageSquare, ShieldAlert } from "lucide-react";
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
                <Link href="/staff/patients" className="p-2 rounded-full hover:bg-white/[0.04] transition-premium">
                    <ArrowLeft className="size-5 text-slate-400" />
                </Link>
                <h1 className="text-2xl font-bold text-white">Patient Profile</h1>
            </div>

            {/* ── Medical Alert Banner ── */}
            {patient.medicalAlerts && (
                <div className="relative overflow-hidden rounded-xl border-2 border-red-500/40 bg-red-500/10 p-4 animate-pulse-slow">
                    <div className="absolute inset-0 bg-red-500/5 blur-xl" />
                    <div className="relative flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-red-500/20 shrink-0">
                            <ShieldAlert className="size-5 text-red-400" />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs font-bold text-red-400 uppercase tracking-wider mb-1">⚠ Medical Alert</p>
                            <p className="text-sm font-medium text-red-200">{patient.medicalAlerts}</p>
                        </div>
                        <MedicalAlertEditor patientId={patient.id} initialAlerts={patient.medicalAlerts} />
                    </div>
                </div>
            )}

            {/* Header Card */}
            <div className="glass-card rounded-xl p-6 md:p-8">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                    <div className="size-24 rounded-full bg-teal-500/15 flex items-center justify-center text-teal-400 font-bold text-3xl shrink-0 border-4 border-teal-500/20">
                        {(patient.name || "P").charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 space-y-4 w-full">
                        <div className="flex items-center gap-3 flex-wrap">
                            <h2 className="text-2xl font-bold text-white">{patient.name}</h2>
                            {!patient.medicalAlerts && (
                                <MedicalAlertEditor patientId={patient.id} initialAlerts={patient.medicalAlerts} />
                            )}
                        </div>
                        <p className="text-slate-400 text-sm -mt-2">Patient since {formatDate(patient.createdAt, "month-year")}</p>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-white/[0.06]">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-500/15 text-blue-400 rounded-lg">
                                    <Phone className="size-4" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 font-medium uppercase">Phone</p>
                                    <p className="text-sm font-semibold text-white">{patient.phone || "—"}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-500/15 text-purple-400 rounded-lg">
                                    <Mail className="size-4" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 font-medium uppercase">Email</p>
                                    <p className="text-sm font-semibold text-white truncate max-w-[150px]" title={patient.email || undefined}>{patient.email || "—"}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-amber-500/15 text-amber-400 rounded-lg">
                                    <Calendar className="size-4" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 font-medium uppercase">Last Visit</p>
                                    <p className="text-sm font-semibold text-white">
                                        {lastVisit ? formatDate(lastVisit.startTime) : "Never"}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-teal-500/15 text-teal-400 rounded-lg">
                                    <Calendar className="size-4" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 font-medium uppercase">Upcoming</p>
                                    <p className="text-sm font-semibold text-white">
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
                <h3 className="text-xl font-bold text-white">Treatment Plans & Billing</h3>
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
            <div className="glass-card rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-white/[0.06]">
                    <h3 className="text-lg font-semibold text-white">Treatment History</h3>
                    <p className="text-xs text-slate-400">Appointments with doctor&apos;s clinical notes</p>
                </div>
                <table className="w-full text-sm text-left">
                    <thead className="bg-white/[0.03] border-b border-white/[0.06] text-slate-400 uppercase text-xs font-semibold">
                        <tr>
                            <th className="px-6 py-3">Date & Time</th>
                            <th className="px-6 py-3">Treatment</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3 text-right">Amount</th>
                            <th className="px-6 py-3 text-right">Care Precautions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04]">
                        {patient.appointments.map((apt) => (
                            <React.Fragment key={apt.id}>
                                <tr className="hover:bg-white/[0.03] transition-premium">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-white">{formatDate(apt.startTime)}</div>
                                        <div className="text-xs text-slate-400">{formatTime(apt.startTime)}</div>
                                        {apt.checkoutTime && (
                                            <div className="text-[10px] text-emerald-400/80 mt-1 flex items-center gap-1">
                                                <span className="inline-block size-1.5 rounded-full bg-emerald-400/60"></span>
                                                Checked out: {formatDate(apt.checkoutTime)} at {formatTime(apt.checkoutTime)}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-slate-300">{apt.treatment.name}</td>
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
                                                                    <span className="text-slate-500 line-through text-xs" title="Billed Price">
                                                                        {formatPKR(apt.price + apt.discount)}
                                                                    </span>
                                                                    <span className="font-semibold text-teal-400" title="Net Price">
                                                                        {formatPKR(apt.price)}
                                                                    </span>
                                                                </>
                                                            ) : (
                                                                <span className="font-semibold text-teal-400" title="Billed Price">
                                                                    {formatPKR(apt.price)}
                                                                </span>
                                                            )}

                                                            {totalPaid > 0 ? (
                                                                <span className="text-[10px] text-emerald-400 font-medium px-1.5 py-0.5 bg-emerald-500/10 rounded border border-emerald-500/20 mt-1">
                                                                    Paid: {formatPKR(totalPaid)}
                                                                </span>
                                                            ) : null}
                                                        </div>
                                                    ) : totalPaid > 0 ? /* Installment logic */ (
                                                        <div className="flex flex-col items-end gap-0.5">
                                                            <span className="text-slate-500 text-xs">Price: Rs. 0</span>
                                                            <span className="text-[10px] text-blue-400 font-medium px-1.5 py-0.5 bg-blue-500/10 rounded border border-blue-500/20 mt-1">
                                                                Installment Paid: {formatPKR(totalPaid)}
                                                            </span>
                                                        </div>
                                                    ) : /* Fallback if no price and no payment yet */ (
                                                        <span className="font-medium text-teal-400">
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
                                    <tr className="bg-teal-500/[0.03]">
                                        <td colSpan={5} className="px-6 py-3">
                                            {apt.clinicalNotes.map((note) => (
                                                <div key={note.id} className="grid sm:grid-cols-2 gap-3 text-xs">
                                                    {note.diagnosis && (
                                                        <div className="flex items-start gap-1.5">
                                                            <Stethoscope className="size-3.5 text-blue-400 mt-0.5 shrink-0" />
                                                            <div>
                                                                <span className="font-semibold text-slate-400">Diagnosis:</span>
                                                                <span className="text-slate-300 ml-1">{note.diagnosis}</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                    <div className="flex items-start gap-1.5">
                                                        <ClipboardList className="size-3.5 text-teal-400 mt-0.5 shrink-0" />
                                                        <div>
                                                            <span className="font-semibold text-slate-400">Treatment:</span>
                                                            <span className="text-slate-300 ml-1">{note.treatmentDone}</span>
                                                        </div>
                                                    </div>
                                                    {note.prescription && (
                                                        <div className="flex items-start gap-1.5">
                                                            <Pill className="size-3.5 text-purple-400 mt-0.5 shrink-0" />
                                                            <div>
                                                                <span className="font-semibold text-slate-400">Rx:</span>
                                                                <span className="text-slate-300 ml-1">{note.prescription}</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {note.remarks && (
                                                        <div className="flex items-start gap-1.5">
                                                            <MessageSquare className="size-3.5 text-amber-400 mt-0.5 shrink-0" />
                                                            <div>
                                                                <span className="font-semibold text-slate-400">Notes:</span>
                                                                <span className="text-slate-300 ml-1">{note.remarks}</span>
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
            </div >
        </div >
    );
}
