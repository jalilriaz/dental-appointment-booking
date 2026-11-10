"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
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
    id: "doc-1",
    name: "Dr. Sheriyaar",
    role: "Lead Dental Surgeon & Implantologist",
    credentials: "BDS, RDS (PMDC Reg: 14820-D)",
    experience: "12+ Years Clinical Practice",
    operatory: "Surgical Operatory Suite A",
    chairNumber: "Chair 1 (Main Surgical)",
    status: "ACTIVE",
    todayShift: "12:00 PM – 8:00 PM",
    phone: "+92 300 555 8921",
    patientsTodayCount: 5,
    currentPatient: "Ahsan Khan",
    currentProcedure: "Wisdom Tooth Surgical Extraction",
    image: "/images/dr_sheriyaar.jpg",
    isLead: true,
  },
  {
    id: "doc-2",
    name: "Dr. Ayesha Malik",
    role: "Consultant Orthodontist",
    credentials: "BDS, FCPS (Orthodontics)",
    experience: "9+ Years Experience",
    operatory: "Orthodontics & Aligner Bay",
    chairNumber: "Chair 2 (Digital Scan Bay)",
    status: "ACTIVE",
    todayShift: "2:00 PM – 6:00 PM",
    phone: "+92 333 444 1920",
    patientsTodayCount: 4,
    currentPatient: "Zainab Bibi",
    currentProcedure: "Clear Aligner Tray Fitting & Check",
  },
  {
    id: "doc-3",
    name: "Dr. Hamza Tariq",
    role: "Consultant Endodontist",
    credentials: "BDS, MDS (Endodontics)",
    experience: "8+ Years Experience",
    operatory: "Microscopic Rotary Endo Room",
    chairNumber: "Chair 3 (Microscope Bay)",
    status: "SCHEDULED_LATER",
    todayShift: "4:00 PM – 8:00 PM",
    phone: "+92 321 888 4712",
    patientsTodayCount: 3,
  },
  {
    id: "doc-4",
    name: "Dr. Fatima Noor",
    role: "Specialist Periodontist & Laser Surgeon",
    credentials: "BDS, MSc (Periodontology)",
    experience: "7+ Years Experience",
    operatory: "Hygiene & Laser Therapy Suite",
    chairNumber: "Chair 4 (Laser Operatory)",
    status: "ACTIVE",
    todayShift: "12:00 PM – 4:00 PM",
    phone: "+92 345 777 9011",
    patientsTodayCount: 4,
    currentPatient: "Mehwish Hayat",
    currentProcedure: "Ultrasonic Scaling & Polishing",
  },
];

