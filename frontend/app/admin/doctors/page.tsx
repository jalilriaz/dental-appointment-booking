import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MedicalServicesOutlined,
  CheckCircleOutlineOutlined,
  VerifiedOutlined,
  AccessTimeOutlined,
  PersonAddAlt1Outlined,
  ShieldOutlined,
  ChairOutlined,
  CalendarMonthOutlined,
  ArrowForwardOutlined,
  AttachMoneyOutlined,
  EditOutlined,
  MoreVertOutlined,
  PhoneOutlined,
  WhatsApp,
} from "@mui/icons-material";
import { Button } from "@/components/ui/button";

interface AdminDoctor {
  id: string;
  name: string;
  role: string;
  pmdcReg: string;
  qualifications: string;
  experience: string;
  specialty: string;
  operatory: string;
  schedule: string;
  patientsThisMonth: number;
  consultationFee: number;
  image?: string;
  isLead?: boolean;
  status: "ACTIVE" | "ON_LEAVE";
}

const ADMIN_DOCTORS: AdminDoctor[] = [
  {
    id: "doc-1",
    name: "Dr. Sheriyaar",
    role: "Chief Dental Surgeon & Head of Implantology",
    pmdcReg: "14820-D (Active)",
    qualifications: "BDS, RDS, FCPS (Oral & Maxillofacial Surgery)",
    experience: "12+ Years",
    specialty: "Implantology, Surgical Extractions, Cosmetic Dentistry",
    operatory: "Chair 1 · Surgical Suite A",
    schedule: "Mon – Sat: 12:00 PM – 8:00 PM",
    patientsThisMonth: 82,
    consultationFee: 2000,
    image: "/images/dr_sheriyaar.jpg",
    isLead: true,
    status: "ACTIVE",
  },
  {
    id: "doc-2",
    name: "Dr. Ayesha Malik",
    role: "Consultant Orthodontist & Dentofacial Orthopedics",
    pmdcReg: "19302-D (Active)",
    qualifications: "BDS, FCPS (Orthodontics)",
    experience: "9+ Years",
    specialty: "Clear Aligners, Ceramic Braces, Jaw Alignment",
    operatory: "Chair 2 · Orthodontics Bay",
    schedule: "Tue & Fri: 2:00 PM – 6:00 PM",
    patientsThisMonth: 38,
    consultationFee: 2000,
    status: "ACTIVE",
  },
  {
    id: "doc-3",
    name: "Dr. Hamza Tariq",
    role: "Consultant Endodontist & Microscopic RCT Specialist",
    pmdcReg: "22144-D (Active)",
    qualifications: "BDS, MDS (Endodontics & Operative Dentistry)",
    experience: "8+ Years",
    specialty: "Microscopic Rotary Endodontics, Molar Retreatments",
    operatory: "Chair 3 · Rotary Endo Room",
    schedule: "Wed & Sat: 4:00 PM – 8:00 PM",
    patientsThisMonth: 29,
    consultationFee: 2000,
    status: "ACTIVE",
  },
  {
    id: "doc-4",
    name: "Dr. Fatima Noor",
    role: "Specialist Periodontist & Aesthetic Laser Surgeon",
    pmdcReg: "26781-D (Active)",
    qualifications: "BDS, MSc (Periodontology & Laser Dentistry)",
    experience: "7+ Years",
    specialty: "Gingival Depigmentation, Deep Scaling, Gum Sculpting",
    operatory: "Chair 4 · Hygiene Bay",
    schedule: "Mon & Thu: 1:00 PM – 5:00 PM",
    patientsThisMonth: 44,
    consultationFee: 1500,
    status: "ACTIVE",
  },
];

