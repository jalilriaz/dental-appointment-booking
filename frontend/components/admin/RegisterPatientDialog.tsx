"use client";

import { useState } from "react";
import {
    PersonAddOutlined,
    PersonOutlineOutlined,
    PhoneOutlined,
    EmailOutlined,
    CalendarMonthOutlined,
    WarningAmberOutlined,
    HomeOutlined,
    CheckCircleOutlineOutlined,
    ErrorOutlineOutlined,
} from "@mui/icons-material";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { registerNewPatient } from "@/app/actions/patients";
import type { PatientRow } from "@/app/staff/patients/PatientsTable";

interface RegisterPatientDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: (patient: PatientRow) => void;
}

export default function RegisterPatientDialog({
    open,
    onOpenChange,
    onSuccess,
}: RegisterPatientDialogProps) {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [gender, setGender] = useState<"Male" | "Female" | "Other" | "">("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [medicalAlerts, setMedicalAlerts] = useState("");
    const [address, setAddress] = useState("");

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successFeedback, setSuccessFeedback] = useState<string | null>(null);

    const resetForm = () => {
        setName("");
        setPhone("");
        setEmail("");
        setGender("");
        setDateOfBirth("");
        setMedicalAlerts("");
        setAddress("");
        setErrorMessage(null);
        setSuccessFeedback(null);
    };

    const handleDialogClose = (isOpen: boolean) => {
        if (!isOpen) {
            resetForm();
        }
        onOpenChange(isOpen);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage(null);
        setSuccessFeedback(null);

        if (!name.trim()) {
            setErrorMessage("Please enter patient's full name.");
            return;
        }

        if (!phone.trim()) {
            setErrorMessage("Please enter a valid contact phone number.");
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await registerNewPatient({
                name,
                phone,
                email: email || undefined,
                gender: gender || undefined,
                dateOfBirth: dateOfBirth || undefined,
                medicalAlerts: medicalAlerts || undefined,
                address: address || undefined,
            });

            if (!res.success || !res.patient) {
                setErrorMessage(res.error || "Failed to register patient.");
                setIsSubmitting(false);
                return;
            }

            setSuccessFeedback(`Patient registered successfully with MRN #${res.patient.patientCode}!`);

            if (onSuccess) {
                onSuccess(res.patient as PatientRow);
            }

            setTimeout(() => {
                handleDialogClose(false);
            }, 800);
        } catch (err: any) {
            setErrorMessage(err?.message || "An unexpected error occurred.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleDialogClose}>
            <DialogContent className="sm:max-w-lg p-0 overflow-hidden rounded-3xl border border-slate-200/90 shadow-2xl bg-white max-h-[92vh] flex flex-col font-sans">
                {/* ─── Header with Close Button Clearance ─── */}
                <div className="bg-gradient-to-b from-slate-50 to-white px-6 pt-6 pb-4 border-b border-slate-200/70">
                    <DialogHeader className="pr-12 sm:pr-14 text-left">
                        <div className="flex items-center gap-3">
                            <div className="size-10 rounded-2xl bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center shrink-0 shadow-2xs">
                                <PersonAddOutlined sx={{ fontSize: 22 }} />
                            </div>
                            <div>
                                <DialogTitle className="text-lg sm:text-xl font-black text-[#0B1528] tracking-tight">
                                    Register New Patient
                                </DialogTitle>
                                <DialogDescription className="text-xs font-medium text-slate-500 mt-0.5">
                                    Enrolls patient into electronic registry with auto-assigned MRN.
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                </div>

                {/* ─── Scrollable Form Body ─── */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
                    {/* Feedback Banners */}
                    {errorMessage && (
                        <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200/90 flex items-start gap-2.5 text-rose-700 text-xs font-semibold animate-in fade-in duration-200">
                            <ErrorOutlineOutlined sx={{ fontSize: 18 }} className="shrink-0 mt-0.5" />
                            <span>{errorMessage}</span>
                        </div>
                    )}
                    {successFeedback && (
                        <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200/90 flex items-start gap-2.5 text-emerald-800 text-xs font-semibold animate-in fade-in duration-200">
                            <CheckCircleOutlineOutlined sx={{ fontSize: 18 }} className="shrink-0 mt-0.5 text-emerald-600" />
                            <span>{successFeedback}</span>
                        </div>
                    )}

                    {/* Section 1: Core Identity */}
                    <div className="space-y-3.5">
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                                <PersonOutlineOutlined sx={{ fontSize: 14 }} className="text-teal-600" />
                                <span>Full Name *</span>
                            </Label>
                            <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Sarah Khan"
                                required
                                disabled={isSubmitting}
                                className="h-10 text-xs sm:text-sm font-medium rounded-xl border-slate-200 focus-visible:ring-2 focus-visible:ring-teal-500/20"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                                    <PhoneOutlined sx={{ fontSize: 14 }} className="text-teal-600" />
                                    <span>Phone / WhatsApp *</span>
                                </Label>
                                <Input
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="0300 1234567"
                                    required
                                    disabled={isSubmitting}
                                    className="h-10 text-xs sm:text-sm font-medium rounded-xl border-slate-200 focus-visible:ring-2 focus-visible:ring-teal-500/20"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                                    <EmailOutlined sx={{ fontSize: 14 }} className="text-teal-600" />
                                    <span>Email (Optional)</span>
                                </Label>
                                <Input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="patient@example.com"
                                    disabled={isSubmitting}
                                    className="h-10 text-xs sm:text-sm font-medium rounded-xl border-slate-200 focus-visible:ring-2 focus-visible:ring-teal-500/20"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Demographics */}
                    <div className="pt-2 border-t border-slate-100 space-y-3.5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold text-slate-700">Gender</Label>
                                <div className="grid grid-cols-3 gap-1.5">
                                    {(["Male", "Female", "Other"] as const).map((g) => (
                                        <button
                                            key={g}
                                            type="button"
                                            disabled={isSubmitting}
                                            onClick={() => setGender(gender === g ? "" : g)}
                                            className={`h-9 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                                                gender === g
                                                    ? "bg-teal-50 border-teal-500 text-teal-800 shadow-2xs"
                                                    : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                                            }`}
                                        >
                                            {g}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                                    <CalendarMonthOutlined sx={{ fontSize: 14 }} className="text-teal-600" />
                                    <span>Date of Birth</span>
                                </Label>
                                <DatePicker
                                    value={dateOfBirth}
                                    onChange={setDateOfBirth}
                                    max={new Date().toISOString().split("T")[0]}
                                    placeholder="Select date of birth"
                                    disabled={isSubmitting}
                                    compact
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Clinical Alerts / Precautions */}
                    <div className="pt-2 border-t border-slate-100 space-y-1.5">
                        <Label className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                            <WarningAmberOutlined sx={{ fontSize: 15 }} className="text-amber-600" />
                            <span>Medical Alerts & Allergies (Optional)</span>
                        </Label>
                        <Input
                            value={medicalAlerts}
                            onChange={(e) => setMedicalAlerts(e.target.value)}
                            placeholder="e.g. Allergic to Penicillin, Diabetic, Hypertension"
                            disabled={isSubmitting}
                            className="h-10 text-xs sm:text-sm font-medium rounded-xl border-amber-200/80 bg-amber-50/30 text-amber-950 placeholder:text-amber-700/50 focus-visible:ring-2 focus-visible:ring-amber-500/20"
                        />
                        <p className="text-[10px] font-medium text-slate-400">
                            Flagged precautions will be highlighted on appointment checkouts and clinical charts.
                        </p>
                    </div>

                    {/* Section 4: Address */}
                    <div className="pt-2 border-t border-slate-100 space-y-1.5">
                        <Label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                            <HomeOutlined sx={{ fontSize: 14 }} className="text-slate-500" />
                            <span>Residential Address / City</span>
                        </Label>
                        <Input
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="e.g. House #14, Sector F-8/2, Islamabad"
                            disabled={isSubmitting}
                            className="h-10 text-xs sm:text-sm font-medium rounded-xl border-slate-200 focus-visible:ring-2 focus-visible:ring-teal-500/20"
                        />
                    </div>
                </form>

                {/* ─── Footer Actions ─── */}
                <div className="px-6 py-4 bg-slate-50/80 border-t border-slate-200/70 flex items-center justify-end gap-2.5">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleDialogClose(false)}
                        disabled={isSubmitting}
                        className="h-9 px-4 rounded-xl text-xs font-bold border-slate-200 text-slate-600 hover:bg-slate-100 cursor-pointer"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting || !name.trim() || !phone.trim()}
                        className="h-9 px-5 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-xs cursor-pointer gap-1.5 disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <span>Registering...</span>
                        ) : (
                            <>
                                <PersonAddOutlined sx={{ fontSize: 16 }} />
                                <span>Register Patient</span>
                            </>
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