export default function StaffDoctorsPage() {
  const [filter, setFilter] = useState<"ALL" | "ACTIVE" | "UPCOMING">("ALL");
  const [lastRefreshed, setLastRefreshed] = useState("Just now");

  const filteredDoctors = CLINICAL_ROSTER.filter((doc) => {
    if (filter === "ACTIVE") return doc.status === "ACTIVE";
    if (filter === "UPCOMING") return doc.status === "SCHEDULED_LATER";
    return true;
  });

  const activeCount = CLINICAL_ROSTER.filter((d) => d.status === "ACTIVE").length;
  const totalPatientsQueue = CLINICAL_ROSTER.reduce((sum, d) => sum + d.patientsTodayCount, 0);

  const handleRefresh = () => {
    const time = new Date().toLocaleTimeString("en-PK", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    setLastRefreshed(time);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-teal-500/15 via-transparent to-transparent pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-bold mb-3">
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Live Operatory & Specialist Roster</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Doctors on Duty & Chair Assignments
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl font-medium">
              Real-time shift statuses, active clinical chairs, and direct communication lines for reception coordination.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              variant="outline"
              onClick={handleRefresh}
              className="bg-slate-800/80 hover:bg-slate-800 text-slate-200 border-slate-700 font-bold rounded-2xl h-11 text-xs gap-1.5 cursor-pointer"
            >
              <RefreshOutlined sx={{ fontSize: 16 }} />
              <span>Synced ({lastRefreshed})</span>
            </Button>
            <Button
              asChild
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-2xl h-11 px-5 shadow-xs cursor-pointer"
            >
              <Link href="/staff/book">
                <PersonAddAlt1Outlined sx={{ fontSize: 18, mr: 1 }} />
                <span>Assign Walk-in</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* 4 Quick Telemetry Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-slate-800">
          <div className="bg-slate-800/50 backdrop-blur-xs rounded-2xl p-3 border border-slate-700/60">
            <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">
              Specialists On Duty
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-white">{activeCount}</span>
              <span className="text-xs font-semibold text-emerald-400">/ {CLINICAL_ROSTER.length} scheduled</span>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-xs rounded-2xl p-3 border border-slate-700/60">
            <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">
              Active Operatories
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-teal-400">3 Chairs</span>
              <span className="text-xs font-semibold text-slate-400">Operational</span>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-xs rounded-2xl p-3 border border-slate-700/60">
            <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">
              Patient Load Queue
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-white">{totalPatientsQueue}</span>
              <span className="text-xs font-semibold text-slate-400">visits today</span>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-xs rounded-2xl p-3 border border-slate-700/60">
            <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">
              Emergency Chair
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-emerald-400">Standby</span>
              <span className="text-xs font-semibold text-slate-400">Chair 1</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-4">
        <div className="inline-flex p-1 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <button
            onClick={() => setFilter("ALL")}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filter === "ALL"
                ? "bg-teal-600 text-white shadow-2xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            All Specialists ({CLINICAL_ROSTER.length})
          </button>
          <button
            onClick={() => setFilter("ACTIVE")}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filter === "ACTIVE"
                ? "bg-teal-600 text-white shadow-2xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Active In Operatory ({activeCount})
          </button>
          <button
            onClick={() => setFilter("UPCOMING")}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filter === "UPCOMING"
                ? "bg-teal-600 text-white shadow-2xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Later Shifts ({CLINICAL_ROSTER.length - activeCount})
          </button>
        </div>

        <Link
          href="/doctors"
          target="_blank"
          className="text-xs font-bold text-teal-700 hover:text-teal-800 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-teal-50 transition-colors"
        >
          <span>View Public Doctors Showcase</span>
          <ArrowForwardOutlined sx={{ fontSize: 13 }} />
        </Link>
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredDoctors.map((doc) => {
          const isActive = doc.status === "ACTIVE";

          return (
            <div
              key={doc.id}
              className={`bg-white rounded-3xl border transition-all shadow-2xs overflow-hidden ${
                doc.isLead
                  ? "border-teal-300 ring-2 ring-teal-500/10"
                  : "border-slate-200/90 hover:border-slate-300"
              }`}
            >
              <div className="p-6 sm:p-7">
                {/* Top Row: Doctor Info & Badges */}
                <div className="flex items-start gap-4">
                  {doc.image ? (
                    <div className="relative size-16 sm:size-18 rounded-2xl overflow-hidden ring-2 ring-teal-500/20 shrink-0 bg-slate-100">
                      <Image
                        src={doc.image}
                        alt={doc.name}
                        fill
                        className="object-cover object-top"
                      />
                    </div>
                  ) : (
                    <div className="size-16 sm:size-18 rounded-2xl bg-teal-50 border border-teal-200 text-teal-800 flex items-center justify-center font-black text-xl shrink-0">
                      {doc.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center flex-wrap gap-2">
                      <h2 className="text-lg font-black text-slate-900 truncate">
                        {doc.name}
                      </h2>
                      {doc.isLead && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-teal-600 text-white tracking-wide uppercase">
                          Head Surgeon
                        </span>
                      )}
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
                          isActive
                            ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                            : "bg-slate-100 text-slate-700 border-slate-200"
                        }`}
                      >
                        {isActive ? "● Active On-Site" : "Shift: 4:00 PM"}
                      </span>
                    </div>

                    <p className="text-xs font-bold text-teal-800 mt-0.5">
                      {doc.role}
                    </p>
                    <p className="text-[11px] text-slate-400 font-medium">
                      {doc.credentials} · {doc.experience}
                    </p>
                  </div>
                </div>

                {/* Operatory & Shift Info Box */}
                <div className="grid grid-cols-2 gap-3 mt-5 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">
                      Clinical Operatory
                    </span>
                    <p className="font-extrabold text-slate-800 mt-0.5 flex items-center gap-1.5">
                      <ChairOutlined sx={{ fontSize: 14, color: "#0d9488" }} />
                      <span>{doc.chairNumber}</span>
                    </p>
                    <p className="text-[11px] text-slate-500 font-medium truncate">
                      {doc.operatory}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">
                      Today&apos;s Shift Hours
                    </span>
                    <p className="font-extrabold text-slate-800 mt-0.5 flex items-center gap-1.5">
                      <AccessTimeOutlined sx={{ fontSize: 14, color: "#0d9488" }} />
                      <span>{doc.todayShift}</span>
                    </p>
                    <p className="text-[11px] text-slate-500 font-medium">
                      {doc.patientsTodayCount} appointments booked
                    </p>
                  </div>
                </div>

                {/* Current Active Chair Patient (If In Session) */}
                {doc.currentPatient && (
                  <div className="mt-4 p-3 rounded-2xl bg-teal-50/70 border border-teal-200/80 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <span className="text-[10px] font-black text-teal-800 uppercase tracking-wide flex items-center gap-1">
                        <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        In Operatory Right Now
                      </span>
                      <p className="text-xs font-extrabold text-slate-900 mt-0.5 truncate">
                        {doc.currentPatient}
                      </p>
                      <p className="text-[11px] text-teal-700 font-semibold truncate">
                        {doc.currentProcedure}
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded-xl bg-white border border-teal-200 text-teal-800 text-[11px] font-extrabold shrink-0 shadow-2xs">
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
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-colors cursor-pointer"
                  >
                    <WhatsApp sx={{ fontSize: 15, color: "#10b981" }} />
                    <span>WhatsApp Doctor</span>
                  </a>

                  <a
                    href={`tel:${doc.phone}`}
                    className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                  >
                    <PhoneOutlined sx={{ fontSize: 14 }} />
                    <span className="hidden sm:inline">Intercom: {doc.phone}</span>
                    <span className="sm:hidden">Call</span>
                  </a>

                  <Button
                    asChild
                    variant="outline"
                    className="h-9 px-3 rounded-xl border-slate-200 text-xs font-bold text-teal-700 hover:bg-teal-50 cursor-pointer"
                  >
                    <Link href={`/staff/book`}>
                      <span>Assign</span>
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

