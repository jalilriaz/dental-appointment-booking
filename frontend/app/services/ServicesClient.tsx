"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AccessTimeOutlined,
  ChevronRightOutlined,
  AutoAwesomeOutlined,
  SearchOutlined,
  CheckCircleOutlined,
  CalendarMonthOutlined,
  WhatsApp,
  HelpOutlineOutlined,
  WorkspacePremiumOutlined,
  AssignmentOutlined,
  PeopleOutlined,
  BiotechOutlined,
  SecurityOutlined,
  VerifiedOutlined,
  ContactSupportOutlined,
  FlashOnOutlined,
  AutoFixHighOutlined,
  CreditCardOutlined,
  ReceiptLongOutlined,
  AccountBalanceOutlined,
  LocalAtmOutlined,
  SentimentSatisfiedAltOutlined,
  Close,
} from "@mui/icons-material";
import { clinicInfo } from "@/app/constants/mockData";
import { formatPKR, formatPriceRange, getTreatmentImage } from "@/lib/utils";
import BookingForm from "@/components/BookingForm";

function ToothIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C8.5 2 6 4.5 6 7.5C6 9.5 6.8 11.2 7.2 13C7.8 15.5 8.2 18.5 9 21.5C9.3 22.3 10.3 22.5 10.8 21.8C11.5 20.8 12 17.5 12 15.5C12 17.5 12.5 20.8 13.2 21.8C13.7 22.5 14.7 22.3 15 21.5C15.8 18.5 16.2 15.5 16.8 13C17.2 11.2 18 9.5 18 7.5C18 4.5 15.5 2 12 2Z" />
    </svg>
  );
}

interface Treatment {
  id: string;
  name: string;
  durationMin: number;
  price: number;
  maxPrice?: number | null;
  description: string | null;
  imageUrl: string | null;
  category?: string;
}

