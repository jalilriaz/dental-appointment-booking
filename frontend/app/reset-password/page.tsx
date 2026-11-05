"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AutorenewOutlinedIcon from "@mui/icons-material/AutorenewOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";

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
                <p className="text-red-700 bg-red-50 p-4 rounded-xl border border-red-200 text-xs font-semibold">
                    Invalid or missing reset token. Please request a new link.
                </p>
                <Link href="/forgot-password" className="text-teal-700 hover:text-teal-800 mt-4 inline-flex items-center gap-1.5 text-xs font-semibold">
                    <ArrowBackOutlinedIcon className="size-3.5" /> Request New Link
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

    return (
        <div className="bg-white border border-slate-200/80 shadow-xl rounded-2xl p-8 w-full max-w-md text-slate-900">
            <div className="text-center mb-6">
                <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-teal-50 border border-teal-200 shadow-xs">
                    <LockOutlinedIcon className="size-6 text-teal-600" />
                </div>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Set New Password</h1>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                    Enter your new secure clinical password below.
                </p>
            </div>

            {status === "success" ? (
                <div className="text-center space-y-4">
                    <div className="p-4 bg-teal-50 text-teal-800 border border-teal-200 rounded-xl text-xs font-semibold">
                        {message}
                        <br />
                        Redirecting to login in 3 seconds...
                    </div>
                    <Button asChild className="w-full btn-brand border-0 h-10 text-xs font-semibold">
                        <Link href="/login">Go to Login Now</Link>
                    </Button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                        <Label htmlFor="password" className="text-slate-700 text-xs font-semibold">New Password</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="h-10 bg-white border-slate-300 text-slate-900 text-xs pr-10 focus:border-teal-600"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                            >
                                {showPassword ? <VisibilityOffOutlinedIcon className="size-4" /> : <VisibilityOutlinedIcon className="size-4" />}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="confirmPassword" className="text-slate-700 text-xs font-semibold">Confirm Password</Label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="h-10 bg-white border-slate-300 text-slate-900 text-xs focus:border-teal-600"
                        />
                    </div>

                    {status === "error" && (
                        <div className="text-xs text-red-700 bg-red-50 border border-red-200 p-2.5 rounded-lg font-medium">
                            {message}
                        </div>
                    )}

                    <Button
                        type="submit"
                        className="w-full h-10 btn-brand border-0 font-semibold shadow-md shadow-teal-600/20 active:scale-[0.98] transition-all text-xs cursor-pointer"
                        disabled={status === "loading"}
                    >
                        {status === "loading" && <AutorenewOutlinedIcon className="mr-2 size-4 animate-spin" />}
                        {status === "loading" ? "Resetting..." : "Reset Password"}
                    </Button>
                </form>
            )}
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 relative overflow-hidden p-4">
            <Suspense fallback={<div className="text-slate-500 text-xs">Loading...</div>}>
                <ResetPasswordForm />
            </Suspense>
        </div>
    );
}
