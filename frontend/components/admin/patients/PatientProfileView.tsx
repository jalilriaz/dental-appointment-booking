"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    ArrowBackOutlined,
    PhoneOutlined,
    EmailOutlined,
    CalendarMonthOutlined,
    LocalHospitalOutlined,
    ReceiptLongOutlined,
    CheckCircleOutlineOutlined,
    AccessTimeOutlined,
    AutoAwesomeOutlined,
    PaymentsOutlined,
    AccountBalanceWalletOutlined,
    MedicalServicesOutlined,
    AssignmentOutlined,
    WhatsApp,
    HomeOutlined,
    BadgeOutlined,
    PrintOutlined,
    KeyboardArrowDownOutlined,
    KeyboardArrowUpOutlined,
    SearchOutlined,
    FilterListOutlined,
    CreditCardOutlined,
    LanguageOutlined,
    CheckCircle,
} from "@mui/icons-material";
import { formatPKR, formatDate, formatTime } from "@/lib/utils";
import StatusBadge from "@/components/shared/StatusBadge";
import CreateTreatmentPlan from "@/components/admin/patients/CreateTreatmentPlan";
import RecordPayment from "@/components/admin/patients/RecordPayment";
import SendPrecautionsButton from "@/components/admin/SendPrecautionsButton";
import ReceiptDialog, { ReceiptData } from "@/components/admin/ReceiptDialog";
import SchedulePatientSessionDialog, { PlanBookingContext } from "@/components/shared/SchedulePatientSessionDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export interface PatientProfileViewProps {
    patient: {
        id: string;
        name: string | null;
        email: string | null;
        phone: string | null;
        patientCode?: number | null;
        gender?: string | null;
        dateOfBirth?: Date | string | null;
        address?: string | null;
        medicalAlerts?: string | null;
        createdAt: Date | string;
        appointments: Array<{
            id: string;
            startTime: Date | string;
            endTime: Date | string;
            status: string;
            price: number;
            discount: number;
            amountPaid?: number | null;
            checkoutTime?: Date | string | null;
            notes?: string | null;
            sessionNumber?: number | null;
            sessionLabel?: string | null;
            doctor?: {
                id?: string;
                name: string;
            } | null;
            treatment: {
                id?: string;
                name: string;
                price: number;
                durationMin: number;
            };
            clinicalNotes: Array<{
                id: string;
                treatmentDone: string;
                diagnosis?: string | null;
                prescription?: string | null;
                remarks?: string | null;
                createdAt: Date | string;
            }>;
            payments?: Array<{
                id: string;
                amount: number;
                method: string;
                date: Date | string;
                notes?: string | null;
            }>;
        }>;
        patientTreatments: Array<{
            id: string;
            totalCost: number;
            totalSessions: number;
            clinicalStatus: string;
            financialStatus: string;
            status?: string;
            startDate: Date | string;
            treatment: {
                id?: string;
                name: string;
                description?: string | null;
                price?: number;
                durationMin?: number;
            };
            payments: Array<{
                id: string;
                amount: number;
                date: Date | string;
                method: string;
                notes?: string | null;
            }>;
            appointments?: Array<{
                id: string;
                startTime: Date | string;
                status: string;
                sessionNumber?: number | null;
                sessionLabel?: string | null;
                treatment: { name: string };
            }>;
        }>;
    };
    availableTreatments: Array<{
        id: string;
        name: string;
        price: number;
        durationMin: number;
    }>;
    baseRoute?: "/staff" | "/admin";
}

type TabType = "PLANS" | "ENCOUNTERS" | "PAYMENTS";

