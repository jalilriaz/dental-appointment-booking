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
      <section className="relative overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/[0.06] via-transparent to-emerald-500/[0.04] animate-gradient-shift" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-teal-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-1/4 w-[200px] h-[200px] bg-amber-500/[0.03] rounded-full blur-2xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 lg:pt-24 lg:pb-28 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 text-teal-400 text-sm font-medium mb-6 border border-teal-500/20">
                <Shield className="size-4" />
                Islamabad&apos;s Most Trusted Dental Clinic
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight tracking-tight">
                Your Perfect Smile{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">
                  Starts Here
                </span>
              </h1>
              <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed">
                Experience world-class dental care with state-of-the-art technology,
                compassionate care, and affordable pricing all under one roof.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row flex-wrap gap-4">
                <a
                  href={`https://wa.me/${clinicInfo.whatsapp}?text=${encodeURIComponent("Hi, I would like to book an appointment")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 gradient-primary-h text-white text-lg font-semibold rounded-full hover:shadow-xl hover:shadow-teal-500/25 transition-premium active:scale-95"
                >
                  <Phone className="size-5" />
                  Book via WhatsApp
                </a>
                <Link
                  href="/services"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/10 text-slate-300 text-lg font-semibold rounded-full hover:bg-white/[0.04] hover:border-teal-500/30 transition-premium"
                >
                  Explore Services
                </Link>
              </div>
              <div className="mt-10 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <Clock className="size-4 text-teal-400 shrink-0" />
                  <span>Open {workingHours}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="size-4 text-teal-400 shrink-0" />
                  <span>{clinicInfo.phone}</span>
                </div>
              </div>
            </div>

            <div className="hidden lg:block relative animate-fade-in-up" style={{ animationDelay: '200ms' }}>
              <div className="absolute inset-0 bg-gradient-to-tr from-teal-500/20 to-emerald-500/20 rounded-[2.5rem] blur-2xl" />
              <img
                src="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=1000&auto=format&fit=crop"
                alt="Happy patient at dental clinic"
                className="relative rounded-[2rem] object-cover w-full h-[400px] lg:h-[480px] border border-white/10 shadow-2xl"
              />
              {/* Floating badge — smooth entrance, no bounce */}
              <div className="absolute -bottom-6 -left-6 glass-card p-5 rounded-2xl flex items-center gap-4 animate-fade-in-up" style={{ animationDelay: '600ms' }}>
                <div className="size-12 rounded-full bg-amber-500/20 flex items-center justify-center border border-amber-500/30">
                  <Star className="size-6 text-amber-400 fill-amber-400" />
                </div>
                <div>
                  <p className="text-white font-bold text-lg">4.9/5</p>
                  <p className="text-slate-400 text-sm">Patient Rating</p>
                </div>
              </div>
              {/* Second floating badge */}
              <div className="absolute -top-4 -right-4 glass-card px-4 py-3 rounded-xl flex items-center gap-3 animate-fade-in-up" style={{ animationDelay: '800ms' }}>
                <div className="size-10 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                  <Award className="size-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">12+ Years</p>
                  <p className="text-slate-500 text-xs">of Excellence</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Stats */}
      <section className="py-12 border-y border-white/[0.06] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-teal-500/[0.02] to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-wrap justify-center gap-12 md:gap-32">
            {trustStats.map((stat) => {
              const numMatch = stat.value.match(/\d+(?:,\d+)?/);
              const suffixMatch = stat.value.match(/[^\d,]+/);
              const numValue = numMatch ? parseInt(numMatch[0].replace(/,/g, ''), 10) : 0;
              const suffix = suffixMatch ? suffixMatch[0] : "";

              return (
                <div key={stat.label} className="text-center group">
                  <p className="text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400 group-hover:from-emerald-400 group-hover:to-teal-400 transition-all duration-500">
                    <AnimatedCounter value={numValue} suffix={suffix} />
                  </p>
                  <p className="mt-1 text-sm text-slate-400">{stat.label}</p>
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
