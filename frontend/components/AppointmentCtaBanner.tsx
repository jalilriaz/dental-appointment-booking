"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ArrowForward, Close, CalendarMonthOutlined, VerifiedOutlined } from "@mui/icons-material";
import BookingForm from "@/components/BookingForm";
import type { Treatment } from "@/lib/types";

interface AppointmentCtaBannerProps {
  treatments: Treatment[];
}

export default function AppointmentCtaBanner({ treatments }: AppointmentCtaBannerProps) {
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
    <section id="book" className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Banner Card Matching Reference Design */}
        <div className="relative overflow-hidden rounded-3xl sm:rounded-[40px] bg-gradient-to-r from-teal-600 via-teal-700 to-[#0B1528] text-white shadow-2xl shadow-teal-950/20 border border-teal-500/30">
          {/* Subtle Ambient Radial Lighting */}
          <div className="absolute -right-24 -bottom-24 w-96 h-96 rounded-full bg-teal-400/20 blur-3xl pointer-events-none" />
          <div className="absolute left-1/3 -top-24 w-80 h-80 rounded-full bg-cyan-400/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-8 sm:p-12 lg:p-16">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight sm:leading-tight">
                Schedule Your <br className="hidden sm:inline" />
                Appointment With Us
              </h2>

              <p className="text-teal-50/90 text-sm sm:text-base lg:text-lg max-w-xl font-normal leading-relaxed">
                Schedule your appointment with us easily and at your convenience. Choose your
                preferred time, and we&apos;ll ensure a smooth and hassle-free experience tailored to your
                needs.
              </p>

              {/* Action Button: "Make a Schedule" with Dark Circular Arrow Icon */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setIsDialogOpen(true)}
                  className="group inline-flex items-center gap-4 bg-white text-slate-900 hover:bg-slate-100 font-extrabold text-sm sm:text-base pl-6 pr-2.5 py-2.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                >
                  <span>Make a Schedule</span>
                  <div className="size-9 rounded-full bg-slate-900 text-white flex items-center justify-center group-hover:translate-x-1 transition-transform">
                    <ArrowForward sx={{ fontSize: 18 }} />
                  </div>
                </button>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center gap-4 pt-4 text-xs font-semibold text-teal-100/80">
                <div className="flex items-center gap-1.5">
                  <VerifiedOutlined sx={{ fontSize: 16, color: "#34D399" }} />
                  <span>Instant SMS Confirmation</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CalendarMonthOutlined sx={{ fontSize: 16, color: "#38BDF8" }} />
                  <span>Flexible Rescheduling</span>
                </div>
              </div>
            </div>

            {/* Right Visual Imagery: Dedicated Dental Operatory & Care */}
            <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
              <div className="relative w-full max-w-sm sm:max-w-md h-64 sm:h-72 lg:h-84 rounded-2xl sm:rounded-3xl overflow-hidden border-2 border-white/20 shadow-2xl bg-teal-950/40 select-none group">
                <Image
                  src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=1000&auto=format&fit=crop"
                  alt="Specialized dental consultation with precision dental instruments"
                  fill
                  unoptimized
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                {/* Soft Gradient Overlay for Seamless Integration */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1528]/70 via-transparent to-transparent pointer-events-none" />

                {/* Overlaid Clinical Quality Badge */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <div className="px-3 py-1 rounded-full bg-slate-950/85 backdrop-blur-md text-[11px] font-bold text-teal-300 border border-teal-500/30 flex items-center gap-1.5 shadow-md">
                    <VerifiedOutlined sx={{ fontSize: 14, color: "#2dd4bf" }} />
                    <span>Specialized Dental Care</span>
                  </div>
                  <span className="text-[10px] text-white/80 font-mono font-semibold">
                    ISO-Sterile
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Form Modal Dialog */}
      {isDialogOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/65 backdrop-blur-sm animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
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
                    Choose your treatment and preferred time slot
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

