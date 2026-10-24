"use client";

import Link from "next/link";
import {
    Heart,
    CheckCircle2,
    Leaf,
    Phone,
    ArrowRight,
    Award,
    Eye,
    SmilePlus,
    Stethoscope,
    Sparkles,
    Wrench,
    ShieldCheck,
    Quote,
} from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import PageTransition from "@/components/PageTransition";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    stethoscope: Stethoscope,
    sparkles: Sparkles,
    wrench: Wrench,
    "shield-check": ShieldCheck,
};

interface AboutClientProps {
    expertiseAreas: { iconKey: string; title: string; desc: string }[];
    whyChooseItems: string[];
    milestones: { year: string; title: string; desc: string }[];
    doctor: { name: string; role: string; qualification: string; experience: string; image?: string };
    clinicInfo: { whatsapp: string; phone: string; address: string };
}

export default function AboutClient({
    expertiseAreas,
    whyChooseItems,
    milestones,
    doctor,
    clinicInfo,
}: AboutClientProps) {
    return (
        <PageTransition>
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-teal-500/[0.07] to-transparent" />
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-teal-500/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-amber-500/5 rounded-full blur-3xl" />

                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 lg:pt-24 lg:pb-28 text-center relative">
                    <ScrollReveal>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 text-teal-400 text-sm font-medium mb-6 border border-teal-500/20">
                            <Heart className="size-4" />
                            Your Smile, Our Priority
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
                            About{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">
                                Elite Dental
                            </span>
                        </h1>
                        <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
                            At Elite Dental Centre, we combine{" "}
                            <span className="text-slate-200 font-medium">advanced dental technology</span> with a{" "}
                            <span className="text-slate-200 font-medium">patient-first approach</span> to deliver
                            high-quality, comfortable, and personalized care.
                        </p>
                    </ScrollReveal>
                </div>
            </section>

            {/* Mission & Values */}
            <section className="py-16 border-t border-white/[0.06]">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <ScrollReveal>
                        <div className="glass-card rounded-2xl p-8 sm:p-12 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-teal-500/5 rounded-full blur-2xl" />
                            <div className="relative grid md:grid-cols-3 gap-8 sm:gap-12">
                                <div className="text-center group">
                                    <div className="size-16 mx-auto rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center mb-4 group-hover:shadow-lg group-hover:shadow-teal-500/10 transition-premium">
                                        <Eye className="size-7 text-teal-400" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-white mb-2">Our Vision</h3>
                                    <p className="text-sm text-slate-400 leading-relaxed">
                                        To be Islamabad&apos;s most trusted dental practice - known for clinical excellence and genuine patient care.
                                    </p>
                                </div>
                                <div className="text-center group">
                                    <div className="size-16 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4 group-hover:shadow-lg group-hover:shadow-amber-500/10 transition-premium">
                                        <Heart className="size-7 text-amber-400" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-white mb-2">Our Mission</h3>
                                    <p className="text-sm text-slate-400 leading-relaxed">
                                        Help every patient achieve a healthy, confident smile in a safe and welcoming environment.
                                    </p>
                                </div>
                                <div className="text-center group">
                                    <div className="size-16 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4 group-hover:shadow-lg group-hover:shadow-emerald-500/10 transition-premium">
                                        <Award className="size-7 text-emerald-400" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-white mb-2">Our Values</h3>
                                    <p className="text-sm text-slate-400 leading-relaxed">
                                        Integrity, compassion, and continuous learning drive every treatment we provide.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            {/* Expertise Areas */}
            <section className="py-20 border-t border-white/[0.06]">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <ScrollReveal>
                        <div className="text-center mb-14">
                            <h2 className="text-3xl font-bold text-white">
                                Our{" "}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">
                                    Expertise
                                </span>
                            </h2>
                            <p className="mt-3 text-lg text-slate-400 max-w-2xl mx-auto">
                                Our team of experienced dental professionals specializes in comprehensive oral healthcare.
                            </p>
                        </div>
                    </ScrollReveal>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {expertiseAreas.map((area, idx) => {
                            const IconComp = iconMap[area.iconKey] || Stethoscope;
                            return (
                                <ScrollReveal key={area.title} delay={idx * 0.1}>
                                    <div className="group relative glass-card rounded-xl p-6 hover:border-teal-500/30 transition-premium h-full overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-premium" />
                                        <div className="relative">
                                            <div className="size-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-premium">
                                                <IconComp className="size-6 text-teal-400" />
                                            </div>
                                            <h3 className="text-lg font-semibold text-white group-hover:text-teal-400 transition-premium">
                                                {area.title}
                                            </h3>
                                            <p className="mt-2 text-sm text-slate-400 leading-relaxed">{area.desc}</p>
                                        </div>
                                    </div>
                                </ScrollReveal>
                            );
                        })}
                    </div>

                    <ScrollReveal delay={0.3}>
                        <p className="mt-10 text-center text-slate-400 max-w-2xl mx-auto">
                            We stay up-to-date with the latest techniques to ensure you receive{" "}
                            <span className="text-teal-400 font-medium">modern, effective treatments</span>.
                        </p>
                    </ScrollReveal>
                </div>
            </section>

            {/* Doctor Spotlight */}
            <section className="py-20 border-t border-white/[0.06] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500/[0.03] to-emerald-500/[0.03]" />
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <ScrollReveal>
                        <div className="glass-card rounded-2xl overflow-hidden">
                            <div className="grid md:grid-cols-5 gap-0">
                                {/* Doctor Image */}
                                <div className="md:col-span-2 relative min-h-[320px] md:min-h-[420px]">
                                    <div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 to-emerald-500/20" />
                                    {doctor.image ? (
                                        <img
                                            src={doctor.image}
                                            alt={doctor.name}
                                            className="absolute inset-0 w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">
                                                {doctor.name.split(" ").pop()?.[0] || "D"}
                                            </span>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-slate-950/80" />
                                </div>

                                {/* Doctor Info */}
                                <div className="md:col-span-3 p-8 sm:p-10 lg:p-12 flex flex-col justify-center">
                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-400 text-xs font-medium mb-4 w-fit border border-amber-500/20">
                                        <Award className="size-3.5" />
                                        Lead Dentist
                                    </div>
                                    <h2 className="text-2xl sm:text-3xl font-bold text-white">{doctor.name}</h2>
                                    <p className="text-teal-400 font-medium mt-1">{doctor.role}</p>

                                    <div className="flex flex-wrap gap-3 mt-5">
                                        <span className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-slate-300">
                                            {doctor.qualification}
                                        </span>
                                        <span className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-slate-300">
                                            {doctor.experience} Experience
                                        </span>
                                    </div>

                                    <div className="mt-6 relative pl-5 border-l-2 border-teal-500/30">
                                        <Quote className="size-5 text-teal-500/40 absolute -left-3 -top-1 bg-[hsl(222,47%,5%)]" />
                                        <p className="text-slate-400 leading-relaxed italic">
                                            Every patient deserves to be heard, respected, and cared for.
                                            I believe visiting a dentist should never feel stressful - that&apos;s why
                                            I focus on creating a friendly, relaxing experience at every visit.
                                        </p>
                                    </div>

                                    <div className="mt-6 pt-5 border-t border-white/[0.06] grid grid-cols-2 gap-4 text-center">
                                        <div>
                                            <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">
                                                5,000+
                                            </p>
                                            <p className="text-xs text-slate-500 mt-1">Patients Treated</p>
                                        </div>
                                        <div>
                                            <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">
                                                12,000+
                                            </p>
                                            <p className="text-xs text-slate-500 mt-1">Procedures Done</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="py-20 border-t border-white/[0.06]">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <ScrollReveal direction="left">
                            <div>
                                <h2 className="text-3xl font-bold text-white">
                                    Why Choose{" "}
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">
                                        Us?
                                    </span>
                                </h2>
                                <p className="mt-4 text-slate-400 leading-relaxed">
                                    We believe the best dental care comes from combining clinical expertise with genuine
                                    compassion. Every detail of our practice is designed around your comfort.
                                </p>
                            </div>
                        </ScrollReveal>

                        <ScrollReveal direction="right">
                            <div className="space-y-4">
                                {whyChooseItems.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-start gap-3 glass-card rounded-xl p-4 hover:border-teal-500/20 transition-premium group"
                                    >
                                        <div className="size-8 rounded-lg bg-teal-500/10 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-teal-500/20 transition-premium">
                                            <CheckCircle2 className="size-4 text-teal-400" />
                                        </div>
                                        <p className="text-slate-300 text-sm leading-relaxed">{item}</p>
                                    </div>
                                ))}
                            </div>
                        </ScrollReveal>
                    </div>
                </div>
            </section>

            {/* Philosophy */}
            <section className="py-20 border-t border-white/[0.06] relative overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-500/[0.04] rounded-full blur-3xl" />
                </div>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <ScrollReveal>
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center size-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mb-6">
                                <Leaf className="size-8 text-emerald-400" />
                            </div>
                            <h2 className="text-3xl font-bold text-white">
                                Our{" "}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                                    Philosophy
                                </span>
                            </h2>
                            <p className="mt-6 text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
                                We believe that visiting a dentist should never feel stressful. That&apos;s why we focus on
                                creating a{" "}
                                <span className="text-slate-200 font-medium">friendly, relaxing experience</span> where
                                every patient feels heard, respected, and cared for.
                            </p>
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            {/* Timeline */}
            <section className="py-20 border-t border-white/[0.06]">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <ScrollReveal>
                        <div className="text-center mb-14">
                            <h2 className="text-3xl font-bold text-white">
                                Our{" "}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">
                                    Journey
                                </span>
                            </h2>
                            <p className="mt-3 text-lg text-slate-400">Milestones that shaped who we are today.</p>
                        </div>
                    </ScrollReveal>

                    <div className="relative">
                        {/* Vertical line */}
                        <div className="absolute left-6 sm:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-teal-500/40 via-teal-500/20 to-transparent" />

                        <div className="space-y-12">
                            {milestones.map((milestone, idx) => (
                                <ScrollReveal key={milestone.year} delay={idx * 0.1}>
                                    <div
                                        className={`relative flex items-start gap-8 ${idx % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"
                                            }`}
                                    >
                                        {/* Dot */}
                                        <div className="absolute left-6 sm:left-1/2 -translate-x-1/2 size-4 rounded-full bg-teal-500 border-4 border-slate-950 z-10 shadow-lg shadow-teal-500/30" />

                                        {/* Content */}
                                        <div
                                            className={`ml-16 sm:ml-0 sm:w-[calc(50%-2rem)] ${idx % 2 === 0 ? "sm:pr-8 sm:text-right" : "sm:pl-8 sm:text-left"
                                                }`}
                                        >
                                            <span className="inline-block px-3 py-1 rounded-full bg-teal-500/10 text-teal-400 text-xs font-bold tracking-wide border border-teal-500/20 mb-2">
                                                {milestone.year}
                                            </span>
                                            <h3 className="text-lg font-semibold text-white">{milestone.title}</h3>
                                            <p className="text-sm text-slate-400 mt-1">{milestone.desc}</p>
                                        </div>

                                        {/* Spacer for opposite side */}
                                        <div className="hidden sm:block sm:w-[calc(50%-2rem)]" />
                                    </div>
                                </ScrollReveal>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Commitment + CTA */}
            <section className="border-t border-white/[0.06] relative overflow-hidden bg-slate-900/50">
                <div className="absolute inset-0 gradient-primary opacity-5" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-teal-500/10 rounded-full blur-3xl" />

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center relative">
                    <ScrollReveal>
                        <div className="inline-flex items-center justify-center size-14 rounded-2xl bg-teal-500/10 border border-teal-500/20 mb-6 mx-auto">
                            <SmilePlus className="size-7 text-teal-400" />
                        </div>
                        <h2 className="text-3xl lg:text-4xl font-bold text-white">
                            Your Smile Deserves the Best
                        </h2>
                        <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
                            Whether you need a routine checkup or advanced dental treatment, we are committed to
                            delivering{" "}
                            <span className="text-slate-200 font-medium">safe, reliable, and long-lasting results</span>.
                        </p>
                        <div className="mt-8 flex flex-wrap gap-4 justify-center">
                            <a
                                href={`https://wa.me/${clinicInfo.whatsapp}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-8 py-4 gradient-primary-h text-white text-lg font-semibold rounded-full hover:shadow-xl hover:shadow-teal-500/25 transition-premium active:scale-95"
                            >
                                <Phone className="size-5" />
                                Book Your Visit
                            </a>
                            <Link
                                href="/services"
                                className="inline-flex items-center gap-2 px-8 py-4 border border-white/10 text-slate-300 text-lg font-semibold rounded-full hover:bg-white/[0.04] hover:border-teal-500/30 transition-premium"
                            >
                                Our Services <ArrowRight className="size-5" />
                            </Link>
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/[0.06] py-8">
                <div className="max-w-5xl mx-auto px-4 text-center">
                    <div className="flex items-center justify-center gap-2 mb-3">
                        <div className="size-7 rounded-full gradient-primary flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-teal-500/20">
                            E
                        </div>
                        <span className="text-white font-bold text-sm">
                            Elite <span className="text-teal-400">Dental</span> Centre
                        </span>
                    </div>
                    <p className="text-sm text-slate-500">
                        © {new Date().getFullYear()} Elite Dental Centre. All rights reserved.
                    </p>
                    <div className="flex items-center justify-center gap-4 mt-3 text-sm text-slate-500">
                        <Link href="/" className="hover:text-teal-400 transition-premium">Home</Link>
                        <span className="text-slate-700">·</span>
                        <Link href="/services" className="hover:text-teal-400 transition-premium">Services</Link>
                        <span className="text-slate-700">·</span>
                        <Link href="/contact" className="hover:text-teal-400 transition-premium">Contact</Link>
                    </div>
                </div>
            </footer>
        </PageTransition>
    );
}
