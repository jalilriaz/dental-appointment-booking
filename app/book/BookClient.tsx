"use client";

import Navbar from "@/components/Navbar";
import BookingForm from "@/components/BookingForm";
import type { Treatment } from "@/lib/types";
import { Calendar, Shield, Clock, Phone } from "lucide-react";
import { clinicInfo } from "@/app/constants/mockData";

export default function BookClient({
  treatments,
  defaultTreatmentId,
}: {
  treatments: Treatment[];
  defaultTreatmentId?: string;
}) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="relative py-12 lg:py-16 overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 text-teal-400 text-xs sm:text-sm font-medium mb-4 border border-teal-500/20">
              <Calendar className="size-4" />
              Real-Time Calendar Booking
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
              Book Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">
                Appointment
              </span>
            </h1>
            <p className="mt-3 text-sm sm:text-base text-slate-400 max-w-xl mx-auto leading-relaxed">
              Select your procedure, choose an available real-time slot, and confirm. No waiting, zero double-booking, and instant calendar confirmation.
            </p>

            {/* Quick trust metrics */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-slate-500">
              <span className="flex items-center gap-1.5">
                <Shield className="size-4 text-teal-400" />
                Guaranteed Slot Confirmation
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="size-4 text-teal-400" />
                Mon–Sat: 12:00 PM – 8:00 PM
              </span>
            </div>
          </div>

          {/* Interactive Booking Card */}
          <div className="glass-card rounded-2xl p-6 sm:p-8 border border-white/10 shadow-2xl bg-slate-900/60 backdrop-blur-xl">
            <BookingForm
              treatments={treatments}
              defaultTreatmentId={defaultTreatmentId}
              returnUrl="/"
            />
          </div>

          {/* Alternative WhatsApp Support Card */}
          <div className="mt-10 text-center">
            <p className="text-sm text-slate-400">
              Prefer to book via WhatsApp or have questions before scheduling?
            </p>
            <a
              href={`https://wa.me/${clinicInfo.whatsapp}?text=Hi, I would like to inquire about booking an appointment.`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-teal-400 hover:text-teal-300 transition-premium"
            >
              <Phone className="size-4" />
              Chat directly with our reception on WhatsApp
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
