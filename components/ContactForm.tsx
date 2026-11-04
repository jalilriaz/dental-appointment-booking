"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, Clock, MessageSquare, ChevronDown, Sparkles } from "lucide-react";
import { clinicInfo } from "@/app/constants/mockData";
import Navbar from "@/components/Navbar";
import PageTransition from "@/components/PageTransition";
import ScrollReveal from "@/components/ScrollReveal";

export default function ContactForm({ workingHours }: { workingHours: string }) {
    const faqs = [
        {
            question: "Do I need an appointment or do you accept walk-ins?",
            answer: "We strongly recommend booking an appointment to avoid wait times. However, we do accept walk-in patients depending on our daily schedule and availability.",
        },
        {
            question: "What should I bring to my first dental visit?",
            answer: "Please bring a valid ID, any previous dental records or x-rays if available, and a list of any medications you are currently taking.",
        },
        {
            question: "Do you provide emergency dental services?",
            answer: "Yes, we handle dental emergencies. If you are experiencing severe pain, swelling, or bleeding, please call our clinic immediately or reach out via WhatsApp.",
        },
        {
            question: "What payment methods do you accept?",
            answer: "We accept cash, major credit/debit cards, and bank transfers. We also offer flexible installment plans for extensive treatments like braces or implants.",
        },
    ];

    const [openFaq, setOpenFaq] = useState<number | null>(0);

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <PageTransition>
                {/* Hero Section */}
                <section className="relative py-16 overflow-hidden bg-gradient-to-b from-teal-50/50 via-background to-background">
                    <div className="absolute top-0 right-1/4 w-[500px] h-[300px] bg-teal-100/40 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute bottom-0 left-1/4 w-[400px] h-[300px] bg-emerald-100/30 rounded-full blur-3xl pointer-events-none" />

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
                        <ScrollReveal>
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-50 text-teal-800 text-sm font-semibold mb-4 border border-teal-200 shadow-xs">
                                <Sparkles className="size-4 text-teal-600" />
                                We&apos;re Here to Help
                            </div>

                            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
                                Get in{" "}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-teal-800">
                                    Touch
                                </span>
                            </h1>

                            <p className="mt-4 text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed">
                                We&apos;d love to hear from you. Find quick answers to common questions below or visit Dr. Sheriyaar at our Islamabad clinic.
                            </p>
                        </ScrollReveal>
                    </div>
                </section>

                {/* Main Content Grid */}
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid lg:grid-cols-2 gap-8">
                    {/* FAQ Section */}
                    <ScrollReveal direction="left">
                        <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden h-fit">
                            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/60 flex items-center gap-3">
                                <div className="size-10 rounded-xl bg-teal-100/70 text-teal-700 flex items-center justify-center shrink-0">
                                    <MessageSquare className="size-5" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-slate-900">
                                        Frequently Asked Questions
                                    </h2>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        Quick answers about appointments and visits
                                    </p>
                                </div>
                            </div>

                            <div className="p-6 space-y-3.5">
                                {faqs.map((faq, idx) => {
                                    const isOpen = openFaq === idx;
                                    return (
                                        <div
                                            key={idx}
                                            className={`rounded-xl border transition-all duration-300 overflow-hidden ${
                                                isOpen
                                                    ? "bg-teal-50/50 border-teal-300 shadow-xs"
                                                    : "bg-white border-slate-200/90 hover:border-teal-200 hover:bg-slate-50/40"
                                            }`}
                                        >
                                            <button
                                                onClick={() => setOpenFaq(isOpen ? null : idx)}
                                                className="w-full flex items-center justify-between p-4 text-left focus:outline-none cursor-pointer group"
                                            >
                                                <span
                                                    className={`font-semibold text-sm transition-colors pr-2 ${
                                                        isOpen ? "text-teal-900 font-bold" : "text-slate-800 group-hover:text-teal-700"
                                                    }`}
                                                >
                                                    {faq.question}
                                                </span>
                                                <div
                                                    className={`shrink-0 size-7 rounded-full flex items-center justify-center transition-all duration-300 ${
                                                        isOpen
                                                            ? "bg-teal-600 text-white rotate-180 shadow-xs"
                                                            : "bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-700"
                                                    }`}
                                                >
                                                    <ChevronDown className="size-4" />
                                                </div>
                                            </button>

                                            <div
                                                className={`px-4 overflow-hidden transition-all duration-300 ease-in-out ${
                                                    isOpen ? "max-h-48 pb-4 opacity-100" : "max-h-0 opacity-0"
                                                }`}
                                            >
                                                <p className="text-sm text-slate-600 leading-relaxed pt-2 border-t border-teal-100/80">
                                                    {faq.answer}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </ScrollReveal>

                    {/* Contact Info & WhatsApp Section */}
                    <ScrollReveal direction="right">
                        <div className="space-y-6">
                            {/* Clinic Information Card */}
                            <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs p-6 sm:p-7 space-y-6">
                                <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                                    <div className="size-10 rounded-xl bg-teal-100/70 text-teal-700 flex items-center justify-center shrink-0">
                                        <MapPin className="size-5" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-slate-900">
                                            Clinic Details
                                        </h2>
                                        <p className="text-xs text-slate-500 mt-0.5">
                                            Visit us or connect directly
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-5">
                                    {/* Address */}
                                    <div className="flex items-start gap-4 group">
                                        <div className="size-11 rounded-2xl bg-teal-50 border border-teal-100 text-teal-700 flex items-center justify-center shrink-0 shadow-xs group-hover:bg-teal-600 group-hover:text-white transition-all duration-300">
                                            <MapPin className="size-5" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-xs font-semibold uppercase tracking-wider text-teal-700">
                                                Address
                                            </h3>
                                            <a
                                                href={clinicInfo.mapUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-slate-900 font-semibold text-sm sm:text-base leading-snug mt-0.5 block hover:text-teal-700 transition-colors"
                                            >
                                                {clinicInfo.address}
                                            </a>
                                        </div>
                                    </div>

                                    {/* Phone */}
                                    <div className="flex items-start gap-4 group">
                                        <div className="size-11 rounded-2xl bg-teal-50 border border-teal-100 text-teal-700 flex items-center justify-center shrink-0 shadow-xs group-hover:bg-teal-600 group-hover:text-white transition-all duration-300">
                                            <Phone className="size-5" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-xs font-semibold uppercase tracking-wider text-teal-700">
                                                Phone Number
                                            </h3>
                                            <a
                                                href={`tel:${clinicInfo.phone}`}
                                                className="text-slate-900 font-semibold text-sm sm:text-base leading-snug mt-0.5 block hover:text-teal-700 transition-colors"
                                            >
                                                {clinicInfo.phone}
                                            </a>
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div className="flex items-start gap-4 group">
                                        <div className="size-11 rounded-2xl bg-teal-50 border border-teal-100 text-teal-700 flex items-center justify-center shrink-0 shadow-xs group-hover:bg-teal-600 group-hover:text-white transition-all duration-300">
                                            <Mail className="size-5" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-xs font-semibold uppercase tracking-wider text-teal-700">
                                                Email Address
                                            </h3>
                                            <a
                                                href={`mailto:${clinicInfo.email}`}
                                                className="text-slate-900 font-semibold text-sm sm:text-base leading-snug mt-0.5 block hover:text-teal-700 transition-colors"
                                            >
                                                {clinicInfo.email}
                                            </a>
                                        </div>
                                    </div>

                                    {/* Working Hours */}
                                    <div className="flex items-start gap-4 group pt-2 border-t border-slate-100">
                                        <div className="size-11 rounded-2xl bg-teal-50 border border-teal-100 text-teal-700 flex items-center justify-center shrink-0 shadow-xs group-hover:bg-teal-600 group-hover:text-white transition-all duration-300">
                                            <Clock className="size-5" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-xs font-semibold uppercase tracking-wider text-teal-700">
                                                Working Hours
                                            </h3>
                                            <p className="text-slate-900 font-semibold text-sm sm:text-base leading-snug mt-0.5">
                                                {workingHours}
                                            </p>
                                            <div className="mt-2">
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
                                                    <span className="size-1.5 rounded-full bg-rose-500" />
                                                    {clinicInfo.sundayHours}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* WhatsApp Direct Action Card */}
                            <div className="rounded-2xl border-2 border-teal-500/20 bg-gradient-to-br from-teal-50/70 via-white to-emerald-50/60 shadow-xs p-6 sm:p-7 text-center relative overflow-hidden">
                                <div className="size-14 mx-auto rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-lg shadow-teal-600/25 mb-4">
                                    <Phone className="size-6" />
                                </div>

                                <h3 className="text-xl font-extrabold text-slate-900">
                                    Instant WhatsApp Support
                                </h3>

                                <p className="text-sm text-slate-600 mt-2 mb-6 max-w-sm mx-auto leading-relaxed">
                                    Have an urgent question or want to book an appointment with Dr. Sheriyaar? Chat directly on WhatsApp.
                                </p>

                                <a
                                    href={`https://wa.me/${clinicInfo.whatsapp}?text=${encodeURIComponent("Hi, I have an inquiry about Elite Dental Centre")}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-base rounded-full shadow-lg shadow-teal-600/25 hover:shadow-xl hover:shadow-teal-600/35 transition-all duration-300 active:scale-95"
                                >
                                    <Phone className="size-5" />
                                    Chat on WhatsApp
                                </a>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </PageTransition>
        </div>
    );
}
