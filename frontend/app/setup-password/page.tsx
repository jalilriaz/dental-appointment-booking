"use client";
import { fetchApi } from "@/lib/api-client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AutorenewOutlinedIcon from "@mui/icons-material/AutorenewOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
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
            const res = await fetchApi("/api/auth/setup-password", {
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
        } catch {
            setError("Connection error. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    if (success) {
        return (
            <div className="bg-white border border-slate-200/80 shadow-xl rounded-2xl p-10 text-center">
                <div className="size-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-4">
                    <CheckCircleOutlineOutlinedIcon className="size-8 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Account Ready!</h2>
                <p className="text-slate-600 text-xs mb-6 max-w-sm mx-auto font-medium">
                    Your password has been set and your clinical profile is complete. Redirecting you to login...
                </p>
                <div className="flex justify-center">
                    <AutorenewOutlinedIcon className="animate-spin text-teal-600 size-6" />
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white border border-slate-200/80 shadow-xl rounded-2xl p-8 sm:p-10 text-slate-900">
            <div className="flex items-center gap-3 mb-6">
                <div className="size-12 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center shrink-0">
                    <VerifiedUserOutlinedIcon className="size-6 text-teal-600" />
                </div>
                <div>
                    <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Complete Profile</h1>
                    <p className="text-slate-500 text-xs font-medium">Set your secure password and clinical details</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                    <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <Label htmlFor="password" className="text-slate-700 text-xs font-semibold">Create Password</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
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
                            type={showPassword ? "text" : "password"}
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="h-10 bg-white border-slate-300 text-slate-900 text-xs focus:border-teal-600"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="phone" className="text-slate-700 text-xs font-semibold">Phone Number</Label>
                        <div className="relative">
                            <PhoneOutlinedIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                            <Input
                                id="phone"
                                placeholder="+92 300 1234567"
                                required
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="pl-9 h-10 bg-white border-slate-300 text-slate-900 text-xs focus:border-teal-600"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="dob" className="text-slate-700 text-xs font-semibold">Date of Birth</Label>
                        <div className="relative">
                            <CalendarTodayOutlinedIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                            <Input
                                id="dob"
                                type="date"
                                required
                                value={dob}
                                onChange={(e) => setDob(e.target.value)}
                                className="pl-9 h-10 bg-white border-slate-300 text-slate-900 text-xs focus:border-teal-600"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-slate-700 text-xs font-semibold">Gender</Label>
                        <Select onValueChange={setGender} required>
                            <SelectTrigger className="h-10 bg-white border-slate-300 text-slate-900 text-xs focus:border-teal-600 w-full">
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
                        <Label htmlFor="address" className="text-slate-700 text-xs font-semibold">Address (Optional)</Label>
                        <div className="relative">
                            <LocationOnOutlinedIcon className="absolute left-3 top-3 size-4 text-slate-400" />
                            <Input
                                id="address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="pl-9 h-10 bg-white border-slate-300 text-slate-900 text-xs focus:border-teal-600"
                            />
                        </div>
                    </div>
                </div>

                <Button
                    disabled={loading || !token}
                    className="w-full h-11 btn-brand border-0 font-semibold text-xs shadow-md shadow-teal-600/20 mt-2 cursor-pointer"
                >
                    {loading ? (
                        <>
                            <AutorenewOutlinedIcon className="mr-2 size-4 animate-spin" />
                            Saving Profile...
                        </>
                    ) : (
                        "Activate My Account"
                    )}
                </Button>
            </form>
        </div>
    );
}

export default function SetupPasswordPage() {
    return (
        <div className="min-h-screen bg-slate-50 relative py-12 px-4 flex flex-col justify-center">
            <SimpleNavbar />

            <div className="w-full max-w-2xl mx-auto relative z-10 pt-12">
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2.5">
                        <div className="relative size-10 rounded-xl overflow-hidden border border-slate-200 shadow-xs flex items-center justify-center bg-white p-1">
                            <Image src="/logo.svg" alt="Elite Dental" width={28} height={28} className="object-contain" />
                        </div>
                        <span className="text-xl font-extrabold tracking-tight text-slate-900">
                            Elite <span className="text-teal-600">Dental</span>
                        </span>
                    </Link>
                </div>

                <Suspense fallback={<div className="text-center p-12"><AutorenewOutlinedIcon className="animate-spin size-8 mx-auto text-teal-600" /></div>}>
                    <SetupPasswordForm />
                </Suspense>
            </div>
        </div>
    );
}
