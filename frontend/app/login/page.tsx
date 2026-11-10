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
} from "@mui/icons-material";
import { CircularProgress } from "@mui/material";
import SimpleNavbar from "@/components/SimpleNavbar";
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
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center py-12 relative overflow-hidden">
      <SimpleNavbar />

      <div className="w-full max-w-md px-4 relative z-10 pt-10">
        {/* Official Clinic Logo Branding */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="relative size-12 rounded-2xl bg-[#0B1528] p-2 flex items-center justify-center shadow-lg shadow-teal-600/20 group-hover:scale-105 transition-transform duration-300">
              <Image
                src="/logo.svg"
                alt="Elite Dental Logo"
                width={36}
                height={36}
                className="w-full h-full object-contain"
                priority
              />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-2xl font-black text-slate-950 font-sans tracking-tight">
                ELITE <span className="text-teal-600">DENTAL</span>
              </span>
              <span className="text-[10px] tracking-wider uppercase font-semibold text-slate-500">
                Center of Advanced Implantology
              </span>
            </div>
          </Link>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-slate-200/90 shadow-xl">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-black text-slate-950">Staff & Admin Portal</h1>
            <p className="text-xs text-slate-600 mt-1">Sign in with your staff or administrator credentials</p>
          </div>

          {/* Patient Notice Banner */}
          <div className="mb-6 p-4 rounded-2xl bg-teal-50 border border-teal-200 text-center">
            <p className="text-xs font-bold text-teal-900 uppercase tracking-wider">Are you a patient?</p>
            <p className="text-xs text-teal-800 mt-1">
              The patient portal has moved to WhatsApp. Book, reschedule, or view appointments directly in chat!
            </p>
            <a
              href={`https://wa.me/${clinicInfo.whatsapp}?text=${encodeURIComponent("Hi, I am a patient and would like to manage my appointments")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2.5 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs transition-all"
            >
              <WhatsApp sx={{ fontSize: 16 }} />
              <span>Chat on WhatsApp</span>
            </a>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-slate-700 font-bold text-xs uppercase tracking-wider">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11 bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-teal-600 focus:ring-teal-500/20 shadow-xs rounded-xl"
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-slate-700 font-bold text-xs uppercase tracking-wider">Password</Label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-semibold text-teal-700 hover:text-teal-800"
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
                  className="h-11 pr-10 bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-teal-600 focus:ring-teal-500/20 shadow-xs rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
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
              <div className="p-3 text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl font-medium">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-11 bg-[#0B1528] hover:bg-teal-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all duration-200 cursor-pointer"
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

          <div className="mt-6 p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2.5 text-center">
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
                <div className="font-bold text-slate-900 group-hover:text-teal-800">Admin Account</div>
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
                <div className="font-bold text-slate-900 group-hover:text-teal-800">Receptionist Account</div>
                <div className="text-[11px] text-teal-700 font-mono mt-0.5">staff1@elitedental.com</div>
                <div className="text-[10px] text-slate-400 font-mono">Pass: staff123</div>
              </button>
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
