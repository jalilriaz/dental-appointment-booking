"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ShieldCheck, Eye, EyeOff, CheckCircle2, Phone, Calendar, MapPin, UserIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SimpleNavbar from "@/components/SimpleNavbar";

function SetupPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [dob, setDob] = useState("");
    const [gender, setGender] = useState("");
    const [address, setAddress] = useState("");

    useEffect(() => {
        if (!token) {
            setError("Invalid or missing setup token.");
        }
    }, [token]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/setup-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    token,
                    password,
                    phone,
                    dateOfBirth: dob,
                    gender,
                    address
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess(true);
                setTimeout(() => router.push("/login"), 3000);
            } else {
                setError(data.error || "Failed to set password. Link may have expired.");
            }
        } catch (err) {
            setError("Connection error. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    if (success) {
        return (
            <div className="glass-card p-10 text-center border-emerald-500/20">
                <div className="size-20 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="size-10 text-emerald-400" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">Account Ready!</h2>
                <p className="text-slate-400 mb-8 max-w-sm mx-auto">
                    Your password has been set and your profile is complete. Redirecting you to login...
                </p>
                <div className="flex justify-center">
                    <Loader2 className="animate-spin text-teal-400" />
                </div>
            </div>
        );
    }

    return (
        <Suspense fallback={<Loader2 className="animate-spin text-teal-400" />}>
            <div className="glass-card p-10 rounded-3xl">
                <div className="flex items-center gap-3 mb-8">
                    <div className="size-12 rounded-2xl bg-teal-500/10 flex items-center justify-center">
                        <ShieldCheck className="size-6 text-teal-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Complete Profile</h1>
                        <p className="text-slate-400 text-sm">Set your secure password and details</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                            <Label htmlFor="password">Create Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="h-12 bg-white/[0.03] border-white/10 text-white rounded-xl"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input
                                id="confirmPassword"
                                type={showPassword ? "text" : "password"}
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="h-12 bg-white/[0.03] border-white/10 text-white rounded-xl"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="phone">Phone Number</Label>
                            <div className="relative">
                                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
                                <Input
                                    id="phone"
                                    placeholder="+92 300 1234567"
                                    required
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="pl-11 h-12 bg-white/[0.03] border-white/10 text-white rounded-xl"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="dob">Date of Birth</Label>
                            <div className="relative">
                                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
                                <Input
                                    id="dob"
                                    type="date"
                                    required
                                    value={dob}
                                    onChange={(e) => setDob(e.target.value)}
                                    className="pl-11 h-12 bg-white/[0.03] border-white/10 text-white rounded-xl"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label>Gender</Label>
                            <Select onValueChange={setGender} required>
                                <SelectTrigger className="h-12 bg-white/[0.03] border-white/10 text-white rounded-xl">
                                    <SelectValue placeholder="Select Gender" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="MALE">Male</SelectItem>
                                    <SelectItem value="FEMALE">Female</SelectItem>
                                    <SelectItem value="OTHER">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="address">Address (Optional)</Label>
                            <div className="relative">
                                <MapPin className="absolute left-3.5 top-3.5 size-4 text-slate-500" />
                                <Input
                                    id="address"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    className="pl-11 h-12 bg-white/[0.03] border-white/10 text-white rounded-xl"
                                />
                            </div>
                        </div>
                    </div>

                    <Button
                        disabled={loading || !token}
                        className="w-full h-14 btn-brand rounded-xl font-bold text-lg shadow-xl shadow-teal-500/20 mt-4"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Saving Profile...
                            </>
                        ) : (
                            "Activate My Account"
                        )}
                    </Button>
                </form>
            </div>
        </Suspense>
    );
}

export default function SetupPasswordPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-background relative overflow-hidden py-12">
            <SimpleNavbar />

            <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-teal-500/5 rounded-full blur-3xl opacity-50" />
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl opacity-50" />

            <div className="w-full max-w-4xl px-4 relative z-10">
                <div className="text-center mb-10">
                    <Link href="/" className="inline-flex items-center gap-3 text-3xl font-bold text-white mb-2">
                        <div className="size-12 rounded-full gradient-primary flex items-center justify-center text-white shadow-lg shadow-teal-500/20">
                            E
                        </div>
                        Elite <span className="text-teal-400">Dental</span>
                    </Link>
                </div>

                <Suspense fallback={<div className="text-center p-20"><Loader2 className="animate-spin size-10 mx-auto text-teal-400" /></div>}>
                    <SetupPasswordForm />
                </Suspense>
            </div>
        </div>
    );
}
