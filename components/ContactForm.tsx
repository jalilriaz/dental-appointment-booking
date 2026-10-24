"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, Clock, MessageSquare } from "lucide-react";
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
                <section className="relative py-16 overflow-hidden">
                    <div className="absolute inset-0 gradient-primary opacity-10" />
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-teal-500/10 rounded-full blur-3xl" />
                    <div className="max-w-7xl mx-auto px-4 text-center relative">
                        <ScrollReveal>
                            <h1 className="text-4xl font-bold text-white">Contact Us</h1>
                            <p className="mt-3 text-slate-400 text-lg">We&apos;d love to hear from you. Find answers below or visit our clinic.</p>
                        </ScrollReveal>
                    </div>
                </section>

                <div className="max-w-6xl mx-auto px-4 py-12 grid lg:grid-cols-2 gap-10">
                    {/* FAQ Section */}
                    <ScrollReveal direction="left">
                        <div className="glass-card rounded-2xl overflow-hidden h-fit">
                            <div className="px-6 py-5 border-b border-white/[0.06]">
                                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                                    <MessageSquare className="size-5 text-teal-400" />
                                    Frequently Asked Questions
                                </h2>
                            </div>
                            <div className="p-6 space-y-3">
                                {faqs.map((faq, idx) => {
                                    const isOpen = openFaq === idx;
                                    return (
                                        <div
                                            key={idx}
                                            className={`rounded-xl border transition-all duration-300 overflow-hidden ${isOpen
                                                ? "bg-teal-500/5 border-teal-500/30"
                                                : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]"
                                                }`}
                                        >
                                            <button
                                                onClick={() => setOpenFaq(isOpen ? null : idx)}
                                                className="w-full flex items-center justify-between p-4 text-left focus:outline-none"
                                            >
                                                <span className={`font-medium text-sm transition-colors ${isOpen ? "text-teal-400" : "text-slate-200"}`}>
                                                    {faq.question}
                                                </span>
                                                <div className={`shrink-0 ml-4 size-6 rounded-full flex items-center justify-center transition-transform duration-300 ${isOpen ? "bg-teal-500/20 rotate-180 text-teal-400" : "bg-white/[0.05] text-slate-400"}`}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                                </div>
                                            </button>
                                            <div
                                                className={`px-4 overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-40 pb-4 opacity-100" : "max-h-0 opacity-0"
                                                    }`}
                                            >
                                                <p className="text-sm text-slate-400 leading-relaxed">
                                                    {faq.answer}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </ScrollReveal>

                    {/* Contact Info */}
                    <ScrollReveal direction="right">
                        <div className="space-y-6">
                            <div className="glass-card rounded-2xl p-6 space-y-6">
                                {[
                                    { icon: MapPin, label: "Address", value: clinicInfo.address },
                                    { icon: Phone, label: "Phone", value: clinicInfo.phone },
                                    { icon: Mail, label: "Email", value: clinicInfo.email },
                                ].map((item, idx) => (
                                    <ScrollReveal key={item.label} delay={0.1 + idx * 0.1} direction="none">
                                        <div className="flex items-start gap-4">
                                            <div className="size-12 rounded-full bg-teal-500/10 flex items-center justify-center shrink-0">
                                                <item.icon className="size-5 text-teal-400" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-white">{item.label}</h3>
                                                <p className="text-sm text-slate-400 mt-1">{item.value}</p>
                                            </div>
                                        </div>
                                    </ScrollReveal>
                                ))}
                                <ScrollReveal delay={0.4} direction="none">
                                    <div className="flex items-start gap-4">
                                        <div className="size-12 rounded-full bg-teal-500/10 flex items-center justify-center shrink-0">
                                            <Clock className="size-5 text-teal-400" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-white">Working Hours</h3>
                                            <p className="text-sm text-slate-400 mt-1">{workingHours}</p>
                                            <p className="text-sm text-slate-400">{clinicInfo.sundayHours}</p>
                                        </div>
                                    </div>
                                </ScrollReveal>
                            </div>

                            <ScrollReveal delay={0.3}>
                                <div className="glass-card rounded-2xl p-6 text-center glow-border-teal">
                                    <h3 className="font-semibold text-white">Quick Contact via WhatsApp</h3>
                                    <p className="text-sm text-teal-400 mt-1 mb-4">Get instant replies on WhatsApp</p>
                                    <a
                                        href={`https://wa.me/${clinicInfo.whatsapp}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-6 py-3 btn-brand rounded-full font-medium transition-premium active:scale-95"
                                    >
                                        <Phone className="size-4" />
                                        Chat on WhatsApp
                                    </a>
                                </div>
                            </ScrollReveal>
                        </div>
                    </ScrollReveal>
                </div>
            </PageTransition>
        </div>
    );
}
