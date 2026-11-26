"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { fetchApi } from "@/lib/api-client";
import {
  MedicalServicesOutlined,
  AccessTimeOutlined,
  PhoneOutlined,
  WhatsApp,
  CalendarMonthOutlined,
  PersonAddAlt1Outlined,
  LocalHospitalOutlined,
  ChairOutlined,
  RefreshOutlined,
  BadgeOutlined,
  CheckCircleOutlineOutlined,
  MonetizationOnOutlined,
} from "@mui/icons-material";
import { Button } from "@/components/ui/button";
import StaffBookAppointmentModal from "@/components/staff/StaffBookAppointmentModal";

interface LeadDoctorProfile {
  id: string;
  name: string;
  role: string;
  credentials: string;
  experience: string;
  specialty: string;
  operatory: string;
  schedule: string;
  consultationFee: number;
  phone: string;
  patientsTodayCount: number;
  image: string;
  isActive: boolean;
}

const DEFAULT_DOCTOR: LeadDoctorProfile = {
  id: "",
  name: "Attending Dentist",
  role: "Dental Surgeon",
  credentials: "BDS",
  experience: "Clinical Practice",
  specialty: "General & Restorative Dentistry",
  operatory: "Main Operatory",
  schedule: "Mon – Sat: 12:00 PM – 8:00 PM",
  consultationFee: 2000,
  phone: "+92 314 5475528",
  patientsTodayCount: 0,
  image: "",
  isActive: true,
};

