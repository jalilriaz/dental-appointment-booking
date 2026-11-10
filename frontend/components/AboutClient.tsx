"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  VerifiedOutlined,
  CheckCircleOutlined,
  HealthAndSafetyOutlined,
  MedicalServicesOutlined,
  SupportAgentOutlined,
  BiotechOutlined,
  SecurityOutlined,
  AutoAwesomeOutlined,
  CalendarMonthOutlined,
  Close,
  ChevronRightOutlined,
  WorkspacePremiumOutlined,
  PhoneInTalkOutlined,
  WhatsApp,
  LocationOnOutlined,
  CameraAltOutlined,
} from "@mui/icons-material";
import { clinicInfo } from "@/app/constants/mockData";
import BookingForm from "@/components/BookingForm";
import type { Treatment } from "@/lib/types";

interface AboutClientProps {
  treatments: Treatment[];
}

export default function AboutClient({ treatments }: AboutClientProps) {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [activeOperatory, setActiveOperatory] = useState<number>(0);

  const openBooking = () => {
    setIsBookingOpen(true);
  };

  const closeBooking = () => {
    setIsBookingOpen(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeBooking();
    };
    if (isBookingOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isBookingOpen]);

  // Clinical Operatory Facility Tour Bays
  const operatoryBays = [
    {
      title: "Sterile Implant Surgery Suite",
      tagline: "Positive Pressure Surgical Operatory",
      desc: "Equipped with surgical overhead operating scialytic lights, computerized physiologic implant engines, and hospital HEPA filtration systems to maintain zero airborne microbial contaminants during surgical implant placement.",
      image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1000&auto=format&fit=crop",
      features: [
        "Surgical HEPA Air Filtration System",
        "W&H Implantmed Computerized Drill Unit",
        "Continuous Vital Signs & Pulse Oximetry Monitoring",
        "Dedicated Surgical Assistant Protocol",
      ],
      certification: "Class-B Surgical Field Standards",
    },
    {
      title: "3D Digital Imaging & CBCT Bay",
      tagline: "Sub-Millimeter Volumetric Diagnostics",
      desc: "Houses our ultra-low-dose Cone Beam Computed Tomography scanner and high-resolution digital cephalometric sensors. Reconstructs cross-sectional 3D bone density, mandibular canal nerve paths, and root morphology in under 14 seconds.",
      image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=1000&auto=format&fit=crop",
      features: [
        "Ultra-Low Radiation Exposure Protocol",
        "3D Jawbone Density & Thickness Mapping",
        "Instant Chairside Digital DICOM Review",
        "Real-Time Virtual Implant Simulation",
      ],
      certification: "ISO Radiation Safety Certified",
    },
    {
      title: "Aesthetic & Laser Whitening Studio",
      tagline: "Ergonomic Patient Comfort Operatory",
      desc: "Designed for patient relaxation during cosmetic veneers and diode laser whitening. Features whisper-quiet electric handpieces, noise-canceling headphones, and ceiling media entertainment displays to eliminate anxiety.",
      image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=1000&auto=format&fit=crop",
      features: [
        "Biolase Diode Soft-Tissue Laser System",
        "Ultra-Plush Memory Foam Dental Chair",
        "Chairside High-Definition Intraoral Camera",
        "Noise-Canceling Acoustic Therapy",
      ],
      certification: "100% Painless Sedation Protocol",
    },
    {
      title: "Central Sterilization Department (CSSD)",
      tagline: "European Class-B 134°C Autoclaving",
      desc: "Our isolated decontamination facility utilizes automated 4-stage ultrasonic scrubbing, chemical indicator packaging, and high-vacuum fractional steam sterilization. Every batch is biologically logged and opened only in front of the patient.",
      image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=1000&auto=format&fit=crop",
      features: [
        "Melag Vacuklav Class-B Fractional Autoclave",
        "Daily Geobacillus Biological Spore Testing",
        "Individual Heat-Sealed Pouch Verification",
        "100% Single-Use Surgical Scalpels & Burrs",
      ],
      certification: "Daily Biological Spore Validated",
    },
  ];

  return (
    <>
      {/* 1. CLINICAL TRUST & MEDICAL ACCREDITATIONS BAR */}
      <section className="bg-white border-b border-slate-200/90 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-xs text-slate-700">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center shrink-0">
                <VerifiedOutlined sx={{ fontSize: 18 }} />
              </div>
              <div>
                <p className="font-extrabold text-slate-900">PMDC Registered</p>
                <p className="text-[11px] text-slate-500">BDS, RDS Licensed Specialist</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="size-9 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center shrink-0">
                <SecurityOutlined sx={{ fontSize: 18 }} />
              </div>
              <div>
                <p className="font-extrabold text-slate-900">Class-B Sterilization</p>
                <p className="text-[11px] text-slate-500">134°C Biological Spore Verified</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="size-9 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center shrink-0">
                <BiotechOutlined sx={{ fontSize: 18 }} />
              </div>
              <div>
                <p className="font-extrabold text-slate-900">3D CBCT Volumetric</p>
                <p className="text-[11px] text-slate-500">Sub-Millimeter Imaging Bay</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="size-9 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center shrink-0">
                <HealthAndSafetyOutlined sx={{ fontSize: 18 }} />
              </div>
              <div>
                <p className="font-extrabold text-slate-900">Pain-Free Dentistry</p>
                <p className="text-[11px] text-slate-500">Computerized Micro-Delivery</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CHIEF SURGEON DOSSIER: DR. SHERIYAAR (Single Lead Doctor) */}
      <section className="py-20 bg-slate-50 border-b border-slate-200/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Left: Doctor Visual Dossier Card */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl border border-slate-200/90 bg-white p-3 sm:p-4 shadow-xl relative overflow-hidden group">
                <div className="relative h-[420px] sm:h-[460px] w-full rounded-2xl overflow-hidden bg-slate-900">
                  <Image
                    src="/images/dr_sheriyaar.jpg"
                    alt="Dr. Sheriyaar - Lead Dental Surgeon & Founder"
                    fill
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/25 to-transparent pointer-events-none" />
                  
                  {/* Overlaid Medical Credentials Badge */}
                  <div className="absolute bottom-4 left-4 right-4 text-white p-3.5 rounded-2xl bg-slate-950/85 backdrop-blur-md border border-slate-700/80">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-teal-400 font-bold block">
                      PMDC Registered Lead Surgeon
                    </span>
                    <h3 className="text-xl font-black mt-0.5">Dr. Sheriyaar</h3>
                    <p className="text-xs text-slate-300 font-medium">BDS, RDS • Head of Clinical Practice</p>
                    <div className="mt-2.5 pt-2 border-t border-slate-700/80 flex items-center justify-between text-[11px]">
                      <span className="text-teal-300 font-bold">12+ Years Clinical Excellence</span>
                      <span className="font-mono text-slate-400">Islamabad, PK</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Surgical Qualifications & Clinical Philosophy */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full">
                  Lead Clinical Director
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-[#0B1528] mt-3 tracking-tight">
                  Personalized Care Under Dr. Sheriyaar
                </h2>
                <p className="text-slate-600 mt-4 leading-relaxed text-base">
                  At Elite Dental Centre, every patient is personally diagnosed and treated by Dr. Sheriyaar. With over 12 years of clinical excellence, his practice combines advanced titanium implant placement, microscope-guided root canals, and cosmetic aligners with a strict 100% pain-free philosophy.
                </p>
              </div>

              {/* 4 Pillars of Excellence */}
              <div className="grid sm:grid-cols-2 gap-4 pt-1">
                <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-xs">
                  <div className="flex items-center gap-2 text-teal-800 font-bold text-sm mb-1">
                    <CheckCircleOutlined sx={{ fontSize: 16, color: "#0d9488" }} />
                    <span>Certified Implantology</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Advanced bone regeneration, 3D computer-guided planning, and lifetime guaranteed titanium fixtures.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-xs">
                  <div className="flex items-center gap-2 text-teal-800 font-bold text-sm mb-1">
                    <CheckCircleOutlined sx={{ fontSize: 16, color: "#0d9488" }} />
                    <span>Painless Sedation Protocol</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Computerized micro-delivery anesthetic eliminates the pressure sting of traditional needles.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-xs">
                  <div className="flex items-center gap-2 text-teal-800 font-bold text-sm mb-1">
                    <CheckCircleOutlined sx={{ fontSize: 16, color: "#0d9488" }} />
                    <span>Microscope Endodontics</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    High-magnification rotary root canal treatments designed to preserve natural tooth structure.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-xs">
                  <div className="flex items-center gap-2 text-teal-800 font-bold text-sm mb-1">
                    <CheckCircleOutlined sx={{ fontSize: 16, color: "#0d9488" }} />
                    <span>European Class-B Sterilization</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Hospital-standard 134°C autoclaving with daily biological spore verification on all instruments.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={openBooking}
                  className="px-7 py-3.5 rounded-xl bg-slate-950 hover:bg-teal-700 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-slate-950/15 transition-all inline-flex items-center gap-2 cursor-pointer"
                >
                  <CalendarMonthOutlined sx={{ fontSize: 18 }} />
                  <span>Book Consultation with Dr. Sheriyaar</span>
                </button>

                <a
                  href={`tel:${clinicInfo.phone}`}
                  className="px-6 py-3.5 rounded-xl bg-white border border-slate-300 text-slate-800 hover:text-teal-700 hover:border-teal-500 font-extrabold text-xs uppercase tracking-wider transition-all inline-flex items-center gap-2 cursor-pointer"
                >
                  <PhoneInTalkOutlined sx={{ fontSize: 18, color: "#0d9488" }} />
                  <span>Direct Desk: {clinicInfo.phone}</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE CLINICAL FACILITY & OPERATORY TOUR (UI/UX Best-in-Class Flow) */}
      <section className="py-20 bg-white border-b border-slate-200/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full">
              Hospital Facility & Technology
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0B1528] mt-3 tracking-tight">
              Tour Our Clinical Operatory Suites
            </h2>
            <p className="text-slate-600 mt-3 text-base leading-relaxed">
              Explore our purpose-built surgical suites in F-10 Markaz, engineered to comply with strict European Class-B sterilization protocols and modern patient ergonomic care.
            </p>
          </div>

          {/* Interactive Operatory Selector Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
            {operatoryBays.map((bay, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveOperatory(idx)}
                className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-extrabold flex items-center gap-2.5 transition-all cursor-pointer shadow-xs ${
                  activeOperatory === idx
                    ? "bg-teal-600 text-white shadow-md shadow-teal-600/30 scale-105"
                    : "bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200"
                }`}
              >
                <CameraAltOutlined sx={{ fontSize: 17, color: activeOperatory === idx ? "#ffffff" : "#0d9488" }} />
                <span>{bay.title}</span>
              </button>
            ))}
          </div>

          {/* Active Operatory Bay Showcase Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-10 lg:p-12">
              
              {/* Left Column: Visual Operatory Room */}
              <div className="lg:col-span-7">
                <div className="relative h-72 sm:h-96 lg:h-[440px] w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-900 shadow-md">
                  <Image
                    src={operatoryBays[activeOperatory].image}
                    alt={operatoryBays[activeOperatory].title}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />
                  
                  <div className="absolute top-4 left-4">
                    <span className="px-3.5 py-1.5 rounded-full bg-slate-950/85 backdrop-blur-md text-teal-300 font-mono text-xs font-bold border border-teal-500/30 shadow-md">
                      {operatoryBays[activeOperatory].certification}
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="text-xs font-mono font-bold text-teal-400 block uppercase">
                      Clinical Facility Bay 0{activeOperatory + 1}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black mt-0.5">
                      {operatoryBays[activeOperatory].title}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Right Column: Clinical Specs & Technology Highlights */}
              <div className="lg:col-span-5 space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-700 block mb-1">
                    {operatoryBays[activeOperatory].tagline}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-[#0B1528] tracking-tight">
                    {operatoryBays[activeOperatory].title}
                  </h3>
                  <p className="text-slate-600 mt-3 text-xs sm:text-sm leading-relaxed">
                    {operatoryBays[activeOperatory].desc}
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <span className="text-[11px] font-extrabold uppercase text-slate-400 tracking-wider block">
                    Engineering & Safety Features
                  </span>
                  {operatoryBays[activeOperatory].features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-slate-800 font-semibold">
                      <CheckCircleOutlined sx={{ fontSize: 16, color: "#0d9488", marginTop: "1px" }} />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Location</span>
                    <span className="text-xs font-bold text-slate-800">F-10 Markaz Islamabad</span>
                  </div>
                  <Link
                    href="/#book"
                    className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs uppercase tracking-wider transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <span>Schedule Visit</span>
                    <ChevronRightOutlined sx={{ fontSize: 16 }} />
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 4. PATIENT CLINICAL JOURNEY (The 4-Step Care Workflow) */}
      <section className="py-20 bg-slate-50 border-b border-slate-200/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full">
              Patient Protocol
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0B1528] mt-3 tracking-tight">
              Your Clinical Care Journey With Us
            </h2>
            <p className="text-slate-600 mt-3 text-base leading-relaxed">
              From your initial welcome to post-operative recovery, our transparent 4-stage process ensures zero waiting time, complete clinical comfort, and predictable biological longevity.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="rounded-3xl border border-slate-200 p-7 bg-white hover:shadow-xl hover:border-teal-400 transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <span className="text-xs font-black font-mono text-teal-700 bg-teal-50 border border-teal-200 px-3 py-1 rounded-xl">
                    PHASE 01
                  </span>
                  <div className="size-11 rounded-2xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center shadow-xs group-hover:bg-teal-600 group-hover:text-white transition-all">
                    <LocationOnOutlined sx={{ fontSize: 22 }} />
                  </div>
                </div>
                <h3 className="text-lg font-black text-[#0B1528] group-hover:text-teal-700 transition-colors">
                  Seamless Arrival & Check-In
                </h3>
                <p className="text-xs text-slate-600 mt-2.5 leading-relaxed font-normal">
                  Enjoy dedicated building parking and elevator access in F-10 Markaz. Fast digital iPad registration with zero lobby waiting queues.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-bold text-teal-800">
                <CheckCircleOutlined sx={{ fontSize: 14, color: "#0d9488" }} />
                <span>Zero Lobby Wait Guarantee</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="rounded-3xl border border-slate-200 p-7 bg-white hover:shadow-xl hover:border-teal-400 transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <span className="text-xs font-black font-mono text-teal-700 bg-teal-50 border border-teal-200 px-3 py-1 rounded-xl">
                    PHASE 02
                  </span>
                  <div className="size-11 rounded-2xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center shadow-xs group-hover:bg-teal-600 group-hover:text-white transition-all">
                    <BiotechOutlined sx={{ fontSize: 22 }} />
                  </div>
                </div>
                <h3 className="text-lg font-black text-[#0B1528] group-hover:text-teal-700 transition-colors">
                  3D Digital Diagnosis
                </h3>
                <p className="text-xs text-slate-600 mt-2.5 leading-relaxed font-normal">
                  Sub-millimeter CBCT volumetric bone scans and intraoral camera photos map your oral anatomy with microscopic clarity.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-bold text-teal-800">
                <CheckCircleOutlined sx={{ fontSize: 14, color: "#0d9488" }} />
                <span>Itemized Written Quote</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="rounded-3xl border border-slate-200 p-7 bg-white hover:shadow-xl hover:border-teal-400 transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <span className="text-xs font-black font-mono text-teal-700 bg-teal-50 border border-teal-200 px-3 py-1 rounded-xl">
                    PHASE 03
                  </span>
                  <div className="size-11 rounded-2xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center shadow-xs group-hover:bg-teal-600 group-hover:text-white transition-all">
                    <AutoAwesomeOutlined sx={{ fontSize: 22 }} />
                  </div>
                </div>
                <h3 className="text-lg font-black text-[#0B1528] group-hover:text-teal-700 transition-colors">
                  Gentle Pain-Free Procedure
                </h3>
                <p className="text-xs text-slate-600 mt-2.5 leading-relaxed font-normal">
                  Computer-controlled numbing eliminates needle pressure. Minimally invasive execution under Class-B European autoclaved sterilization.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-bold text-teal-800">
                <CheckCircleOutlined sx={{ fontSize: 14, color: "#0d9488" }} />
                <span>100% Painless Sedation</span>
              </div>
            </div>

            {/* Step 4 */}
            <div className="rounded-3xl border border-slate-200 p-7 bg-white hover:shadow-xl hover:border-teal-400 transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <span className="text-xs font-black font-mono text-teal-700 bg-teal-50 border border-teal-200 px-3 py-1 rounded-xl">
                    PHASE 04
                  </span>
                  <div className="size-11 rounded-2xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center shadow-xs group-hover:bg-teal-600 group-hover:text-white transition-all">
                    <SupportAgentOutlined sx={{ fontSize: 22 }} />
                  </div>
                </div>
                <h3 className="text-lg font-black text-[#0B1528] group-hover:text-teal-700 transition-colors">
                  Lifelong Care & Aftercare
                </h3>
                <p className="text-xs text-slate-600 mt-2.5 leading-relaxed font-normal">
                  Receive personalized printed recovery precautions, official manufacturer serial warranty cards, and direct 24/7 WhatsApp emergency doctor care.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-bold text-teal-800">
                <CheckCircleOutlined sx={{ fontSize: 14, color: "#0d9488" }} />
                <span>24/7 WhatsApp Doctor Line</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CLINICAL CHARTER: ZERO-PRESSURE TRANSPARENT PRACTICE */}
      <section className="py-20 bg-white border-b border-slate-200/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-100/70 border border-teal-200 px-3 py-1 rounded-full">
              Patient Charter
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0B1528] mt-3 tracking-tight">
              The Elite Dental Standard of Care
            </h2>
            <p className="text-slate-600 mt-3 text-base leading-relaxed">
              We stand apart through radical clinical honesty, biological preservation, and transparent upfront fee schedules.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-xl hover:border-teal-400 transition-all duration-300">
              <div className="size-12 rounded-2xl bg-white border border-slate-200 text-teal-700 flex items-center justify-center mb-6 shadow-xs">
                <VerifiedOutlined sx={{ fontSize: 26, color: "#0d9488" }} />
              </div>
              <h3 className="text-xl font-black text-slate-950 mb-2">Zero Pressure, Transparent Advice</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                We explain all treatment options, biological trade-offs, and itemized costs before initiating any treatment. You never experience surprise post-treatment bills.
              </p>
            </div>

            <div className="p-8 rounded-3xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-xl hover:border-teal-400 transition-all duration-300">
              <div className="size-12 rounded-2xl bg-white border border-slate-200 text-teal-700 flex items-center justify-center mb-6 shadow-xs">
                <MedicalServicesOutlined sx={{ fontSize: 26, color: "#0d9488" }} />
              </div>
              <h3 className="text-xl font-black text-slate-950 mb-2">Biological Tooth Preservation</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                Our clinical philosophy exhausts all conservative endodontic and restorative options before considering tooth extraction, keeping your natural smile intact.
              </p>
            </div>

            <div className="p-8 rounded-3xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-xl hover:border-teal-400 transition-all duration-300">
              <div className="size-12 rounded-2xl bg-white border border-slate-200 text-teal-700 flex items-center justify-center mb-6 shadow-xs">
                <SupportAgentOutlined sx={{ fontSize: 26, color: "#0d9488" }} />
              </div>
              <h3 className="text-xl font-black text-slate-950 mb-2">24/7 Dedicated Emergency Access</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                Every surgical and root canal patient is provided our direct clinical WhatsApp contact for immediate reassurance, pain relief guidance, and emergency attention.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. DOCTOR CONSULTATION BOOKING MODAL */}
      {isBookingOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeBooking();
          }}
        >
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
            {/* Dialog Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center">
                  <CalendarMonthOutlined sx={{ fontSize: 22 }} />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-[#0B1528]">
                    Schedule Consultation with Dr. Sheriyaar
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Elite Dental Centre • F-10 Markaz Islamabad
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeBooking}
                className="size-9 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close dialog"
              >
                <Close sx={{ fontSize: 20 }} />
              </button>
            </div>

            {/* Dialog Body with Full BookingForm */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1">
              <BookingForm treatments={treatments} onSuccess={closeBooking} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
