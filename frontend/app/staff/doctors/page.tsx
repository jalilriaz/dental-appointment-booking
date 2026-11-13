"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { fetchApi } from "@/lib/api-client";
import {
  MedicalServicesOutlined,
  CheckCircleOutlineOutlined,
  AccessTimeOutlined,
  PhoneOutlined,
  WhatsApp,
  LocationOnOutlined,
  CalendarMonthOutlined,
  ArrowForwardOutlined,
  PersonAddAlt1Outlined,
  ShieldOutlined,
  LocalHospitalOutlined,
  Circle,
  ChairOutlined,
  NotificationsActiveOutlined,
  RefreshOutlined,
  BadgeOutlined,
} from "@mui/icons-material";
import { Button } from "@/components/ui/button";

interface DoctorStaffProfile {
  id: string;
  name: string;
  role: string;
  credentials: string;
  experience: string;
  operatory: string;
  chairNumber: string;
  status: "ACTIVE" | "ON_BREAK" | "SCHEDULED_LATER" | "OFF_DUTY";
  todayShift: string;
  phone: string;
  patientsTodayCount: number;
  currentPatient?: string;
  currentProcedure?: string;
  image?: string;
  isLead?: boolean;
}

const CLINICAL_ROSTER: DoctorStaffProfile[] = [
  {
    id: "doc-sheriyaar",
    name: "Dr. Sheriyaar",
    role: "Lead Dental Surgeon & Implantologist",
    credentials: "BDS, RDS (PMDC Reg: 14820-D)",
    experience: "12+ Years Clinical Practice",
    operatory: "Surgical Operatory Suite A",
    chairNumber: "Chair 1 (Main Surgical)",
    status: "ACTIVE",
    todayShift: "12:00 PM – 8:00 PM",
    phone: "+92 314 5475528",
    patientsTodayCount: 5,
    image: "/images/dr_sheriyaar.jpg",
    isLead: true,
  },
];

