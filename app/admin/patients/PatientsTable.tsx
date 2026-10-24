"use client";

import { useState } from "react";
import Link from "next/link";
import { Phone, ChevronLeft, ChevronRight } from "lucide-react";
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
                    <h1 className="text-2xl font-bold text-white">Patients</h1>
                    <p className="text-sm text-slate-400">{patients.length} registered patients</p>
                </div>
            </div>

            <div className="glass-card rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-white/[0.03] border-b border-white/[0.06]">
                            <tr>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase">Patient</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase">Contact</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase">Appointments</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase">Last Visit</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-400 uppercase">Joined</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.04]">
                            {paged.map((p) => (
                                <tr key={p.id} className="hover:bg-white/[0.03] transition-premium cursor-pointer">
                                    <td className="px-6 py-4">
                                        <Link href={`/admin/patients/${p.id}`} className="flex items-center gap-3 group">
                                            <div className="size-10 rounded-full bg-teal-500/15 flex items-center justify-center text-teal-400 font-bold text-sm border-2 border-teal-500/20 group-hover:border-teal-400/40 transition-premium">
                                                {(p.name || "P").charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-medium text-white group-hover:text-teal-400 transition-premium">{p.name}</p>
                                                <p className="text-xs text-slate-400">{p.email}</p>
                                            </div>
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4 text-slate-300">
                                        {p.phone && (
                                            <span className="flex items-center gap-1 text-xs">
                                                <Phone className="size-3" /> {p.phone}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-teal-500/15 text-teal-400">
                                            {p.appointmentCount} total
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-400 text-xs">
                                        {p.lastAppointment
                                            ? formatDate(p.lastAppointment.startTime)
                                            : "No visits yet"}
                                    </td>
                                    <td className="px-6 py-4 text-slate-400 text-xs">
                                        {formatDate(p.createdAt)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-4 py-3 border-t border-white/[0.06] bg-white/[0.02]">
                        <p className="text-sm text-slate-400">Showing {(page - 1) * perPage + 1}-{Math.min(page * perPage, patients.length)} of {patients.length}</p>
                        <div className="flex gap-1">
                            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)} className="cursor-pointer">
                                <ChevronLeft className="size-4" />
                            </Button>
                            {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => (
                                <Button key={i} variant={page === i + 1 ? "default" : "outline"} size="sm" onClick={() => setPage(i + 1)} className={`cursor-pointer ${page === i + 1 ? "btn-brand border-0" : "border-slate-700 text-slate-200 hover:bg-white/[0.04]"}`}>
                                    {i + 1}
                                </Button>
                            ))}
                            <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)} className="cursor-pointer">
                                <ChevronRight className="size-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