export default function AdminDoctorsPage() {
  return (
    <div className="space-y-8">
      {/* ──────────────────────────────────────────────────────────────────
          1. HEADER & ACTIONS
          ────────────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 text-xs font-bold mb-2">
            <VerifiedOutlined sx={{ fontSize: 14, color: "#0d9488" }} />
            <span>PMDC-Verified Medical Faculty</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Doctors & Clinical Specialists
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Manage dental surgeon credentials, chair assignments, consultation schedules, and clinical workload.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            asChild
            variant="outline"
            className="border-slate-200 text-slate-700 font-bold rounded-2xl h-11 text-xs px-4 hover:bg-slate-50 cursor-pointer"
          >
            <Link href="/doctors" target="_blank">
              <span>View Public Page</span>
              <ArrowForwardOutlined sx={{ fontSize: 14, ml: 1 }} />
            </Link>
          </Button>
          <Button
            asChild
            className="bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-2xl h-11 px-5 shadow-xs transition-all active:scale-[0.98] cursor-pointer"
          >
            <Link href="/admin/appointments">
              <PersonAddAlt1Outlined sx={{ fontSize: 18, mr: 1 }} />
              <span>Book For Doctor</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────────────
          2. KPI SUMMARY METRICS
          ────────────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Active Doctors
            </span>
            <div className="size-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <MedicalServicesOutlined sx={{ fontSize: 18 }} />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">
            {ADMIN_DOCTORS.length} Specialists
          </p>
          <span className="text-[11px] font-semibold text-emerald-700 mt-0.5 block">
            100% PMDC Registered
          </span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Operatory Chairs
            </span>
            <div className="size-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <ChairOutlined sx={{ fontSize: 18 }} />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">4 Operatories</p>
          <span className="text-[11px] font-semibold text-slate-500 mt-0.5 block">
            Chairs 1–4 fully equipped
          </span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Monthly Consults
            </span>
            <div className="size-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircleOutlineOutlined sx={{ fontSize: 18 }} />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">
            {ADMIN_DOCTORS.reduce((sum, d) => sum + d.patientsThisMonth, 0)} visits
          </p>
          <span className="text-[11px] font-semibold text-emerald-700 mt-0.5 block">
            Across all 4 departments
          </span>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Standard Consult Fee
            </span>
            <div className="size-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <AttachMoneyOutlined sx={{ fontSize: 18 }} />
            </div>
          </div>
          <p className="text-2xl font-black text-teal-700 mt-2">Rs. 2,000</p>
          <span className="text-[11px] font-semibold text-slate-500 mt-0.5 block">
            Waived with treatment
          </span>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────────────
          3. DOCTORS ROSTER TABLE
          ────────────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="px-6 py-4 sm:px-8 sm:py-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
              Clinical Medical Staff Directory
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Verified clinical registrations, chair assignments, and operational shifts.
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-black bg-teal-50 text-teal-800 border border-teal-200">
            {ADMIN_DOCTORS.length} Registered
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {ADMIN_DOCTORS.map((doc) => (
            <div
              key={doc.id}
              className={`p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:bg-slate-50/70 transition-colors ${
                doc.isLead ? "bg-teal-50/20" : ""
              }`}
            >
              {/* Doctor Details */}
              <div className="flex items-start gap-4 sm:gap-5 min-w-0 max-w-xl">
                {doc.image ? (
                  <div className="relative size-16 sm:size-20 rounded-2xl overflow-hidden ring-2 ring-teal-500/20 shrink-0 bg-slate-100">
                    <Image
                      src={doc.image}
                      alt={doc.name}
                      fill
                      className="object-cover object-top"
                    />
                  </div>
                ) : (
                  <div className="size-16 sm:size-20 rounded-2xl bg-teal-50 border border-teal-200 text-teal-800 flex items-center justify-center font-black text-2xl shrink-0">
                    {doc.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                )}

                <div className="min-w-0">
                  <div className="flex items-center flex-wrap gap-2">
                    <h3 className="text-lg font-black text-slate-900 truncate">
                      {doc.name}
                    </h3>
                    {doc.isLead && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-teal-600 text-white uppercase tracking-wider">
                        Lead Surgeon
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      Active
                    </span>
                  </div>

                  <p className="text-xs font-bold text-teal-800 mt-1">
                    {doc.role}
                  </p>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    {doc.qualifications} · {doc.experience}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-lg border border-slate-200">
                      <ShieldOutlined sx={{ fontSize: 13, color: "#0d9488" }} />
                      <span>PMDC: {doc.pmdcReg}</span>
                    </span>
                    <span className="text-[11px] font-semibold text-teal-700">
                      {doc.specialty}
                    </span>
                  </div>
                </div>
              </div>

              {/* Operational Telemetry */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 lg:gap-6 border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-100 text-xs shrink-0">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">
                    Operatory Chair
                  </span>
                  <p className="font-extrabold text-slate-900 mt-0.5 flex items-center gap-1">
                    <ChairOutlined sx={{ fontSize: 14, color: "#0d9488" }} />
                    <span>{doc.operatory}</span>
                  </p>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">
                    Consultation Hours
                  </span>
                  <p className="font-bold text-slate-700 mt-0.5 flex items-center gap-1">
                    <AccessTimeOutlined sx={{ fontSize: 14, color: "#0d9488" }} />
                    <span>{doc.schedule}</span>
                  </p>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">
                    Monthly Visits
                  </span>
                  <p className="font-extrabold text-teal-700 mt-0.5">
                    {doc.patientsThisMonth} consultations
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

