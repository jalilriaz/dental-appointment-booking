"use client";

import React, { useState, useEffect } from "react";
import {
  LocationOnOutlined,
  AccessTimeOutlined,
  PhoneOutlined,
  PhoneInTalkOutlined,
  WhatsApp,
  NearMeOutlined,
  CheckCircleOutlined,
  MedicalServicesOutlined,
  CreditCardOutlined,
  AssignmentOutlined,
  DirectionsCarOutlined,
  ElevatorOutlined,
  ContentCopyOutlined,
  CheckOutlined,
  SendOutlined,
  ShieldOutlined,
  FlashOnOutlined,
  SupportAgentOutlined,
} from "@mui/icons-material";
import { clinicInfo } from "@/app/constants/mockData";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FaqSection from "@/components/FaqSection";
import ContactHero from "@/components/ContactHero";
import AppointmentCtaBanner from "@/components/AppointmentCtaBanner";
import type { Treatment } from "@/lib/types";

interface ContactFormProps {
  workingHours: string;
  treatments: Treatment[];
}

const QUICK_SYMPTOMS = [
  { id: "toothache", label: "Acute Tooth Pain / Emergency", category: "Emergency" },
  { id: "implant", label: "Dental Implants (Missing Tooth)", category: "Surgical" },
  { id: "aligners", label: "Clear Aligners & Invisible Braces", category: "Orthodontics" },
  { id: "veneers", label: "Porcelain Veneers & Smile Makeover", category: "Cosmetic" },
  { id: "whitening", label: "Laser Teeth Whitening", category: "Cosmetic" },
  { id: "rct", label: "Root Canal Treatment", category: "Restorative" },
  { id: "scaling", label: "Ultrasonic Scaling & Polishing", category: "Preventive" },
  { id: "wisdom", label: "Wisdom Tooth Extraction", category: "Oral Surgery" },
];

