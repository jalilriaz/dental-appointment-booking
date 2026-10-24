"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, User, CheckCircle2 } from "lucide-react";
import SimpleNavbar from "@/components/SimpleNavbar";

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/register-request", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email }),
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess(true);
            } else {
                setError(data.error || "Something went wrong. Please try again.");
            }
        } catch (err) {
            setError("Failed to connect to server. Please check your internet.");
        } finally {
            setLoading(false);
        }
    }

    if (success) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background relative overflow-hidden">
                <SimpleNavbar />
                <div className="w-full max-w-md px-4 relative z-10">
                    <div className="glass-card p-8 text-center border-emerald-500/20">
                        <div className="size-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 className="size-8 text-emerald-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-4">Check Your Email</h2>
                        <p className="text-slate-400 mb-8">
                            We've sent a secure link to <span className="text-teal-400">{email}</span>.
                            Please click the link to set your password and complete your registration.
                        </p>
                        <Link href="/login">
                            <Button className="w-full btn-brand rounded-xl">Back to Login</Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-background relative overflow-hidden">
            <SimpleNavbar />

            {/* Glow orbs */}
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-3xl opacity-50" />
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-3xl opacity-50" />

            <div className="w-full max-w-md px-4 relative z-10 transition-all duration-500">
                <div className="text-center mb-10">
                    <Link href="/" className="inline-flex items-center gap-3 text-2xl font-bold text-white mb-2">
                        <div className="size-10 rounded-full gradient-primary flex items-center justify-center text-white shadow-lg shadow-teal-500/20">
                            <span className="text-lg">E</span>
                        </div>
                        Elite <span className="text-teal-400">Dental</span>
                    </Link>
                    <p className="text-slate-400">Join Karachi's premier dental centre</p>
                </div>

                <div className="glass-card p-8 rounded-3xl border border-white/10 shadow-2xl">
                    <h1 className="text-xl font-bold text-white mb-6">Create Account</h1>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
                                {error}
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <Label htmlFor="name" className="text-slate-300 ml-1">Full Name</Label>
                            <div className="relative group">
                                <User className="absolute left-3.5 top-1/2 -translate-y-1-2 size-4 text-slate-500 group-focus-within:text-teal-400 transition-colors" />
                                <Input
                                    id="name"
                                    placeholder="Your Name"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="pl-11 h-12 bg-white/[0.03] border-white/10 text-white rounded-xl focus:ring-teal-500/20"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="email" className="text-slate-300 ml-1">Email Address</Label>
                            <div className="relative group">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-500 group-focus-within:text-teal-400 transition-colors" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-11 h-12 bg-white/[0.03] border-white/10 text-white rounded-xl focus:ring-teal-500/20"
                                />
                            </div>
                        </div>

                        <Button
                            disabled={loading}
                            className="w-full h-12 btn-brand rounded-xl font-bold text-base shadow-lg shadow-teal-500/20 mt-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Sending Link...
                                </>
                            ) : (
                                "Send Setup Link"
                            )}
                        </Button>
                    </form>

                    <p className="mt-8 text-center text-sm text-slate-400">
                        Already have an account?{" "}
                        <Link href="/login" className="text-teal-400 hover:text-teal-300 font-semibold underline-offset-4 hover:underline">
                            Login here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
