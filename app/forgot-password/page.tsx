"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowLeft, Mail } from "lucide-react";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setStatus("loading");
        setMessage("");

        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                body: JSON.stringify({ email }),
                headers: { "Content-Type": "application/json" },
            });

            const data = await res.json();

            if (res.ok) {
                setStatus("success");
                setMessage(data.message);
            } else {
                setStatus("error");
                setMessage(data.error || "Something went wrong");
            }
        } catch {
            setStatus("error");
            setMessage("Failed to send request. Please try again.");
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-background relative overflow-hidden p-4">
            {/* Glow orbs */}
            <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-teal-500/5 rounded-full blur-3xl" />

            <div className="w-full max-w-md animate-fade-in-up relative">
                <div className="glass-card rounded-2xl p-8">
                    <div className="text-center mb-6">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-teal-500/10 border border-teal-500/20">
                            <Mail className="h-6 w-6 text-teal-400" />
                        </div>
                        <h1 className="text-2xl font-bold text-white">Forgot Password?</h1>
                        <p className="text-sm text-slate-400 mt-1">
                            Enter your email address and we&apos;ll send you a link to reset your password.
                        </p>
                    </div>

                    {status === "success" ? (
                        <div className="text-center space-y-4">
                            <div className="p-4 bg-teal-500/10 text-teal-300 border border-teal-500/20 rounded-lg text-sm">
                                {message}
                            </div>
                            <Button asChild className="w-full border-white/10 text-slate-300 hover:bg-white/[0.04]" variant="outline">
                                <Link href="/login">Back to Login</Link>
                            </Button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-slate-300">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={status === "loading"}
                                    className="h-11 bg-white/[0.04] border-white/10 text-white placeholder:text-slate-500 focus:border-teal-500/50 focus:ring-teal-500/20"
                                />
                            </div>

                            {status === "error" && (
                                <div className="text-sm text-red-300 bg-red-500/10 border border-red-500/20 p-2 rounded">
                                    {message}
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="w-full h-11 gradient-primary-h text-white border-0 shadow-lg shadow-teal-500/20 hover:shadow-xl hover:shadow-teal-500/25 active:scale-[0.98] transition-premium"
                                disabled={status === "loading"}
                            >
                                {status === "loading" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {status === "loading" ? "Sending Link..." : "Send Reset Link"}
                            </Button>

                            <Button asChild variant="link" className="w-full text-slate-400 hover:text-teal-400">
                                <Link href="/login" className="flex items-center gap-2">
                                    <ArrowLeft className="h-4 w-4" /> Back to Login
                                </Link>
                            </Button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