export default function StaffDoctorsPage() {
  const [filter, setFilter] = useState<"ALL" | "ACTIVE" | "UPCOMING">("ALL");
  const [lastRefreshed, setLastRefreshed] = useState("Just now");
  const [doctorsList, setDoctorsList] = useState<DoctorStaffProfile[]>([CLINICAL_ROSTER[0]]);
  const [isLoading, setIsLoading] = useState(true);

  const loadDoctors = async () => {
    try {
      const res = await fetchApi("/api/doctors/admin/all");
      if (res.ok) {
        const data = await res.json();
        if (data.doctors && data.doctors.length > 0) {
          const mapped: DoctorStaffProfile[] = data.doctors.map((d: any) => ({
            id: d.id,
            name: d.name,
            role: d.role,
            credentials: `${d.qualifications} (PMDC: ${d.pmdcReg})`,
            experience: d.experience,
            operatory: d.operatory,
            chairNumber: d.operatory.split("·")[0]?.trim() || "Chair 1",
            status: d.isActive ? "ACTIVE" : "OFF_DUTY",
            todayShift: d.schedule,
            phone: "+92 314 5475528",
            patientsTodayCount: d._count?.appointments ?? (d.isLead ? 5 : 0),
            image: d.image || "/images/dr_sheriyaar.jpg",
            isLead: d.isLead,
          }));
          setDoctorsList(mapped);
          return;
        }
      }
      const pubRes = await fetchApi("/api/doctors");
      if (pubRes.ok) {
        const pubData = await pubRes.json();
        if (pubData.doctors && pubData.doctors.length > 0) {
          const mapped: DoctorStaffProfile[] = pubData.doctors.map((d: any) => ({
            id: d.id,
            name: d.name,
            role: d.role,
            credentials: `${d.qualifications} (PMDC: ${d.pmdcReg})`,
            experience: d.experience,
            operatory: d.operatory,
            chairNumber: d.operatory.split("·")[0]?.trim() || "Chair 1",
            status: d.isActive ? "ACTIVE" : "OFF_DUTY",
            todayShift: d.schedule,
            phone: "+92 314 5475528",
            patientsTodayCount: d._count?.appointments ?? (d.isLead ? 5 : 0),
            image: d.image || "/images/dr_sheriyaar.jpg",
            isLead: d.isLead,
          }));
          setDoctorsList(mapped);
          return;
        }
      }
      setDoctorsList([CLINICAL_ROSTER[0]]);
    } catch {
      setDoctorsList([CLINICAL_ROSTER[0]]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDoctors();
  }, []);

  const filteredDoctors = doctorsList.filter((doc) => {
    if (filter === "ACTIVE") return doc.status === "ACTIVE";
    if (filter === "UPCOMING") return doc.status === "SCHEDULED_LATER";
    return true;
  });

  const activeCount = doctorsList.filter((d) => d.status === "ACTIVE").length;
  const totalPatientsQueue = doctorsList.reduce((sum, d) => sum + d.patientsTodayCount, 0);

  const handleRefresh = () => {
    loadDoctors();
    const time = new Date().toLocaleTimeString("en-PK", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    setLastRefreshed(time);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* ─── Header Section (Light Theme) ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200/90 inline-flex items-center gap-1.5 shadow-2xs">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Operatory & Specialist Roster
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-xs font-semibold text-slate-500">
              Reception Desk Coordination
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0B1528] tracking-tight">
            Doctors on Duty & Chair Assignments
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-600 mt-0.5">
            Real-time shift statuses, active clinical chairs, and direct communication lines for reception coordination.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            variant="outline"
            onClick={handleRefresh}
            className="h-9 px-3.5 rounded-xl border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-2xs gap-1.5 cursor-pointer"
          >
            <RefreshOutlined sx={{ fontSize: 15 }} className="text-slate-500" />
            <span>Synced ({lastRefreshed})</span>
          </Button>
          <Button
            asChild
            className="h-9 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs gap-1.5 cursor-pointer"
          >
            <Link href="/staff/book">
              <PersonAddAlt1Outlined sx={{ fontSize: 16 }} />
              <span>Assign Walk-in</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* ─── Top 4 Metric KPI Cards (Light Theme) ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* 1. Specialists on Duty */}
        <div className="p-4 rounded-3xl border border-slate-200/90 bg-white shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Specialists On Duty
            </span>
            <div className="size-8 rounded-xl bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center">
              <MedicalServicesOutlined sx={{ fontSize: 16 }} />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-[#0B1528]">{activeCount}</span>
            <span className="text-xs font-bold text-emerald-700">/ {CLINICAL_ROSTER.length} scheduled</span>
          </div>
          <p className="text-[11px] font-medium text-slate-500 mt-1 flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            <span>Live on-site roster</span>
          </p>
        </div>

        {/* 2. Active Operatories */}
        <div className="p-4 rounded-3xl border border-slate-200/90 bg-white shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700">
              Active Operatories
            </span>
            <div className="size-8 rounded-xl bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center">
              <ChairOutlined sx={{ fontSize: 16 }} />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-teal-800">3 Chairs</span>
            <span className="text-xs font-semibold text-slate-500">Operational</span>
          </div>
          <p className="text-[11px] font-medium text-teal-700 mt-1 flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-teal-500" />
            <span>All suites sterilised</span>
          </p>
        </div>

        {/* 3. Patient Load Queue */}
        <div className="p-4 rounded-3xl border border-slate-200/90 bg-white shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Patient Load Queue
            </span>
            <div className="size-8 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center">
              <CalendarMonthOutlined sx={{ fontSize: 16 }} />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-[#0B1528]">{totalPatientsQueue}</span>
            <span className="text-xs font-semibold text-slate-500">visits today</span>
          </div>
          <p className="text-[11px] font-medium text-slate-500 mt-1 flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-slate-400" />
            <span>Across all operatories</span>
          </p>
        </div>

        {/* 4. Emergency Chair */}
        <div className="p-4 rounded-3xl border border-emerald-200/80 bg-emerald-50/50 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
              Emergency Chair
            </span>
            <div className="size-8 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center justify-center">
              <LocalHospitalOutlined sx={{ fontSize: 16 }} />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-emerald-800">Standby</span>
            <span className="text-xs font-bold text-emerald-700">Chair 1</span>
          </div>
          <p className="text-[11px] font-semibold text-emerald-700 mt-1 flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Main Surgical Suite A ready</span>
          </p>
        </div>
      </div>

      {/* ─── Filter Tabs & Public Link ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="inline-flex p-1 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
          <button
            type="button"
            onClick={() => setFilter("ALL")}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filter === "ALL"
                ? "bg-[#0B1528] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            All Specialists ({CLINICAL_ROSTER.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("ACTIVE")}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filter === "ACTIVE"
                ? "bg-[#0B1528] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Active In Operatory ({activeCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter("UPCOMING")}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filter === "UPCOMING"
                ? "bg-[#0B1528] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Later Shifts ({CLINICAL_ROSTER.length - activeCount})
          </button>
        </div>

        <Link
          href="/doctors"
          target="_blank"
          className="text-xs font-bold text-teal-800 hover:text-teal-900 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-teal-50 transition-colors border border-transparent hover:border-teal-200"
        >
          <span>View Public Doctors Showcase</span>
          <ArrowForwardOutlined sx={{ fontSize: 13 }} />
        </Link>
      </div>

      {/* ─── Doctors Grid (Pure Light Theme for ALL Cards) ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
        {filteredDoctors.map((doc) => {
          const isActive = doc.status === "ACTIVE";

          return (
            <div
              key={doc.id}
              className={`rounded-3xl border bg-white shadow-2xs hover:shadow-xs transition-all overflow-hidden p-6 sm:p-7 relative ${
                doc.isLead
                  ? "border-teal-300 ring-2 ring-teal-500/10"
                  : "border-slate-200/90 hover:border-slate-300"
              }`}
            >
              {/* Top Row: Doctor Info & Badges */}
              <div className="flex items-start gap-4">
                {doc.image ? (
                  <div className="relative size-16 sm:size-18 rounded-2xl overflow-hidden ring-2 ring-teal-500/30 shrink-0 bg-slate-100 shadow-2xs">
                    <Image
                      src={doc.image}
                      alt={doc.name}
                      fill
                      className="object-cover object-top"
                    />
                  </div>
                ) : (
                  <div className="size-16 sm:size-18 rounded-2xl bg-teal-50 border border-teal-200 text-teal-800 flex items-center justify-center font-black text-xl shrink-0 shadow-2xs">
                    {doc.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center flex-wrap gap-2">
                    <h2 className="text-lg sm:text-xl font-black text-[#0B1528] tracking-tight truncate">
                      {doc.name}
                    </h2>
                    {doc.isLead && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-teal-50 text-teal-800 border border-teal-200/90 tracking-wide uppercase">
                        Head Surgeon
                      </span>
                    )}
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        isActive
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200 inline-flex items-center gap-1"
                          : "bg-slate-100 text-slate-700 border-slate-200"
                      }`}
                    >
                      {isActive ? (
                        <>
                          <span className="size-1.5 rounded-full bg-emerald-500" />
                          <span>Active On-Site</span>
                        </>
                      ) : (
                        "Shift: 4:00 PM"
                      )}
                    </span>
                  </div>

                  <p className="text-xs font-bold text-teal-800 mt-0.5">
                    {doc.role}
                  </p>
                  <p className="text-[11px] font-medium text-slate-500 mt-0.5">
                    {doc.credentials} · {doc.experience}
                  </p>
                </div>
              </div>

              {/* Operatory & Shift Info Box (Light Theme) */}
              <div className="grid grid-cols-2 gap-3 mt-5 p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70 text-xs">
                <div>
                  <span className="text-[10px] font-bold block uppercase tracking-wider text-slate-400">
                    Clinical Operatory
                  </span>
                  <p className="font-black text-[#0B1528] mt-1 flex items-center gap-1.5">
                    <ChairOutlined sx={{ fontSize: 15 }} className="text-teal-600" />
                    <span>{doc.chairNumber}</span>
                  </p>
                  <p className="text-[11px] font-medium text-slate-500 truncate mt-0.5">
                    {doc.operatory}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] font-bold block uppercase tracking-wider text-slate-400">
                    Today&apos;s Shift Hours
                  </span>
                  <p className="font-black text-[#0B1528] mt-1 flex items-center gap-1.5">
                    <AccessTimeOutlined sx={{ fontSize: 15 }} className="text-teal-600" />
                    <span>{doc.todayShift}</span>
                  </p>
                  <p className="text-[11px] font-medium text-slate-500 mt-0.5">
                    {doc.patientsTodayCount} appointments booked
                  </p>
                </div>
              </div>

              {/* Current Active Chair Patient (If In Session) */}
              {doc.currentPatient && (
                <div className="mt-4 p-3.5 rounded-2xl bg-teal-50/70 border border-teal-200/90 flex items-center justify-between gap-3 text-xs">
                  <div className="min-w-0">
                    <span className="text-[10px] font-black uppercase tracking-wide text-teal-800 flex items-center gap-1.5">
                      <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      In Operatory Right Now
                    </span>
                    <p className="text-xs sm:text-sm font-black text-[#0B1528] mt-0.5 truncate">
                      {doc.currentPatient}
                    </p>
                    <p className="text-[11px] font-semibold text-teal-700 truncate">
                      {doc.currentProcedure}
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-white border border-teal-200 text-teal-800 shadow-2xs shrink-0">
                    Chair Busy
                  </span>
                </div>
              )}

              {/* Quick Reception Contact Bar */}
              <div className="flex items-center gap-2.5 mt-5 pt-4 border-t border-slate-100">
                <a
                  href={`https://wa.me/${doc.phone.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 h-9 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/90 text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                >
                  <WhatsApp sx={{ fontSize: 15 }} className="text-emerald-600" />
                  <span>WhatsApp Doctor</span>
                </a>

                <a
                  href={`tel:${doc.phone}`}
                  className="inline-flex items-center justify-center gap-1.5 h-9 px-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                >
                  <PhoneOutlined sx={{ fontSize: 14 }} className="text-slate-500" />
                  <span className="hidden sm:inline">Intercom: {doc.phone}</span>
                  <span className="sm:hidden">Call</span>
                </a>

                <Button
                  asChild
                  className="h-9 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                >
                  <Link href="/staff/book">
                    <span>Assign</span>
                  </Link>
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