export default function PatientProfileView({
    patient,
    availableTreatments,
    baseRoute = "/staff",
}: PatientProfileViewProps) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabType>("PLANS");
    const [expandedPlanIds, setExpandedPlanIds] = useState<Record<string, boolean>>({
        [patient.patientTreatments[0]?.id || ""]: true,
    });
    const [encounterSearch, setEncounterSearch] = useState("");
    const [encounterFilter, setEncounterFilter] = useState<string>("ALL");
    const [receiptData, setReceiptData] = useState<ReceiptData | null>(null);
    const [receiptOpen, setReceiptOpen] = useState(false);
    const [scheduleOpen, setScheduleOpen] = useState(false);
    const [selectedPlanForBooking, setSelectedPlanForBooking] = useState<PlanBookingContext | null>(null);

    // ─── Demographic Age Helper ───
    const getAge = (dob: Date | string | null | undefined) => {
        if (!dob) return null;
        const diffMs = Date.now() - new Date(dob).getTime();
        const ageDate = new Date(diffMs);
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    };
    const patientAge = getAge(patient.dateOfBirth);

    // ─── Financial Telemetry Aggregation ───
    const financialStats = useMemo(() => {
        let totalBilled = 0;
        let totalPaid = 0;

        // Sum from multi-session treatment plans
        patient.patientTreatments.forEach((pt) => {
            totalBilled += pt.totalCost;
            const ptPaid = pt.payments.reduce((sum, p) => sum + p.amount, 0);
            totalPaid += ptPaid;
        });

        // Add standalone appointments (not linked to treatment plans)
        patient.appointments.forEach((apt) => {
            const hasPlanPayment = apt.payments && apt.payments.length > 0;
            if (!hasPlanPayment) {
                const netPrice = Math.max(0, apt.price);
                totalBilled += netPrice;
                if (apt.amountPaid) {
                    totalPaid += apt.amountPaid;
                }
            }
        });

        const outstandingBalance = Math.max(0, totalBilled - totalPaid);
        return { totalBilled, totalPaid, outstandingBalance };
    }, [patient]);

    // ─── Visits Telemetry ───
    const lastVisit = patient.appointments[0];
    const upcomingAppointment = patient.appointments.find(
        (a) => new Date(a.startTime).getTime() > Date.now()
    );

    // ─── WhatsApp Link Builder ───
    const cleanPhoneDigits = patient.phone ? patient.phone.replace(/\D/g, "") : "";
    const whatsAppHref = cleanPhoneDigits
        ? `https://wa.me/${cleanPhoneDigits}?text=${encodeURIComponent(
            `Hello ${patient.name || "Patient"}, reaching out from Elite Dental & Aesthetic Centre regarding your dental records.`
        )}`
        : null;

    // ─── Filtered Encounters ───
    const filteredAppointments = useMemo(() => {
        return patient.appointments.filter((apt) => {
            if (encounterFilter === "COMPLETED" && apt.status !== "COMPLETED") return false;
            if (encounterFilter === "SCHEDULED" && apt.status !== "SCHEDULED" && apt.status !== "CONFIRMED") return false;
            if (encounterFilter === "CANCELLED" && apt.status !== "CANCELLED" && apt.status !== "Not_Visited") return false;

            if (encounterSearch.trim()) {
                const q = encounterSearch.toLowerCase();
                const matchTreatment = apt.treatment?.name?.toLowerCase().includes(q);
                const matchNotes = apt.clinicalNotes?.some(
                    (n) =>
                        n.treatmentDone?.toLowerCase().includes(q) ||
                        n.diagnosis?.toLowerCase().includes(q) ||
                        n.prescription?.toLowerCase().includes(q)
                );
                return matchTreatment || matchNotes;
            }
            return true;
        });
    }, [patient.appointments, encounterFilter, encounterSearch]);

    // ─── All Flattened Payments for Ledger Tab ───
    const allLedgerPayments = useMemo(() => {
        const list: Array<{
            id: string;
            date: Date | string;
            amount: number;
            method: string;
            notes?: string | null;
            sourceType: "PLAN" | "APPOINTMENT";
            treatmentName: string;
            patientTreatmentId?: string;
            appointmentId?: string;
        }> = [];

        patient.patientTreatments.forEach((pt) => {
            pt.payments.forEach((p) => {
                list.push({
                    id: p.id,
                    date: p.date,
                    amount: p.amount,
                    method: p.method,
                    notes: p.notes,
                    sourceType: "PLAN",
                    treatmentName: pt.treatment.name,
                    patientTreatmentId: pt.id,
                });
            });
        });

        patient.appointments.forEach((apt) => {
            if (apt.payments && apt.payments.length > 0) {
                apt.payments.forEach((p) => {
                    list.push({
                        id: p.id,
                        date: p.date,
                        amount: p.amount,
                        method: p.method,
                        notes: p.notes,
                        sourceType: "APPOINTMENT",
                        treatmentName: apt.treatment.name,
                        appointmentId: apt.id,
                    });
                });
            } else if (apt.amountPaid && apt.amountPaid > 0) {
                list.push({
                    id: `apt-${apt.id}`,
                    date: apt.checkoutTime || apt.startTime,
                    amount: apt.amountPaid,
                    method: "CASH",
                    notes: "Checkout settlement",
                    sourceType: "APPOINTMENT",
                    treatmentName: apt.treatment.name,
                    appointmentId: apt.id,
                });
            }
        });

        return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [patient]);

    const handleOpenReceiptForPayment = (payment: (typeof allLedgerPayments)[0]) => {
        const plan = payment.sourceType === "PLAN" && payment.patientTreatmentId
            ? patient.patientTreatments.find((pt) => pt.id === payment.patientTreatmentId)
            : patient.patientTreatments.find((pt) => pt.payments.some((p) => p.id === payment.id));

        if (plan) {
            const totalPlanPaid = plan.payments.reduce((sum, p) => sum + p.amount, 0);
            const remainingDue = Math.max(0, plan.totalCost - totalPlanPaid);
            const planPayments = plan.payments.map((p) => ({
                id: p.id,
                date: String(p.date),
                method: p.method,
                amount: p.amount,
                notes: p.notes,
            }));

            setReceiptData({
                patientName: patient.name || "Valued Patient",
                patientPhone: patient.phone || undefined,
                patientId: patient.id,
                patientCode: patient.patientCode,
                patientAge: patientAge ? `${patientAge} Y` : null,
                patientGender: patient.gender,
                treatmentName: plan.treatment.name,
                appointmentDate: formatDate(payment.date),
                appointmentTime: formatTime(payment.date),
                treatmentPrice: plan.totalCost,
                discount: 0,
                amountPaid: payment.amount,
                remainingBalance: remainingDue,
                payments: planPayments,
                totalPaid: totalPlanPaid,
                dueAmount: remainingDue,
                paymentMethod: payment.method,
            });
        } else {
            setReceiptData({
                patientName: patient.name || "Valued Patient",
                patientPhone: patient.phone || undefined,
                patientId: patient.id,
                patientCode: patient.patientCode,
                patientAge: patientAge ? `${patientAge} Y` : null,
                patientGender: patient.gender,
                treatmentName: payment.treatmentName,
                appointmentDate: formatDate(payment.date),
                appointmentTime: formatTime(payment.date),
                treatmentPrice: payment.amount,
                discount: 0,
                amountPaid: payment.amount,
                remainingBalance: 0,
                payments: [
                    {
                        date: String(payment.date),
                        method: payment.method,
                        amount: payment.amount,
                        notes: payment.notes,
                    },
                ],
                totalPaid: payment.amount,
                dueAmount: 0,
                paymentMethod: payment.method,
            });
        }
        setReceiptOpen(true);
    };

    const handleOpenReceiptForAppointment = (apt: (typeof patient.appointments)[0]) => {
        const linkedPlan = patient.patientTreatments.find((pt) =>
            pt.appointments?.some((a) => a.id === apt.id)
        );

        const net = Math.max(0, apt.price);
        const paid = apt.amountPaid || 0;
        const due = Math.max(0, net - paid);

        if (linkedPlan) {
            const totalPlanPaid = linkedPlan.payments.reduce((sum, p) => sum + p.amount, 0);
            const remainingDue = Math.max(0, linkedPlan.totalCost - totalPlanPaid);
            const planPayments = linkedPlan.payments.map((p) => ({
                id: p.id,
                date: String(p.date),
                method: p.method,
                amount: p.amount,
                notes: p.notes,
            }));

            setReceiptData({
                patientName: patient.name || "Valued Patient",
                patientPhone: patient.phone || undefined,
                patientId: patient.id,
                patientCode: patient.patientCode,
                patientAge: patientAge ? `${patientAge} Y` : null,
                patientGender: patient.gender,
                doctorName: apt.doctor?.name || "Dr. Shehryar Akhtar",
                treatmentName: linkedPlan.treatment.name,
                appointmentDate: formatDate(apt.startTime),
                appointmentTime: formatTime(apt.startTime),
                treatmentPrice: linkedPlan.totalCost,
                discount: apt.discount || 0,
                discountPercent: (apt.discount && linkedPlan.totalCost) ? Math.round((apt.discount / linkedPlan.totalCost) * 100) : undefined,
                amountPaid: paid,
                remainingBalance: remainingDue,
                sessionNumber: apt.sessionNumber,
                payments: planPayments,
                totalPaid: totalPlanPaid,
                dueAmount: remainingDue,
            });
        } else {
            const aptPayments = (apt.payments && apt.payments.length > 0)
                ? apt.payments.map((p) => ({
                    id: p.id,
                    date: String(p.date),
                    method: p.method,
                    amount: p.amount,
                    notes: p.notes,
                }))
                : [
                    {
                        date: String(apt.checkoutTime || apt.startTime),
                        method: "CASH",
                        amount: paid,
                        notes: "Checkout settlement",
                    },
                ];

            setReceiptData({
                patientName: patient.name || "Valued Patient",
                patientPhone: patient.phone || undefined,
                patientId: patient.id,
                patientCode: patient.patientCode,
                patientAge: patientAge ? `${patientAge} Y` : null,
                patientGender: patient.gender,
                doctorName: apt.doctor?.name || "Dr. Shehryar Akhtar",
                treatmentName: apt.treatment.name,
                appointmentDate: formatDate(apt.startTime),
                appointmentTime: formatTime(apt.startTime),
                treatmentPrice: apt.price + (apt.discount || 0),
                discount: apt.discount || 0,
                discountPercent: (apt.discount && (apt.price + (apt.discount || 0))) ? Math.round((apt.discount / (apt.price + (apt.discount || 0))) * 100) : undefined,
                amountPaid: paid,
                remainingBalance: due,
                sessionNumber: apt.sessionNumber,
                payments: aptPayments,
                totalPaid: paid,
                dueAmount: due,
            });
        }
        setReceiptOpen(true);
    };

    return (
        <div className="space-y-6 font-sans">
            {/* ─── Breadcrumb & Top Navigation Bar ─── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
                <div className="flex items-center gap-3.5">
                    <Link
                        href={`${baseRoute}/patients`}
                        className="size-10 rounded-2xl border border-slate-200/90 bg-white text-slate-700 hover:text-[#0B1528] hover:bg-slate-50 transition-all flex items-center justify-center shadow-2xs hover:shadow-xs cursor-pointer shrink-0"
                        title="Return to Patient Directory"
                    >
                        <ArrowBackOutlined sx={{ fontSize: 18 }} />
                    </Link>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200/90 inline-flex items-center gap-1.5 shadow-2xs">
                                <MedicalServicesOutlined sx={{ fontSize: 12 }} className="text-teal-600" />
                                Clinical EHR Dossier
                            </span>
                            <span className="text-slate-300">·</span>
                            <span className="text-xs font-semibold text-slate-500">
                                Verified Health Records
                            </span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-black text-[#0B1528] tracking-tight">
                            Patient Health Record
                        </h1>
                    </div>
                </div>

                {/* Top Quick Actions */}
                <div className="flex items-center gap-2 flex-wrap">
                    <Button
                        type="button"
                        onClick={() => {
                            setSelectedPlanForBooking(null);
                            setScheduleOpen(true);
                        }}
                        className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-2xs transition-all active:scale-[0.98] cursor-pointer"
                    >
                        <CalendarMonthOutlined sx={{ fontSize: 15 }} />
                        <span>+ Book Visit / Session</span>
                    </Button>
                    {whatsAppHref && (
                        <a
                            href={whatsAppHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-bold text-xs shadow-2xs transition-all cursor-pointer"
                        >
                            <WhatsApp sx={{ fontSize: 15 }} className="text-emerald-600" />
                            <span>WhatsApp Reach</span>
                        </a>
                    )}
                    {patient.phone && (
                        <a
                            href={`tel:${patient.phone}`}
                            className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 font-bold text-xs shadow-2xs transition-all cursor-pointer"
                        >
                            <PhoneOutlined sx={{ fontSize: 14 }} className="text-slate-500" />
                            <span>Call</span>
                        </a>
                    )}
                    <CreateTreatmentPlan
                        patientId={patient.id}
                        availableTreatments={availableTreatments}
                    />
                </div>
            </div>

            {/* ─── Hero Patient Identity Card ─── */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-6 sm:p-7 relative overflow-hidden">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                    {/* Left: Avatar & Identity Details */}
                    <div className="flex items-start gap-4 sm:gap-5 min-w-0">
                        <div className="size-16 sm:size-20 rounded-3xl bg-teal-50 text-teal-800 border-2 border-teal-200/90 flex items-center justify-center font-black text-2xl sm:text-3xl shadow-xs shrink-0 select-none">
                            {(patient.name || "P").charAt(0).toUpperCase()}
                        </div>
                        <div className="space-y-1.5 min-w-0">
                            <div className="flex items-center gap-2.5 flex-wrap">
                                <h2 className="text-2xl sm:text-3xl font-black text-[#0B1528] tracking-tight">
                                    {patient.name || "Unnamed Patient"}
                                </h2>
                                {patient.patientCode && (
                                    <span className="text-xs font-mono font-black text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200/90 inline-flex items-center gap-1 shadow-2xs">
                                        <BadgeOutlined sx={{ fontSize: 13 }} />
                                        <span>#{patient.patientCode}</span>
                                    </span>
                                )}
                                {patient.gender && (
                                    <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                                        {patient.gender}
                                        {patientAge !== null ? ` · ${patientAge}y` : ""}
                                    </span>
                                )}
                            </div>

                            <p className="text-xs font-medium text-slate-500 flex items-center gap-2 flex-wrap">
                                <span>Registered with Elite Dental since {formatDate(patient.createdAt, "month-year")}</span>
                                {patient.address && (
                                    <>
                                        <span className="text-slate-300">·</span>
                                        <span className="flex items-center gap-1 text-slate-600">
                                            <HomeOutlined sx={{ fontSize: 14 }} className="text-slate-400" />
                                            <span>{patient.address}</span>
                                        </span>
                                    </>
                                )}
                            </p>
                        </div>
                    </div>
                </div>

                {/* 4 Demographics & Contact Pillars */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5 pt-5 border-t border-slate-100">
                    <div className="p-3 rounded-2xl bg-slate-50/80 border border-slate-200/70">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                            Contact Phone
                        </span>
                        <p className="text-xs sm:text-sm font-bold text-[#0B1528] truncate">
                            {patient.phone || "—"}
                        </p>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50/80 border border-slate-200/70">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                            Email Address
                        </span>
                        <p className="text-xs sm:text-sm font-bold text-[#0B1528] truncate">
                            {patient.email || "No email on record"}
                        </p>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50/80 border border-slate-200/70">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                            Last Visit
                        </span>
                        <p className="text-xs sm:text-sm font-bold text-[#0B1528] truncate">
                            {lastVisit ? formatDate(lastVisit.startTime) : "None yet"}
                        </p>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50/80 border border-slate-200/70">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                            Next Session
                        </span>
                        <p className="text-xs sm:text-sm font-bold text-teal-800 truncate">
                            {upcomingAppointment
                                ? formatDate(upcomingAppointment.startTime, "short")
                                : "None scheduled"}
                        </p>
                    </div>
                </div>
            </div>

            {/* ─── Top 4 KPI Metrics Strip ─── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {/* 1. Encounters */}
                <div className="p-4 rounded-3xl border border-slate-200/90 bg-white shadow-2xs">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                            Total Visits
                        </span>
                        <div className="size-8 rounded-xl bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center">
                            <CalendarMonthOutlined sx={{ fontSize: 16 }} />
                        </div>
                    </div>
                    <p className="text-2xl font-black text-[#0B1528] tracking-tight mt-2">
                        {patient.appointments.length}
                    </p>
                    <p className="text-[11px] font-medium text-slate-500 mt-1">
                        {lastVisit ? `Last on ${formatDate(lastVisit.startTime, "short")}` : "No past encounters"}
                    </p>
                </div>

                {/* 2. Active Plans */}
                <div className="p-4 rounded-3xl border border-slate-200/90 bg-white shadow-2xs">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700">
                            Treatment Plans
                        </span>
                        <div className="size-8 rounded-xl bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center">
                            <AutoAwesomeOutlined sx={{ fontSize: 16 }} />
                        </div>
                    </div>
                    <p className="text-2xl font-black text-[#0B1528] tracking-tight mt-2">
                        {patient.patientTreatments.length}
                    </p>
                    <p className="text-[11px] font-medium text-teal-700 mt-1">
                        Multi-session dental packages
                    </p>
                </div>

                {/* 3. Total Billed Value */}
                <div className="p-4 rounded-3xl border border-slate-200/90 bg-white shadow-2xs">
                    <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                            Total Billed
                        </span>
                        <div className="size-8 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center">
                            <PaymentsOutlined sx={{ fontSize: 16 }} />
                        </div>
                    </div>
                    <p className="text-2xl font-black text-[#0B1528] tracking-tight mt-2">
                        {formatPKR(financialStats.totalBilled)}
                    </p>
                    <p className="text-[11px] font-medium text-emerald-700 mt-1">
                        Settled: {formatPKR(financialStats.totalPaid)}
                    </p>
                </div>

                {/* 4. Outstanding Balance */}
                <div
                    className={`p-4 rounded-3xl border transition-all ${financialStats.outstandingBalance > 0
                            ? "bg-amber-50/70 border-amber-300 shadow-2xs"
                            : "bg-white border-slate-200/90 shadow-2xs"
                        }`}
                >
                    <div className="flex items-center justify-between">
                        <span
                            className={`text-[11px] font-bold uppercase tracking-wider ${financialStats.outstandingBalance > 0 ? "text-amber-800" : "text-slate-500"
                                }`}
                        >
                            Balance Due
                        </span>
                        <div
                            className={`size-8 rounded-xl border flex items-center justify-center ${financialStats.outstandingBalance > 0
                                    ? "bg-amber-100 text-amber-800 border-amber-300"
                                    : "bg-emerald-50 text-emerald-700 border-emerald-200"
                                }`}
                        >
                            <AccountBalanceWalletOutlined sx={{ fontSize: 16 }} />
                        </div>
                    </div>
                    <p
                        className={`text-2xl font-black tracking-tight mt-2 ${financialStats.outstandingBalance > 0 ? "text-amber-900" : "text-emerald-700"
                            }`}
                    >
                        {formatPKR(financialStats.outstandingBalance)}
                    </p>
                    <p
                        className={`text-[11px] font-semibold mt-1 ${financialStats.outstandingBalance > 0 ? "text-amber-700" : "text-emerald-700"
                            }`}
                    >
                        {financialStats.outstandingBalance > 0 ? "Pending collection" : "All ledgers settled"}
                    </p>
                </div>
            </div>

            {/* ─── Interactive Segmented Tabs Navigation ─── */}
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                <button
                    type="button"
                    onClick={() => setActiveTab("PLANS")}
                    className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-2 ${activeTab === "PLANS"
                            ? "bg-[#0B1528] text-white shadow-xs"
                            : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80"
                        }`}
                >
                    <MedicalServicesOutlined sx={{ fontSize: 15 }} />
                    <span>Treatment Plans & Packages</span>
                    <span
                        className={`size-5 rounded-full text-[10px] font-black inline-flex items-center justify-center ${activeTab === "PLANS" ? "bg-teal-500 text-white" : "bg-slate-200 text-slate-700"
                            }`}
                    >
                        {patient.patientTreatments.length}
                    </span>
                </button>

                <button
                    type="button"
                    onClick={() => setActiveTab("ENCOUNTERS")}
                    className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-2 ${activeTab === "ENCOUNTERS"
                            ? "bg-[#0B1528] text-white shadow-xs"
                            : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80"
                        }`}
                >
                    <AssignmentOutlined sx={{ fontSize: 15 }} />
                    <span>Visits & Clinical Charting</span>
                    <span
                        className={`size-5 rounded-full text-[10px] font-black inline-flex items-center justify-center ${activeTab === "ENCOUNTERS" ? "bg-teal-500 text-white" : "bg-slate-200 text-slate-700"
                            }`}
                    >
                        {patient.appointments.length}
                    </span>
                </button>

                <button
                    type="button"
                    onClick={() => setActiveTab("PAYMENTS")}
                    className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-2 ${activeTab === "PAYMENTS"
                            ? "bg-[#0B1528] text-white shadow-xs"
                            : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80"
                        }`}
                >
                    <ReceiptLongOutlined sx={{ fontSize: 15 }} />
                    <span>Payment Ledger & Receipts</span>
                    <span
                        className={`size-5 rounded-full text-[10px] font-black inline-flex items-center justify-center ${activeTab === "PAYMENTS" ? "bg-teal-500 text-white" : "bg-slate-200 text-slate-700"
                            }`}
                    >
                        {allLedgerPayments.length}
                    </span>
                </button>
            </div>

            {/* ═══════════════════════════════════════════════════════════════
                TAB 1: TREATMENT PLANS & MULTI-SESSION PACKAGES
            ═══════════════════════════════════════════════════════════════ */}
            {activeTab === "PLANS" && (
                <div className="space-y-4">
                    {patient.patientTreatments.length === 0 ? (
                        <div className="bg-white rounded-3xl border border-slate-200/90 p-10 text-center shadow-2xs">
                            <div className="size-14 rounded-2xl bg-teal-50 text-teal-600 border border-teal-200 flex items-center justify-center mx-auto mb-3">
                                <AutoAwesomeOutlined sx={{ fontSize: 26 }} />
                            </div>
                            <h3 className="text-base font-black text-[#0B1528]">No Treatment Plans Yet</h3>
                            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-5">
                                Set up a structured multi-session treatment plan (e.g. Braces, Root Canal, Implants) with financial installments.
                            </p>
                            <CreateTreatmentPlan
                                patientId={patient.id}
                                availableTreatments={availableTreatments}
                            />
                        </div>
                    ) : (
                        patient.patientTreatments.map((pt) => {
                            const totalPaid = pt.payments.reduce((sum, p) => sum + p.amount, 0);
                            const remaining = Math.max(0, pt.totalCost - totalPaid);
                            const percentPaid = pt.totalCost > 0 ? Math.min(100, Math.round((totalPaid / pt.totalCost) * 100)) : 100;
                            const isFullyPaid = remaining <= 0;
                            const isExpanded = Boolean(expandedPlanIds[pt.id]);

                            return (
                                <div
                                    key={pt.id}
                                    className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden transition-all"
                                >
                                    {/* Card Header & Summary */}
                                    <div className="p-5 sm:p-6">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            {/* Left: Treatment Info & Status Badges */}
                                            <div className="flex items-start gap-3.5">
                                                <div className="size-11 rounded-2xl bg-teal-50 text-teal-700 border border-teal-200/90 flex items-center justify-center shrink-0 shadow-2xs">
                                                    <AutoAwesomeOutlined sx={{ fontSize: 20 }} />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <h3 className="text-lg font-black text-[#0B1528] tracking-tight">
                                                            {pt.treatment.name}
                                                        </h3>
                                                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                                                            {pt.clinicalStatus === "IN_PROGRESS" ? "In Progress" : pt.clinicalStatus}
                                                        </span>
                                                        {isFullyPaid ? (
                                                            <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 inline-flex items-center gap-1">
                                                                <CheckCircle sx={{ fontSize: 12 }} />
                                                                <span>Paid in Full</span>
                                                            </span>
                                                        ) : (
                                                            <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                                                                Due: {formatPKR(remaining)}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-xs font-medium text-slate-500 mt-1 flex items-center gap-2">
                                                        <span>Started {formatDate(pt.startDate)}</span>
                                                        <span className="text-slate-300">·</span>
                                                        <span>{pt.totalSessions || 1} Planned Session{pt.totalSessions > 1 ? "s" : ""}</span>
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Right: Quick Financial Indicators & Record Payment Button */}
                                            <div className="flex items-center gap-4 shrink-0 flex-wrap justify-between md:justify-end">
                                                <div className="flex items-center gap-4 text-right">
                                                    <div>
                                                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                                                            Package Total
                                                        </span>
                                                        <span className="text-sm font-black text-[#0B1528]">
                                                            {formatPKR(pt.totalCost)}
                                                        </span>
                                                    </div>
                                                    <div className="w-px h-7 bg-slate-200" />
                                                    <div>
                                                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                                                            Paid
                                                        </span>
                                                        <span className="text-sm font-black text-emerald-700">
                                                            {formatPKR(totalPaid)}
                                                        </span>
                                                    </div>
                                                    <div className="w-px h-7 bg-slate-200" />
                                                    <div>
                                                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                                                            Remaining
                                                        </span>
                                                        <span
                                                            className={`text-sm font-black ${remaining > 0 ? "text-amber-800" : "text-emerald-700"
                                                                }`}
                                                        >
                                                            {formatPKR(remaining)}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="flex items-center gap-2">
                                                    {pt.clinicalStatus === "IN_PROGRESS" && (
                                                        <Button
                                                            type="button"
                                                            size="sm"
                                                            onClick={() => {
                                                                setSelectedPlanForBooking({
                                                                    id: pt.id,
                                                                    treatmentId: pt.treatment.id || "",
                                                                    treatmentName: pt.treatment.name,
                                                                    sessionNumber: (pt.appointments?.length || 0) + 1,
                                                                    totalSessions: pt.totalSessions,
                                                                });
                                                                setScheduleOpen(true);
                                                            }}
                                                            className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs h-9 px-3 rounded-xl shadow-2xs transition-all active:scale-[0.98] flex items-center gap-1 cursor-pointer"
                                                        >
                                                            <CalendarMonthOutlined sx={{ fontSize: 14 }} />
                                                            <span>+ Schedule Next Session</span>
                                                        </Button>
                                                    )}
                                                    {remaining > 0 && (
                                                        <RecordPayment
                                                            treatmentPlanId={pt.id}
                                                            treatmentName={pt.treatment.name}
                                                            remainingBalance={remaining}
                                                        />
                                                    )}
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setExpandedPlanIds((prev) => ({
                                                                ...prev,
                                                                [pt.id]: !isExpanded,
                                                            }))
                                                        }
                                                        className="size-9 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center justify-center cursor-pointer transition-colors"
                                                        aria-label="Toggle details"
                                                    >
                                                        {isExpanded ? (
                                                            <KeyboardArrowUpOutlined sx={{ fontSize: 18 }} />
                                                        ) : (
                                                            <KeyboardArrowDownOutlined sx={{ fontSize: 18 }} />
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Financial Progress Bar */}
                                        <div className="mt-4">
                                            <div className="flex items-center justify-between text-[11px] font-bold mb-1.5">
                                                <span className="text-slate-500">Financial Clearance</span>
                                                <span className="text-teal-800">{percentPaid}% Settled</span>
                                            </div>
                                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/60">
                                                <div
                                                    className={`h-full transition-all duration-500 ${isFullyPaid ? "bg-emerald-500" : "bg-teal-600"
                                                        }`}
                                                    style={{ width: `${percentPaid}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* ─── Collapsible Details: Sessions & Payment Ledger ─── */}
                                    {isExpanded && (
                                        <div className="border-t border-slate-100 bg-slate-50/50 p-5 sm:p-6 space-y-5 animate-in slide-in-from-top-2 duration-150">
                                            {/* Linked Clinical Sessions */}
                                            {pt.appointments && pt.appointments.length > 0 && (
                                                <div className="space-y-2.5">
                                                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                                                        <CalendarMonthOutlined sx={{ fontSize: 14 }} className="text-teal-600" />
                                                        <span>Scheduled & Completed Sessions ({pt.appointments.length})</span>
                                                    </h4>
                                                    <div className="grid sm:grid-cols-2 gap-2.5">
                                                        {pt.appointments.map((apt, idx) => (
                                                            <div
                                                                key={apt.id}
                                                                className="p-3 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-center justify-between gap-3 text-xs"
                                                            >
                                                                <div>
                                                                    <p className="font-bold text-[#0B1528]">
                                                                        {apt.sessionLabel || `Session ${apt.sessionNumber || idx + 1}`}
                                                                    </p>
                                                                    <p className="text-[11px] text-slate-500 font-medium">
                                                                        {formatDate(apt.startTime)} · {formatTime(apt.startTime)}
                                                                    </p>
                                                                </div>
                                                                <span
                                                                    className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${apt.status === "COMPLETED"
                                                                            ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                                                            : "bg-teal-50 text-teal-800 border border-teal-200"
                                                                        }`}
                                                                >
                                                                    {apt.status}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Payment Installments Ledger */}
                                            <div className="space-y-2.5">
                                                <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                                                    <ReceiptLongOutlined sx={{ fontSize: 14 }} className="text-teal-600" />
                                                    <span>Payment Installments Logged ({pt.payments.length})</span>
                                                </h4>

                                                {pt.payments.length === 0 ? (
                                                    <div className="p-4 rounded-2xl bg-white border border-slate-200/80 text-center">
                                                        <p className="text-xs text-slate-500 font-medium">
                                                            No installment payments recorded for this package yet.
                                                        </p>
                                                        {remaining > 0 && (
                                                            <div className="mt-2">
                                                                <RecordPayment
                                                                    treatmentPlanId={pt.id}
                                                                    treatmentName={pt.treatment.name}
                                                                    remainingBalance={remaining}
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-2xs">
                                                        <table className="w-full text-xs text-left">
                                                            <thead className="bg-slate-50/90 border-b border-slate-200/90 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
                                                                <tr>
                                                                    <th className="px-4 py-2.5">Date</th>
                                                                    <th className="px-4 py-2.5">Method</th>
                                                                    <th className="px-4 py-2.5">Notes</th>
                                                                    <th className="px-4 py-2.5 text-right">Amount</th>
                                                                    <th className="px-4 py-2.5 text-right">Receipt</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="divide-y divide-slate-100 font-medium">
                                                                {pt.payments.map((p) => (
                                                                    <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                                                                        <td className="px-4 py-3 font-bold text-slate-900">
                                                                            {formatDate(p.date)}
                                                                        </td>
                                                                        <td className="px-4 py-3">
                                                                            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold text-[10px] border border-slate-200">
                                                                                {p.method}
                                                                            </span>
                                                                        </td>
                                                                        <td className="px-4 py-3 text-slate-600 max-w-[200px] truncate">
                                                                            {p.notes || "—"}
                                                                        </td>
                                                                        <td className="px-4 py-3 text-right font-black text-emerald-700">
                                                                            {formatPKR(p.amount)}
                                                                        </td>
                                                                        <td className="px-4 py-3 text-right">
                                                                            <button
                                                                                type="button"
                                                                                onClick={() =>
                                                                                    handleOpenReceiptForPayment({
                                                                                        id: p.id,
                                                                                        date: p.date,
                                                                                        amount: p.amount,
                                                                                        method: p.method,
                                                                                        notes: p.notes,
                                                                                        sourceType: "PLAN",
                                                                                        treatmentName: pt.treatment.name,
                                                                                        patientTreatmentId: pt.id,
                                                                                    })
                                                                                }
                                                                                className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-800 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 px-2.5 py-1 rounded-lg border border-teal-200 transition-colors cursor-pointer"
                                                                            >
                                                                                <PrintOutlined sx={{ fontSize: 13 }} />
                                                                                <span>Receipt</span>
                                                                            </button>
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            )}

            {/* ═══════════════════════════════════════════════════════════════
                TAB 2: VISITS & DOCTOR'S CLINICAL CHARTING
            ═══════════════════════════════════════════════════════════════ */}
            {activeTab === "ENCOUNTERS" && (
                <div className="space-y-4">
                    {/* Filter & Search Bar */}
                    <div className="bg-white rounded-3xl border border-slate-200/90 p-4 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                        <div className="relative flex-1">
                            <SearchOutlined
                                sx={{ fontSize: 16 }}
                                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                            />
                            <Input
                                value={encounterSearch}
                                onChange={(e) => setEncounterSearch(e.target.value)}
                                placeholder="Search procedure, diagnosis, prescription..."
                                className="pl-9 h-9 text-xs rounded-xl border-slate-200 focus-visible:ring-2 focus-visible:ring-teal-500/20"
                            />
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0 overflow-x-auto">
                            {(["ALL", "COMPLETED", "SCHEDULED", "CANCELLED"] as const).map((mode) => (
                                <button
                                    key={mode}
                                    type="button"
                                    onClick={() => setEncounterFilter(mode)}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${encounterFilter === mode
                                            ? "bg-teal-600 text-white shadow-2xs"
                                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                        }`}
                                >
                                    {mode === "ALL" ? "All Visits" : mode}
                                </button>
                            ))}
                            <Button
                                type="button"
                                size="sm"
                                onClick={() => {
                                    setSelectedPlanForBooking(null);
                                    setScheduleOpen(true);
                                }}
                                className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs h-8 px-3 rounded-xl shadow-2xs transition-all active:scale-[0.98] flex items-center gap-1 cursor-pointer shrink-0 ml-1"
                            >
                                <CalendarMonthOutlined sx={{ fontSize: 14 }} />
                                <span>+ Book Visit</span>
                            </Button>
                        </div>
                    </div>

                    {/* Encounters List */}
                    {filteredAppointments.length === 0 ? (
                        <div className="bg-white rounded-3xl border border-slate-200/90 p-10 text-center shadow-2xs">
                            <CalendarMonthOutlined sx={{ fontSize: 32 }} className="text-slate-400 mb-2" />
                            <p className="text-sm font-bold text-slate-800">No visits match criteria.</p>
                            <p className="text-xs text-slate-500 mt-0.5">Try resetting search or filter mode.</p>
                        </div>
                    ) : (
                        <div className="space-y-3.5">
                            {filteredAppointments.map((apt) => (
                                <div
                                    key={apt.id}
                                    className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-4"
                                >
                                    {/* Encounter Header */}
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                                        <div className="flex items-start gap-3">
                                            <div className="size-10 rounded-2xl bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center shrink-0">
                                                <LocalHospitalOutlined sx={{ fontSize: 18 }} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <h3 className="text-base font-black text-[#0B1528]">
                                                        {apt.treatment.name}
                                                    </h3>
                                                    {apt.sessionLabel && (
                                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                                                            {apt.sessionLabel}
                                                        </span>
                                                    )}
                                                    <StatusBadge status={apt.status} />
                                                </div>
                                                <p className="text-xs font-semibold text-slate-500 mt-0.5">
                                                    {formatDate(apt.startTime)} · {formatTime(apt.startTime)}
                                                    {apt.checkoutTime && (
                                                        <span className="text-teal-700 font-bold ml-2">
                                                            (Checked out {formatTime(apt.checkoutTime)})
                                                        </span>
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Action buttons: Precautions & Receipt */}
                                        <div className="flex items-center gap-2 shrink-0">
                                            <SendPrecautionsButton
                                                appointmentId={apt.id}
                                                patientPhone={patient.phone}
                                                patientName={patient.name || "Patient"}
                                                treatmentName={apt.treatment.name}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleOpenReceiptForAppointment(apt)}
                                                className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl border border-slate-200 transition-colors cursor-pointer"
                                            >
                                                <PrintOutlined sx={{ fontSize: 15 }} />
                                                <span>Invoice</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Fee Breakdown */}
                                    <div className="flex items-center gap-4 text-xs">
                                        <div>
                                            <span className="text-slate-400 font-bold uppercase text-[10px] block">
                                                Procedure Fee
                                            </span>
                                            <span className="font-bold text-[#0B1528]">
                                                {formatPKR(apt.price + (apt.discount || 0))}
                                            </span>
                                        </div>
                                        {apt.discount > 0 && (
                                            <div>
                                                <span className="text-rose-500 font-bold uppercase text-[10px] block">
                                                    Discount
                                                </span>
                                                <span className="font-bold text-rose-600">
                                                    -{formatPKR(apt.discount)}
                                                </span>
                                            </div>
                                        )}
                                        <div>
                                            <span className="text-slate-400 font-bold uppercase text-[10px] block">
                                                Amount Settled
                                            </span>
                                            <span className="font-bold text-emerald-700">
                                                {formatPKR(apt.amountPaid || 0)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* ═══════════════════════════════════════════════════════════════
                TAB 3: FINANCIAL LEDGER & INVOICES
            ═══════════════════════════════════════════════════════════════ */}
            {activeTab === "PAYMENTS" && (
                <div className="space-y-4">
                    {allLedgerPayments.length === 0 ? (
                        <div className="bg-white rounded-3xl border border-slate-200/90 p-10 text-center shadow-2xs">
                            <ReceiptLongOutlined sx={{ fontSize: 32 }} className="text-slate-400 mb-2" />
                            <p className="text-sm font-bold text-slate-800">No payment records found.</p>
                            <p className="text-xs text-slate-500 mt-0.5">
                                Payments logged at checkout or under treatment plans will appear here.
                            </p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-2xs">
                            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-black text-[#0B1528] tracking-tight">
                                        Audit Trail of Patient Payments
                                    </h3>
                                    <p className="text-xs text-slate-500 font-medium">
                                        Reconciled transactions across clinical visits and installment packages
                                    </p>
                                </div>
                                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                                    Total Collected: {formatPKR(financialStats.totalPaid)}
                                </span>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-xs text-left">
                                    <thead className="bg-slate-50/90 border-b border-slate-200/90 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
                                        <tr>
                                            <th className="px-5 py-3">Date</th>
                                            <th className="px-5 py-3">Procedure / Package</th>
                                            <th className="px-5 py-3">Method</th>
                                            <th className="px-5 py-3">Notes</th>
                                            <th className="px-5 py-3 text-right">Amount Settled</th>
                                            <th className="px-5 py-3 text-right">Invoice</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 font-medium">
                                        {allLedgerPayments.map((p) => (
                                            <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                                                <td className="px-5 py-3.5 font-bold text-slate-900 whitespace-nowrap">
                                                    {formatDate(p.date)}
                                                </td>
                                                <td className="px-5 py-3.5 font-bold text-[#0B1528]">
                                                    {p.treatmentName}
                                                </td>
                                                <td className="px-5 py-3.5">
                                                    <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold text-[10px] border border-slate-200">
                                                        {p.method}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-3.5 text-slate-500 max-w-[200px] truncate">
                                                    {p.notes || "—"}
                                                </td>
                                                <td className="px-5 py-3.5 text-right font-black text-emerald-700 text-sm whitespace-nowrap">
                                                    {formatPKR(p.amount)}
                                                </td>
                                                <td className="px-5 py-3.5 text-right whitespace-nowrap">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleOpenReceiptForPayment(p)}
                                                        className="inline-flex items-center gap-1 text-xs font-bold text-teal-800 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 px-3 py-1 rounded-xl border border-teal-200 transition-colors cursor-pointer"
                                                    >
                                                        <PrintOutlined sx={{ fontSize: 13 }} />
                                                        <span>Official Receipt</span>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* ─── Official Clinical Receipt Dialog ─── */}
            <ReceiptDialog
                open={receiptOpen}
                onOpenChange={setReceiptOpen}
                data={receiptData}
            />

            {/* ─── Schedule Patient Visit / Session Dialog ─── */}
            <SchedulePatientSessionDialog
                open={scheduleOpen}
                onOpenChange={setScheduleOpen}
                patient={{
                    id: patient.id,
                    name: patient.name || "Patient",
                    phone: patient.phone || "",
                    patientCode: patient.patientCode,
                }}
                plan={selectedPlanForBooking}
                availableTreatments={availableTreatments}
                onSuccess={() => {
                    router.refresh();
                }}
            />
        </div>
    );
}

