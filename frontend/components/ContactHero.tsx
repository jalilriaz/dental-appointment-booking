"use client";

import React from "react";
import {
  AccessTimeOutlined,
  AutoAwesomeOutlined,
} from "@mui/icons-material";

function ToothIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C8.5 2 6 4.5 6 7.5C6 9.5 6.8 11.2 7.2 13C7.8 15.5 8.2 18.5 9 21.5C9.3 22.3 10.3 22.5 10.8 21.8C11.5 20.8 12 17.5 12 15.5C12 17.5 12.5 20.8 13.2 21.8C13.7 22.5 14.7 22.3 15 21.5C15.8 18.5 16.2 15.5 16.8 13C17.2 11.2 18 9.5 18 7.5C18 4.5 15.5 2 12 2Z" />
    </svg>
  );
}

// Vector Doctor with Surgical Mask & Lab Coat (Exact Reference Match)
function DoctorIllustration({ className = "size-32 sm:size-36" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background Soft Aura */}
      <circle cx="60" cy="60" r="56" fill="#F0FDF4" />
      
      {/* Neck */}
      <path d="M52 66 H68 V80 H52 Z" fill="#FED7AA" />
      
      {/* Doctor White Coat (Chest & Shoulders) */}
      <path
        d="M24 116 C24 92, 38 80, 52 78 L60 92 L68 78 C82 80, 96 92, 96 116 Z"
        fill="#FFFFFF"
        stroke="#E2E8F0"
        strokeWidth="1.5"
      />
      {/* Coat Left & Right Lapels */}
      <path d="M42 80 L52 92 L50 116" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M78 80 L68 92 L70 116" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" />
      
      {/* Inner Scrub Shirt (V-Neck Cyan) */}
      <path d="M50 78 L60 92 L70 78 L60 83 Z" fill="#0284C7" />
      
      {/* Ears */}
      <circle cx="38" cy="56" r="4.5" fill="#FED7AA" />
      <circle cx="82" cy="56" r="4.5" fill="#FED7AA" />
      
      {/* Head / Face */}
      <path
        d="M42 48 C42 34, 50 30, 60 30 C70 30, 78 34, 78 48 C78 58, 72 66, 60 66 C48 66, 42 58, 42 48 Z"
        fill="#FDBA74"
      />
      
      {/* Hair (Neat Dark Hair Matching Reference) */}
      <path
        d="M36 46 C34 32, 44 20, 60 20 C76 20, 86 32, 84 46 C80 34, 74 25, 60 25 C46 25, 40 34, 36 46 Z"
        fill="#0F172A"
      />
      <path
        d="M38 38 C44 28, 54 26, 64 28 C74 30, 80 38, 82 44 C76 34, 64 30, 50 34 Z"
        fill="#1E293B"
      />
      
      {/* Eyebrows */}
      <path d="M48 42 Q52 40 56 42" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />
      <path d="M64 42 Q68 40 72 42" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />
      
      {/* Eyes */}
      <circle cx="52" cy="46" r="2.2" fill="#0F172A" />
      <circle cx="68" cy="46" r="2.2" fill="#0F172A" />
      <circle cx="53" cy="45" r="0.7" fill="#FFFFFF" />
      <circle cx="69" cy="45" r="0.7" fill="#FFFFFF" />
      
      {/* Light Cyan Surgical Face Mask (Matching Reference Image) */}
      <rect x="42" y="52" width="36" height="19" rx="6" fill="#BAE6FD" stroke="#38BDF8" strokeWidth="1" />
      {/* Mask Pleats */}
      <line x1="45" y1="58" x2="75" y2="58" stroke="#38BDF8" strokeWidth="1" strokeLinecap="round" />
      <line x1="45" y1="63" x2="75" y2="63" stroke="#38BDF8" strokeWidth="1" strokeLinecap="round" />
      {/* Mask Ear Loops */}
      <path d="M42 56 C39 56, 38 54, 38 56" stroke="#94A3B8" strokeWidth="1" strokeLinecap="round" />
      <path d="M78 56 C81 56, 82 54, 82 56" stroke="#94A3B8" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

// 3D Glossy White Molar Tooth with Dynamic Cyan Orbit (Step 3 Exact Reference Match)
function GlossyToothIllustration({ className = "size-32 sm:size-36" }: { className?: string }) {
  return (
    <div className={`relative ${className} flex items-center justify-center select-none`}>
      {/* 3D Cyan Orbital Ring (Tilted Horizontally) */}
      <svg
        className="absolute inset-0 w-full h-full -rotate-12 pointer-events-none z-10"
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <ellipse
          cx="60"
          cy="60"
          rx="52"
          ry="15"
          stroke="url(#orbitCyanGradRef)"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id="orbitCyanGradRef" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="60%" stopColor="#0d9488" />
            <stop offset="100%" stopColor="#14b8a6" />
          </linearGradient>
        </defs>
      </svg>

      {/* 3D Glossy Molar Tooth Body */}
      <svg
        className="w-20 sm:w-24 h-24 sm:h-28 z-0 drop-shadow-xl"
        viewBox="0 0 80 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="toothBodyGradRef" x1="0.2" y1="0" x2="0.8" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="70%" stopColor="#F0FDFA" />
            <stop offset="100%" stopColor="#CCFBF1" />
          </linearGradient>
          <linearGradient id="toothShineRef" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        
        {/* Molar Tooth Body & Dual Roots */}
        <path
          d="M16 26 C14 12, 28 6, 40 10 C52 6, 66 12, 64 26 C62 36, 66 48, 62 68 C59 82, 54 94, 48 94 C44 94, 43 84, 42 74 C41 68, 39 68, 38 74 C37 84, 36 94, 32 94 C26 94, 21 82, 18 68 C14 48, 18 36, 16 26 Z"
          fill="url(#toothBodyGradRef)"
          stroke="#99F6E4"
          strokeWidth="2"
        />
        
        {/* Highlight Specular Reflection Curve */}
        <path
          d="M22 22 C24 16, 32 14, 38 16"
          stroke="url(#toothShineRef)"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

export default function ContactHero() {
  return (
    <section className="relative bg-gradient-to-b from-[#F0FDF4]/60 via-[#F8FAFC] to-white border-b border-slate-200/90 pt-16 sm:pt-20 pb-20 lg:pb-24 overflow-hidden">
      {/* Soft Ambient Radial Background Lights */}
      <div className="absolute top-0 left-1/3 w-96 h-96 rounded-full bg-teal-200/20 blur-3xl pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-80 h-80 rounded-full bg-cyan-200/15 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        {/* Top Trust Pill Badge (Matching Reference) */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-xs mb-5">
          <div className="size-5 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center">
            <ToothIcon className="size-3.5 text-teal-600" />
          </div>
          <span className="text-xs font-extrabold text-slate-800 tracking-wide">Trusted Dental Care</span>
        </div>

        {/* Main Headline (Matching Reference Image) */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#0B1528] tracking-tight leading-[1.15]">
          Simple Steps <br />
          <span className="text-teal-600">to a Healthier Smile</span>
        </h1>

        {/* Subtitle Description */}
        <p className="mt-4 text-slate-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-normal">
          Getting the dental care you need is easy. From booking to treatment, we make every step simple and comfortable.
        </p>

        {/* 3-Step Visual Connected Pipeline */}
        <div className="relative mt-16 sm:mt-20 max-w-5xl mx-auto">
          
          {/* Continuous Flowing 3D Gradient Ribbon Pipe (Running Behind Steps) */}
          <div className="hidden md:block absolute top-20 left-12 right-12 h-24 -z-0 pointer-events-none">
            <svg
              className="w-full h-full"
              viewBox="0 0 800 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
            >
              {/* Outer Glow Stroke */}
              <path
                d="M 60 70 C 180 15, 320 115, 450 50 C 580 -5, 680 95, 740 40"
                stroke="#2dd4bf"
                strokeWidth="20"
                strokeOpacity="0.25"
                strokeLinecap="round"
              />
              {/* Core 3D Gradient Pipe */}
              <path
                d="M 60 70 C 180 15, 320 115, 450 50 C 580 -5, 680 95, 740 40"
                stroke="url(#flowGradientContact)"
                strokeWidth="12"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="flowGradientContact" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#0891b2" />
                  <stop offset="45%" stopColor="#0d9488" />
                  <stop offset="80%" stopColor="#14b8a6" />
                  <stop offset="100%" stopColor="#2dd4bf" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Grid of the 3 Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 relative z-10 items-start">
            
            {/* STEP 1: Book Online */}
            <div className="flex flex-col items-center text-center group">
              {/* Visual Card / Illustration */}
              <div className="relative w-44 sm:w-52 h-44 sm:h-52 rounded-full bg-gradient-to-br from-cyan-100/80 via-teal-50/50 to-white flex items-center justify-center p-4 border border-cyan-200/60 shadow-lg shadow-teal-900/5 group-hover:scale-105 transition-transform duration-300">
                {/* Smartphone Mockup (Matching Reference) */}
                <div className="relative w-24 sm:w-28 h-36 sm:h-40 rounded-2xl bg-white border-2 border-teal-500 shadow-xl p-2.5 flex flex-col justify-between -rotate-3 group-hover:rotate-0 transition-transform">
                  {/* Phone Speaker Notch */}
                  <div className="w-8 h-1 rounded-full bg-slate-300 mx-auto" />
                  
                  {/* Calendar Widget Simulation */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between text-[8px] font-bold text-slate-500 px-1">
                      <span>Mon</span>
                      <span>Wed</span>
                      <span>Fri</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1 px-1">
                      <div className="h-2 rounded bg-slate-100" />
                      <div className="h-2 rounded bg-teal-500 shadow-xs" />
                      <div className="h-2 rounded bg-slate-100" />
                      <div className="h-2 rounded bg-slate-100" />
                      <div className="h-2 rounded bg-slate-100" />
                      <div className="h-2 rounded bg-slate-100" />
                    </div>
                  </div>

                  {/* Phone Bottom Booking Action Button */}
                  <div className="h-3.5 rounded-full bg-teal-600 flex items-center justify-center shadow-xs">
                    <span className="text-[7px] font-black text-white uppercase tracking-wider">Book</span>
                  </div>
                </div>

                {/* Floating Clock Badge */}
                <div className="absolute bottom-2 right-2 size-10 rounded-full bg-white border-2 border-teal-400 shadow-lg flex items-center justify-center text-teal-600 animate-float-1">
                  <AccessTimeOutlined sx={{ fontSize: 20 }} />
                </div>
              </div>

              {/* Step Info */}
              <div className="mt-6 flex items-start justify-center gap-3 max-w-xs">
                <span className="size-7 rounded-full bg-teal-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                  01
                </span>
                <div className="text-left">
                  <h3 className="font-extrabold text-[#0B1528] text-base sm:text-lg">
                    Book Online
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-snug">
                    Choose a convenient date and time
                  </p>
                </div>
              </div>
            </div>

            {/* STEP 2: Visit Our Clinic (Exact Illustrated Doctor with Mask Matching Reference) */}
            <div className="flex flex-col items-center text-center group">
              {/* Visual Card / Illustration */}
              <div className="relative w-44 sm:w-52 h-44 sm:h-52 rounded-full bg-gradient-to-br from-cyan-100/80 via-teal-50/50 to-white flex items-center justify-center p-3 border border-cyan-200/60 shadow-lg shadow-teal-900/5 group-hover:scale-105 transition-transform duration-300">
                {/* Clean Vector Doctor with Mask & White Lab Coat */}
                <div className="relative size-32 sm:size-36 rounded-full overflow-hidden border-2 border-white shadow-xl bg-teal-50/60 flex items-center justify-center">
                  <DoctorIllustration className="w-full h-full" />
                </div>

                {/* Floating Circular Blue Tooth Badge in Front (Matching Reference) */}
                <div className="absolute bottom-1 right-2 sm:right-3 size-12 sm:size-14 rounded-full bg-gradient-to-br from-cyan-500 to-teal-600 border-2 border-white shadow-xl flex items-center justify-center text-white animate-float-2">
                  <ToothIcon className="size-6 sm:size-7 text-white drop-shadow-xs" />
                </div>
              </div>

              {/* Step Info */}
              <div className="mt-6 flex items-start justify-center gap-3 max-w-xs">
                <span className="size-7 rounded-full bg-teal-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                  02
                </span>
                <div className="text-left">
                  <h3 className="font-extrabold text-[#0B1528] text-base sm:text-lg">
                    Visit Our Clinic
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-snug">
                    Meet our dental team for a consultation
                  </p>
                </div>
              </div>
            </div>

            {/* STEP 3: Get Your Treatment (3D Molar Tooth with Cyan Orbit Ring Matching Reference) */}
            <div className="flex flex-col items-center text-center group">
              {/* Visual Card / Illustration */}
              <div className="relative w-44 sm:w-52 h-44 sm:h-52 rounded-full bg-gradient-to-br from-cyan-100/80 via-teal-50/50 to-white flex items-center justify-center p-4 border border-cyan-200/60 shadow-lg shadow-teal-900/5 group-hover:scale-105 transition-transform duration-300">
                {/* 3D Glossy White Tooth with Orbit */}
                <GlossyToothIllustration className="size-32 sm:size-36" />

                {/* Floating Sparkling Stars (Matching Reference) */}
                <div className="absolute top-3 right-3 text-teal-500 animate-float-1">
                  <AutoAwesomeOutlined sx={{ fontSize: 24 }} />
                </div>
                <div className="absolute bottom-4 left-3 text-cyan-500 animate-float-3">
                  <AutoAwesomeOutlined sx={{ fontSize: 18 }} />
                </div>
              </div>

              {/* Step Info */}
              <div className="mt-6 flex items-start justify-center gap-3 max-w-xs">
                <span className="size-7 rounded-full bg-teal-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                  03
                </span>
                <div className="text-left">
                  <h3 className="font-extrabold text-[#0B1528] text-base sm:text-lg">
                    Get Your Treatment
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-snug">
                    Receive the treatment with a clear care plan
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
