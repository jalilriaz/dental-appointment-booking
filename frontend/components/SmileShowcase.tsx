"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  VerifiedOutlined,
  AccessTimeOutlined,
  ArrowForwardOutlined,
  CheckCircleOutlined,
} from "@mui/icons-material";

interface SmileCase {
  id: string;
  category: "all" | "veneers" | "implants" | "whitening" | "braces";
  title: string;
  patientAge: string;
  treatmentName: string;
  duration: string;
  beforeImage: string;
  afterImage: string;
  clinicalSummary: string;
  keyOutcomes: string[];
}

const cases: SmileCase[] = [
  {
    id: "case-1",
    category: "veneers",
    title: "Full Arch Aesthetic Smile Rehabilitation",
    patientAge: "34-year-old Executive",
    treatmentName: "Porcelain Veneers & Gum Contouring",
    duration: "2 Clinical Visits · 7 Days",
    beforeImage: "/images/services/dental_filling.png",
    afterImage: "/images/services/dental_veneers.png",
    clinicalSummary: "Correction of severe enamel fluorosis discoloration and micro-chipping using ultra-thin lithium disilicate veneers.",
    keyOutcomes: ["Natural OM2 bleach shade", "Zero tooth sensitivity post-cure", "Harmonized smile curvature"],
  },
  {
    id: "case-2",
    category: "whitening",
    title: "In-Office Laser Enamel Brightening",
    patientAge: "28-year-old Bride-to-be",
    treatmentName: "Laser Teeth Whitening Protocol",
    duration: "1 Session · 45 Minutes",
    beforeImage: "/images/services/deep_scaling.png",
    afterImage: "/images/services/laser_whitening.png",
    clinicalSummary: "Rapid photo-thermal activation removing chronic tea/coffee oxidation without enamel surface demineralization.",
    keyOutcomes: ["8 shades brighter on VITA scale", "Desensitizing fluoride varnish applied", "Zero dental dehydration"],
  },
  {
    id: "case-3",
    category: "implants",
    title: "Guided Immediate Molar Replacement",
    patientAge: "46-year-old Business Owner",
    treatmentName: "German Titanium Dental Implant",
    duration: "Single Day Fixture Placement",
    beforeImage: "/images/services/extraction.png",
    afterImage: "/images/services/american_implant.png",
    clinicalSummary: "Extraction of fractured molar followed by immediate flapless 3D computer-guided implant placement and biological bone graft.",
    keyOutcomes: ["100% Osseointegration success", "Full masticatory chewing restoration", "Preserved jaw bone density"],
  },
  {
    id: "case-4",
    category: "braces",
    title: "Adult Orthodontic Crowding Alignment",
    patientAge: "25-year-old Medical Student",
    treatmentName: "Clear Invisible Ceramic Braces",
    duration: "10 Months Active Alignment",
    beforeImage: "/images/services/braces.png",
    afterImage: "/images/services/ceramic_braces.png",
    clinicalSummary: "Non-extraction alignment of upper anterior crowding and deep bite using high-translucency ceramic brackets.",
    keyOutcomes: ["Class I canine bite achieved", "Discreet aesthetic brackets", "Lifelong retention protocol"],
  },
];

export default function SmileShowcase() {
  const [activeTab, setActiveTab] = useState<"all" | "veneers" | "implants" | "whitening" | "braces">("all");

  const filtered = activeTab === "all" ? cases : cases.filter((c) => c.category === activeTab);

  const tabs = [
    { id: "all", label: "All Transformations" },
    { id: "veneers", label: "Veneers & Aesthetics" },
    { id: "whitening", label: "Laser Whitening" },
    { id: "implants", label: "Dental Implants" },
    { id: "braces", label: "Braces & Aligners" },
  ] as const;

  return (
    <div className="space-y-8">
      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
              activeTab === tab.id
                ? "bg-[#0B1528] text-white shadow-md shadow-slate-950/20"
                : "bg-white text-slate-700 border border-slate-200 hover:border-teal-400 hover:bg-slate-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid of Transformation Case Studies */}
      <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="rounded-3xl border border-slate-200/90 bg-white overflow-hidden shadow-xs hover:shadow-lg hover:border-teal-400 transition-all duration-300 flex flex-col group"
          >
            {/* Split Clinical Image Comparison View */}
            <div className="grid grid-cols-2 gap-1 p-2 bg-slate-100">
              <div className="relative h-48 sm:h-56 rounded-2xl overflow-hidden bg-slate-200">
                <Image
                  src={item.beforeImage}
                  alt={`${item.title} clinical pre-op presentation`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute bottom-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-slate-950/80 text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur-xs">
                  Initial Presentation
                </span>
              </div>
              <div className="relative h-48 sm:h-56 rounded-2xl overflow-hidden bg-slate-200">
                <Image
                  src={item.afterImage}
                  alt={`${item.title} completed clinical smile outcome`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute bottom-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-teal-800/90 text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur-xs border border-teal-400/50">
                  Completed Smile
                </span>
              </div>
            </div>

            {/* Case Documentation Dossier */}
            <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-md border border-teal-200">
                    <VerifiedOutlined sx={{ fontSize: 13, color: "#0d9488" }} />
                    <span>{item.treatmentName}</span>
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-slate-500 font-medium font-mono">
                    <AccessTimeOutlined sx={{ fontSize: 13, color: "#64748b" }} />
                    <span>{item.duration}</span>
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-extrabold text-[#0B1528] mt-2.5 tracking-tight group-hover:text-teal-700 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">
                  Patient Case: {item.patientAge}
                </p>

                <p className="text-slate-600 text-xs sm:text-sm mt-3 leading-relaxed">
                  {item.clinicalSummary}
                </p>

                {/* Key Clinical Outcomes */}
                <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                  {item.keyOutcomes.map((outcome, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                      <CheckCircleOutlined sx={{ fontSize: 14, color: "#0d9488" }} />
                      <span className="font-semibold">{outcome}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Consultation Anchor */}
              <div className="pt-2">
                <a
                  href="#book"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-50 hover:bg-[#0B1528] text-slate-800 hover:text-white border border-slate-200 hover:border-slate-900 font-bold text-xs uppercase tracking-wider transition-all duration-200 active:scale-95"
                >
                  <span>Book Consultation For This Result</span>
                  <ArrowForwardOutlined sx={{ fontSize: 14 }} />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

