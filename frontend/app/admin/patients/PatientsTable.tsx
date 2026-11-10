"use client";

import { useState } from "react";
import Link from "next/link";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import ChevronLeftOutlinedIcon from "@mui/icons-material/ChevronLeftOutlined";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

interface PatientRow {
    id: string;
    name: string | null;
    email: string | null;
    phone: string | null;
    createdAt: string;
    appointmentCount: number;
    lastAppointment: { startTime: string } | null;
}

export default function PatientsTable({ patients }: { patients: PatientRow[] }) {
    const [page, setPage] = useState(1);
    const perPage = 8;

    const totalPages = Math.ceil(patients.length / perPage);
    const paged = patients.slice((page - 1) * perPage, page * perPage);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Patients</h1>
                    <p className="text-sm font-medium text-slate-600 mt-0.5">{patients.length} registered patients</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50/90 border-b border-slate-200/90">
                            <tr>
                                <th className="text-left px-6 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Patient</th>
                                <th className="text-left px-6 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Contact</th>
                                <th className="text-left px-6 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Appointments</th>
                                <th className="text-left px-6 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Last Visit</th>
                                <th className="text-left px-6 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Joined</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                            {paged.map((p) => (
                                <tr key={p.id} className="hover:bg-slate-50/80 transition-colors cursor-pointer">
                                    <td className="px-6 py-4">
                                        <Link href={`/admin/patients/${p.id}`} className="flex items-center gap-3 group">
                                            <div className="size-10 rounded-full bg-teal-50 text-teal-700 font-bold text-sm border border-teal-200 flex items-center justify-center shrink-0 group-hover:border-teal-400 transition-colors">
                                                {(p.name || "P").charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-900 group-hover:text-teal-700 transition-colors">{p.name}</p>
                                                <p className="text-xs text-slate-500 font-medium">{p.email}</p>
                                            </div>
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 font-medium">
                                        {p.phone && (
                                            <span className="flex items-center gap-1.5 text-xs">
                                                <PhoneOutlinedIcon className="size-3 text-teal-600" /> {p.phone}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200">
                                            {p.appointmentCount} total
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 text-xs font-medium">
                                        {p.lastAppointment
                                            ? formatDate(p.lastAppointment.startTime)
                                            : "No visits yet"}
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 text-xs font-medium">
                                        {formatDate(p.createdAt)}
                                    </td>
                                </tr>
                            ))}
                            {paged.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center">
                                        <div className="flex flex-col items-center justify-center space-y-2 text-slate-500">
                                            <PeopleAltOutlinedIcon sx={{ fontSize: 40 }} className="text-slate-300" />
                                            <p className="font-semibold text-slate-800 text-sm">No Patients Registered Yet</p>
                                            <p className="text-xs text-slate-500 max-w-sm">Patient records will automatically appear here once patients book an appointment or are registered at reception.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200/90 bg-slate-50/70">
                        <p className="text-sm font-medium text-slate-600">Showing {(page - 1) * perPage + 1}-{Math.min(page * perPage, patients.length)} of {patients.length}</p>
                        <div className="flex gap-1.5">
                            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)} className="border-slate-200 bg-white text-slate-700 hover:bg-slate-50 rounded-lg cursor-pointer">
                                <ChevronLeftOutlinedIcon className="size-4" />
                            </Button>
                            {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => (
                                <Button key={i} variant={page === i + 1 ? "default" : "outline"} size="sm" onClick={() => setPage(i + 1)} className={`cursor-pointer rounded-lg ${page === i + 1 ? "bg-teal-600 hover:bg-teal-700 text-white font-semibold shadow-xs border-0" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 font-medium"}`}>
                                    {i + 1}
                                </Button>
                            ))}
                            <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)} className="border-slate-200 bg-white text-slate-700 hover:bg-slate-50 rounded-lg cursor-pointer">
                                <ChevronRightOutlinedIcon className="size-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
