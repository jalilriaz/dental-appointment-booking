"use client";

import { useState } from "react";
import Link from "next/link";
import {
  PhoneOutlined,
  ChevronLeftOutlined,
  ChevronRightOutlined,
  CalendarMonthOutlined,
  PersonOutlineOutlined,
} from "@mui/icons-material";
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200 inline-block mb-2">
            Clinical Records
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0B1528] tracking-tight font-sans">
            Patient Directory
          </h1>
          <p className="text-sm font-medium text-slate-600 mt-1">
            {patients.length} registered patient records with complete visit histories.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50/90 border-b border-slate-200/90">
              <tr>
                <th className="text-left px-6 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="text-left px-6 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="text-left px-6 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Visits
                </th>
                <th className="text-left px-6 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Last Appointment
                </th>
                <th className="text-left px-6 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Registered
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500 text-sm">
                    <PersonOutlineOutlined sx={{ fontSize: 32, color: "#94a3b8" }} className="mb-2 block mx-auto" />
                    No registered patients found.
                  </td>
                </tr>
              ) : (
                paged.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors cursor-pointer group">
                    <td className="px-6 py-4">
                      <Link href={`/staff/patients/${p.id}`} className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-teal-50 text-teal-700 font-bold text-sm border border-teal-200 flex items-center justify-center shrink-0 group-hover:border-teal-400 group-hover:scale-105 transition-all">
                          {(p.name || "P").charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                            {p.name || "Anonymous Patient"}
                          </p>
                          <p className="text-xs text-slate-500 font-medium">
                            {p.email || "No email on record"}
                          </p>
                        </div>
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-slate-700">
                      {p.phone ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-800 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                          <PhoneOutlined sx={{ fontSize: 13, color: "#0d9488" }} />
                          <span>{p.phone}</span>
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400 font-mono">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200">
                        {p.appointmentCount} {p.appointmentCount === 1 ? "visit" : "visits"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 text-xs font-medium">
                      {p.lastAppointment ? (
                        <span className="inline-flex items-center gap-1 text-slate-700">
                          <CalendarMonthOutlined sx={{ fontSize: 13, color: "#64748b" }} />
                          <span>{formatDate(p.lastAppointment.startTime)}</span>
                        </span>
                      ) : (
                        <span className="text-slate-400">No visits recorded</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-xs font-medium">
                      {formatDate(p.createdAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-3.5 border-t border-slate-200 bg-slate-50/70 gap-3">
            <p className="text-xs font-semibold text-slate-500">
              Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, patients.length)} of {patients.length} patients
            </p>
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="size-8 p-0 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 cursor-pointer disabled:opacity-40"
                aria-label="Previous page"
              >
                <ChevronLeftOutlined sx={{ fontSize: 16 }} />
              </Button>
              {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => (
                <Button
                  key={i}
                  size="sm"
                  onClick={() => setPage(i + 1)}
                  className={`size-8 p-0 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    page === i + 1
                      ? "bg-[#0B1528] text-white shadow-xs"
                      : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {i + 1}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="size-8 p-0 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 cursor-pointer disabled:opacity-40"
                aria-label="Next page"
              >
                <ChevronRightOutlined sx={{ fontSize: 16 }} />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