export default function ServicesClient({ treatments }: { treatments: Treatment[] }) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedTreatmentId, setSelectedTreatmentId] = useState<string | null>(null);

  const openBookingModal = (treatmentId?: string) => {
    setSelectedTreatmentId(treatmentId || null);
    setIsBookingOpen(true);
  };

  const closeBookingModal = () => {
    setIsBookingOpen(false);
    setSelectedTreatmentId(null);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeBookingModal();
    };
    if (isBookingOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isBookingOpen]);

  const selectedTreatment = treatments.find((t) => t.id === selectedTreatmentId);

  const categories = [
    { label: "All Treatments", id: "All" },
    { label: "Dental Implants", id: "Implantology" },
    { label: "Cosmetic & Whitening", id: "Cosmetic" },
    { label: "Restorative & Root Canal", id: "Restorative" },
    { label: "General & Scaling", id: "General" },
  ];

  const [activeSymptomId, setActiveSymptomId] = useState<string>("missing-tooth");

  const symptomList = [
    {
      id: "missing-tooth",
      title: "Missing or Broken Tooth",
      icon: BiotechOutlined,
      short: "Chewing difficulty or tooth gap",
      recommended: "American or German Titanium Dental Implant",
      procedureId: treatments.find((t) => t.name.toLowerCase().includes("implant"))?.id || "fallback-5",
      time: "75 mins (Procedure + Buffer)",
      recovery: "Immediate temporary crown placed; full integration in 8-12 weeks",
      pricing: "From Rs. 70,000",
      badge: "Permanent Biological Replacement",
      description:
        "Replaces the natural tooth down to the bone root, preventing facial bone shrinkage and protecting neighboring healthy teeth from shifting.",
    },
    {
      id: "toothache",
      title: "Acute Pain / Sensitivity",
      icon: FlashOnOutlined,
      short: "Throbbing nerve pain & hot/cold ache",
      recommended: "Microscope-Guided Single or Multi-Canal Root Canal (RCT)",
      procedureId: treatments.find((t) => t.name.toLowerCase().includes("single canal"))?.id || "fallback-3",
      time: "60 - 75 mins",
      recovery: "Immediate same-day pain relief; tooth sealed with bioceramic filler",
      pricing: "From Rs. 13,000",
      badge: "Same-Day Emergency Relief",
      description:
        "Computerized rotary debridement gently cleans the infected pulp chamber under local numbing, preserving your natural tooth permanently.",
    },
    {
      id: "stained-teeth",
      title: "Yellow or Stained Teeth",
      icon: AutoFixHighOutlined,
      short: "Tea, coffee, or surface discoloration",
      recommended: "Medical Diode Laser Teeth Whitening or Porcelain Veneers",
      procedureId: treatments.find((t) => t.name.toLowerCase().includes("laser whitening"))?.id || "fallback-2",
      time: "60 mins",
      recovery: "Zero downtime; lifts stubborn stains up to 8 shades lighter in 45 minutes",
      pricing: "From Rs. 22,000",
      badge: "Instant Smile Brightening",
      description:
        "Medical-grade laser energy activates buffered peroxide molecules inside microscopic enamel pores without eroding natural tooth minerals.",
    },
    {
      id: "crooked-teeth",
      title: "Crooked or Gapped Teeth",
      icon: SentimentSatisfiedAltOutlined,
      short: "Bite misalignment & overlapping teeth",
      recommended: "Custom Clear Invisible Aligners or Ceramic Aesthetic Braces",
      procedureId: treatments.find((t) => t.name.toLowerCase().includes("aligners"))?.id || "fallback-6",
      time: "45 mins setup",
      recovery: "Discreet removable trays; visible realignment within 90 days",
      pricing: "From Rs. 75,000 (0% Installments)",
      badge: "Discreet Orthodontic Correction",
      description:
        "Digital 3D intraoral simulation designs your tooth movements step-by-step with clear, removable trays you take off only to eat.",
    },
    {
      id: "bleeding-gums",
      title: "Bleeding Gums / Tartar",
      icon: SecurityOutlined,
      short: "Gum inflammation & hardened plaque",
      recommended: "Ultrasonic Deep Scaling & Full Mouth Air Polishing",
      procedureId: treatments.find((t) => t.name.toLowerCase().includes("full mouth"))?.id || "fallback-1",
      time: "45 - 60 mins",
      recovery: "Immediate fresh breath; gum healing and reattachment in 3-5 days",
      pricing: "From Rs. 2,500",
      badge: "Preventive Periodontal Health",
      description:
        "High-frequency ultrasonic scalers safely fragment hardened calculus deposits above and below the gumline to prevent bone loss.",
    },
  ];

  const activeSymptom = symptomList.find((s) => s.id === activeSymptomId) || symptomList[0];

  const filteredTreatments = treatments.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (selectedCategory === "All") return true;
    const name = t.name.toLowerCase();
    if (selectedCategory === "Cosmetic")
      return (
        name.includes("whitening") ||
        name.includes("veneers") ||
        name.includes("aligners") ||
        name.includes("braces")
      );
    if (selectedCategory === "Restorative")
      return (
        name.includes("filling") ||
        name.includes("crown") ||
        name.includes("root canal") ||
        name.includes("rct")
      );
    if (selectedCategory === "Implantology") return name.includes("implant");
    if (selectedCategory === "General")
      return name.includes("scaling") || name.includes("extraction") || name.includes("general");
    return true;
  });

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900">
      {/* 1. HERO SECTION — Matches Reference Design (Bright, Welcoming & High-Trust) */}
      <section className="relative bg-gradient-to-b from-teal-50/70 via-white to-slate-50 border-b border-slate-200 overflow-hidden py-12 lg:py-20 select-none">
        {/* Subtle background ambient glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-teal-400/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 rounded-full bg-cyan-400/10 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold tracking-wider uppercase shadow-xs">
                <AutoAwesomeOutlined sx={{ fontSize: 16, color: "#0d9488" }} />
                <span>Specialized Procedural Catalog</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#0B1528] tracking-tight leading-[1.12]">
                Bring the Bright <br />
                Smile with <span className="text-teal-600">Healthy Dental</span>
              </h1>

              <p className="text-slate-600 text-base sm:text-lg max-w-xl font-normal leading-relaxed">
                We provide comprehensive and personalized dental services, harnessing advanced techniques
                and painless clinical expertise to keep your smile bright, healthy, and confident.
              </p>

              {/* Action Buttons Row */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => openBookingModal()}
                  className="px-6 sm:px-8 py-3.5 rounded-full bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-teal-600/25 transition-all duration-300 hover:scale-105 cursor-pointer inline-flex items-center gap-2"
                >
                  <CalendarMonthOutlined sx={{ fontSize: 18 }} />
                  <span>Make an Appointment</span>
                </button>

                <a
                  href={`https://wa.me/${clinicInfo.phone.replace(/[^0-9]/g, "")}?text=Hello%2C%20I%20would%20like%20to%20inquire%20about%20dental%20treatments.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 sm:px-8 py-3.5 rounded-full bg-white hover:bg-slate-50 text-slate-800 border-2 border-slate-200 font-extrabold text-sm sm:text-base shadow-xs hover:border-slate-300 transition-all duration-300 cursor-pointer inline-flex items-center gap-2"
                >
                  <WhatsApp sx={{ fontSize: 18, color: "#16a34a" }} />
                  <span>Online Consultation</span>
                </a>
              </div>

              {/* Medical Certificate Quality Badge (Matching Reference Image) */}
              <div className="pt-2 flex items-start gap-3 max-w-md bg-white/90 backdrop-blur-xs p-4 rounded-2xl border border-slate-200/90 shadow-xs">
                <div className="p-2.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 shrink-0">
                  <WorkspacePremiumOutlined sx={{ fontSize: 24 }} />
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-[#0B1528]">
                    Medical Certification & Quality Standards
                  </h4>
                  <p className="text-xs text-slate-500 font-medium mt-0.5 leading-relaxed">
                    Our lead surgeons have undergone rigorous hospital examinations conducted with certified Class-B sterilization.
                  </p>
                </div>
              </div>

              {/* Search Bar & Category Filters */}
              <div className="pt-2 space-y-4">
                <div className="max-w-xl relative">
                  <SearchOutlined
                    sx={{ fontSize: 20, color: "#94a3b8" }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search treatments (e.g. Implants, Whitening, Root Canal)..."
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 shadow-xs transition-all"
                  />
                </div>

                {/* Filter Pills */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                        selectedCategory === cat.id
                          ? "bg-teal-600 text-white shadow-md shadow-teal-600/30 scale-105"
                          : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual with Shaped Backdrop & Floating Badges */}
            <div className="lg:col-span-5 relative flex justify-center items-center">
              <div className="relative w-full max-w-[420px] sm:max-w-[460px] h-[480px] sm:h-[540px] flex items-center justify-center select-none">
                
                {/* Shaped Organic Curved Backdrop (Tooth / Heart Shape Aesthetic) */}
                <div className="absolute inset-2 sm:inset-4 rounded-[64px] bg-gradient-to-br from-teal-100/90 via-teal-50/40 to-cyan-100/60 border border-teal-200/80 shadow-xl -rotate-2 pointer-events-none" />

                {/* Floating Decorative Sparkles */}
                <div className="absolute top-2 left-6 z-20 animate-float-1">
                  <AutoAwesomeOutlined sx={{ fontSize: 28, color: "#0d9488" }} />
                </div>
                <div className="absolute bottom-6 right-8 z-20 animate-float-3">
                  <AutoAwesomeOutlined sx={{ fontSize: 22, color: "#14b8a6" }} />
                </div>

                {/* Floating Circular Feature Badge 1: Tooth Sparkle (Top-Right) */}
                <div className="absolute top-6 -right-2 sm:-right-4 z-20 animate-float-1">
                  <div className="size-12 sm:size-14 rounded-full bg-teal-600 text-white flex items-center justify-center shadow-xl shadow-teal-700/35 border-2 border-white hover:scale-110 transition-transform">
                    <ToothIcon className="size-7 text-white" />
                  </div>
                </div>

                {/* Floating Circular Feature Badge 2: Medical Chart / Examination (Mid-Right) */}
                <div className="absolute top-1/2 -right-3 sm:-right-5 -translate-y-1/2 z-20 animate-float-3">
                  <div className="size-11 sm:size-13 rounded-full bg-teal-700 text-white flex items-center justify-center shadow-lg shadow-teal-800/35 border-2 border-white hover:scale-110 transition-transform">
                    <AssignmentOutlined sx={{ fontSize: 24 }} />
                  </div>
                </div>

                {/* Floating Circular Feature Badge 3: Patient Care & Family (Bottom-Left) */}
                <div className="absolute bottom-8 -left-3 sm:-left-5 z-20 animate-float-2">
                  <div className="size-11 sm:size-13 rounded-full bg-cyan-600 text-white flex items-center justify-center shadow-lg shadow-cyan-700/35 border-2 border-white hover:scale-110 transition-transform">
                    <PeopleOutlined sx={{ fontSize: 24 }} />
                  </div>
                </div>

                {/* Main Hero Portrait: Happy Smiling Dental Patients with Clean White Smiles */}
                <div className="relative w-[300px] sm:w-[350px] h-[420px] sm:h-[480px] rounded-[52px] overflow-hidden z-10 shadow-2xl border-4 border-white bg-white group">
                  <Image
                    src="https://images.unsplash.com/photo-1629909615184-74f495363b67?q=80&w=1000&auto=format&fit=crop"
                    alt="Happy smiling dental patients with healthy bright teeth"
                    fill
                    unoptimized
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Subtle lower gradient for depth */}
                  <div className="absolute inset-0 bg-gradient-to-t from-teal-950/35 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. CLINICAL ADVANTAGE STRIP — UX Reassurance */}
      <section className="bg-white border-b border-slate-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-xs text-slate-600">
            <div className="flex items-center gap-2.5">
              <CheckCircleOutlined sx={{ fontSize: 18, color: "#0d9488" }} />
              <span>Fixed Transparent Pricing</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircleOutlined sx={{ fontSize: 18, color: "#0d9488" }} />
              <span>Pain-Free Sedation Tech</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircleOutlined sx={{ fontSize: 18, color: "#0d9488" }} />
              <span>ISO 9001 Infection Control</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircleOutlined sx={{ fontSize: 18, color: "#0d9488" }} />
              <span>Post-Treatment Precautions</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PROCEDURE MATRIX GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <p className="text-sm font-semibold text-slate-600">
            Showing <span className="font-bold text-slate-900">{filteredTreatments.length}</span> dental solutions
          </p>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            Islamabad Clinic
          </span>
        </div>

        {filteredTreatments.length === 0 ? (
          <div className="p-16 text-center bg-white rounded-3xl border border-slate-200">
            <p className="text-slate-500 font-medium text-base">
              No treatments found matching &quot;{searchQuery}&quot;.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTreatments.map((treatment) => (
              <div
                key={treatment.id}
                className="rounded-3xl border border-slate-200/90 bg-white shadow-xs hover:shadow-2xl hover:border-teal-500/50 transition-all duration-300 flex flex-col justify-between overflow-hidden group"
              >
                <Link
                  href={`/services/${treatment.id}`}
                  className="relative h-52 w-full bg-slate-100 overflow-hidden block"
                >
                  <Image
                    src={getTreatmentImage(treatment.name, treatment.imageUrl)}
                    alt={treatment.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-slate-950/85 text-white font-mono text-xs font-semibold backdrop-blur-xs flex items-center gap-1.5">
                    <AccessTimeOutlined sx={{ fontSize: 14, color: "#2dd4bf" }} />
                    <span>{treatment.durationMin} mins</span>
                  </div>
                </Link>

                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                  <div>
                    <Link
                      href={`/services/${treatment.id}`}
                      className="block group/title hover:opacity-95 transition-opacity"
                    >
                      <h3 className="font-extrabold text-slate-950 text-xl group-hover:text-teal-700 transition-colors tracking-tight hover:underline underline-offset-4 decoration-teal-500">
                        {treatment.name}
                      </h3>
                    </Link>
                    <p className="text-slate-600 text-xs mt-2.5 line-clamp-3 leading-relaxed">
                      {treatment.description ||
                        "Advanced clinical procedure performed with computerized diagnostics and gentle anesthetic delivery."}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">
                          Fee Range
                        </span>
                        <span className="text-[9px] font-bold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">
                          Varies by case
                        </span>
                      </div>
                      <span className="text-lg sm:text-xl font-black text-slate-950 font-sans tracking-tight">
                        {formatPriceRange(treatment.price, treatment.maxPrice)}
                      </span>
                    </div>

                    <div>
                      <button
                        type="button"
                        onClick={() => openBookingModal(treatment.id)}
                        className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-950 hover:bg-teal-700 shadow-md shadow-slate-950/15 transition-all inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>Book</span>
                        <ChevronRightOutlined sx={{ fontSize: 16, color: "#2dd4bf" }} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 3.5 INTERACTIVE SYMPTOM & TREATMENT MATCHER (Best-in-Class Clinical UX Flow) */}
      <section className="bg-slate-50 border-t border-slate-200/80 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full">
              Diagnostic Decision Assistant
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0B1528] mt-3 tracking-tight">
              Find Your Treatment by Dental Concern
            </h2>
            <p className="text-slate-600 mt-3 text-base leading-relaxed">
              Not sure about complex clinical terminology? Select your current symptom or goal below to find the exact procedure, recovery time, and transparent pricing.
            </p>
          </div>

          {/* Symptom Selection Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
            {symptomList.map((symptom) => {
              const IconComp = symptom.icon;
              const isActive = activeSymptomId === symptom.id;
              return (
                <button
                  key={symptom.id}
                  onClick={() => setActiveSymptomId(symptom.id)}
                  className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-extrabold flex items-center gap-2.5 transition-all cursor-pointer shadow-xs ${
                    isActive
                      ? "bg-teal-600 text-white shadow-md shadow-teal-600/30 scale-105"
                      : "bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200"
                  }`}
                >
                  <IconComp sx={{ fontSize: 18, color: isActive ? "#ffffff" : "#0d9488" }} />
                  <span>{symptom.title}</span>
                </button>
              );
            })}
          </div>

          {/* Active Symptom Diagnostic Match Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden transition-all duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-8 sm:p-12 items-center">
              {/* Left Column: Clinical Diagnosis & Details */}
              <div className="lg:col-span-7 space-y-6">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full">
                    {activeSymptom.badge}
                  </span>
                  <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                    <AccessTimeOutlined sx={{ fontSize: 15, color: "#0d9488" }} />
                    <span>{activeSymptom.time}</span>
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl sm:text-3xl font-black text-[#0B1528] tracking-tight">
                    {activeSymptom.recommended}
                  </h3>
                  <p className="text-slate-600 mt-3 text-sm sm:text-base leading-relaxed">
                    {activeSymptom.description}
                  </p>
                </div>

                {/* Key Procedure Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Recovery & Downtime
                    </span>
                    <p className="text-xs font-bold text-slate-800 mt-1 leading-snug">
                      {activeSymptom.recovery}
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-200/60">
                    <span className="text-[11px] font-bold text-teal-800 uppercase tracking-wider block">
                      Transparent Starting Fee
                    </span>
                    <p className="text-base font-black text-teal-950 mt-0.5">
                      {activeSymptom.pricing}
                    </p>
                  </div>
                </div>

                {/* Direct Action Buttons */}
                <div className="flex flex-wrap items-center gap-4 pt-3">
                  <button
                    type="button"
                    onClick={() => openBookingModal(activeSymptom.procedureId)}
                    className="px-6 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-teal-600/25 transition-transform active:scale-95 inline-flex items-center gap-2 cursor-pointer"
                  >
                    <CalendarMonthOutlined sx={{ fontSize: 18 }} />
                    <span>Book This Treatment</span>
                  </button>

                  <Link
                    href={`/services/${activeSymptom.procedureId}`}
                    className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs uppercase tracking-wider transition-colors inline-flex items-center gap-2 cursor-pointer"
                  >
                    <span>View Clinical Protocol</span>
                    <ChevronRightOutlined sx={{ fontSize: 18, color: "#2dd4bf" }} />
                  </Link>
                </div>
              </div>

              {/* Right Column: Reassurance & Doctor Consultation Card */}
              <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-[#0B1528] rounded-2xl sm:rounded-3xl p-7 sm:p-8 text-white space-y-6 shadow-xl border border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-300">
                    <VerifiedOutlined sx={{ fontSize: 22 }} />
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-white">Clinical Guarantee</h4>
                    <p className="text-xs text-slate-400">European Class-B Hospital Standards</p>
                  </div>
                </div>

                <div className="space-y-3.5 text-xs text-slate-300 border-t border-slate-800 pt-5">
                  <div className="flex items-start gap-2.5">
                    <CheckCircleOutlined sx={{ fontSize: 16, color: "#2dd4bf", marginTop: "2px" }} />
                    <span><strong>Zero Surprise Fees:</strong> 100% itemized written estimate provided prior to any procedure.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircleOutlined sx={{ fontSize: 16, color: "#2dd4bf", marginTop: "2px" }} />
                    <span><strong>Gentle Anesthesia:</strong> Computerized micro-delivery ensures completely painless treatment.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircleOutlined sx={{ fontSize: 16, color: "#2dd4bf", marginTop: "2px" }} />
                    <span><strong>Certified Surgeons:</strong> Procedures conducted by FCPS & German-certified implantologists.</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <a
                    href={`https://wa.me/${clinicInfo.whatsapp}?text=${encodeURIComponent(
                      `Hello, I would like expert advice regarding: ${activeSymptom.title} (${activeSymptom.recommended}).`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 rounded-xl bg-teal-700/50 hover:bg-teal-600/70 border border-teal-500/40 text-teal-200 text-xs font-bold transition-all flex items-center justify-center gap-2"
                  >
                    <WhatsApp sx={{ fontSize: 16, color: "#34D399" }} />
                    <span>Ask Doctor on WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. OUR 4-STEP CLINICAL TREATMENT JOURNEY (Replaced duplicate static FAQ) */}
      <section className="bg-white border-t border-slate-200 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full">
              Patient Care Protocol
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0B1528] mt-3 tracking-tight">
              How We Deliver Pain-Free Precision Dentistry
            </h2>
            <p className="text-slate-600 mt-3 text-base leading-relaxed">
              From your initial 3D digital diagnosis to lifelong post-treatment guarantees, our transparent 4-step workflow ensures zero discomfort and predictable clinical outcomes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="rounded-3xl border border-slate-200/90 bg-slate-50/60 p-7 flex flex-col justify-between hover:shadow-lg hover:border-teal-300 transition-all duration-300 group">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <span className="text-xs font-black font-mono text-teal-700 bg-teal-50 border border-teal-200 px-3 py-1 rounded-xl">
                    STEP 01
                  </span>
                  <div className="size-11 rounded-2xl bg-white border border-slate-200 text-teal-600 flex items-center justify-center shadow-xs group-hover:scale-110 group-hover:bg-teal-600 group-hover:text-white transition-all">
                    <BiotechOutlined sx={{ fontSize: 22 }} />
                  </div>
                </div>
                <h3 className="text-lg font-black text-[#0B1528] group-hover:text-teal-700 transition-colors">
                  Digital 3D Diagnostics
                </h3>
                <p className="text-xs text-slate-600 mt-2.5 leading-relaxed font-normal">
                  High-definition CBCT scans and intraoral digital impressions map your exact bone density and anatomy with microscopic precision.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center gap-1.5 text-[11px] font-bold text-teal-800">
                <CheckCircleOutlined sx={{ fontSize: 14, color: "#0d9488" }} />
                <span>Itemized Written Plan</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="rounded-3xl border border-slate-200/90 bg-slate-50/60 p-7 flex flex-col justify-between hover:shadow-lg hover:border-teal-300 transition-all duration-300 group">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <span className="text-xs font-black font-mono text-teal-700 bg-teal-50 border border-teal-200 px-3 py-1 rounded-xl">
                    STEP 02
                  </span>
                  <div className="size-11 rounded-2xl bg-white border border-slate-200 text-teal-600 flex items-center justify-center shadow-xs group-hover:scale-110 group-hover:bg-teal-600 group-hover:text-white transition-all">
                    <AutoAwesomeOutlined sx={{ fontSize: 22 }} />
                  </div>
                </div>
                <h3 className="text-lg font-black text-[#0B1528] group-hover:text-teal-700 transition-colors">
                  Painless Local Numbing
                </h3>
                <p className="text-xs text-slate-600 mt-2.5 leading-relaxed font-normal">
                  Computerized micro-delivery anesthetic and topical cooling gels ensure you feel zero sting or pressure before any procedure starts.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center gap-1.5 text-[11px] font-bold text-teal-800">
                <CheckCircleOutlined sx={{ fontSize: 14, color: "#0d9488" }} />
                <span>100% Gentle Protocol</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="rounded-3xl border border-slate-200/90 bg-slate-50/60 p-7 flex flex-col justify-between hover:shadow-lg hover:border-teal-300 transition-all duration-300 group">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <span className="text-xs font-black font-mono text-teal-700 bg-teal-50 border border-teal-200 px-3 py-1 rounded-xl">
                    STEP 03
                  </span>
                  <div className="size-11 rounded-2xl bg-white border border-slate-200 text-teal-600 flex items-center justify-center shadow-xs group-hover:scale-110 group-hover:bg-teal-600 group-hover:text-white transition-all">
                    <SecurityOutlined sx={{ fontSize: 22 }} />
                  </div>
                </div>
                <h3 className="text-lg font-black text-[#0B1528] group-hover:text-teal-700 transition-colors">
                  Minimally Invasive Surgery
                </h3>
                <p className="text-xs text-slate-600 mt-2.5 leading-relaxed font-normal">
                  Procedures are executed under Class-B European autoclaving standards using biocompatible certified titanium and ceramics.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center gap-1.5 text-[11px] font-bold text-teal-800">
                <CheckCircleOutlined sx={{ fontSize: 14, color: "#0d9488" }} />
                <span>ISO 9001 Hospital Sterile</span>
              </div>
            </div>

            {/* Step 4 */}
            <div className="rounded-3xl border border-slate-200/90 bg-slate-50/60 p-7 flex flex-col justify-between hover:shadow-lg hover:border-teal-300 transition-all duration-300 group">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <span className="text-xs font-black font-mono text-teal-700 bg-teal-50 border border-teal-200 px-3 py-1 rounded-xl">
                    STEP 04
                  </span>
                  <div className="size-11 rounded-2xl bg-white border border-slate-200 text-teal-600 flex items-center justify-center shadow-xs group-hover:scale-110 group-hover:bg-teal-600 group-hover:text-white transition-all">
                    <ContactSupportOutlined sx={{ fontSize: 22 }} />
                  </div>
                </div>
                <h3 className="text-lg font-black text-[#0B1528] group-hover:text-teal-700 transition-colors">
                  Dedicated Aftercare
                </h3>
                <p className="text-xs text-slate-600 mt-2.5 leading-relaxed font-normal">
                  Receive personalized recovery precautions, lifetime structural warranty coverage, and direct 24/7 WhatsApp emergency doctor support.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center gap-1.5 text-[11px] font-bold text-teal-800">
                <CheckCircleOutlined sx={{ fontSize: 14, color: "#0d9488" }} />
                <span>24/7 Clinical Support</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4.5 HOSPITAL STERILIZATION & 3D DENTAL TECHNOLOGY SHOWCASE (Medical Authority & E-E-A-T) */}
      <section className="bg-slate-50 border-t border-slate-200 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full">
              Surgical Excellence & Safety
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0B1528] mt-3 tracking-tight">
              Hospital-Grade Technology & European Sterilization
            </h2>
            <p className="text-slate-600 mt-3 text-base leading-relaxed">
              We invest in state-of-the-art diagnostic imaging and Melag 134°C Class-B sterilization autoclaves to ensure every procedure is faster, minimally invasive, and 100% infection-free.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Tech 1 */}
            <div className="bg-white rounded-3xl border border-slate-200 p-7 flex flex-col justify-between hover:shadow-xl hover:border-teal-400 transition-all group">
              <div>
                <div className="size-12 rounded-2xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-teal-600 group-hover:text-white transition-all">
                  <SecurityOutlined sx={{ fontSize: 24 }} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 block mb-1">
                  Infection Control
                </span>
                <h3 className="text-lg font-black text-[#0B1528] group-hover:text-teal-700 transition-colors">
                  Class-B 134°C Autoclave
                </h3>
                <p className="text-xs text-slate-600 mt-2.5 leading-relaxed font-normal">
                  Triple fractional vacuum autoclaving sterilizes hollow instruments and pouches with 100% biological spore verification before every surgery.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500">Sterilization Standard</span>
                <span className="text-xs font-black text-teal-700 font-mono">100% Sterile</span>
              </div>
            </div>

            {/* Tech 2 */}
            <div className="bg-white rounded-3xl border border-slate-200 p-7 flex flex-col justify-between hover:shadow-xl hover:border-teal-400 transition-all group">
              <div>
                <div className="size-12 rounded-2xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-teal-600 group-hover:text-white transition-all">
                  <BiotechOutlined sx={{ fontSize: 24 }} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 block mb-1">
                  High-Precision Imaging
                </span>
                <h3 className="text-lg font-black text-[#0B1528] group-hover:text-teal-700 transition-colors">
                  3D Volumetric CBCT
                </h3>
                <p className="text-xs text-slate-600 mt-2.5 leading-relaxed font-normal">
                  Sub-millimeter 3D jawbone reconstruction maps nerve pathways and bone contours with 90% lower radiation than hospital CT scans.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500">Surgical Accuracy</span>
                <span className="text-xs font-black text-teal-700 font-mono">0.1 mm Micro-Precision</span>
              </div>
            </div>

            {/* Tech 3 */}
            <div className="bg-white rounded-3xl border border-slate-200 p-7 flex flex-col justify-between hover:shadow-xl hover:border-teal-400 transition-all group">
              <div>
                <div className="size-12 rounded-2xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-teal-600 group-hover:text-white transition-all">
                  <FlashOnOutlined sx={{ fontSize: 24 }} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 block mb-1">
                  Bloodless Surgery
                </span>
                <h3 className="text-lg font-black text-[#0B1528] group-hover:text-teal-700 transition-colors">
                  Biolase Diode Laser
                </h3>
                <p className="text-xs text-slate-600 mt-2.5 leading-relaxed font-normal">
                  Surgical soft-tissue laser seals blood vessels and decontaminates bacteria instantly, eliminating scalpel incisions and post-op swelling.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500">Surgical Downtime</span>
                <span className="text-xs font-black text-teal-700 font-mono">Zero Stitches</span>
              </div>
            </div>

            {/* Tech 4 */}
            <div className="bg-white rounded-3xl border border-slate-200 p-7 flex flex-col justify-between hover:shadow-xl hover:border-teal-400 transition-all group">
              <div>
                <div className="size-12 rounded-2xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-teal-600 group-hover:text-white transition-all">
                  <AutoAwesomeOutlined sx={{ fontSize: 24 }} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 block mb-1">
                  Anxiety Relief
                </span>
                <h3 className="text-lg font-black text-[#0B1528] group-hover:text-teal-700 transition-colors">
                  Painless Micro-Delivery
                </h3>
                <p className="text-xs text-slate-600 mt-2.5 leading-relaxed font-normal">
                  Computerized micro-metered anesthetic eliminates the harsh pressure sting of traditional needles, delivering true pain-free dentistry.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500">Patient Comfort</span>
                <span className="text-xs font-black text-teal-700 font-mono">100% Sting-Free</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4.6 TRANSPARENT FEE GUARANTEE & FINANCIAL EASE */}
      <section className="bg-white border-t border-slate-200 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full">
              Financial Peace of Mind
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0B1528] mt-3 tracking-tight">
              Transparent Fees with 0% Installment Plans
            </h2>
            <p className="text-slate-600 mt-3 text-base leading-relaxed">
              We eliminate dental billing surprises. Before any treatment begins, you receive an itemized written estimate with no hidden clinic or sterilization fees.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 */}
            <div className="rounded-3xl border border-slate-200 p-7 bg-slate-50/50 hover:bg-white hover:shadow-lg hover:border-teal-400 transition-all group">
              <div className="size-12 rounded-2xl bg-white border border-slate-200 text-teal-700 flex items-center justify-center mb-5 shadow-xs group-hover:bg-teal-600 group-hover:text-white transition-all">
                <ReceiptLongOutlined sx={{ fontSize: 24 }} />
              </div>
              <h3 className="text-lg font-black text-[#0B1528] group-hover:text-teal-700 transition-colors">
                Itemized Written Quote
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Prior to starting any procedure, you receive an explicit printed estimate itemizing consultations, x-rays, and materials.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-200/60 text-[11px] font-bold text-teal-800 flex items-center gap-1.5">
                <CheckCircleOutlined sx={{ fontSize: 14, color: "#0d9488" }} />
                <span>Zero Hidden Costs</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="rounded-3xl border border-slate-200 p-7 bg-slate-50/50 hover:bg-white hover:shadow-lg hover:border-teal-400 transition-all group">
              <div className="size-12 rounded-2xl bg-white border border-slate-200 text-teal-700 flex items-center justify-center mb-5 shadow-xs group-hover:bg-teal-600 group-hover:text-white transition-all">
                <CreditCardOutlined sx={{ fontSize: 24 }} />
              </div>
              <h3 className="text-lg font-black text-[#0B1528] group-hover:text-teal-700 transition-colors">
                0% Milestone Installments
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Pay comfortably across appointment visits for orthodontic aligners, braces, and implants with 0% extra interest or markup.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-200/60 text-[11px] font-bold text-teal-800 flex items-center gap-1.5">
                <CheckCircleOutlined sx={{ fontSize: 14, color: "#0d9488" }} />
                <span>Flexible Payment Schedule</span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="rounded-3xl border border-slate-200 p-7 bg-slate-50/50 hover:bg-white hover:shadow-lg hover:border-teal-400 transition-all group">
              <div className="size-12 rounded-2xl bg-white border border-slate-200 text-teal-700 flex items-center justify-center mb-5 shadow-xs group-hover:bg-teal-600 group-hover:text-white transition-all">
                <AccountBalanceOutlined sx={{ fontSize: 24 }} />
              </div>
              <h3 className="text-lg font-black text-[#0B1528] group-hover:text-teal-700 transition-colors">
                Corporate & Panel Claims
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                We provide pre-authorized documentation, computerized itemized receipts, and insurance claims assistance for major institutions.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-200/60 text-[11px] font-bold text-teal-800 flex items-center gap-1.5">
                <CheckCircleOutlined sx={{ fontSize: 14, color: "#0d9488" }} />
                <span>Fast Claim Reimbursement</span>
              </div>
            </div>

            {/* Card 4 */}
            <div className="rounded-3xl border border-slate-200 p-7 bg-slate-50/50 hover:bg-white hover:shadow-lg hover:border-teal-400 transition-all group">
              <div className="size-12 rounded-2xl bg-white border border-slate-200 text-teal-700 flex items-center justify-center mb-5 shadow-xs group-hover:bg-teal-600 group-hover:text-white transition-all">
                <WorkspacePremiumOutlined sx={{ fontSize: 24 }} />
              </div>
              <h3 className="text-lg font-black text-[#0B1528] group-hover:text-teal-700 transition-colors">
                Lifetime Warranty Cards
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                All American and German titanium implants come with verifiable manufacturer serial certificates and long-term structural guarantees.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-200/60 text-[11px] font-bold text-teal-800 flex items-center gap-1.5">
                <CheckCircleOutlined sx={{ fontSize: 14, color: "#0d9488" }} />
                <span>Authentic Manufacturer Warranty</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. DIRECT CONVERSION CTA BAR */}
      <section className="bg-slate-950 text-white py-16 border-t border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h3 className="text-3xl font-extrabold text-white">
            Unsure Which Treatment Fits Your Smile?
          </h3>
          <p className="text-slate-300 max-w-xl mx-auto text-sm leading-relaxed">
            Send us a WhatsApp message or schedule a quick diagnostic consultation with our surgical team.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              type="button"
              onClick={() => openBookingModal()}
              className="px-8 py-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-teal-600/30 transition-transform active:scale-95 inline-flex items-center gap-2 cursor-pointer"
            >
              <CalendarMonthOutlined sx={{ fontSize: 18 }} />
              <span>Book In-Person Exam</span>
            </button>
            <a
              href={`https://wa.me/${clinicInfo.whatsapp}?text=${encodeURIComponent(
                "Hello, I need guidance on choosing the right dental treatment."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-xs uppercase tracking-wider border border-slate-700 transition-colors inline-flex items-center gap-2"
            >
              <WhatsApp sx={{ fontSize: 18, color: "#10b981" }} />
              <span>WhatsApp Doctor</span>
            </a>
          </div>
        </div>
      </section>

      {/* 6. BOOKING FORM MODAL DIALOG (Opens when clicking any "Book" button) */}
      {isBookingOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeBookingModal();
          }}
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
                    {selectedTreatment
                      ? `Book: ${selectedTreatment.name}`
                      : "Reserve Your Appointment"}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {selectedTreatment
                      ? `Fee Range: ${formatPriceRange(selectedTreatment.price, selectedTreatment.maxPrice)} (varies by case) • ${selectedTreatment.durationMin} mins appointment`
                      : "Choose your preferred treatment and date"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeBookingModal}
                className="size-9 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close dialog"
              >
                <Close sx={{ fontSize: 20 }} />
              </button>
            </div>

            {/* Dialog Body with Full BookingForm */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1">
              <BookingForm
                key={selectedTreatmentId || "default"}
                treatments={treatments as any}
                defaultTreatmentId={selectedTreatmentId || undefined}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
