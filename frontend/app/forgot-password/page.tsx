"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AutorenewOutlinedIcon from "@mui/icons-material/AutorenewOutlined";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";

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
        <div className="flex min-h-screen items-center justify-center bg-slate-50 relative overflow-hidden p-4">
            <div className="w-full max-w-md relative">
                <div className="bg-white border border-slate-200/80 shadow-xl rounded-2xl p-8 text-slate-900">
                    <div className="text-center mb-6">
                        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-teal-50 border border-teal-200 shadow-xs">
                            <EmailOutlinedIcon className="size-6 text-teal-600" />
                        </div>
                        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Forgot Password?</h1>
                        <p className="text-xs text-slate-500 mt-1 font-medium">
                            Enter your registered email address and we&apos;ll send you a secure link to reset your password.
                        </p>
                    </div>

                    {status === "success" ? (
                        <div className="text-center space-y-4">
                            <div className="p-4 bg-teal-50 text-teal-800 border border-teal-200 rounded-xl text-xs font-semibold">
                                {message}
                            </div>
                            <Button asChild className="w-full border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold h-10" variant="outline">
                                <Link href="/login">Back to Login</Link>
                            </Button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="email" className="text-slate-700 text-xs font-semibold">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={status === "loading"}
                                    className="h-10 bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 text-xs focus:border-teal-600"
                                />
                            </div>

                            {status === "error" && (
                                <div className="text-xs text-red-700 bg-red-50 border border-red-200 p-2.5 rounded-lg font-medium">
                                    {message}
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="w-full h-10 btn-brand border-0 text-white shadow-md shadow-teal-600/20 active:scale-[0.98] transition-all text-xs font-semibold cursor-pointer"
                                disabled={status === "loading"}
                            >
                                {status === "loading" && <AutorenewOutlinedIcon className="mr-2 size-4 animate-spin" />}
                                {status === "loading" ? "Sending Link..." : "Send Reset Link"}
                            </Button>

                            <Button asChild variant="link" className="w-full text-slate-500 hover:text-teal-700 text-xs font-medium cursor-pointer">
                                <Link href="/login" className="flex items-center justify-center gap-1.5">
                                    <ArrowBackOutlinedIcon className="size-3.5" /> Back to Login
                                </Link>
                            </Button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
