"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Eye, EyeOff } from "lucide-react";
import SimpleNavbar from "@/components/SimpleNavbar";

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
                } else if (data.user.role === "PATIENT") {
                    router.push("/portal");
                } else {
                    router.push("/");
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
        <div className="flex min-h-screen items-center justify-center bg-background relative overflow-hidden">
            <SimpleNavbar />
            {/* Glow orbs */}
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-3xl" />

            <div className="w-full max-w-md px-4 relative animate-fade-in-up">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2.5 text-2xl font-bold text-white">
                        <div className="size-10 rounded-full gradient-primary flex items-center justify-center text-white shadow-lg shadow-teal-500/20">
                            <span className="text-lg font-bold">E</span>
                        </div>
                        Elite <span className="text-teal-400">Dental</span>
                    </Link>
                </div>

                <div className="glass-card rounded-2xl p-8">
                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
                        <p className="text-sm text-slate-400 mt-1">Sign in to your account to continue</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-slate-300">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="h-11 bg-white/[0.04] border-white/10 text-white placeholder:text-slate-500 focus:border-teal-500/50 focus:ring-teal-500/20"
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-slate-300">Password</Label>
                                <Link
                                    href="/forgot-password"
                                    className="text-xs font-medium text-teal-400 hover:text-teal-300 transition-premium"
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
                                    className="h-11 pr-10 bg-white/[0.04] border-white/10 text-white placeholder:text-slate-500 focus:border-teal-500/50 focus:ring-teal-500/20"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-premium"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 text-sm text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg">
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full h-11 gradient-primary-h text-white font-medium border-0 shadow-lg shadow-teal-500/20 hover:shadow-xl hover:shadow-teal-500/25 active:scale-[0.98] transition-premium"
                            disabled={loading}
                        >
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {loading ? "Signing in..." : "Sign In"}
                        </Button>
                    </form>

                    <div className="mt-5 p-3.5 bg-white/[0.03] rounded-xl border border-white/[0.06]">
                        <p className="text-xs font-medium text-slate-400 mb-2.5 text-center">
                            Quick-Fill Test Credentials & Target Routes:
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setEmail("jalilriaz990@gmail.com");
                                    setPassword("admin123");
                                }}
                                className="p-2 text-left rounded-lg bg-white/[0.03] hover:bg-teal-500/10 border border-white/5 hover:border-teal-500/30 transition-all text-xs group"
                            >
                                <div className="font-semibold text-white group-hover:text-teal-400">👑 Admin</div>
                                <div className="text-[11px] text-slate-400 font-mono">/admin</div>
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setEmail("staff1@elitedental.com");
                                    setPassword("staff123");
                                }}
                                className="p-2 text-left rounded-lg bg-white/[0.03] hover:bg-teal-500/10 border border-white/5 hover:border-teal-500/30 transition-all text-xs group"
                            >
                                <div className="font-semibold text-white group-hover:text-teal-400">📋 Receptionist</div>
                                <div className="text-[11px] text-slate-400 font-mono">/reception</div>
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setEmail("patient1@example.com");
                                    setPassword("patient123");
                                }}
                                className="p-2 text-left rounded-lg bg-white/[0.03] hover:bg-teal-500/10 border border-white/5 hover:border-teal-500/30 transition-all text-xs group"
                            >
                                <div className="font-semibold text-white group-hover:text-teal-400">👤 Patient History</div>
                                <div className="text-[11px] text-slate-400 font-mono">/portal</div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
