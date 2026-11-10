"use client";
import { fetchApi } from "@/lib/api-client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AutorenewOutlined,
  VisibilityOutlined,
  VisibilityOffOutlined,
  LockOutlined,
  ArrowBackOutlined,
  ShieldOutlined,
  VerifiedUserOutlined,
  LocationOnOutlined,
  CheckCircleOutlineOutlined,
  AccessTimeOutlined,
  KeyOutlined,
  Star,
} from "@mui/icons-material";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  if (!token) {
    return (
      <div className="text-center py-6 space-y-4">
        <div className="size-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto shadow-sm">
          <KeyOutlined sx={{ fontSize: 28 }} />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-black text-slate-900 tracking-tight">Missing or Expired Token</h2>
          <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
            This password reset link is invalid, expired, or already used. Please request a fresh reset link to continue.
          </p>
        </div>
        <Button asChild className="btn-brand border-0 h-10 text-xs font-semibold cursor-pointer">
          <Link href="/forgot-password" className="inline-flex items-center gap-1.5">
            <ArrowBackOutlined sx={{ fontSize: 16 }} />
            <span>Request New Reset Link</span>
          </Link>
        </Button>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      setStatus("error");
      return;
    }

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetchApi("/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, password }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage("Your clinical staff password has been reset successfully.");
        setTimeout(() => router.push("/login"), 2500);
      } else {
        setStatus("error");
        setMessage(data.error || "Failed to reset password. The link may have expired.");
      }
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please verify your connection and try again.");
    }
  }

  return (
    <div>
      <div className="text-center mb-6">
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-2xl bg-teal-50 border border-teal-200 shadow-sm text-teal-600">
          <LockOutlined sx={{ fontSize: 24 }} />
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Set New Password</h1>
        <p className="text-xs text-slate-500 mt-1 font-medium">
          Create a strong password for your staff clinical portal account.
        </p>
      </div>

      {status === "success" ? (
        <div className="text-center space-y-4 py-3">
          <div className="p-4 bg-teal-50 text-teal-900 border border-teal-200 rounded-2xl text-xs font-semibold space-y-2">
            <div className="flex items-center justify-center gap-1.5 text-teal-700">
              <CheckCircleOutlineOutlined sx={{ fontSize: 20 }} />
              <span className="font-bold">Password Updated</span>
            </div>
            <p className="text-[11px] text-teal-800 leading-relaxed">{message}</p>
            <p className="text-[10px] text-teal-600 font-medium">Redirecting to login portal in 2.5 seconds...</p>
          </div>
          <Button asChild className="w-full btn-brand border-0 h-11 text-xs font-semibold cursor-pointer">
            <Link href="/login">Sign In With New Password</Link>
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-slate-700 text-xs font-bold">
              New Password <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                required
                className="h-11 bg-white border-slate-300 text-slate-900 text-xs pr-10 focus:border-teal-600 rounded-xl"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
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

          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword" className="text-slate-700 text-xs font-bold">
              Confirm New Password <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                required
                className="h-11 bg-white border-slate-300 text-slate-900 text-xs pr-10 focus:border-teal-600 rounded-xl"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? (
                  <VisibilityOffOutlined sx={{ fontSize: 18 }} />
                ) : (
                  <VisibilityOutlined sx={{ fontSize: 18 }} />
                )}
              </button>
            </div>
          </div>

          {status === "error" && (
            <div className="text-xs text-red-700 bg-red-50 border border-red-200 p-3 rounded-xl font-medium">
              {message}
            </div>
          )}

          <Button
            type="submit"
            className="w-full h-11 btn-brand border-0 font-bold shadow-md shadow-teal-600/20 active:scale-[0.98] transition-all text-xs cursor-pointer"
            disabled={status === "loading"}
          >
            {status === "loading" && <AutorenewOutlined sx={{ fontSize: 16 }} className="mr-2 animate-spin" />}
            {status === "loading" ? "Updating Password..." : "Update Password & Continue"}
          </Button>

          <div className="pt-2 text-center">
            <Link
              href="/login"
              className="text-xs font-semibold text-slate-500 hover:text-teal-700 inline-flex items-center gap-1 transition-colors"
            >
              <ArrowBackOutlined sx={{ fontSize: 14 }} />
              <span>Cancel and return to login</span>
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* ──────────────────────────────────────────────────────────────────
          LEFT SECTION: Brand & Clinical Excellence Showcase
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
                  Clinical Credentials
                </div>
                <h3 className="text-base font-extrabold text-white tracking-tight">Staff Security</h3>
                <p className="text-xs text-slate-400 font-medium">Dr. Sheriyaar Clinical Care</p>
                <div className="flex items-center gap-1 text-amber-400 pt-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} sx={{ fontSize: 13 }} />
                  ))}
                  <span className="text-[11px] font-bold text-slate-300 ml-1">Verified Portal</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed italic border-t border-white/10 mt-3 pt-3">
              &ldquo;Please configure a secure password with at least 6 characters. Your credentials encrypt and safeguard all patient booking histories and clinical treatment logs.&rdquo;
            </p>
          </div>

          {/* Security Features */}
          <div className="space-y-2">
            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center gap-3">
              <div className="size-8 rounded-xl bg-teal-500/15 text-teal-400 flex items-center justify-center shrink-0">
                <ShieldOutlined sx={{ fontSize: 18 }} />
              </div>
              <div className="text-xs">
                <span className="font-bold text-white block">Salted & Hashed Encryption</span>
                <span className="text-[11px] text-slate-400">Passwords are never stored in plaintext</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center gap-3">
              <div className="size-8 rounded-xl bg-teal-500/15 text-teal-400 flex items-center justify-center shrink-0">
                <CheckCircleOutlineOutlined sx={{ fontSize: 18 }} />
              </div>
              <div className="text-xs">
                <span className="font-bold text-white block">Immediate Activation</span>
                <span className="text-[11px] text-slate-400">Instantly valid across all administrative workflows</span>
              </div>
            </div>
          </div>

          {/* Key Metric Highlights Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 space-y-0.5">
              <div className="flex items-center gap-1 text-teal-400 text-xs font-black">
                <CheckCircleOutlineOutlined sx={{ fontSize: 14 }} />
                <span>Zero-Trust</span>
              </div>
              <p className="text-[10px] text-slate-400">Clinical Data Protection</p>
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
          RIGHT SECTION: Reset Password Form
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

        {/* Password Reset Card Container */}
        <div className="w-full max-w-md bg-white border border-slate-200/80 shadow-xl rounded-3xl p-8 sm:p-10 text-slate-900 relative">
          <Suspense
            fallback={
              <div className="text-center py-12 space-y-3">
                <AutorenewOutlined sx={{ fontSize: 24 }} className="animate-spin text-teal-600 mx-auto" />
                <p className="text-xs text-slate-500 font-medium">Validating reset session...</p>
              </div>
            }
          >
            <ResetPasswordForm />
          </Suspense>
        </div>

        <p className="text-center text-[11px] text-slate-400 font-medium mt-6">
          Elite Dental Clinic · G-8 Markaz Islamabad · Staff & Administration Security
        </p>
      </div>
    </div>
  );
}
