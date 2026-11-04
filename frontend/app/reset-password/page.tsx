"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, Eye, EyeOff, LockKeyhole } from "lucide-react";

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    if (!token) {
        return (
            <div className="text-center py-8">
                <p className="text-red-300 bg-red-500/10 p-4 rounded-lg border border-red-500/20">
                    Invalid or missing reset token. Please request a new link.
                </p>
                <Link href="/forgot-password" className="text-teal-400 hover:text-teal-300 mt-4 inline-block font-medium transition-premium">
                    ← Go back
                </Link>
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
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                body: JSON.stringify({ token, password }),
                headers: { "Content-Type": "application/json" },
            });

            const data = await res.json();

            if (res.ok) {
                setStatus("success");
                setMessage("Your password has been reset successfully.");
                setTimeout(() => router.push("/login"), 3000);
            } else {
                setStatus("error");
                setMessage(data.error || "Failed to reset password");
            }
        } catch {
            setStatus("error");
            setMessage("Something went wrong. Please try again.");
        }
    }

    const inputClasses = "h-11 bg-white/[0.04] border-white/10 text-white placeholder:text-slate-500 focus:border-teal-500/50 focus:ring-teal-500/20";

    return (
        <div className="glass-card rounded-2xl p-8 w-full max-w-md">
            <div className="text-center mb-6">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-teal-500/10 border border-teal-500/20">
                    <LockKeyhole className="h-6 w-6 text-teal-400" />
                </div>
                <h1 className="text-2xl font-bold text-white">Set New Password</h1>
                <p className="text-sm text-slate-400 mt-1">
                    Enter your new password below.
                </p>
            </div>

            {status === "success" ? (
                <div className="text-center space-y-4">
                    <div className="p-4 bg-teal-500/10 text-teal-300 border border-teal-500/20 rounded-lg text-sm">
                        {message}
                        <br />
                        Redirecting to login in 3 seconds...
                    </div>
                    <Button asChild className="w-full btn-brand rounded-full border-0 transition-premium">
                        <Link href="/login">Go to Login Now</Link>
                    </Button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-slate-300">New Password</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className={`${inputClasses} pr-10`}
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

                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="text-slate-300">Confirm Password</Label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className={inputClasses}
                        />
                    </div>

                    {status === "error" && (
                        <div className="text-sm text-red-300 bg-red-500/10 border border-red-500/20 p-2 rounded">
                            {message}
                        </div>
                    )}

                    <Button
                        type="submit"
                        className="w-full h-11 btn-brand border-0 font-medium rounded-full shadow-lg shadow-teal-500/20 hover:shadow-xl hover:shadow-teal-500/25 active:scale-[0.98] transition-premium"
                        disabled={status === "loading"}
                    >
                        {status === "loading" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {status === "loading" ? "Resetting..." : "Reset Password"}
                    </Button>
                </form>
            )}
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-background relative overflow-hidden p-4">
            <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-teal-500/5 rounded-full blur-3xl" />
            <Suspense fallback={<div className="text-slate-400 text-center">Loading...</div>}>
                <ResetPasswordForm />
            </Suspense>
        </div>
    );
}
