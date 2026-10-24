"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock, Phone, ChevronRight } from "lucide-react";
import { clinicInfo } from "@/app/constants/mockData";
import { getTreatmentImage, getServiceDescription } from "@/lib/utils";
import PageTransition from "@/components/PageTransition";
import ScrollReveal from "@/components/ScrollReveal";

interface Treatment {
    id: string;
    name: string;
    durationMin: number;
    price: number;
    description: string | null;
    imageUrl: string | null;
}

export default function ServicesClient({ treatments }: { treatments: Treatment[] }) {
    return (
        <PageTransition>
            {/* Hero */}
            <section className="relative py-16 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-teal-500/[0.07] to-transparent" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-teal-500/10 rounded-full blur-3xl" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
                    <ScrollReveal>
                        <h1 className="text-4xl sm:text-5xl font-bold text-white">
                            Our{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">
                                Services
                            </span>
                        </h1>
                        <p className="mt-4 text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
                            Comprehensive dental care with transparent pricing. From routine checkups to advanced
                            implant procedures - we&apos;ve got your smile covered.
                        </p>
                        <div className="mt-6 flex items-center justify-center gap-6 text-sm text-slate-500">
                            <span className="flex items-center gap-1.5">
                                <span className="size-2 rounded-full bg-teal-500" />
                                {treatments.length} different treatments available
                            </span>
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            {/* Services Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {treatments.map((treatment, idx) => (
                        <ScrollReveal key={treatment.id} delay={idx * 0.08} amount={0.15}>
                            <div
                                className="glass-card rounded-xl p-0 hover:border-teal-500/30 hover:shadow-xl hover:shadow-teal-500/10 hover:-translate-y-1 transition-all duration-300 group overflow-hidden flex flex-col bg-slate-900/40 h-full"
                            >
                                {/* Image */}
                                <div className="w-full h-56 relative overflow-hidden flex items-center justify-center p-4">
                                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-teal-500/10 via-slate-900/50 to-slate-950/80" />
                                    <Image
                                        src={treatment.imageUrl || getTreatmentImage(treatment.name)}
                                        alt={treatment.name}
                                        fill
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-500 p-2 relative z-10"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent z-10" />

                                    {/* Duration badge */}
                                    <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/70 backdrop-blur-sm border border-white/10 text-xs text-slate-300 z-20">
                                        <Clock className="size-3 text-teal-400" />
                                        {treatment.durationMin} min
                                    </div>
                                </div>

                                <div className="p-6 flex-1 flex flex-col bg-slate-900/50">
                                    <h3 className="text-lg lg:text-xl font-bold text-white group-hover:text-teal-400 transition-premium">
                                        {treatment.name}
                                    </h3>

                                    <p className="mt-3 text-sm text-slate-400 leading-relaxed flex-1">
                                        {treatment.description || getServiceDescription(treatment.name)}
                                    </p>

                                    <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-end">
                                        <Link
                                            href={`/services/${treatment.id}`}
                                            className="inline-flex items-center gap-1 text-sm font-semibold text-teal-400 hover:text-teal-300 transition-premium group-hover:translate-x-1"
                                        >
                                            Learn More <ChevronRight className="size-4" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </ScrollReveal>
                    ))}
                </div>
            </div>

            {/* CTA */}
            <section className="py-16 relative overflow-hidden border-t border-white/[0.06]">
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500/[0.05] to-emerald-500/[0.05]" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-teal-500/10 rounded-full blur-3xl" />
                <div className="max-w-4xl mx-auto px-4 text-center relative">
                    <ScrollReveal>
                        <h2 className="text-3xl font-bold text-white">Ready to Get Started?</h2>
                        <p className="mt-3 text-lg text-slate-400 max-w-xl mx-auto">
                            Book an appointment and take the first step towards a healthier, brighter smile.
                        </p>
                        <a
                            href={`https://wa.me/${clinicInfo.whatsapp}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-8 inline-flex items-center gap-2 px-8 py-4 gradient-primary-h text-white text-lg font-semibold rounded-full hover:shadow-xl hover:shadow-teal-500/25 transition-premium active:scale-95"
                        >
                            <Phone className="size-5" />
                            WhatsApp Us to Book
                        </a>
                    </ScrollReveal>
                </div>
            </section>
        </PageTransition>
    );
}