export default function StaffDoctorDutyPage() {
  const [doctor, setDoctor] = useState<LeadDoctorProfile>(DEFAULT_DOCTOR);
  const [lastRefreshed, setLastRefreshed] = useState("Just now");
  const [isLoading, setIsLoading] = useState(true);
  const [bookModalOpen, setBookModalOpen] = useState(false);

  const loadDoctorProfile = async () => {
    try {
      const [docRes, aptRes] = await Promise.all([
        fetchApi("/api/doctors"),
        fetchApi("/api/appointments?filter=today"),
      ]);

      let todayCount = 0;
      if (aptRes.ok) {
        const aptData = await aptRes.json();
        todayCount = Array.isArray(aptData.appointments) ? aptData.appointments.length : 0;
      }

      if (docRes.ok) {
        const data = await docRes.json();
        const lead = data.doctors?.find((d: any) => d.isLead) || data.doctors?.[0];
        if (lead) {
          setDoctor({
            id: lead.id,
            name: lead.name || DEFAULT_DOCTOR.name,
            role: lead.role || DEFAULT_DOCTOR.role,
            credentials: `${lead.qualifications || "BDS"}${lead.pmdcReg ? ` (PMDC: ${lead.pmdcReg})` : ""}`,
            experience: lead.experience || DEFAULT_DOCTOR.experience,
            specialty: lead.specialty || DEFAULT_DOCTOR.specialty,
            operatory: lead.operatory || DEFAULT_DOCTOR.operatory,
            schedule: lead.schedule || DEFAULT_DOCTOR.schedule,
            consultationFee: lead.consultationFee ?? DEFAULT_DOCTOR.consultationFee,
            phone: "+92 314 5475528",
            patientsTodayCount: todayCount || (lead._count?.appointments ?? 0),
            image: lead.image || DEFAULT_DOCTOR.image,
            isActive: lead.isActive ?? true,
          });
        }
      }
    } catch {
      // Retain fallback values gracefully
    } finally {
      setIsLoading(false);
      setLastRefreshed(
        new Date().toLocaleTimeString("en-PK", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    }
  };

  useEffect(() => {
    loadDoctorProfile();
  }, []);

  return (
    <div className="space-y-6 font-sans max-w-5xl">
      {/* ─── Header Section ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200/90 inline-flex items-center gap-1.5 shadow-2xs">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              Sole Practitioner Clinic Duty Desk
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-xs font-semibold text-slate-500">
              Reception Coordination
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0B1528] tracking-tight">
            Doctor on Duty &amp; Clinical Operatory
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-600 mt-0.5">
            Live duty hours, operatory suite allocation, and patient queue status for {doctor.name}.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            variant="outline"
            onClick={loadDoctorProfile}
            className="h-9 px-3.5 rounded-xl border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-2xs gap-1.5 cursor-pointer"
          >
            <RefreshOutlined sx={{ fontSize: 15 }} className="text-slate-500" />
            <span>Synced ({lastRefreshed})</span>
          </Button>
          <Button
            type="button"
            onClick={() => setBookModalOpen(true)}
            className="h-9 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs gap-1.5 cursor-pointer"
          >
            <PersonAddAlt1Outlined sx={{ fontSize: 16 }} />
            <span>Book Walk-In</span>
          </Button>
        </div>
      </div>

      {/* ─── Metric KPI Cards ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* 1. Practitioner Status */}
        <div className="p-4 rounded-3xl border border-slate-200/90 bg-white shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Clinical Status
            </span>
            <div className="size-8 rounded-xl bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center">
              <MedicalServicesOutlined sx={{ fontSize: 16 }} />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-[#0B1528]">
              {doctor.isActive ? "Active" : "Off Duty"}
            </span>
            <span className="text-xs font-bold text-emerald-700">On-Site</span>
          </div>
          <p className="text-[11px] font-medium text-slate-500 mt-1 flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            <span>Lead Surgeon on duty</span>
          </p>
        </div>

        {/* 2. Primary Operatory */}
        <div className="p-4 rounded-3xl border border-slate-200/90 bg-white shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700">
              Operatory Suite
            </span>
            <div className="size-8 rounded-xl bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center">
              <ChairOutlined sx={{ fontSize: 16 }} />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-xl font-black text-teal-800 truncate">
              {doctor.operatory.split("·")[0]?.trim() || "Main Operatory"}
            </span>
          </div>
          <p className="text-[11px] font-medium text-teal-700 mt-1 flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-teal-500" />
            <span>Surgical Suite A sterilized</span>
          </p>
        </div>

        {/* 3. Today's Patient Queue */}
        <div className="p-4 rounded-3xl border border-slate-200/90 bg-white shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Today&apos;s Queue
            </span>
            <div className="size-8 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center">
              <CalendarMonthOutlined sx={{ fontSize: 16 }} />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-[#0B1528]">
              {doctor.patientsTodayCount}
            </span>
            <span className="text-xs font-semibold text-slate-500">appointments</span>
          </div>
          <p className="text-[11px] font-medium text-slate-500 mt-1 flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-slate-400" />
            <span>Sequential timeline queue</span>
          </p>
        </div>

        {/* 4. Consultation Fee */}
        <div className="p-4 rounded-3xl border border-emerald-200/80 bg-emerald-50/50 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
              Consultation Fee
            </span>
            <div className="size-8 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center justify-center">
              <MonetizationOnOutlined sx={{ fontSize: 16 }} />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-black text-emerald-900">
              Rs. {doctor.consultationFee.toLocaleString()}
            </span>
          </div>
          <p className="text-[11px] font-semibold text-emerald-700 mt-1 flex items-center gap-1.5">
            <CheckCircleOutlineOutlined sx={{ fontSize: 13 }} />
            <span>Waived with procedure</span>
          </p>
        </div>
      </div>

      {/* ─── Dedicated Lead Surgeon Status Card ─── */}
      <div className="rounded-3xl border border-teal-200/90 bg-white shadow-2xs overflow-hidden p-6 sm:p-8 relative">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Avatar with Live Indicator */}
          <div className="relative size-24 sm:size-28 rounded-3xl overflow-hidden ring-4 ring-teal-500/20 shrink-0 bg-slate-100 shadow-sm">
            <Image
              src={doctor.image}
              alt={doctor.name}
              fill
              className="object-cover object-top"
              unoptimized
            />
            <span className="absolute bottom-2 right-2 size-4 rounded-full bg-emerald-500 ring-2 ring-white" />
          </div>

          {/* Core Info */}
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-center flex-wrap gap-2.5">
              <h2 className="text-xl sm:text-2xl font-black text-[#0B1528] tracking-tight">
                {doctor.name}
              </h2>
              <span className="px-3 py-0.5 rounded-full text-[10px] font-black bg-teal-50 text-teal-800 border border-teal-300 tracking-wide uppercase">
                Sole Practitioner &amp; Head Surgeon
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 inline-flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                Active On-Site
              </span>
            </div>

            <p className="text-sm font-bold text-teal-800">
              {doctor.role}
            </p>
            <p className="text-xs font-semibold text-slate-500 flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1">
                <BadgeOutlined sx={{ fontSize: 14 }} className="text-teal-600" />
                <span>{doctor.credentials}</span>
              </span>
              <span>·</span>
              <span>{doctor.experience}</span>
            </p>
            <p className="text-xs font-medium text-slate-600">
              <strong className="text-slate-800 font-semibold">Specialty Focus:</strong> {doctor.specialty}
            </p>
          </div>
        </div>

        {/* Clinical Operatory & Consultation Schedule */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 p-5 rounded-2xl bg-slate-50/90 border border-slate-200/80 text-xs">
          <div>
            <span className="text-[10px] font-bold block uppercase tracking-wider text-slate-400">
              Assigned Operatory
            </span>
            <p className="font-black text-slate-900 mt-1 flex items-center gap-1.5 text-sm">
              <ChairOutlined sx={{ fontSize: 16 }} className="text-teal-600" />
              <span>{doctor.operatory}</span>
            </p>
            <p className="text-[11px] font-medium text-slate-500 mt-0.5">
              Equipped with sterile ultrasonic scaling, digital apex locator &amp; surgical implant motor.
            </p>
          </div>

          <div>
            <span className="text-[10px] font-bold block uppercase tracking-wider text-slate-400">
              Consultation &amp; Surgical Hours
            </span>
            <p className="font-black text-slate-900 mt-1 flex items-center gap-1.5 text-sm">
              <AccessTimeOutlined sx={{ fontSize: 16 }} className="text-teal-600" />
              <span>{doctor.schedule}</span>
            </p>
            <p className="text-[11px] font-medium text-slate-500 mt-0.5">
              Sunday closed for surgical sterilization &amp; autoclaving.
            </p>
          </div>
        </div>

        {/* Quick Reception Action Bar */}
        <div className="flex flex-wrap items-center gap-3 mt-6 pt-5 border-t border-slate-100">
          <a
            href={`https://wa.me/${doctor.phone.replace(/[^0-9]/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 h-10 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-colors cursor-pointer shadow-2xs"
          >
            <WhatsApp sx={{ fontSize: 16 }} className="text-emerald-600" />
            <span>Direct WhatsApp Line</span>
          </a>

          <a
            href={`tel:${doctor.phone}`}
            className="inline-flex items-center justify-center gap-1.5 h-10 px-4 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold transition-colors cursor-pointer shadow-2xs"
          >
            <PhoneOutlined sx={{ fontSize: 15 }} className="text-slate-500" />
            <span>Intercom Call ({doctor.phone})</span>
          </a>

          <Link
            href="/staff/appointments"
            className="inline-flex items-center justify-center gap-1.5 h-10 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
          >
            <CalendarMonthOutlined sx={{ fontSize: 15 }} className="text-slate-600" />
            <span>View Full Day Schedule</span>
          </Link>

          <Button
            type="button"
            onClick={() => setBookModalOpen(true)}
            className="h-10 px-5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer ml-auto gap-1.5"
          >
            <PersonAddAlt1Outlined sx={{ fontSize: 16 }} />
            <span>Book Walk-In for {doctor.name}</span>
          </Button>
        </div>
      </div>

      <StaffBookAppointmentModal
        open={bookModalOpen}
        onOpenChange={setBookModalOpen}
        onSuccess={loadDoctorProfile}
      />
    </div>
  );
}
