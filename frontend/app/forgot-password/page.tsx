"use client";
import { fetchApi } from "@/lib/api-client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AutorenewOutlined,
  ArrowBackOutlined,
  EmailOutlined,
  ShieldOutlined,
  VerifiedUserOutlined,
  LocationOnOutlined,
  CheckCircleOutlineOutlined,
  LockResetOutlined,
  AccessTimeOutlined,
  Star,
} from "@mui/icons-material";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetchApi("/api/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage(data.message || "A secure reset link has been sent to your email address.");
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong. Please verify your email.");
      }
    } catch {
      setStatus("error");
      setMessage("Failed to send request. Please check your network connection.");
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* ──────────────────────────────────────────────────────────────────
          LEFT SECTION: Brand & Clinical Excellence Showcase (Matches Login)
          ────────────────────────────────────────────────────────────────── */}
      <div className="hidden md:flex md:w-1/2 lg:w-5/12 xl:w-5/12 bg-[#0B1528] text-white p-8 lg:p-10 xl:p-12 flex-col justify-between relative overflow-hidden border-r border-slate-800/80">
        {/* Subtle Ambient Background Glows */}
        <div className="absolute -top-24 -left-24 size-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 size-96 bg-teal-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top: Back Navigation & Brand Identity */}
        <div className="relative z-10 space-y-6">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-teal-400 transition-colors text-xs font-bold uppercase tracking-wider group"
          >
            <div className="size-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-teal-500 group-hover:border-teal-400 transition-colors text-white">
              <ArrowBackOutlined sx={{ fontSize: 16 }} />
            </div>
            <span>Back to Staff Login</span>
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

        {/* Center Content: Doctor Card & Account Recovery Guidance */}
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
                  Clinical Help Desk
                </div>
                <h3 className="text-base font-extrabold text-white tracking-tight">Staff Security</h3>
                <p className="text-xs text-slate-400 font-medium">Dr. Sheriyaar Clinical Care</p>
                <div className="flex items-center gap-1 text-amber-400 pt-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} sx={{ fontSize: 13 }} />
                  ))}
                  <span className="text-[11px] font-bold text-slate-300 ml-1">Verified Access</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed italic border-t border-white/10 mt-3 pt-3">
              &ldquo;Need help recovering your staff access? Enter your registered email to receive a single-use secure reset link, or contact clinical administration directly.&rdquo;
            </p>
          </div>

          {/* Recovery Features */}
          <div className="space-y-2">
            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center gap-3">
              <div className="size-8 rounded-xl bg-teal-500/15 text-teal-400 flex items-center justify-center shrink-0">
                <LockResetOutlined sx={{ fontSize: 18 }} />
              </div>
              <div className="text-xs">
                <span className="font-bold text-white block">Cryptographic Single-Use Link</span>
                <span className="text-[11px] text-slate-400">Tokens expire automatically after 60 minutes</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center gap-3">
              <div className="size-8 rounded-xl bg-teal-500/15 text-teal-400 flex items-center justify-center shrink-0">
                <CheckCircleOutlineOutlined sx={{ fontSize: 18 }} />
              </div>
              <div className="text-xs">
                <span className="font-bold text-white block">Instant Clinical Dispatch</span>
                <span className="text-[11px] text-slate-400">Delivered directly to your staff email</span>
              </div>
            </div>
          </div>

          {/* Key Metric Highlights Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 space-y-0.5">
              <div className="flex items-center gap-1 text-teal-400 text-xs font-black">
                <CheckCircleOutlineOutlined sx={{ fontSize: 14 }} />
                <span>256-Bit</span>
              </div>
              <p className="text-[10px] text-slate-400">Encrypted Password Vault</p>
            </div>
            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 space-y-0.5">
              <div className="flex items-center gap-1 text-teal-400 text-xs font-black">
                <LocationOnOutlined sx={{ fontSize: 14 }} />
                <span>G-8 Markaz</span>
              </div>
              <p className="text-[10px] text-slate-400">Islamabad Dental Centre</p>
            </div>
          </div>

          {/* Operating Hours Banner */}
          <div className="p-3 rounded-2xl bg-teal-950/40 border border-teal-500/20 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <AccessTimeOutlined sx={{ fontSize: 16, color: "#14B8A6" }} />
              <span className="text-[11px] font-semibold">12:00 PM – 8:00 PM (Mon–Sat)</span>
            </div>
            <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider bg-teal-500/10 px-2 py-0.5 rounded-full border border-teal-500/20">
              Shift Active
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
          RIGHT SECTION: Reset Request Form
          ────────────────────────────────────────────────────────────────── */}
      <div className="w-full md:w-1/2 lg:w-7/12 xl:w-7/12 flex flex-col justify-center items-center p-6 sm:p-10 lg:p-12 relative">
        {/* Mobile Top Bar */}
        <div className="w-full max-w-md md:hidden mb-6 flex items-center justify-between">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-teal-700 transition-colors text-xs font-bold uppercase tracking-wider"
          >
            <div className="size-8 rounded-full bg-white border border-slate-200 flex items-center justify-center">
              <ArrowBackOutlined sx={{ fontSize: 16 }} />
            </div>
            <span>Back to Login</span>
          </Link>
          <div className="text-right">
            <span className="text-sm font-black text-slate-900">ELITE DENTAL</span>
          </div>
        </div>

        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl p-7 sm:p-8 border border-slate-200/90 shadow-xl shadow-slate-900/5">
            <div className="text-center mb-6">
              <div className="mx-auto mb-4 size-12 rounded-2xl bg-teal-50 border border-teal-200 text-teal-600 flex items-center justify-center shadow-xs">
                <EmailOutlined sx={{ fontSize: 24 }} />
              </div>
              <h1 className="text-2xl font-black text-[#0B1528] tracking-tight">Forgot Password?</h1>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Enter your registered clinical email address and we&apos;ll send you a secure link to reset your credentials.
              </p>
            </div>

            {status === "success" ? (
              <div className="text-center space-y-4">
                <div className="p-4 bg-teal-50 text-teal-900 border border-teal-200 rounded-2xl text-xs font-semibold leading-relaxed">
                  <CheckCircleOutlineOutlined sx={{ fontSize: 24, color: "#0D9488" }} className="mx-auto mb-1.5 block" />
                  {message}
                </div>
                <Button
                  asChild
                  className="w-full h-11 bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md shadow-teal-600/20 active:scale-[0.98] transition-all cursor-pointer"
                >
                  <Link href="/login">Back to Login</Link>
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-slate-700 font-bold text-xs uppercase tracking-wider">
                    Registered Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={status === "loading"}
                    className="h-11 bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-teal-600 focus:ring-teal-500/20 shadow-2xs rounded-xl text-sm"
                  />
                </div>

                {status === "error" && (
                  <div className="p-3 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-xl font-medium">
                    {message}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full h-11 bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md shadow-teal-600/20 active:scale-[0.98] transition-all duration-200 cursor-pointer"
                >
                  {status === "loading" ? (
                    <div className="flex items-center justify-center gap-2">
                      <AutorenewOutlined className="animate-spin" sx={{ fontSize: 16 }} />
                      <span>Sending Link...</span>
                    </div>
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>

                <div className="pt-2 text-center">
                  <Link
                    href="/login"
                    className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-slate-500 hover:text-teal-700 transition-colors"
                  >
                    <ArrowBackOutlined sx={{ fontSize: 14 }} />
                    <span>Return to Login</span>
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
