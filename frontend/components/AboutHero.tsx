"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CalendarMonthOutlined,
  ArrowForward,
  Close,
  AutoAwesomeOutlined,
  VerifiedOutlined,
  PhoneInTalkOutlined,
} from "@mui/icons-material";
import { clinicInfo } from "@/app/constants/mockData";
import BookingForm from "@/components/BookingForm";
import type { Treatment } from "@/lib/types";

function ToothIcon({ className = "size-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C8.5 2 6 4.5 6 7.5C6 9.5 6.8 11.2 7.2 13C7.8 15.5 8.2 18.5 9 21.5C9.3 22.3 10.3 22.5 10.8 21.8C11.5 20.8 12 17.5 12 15.5C12 17.5 12.5 20.8 13.2 21.8C13.7 22.5 14.7 22.3 15 21.5C15.8 18.5 16.2 15.5 16.8 13C17.2 11.2 18 9.5 18 7.5C18 4.5 15.5 2 12 2Z" />
    </svg>
  );
}

interface AboutHeroProps {
  treatments: Treatment[];
}

export default function AboutHero({ treatments }: AboutHeroProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsDialogOpen(false);
    };
    if (isDialogOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isDialogOpen]);

  return (
    <section className="relative bg-gradient-to-b from-[#F0FDF4]/50 via-[#F8FAFC] to-white border-b border-slate-200/90 pt-12 sm:pt-16 pb-16 lg:pb-20 overflow-hidden">
      {/* Soft Ambient Background Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-teal-200/20 blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-10 w-72 h-72 rounded-full bg-cyan-200/15 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Bold Typography & Action CTAs (Matching Reference Image) */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold text-teal-800 bg-teal-50 border border-teal-200 uppercase tracking-wider mb-4">
                <VerifiedOutlined sx={{ fontSize: 15, color: "#0d9488" }} />
                <span>Our Clinic & Medical Heritage</span>
              </span>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#0B1528] tracking-tight leading-[1.12]">
                Your <span className="text-teal-600">Great Smile</span> <br />
                Begins With a <br />
                Great Dentist
              </h1>
            </div>

            <p className="text-slate-600 text-base sm:text-lg max-w-xl font-normal leading-relaxed">
              Founded on the core belief that dental treatment should be pain-free, scientifically grounded, and transparent. We combine international sterilization standards with personalized patient care.
            </p>

            {/* Action Buttons Row with Curled Hand-Drawn Doodle Arrow */}
            <div className="relative pt-2 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => setIsDialogOpen(true)}
                className="px-8 sm:px-9 py-4 rounded-full bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-teal-600/30 transition-all duration-300 hover:scale-105 cursor-pointer inline-flex items-center gap-2"
              >
                <CalendarMonthOutlined sx={{ fontSize: 18 }} />
                <span>Book Appointment</span>
              </button>

              <Link
                href="/services"
                className="px-8 sm:px-9 py-4 rounded-full bg-white hover:bg-slate-50 text-slate-800 border-2 border-slate-200 hover:border-slate-300 font-extrabold text-sm sm:text-base shadow-xs transition-all duration-300 hover:scale-105 cursor-pointer inline-flex items-center gap-2"
              >
                <span>Our Services</span>
                <ArrowForward sx={{ fontSize: 16, color: "#0d9488" }} />
              </Link>

              {/* Hand-Drawn Curled Doodle Arrow (Matching Reference) */}
              <div className="hidden sm:block absolute -right-6 -bottom-14 lg:-right-10 pointer-events-none select-none text-slate-400">
                <svg
                  className="w-24 sm:w-28 h-20 -rotate-6"
                  viewBox="0 0 100 80"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M85 10 C 65 5, 25 15, 30 45 C 33 65, 60 58, 55 38 C 48 20, 25 35, 12 60"
                    stroke="#94a3b8"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeDasharray="4 4"
                  />
                  <path
                    d="M8 50 L 12 60 L 22 58"
                    stroke="#0d9488"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Right Column: Friendly Smiling Male Dentist with Floating Feature Badges */}
          <div className="lg:col-span-5 relative flex justify-center items-center pt-6 lg:pt-0">
            <div className="relative w-full max-w-[380px] sm:max-w-[420px] h-[460px] sm:h-[500px] flex items-center justify-center select-none">
              
              {/* Soft Shaped Gradient Backdrop Frame */}
              <div className="absolute inset-2 sm:inset-4 rounded-[56px] bg-gradient-to-br from-teal-100/90 via-teal-50/40 to-cyan-100/60 border border-teal-200/80 shadow-2xl -rotate-1 pointer-events-none" />

              {/* High-Definition Male Dentist Portrait in Doctor's Coat with Stethoscope */}
              <div className="relative w-[300px] sm:w-[340px] h-[420px] sm:h-[460px] rounded-[48px] overflow-hidden z-10 shadow-2xl border-4 border-white bg-white group">
                <Image
                  src="/images/dr_sheriyaar.jpg"
                  alt="Dr. Sheriyaar - Lead Dental Surgeon in pristine clinical coat"
                  fill
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
                  priority
                />
                {/* Subtle soft vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1528]/30 via-transparent to-transparent pointer-events-none" />

                {/* Overlaid Doctor Name Badge */}
                <div className="absolute bottom-4 left-4 right-4 bg-slate-950/85 backdrop-blur-md rounded-2xl p-3 border border-slate-700/80 text-white shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-black text-white">Dr. Sheriyaar</p>
                      <p className="text-[10px] text-teal-300 font-medium">BDS, RDS • Lead Dental Specialist</p>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/80 border border-emerald-800/80 px-2 py-0.5 rounded-full">
                      PMC Active
                    </span>
                  </div>
                </div>
              </div>

              {/* Floating Feature Badge 1: Dental Crown / Restore (Top-Right) */}
              <div className="absolute top-6 -right-2 sm:-right-4 z-20 animate-float-1">
                <div className="size-14 sm:size-16 rounded-3xl bg-amber-50/95 border-2 border-white shadow-xl shadow-amber-900/10 flex flex-col items-center justify-center p-2 text-amber-500 hover:scale-110 transition-transform">
                  <ToothIcon className="size-6 text-amber-500" />
                  <span className="text-[9px] font-bold text-amber-800 mt-0.5">Implants</span>
                </div>
              </div>

              {/* Floating Feature Badge 2: Sparkling Tooth / Clean Smile (Mid/Bottom-Right) */}
              <div className="absolute bottom-16 -right-2 sm:-right-4 z-20 animate-float-2">
                <div className="size-14 sm:size-16 rounded-3xl bg-teal-50/95 border-2 border-white shadow-xl shadow-teal-900/10 flex flex-col items-center justify-center p-2 text-teal-600 hover:scale-110 transition-transform">
                  <AutoAwesomeOutlined sx={{ fontSize: 24, color: "#0d9488" }} />
                  <span className="text-[9px] font-bold text-teal-800 mt-0.5">Whitening</span>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Bottom Floating Contact Strip (Matching Reference Image) */}
        <div className="mt-12 sm:mt-16 max-w-4xl mx-auto rounded-3xl sm:rounded-full bg-white border border-slate-200/90 shadow-2xl shadow-slate-900/5 p-3 sm:p-3.5 pl-6 sm:pl-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-slate-800 text-sm sm:text-base text-center sm:text-left">
            <div className="size-9 rounded-full bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center shrink-0">
              <PhoneInTalkOutlined sx={{ fontSize: 18 }} />
            </div>
            <span className="text-slate-500 font-medium">Get In Touch With Us Today</span>
            <a
              href={`tel:${clinicInfo.phone}`}
              className="text-teal-600 hover:text-teal-700 font-black text-base sm:text-lg transition-colors"
            >
              {clinicInfo.phone}
            </a>
          </div>

          <button
            type="button"
            onClick={() => setIsDialogOpen(true)}
            className="w-full sm:w-auto px-7 py-3 rounded-full bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider shadow-md shadow-teal-600/25 transition-all hover:scale-105 cursor-pointer shrink-0"
          >
            Book Appointment
          </button>
        </div>

      </div>

      {/* Booking Form Modal Dialog */}
      {isDialogOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsDialogOpen(false);
          }}
        >
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
            {/* Dialog Header */}
            <div className="flex items-center justify-between px-6 py-4.5 bg-gradient-to-r from-teal-50/80 via-white to-cyan-50/30 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-md shadow-teal-600/25">
                  <CalendarMonthOutlined sx={{ fontSize: 22 }} />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-[#0B1528]">
                    Reserve Your Appointment
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Schedule a clinical consultation at Elite Dental Centre Islamabad
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsDialogOpen(false)}
                className="size-9 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close dialog"
              >
                <Close sx={{ fontSize: 20 }} />
              </button>
            </div>

            {/* Dialog Body with Full BookingForm */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1">
              <BookingForm treatments={treatments} onSuccess={() => setIsDialogOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

