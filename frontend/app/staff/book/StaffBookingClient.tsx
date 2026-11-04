"use client";

import { useState } from "react";
import BookingForm from "@/components/BookingForm";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Search, ArrowLeft, UserPlus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";

import type { Patient, TreatmentOption as Treatment } from "@/lib/types";

interface StaffBookingClientProps {
    patients: Patient[];
    treatments: Treatment[];
    backUrl?: string;
}

export default function StaffBookingClient({ patients, treatments, backUrl = "/staff" }: StaffBookingClientProps) {
    const [selectedPatientId, setSelectedPatientId] = useState<string>("");

    const [isNewPatientTab, setIsNewPatientTab] = useState(false);
    const [newPatientData, setNewPatientData] = useState({
        name: "",
        email: "",
        phone: "",
        dateOfBirth: "",
    });
    const [isNewPatientConfirmed, setIsNewPatientConfirmed] = useState(false);

    const handleNewPatientChange = (field: string, value: string) => {
        setNewPatientData(prev => ({ ...prev, [field]: value }));
    };

    const showBookingForm = selectedPatientId || (isNewPatientTab && isNewPatientConfirmed);

    const handleProceedNewPatient = () => {
        if (newPatientData.name && newPatientData.phone) {
            setIsNewPatientConfirmed(true);
        }
    };

    const handleReset = () => {
        setSelectedPatientId("");
        setIsNewPatientConfirmed(false);
    };

    const inputClasses = "h-11 bg-white/[0.04] border-white/10 text-white placeholder:text-slate-500 focus:border-teal-500/50 focus:ring-teal-500/20";

    if (showBookingForm) {
        let displayPatient;
        if (selectedPatientId) {
            displayPatient = patients.find(p => p.id === selectedPatientId);
        } else {
            displayPatient = {
                id: "new",
                name: newPatientData.name,
                email: newPatientData.email || "No email provided",
                phone: newPatientData.phone,
                dateOfBirth: newPatientData.dateOfBirth,
            };
        }

        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between glass-card p-4 rounded-xl">
                    <div className="flex items-center gap-4">
                        <div className={`size-10 rounded-full flex items-center justify-center font-bold ${isNewPatientTab ? 'bg-blue-500/10 text-blue-400' : 'bg-teal-500/10 text-teal-400'}`}>
                            {(displayPatient?.name || "P").charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <p className="text-sm text-slate-400">{isNewPatientTab ? "New Patient Booking" : "Booking for"}</p>
                            <p className="font-semibold text-white">{displayPatient?.name}</p>
                            <p className="text-xs text-slate-400">
                                {displayPatient?.phone}
                                {displayPatient?.email && displayPatient.email !== "No email provided" && ` • ${displayPatient.email}`}
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleReset}
                        className="border-slate-700 text-slate-200 hover:bg-white/[0.04]"
                    >
                        Change Patient
                    </Button>
                </div>

                <BookingForm
                    treatments={treatments}
                    patientId={selectedPatientId}
                    newPatientData={isNewPatientTab ? newPatientData : undefined}
                    returnUrl={backUrl}
                />
            </div>
        );
    }

    return (
        <div className="glass-card rounded-2xl max-w-xl mx-auto overflow-hidden">
            <div className="px-6 py-5 border-b border-white/[0.06]">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                    <User className="size-5 text-teal-400" />
                    Select Patient
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                    Search for an existing patient or register a new one.
                </p>
            </div>
            <div className="p-6">
                <Tabs defaultValue="registered" className="w-full" onValueChange={(val) => setIsNewPatientTab(val === "new")}>
                    <TabsList className="grid w-full grid-cols-2 mb-6 bg-white/[0.04]">
                        <TabsTrigger value="registered">Registered Patient</TabsTrigger>
                        <TabsTrigger value="new">New Patient</TabsTrigger>
                    </TabsList>

                    <TabsContent value="registered" className="space-y-6">
                        <div className="space-y-3">
                            <Label className="text-slate-300">Find Patient</Label>
                            <Select value={selectedPatientId} onValueChange={setSelectedPatientId}>
                                <SelectTrigger className={inputClasses}>
                                    <SelectValue placeholder="Search by name or email..." />
                                </SelectTrigger>
                                <SelectContent className="max-h-[300px] bg-slate-900 border-white/[0.06]">
                                    <div className="sticky top-0 p-2 bg-slate-800/80 border-b border-white/[0.06] z-10">
                                        <p className="text-xs text-slate-400 font-medium px-2">Registered Patients</p>
                                    </div>
                                    {patients.map((patient) => (
                                        <SelectItem key={patient.id} value={patient.id} className="py-3 px-4 cursor-pointer text-slate-200 focus:bg-teal-500/10 focus:text-teal-400">
                                            <div className="flex flex-col">
                                                <span className="font-medium">{patient.name}</span>
                                                <span className="text-slate-400 text-xs">{patient.email} {patient.phone ? `• ${patient.phone}` : ""}</span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <p className="text-xs text-slate-400 flex items-center gap-1">
                                <Search className="size-3" />
                                Select a registered patient to proceed.
                            </p>
                        </div>
                    </TabsContent>

                    <TabsContent value="new" className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-slate-300">Full Name <span className="text-red-400">*</span></Label>
                                <Input
                                    id="name"
                                    placeholder="e.g. John Doe"
                                    value={newPatientData.name}
                                    onChange={(e) => handleNewPatientChange("name", e.target.value)}
                                    className={inputClasses}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone" className="text-slate-300">Phone Number <span className="text-red-400">*</span></Label>
                                <Input
                                    id="phone"
                                    placeholder="e.g. +92 300 1234567"
                                    value={newPatientData.phone}
                                    onChange={(e) => handleNewPatientChange("phone", e.target.value)}
                                    className={inputClasses}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-slate-300">Email <span className="text-slate-500 font-normal">(Optional)</span></Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="patient@example.com"
                                    value={newPatientData.email}
                                    onChange={(e) => handleNewPatientChange("email", e.target.value)}
                                    className={inputClasses}
                                />
                                <p className="text-[10px] text-slate-400">Placeholder email generated if blank.</p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="dob" className="text-slate-300">Date of Birth <span className="text-slate-500 font-normal">(Optional)</span></Label>
                                <DatePicker
                                    value={newPatientData.dateOfBirth}
                                    onChange={(val) => handleNewPatientChange("dateOfBirth", val)}
                                    max={new Date().toISOString().split("T")[0]}
                                    placeholder="Select date of birth"
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <Button
                                className="w-full btn-brand border-0 transition-premium active:scale-95"
                                disabled={!newPatientData.name || !newPatientData.phone}
                                onClick={handleProceedNewPatient}
                            >
                                Proceed to Booking
                            </Button>
                        </div>
                    </TabsContent>
                </Tabs>

                <div className="pt-4 border-t border-white/[0.06] flex justify-between items-center mt-4">
                    <Link href={backUrl} className="text-sm text-slate-400 hover:text-teal-400 flex items-center gap-1 transition-premium font-medium">
                        <ArrowLeft className="size-4" /> Back to Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
}
