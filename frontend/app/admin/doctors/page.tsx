"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MedicalServicesOutlined,
  CheckCircleOutlineOutlined,
  VerifiedOutlined,
  AccessTimeOutlined,
  PersonAddAlt1Outlined,
  ShieldOutlined,
  ChairOutlined,
  ArrowForwardOutlined,
  AttachMoneyOutlined,
  AddOutlined,
  DeleteOutlineOutlined,
  LockOutlined,
  RefreshOutlined,
  WarningAmberOutlined,
} from "@mui/icons-material";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { fetchApi } from "@/lib/api-client";
import { toast } from "sonner";

export interface Doctor {
  id: string;
  name: string;
  role: string;
  pmdcReg: string;
  qualifications: string;
  experience: string;
  specialty: string;
  operatory: string;
  schedule: string;
  consultationFee: number;
  patientsThisMonth: number;
  image?: string | null;
  isLead: boolean;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface DoctorFormData {
  name: string;
  role: string;
  pmdcReg: string;
  qualifications: string;
  experience: string;
  specialty: string;
  operatory: string;
  schedule: string;
  consultationFee: number;
  isActive: boolean;
}

const DEFAULT_FORM_DATA: DoctorFormData = {
  name: "",
  role: "",
  pmdcReg: "",
  qualifications: "",
  experience: "",
  specialty: "",
  operatory: "Chair 2 · Specialist Wing",
  schedule: "Mon – Fri: 2:00 PM – 6:00 PM",
  consultationFee: 2000,
  isActive: true,
};

export default function AdminDoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Dialog States
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [doctorToDelete, setDoctorToDelete] = useState<Doctor | null>(null);

