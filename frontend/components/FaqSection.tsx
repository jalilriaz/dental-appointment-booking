"use client";

import React, { useState } from "react";
import Image from "next/image";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";

function ToothIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C8.5 2 6 4.5 6 7.5C6 9.5 6.8 11.2 7.2 13C7.8 15.5 8.2 18.5 9 21.5C9.3 22.3 10.3 22.5 10.8 21.8C11.5 20.8 12 17.5 12 15.5C12 17.5 12.5 20.8 13.2 21.8C13.7 22.5 14.7 22.3 15 21.5C15.8 18.5 16.2 15.5 16.8 13C17.2 11.2 18 9.5 18 7.5C18 4.5 15.5 2 12 2Z" />
    </svg>
  );
}

export interface FaqItem {
  id?: string;
  question: string;
  answer: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface FaqSectionProps {
  kicker?: string;
  title?: string;
  subtitle?: string;
  items: FaqItem[];
  className?: string;
  imageSrc?: string;
  defaultExpandedIndex?: number;
}

export default function FaqSection({
  kicker = "Help & Support",
  title = "Frequently asked questions",
  subtitle = "Here's everything you need to know about our treatments, appointments, and billing. Can't spot the answer you need? Our friendly clinical team is just a call away.",
  items,
  className = "",
  imageSrc = "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?q=80&w=1000&auto=format&fit=crop",
  defaultExpandedIndex = 0,
}: FaqSectionProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(defaultExpandedIndex);

  const toggleItem = (idx: number) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  return (
    <section className={`w-full py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden ${className}`}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left Column: FAQ Content */}
        <div className="lg:col-span-7 space-y-8">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 border border-teal-200 shadow-xs mb-3">
              {kicker}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {title}
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 font-medium leading-relaxed max-w-xl">
              {subtitle}
            </p>
          </div>

          <div className="space-y-4">
            {items.map((item, idx) => {
              const isOpen = expandedIndex === idx;
              const IconComponent = item.icon || HelpOutlineOutlinedIcon;

              return (
                <div
                  key={item.id || idx}
                  className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                    isOpen
                      ? "bg-white border-teal-300 shadow-md shadow-teal-900/5 ring-1 ring-teal-500/10"
                      : "bg-white/80 hover:bg-white border-slate-200/90 shadow-xs hover:border-slate-300 hover:shadow-sm"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleItem(idx)}
                    className="w-full text-left p-4 sm:p-5 flex items-start gap-4 cursor-pointer focus:outline-hidden"
                    aria-expanded={isOpen}
                  >
                    <div
                      className={`size-10 sm:size-11 rounded-full flex items-center justify-center shrink-0 border transition-colors ${
                        isOpen
                          ? "bg-teal-50 border-teal-200 text-teal-700 shadow-xs"
                          : "bg-slate-50 border-slate-200 text-slate-500 group-hover:text-teal-600"
                      }`}
                    >
                      <IconComponent className="size-5" />
                    </div>

                    <div className="flex-1 pt-1.5">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                          {item.question}
                        </h3>
                        <KeyboardArrowDownOutlinedIcon
                          className={`size-5 text-slate-400 shrink-0 transition-transform duration-300 ${
                            isOpen ? "rotate-180 text-teal-600" : ""
                          }`}
                        />
                      </div>

                      {isOpen && (
                        <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal animate-fade-in pr-2">
                          {item.answer}
                        </p>
                      )}
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Tall Vertical Portrait Covering 80% Height with Animated Orbiting Icons */}
        <div className="lg:col-span-5 flex justify-center items-center">
          <div className="relative w-full max-w-[380px] sm:max-w-[420px] h-[500px] sm:h-[560px] lg:h-[600px] flex items-center justify-center select-none hover-pause">
            {/* Subtle background ambient radial glow */}
            <div className="absolute inset-0 rounded-[60px] bg-radial from-teal-500/10 via-teal-500/3 to-transparent blur-3xl pointer-events-none" />

            {/* Elliptical Orbital Track (Surrounding the Vertical Portrait) */}
            <div className="absolute inset-1 sm:-inset-3 rounded-[54px] sm:rounded-[60px] border border-dashed border-teal-200/80 pointer-events-none animate-pulse-subtle" />

            {/* Animated 3D Tooth Badge - Top Left */}
            <div className="absolute -top-4 sm:-top-5 left-4 sm:left-6 z-20 pointer-events-auto cursor-pointer animate-tooth-float">
              <div className="size-12 sm:size-14 rounded-2xl bg-gradient-to-br from-teal-500 via-teal-600 to-teal-700 text-white flex items-center justify-center shadow-xl shadow-teal-700/35 border-2 border-white hover:scale-115 transition-transform">
                <ToothIcon className="size-7 text-white drop-shadow-xs" />
              </div>
            </div>

            {/* Animated Question Badge 1 (Sky Blue) - Top Right */}
            <div className="absolute -top-3 sm:-top-4 -right-2 sm:-right-3 z-20 animate-float-1">
              <div className="size-10 sm:size-11 rounded-full bg-sky-500 text-white font-black text-sm flex items-center justify-center shadow-lg shadow-sky-500/35 border-2 border-white hover:scale-110 transition-transform">
                ?
              </div>
            </div>

            {/* Animated Sparkle Tooth Accent - Upper Left */}
            <div className="absolute top-1/4 -left-4 sm:-left-5 z-20 animate-float-3">
              <div className="size-8 sm:size-9 rounded-full bg-white text-teal-600 flex items-center justify-center shadow-md border border-teal-100 hover:scale-110 transition-transform">
                <AutoAwesomeOutlinedIcon className="size-4 text-teal-600" />
              </div>
            </div>

            {/* Animated Question Badge 2 (Emerald Green) - Mid Left */}
            <div className="absolute top-1/2 -left-3 sm:-left-4 -translate-y-1/2 z-20 animate-float-2">
              <div className="size-10 sm:size-11 rounded-full bg-emerald-500 text-white font-black text-sm flex items-center justify-center shadow-lg shadow-emerald-500/35 border-2 border-white hover:scale-110 transition-transform">
                ?
              </div>
            </div>

            {/* Animated Question Badge 3 (Amber/Orange) - Mid Right */}
            <div className="absolute top-1/3 -right-3 sm:-right-4 z-20 animate-float-3">
              <div className="size-9 sm:size-10 rounded-full bg-amber-500 text-white font-black text-xs flex items-center justify-center shadow-lg shadow-amber-500/35 border-2 border-white hover:scale-110 transition-transform">
                ?
              </div>
            </div>

            {/* Animated Medical Verified Badge - Lower Right */}
            <div className="absolute bottom-24 -right-3 sm:-right-4 z-20 animate-float-4">
              <div className="size-9 sm:size-10 rounded-full bg-white text-emerald-600 flex items-center justify-center shadow-lg shadow-slate-300/50 border border-emerald-200 hover:scale-110 transition-transform">
                <CheckCircleOutlineOutlinedIcon className="size-5 text-emerald-600" />
              </div>
            </div>

            {/* Animated Question Badge 4 (Rose Pink) - Bottom Left */}
            <div className="absolute bottom-14 -left-2 sm:-left-3 z-20 animate-float-1">
              <div className="size-8 sm:size-9 rounded-full bg-rose-500 text-white font-black text-xs flex items-center justify-center shadow-md shadow-rose-500/35 border-2 border-white hover:scale-110 transition-transform">
                ?
              </div>
            </div>

            {/* Secondary Animated Revolving Tooth Badge - Bottom Right */}
            <div className="absolute -bottom-3 right-6 sm:right-8 z-20 pointer-events-auto cursor-pointer animate-tooth-float">
              <div className="size-10 sm:size-11 rounded-full bg-teal-50 border-2 border-teal-300 text-teal-700 flex items-center justify-center shadow-md hover:scale-115 transition-transform">
                <ToothIcon className="size-5 text-teal-600" />
              </div>
            </div>

            {/* Central Vertical Clean Portrait (Happy, Pretty Patient on Pristine Studio Backdrop) */}
            <div className="relative w-[280px] sm:w-[320px] lg:w-[340px] h-[460px] sm:h-[520px] lg:h-[550px] rounded-[44px] sm:rounded-[50px] p-2 bg-gradient-to-b from-teal-100/70 via-white to-slate-100 shadow-2xl shadow-slate-300/40 border border-slate-200/90 z-10 overflow-hidden group">
              <div className="relative size-full rounded-[38px] sm:rounded-[44px] overflow-hidden bg-gradient-to-b from-white via-slate-50 to-teal-50/20 border-2 border-white shadow-inner">
                <Image
                  src={imageSrc}
                  alt="Happy pretty patient smiling with clean dental teeth"
                  fill
                  unoptimized
                  className="object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
                />

                {/* Overlaid Clinical Care Pill at Bottom (Clean & Bright, No Dark Mask) */}
                <div className="absolute bottom-4 left-3 right-3 text-center z-20">
                  <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-teal-200/90 shadow-lg">
                    <ToothIcon className="size-4 text-teal-600" />
                    <span className="text-xs font-black text-slate-900 tracking-tight">
                      Patient Care 24/7 · Pain-Free
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
