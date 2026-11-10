"use client";
import { fetchApi } from "@/lib/api-client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  VisibilityOutlined,
  VisibilityOffOutlined,
  WhatsApp,
  ArrowBackOutlined,
  ShieldOutlined,
  VerifiedUserOutlined,
  LocationOnOutlined,
  CheckCircleOutlineOutlined,
  AccessTimeOutlined,
  MedicalServicesOutlined,
  Star,
} from "@mui/icons-material";
import { CircularProgress } from "@mui/material";
import { clinicInfo } from "@/app/constants/mockData";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  // Prevent browser back button from showing cached authenticated pages after logout
  useEffect(() => {
    window.history.replaceState(null, "", window.location.href);
    const handlePopState = () => {
      window.history.pushState(null, "", window.location.href);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetchApi("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (res.ok && data.success) {
        if (callbackUrl) {
          router.push(callbackUrl);
        } else if (data.user.role === "ADMIN") {
          router.push("/admin");
        } else if (data.user.role === "STAFF") {
          router.push("/staff");
        } else {
          setError("Patient web portal has moved to WhatsApp. Please message us on WhatsApp to manage your visits.");
          setLoading(false);
          return;
        }
        router.refresh();
      } else {
        setError(data.error || "Invalid email or password");
        setLoading(false);
      }
    } catch {
      setError("Something went wrong. Please check your connection.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* ──────────────────────────────────────────────────────────────────
          LEFT SECTION: Rich Brand & Clinical Showcase (Fills the Space)
          ────────────────────────────────────────────────────────────────── */}
      <div className="hidden md:flex md:w-1/2 lg:w-5/12 xl:w-5/12 bg-[#0B1528] text-white p-8 lg:p-10 xl:p-12 flex-col justify-between relative overflow-hidden border-r border-slate-800/80">
        {/* Subtle Ambient Background Glows */}
        <div className="absolute -top-24 -left-24 size-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 size-96 bg-teal-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top: Back Navigation & Brand Identity */}
        <div className="relative z-10 space-y-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-teal-400 transition-colors text-xs font-bold uppercase tracking-wider group"
          >
            <div className="size-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-teal-500 group-hover:border-teal-400 transition-colors text-white">
              <ArrowBackOutlined sx={{ fontSize: 16 }} />
            </div>
            <span>Back to Clinic Site</span>
          </Link>

          <div className="flex items-center gap-3.5">
            <div className="size-12 rounded-2xl bg-teal-600/20 border border-teal-500/30 p-2.5 flex items-center justify-center shadow-lg shadow-teal-500/10">
              <Image
                src="/logo.svg"
                alt="Elite Dental Logo"
                width={32}
                height={32}
                className="w-full h-full object-contain"
                priority
              />
            </div>
            <div>
              <span className="text-xl font-black text-white font-sans tracking-tight block">
                ELITE <span className="text-teal-400">DENTAL</span>
              </span>
              <span className="text-[10px] tracking-widest uppercase font-bold text-teal-400/80 block">
                Center of Advanced Implantology
              </span>
            </div>
          </div>
        </div>

        {/* Center Content: Rich Doctor & Clinical Features Grid */}
        <div className="relative z-10 my-6 space-y-4">
          {/* Dr. Sheriyaar Lead Surgeon Card */}
          <div className="rounded-3xl bg-white/[0.04] border border-white/10 p-5 backdrop-blur-md shadow-2xl">
            <div className="flex items-center gap-4">
              <div className="relative size-20 rounded-2xl overflow-hidden border-2 border-teal-500/50 shadow-lg shrink-0">
                <Image
                  src="/images/dr_sheriyaar.jpg"
                  alt="Dr. Sheriyaar - Lead Dental Surgeon"
                  fill
                  className="object-cover object-top"
                  sizes="80px"
                  priority
                />
              </div>
              <div className="space-y-0.5">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-[10px] font-bold uppercase tracking-wider">
                  <VerifiedUserOutlined sx={{ fontSize: 12 }} />
                  Lead Surgeon
                </div>
                <h3 className="text-base font-extrabold text-white tracking-tight">Dr. Sheriyaar</h3>
                <p className="text-xs text-slate-400 font-medium">BDS, RDS • Implantologist</p>
                <div className="flex items-center gap-1 text-amber-400 pt-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} sx={{ fontSize: 13 }} />
                  ))}
                  <span className="text-[11px] font-bold text-slate-300 ml-1">4.9 (840+ Reviews)</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed italic border-t border-white/10 mt-3 pt-3">
              &ldquo;Welcome to the Elite Dental Clinical Management System. Manage appointments, patient ledgers, and digital treatment plans with precision.&rdquo;
            </p>
          </div>

          {/* Clinical Capabilities List */}
          <div className="space-y-2">
            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center gap-3">
              <div className="size-8 rounded-xl bg-teal-500/15 text-teal-400 flex items-center justify-center shrink-0">
                <MedicalServicesOutlined sx={{ fontSize: 18 }} />
              </div>
              <div className="text-xs">
                <span className="font-bold text-white block">3D Guided Dental Implants</span>
                <span className="text-[11px] text-slate-400">German & American surgical fixture precision</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center gap-3">
              <div className="size-8 rounded-xl bg-teal-500/15 text-teal-400 flex items-center justify-center shrink-0">
                <CheckCircleOutlineOutlined sx={{ fontSize: 18 }} />
              </div>
              <div className="text-xs">
                <span className="font-bold text-white block">Painless Single-Sitting Care</span>
                <span className="text-[11px] text-slate-400">Advanced microscopic rotary endodontics</span>
              </div>
            </div>
          </div>

          {/* Key Metric Highlights Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 space-y-0.5">
              <div className="flex items-center gap-1 text-teal-400 text-xs font-black">
                <CheckCircleOutlineOutlined sx={{ fontSize: 14 }} />
                <span>5,000+ Cases</span>
              </div>
              <p className="text-[10px] text-slate-400">Successful Clinical Surgeries</p>
            </div>
            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 space-y-0.5">
              <div className="flex items-center gap-1 text-teal-400 text-xs font-black">
                <LocationOnOutlined sx={{ fontSize: 14 }} />
                <span>G-8 Markaz</span>
              </div>
              <p className="text-[10px] text-slate-400">1st Floor (Doctors Plaza)</p>
            </div>
          </div>

          {/* Operating Hours Banner */}
          <div className="p-3 rounded-2xl bg-teal-950/40 border border-teal-500/20 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <AccessTimeOutlined sx={{ fontSize: 16, color: "#14B8A6" }} />
              <span className="text-[11px] font-semibold">12:00 PM – 8:00 PM (Mon–Sat)</span>
            </div>
            <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider bg-teal-500/10 px-2 py-0.5 rounded-full border border-teal-500/20">
              Active Shift
            </span>
          </div>
        </div>

        {/* Bottom: Encrypted Portal Badge */}
        <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 border-t border-white/10 pt-4">
          <div className="flex items-center gap-2">
            <ShieldOutlined sx={{ fontSize: 16, color: "#14B8A6" }} />
            <span className="text-[11px]">256-Bit SSL Encrypted Portal</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Online</span>
          </div>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────────────
          RIGHT SECTION: Sign In Form & Auto-fill Actions
          ────────────────────────────────────────────────────────────────── */}
      <div className="w-full md:w-1/2 lg:w-7/12 xl:w-7/12 flex flex-col justify-center items-center p-6 sm:p-10 lg:p-12 relative">
        {/* Mobile Top Bar */}
        <div className="w-full max-w-md md:hidden mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-teal-700 transition-colors text-xs font-bold uppercase tracking-wider"
          >
            <div className="size-8 rounded-full bg-white border border-slate-200 flex items-center justify-center">
              <ArrowBackOutlined sx={{ fontSize: 16 }} />
            </div>
            <span>Home</span>
          </Link>
          <div className="text-right">
            <span className="text-sm font-black text-slate-900">ELITE DENTAL</span>
          </div>
        </div>

        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl p-7 sm:p-8 border border-slate-200/90 shadow-xl shadow-slate-900/5">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-black text-[#0B1528] tracking-tight">Staff & Admin Portal</h1>
              <p className="text-xs text-slate-500 mt-1">Sign in with your staff or administrator credentials</p>
            </div>

            {/* Patient Notice Banner */}
            <div className="mb-6 p-4 rounded-2xl bg-teal-50 border border-teal-200/80 text-center">
              <p className="text-[11px] font-extrabold text-teal-900 uppercase tracking-wider">Are you a patient?</p>
              <p className="text-xs text-teal-800 mt-1 leading-relaxed">
                The patient portal has moved to WhatsApp. Book, reschedule, or view appointments directly in chat!
              </p>
              <a
                href={`https://wa.me/${clinicInfo.whatsapp}?text=${encodeURIComponent("Hi, I am a patient and would like to manage my appointments")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2.5 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
              >
                <WhatsApp sx={{ fontSize: 15 }} />
                <span>Chat on WhatsApp</span>
              </a>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-slate-700 font-bold text-xs uppercase tracking-wider">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11 bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-teal-600 focus:ring-teal-500/20 shadow-2xs rounded-xl text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-slate-700 font-bold text-xs uppercase tracking-wider">
                    Password
                  </Label>
                  <Link
                    href="/forgot-password"
                    className="text-xs font-bold text-teal-700 hover:text-teal-800"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-11 pr-10 bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-teal-600 focus:ring-teal-500/20 shadow-2xs rounded-xl text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <VisibilityOffOutlined sx={{ fontSize: 18 }} />
                    ) : (
                      <VisibilityOutlined sx={{ fontSize: 18 }} />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-3 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-xl font-medium">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-11 bg-[#0B1528] hover:bg-teal-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md shadow-slate-900/15 active:scale-[0.98] transition-all duration-200 cursor-pointer"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <CircularProgress size={16} sx={{ color: "#ffffff" }} />
                    <span>Signing In...</span>
                  </div>
                ) : (
                  "Sign In to Portal"
                )}
              </Button>
            </form>

            {/* Click to Auto-fill Credentials for Testing */}
            <div className="mt-6 p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-2.5 text-center">
                Click to Auto-Fill Credentials:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setEmail("admin@elitedental.com");
                    setPassword("admin123");
                  }}
                  className="p-3 text-left rounded-xl bg-white hover:bg-teal-50 border border-slate-200 hover:border-teal-300 transition-all text-xs group cursor-pointer shadow-2xs"
                >
                  <div className="font-extrabold text-[#0B1528] group-hover:text-teal-800">Admin Account</div>
                  <div className="text-[11px] text-teal-700 font-mono mt-0.5">admin@elitedental.com</div>
                  <div className="text-[10px] text-slate-400 font-mono">Pass: admin123</div>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEmail("staff1@elitedental.com");
                    setPassword("staff123");
                  }}
                  className="p-3 text-left rounded-xl bg-white hover:bg-teal-50 border border-slate-200 hover:border-teal-300 transition-all text-xs group cursor-pointer shadow-2xs"
                >
                  <div className="font-extrabold text-[#0B1528] group-hover:text-teal-800">Receptionist Account</div>
                  <div className="text-[11px] text-teal-700 font-mono mt-0.5">staff1@elitedental.com</div>
                  <div className="text-[10px] text-slate-400 font-mono">Pass: staff123</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <CircularProgress size={32} sx={{ color: "#0d9488" }} />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
