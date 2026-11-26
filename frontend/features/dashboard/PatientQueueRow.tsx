"use client";

import MoreHorizOutlined from "@mui/icons-material/MoreHorizOutlined";
import PhoneOutlined from "@mui/icons-material/PhoneOutlined";
import Link from "next/link";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { StatusBadge } from "@/components/admin/shared";
import MedicalAlertBanner from "@/components/shared/MedicalAlertBanner";
import { formatKarachiDate, formatKarachiTime, formatPhoneDisplay } from "@/lib/format";
import type { DashboardQueueAppointment } from "./types";

interface PatientQueueRowProps {
    apt: DashboardQueueAppointment;
    role: "ADMIN" | "STAFF";
    busyId: string | null;
    onStatusChange: (aptId: string, nextStatus: string) => void;
    onCheckout: (apt: DashboardQueueAppointment) => void;
    onReschedule: (apt: DashboardQueueAppointment) => void;
    onRequestCancel: (apt: DashboardQueueAppointment) => void;
}

export default function PatientQueueRow({
    apt,
    role,
    busyId,
    onStatusChange,
    onCheckout,
    onReschedule,
    onRequestCancel,
}: PatientQueueRowProps) {
    const pName = apt.patient?.name || "Patient";
    const initial = pName.charAt(0).toUpperCase();
    const isBusy = busyId === apt.id;
    const baseHref = role === "ADMIN" ? "/admin" : "/staff";
    const isActionable = ["SCHEDULED", "RESCHEDULED", "ARRIVED", "IN_PROGRESS"].includes(apt.status);

    return (
        <tr className="hover:bg-slate-50/70 transition-colors">
            <td className="px-3 py-3">
                <div className="flex items-center gap-2.5">
                    <div className="size-8 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 font-bold flex items-center justify-center text-xs shrink-0">
                        {initial}
                    </div>
                    <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                            {apt.patient?.id ? (
                                <Link
                                    href={`${baseHref}/patients/${apt.patient.id}`}
                                    className="font-semibold text-slate-900 hover:text-teal-700 truncate"
                                >
                                    {pName}
                                </Link>
                            ) : (
                                <span className="font-semibold text-slate-900 truncate">{pName}</span>
                            )}
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600">
                                {apt.patient?.isFirstVisit ? "First visit" : "Returning"}
                            </span>
                            {apt.isEmergency && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                                    Emergency
                                </span>
                            )}
                            <MedicalAlertBanner variant="badge" alerts={apt.patient?.medicalAlerts} allergies={apt.patient?.allergies} medications={apt.patient?.medications} />
                        </div>
                    </div>
                </div>
            </td>
            <td className="px-3 py-3 text-slate-600 whitespace-nowrap">
                <span className="inline-flex items-center gap-1">
                    <PhoneOutlined sx={{ fontSize: 13 }} className="text-slate-400" />
                    {formatPhoneDisplay(apt.patient?.phone)}
                </span>
            </td>
            <td className="px-3 py-3 font-medium text-slate-800 whitespace-nowrap">
                {apt.treatment.name}
            </td>
            <td className="px-3 py-3 whitespace-nowrap">
                <div className="font-medium text-slate-800">{formatKarachiTime(apt.startTime)}</div>
                <div className="text-[11px] text-slate-500">{formatKarachiDate(apt.startTime, "short")}</div>
            </td>
            <td className="px-3 py-3 whitespace-nowrap">
                <StatusBadge status={apt.status} />
            </td>
            <td className="px-3 py-3 text-right whitespace-nowrap">
                <div className="inline-flex items-center gap-1.5">
                    {(apt.status === "SCHEDULED" || apt.status === "RESCHEDULED") && (
                        <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => onStatusChange(apt.id, "ARRIVED")}
                            className="px-2 py-1 rounded-lg text-xs font-semibold border border-teal-200 text-teal-700 hover:bg-teal-50 cursor-pointer disabled:opacity-50"
                        >
                            Mark arrived
                        </button>
                    )}
                    {apt.status === "ARRIVED" && (
                        <button
                            type="button"
                            disabled={isBusy}
                            onClick={() => onStatusChange(apt.id, "IN_PROGRESS")}
                            className="px-2 py-1 rounded-lg text-xs font-semibold border border-cyan-200 text-cyan-800 hover:bg-cyan-50 cursor-pointer disabled:opacity-50"
                        >
                            Start
                        </button>
                    )}
                    {isActionable && (
                        <>
                            <button type="button" disabled={isBusy} onClick={() => onCheckout(apt)} className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white cursor-pointer disabled:opacity-50">
                                Complete
                            </button>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button type="button" aria-label={`More actions for ${pName}`} disabled={isBusy} className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 cursor-pointer">
                                        <MoreHorizOutlined sx={{ fontSize: 16 }} />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="bg-white border-slate-200">
                                    <DropdownMenuItem onClick={() => onCheckout(apt)}>Check out &amp; collect payment</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => onReschedule(apt)}>Reschedule</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => onStatusChange(apt.id, "Not_Visited")}>Mark no-show</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => onRequestCancel(apt)} className="text-rose-600 focus:text-rose-600">Cancel appointment</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </>
                    )}
                </div>
            </td>
        </tr>
    );
}
