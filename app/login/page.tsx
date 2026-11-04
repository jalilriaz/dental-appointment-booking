"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Eye, EyeOff, Phone } from "lucide-react";
import SimpleNavbar from "@/components/SimpleNavbar";
import { clinicInfo } from "@/app/constants/mockData";

export default function LoginPage() {
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
            const res = await fetch("/api/auth/login", {
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
                    router.push("/reception");
                } else {
                    setError("Patient web portal has moved to WhatsApp. Please message us on WhatsApp to manage your visits.");
                    setLoading(false);
                    return;
                }
                router.refresh();
            } else {
                setError(data.error || "Invalid credentials");
            }
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 relative overflow-hidden">
            <SimpleNavbar />
            {/* Subtle glow */}
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-teal-100/40 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-emerald-100/30 rounded-full blur-3xl pointer-events-none" />

            <div className="w-full max-w-md px-4 relative animate-fade-in-up">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2.5 text-2xl font-bold text-slate-900">
                        <div className="size-10 rounded-full bg-teal-600 flex items-center justify-center text-white shadow-md shadow-teal-600/20">
                            <span className="text-lg font-bold">E</span>
                        </div>
                        Elite <span className="text-teal-600">Dental</span>
                    </Link>
                </div>

                <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-xl">
                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-extrabold text-slate-900">Staff & Admin Portal</h1>
                        <p className="text-sm text-slate-600 mt-1">Sign in with your staff or administrator credentials</p>
                    </div>

                    {/* Patient Notice Banner */}
                    <div className="mb-6 p-4 rounded-xl bg-teal-50 border border-teal-200 text-center">
                        <p className="text-xs font-bold text-teal-900 uppercase tracking-wider">Are you a patient?</p>
                        <p className="text-xs text-teal-800 mt-1">
                            The patient portal has moved to WhatsApp. Book, reschedule, or view appointments directly in chat!
                        </p>
                        <a
                            href={`https://wa.me/${clinicInfo.whatsapp}?text=${encodeURIComponent("Hi, I am a patient and would like to manage my appointments")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2.5 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs transition-all"
                        >
                            <Phone className="size-3.5" /> Chat on WhatsApp
                        </a>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-slate-700 font-semibold text-sm">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="h-11 bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-teal-600 focus:ring-teal-500/20 shadow-xs"
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-slate-700 font-semibold text-sm">Password</Label>
                                <Link
                                    href="/forgot-password"
                                    className="text-xs font-semibold text-teal-700 hover:text-teal-800 transition-premium"
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
                                    className="h-11 pr-10 bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-teal-600 focus:ring-teal-500/20 shadow-xs"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 transition-premium"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg font-medium">
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full h-11 bg-teal-600 hover:bg-teal-700 text-white font-semibold border-0 shadow-md shadow-teal-600/20 hover:shadow-lg active:scale-[0.98] transition-premium"
                            disabled={loading}
                        >
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {loading ? "Signing in..." : "Sign In to Portal"}
                        </Button>
                    </form>

                    <div className="mt-5 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                        <p className="text-xs font-semibold text-slate-600 mb-2.5 text-center">
                            Staff Quick-Fill Credentials:
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setEmail("jalilriaz990@gmail.com");
                                    setPassword("admin123");
                                }}
                                className="p-2 text-left rounded-lg bg-white hover:bg-teal-50 border border-slate-200 hover:border-teal-300 transition-all text-xs group shadow-2xs"
                            >
                                <div className="font-bold text-slate-900 group-hover:text-teal-800">👑 Admin</div>
                                <div className="text-[11px] text-slate-500 font-mono">/admin</div>
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setEmail("staff1@elitedental.com");
                                    setPassword("staff123");
                                }}
                                className="p-2 text-left rounded-lg bg-white hover:bg-teal-50 border border-slate-200 hover:border-teal-300 transition-all text-xs group shadow-2xs"
                            >
                                <div className="font-bold text-slate-900 group-hover:text-teal-800">📋 Receptionist</div>
                                <div className="text-[11px] text-slate-500 font-mono">/reception</div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
