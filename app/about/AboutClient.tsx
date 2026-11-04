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
            <section className="relative overflow-hidden bg-gradient-to-b from-teal-50/50 via-background to-background py-16 sm:py-20 lg:py-24">
                <div className="absolute top-0 right-1/4 w-[600px] h-[400px] bg-teal-100/40 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-1/4 w-[400px] h-[300px] bg-emerald-100/30 rounded-full blur-3xl pointer-events-none" />

                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
                    <ScrollReveal>
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-50 text-teal-800 text-sm font-semibold mb-6 border border-teal-200 shadow-xs">
                            <Heart className="size-4 text-teal-600" />
                            Your Smile, Our Priority
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight tracking-tight">
                            About{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-teal-800">
                                Elite Dental
                            </span>
                        </h1>
                        <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                            At Elite Dental Centre, we combine{" "}
                            <span className="text-slate-900 font-semibold">advanced dental technology</span> with a{" "}
                            <span className="text-slate-900 font-semibold">patient-first approach</span> to deliver
                            high-quality, comfortable, and personalized care.
                        </p>
                    </ScrollReveal>
                </div>
            </section>

            {/* Mission & Values */}
            <section className="py-16 border-t border-slate-200/80 bg-slate-50/50">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <ScrollReveal>
                        <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs p-8 sm:p-12 relative overflow-hidden">
                            <div className="relative grid md:grid-cols-3 gap-8 sm:gap-12">
                                <div className="text-center group">
                                    <div className="size-16 mx-auto rounded-2xl bg-teal-50 border border-teal-200/70 flex items-center justify-center mb-4 text-teal-700 shadow-xs group-hover:scale-105 group-hover:bg-teal-600 group-hover:text-white transition-all duration-300">
                                        <Eye className="size-7" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-2">Our Vision</h3>
                                    <p className="text-sm text-slate-600 leading-relaxed">
                                        To be Islamabad&apos;s most trusted dental practice — known for clinical excellence and genuine patient care.
                                    </p>
                                </div>
                                <div className="text-center group">
                                    <div className="size-16 mx-auto rounded-2xl bg-amber-50 border border-amber-200/70 flex items-center justify-center mb-4 text-amber-700 shadow-xs group-hover:scale-105 group-hover:bg-amber-600 group-hover:text-white transition-all duration-300">
                                        <Heart className="size-7" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-2">Our Mission</h3>
                                    <p className="text-sm text-slate-600 leading-relaxed">
                                        Help every patient achieve a healthy, confident smile in a safe, hygienic, and welcoming environment.
                                    </p>
                                </div>
                                <div className="text-center group">
                                    <div className="size-16 mx-auto rounded-2xl bg-emerald-50 border border-emerald-200/70 flex items-center justify-center mb-4 text-emerald-700 shadow-xs group-hover:scale-105 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                                        <Award className="size-7" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-2">Our Values</h3>
                                    <p className="text-sm text-slate-600 leading-relaxed">
                                        Integrity, compassion, and continuous innovation drive every treatment and checkup we provide.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            {/* Expertise Areas */}
            <section className="py-20 border-t border-slate-200/80">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <ScrollReveal>
                        <div className="text-center mb-14">
                            <h2 className="text-3xl font-extrabold text-slate-900">
                                Our{" "}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-teal-800">
                                    Expertise
                                </span>
                            </h2>
                            <p className="mt-3 text-lg text-slate-600 max-w-2xl mx-auto">
                                Our team of experienced dental professionals specializes in comprehensive oral healthcare.
                            </p>
                        </div>
                    </ScrollReveal>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {expertiseAreas.map((area, idx) => {
                            const IconComp = iconMap[area.iconKey] || Stethoscope;
                            return (
                                <ScrollReveal key={area.title} delay={idx * 0.1}>
                                    <div className="group relative rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs hover:border-teal-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full overflow-hidden flex flex-col">
                                        <div className="size-12 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center mb-4 text-teal-700 shadow-xs group-hover:scale-110 group-hover:bg-teal-600 group-hover:text-white transition-all duration-300">
                                            <IconComp className="size-6" />
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                                            {area.title}
                                        </h3>
                                        <p className="mt-2 text-sm text-slate-600 leading-relaxed flex-1">{area.desc}</p>
                                    </div>
                                </ScrollReveal>
                            );
                        })}
                    </div>

                    <ScrollReveal delay={0.3}>
                        <p className="mt-10 text-center text-slate-600 max-w-2xl mx-auto">
                            We stay up-to-date with the latest techniques to ensure you receive{" "}
                            <span className="text-teal-700 font-semibold">modern, effective treatments</span>.
                        </p>
                    </ScrollReveal>
                </div>
            </section>

            {/* Doctor Spotlight */}
            <section className="py-20 border-t border-slate-200/80 bg-teal-50/30 relative overflow-hidden">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <ScrollReveal>
                        <div className="rounded-3xl border border-slate-200/90 bg-white shadow-md overflow-hidden">
                            <div className="grid md:grid-cols-5 gap-0">
                                {/* Doctor Image / Avatar */}
                                <div className="md:col-span-2 relative min-h-[320px] md:min-h-[440px] bg-gradient-to-br from-teal-100/60 via-slate-50 to-teal-50 flex items-center justify-center overflow-hidden border-b md:border-b-0 md:border-r border-slate-100">
                                    {doctor.image ? (
                                        <img
                                            src={doctor.image}
                                            alt={doctor.name}
                                            className="absolute inset-0 w-full h-full object-cover object-top"
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center p-8 text-center">
                                            <div className="size-28 rounded-full bg-teal-600 text-white flex items-center justify-center text-5xl font-extrabold shadow-xl shadow-teal-600/25 mb-4">
                                                {doctor.name.split(" ").pop()?.[0] || "D"}
                                            </div>
                                            <span className="text-2xl font-extrabold text-slate-900">{doctor.name}</span>
                                            <span className="text-sm text-teal-700 font-semibold mt-1">BDS, RDS (12+ Years Exp.)</span>
                                        </div>
                                    )}
                                </div>

                                {/* Doctor Info */}
                                <div className="md:col-span-3 p-8 sm:p-10 lg:p-12 flex flex-col justify-center">
                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 text-amber-800 text-xs font-bold mb-4 w-fit border border-amber-200 shadow-xs">
                                        <Award className="size-3.5 text-amber-600" />
                                        Lead Dentist
                                    </div>
                                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{doctor.name}</h2>
                                    <p className="text-teal-700 font-semibold text-base mt-1">{doctor.role}</p>

                                    <div className="flex flex-wrap gap-2.5 mt-5">
                                        <span className="px-3.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-700">
                                            {doctor.qualification}
                                        </span>
                                        <span className="px-3.5 py-1.5 rounded-lg bg-teal-50 border border-teal-200 text-sm font-semibold text-teal-800">
                                            {doctor.experience} Experience
                                        </span>
                                    </div>

                                    <div className="mt-6 relative pl-5 border-l-2 border-teal-500">
                                        <Quote className="size-5 text-teal-600 absolute -left-2.5 -top-1 bg-white" />
                                        <p className="text-slate-600 leading-relaxed italic text-sm sm:text-base">
                                            Every patient deserves to be heard, respected, and cared for.
                                            I believe visiting a dentist should never feel stressful — that&apos;s why
                                            I focus on creating a friendly, relaxing experience at every visit.
                                        </p>
                                    </div>

                                    <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-2 gap-4 text-center">
                                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                                            <p className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-teal-800">
                                                5,000+
                                            </p>
                                            <p className="text-xs font-semibold text-slate-600 mt-1 uppercase tracking-wider">Patients Treated</p>
                                        </div>
                                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                                            <p className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-teal-800">
                                                12,000+
                                            </p>
                                            <p className="text-xs font-semibold text-slate-600 mt-1 uppercase tracking-wider">Procedures Done</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="py-20 border-t border-slate-200/80">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <ScrollReveal direction="left">
                            <div>
                                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
                                    Why Choose{" "}
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-teal-800">
                                        Us?
                                    </span>
                                </h2>
                                <p className="mt-4 text-slate-600 leading-relaxed text-base">
                                    We believe the best dental care comes from combining clinical expertise with genuine
                                    compassion. Every detail of our practice is designed around your comfort.
                                </p>
                            </div>
                        </ScrollReveal>

                        <ScrollReveal direction="right">
                            <div className="space-y-3.5">
                                {whyChooseItems.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-start gap-3 rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs hover:border-teal-300 hover:shadow-md hover:bg-teal-50/20 transition-all duration-300 group"
                                    >
                                        <div className="size-8 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center shrink-0 mt-0.5 text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-all duration-300 shadow-xs">
                                            <CheckCircle2 className="size-4" />
                                        </div>
                                        <p className="text-slate-800 font-medium text-sm leading-relaxed group-hover:text-slate-900">{item}</p>
                                    </div>
                                ))}
                            </div>
                        </ScrollReveal>
                    </div>
                </div>
            </section>

            {/* Philosophy */}
            <section className="py-20 border-t border-slate-200/80 bg-gradient-to-b from-teal-50/40 via-background to-background relative overflow-hidden">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <ScrollReveal>
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center size-16 rounded-2xl bg-teal-50 border border-teal-200/80 text-teal-700 shadow-xs mb-6">
                                <Leaf className="size-8" />
                            </div>
                            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                                Our{" "}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-teal-800">
                                    Philosophy
                                </span>
                            </h2>
                            <p className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                                We believe that visiting a dentist should never feel stressful. That&apos;s why we focus on
                                creating a{" "}
                                <span className="text-slate-900 font-semibold">friendly, relaxing experience</span> where
                                every patient feels heard, respected, and cared for.
                            </p>
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            {/* Timeline */}
            <section className="py-20 border-t border-slate-200/80">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <ScrollReveal>
                        <div className="text-center mb-14">
                            <h2 className="text-3xl font-extrabold text-slate-900">
                                Our{" "}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-teal-800">
                                    Journey
                                </span>
                            </h2>
                            <p className="mt-3 text-lg text-slate-600">Milestones that shaped who we are today.</p>
                        </div>
                    </ScrollReveal>

                    <div className="relative">
                        {/* Vertical line */}
                        <div className="absolute left-6 sm:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-teal-500 via-teal-300 to-teal-100" />

                        <div className="space-y-12">
                            {milestones.map((milestone, idx) => (
                                <ScrollReveal key={milestone.year} delay={idx * 0.1}>
                                    <div
                                        className={`relative flex items-start gap-8 ${
                                            idx % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"
                                        }`}
                                    >
                                        {/* Dot */}
                                        <div className="absolute left-6 sm:left-1/2 -translate-x-1/2 size-4 rounded-full bg-teal-600 border-4 border-white z-10 shadow-md" />

                                        {/* Content */}
                                        <div
                                            className={`ml-16 sm:ml-0 sm:w-[calc(50%-2rem)] ${
                                                idx % 2 === 0 ? "sm:pr-8 sm:text-right" : "sm:pl-8 sm:text-left"
                                            }`}
                                        >
                                            <span className="inline-block px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold tracking-wide border border-teal-200 mb-2 shadow-xs">
                                                {milestone.year}
                                            </span>
                                            <h3 className="text-lg font-bold text-slate-900">{milestone.title}</h3>
                                            <p className="text-sm text-slate-600 mt-1 leading-relaxed">{milestone.desc}</p>
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
            <section className="border-t border-slate-200/80 relative overflow-hidden bg-gradient-to-br from-teal-50/80 via-white to-emerald-50/60 py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
                    <ScrollReveal>
                        <div className="inline-flex items-center justify-center size-16 rounded-2xl bg-teal-600 text-white mb-6 mx-auto shadow-lg shadow-teal-600/25">
                            <SmilePlus className="size-8" />
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                            Your Smile Deserves the Best
                        </h2>
                        <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                            Whether you need a routine checkup or advanced dental treatment, we are committed to
                            delivering{" "}
                            <span className="text-slate-900 font-semibold">safe, reliable, and long-lasting results</span>.
                        </p>
                        <div className="mt-8 flex flex-wrap gap-4 justify-center">
                            <a
                                href={`https://wa.me/${clinicInfo.whatsapp}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-teal-600 hover:bg-teal-700 text-white text-lg font-bold rounded-full shadow-lg shadow-teal-600/25 hover:shadow-xl hover:shadow-teal-600/35 transition-all duration-300 active:scale-95"
                            >
                                <Phone className="size-5" />
                                Book Your Visit
                            </a>
                            <Link
                                href="/services"
                                className="inline-flex items-center gap-2 px-8 py-4 border border-slate-300 bg-white text-slate-700 text-lg font-bold rounded-full hover:bg-slate-50 hover:border-teal-400 hover:text-teal-700 shadow-xs transition-all duration-300"
                            >
                                Our Services <ArrowRight className="size-5" />
                            </Link>
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-slate-200/80 bg-white py-10">
                <div className="max-w-5xl mx-auto px-4 text-center">
                    <div className="flex items-center justify-center gap-2 mb-3">
                        <div className="size-8 rounded-full bg-teal-600 flex items-center justify-center text-white font-bold text-xs shadow-md shadow-teal-600/20">
                            E
                        </div>
                        <span className="text-slate-900 font-bold text-base">
                            Elite <span className="text-teal-600">Dental</span> Centre
                        </span>
                    </div>
                    <p className="text-sm text-slate-500">
                        © {new Date().getFullYear()} Elite Dental Centre. All rights reserved.
                    </p>
                    <div className="flex items-center justify-center gap-6 mt-3 text-sm text-slate-600 font-medium">
                        <Link href="/" className="hover:text-teal-600 transition-colors">Home</Link>
                        <span className="text-slate-300">·</span>
                        <Link href="/services" className="hover:text-teal-600 transition-colors">Services</Link>
                        <span className="text-slate-300">·</span>
                        <Link href="/contact" className="hover:text-teal-600 transition-colors">Contact</Link>
                    </div>
                </div>
            </footer>
        </PageTransition>
    );
}