  // Form State
  const [formData, setFormData] = useState<DoctorFormData>(DEFAULT_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // ──────────────────────────────────────────────────────────────────
  // 1. DATA FETCHING
  // ──────────────────────────────────────────────────────────────────
  const fetchDoctors = useCallback(async (showToast = false) => {
    try {
      setIsRefreshing(true);
      const res = await fetchApi("/api/doctors/admin/all");
      if (!res.ok) {
        // Fallback to public active doctors if staff session isn't active
        const fallbackRes = await fetchApi("/api/doctors");
        if (fallbackRes.ok) {
          const fallbackData = await fallbackRes.json();
          setDoctors(fallbackData.doctors || []);
          return;
        }
        throw new Error("Failed to load doctor directory");
      }
      const data = await res.json();
      setDoctors(data.doctors || []);
      if (showToast) {
        toast.success("Doctor directory refreshed");
      }
    } catch (err: any) {
      toast.error(err?.message || "Could not fetch doctors");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  // ──────────────────────────────────────────────────────────────────
  // 2. ACTIVE / INACTIVE TOGGLE
  // ──────────────────────────────────────────────────────────────────
  const handleToggleActive = async (doctor: Doctor) => {
    const nextStatus = !doctor.isActive;
    setTogglingId(doctor.id);

    // Optimistic UI update
    setDoctors((prev) =>
      prev.map((d) => (d.id === doctor.id ? { ...d, isActive: nextStatus } : d))
    );

    try {
      const res = await fetchApi(`/api/doctors/${doctor.id}`, {
        method: "PATCH",
        body: JSON.stringify({ isActive: nextStatus }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to update doctor status");
      }

      const updated = await res.json();
      toast.success(
        `${doctor.name} is now marked as ${nextStatus ? "Active" : "Inactive"}`
      );
      if (updated.doctor) {
        setDoctors((prev) =>
          prev.map((d) => (d.id === doctor.id ? { ...d, ...updated.doctor } : d))
        );
      }
    } catch (err: any) {
      // Revert optimistic update
      setDoctors((prev) =>
        prev.map((d) => (d.id === doctor.id ? { ...d, isActive: !nextStatus } : d))
      );
      toast.error(err.message || "Failed to toggle status");
    } finally {
      setTogglingId(null);
    }
  };

  // ──────────────────────────────────────────────────────────────────
  // 3. ADD DOCTOR
  // ──────────────────────────────────────────────────────────────────
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.role.trim() || !formData.pmdcReg.trim()) {
      toast.error("Please fill in Doctor Name, Role, and PMDC Registration");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetchApi("/api/doctors", {
        method: "POST",
        body: JSON.stringify({
          ...formData,
          consultationFee: Number(formData.consultationFee) || 2000,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create doctor profile");
      }

      toast.success(`Doctor ${formData.name} successfully registered!`);
      setIsAddOpen(false);
      setFormData(DEFAULT_FORM_DATA);
      await fetchDoctors();
    } catch (err: any) {
      toast.error(err.message || "Error creating doctor profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ──────────────────────────────────────────────────────────────────
  // 4. DELETE DOCTOR
  // ──────────────────────────────────────────────────────────────────
  const confirmDelete = (doctor: Doctor) => {
    if (doctor.isLead) {
      toast.error("Protected Profile: The Lead Surgeon cannot be deleted.");
      return;
    }
    setDoctorToDelete(doctor);
    setIsDeleteOpen(true);
  };

  const handleDeleteSubmit = async () => {
    if (!doctorToDelete) return;

    try {
      setIsSubmitting(true);
      const res = await fetchApi(`/api/doctors/${doctorToDelete.id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to delete doctor");
      }

      toast.success(`${doctorToDelete.name} has been removed from directory.`);
      setDoctors((prev) => prev.filter((d) => d.id !== doctorToDelete.id));
      setIsDeleteOpen(false);
      setDoctorToDelete(null);
    } catch (err: any) {
      toast.error(err.message || "Error deleting doctor");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ──────────────────────────────────────────────────────────────────
  // 5. METRICS COMPUTATION (DYNAMIC)
  // ──────────────────────────────────────────────────────────────────
  const activeDoctors = doctors.filter((d) => d.isActive);
  const activeCount = activeDoctors.length;
  const totalCount = doctors.length;
  const leadDoc = doctors.find((d) => d.isLead) || doctors[0];
  const standardFee = leadDoc ? leadDoc.consultationFee : 2000;
  const totalMonthlyConsults = doctors.reduce((sum, d) => sum + (d.patientsThisMonth || 0), 0);
  const uniqueOperatories = new Set(doctors.filter((d) => d.isActive).map((d) => d.operatory));
  const operatoryCount = Math.max(uniqueOperatories.size, activeCount > 0 ? 1 : 0);

  return (
    <div className="space-y-8">
      {/* ──────────────────────────────────────────────────────────────────
          1. HEADER & ACTIONS
          ────────────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 text-xs font-bold mb-2">
            <VerifiedOutlined sx={{ fontSize: 14, color: "#0d9488" }} />
            <span>PMDC-Verified Medical Faculty</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Doctors & Clinical Specialists
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Manage dental surgeon credentials, chair assignments, consultation schedules, and clinical workload.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => fetchDoctors(true)}
            disabled={isRefreshing}
            className="border-slate-200 text-slate-700 font-bold rounded-2xl h-11 text-xs px-3 hover:bg-slate-50 cursor-pointer"
            title="Refresh Directory"
          >
            <RefreshOutlined
              sx={{ fontSize: 16 }}
              className={isRefreshing ? "animate-spin text-teal-600" : ""}
            />
            <span className="hidden sm:inline ml-1.5">Refresh</span>
          </Button>

          <Button
            asChild
            variant="outline"
            className="border-slate-200 text-slate-700 font-bold rounded-2xl h-11 text-xs px-4 hover:bg-slate-50 cursor-pointer"
          >
            <Link href="/doctors" target="_blank">
              <span>View Public Page</span>
              <ArrowForwardOutlined sx={{ fontSize: 14, ml: 1 }} />
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="border-slate-200 text-slate-700 font-bold rounded-2xl h-11 text-xs px-4 hover:bg-slate-50 cursor-pointer"
          >
            <Link href="/admin/appointments">
              <PersonAddAlt1Outlined sx={{ fontSize: 16, mr: 1 }} />
              <span>Book For Doctor</span>
            </Link>
          </Button>

          <Button
            type="button"
            onClick={() => {
              setFormData(DEFAULT_FORM_DATA);
              setIsAddOpen(true);
            }}
            className="bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-2xl h-11 px-5 shadow-xs transition-all active:scale-[0.98] cursor-pointer"
          >
            <AddOutlined sx={{ fontSize: 18, mr: 1 }} />
            <span>Add Doctor</span>
          </Button>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────────────
          2. KPI SUMMARY METRICS (DYNAMICALLY COMPUTED)
          ────────────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Active Doctors */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Active Doctors
            </span>
            <div className="size-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <MedicalServicesOutlined sx={{ fontSize: 18 }} />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">
            {activeCount} {activeCount === 1 ? "Specialist" : "Specialists"}
          </p>
          <span className="text-[11px] font-semibold text-emerald-700 mt-0.5 block">
            {totalCount > activeCount
              ? `${activeCount} of ${totalCount} active on duty`
              : "100% PMDC Registered"}
          </span>
        </div>

        {/* Operatory Chairs */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Operatory Chairs
            </span>
            <div className="size-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <ChairOutlined sx={{ fontSize: 18 }} />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">
            {operatoryCount} {operatoryCount === 1 ? "Operatory" : "Operatories"}
          </p>
          <span className="text-[11px] font-semibold text-slate-500 mt-0.5 block">
            {operatoryCount === 1 ? "Chair 1 surgical suite active" : `Chairs 1–${operatoryCount} equipped`}
          </span>
        </div>

        {/* Monthly Consults */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Monthly Consults
            </span>
            <div className="size-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircleOutlineOutlined sx={{ fontSize: 18 }} />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">
            {totalMonthlyConsults} visits
          </p>
          <span className="text-[11px] font-semibold text-emerald-700 mt-0.5 block">
            Across clinical operations
          </span>
        </div>

        {/* Standard Consult Fee */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Standard Consult Fee
            </span>
            <div className="size-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <AttachMoneyOutlined sx={{ fontSize: 18 }} />
            </div>
          </div>
          <p className="text-2xl font-black text-teal-700 mt-2">
            Rs. {standardFee.toLocaleString()}
          </p>
          <span className="text-[11px] font-semibold text-slate-500 mt-0.5 block">
            Waived with treatment
          </span>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────────────
          3. DOCTORS ROSTER TABLE & DIRECTORY
          ────────────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="px-6 py-4 sm:px-8 sm:py-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
              Clinical Medical Staff Directory
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Verified clinical registrations, chair assignments, and operational shifts.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-black bg-teal-50 text-teal-800 border border-teal-200">
              {totalCount} {totalCount === 1 ? "Doctor" : "Doctors"} Registered
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              {activeCount} Active
            </span>
          </div>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-slate-400">
            <RefreshOutlined className="animate-spin text-teal-600 mb-2" sx={{ fontSize: 28 }} />
            <p className="text-xs font-bold text-slate-500">Loading doctor directory...</p>
          </div>
        ) : doctors.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <MedicalServicesOutlined sx={{ fontSize: 40 }} className="text-slate-300 mb-2" />
            <h3 className="text-base font-bold text-slate-700">No Doctors Registered</h3>
            <p className="text-xs text-slate-500 mt-1">
              Click &quot;Add Doctor&quot; to register your first clinical practitioner.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {doctors.map((doc) => {
              const isBusy = togglingId === doc.id;
              return (
                <div
                  key={doc.id}
                  className={`p-5 sm:p-7 transition-colors ${
                    doc.isLead ? "bg-teal-50/20" : "hover:bg-slate-50/60"
                  } ${!doc.isActive ? "opacity-75 bg-slate-50/40" : ""}`}
                >
                  {/* TOP SECTION: Doctor Profile Info (Left) + Actions (Right) */}
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 sm:gap-6">
                    {/* Doctor Profile Info */}
                    <div className="flex items-start gap-3.5 sm:gap-5 min-w-0 flex-1">
                      {doc.image ? (
                        <div className="relative size-16 sm:size-20 rounded-2xl overflow-hidden ring-2 ring-teal-500/20 shrink-0 bg-slate-100 shadow-2xs">
                          <Image
                            src={doc.image}
                            alt={doc.name}
                            fill
                            className="object-cover object-top"
                          />
                        </div>
                      ) : (
                        <div className="size-16 sm:size-20 rounded-2xl bg-teal-50 border border-teal-200 text-teal-800 flex items-center justify-center font-black text-xl sm:text-2xl shrink-0 shadow-2xs">
                          {doc.name
                            .replace("Dr.", "")
                            .trim()
                            .split(" ")
                            .map((n) => n[0])
                            .join("") || "D"}
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center flex-wrap gap-2">
                          <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                            {doc.name}
                          </h3>
                          {doc.isLead && (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-teal-600 text-white uppercase tracking-wider shadow-2xs">
                              Lead Surgeon
                            </span>
                          )}
                          {doc.isActive ? (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200">
                              Active
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-100 text-slate-600 border border-slate-200">
                              Inactive / On Leave
                            </span>
                          )}
                        </div>

                        <p className="text-xs sm:text-sm font-bold text-teal-800 mt-1">
                          {doc.role}
                        </p>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                          {doc.qualifications} · {doc.experience}
                        </p>

                        <div className="flex items-center flex-wrap gap-2 mt-2.5">
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                            <ShieldOutlined sx={{ fontSize: 13, color: "#0d9488" }} />
                            <span>PMDC: {doc.pmdcReg}</span>
                          </span>
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-800 bg-teal-50/80 border border-teal-200/70 px-2.5 py-1 rounded-lg">
                            {doc.specialty}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Admin Actions: Active Switch & Delete Button / Lead Pill */}
                    <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                      {/* Active/Inactive Switch */}
                      <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-2xl shadow-2xs">
                        <Label
                          htmlFor={`toggle-${doc.id}`}
                          className="text-[11px] font-bold text-slate-600 cursor-pointer"
                        >
                          {doc.isActive ? "Active" : "Inactive"}
                        </Label>
                        <Switch
                          id={`toggle-${doc.id}`}
                          checked={doc.isActive}
                          disabled={isBusy}
                          onCheckedChange={() => handleToggleActive(doc)}
                        />
                      </div>

                      {/* Delete Doctor Button or Lead Protection Pill */}
                      {doc.isLead ? (
                        <div
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-teal-50 border border-teal-200 text-teal-700 text-xs font-bold shadow-2xs"
                          title="The clinic Lead Surgeon profile cannot be deleted"
                        >
                          <LockOutlined sx={{ fontSize: 14 }} />
                          <span className="text-[11px]">Protected Lead</span>
                        </div>
                      ) : (
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => confirmDelete(doc)}
                          className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 h-9 px-3 rounded-2xl text-xs font-bold cursor-pointer"
                          title={`Delete ${doc.name}`}
                        >
                          <DeleteOutlineOutlined sx={{ fontSize: 16, mr: 1 }} />
                          <span>Delete</span>
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* BOTTOM SECTION: Dedicated Responsive Telemetry Bar */}
                  <div className="mt-4 pt-3.5 border-t border-slate-100/90 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-slate-50/60 rounded-2xl p-3.5 sm:p-4 border border-slate-200/60">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="size-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 border border-teal-100/80">
                        <ChairOutlined sx={{ fontSize: 16 }} />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Operatory Chair
                        </span>
                        <p className="font-extrabold text-xs text-slate-900 truncate">
                          {doc.operatory}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="size-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 border border-blue-100/80">
                        <AccessTimeOutlined sx={{ fontSize: 16 }} />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Consultation Hours
                        </span>
                        <p className="font-bold text-xs text-slate-700 truncate">
                          {doc.schedule}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="size-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100/80">
                        <AttachMoneyOutlined sx={{ fontSize: 16 }} />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Consult Fee
                        </span>
                        <p className="font-extrabold text-xs text-emerald-700 truncate">
                          Rs. {doc.consultationFee.toLocaleString()}
                          <span className="text-[10px] font-normal text-slate-400 ml-1">(Waived)</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="size-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 border border-teal-100/80">
                        <CheckCircleOutlineOutlined sx={{ fontSize: 16 }} />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Monthly Consults
                        </span>
                        <p className="font-extrabold text-xs text-teal-700 truncate">
                          {doc.patientsThisMonth} visits
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ──────────────────────────────────────────────────────────────────
          4. ADD DOCTOR DIALOG
          ────────────────────────────────────────────────────────────────── */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-xl rounded-3xl bg-white p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-black text-slate-900 tracking-tight">
              Add New Doctor / Clinical Specialist
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 font-medium">
              Register a dental practitioner to the clinic staff directory.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddSubmit} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Doctor Name */}
              <div className="space-y-1.5 sm:col-span-2">
                <Label className="text-xs font-bold text-slate-700">
                  Doctor Full Name <span className="text-rose-500">*</span>
                </Label>
                <Input
                  required
                  placeholder="e.g. Dr. Ayesha Malik"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="rounded-xl border-slate-200 text-xs h-10"
                />
              </div>

              {/* Role */}
              <div className="space-y-1.5 sm:col-span-2">
                <Label className="text-xs font-bold text-slate-700">
                  Role / Clinical Designation <span className="text-rose-500">*</span>
                </Label>
                <Input
                  required
                  placeholder="e.g. Consultant Orthodontist & Dentofacial Specialist"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="rounded-xl border-slate-200 text-xs h-10"
                />
              </div>

              {/* PMDC Registration */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700">
                  PMDC Reg Number <span className="text-rose-500">*</span>
                </Label>
                <Input
                  required
                  placeholder="e.g. 19302-D (Active)"
                  value={formData.pmdcReg}
                  onChange={(e) => setFormData({ ...formData, pmdcReg: e.target.value })}
                  className="rounded-xl border-slate-200 text-xs h-10"
                />
              </div>

              {/* Experience */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700">Experience</Label>
                <Input
                  placeholder="e.g. 8+ Years"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  className="rounded-xl border-slate-200 text-xs h-10"
                />
              </div>

              {/* Qualifications */}
              <div className="space-y-1.5 sm:col-span-2">
                <Label className="text-xs font-bold text-slate-700">Qualifications</Label>
                <Input
                  placeholder="e.g. BDS, FCPS (Orthodontics)"
                  value={formData.qualifications}
                  onChange={(e) => setFormData({ ...formData, qualifications: e.target.value })}
                  className="rounded-xl border-slate-200 text-xs h-10"
                />
              </div>

              {/* Specialty */}
              <div className="space-y-1.5 sm:col-span-2">
                <Label className="text-xs font-bold text-slate-700">Key Specialty Focus</Label>
                <Input
                  placeholder="e.g. Clear Aligners, Aesthetic Braces, Jaw Alignment"
                  value={formData.specialty}
                  onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                  className="rounded-xl border-slate-200 text-xs h-10"
                />
              </div>

              {/* Operatory Chair */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700">Operatory Chair</Label>
                <Input
                  placeholder="e.g. Chair 2 · Orthodontics Bay"
                  value={formData.operatory}
                  onChange={(e) => setFormData({ ...formData, operatory: e.target.value })}
                  className="rounded-xl border-slate-200 text-xs h-10"
                />
              </div>

              {/* Consultation Fee */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-slate-700">Consultation Fee (PKR)</Label>
                <Input
                  type="number"
                  min="0"
                  step="100"
                  value={formData.consultationFee}
                  onChange={(e) =>
                    setFormData({ ...formData, consultationFee: parseInt(e.target.value, 10) || 0 })
                  }
                  className="rounded-xl border-slate-200 text-xs h-10"
                />
              </div>

              {/* Consultation Schedule */}
              <div className="space-y-1.5 sm:col-span-2">
                <Label className="text-xs font-bold text-slate-700">Consultation Hours & Days</Label>
                <Input
                  placeholder="e.g. Tue & Fri: 2:00 PM – 6:00 PM"
                  value={formData.schedule}
                  onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                  className="rounded-xl border-slate-200 text-xs h-10"
                />
              </div>

              {/* Active Immediately Switch */}
              <div className="sm:col-span-2 flex items-center justify-between p-3.5 rounded-2xl bg-teal-50/50 border border-teal-200/60">
                <div>
                  <Label className="text-xs font-bold text-slate-800 block">
                    Activate Doctor on Duty
                  </Label>
                  <span className="text-[11px] text-slate-500 font-medium">
                    Doctor will appear on public site and be available for appointment bookings
                  </span>
                </div>
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
              </div>
            </div>

            <DialogFooter className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                onClick={() => setIsAddOpen(false)}
                className="rounded-2xl h-10 text-xs font-bold"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-teal-600 hover:bg-teal-700 text-white rounded-2xl h-10 px-5 text-xs font-bold cursor-pointer"
              >
                {isSubmitting ? "Registering..." : "Add Doctor to Clinic"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ──────────────────────────────────────────────────────────────────
          5. DELETE CONFIRMATION DIALOG
          ────────────────────────────────────────────────────────────────── */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl bg-white p-6 sm:p-7">
          <DialogHeader>
            <div className="size-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-2">
              <WarningAmberOutlined sx={{ fontSize: 26 }} />
            </div>
            <DialogTitle className="text-lg font-black text-slate-900 tracking-tight">
              Delete Doctor Profile?
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 font-medium leading-relaxed mt-1">
              Are you sure you want to delete{" "}
              <strong className="text-slate-900 font-bold">{doctorToDelete?.name}</strong>?
              This will remove them from the clinic directory and disable direct scheduling for their chair.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={() => setIsDeleteOpen(false)}
              className="rounded-2xl h-10 text-xs font-bold"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={isSubmitting}
              onClick={handleDeleteSubmit}
              className="bg-rose-600 hover:bg-rose-700 text-white rounded-2xl h-10 px-5 text-xs font-bold cursor-pointer"
            >
              {isSubmitting ? "Deleting..." : "Confirm Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
