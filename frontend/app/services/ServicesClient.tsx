"use client";

import { useState } from "react";
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
} from "@mui/icons-material";
import { clinicInfo } from "@/app/constants/mockData";
import { formatPKR, getTreatmentImage } from "@/lib/utils";

interface Treatment {
  id: string;
  name: string;
  durationMin: number;
  price: number;
  description: string | null;
  imageUrl: string | null;
  category?: string;
}

export default function ServicesClient({ treatments }: { treatments: Treatment[] }) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const categories = [
    { label: "All Treatments", id: "All" },
    { label: "Dental Implants", id: "Implantology" },
    { label: "Cosmetic & Whitening", id: "Cosmetic" },
    { label: "Restorative & Root Canal", id: "Restorative" },
    { label: "General & Scaling", id: "General" },
  ];

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
      {/* 1. HERO SECTION — High Trust Clinical Overview */}
      <section className="bg-slate-950 text-white py-16 lg:py-24 border-b border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#0d9488_1px,transparent_1px)] [background-size:28px_28px] opacity-20 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-950 border border-teal-700/80 text-teal-300 text-xs font-bold tracking-wider uppercase">
            <AutoAwesomeOutlined sx={{ fontSize: 16, color: "#2dd4bf" }} />
            Specialized Procedural Catalog
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white mt-4 tracking-tight uppercase">
            Dental Care Tailored To <span className="text-teal-400">Your Health</span>
          </h1>
          <p className="mt-4 text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Transparent pricing in PKR, pain-free techniques, and European Class-B sterilization for every single procedure.
          </p>

          {/* Interactive Search Bar with MUI Icon */}
          <div className="mt-8 max-w-xl mx-auto relative">
            <SearchOutlined sx={{ fontSize: 20, color: "#94a3b8" }} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search treatments (e.g. Implants, Whitening, Root Canal)..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-400 text-sm focus:outline-teal-500 shadow-xl"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                  selectedCategory === cat.id
                    ? "bg-teal-600 text-white shadow-lg shadow-teal-600/30 scale-105"
                    : "bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-800"
                }`}
              >
                {cat.label}
              </button>
            ))}
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
                <div className="relative h-52 w-full bg-slate-100 overflow-hidden">
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
                </div>

                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-extrabold text-slate-950 text-xl group-hover:text-teal-700 transition-colors tracking-tight">
                      {treatment.name}
                    </h3>
                    <p className="text-slate-600 text-xs mt-2.5 line-clamp-3 leading-relaxed">
                      {treatment.description ||
                        "Advanced clinical procedure performed with computerized diagnostics and gentle anesthetic delivery."}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                        Transparent Fee
                      </span>
                      <span className="text-xl font-black text-slate-950">
                        {formatPKR(treatment.price)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/services/${treatment.id}`}
                        className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                      >
                        Learn More
                      </Link>
                      <Link
                        href="/#book"
                        className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-950 hover:bg-teal-700 shadow-md shadow-slate-950/15 transition-colors inline-flex items-center gap-1"
                      >
                        <span>Book</span>
                        <ChevronRightOutlined sx={{ fontSize: 15, color: "#2dd4bf" }} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. CLINICAL FAQ & PATIENT CONCERNS ACCORDION */}
      <section className="bg-white border-t border-slate-200 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full">
              Common Questions
            </span>
            <h2 className="text-3xl font-extrabold text-slate-950 mt-3 tracking-tight">
              Patient Guidance & FAQs
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "How many sessions are typically required for Dental Implants?",
                a: "Most single-tooth implants require 2 main sessions: implant placement and final crown fixture after osseointegration (usually 8-12 weeks later). Temporary aesthetic crowns are placed immediately so you never leave without a tooth.",
              },
              {
                q: "Is laser teeth whitening safe for tooth enamel?",
                a: "Yes. Our diode laser whitening utilizes buffered hydrogen peroxide gels that brighten teeth up to 6 shades without eroding the natural hydroxyapatite crystals of your enamel.",
              },
              {
                q: "What sedation options are available for anxious patients?",
                a: "We offer topical pre-numbing gels and computerized micro-needle injections that deliver anesthetic at the exact biological absorption rate, eliminating the stinging sensation completely.",
              },
              {
                q: "Do you offer emergency root canal treatment?",
                a: "Yes. Severe pulpitis or dental abscesses are given same-day priority appointment slots to relieve acute dental pain immediately.",
              },
            ].map((faq, idx) => (
              <div key={idx} className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <HelpOutlineOutlined sx={{ fontSize: 18, color: "#0d9488" }} />
                  <span>{faq.q}</span>
                </h4>
                <p className="text-xs text-slate-600 mt-2 pl-6 leading-relaxed">{faq.a}</p>
              </div>
            ))}
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
            <Link
              href="/#book"
              className="px-8 py-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-teal-600/30 transition-transform active:scale-95 inline-flex items-center gap-2"
            >
              <CalendarMonthOutlined sx={{ fontSize: 18 }} />
              <span>Book In-Person Exam</span>
            </Link>
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
    </div>
  );
}