export default function ContactForm({ workingHours, treatments }: ContactFormProps) {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [selectedSymptom, setSelectedSymptom] = useState<string>("Acute Tooth Pain / Emergency");
  const [urgency, setUrgency] = useState<"urgent" | "soon" | "flexible">("urgent");
  const [contactMethod, setContactMethod] = useState<"whatsapp" | "phone">("whatsapp");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [copied, setCopied] = useState(false);
  const [isOpenNow, setIsOpenNow] = useState(true);

  // Check live clinic open status in Pakistan Time (UTC+5)
  useEffect(() => {
    try {
      const now = new Date();
      const pktFormatter = new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Karachi",
        hour: "numeric",
        hour12: false,
        weekday: "short",
      });
      const parts = pktFormatter.formatToParts(now);
      const hourPart = parts.find((p) => p.type === "hour");
      const weekdayPart = parts.find((p) => p.type === "weekday");

      const currentHour = hourPart ? parseInt(hourPart.value, 10) : 14;
      const currentDay = weekdayPart ? weekdayPart.value : "Mon";

      // Mon-Sat: 12:00 to 20:00 (8:00 PM)
      const isWorkingDay = currentDay !== "Sun";
      const isWorkingHour = currentHour >= 12 && currentHour < 20;

      setIsOpenNow(isWorkingDay && isWorkingHour);
    } catch {
      setIsOpenNow(true);
    }
  }, []);

  const handleCopyAddress = () => {
    const fullAddress = `Office #6, 1st Floor, Doctors Plaza, 6 Markaz Rd, Next to Islamabad Diagnostic Centre (IDC), G-8 Markaz, G-8/2, Islamabad, 44220`;
    navigator.clipboard.writeText(fullAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  const contactFaqs = [
    {
      question: "How do I reach Elite Dental Centre in G-8 Markaz, Islamabad?",
      answer:
        "We are located at Office #6, 1st Floor, Doctors Plaza, 6 Markaz Rd, directly next to Islamabad Diagnostic Centre (IDC), G-8 Markaz, Islamabad. Elevator access is available directly from the lobby, with ample street and plaza parking.",
      icon: LocationOnOutlined,
    },
    {
      question: "Do you provide same-day emergency dental appointments in Islamabad?",
      answer:
        "Yes, Dr. Sheriyaar reserves daily priority slots for acute toothache, broken crowns, dental abscesses, or facial trauma. Please call our emergency hotline (+92 314 5475528) or WhatsApp us immediately for urgent triage.",
      icon: MedicalServicesOutlined,
    },
    {
      question: "What should I bring for my first clinical consultation?",
      answer:
        "Please bring any prior dental records, recent OPG x-rays if available, and a list of current medications or allergies so our clinical team can tailor a safe and comprehensive treatment plan.",
      icon: AssignmentOutlined,
    },
    {
      question: "Are installment payment plans available for orthodontic or surgical procedures?",
      answer:
        "Yes! We offer flexible, milestone-based 0% interest installment plans for clear aligners, ceramic/metal braces, and multi-stage dental implant rehabilitations.",
      icon: CreditCardOutlined,
    },
    {
      question: "Is elevator and wheelchair accessibility available for elderly or injured patients?",
      answer:
        "Yes, our building features step-free street access with a modern elevator directly serving our 2nd-floor surgical suites. Wheelchair assistance can be requested at reception upon arrival.",
      icon: ElevatorOutlined,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      {/* 1. Vector Hero: "Simple Steps to a Healthier Smile" */}
      <ContactHero />

      {/* 2. Omnichannel Immediate Action Cards */}
      <section className="relative -mt-8 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {/* Card 1: Emergency Dental Hotline */}
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-lg shadow-teal-950/5 hover:shadow-xl hover:shadow-teal-900/10 hover:border-teal-400/80 transition-all duration-300 relative overflow-hidden flex flex-col justify-between group">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-teal-500 to-teal-700" />
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold tracking-wider uppercase bg-teal-50 text-teal-800 border border-teal-200/80">
                  <FlashOnOutlined sx={{ fontSize: 13, color: "#0d9488" }} />
                  Priority Emergency
                </span>
                <div className="size-11 rounded-2xl bg-teal-50 border border-teal-200/60 text-teal-700 flex items-center justify-center group-hover:scale-105 group-hover:bg-teal-600 group-hover:text-white transition-all">
                  <PhoneInTalkOutlined sx={{ fontSize: 22 }} />
                </div>
              </div>
              <h3 className="text-lg font-black text-[#0B1528] tracking-tight">Acute Toothache & Trauma</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Same-day priority emergency slot with Dr. Sheriyaar. Relief for severe nerve pain, cracked teeth, or swelling.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100">
              <a
                href={`tel:${clinicInfo.phone}`}
                className="w-full h-11 inline-flex items-center justify-center gap-2 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs uppercase tracking-wider shadow-md shadow-teal-600/20 active:scale-[0.98] transition-all cursor-pointer"
              >
                <PhoneOutlined sx={{ fontSize: 16 }} />
                <span>Call Emergency Line: {clinicInfo.phone}</span>
              </a>
              <p className="text-[11px] text-center text-slate-400 font-medium mt-2.5">
                Fastest clinical response • Immediate advice
              </p>
            </div>
          </div>

          {/* Card 2: WhatsApp Visual Photo Triage */}
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-lg shadow-teal-950/5 hover:shadow-xl hover:shadow-teal-900/10 hover:border-teal-400/80 transition-all duration-300 relative overflow-hidden flex flex-col justify-between group">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-teal-500 to-teal-700" />
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold tracking-wider uppercase bg-teal-50 text-teal-800 border border-teal-200/80">
                  <WhatsApp sx={{ fontSize: 13, color: "#0d9488" }} />
                  Instant Consultation
                </span>
                <div className="size-11 rounded-2xl bg-teal-50 border border-teal-200/60 text-teal-700 flex items-center justify-center group-hover:scale-105 group-hover:bg-teal-600 group-hover:text-white transition-all">
                  <WhatsApp sx={{ fontSize: 22 }} />
                </div>
              </div>
              <h3 className="text-lg font-black text-[#0B1528] tracking-tight">WhatsApp Photo Triage</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Send a photo or x-ray of your tooth to our clinical receptionist for instant preliminary guidance and cost estimates.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100">
              <a
                href={`https://wa.me/${clinicInfo.whatsapp}?text=Hello%20Dr.%20Sheriyaar%20team,%20I%20would%20like%20to%20inquire%20about%20a%20dental%20consultation.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-11 inline-flex items-center justify-center gap-2 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs uppercase tracking-wider shadow-md shadow-teal-600/20 active:scale-[0.98] transition-all cursor-pointer"
              >
                <WhatsApp sx={{ fontSize: 17 }} />
                <span>Chat on WhatsApp</span>
              </a>
              <p className="text-[11px] text-center text-slate-400 font-medium mt-2.5">
                Typical reply time: 5 - 15 minutes
              </p>
            </div>
          </div>

          {/* Card 3: Physical Clinic & Live Hours */}
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-lg shadow-teal-950/5 hover:shadow-xl hover:shadow-teal-900/10 hover:border-teal-400/80 transition-all duration-300 relative overflow-hidden flex flex-col justify-between group">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-teal-600 to-[#0B1528]" />
            <div>
              <div className="flex items-center justify-between mb-4">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold tracking-wider uppercase border ${
                    isOpenNow
                      ? "bg-teal-50 text-teal-800 border-teal-200/80"
                      : "bg-slate-100 text-slate-700 border-slate-200"
                  }`}
                >
                  <span className={`size-2 rounded-full ${isOpenNow ? "bg-teal-500 animate-pulse" : "bg-slate-400"}`} />
                  {isOpenNow ? "Clinic Open Now" : "Currently Closed"}
                </span>
                <div className="size-11 rounded-2xl bg-teal-50 border border-teal-200/60 text-teal-700 flex items-center justify-center group-hover:scale-105 group-hover:bg-[#0B1528] group-hover:text-white transition-all">
                  <LocationOnOutlined sx={{ fontSize: 22 }} />
                </div>
              </div>
              <h3 className="text-lg font-black text-[#0B1528] tracking-tight">G-8 Markaz Clinic</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Doctors Plaza, 1st Floor, Office #6 (Next to IDC). Operating hours: {workingHours || "12:00 PM - 8:00 PM (Mon-Sat)"}.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100">
              <a
                href="https://www.google.com/maps/search/?api=1&query=Elite+Dental+%26+Aesthetic+Centre+G-8+Markaz+Islamabad"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-11 inline-flex items-center justify-center gap-2 px-4 rounded-xl bg-[#0B1528] hover:bg-slate-800 text-white font-extrabold text-xs uppercase tracking-wider shadow-md shadow-slate-900/15 active:scale-[0.98] transition-all cursor-pointer"
              >
                <NearMeOutlined sx={{ fontSize: 16, color: "#2dd4bf" }} />
                <span>Open in Google Maps</span>
              </a>
              <p className="text-[11px] text-center text-slate-400 font-medium mt-2.5">
                Elevator access • Front plaza parking
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Main Interactive Grid: Landmark & Wayfinding Hub + Smart Triage Form */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Landmark & Accessibility Wayfinding */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-7 sm:p-8 shadow-sm">
              <div className="flex items-center gap-2 text-teal-600 text-xs font-bold uppercase tracking-wider mb-2">
                <LocationOnOutlined sx={{ fontSize: 16 }} />
                <span>Arrival & Wayfinding</span>
              </div>
              <h2 className="text-2xl font-black text-slate-950 tracking-tight">
                Visiting Our Clinic
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                Centrally located in Islamabad&apos;s G-8 Markaz at Doctors Plaza, right next to Islamabad Diagnostic Centre (IDC).
              </p>

              {/* Wayfinding Feature List */}
              <div className="mt-6 space-y-4">
                {/* Landmark 1 */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3.5">
                  <div className="p-2 rounded-xl bg-teal-50 text-teal-700 shrink-0 mt-0.5">
                    <LocationOnOutlined sx={{ fontSize: 20, color: "#0d9488" }} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
                      Prominent Landmark
                    </h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Located in <strong>Doctors Plaza (1st Floor, Office #6)</strong> on 6 Markaz Rd, directly adjacent to <strong>Islamabad Diagnostic Centre (IDC)</strong>.
                    </p>
                  </div>
                </div>

                {/* Landmark 2 */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3.5">
                  <div className="p-2 rounded-xl bg-teal-50 text-teal-700 shrink-0 mt-0.5">
                    <ElevatorOutlined sx={{ fontSize: 20, color: "#0d9488" }} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
                      2nd Floor with Full Elevator Access
                    </h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      High-capacity elevator straight from ground lobby to 2nd-floor reception. Zero steps required; ideal for elderly, mobility-impaired, or post-surgical patients.
                    </p>
                  </div>
                </div>

                {/* Landmark 3 */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3.5">
                  <div className="p-2 rounded-xl bg-teal-50 text-teal-700 shrink-0 mt-0.5">
                    <DirectionsCarOutlined sx={{ fontSize: 20, color: "#0d9488" }} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
                      Patient Parking Bay
                    </h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Dedicated plaza frontage parking right in front of the building entrance, plus surrounding multi-bay parking with on-site security guards.
                    </p>
                  </div>
                </div>

                {/* Landmark 4 */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3.5">
                  <div className="p-2 rounded-xl bg-teal-50 text-teal-700 shrink-0 mt-0.5">
                    <NearMeOutlined sx={{ fontSize: 20, color: "#0d9488" }} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
                      Uber / Careem / Rideshare Drop-Off
                    </h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Set destination to &ldquo;Doctors Plaza G-8 Markaz&rdquo; or &ldquo;Islamabad Diagnostic Centre (IDC) G-8&rdquo;. Drop-off is right at the building entrance.
                    </p>
                  </div>
                </div>
              </div>

              {/* Address Strip & Action Buttons */}
              <div className="mt-6 pt-6 border-t border-slate-100">
                <div className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-100/80 border border-slate-200">
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                      Official Clinic Address
                    </p>
                    <p className="text-xs font-semibold text-slate-800 truncate mt-0.5">
                      {clinicInfo.address}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyAddress}
                    className="shrink-0 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-teal-700 hover:border-teal-300 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <CheckOutlined sx={{ fontSize: 14, color: "#059669" }} />
                        <span className="text-emerald-700">Copied</span>
                      </>
                    ) : (
                      <>
                        <ContentCopyOutlined sx={{ fontSize: 14 }} />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-3">
                  <a
                    href="https://www.google.com/maps/dir/?api=1&destination=Elite+Dental+%26+Aesthetic+Centre+G-8+Markaz+Islamabad"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs text-center flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                  >
                    <NearMeOutlined sx={{ fontSize: 16 }} />
                    <span>Google Maps</span>
                  </a>
                  <a
                    href="https://maps.apple.com/?daddr=33.6922,73.0423"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs text-center flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                  >
                    <LocationOnOutlined sx={{ fontSize: 16 }} />
                    <span>Apple Maps</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Smart Clinical Inquiry & Consultation Dispatcher */}
          <div className="lg:col-span-7 space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-7 sm:p-10 shadow-sm relative">
              <div className="flex items-center gap-2 text-teal-600 text-xs font-bold uppercase tracking-wider mb-2">
                <SupportAgentOutlined sx={{ fontSize: 16 }} />
                <span>Clinical Reception Dispatcher</span>
              </div>
              <h2 className="text-2xl font-black text-slate-950 tracking-tight">
                Send an Inquiry to Dr. Sheriyaar
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                Tell us about your dental concern or preferred appointment date. Our senior clinical coordinator responds promptly.
              </p>

              {formSubmitted ? (
                <div className="mt-8 p-8 rounded-2xl bg-teal-50/70 border border-teal-200 text-center animate-fade-in">
                  <div className="size-16 rounded-full bg-teal-600 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-teal-600/30">
                    <CheckCircleOutlined sx={{ fontSize: 36 }} />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">
                    Inquiry Received Successfully!
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-md mx-auto leading-relaxed">
                    Thank you, <strong>{fullName || "valued patient"}</strong>. Dr. Sheriyaar&apos;s receptionist has logged your concern for <strong>{selectedSymptom}</strong>. We will reach out to you via {contactMethod === "whatsapp" ? "WhatsApp" : "telephone"} at <strong>{phone}</strong> within 2 business hours.
                  </p>

                  <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <a
                      href={`https://wa.me/${clinicInfo.whatsapp}?text=Hello%20Dr.%20Sheriyaar,%20I%20just%20submitted%20an%20inquiry%20regarding%20${encodeURIComponent(
                        selectedSymptom
                      )}.%20My%20name%20is%20${encodeURIComponent(fullName || "a patient")}.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <WhatsApp sx={{ fontSize: 16 }} />
                      <span>Follow-up on WhatsApp</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        setFormSubmitted(false);
                        setFullName("");
                        setPhone("");
                        setNotes("");
                      }}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Send Another Inquiry
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                  {/* Step 1: Quick Symptom Chips */}
                  <div>
                    <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2.5">
                      1. Select Your Primary Concern or Treatment
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {QUICK_SYMPTOMS.map((item) => {
                        const isSelected = selectedSymptom === item.label;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setSelectedSymptom(item.label)}
                            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 border ${
                              isSelected
                                ? "bg-teal-600 text-white border-teal-600 shadow-sm shadow-teal-600/30 scale-102"
                                : "bg-slate-50 text-slate-700 border-slate-200 hover:border-teal-300 hover:bg-teal-50/40"
                            }`}
                          >
                            <span>{item.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Step 2: Urgency Level */}
                  <div>
                    <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2">
                      2. How Soon Do You Need Care?
                    </label>
                    <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
                      <button
                        type="button"
                        onClick={() => setUrgency("urgent")}
                        className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                          urgency === "urgent"
                            ? "border-rose-500 bg-rose-50/60 text-rose-900 font-bold shadow-xs"
                            : "border-slate-200 bg-slate-50/50 text-slate-600 hover:border-slate-300 font-medium"
                        }`}
                      >
                        <span className="text-xs block">Immediate / Today</span>
                        <span className="text-[10px] text-slate-500 block mt-0.5">Emergency slot</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setUrgency("soon")}
                        className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                          urgency === "soon"
                            ? "border-teal-600 bg-teal-50/60 text-teal-900 font-bold shadow-xs"
                            : "border-slate-200 bg-slate-50/50 text-slate-600 hover:border-slate-300 font-medium"
                        }`}
                      >
                        <span className="text-xs block">Within 48 Hours</span>
                        <span className="text-[10px] text-slate-500 block mt-0.5">Next available</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setUrgency("flexible")}
                        className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                          urgency === "flexible"
                            ? "border-teal-600 bg-teal-50/60 text-teal-900 font-bold shadow-xs"
                            : "border-slate-200 bg-slate-50/50 text-slate-600 hover:border-slate-300 font-medium"
                        }`}
                      >
                        <span className="text-xs block">Flexible</span>
                        <span className="text-[10px] text-slate-500 block mt-0.5">Planning ahead</span>
                      </button>
                    </div>
                  </div>

                  {/* Step 3: Contact Inputs */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                        Your Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        required
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Tariq Khan"
                        className="w-full mt-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-teal-600 bg-slate-50/50"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                        Phone or WhatsApp Number <span className="text-rose-500">*</span>
                      </label>
                      <input
                        required
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="0300 1234567"
                        className="w-full mt-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-teal-600 bg-slate-50/50"
                      />
                    </div>
                  </div>

                  {/* Preferred Reply Method */}
                  <div>
                    <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2">
                      Preferred Reply Channel
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                        <input
                          type="radio"
                          name="channel"
                          checked={contactMethod === "whatsapp"}
                          onChange={() => setContactMethod("whatsapp")}
                          className="accent-teal-600"
                        />
                        <span>WhatsApp Message (Recommended)</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                        <input
                          type="radio"
                          name="channel"
                          checked={contactMethod === "phone"}
                          onChange={() => setContactMethod("phone")}
                          className="accent-teal-600"
                        />
                        <span>Direct Telephone Call</span>
                      </label>
                    </div>
                  </div>

                  {/* Notes / Symptoms Details */}
                  <div>
                    <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                      Specific Symptoms or Questions (Optional)
                    </label>
                    <textarea
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. Sharp pain when drinking cold water on lower right molar..."
                      className="w-full mt-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-teal-600 bg-slate-50/50 resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-black text-xs uppercase tracking-wider transition-all duration-200 shadow-lg shadow-teal-600/25 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <SendOutlined sx={{ fontSize: 16 }} />
                    <span>Submit Inquiry for Immediate Review</span>
                  </button>

                  {/* Trust Micro-bar */}
                  <div className="pt-2 flex flex-wrap items-center justify-center gap-6 text-[11px] text-slate-500 font-medium">
                    <span className="flex items-center gap-1.5">
                      <ShieldOutlined sx={{ fontSize: 14, color: "#0d9488" }} />
                      Strict Medical Confidentiality
                    </span>
                    <span className="flex items-center gap-1.5">
                      <CheckCircleOutlined sx={{ fontSize: 14, color: "#0d9488" }} />
                      Direct Lead Surgeon Oversight
                    </span>
                    <span className="flex items-center gap-1.5">
                      <AccessTimeOutlined sx={{ fontSize: 14, color: "#0d9488" }} />
                      Response Within 2 Hours
                    </span>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 4. DEDICATED FULL-WIDTH INTERACTIVE GOOGLE MAP NAVIGATOR */}
      <section className="w-full bg-white border-y border-slate-200 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold tracking-wider uppercase mb-3">
                <LocationOnOutlined sx={{ fontSize: 16, color: "#0d9488" }} />
                <span>Interactive Geographic Location</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
                Find Elite Dental Centre on Google Maps
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
                Doctors Plaza, 1st Floor, Office #6, 6 Markaz Rd, next to Islamabad Diagnostic Centre (IDC), G-8 Markaz, Islamabad. Use the interactive map below to plan your driving route.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <a
                href="https://www.google.com/maps/dir/?api=1&destination=Elite+Dental+%26+Aesthetic+Centre+G-8+Markaz+Islamabad"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-sm transition-all"
              >
                <NearMeOutlined sx={{ fontSize: 16 }} />
                <span>Get Driving Directions</span>
              </a>
              <button
                type="button"
                onClick={handleCopyAddress}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copied ? <CheckOutlined sx={{ fontSize: 15, color: "#059669" }} /> : <ContentCopyOutlined sx={{ fontSize: 15 }} />}
                <span>{copied ? "Copied" : "Copy Address"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Full-Width Map Window with Custom Floating Clinical Card */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative w-full rounded-3xl overflow-hidden border-2 border-slate-200/90 shadow-xl bg-slate-100">
            {/* Top Toolbar */}
            <div className="px-6 py-3.5 bg-slate-950 text-white flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <span className="size-2.5 rounded-full bg-teal-400 animate-ping" />
                <span className="size-2.5 rounded-full bg-teal-400 -ml-5" />
                <span className="text-xs font-black uppercase tracking-wider text-white">
                  Live Clinic Wayfinding Hub • G-8 Markaz Islamabad
                </span>
              </div>
              <div className="text-[11px] text-slate-400 flex items-center gap-4">
                <span>GPS Coordinates: 33.6922° N, 73.0423° E</span>
                <span className="hidden sm:inline text-teal-300 font-semibold">• 1st Floor, Doctors Plaza</span>
              </div>
            </div>

            {/* Embedded Full-Width Google Map */}
            <div className="relative w-full h-[460px] sm:h-[540px]">
              <iframe
                title="Elite Dental & Aesthetic Centre Islamabad - Full Width Map"
                src="https://maps.google.com/maps?q=Elite+Dental+%26+Aesthetic+Centre,+G-8+Markaz,+Islamabad&t=&z=16&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />

              {/* Floating Clinical Location Pill (Bottom-Left) */}
              <div className="absolute bottom-5 left-5 z-10 max-w-xs sm:max-w-sm rounded-2xl bg-white/95 backdrop-blur-md p-4 sm:p-5 shadow-2xl border border-slate-200 text-slate-900 pointer-events-auto">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-teal-600 text-white shrink-0 mt-0.5 shadow-md shadow-teal-600/30">
                    <LocationOnOutlined sx={{ fontSize: 22 }} />
                  </div>
                  <div>
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-teal-50 text-teal-800 border border-teal-200 mb-1">
                      Lead Surgeon Dr. Sheriyaar
                    </span>
                    <h4 className="text-sm font-black text-slate-950 tracking-tight">
                      Elite Dental Centre
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed font-medium">
                      Office #6, 1st Floor, Doctors Plaza, next to Islamabad Diagnostic Centre (IDC), G-8 Markaz.
                    </p>
                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center gap-2">
                      <a
                        href="https://www.google.com/maps/dir/?api=1&destination=Elite+Dental+%26+Aesthetic+Centre+G-8+Markaz+Islamabad"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1"
                      >
                        <NearMeOutlined sx={{ fontSize: 14 }} />
                        <span>Open Directions</span>
                      </a>
                      <span className="text-slate-300">•</span>
                      <a
                        href={`tel:${clinicInfo.phone}`}
                        className="text-xs font-bold text-slate-700 hover:text-teal-700 flex items-center gap-1"
                      >
                        <PhoneOutlined sx={{ fontSize: 13 }} />
                        <span>Call Reception</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Status Ribbon */}
            <div className="px-6 py-2.5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between text-[11px] text-slate-600">
              <span className="flex items-center gap-1.5">
                <ElevatorOutlined sx={{ fontSize: 14, color: "#0d9488" }} />
                Step-free wheelchair & stretcher access via main lobby elevator
              </span>
              <span className="flex items-center gap-1.5">
                <DirectionsCarOutlined sx={{ fontSize: 14, color: "#0d9488" }} />
                Complimentary plaza parking for registered patients
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Unified FAQ Section */}
      <section className="bg-white border-t border-slate-200">
        <FaqSection
          kicker="Help & Directions"
          title="Frequently asked questions"
          subtitle="Everything you need to know about reaching our G-8 Markaz facility, parking, emergency slots, and appointments."
          items={contactFaqs}
        />
      </section>

      {/* 6. Booking Banner with Modal Booking Flow */}
      <AppointmentCtaBanner treatments={treatments} />

      <Footer />
    </div>
  );
}
