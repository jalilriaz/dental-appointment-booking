import Image from "next/image";
import Link from "next/link";
import { clinicInfo, testimonials, trustStats, whyChooseUs, teamMembers } from "@/app/constants/mockData";
import { Phone, Mail, MapPin, Clock, Star, ChevronRight, ArrowRight, Shield, Award, Calendar } from "lucide-react";
import Navbar from "@/components/Navbar";
import prisma from "@/lib/prisma";
import { getClinicHours } from "@/lib/getClinicHours";
import TestimonialCard from "@/components/TestimonialCard";
import AnimatedCounter from "@/components/AnimatedCounter";
import { getTreatmentImage } from "@/lib/utils";
import HomeClient from "./HomeClient";

export default async function LandingPage() {
  const treatments = await prisma.treatment.findMany({
    where: { isActive: true },
    take: 6,
    orderBy: { name: "asc" },
  });

  const workingHours = await getClinicHours();

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-teal-50/40 via-background to-background">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-teal-100/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-100/30 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 lg:pt-24 lg:pb-28 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 text-teal-800 text-sm font-semibold mb-6 border border-teal-200 shadow-xs">
                <Shield className="size-4 text-teal-600" />
                Islamabad&apos;s Most Trusted Dental Clinic
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-slate-900 leading-tight tracking-tight">
                Your Perfect Smile{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-teal-800">
                  Starts Here
                </span>
              </h1>
              <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
                Experience world-class dental care with state-of-the-art technology,
                compassionate care, and affordable pricing all under one roof.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row flex-wrap gap-4">
                <a
                  href={`https://wa.me/${clinicInfo.whatsapp}?text=${encodeURIComponent("Hi, I would like to book an appointment")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-teal-600 hover:bg-teal-700 text-white text-lg font-semibold rounded-full shadow-lg shadow-teal-600/25 hover:shadow-xl hover:shadow-teal-600/30 transition-premium active:scale-95"
                >
                  <Phone className="size-5" />
                  Book via WhatsApp
                </a>
                <Link
                  href="/services"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-slate-300 bg-white text-slate-800 text-lg font-semibold rounded-full hover:bg-slate-50 hover:border-teal-500 transition-premium shadow-xs"
                >
                  Explore Services
                </Link>
              </div>
              <div className="mt-10 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-sm text-slate-600 font-medium">
                <div className="flex items-center gap-2">
                  <Clock className="size-4 text-teal-600 shrink-0" />
                  <span>Open {workingHours}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="size-4 text-teal-600 shrink-0" />
                  <span>{clinicInfo.phone}</span>
                </div>
              </div>
            </div>

            <div className="hidden lg:block relative animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              <div className="absolute inset-0 bg-gradient-to-tr from-teal-500/10 to-emerald-500/10 rounded-[2.5rem] blur-2xl" />
              <img
                src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=1000&auto=format&fit=crop"
                alt="Happy patient at dental clinic"
                className="relative rounded-[2rem] object-cover w-full h-[400px] lg:h-[480px] border border-slate-200 shadow-2xl"
              />
              {/* Floating badge */}
              <div className="absolute -bottom-6 -left-6 bg-white/95 border border-slate-200/90 shadow-xl p-5 rounded-2xl flex items-center gap-4 animate-fade-in-up backdrop-blur-md" style={{ animationDelay: '600ms' }}>
                <div className="size-12 rounded-full bg-amber-50 flex items-center justify-center border border-amber-200">
                  <Star className="size-6 text-amber-500 fill-amber-500" />
                </div>
                <div>
                  <p className="text-slate-900 font-extrabold text-lg">4.9/5</p>
                  <p className="text-slate-600 text-sm font-medium">Patient Rating</p>
                </div>
              </div>
              {/* Second floating badge */}
              <div className="absolute -top-4 -right-4 bg-white/95 border border-slate-200/90 shadow-xl px-4 py-3 rounded-xl flex items-center gap-3 animate-fade-in-up backdrop-blur-md" style={{ animationDelay: '800ms' }}>
                <div className="size-10 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-200">
                  <Award className="size-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-slate-900 font-bold text-sm">12+ Years</p>
                  <p className="text-slate-500 text-xs font-medium">of Excellence</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Stats */}
      <section className="py-12 border-y border-slate-200/80 bg-slate-50/60 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-wrap justify-center gap-12 md:gap-32">
            {trustStats.map((stat) => {
              const numMatch = stat.value.match(/\d+(?:,\d+)?/);
              const suffixMatch = stat.value.match(/[^\d,]+/);
              const numValue = numMatch ? parseInt(numMatch[0].replace(/,/g, ''), 10) : 0;
              const suffix = suffixMatch ? suffixMatch[0] : "";

              return (
                <div key={stat.label} className="text-center group">
                  <p className="text-3xl lg:text-4xl font-extrabold text-teal-700 transition-all duration-500">
                    <AnimatedCounter value={numValue} suffix={suffix} />
                  </p>
                  <p className="mt-1 text-sm text-slate-600 font-semibold">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Client-side animated sections */}
      <HomeClient
        treatments={treatments.map(t => ({
          id: t.id,
          name: t.name,
          description: t.description,
          imageUrl: t.imageUrl,
          durationMin: t.durationMin,
        }))}
        workingHours={workingHours}
      />
    </main>
  );
}
