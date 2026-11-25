"use client";

import React, { useState, useEffect, useCallback, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  CalendarMonthOutlined,
  PersonAddAlt1Outlined,
  SearchOutlined,
  MedicalServicesOutlined,
  AccessTimeOutlined,
  AutoAwesomeOutlined,
  AutorenewOutlined,
  CheckCircleOutlineOutlined,
  WhatsApp,
  WarningAmberOutlined,
  BadgeOutlined,
  SwapHorizOutlined,
} from "@mui/icons-material";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { TimeSlotSelector } from "@/components/ui/time-slot-selector";
import SundayWarning from "@/components/shared/SundayWarning";
import { fetchApi } from "@/lib/api-client";
import { isSundayInKarachi } from "@/lib/timezone";
import { formatPKR, formatDate, formatTime } from "@/lib/utils";
import { toast } from "sonner";
import type { TreatmentOption, PatientResult, PatientHistory } from "@/components/walk-in/types";

type BookingMode = "existing" | "new";
type PlanChoice = "continue" | "separate";

interface BookingConfirmationResult {
  patientName: string;
  patientCode?: number | null;
  treatmentName: string;
  dateLabel: string;
  timeLabel: string;
  sessionLabel?: string | null;
  whatsappSent: boolean;
  whatsappError?: string;
}

export interface StaffBookAppointmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultMode?: BookingMode;
  onSuccess?: () => void;
}

export default function StaffBookAppointmentModal({
  open,
  onOpenChange,
  defaultMode = "existing",
  onSuccess,
}: StaffBookAppointmentModalProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const todayStr = format(new Date(), "yyyy-MM-dd");

  const [mode, setMode] = useState<BookingMode>(defaultMode);
  const [treatments, setTreatments] = useState<TreatmentOption[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<BookingConfirmationResult | null>(null);

  // Existing Patient Search & Selection
  const [searchQuery, setSearchQuery] = useState("");
  const [patients, setPatients] = useState<PatientResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<PatientResult | null>(null);
  const [history, setHistory] = useState<PatientHistory | null>(null);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [planChoice, setPlanChoice] = useState<PlanChoice>("continue");
  const [selectedPlanId, setSelectedPlanId] = useState<string>("");

  // Shared Booking Fields
  const [treatmentId, setTreatmentId] = useState("");
  const [date, setDate] = useState(todayStr);
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");

  // New Patient Fields
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [cnic, setCnic] = useState("");

  const resetAllState = useCallback(
    (nextMode: BookingMode = defaultMode) => {
      setMode(nextMode);
      setError(null);
      setConfirmation(null);
      setSearchQuery("");
      setSelectedPatient(null);
      setHistory(null);
      setPlanChoice("continue");
      setSelectedPlanId("");
      setTreatmentId(treatments[0]?.id || "");
      setDate(todayStr);
      setTime("");
      setNotes("");
      setFullName("");
      setPhone("");
      setAge("");
      setCnic("");
    },
    [defaultMode, todayStr, treatments]
  );

  // Load treatments when modal opens
  useEffect(() => {
    if (!open) return;

    fetchApi("/api/treatments")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.treatments?.length) {
          setTreatments(data.treatments);
          setTreatmentId((prev) => prev || data.treatments[0].id);
        }
      })
      .catch(() => {});
  }, [open]);

  // Search existing patients when in "existing" mode
  useEffect(() => {
    if (!open || mode !== "existing" || selectedPatient) return;

    let active = true;
    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetchApi(
          `/api/admin/walk-in/search?q=${encodeURIComponent(searchQuery)}&page=1`
        );
        if (res.ok && active) {
          const data = await res.json();
          setPatients(data.patients || []);
        }
      } catch {
        // Ignore transient search error
      } finally {
        if (active) setSearching(false);
      }
    }, 250);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [open, mode, searchQuery, selectedPatient]);

  const activePlans = (history?.plans || []).filter(
    (p) => p.clinicalStatus === "IN_PROGRESS"
  );
  const selectedActivePlan =
    activePlans.find((p) => p.id === selectedPlanId) || activePlans[0] || null;

  const handleSelectPatient = async (patient: PatientResult) => {
    setSelectedPatient(patient);
    setLoadingHistory(true);
    setError(null);
    setTime("");

    try {
      const res = await fetchApi(`/api/patients/${patient.id}/history`);
      if (!res.ok) throw new Error("Failed to load patient clinical records");
      const data: PatientHistory = await res.json();
      setHistory(data);

      const inProgress = (data.plans || []).filter(
        (p) => p.clinicalStatus === "IN_PROGRESS"
      );
      if (inProgress.length > 0) {
        setPlanChoice("continue");
        setSelectedPlanId(inProgress[0].id);
        setTreatmentId(inProgress[0].treatment.id);
      } else {
        setPlanChoice("separate");
        setSelectedPlanId("");
        setTreatmentId(treatments[0]?.id || "");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not load patient records"
      );
    } finally {
      setLoadingHistory(false);
    }
  };

  const handlePlanChoiceChange = (choice: PlanChoice) => {
    setPlanChoice(choice);
    setTime("");
    if (choice === "continue" && selectedActivePlan) {
      setSelectedPlanId(selectedActivePlan.id);
      setTreatmentId(selectedActivePlan.treatment.id);
    } else if (choice === "separate") {
      setTreatmentId(treatments[0]?.id || "");
    }
  };

  const handleSelectActivePlan = (planId: string) => {
    setSelectedPlanId(planId);
    const plan = activePlans.find((p) => p.id === planId);
    if (plan) {
      setTreatmentId(plan.treatment.id);
      setTime("");
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!date) {
      setError("Please select an appointment date.");
      return;
    }
    if (isSundayInKarachi(date)) {
      setError("Clinic is closed on Sundays. Please pick Monday through Saturday.");
      return;
    }
    if (!treatmentId) {
      setError("Please select a clinical procedure.");
      return;
    }
    if (!time) {
      setError("Please select an available time slot.");
      return;
    }

    let payload: Record<string, unknown>;

    if (mode === "existing") {
      if (!selectedPatient) {
        setError("Please search and select a registered patient first.");
        return;
      }
      const isContinuing = planChoice === "continue" && Boolean(selectedActivePlan);
      payload = {
        patientId: selectedPatient.id,
        date,
        time,
        treatmentId: isContinuing && selectedActivePlan
          ? selectedActivePlan.treatment.id
          : treatmentId,
        patientTreatmentId: isContinuing && selectedActivePlan
          ? selectedActivePlan.id
          : undefined,
        skipActivePlan: !isContinuing && activePlans.length > 0 ? true : undefined,
        notes: notes.trim() || undefined,
      };
    } else {
      const cleanName = fullName.trim();
      const digitsPhone = phone.replace(/[^0-9]/g, "");
      const parsedAge = parseInt(age, 10);

      if (cleanName.length < 2) {
        setError("Please enter the patient's full name.");
        return;
      }
      if (digitsPhone.length < 10) {
        setError("Please enter a valid 10+ digit phone number.");
        return;
      }
      if (isNaN(parsedAge) || parsedAge < 1 || parsedAge > 150) {
        setError("Please enter a valid patient age.");
        return;
      }

      payload = {
        fullName: cleanName,
        phone: digitsPhone,
        age: parsedAge,
        cnic: cnic.trim() || undefined,
        treatmentId,
        date,
        time,
        notes: notes.trim() || undefined,
      };
    }

    try {
      setSubmitting(true);
      const res = await fetchApi("/api/admin/walk-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to book appointment.");
      }

      const appt = data.appointment;
      const resolvedTreatment =
        appt?.treatment?.name ||
        treatments.find((t) => t.id === treatmentId)?.name ||
        "Dental Consultation";
      const resolvedName =
        appt?.patient?.name ||
        selectedPatient?.name ||
        fullName.trim();

      const whatsappSent = Boolean(data.whatsappConfirmation?.sent);

      setConfirmation({
        patientName: resolvedName,
        patientCode: data.patientCode ?? selectedPatient?.patientCode,
        treatmentName: resolvedTreatment,
        dateLabel: appt?.startTime ? formatDate(appt.startTime) : date,
        timeLabel: appt?.startTime ? formatTime(appt.startTime) : time,
        sessionLabel: data.sessionLabel || appt?.sessionLabel || null,
        whatsappSent,
        whatsappError: data.whatsappConfirmation?.error,
      });

      toast.success(
        whatsappSent
          ? `Appointment booked for ${resolvedName} & WhatsApp confirmation sent!`
          : `Appointment booked for ${resolvedName}!`
      );

      queryClient.invalidateQueries({ queryKey: ["staff-dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["staff-reception-dashboard"] });
      router.refresh();
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Booking failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = (nextOpen: boolean) => {
    if (!nextOpen) {
      resetAllState(defaultMode);
    }
    onOpenChange(nextOpen);
  };

  const selectedTreatmentObj = treatments.find((t) => t.id === treatmentId);
  const isContinuingPlan =
    mode === "existing" && planChoice === "continue" && Boolean(selectedActivePlan);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl bg-white border border-slate-200 text-slate-900 shadow-2xl rounded-3xl p-0 overflow-hidden flex flex-col max-h-[92vh]">
        <DialogHeader className="p-5 sm:p-6 border-b border-slate-100 bg-slate-50/80 shrink-0 pr-14">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200/90 inline-flex items-center gap-1">
              <CalendarMonthOutlined sx={{ fontSize: 13 }} className="text-teal-600" />
              <span>Reception Desk · In-Clinic Booking</span>
            </span>
          </div>
          <DialogTitle className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {confirmation ? "Booking Confirmed" : "Book Patient Appointment"}
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500 font-medium">
            {confirmation
              ? "Appointment saved to the live schedule with WhatsApp confirmation status below."
              : "Search an existing patient (with ongoing treatment plan detection) or register a new walk-in patient."}
          </DialogDescription>
        </DialogHeader>

        {confirmation ? (
          <div className="p-6 space-y-5 overflow-y-auto">
            <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-teal-50/70 border border-teal-200">
              <div className="size-11 rounded-2xl bg-teal-600 text-white flex items-center justify-center shrink-0">
                <CheckCircleOutlineOutlined sx={{ fontSize: 24 }} />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-black text-slate-900">
                  {confirmation.patientName}
                  {confirmation.patientCode ? (
                    <span className="ml-2 text-xs font-mono font-bold text-teal-700">
                      #{confirmation.patientCode}
                    </span>
                  ) : null}
                </h3>
                <p className="text-xs font-semibold text-slate-600 mt-0.5">
                  {confirmation.treatmentName}
                  {confirmation.sessionLabel ? ` · ${confirmation.sessionLabel}` : ""}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Appointment Date
                </span>
                <span className="text-sm font-black text-slate-900 mt-0.5 block">
                  {confirmation.dateLabel}
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Scheduled Slot
                </span>
                <span className="text-sm font-black text-slate-900 mt-0.5 block">
                  {confirmation.timeLabel}
                </span>
              </div>
            </div>

            {/* n8n WhatsApp Confirmation Status */}
            <div
              className={`p-3.5 rounded-2xl border flex items-start gap-2.5 text-xs ${
                confirmation.whatsappSent
                  ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                  : "bg-amber-50 border-amber-200 text-amber-900"
              }`}
            >
              {confirmation.whatsappSent ? (
                <WhatsApp sx={{ fontSize: 18 }} className="text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <WarningAmberOutlined sx={{ fontSize: 18 }} className="text-amber-600 shrink-0 mt-0.5" />
              )}
              <div>
                <p className="font-extrabold">
                  {confirmation.whatsappSent
                    ? "WhatsApp Confirmation Sent (n8n)"
                    : "WhatsApp Confirmation Pending / Not Dispatched"}
                </p>
                <p className="text-[11px] mt-0.5 opacity-90">
                  {confirmation.whatsappSent
                    ? "Patient received their appointment details via the n8n WhatsApp workflow."
                    : confirmation.whatsappError ||
                      "Appointment is booked, but n8n webhook did not respond."}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => resetAllState(mode)}
                className="rounded-xl border-slate-200 font-bold text-xs cursor-pointer"
              >
                Book Another Patient
              </Button>
              <Button
                type="button"
                onClick={() => handleClose(false)}
                className="rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-5 cursor-pointer"
              >
                Done
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 custom-scrollbar">
            {/* Mode Switcher */}
            <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-slate-100 border border-slate-200/80">
              <button
                type="button"
                onClick={() => {
                  setMode("existing");
                  setError(null);
                  setTime("");
                }}
                className={`py-2 px-3 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  mode === "existing"
                    ? "bg-white text-teal-800 shadow-xs border border-slate-200/80"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <SearchOutlined sx={{ fontSize: 16 }} />
                <span>Existing Patient</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("new");
                  setError(null);
                  setTime("");
                  setTreatmentId(treatments[0]?.id || "");
                }}
                className={`py-2 px-3 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  mode === "new"
                    ? "bg-white text-teal-800 shadow-xs border border-slate-200/80"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <PersonAddAlt1Outlined sx={{ fontSize: 16 }} />
                <span>New Walk-In Patient</span>
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
                {error}
              </div>
            )}

            {/* EXISTING PATIENT SEARCH OR DOSSIER */}
            {mode === "existing" ? (
              !selectedPatient ? (
                <div className="space-y-3">
                  <div className="relative">
                    <SearchOutlined
                      sx={{ fontSize: 18 }}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    />
                    <Input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      aria-label="Search registered patients"
                      placeholder="Search by patient name, phone (03xx / +92), or MRN (#)..."
                      className="pl-10 h-11 bg-slate-50 border-slate-200 rounded-xl text-xs sm:text-sm font-medium"
                    />
                  </div>

                  <div className="border border-slate-200/90 rounded-2xl divide-y divide-slate-100 max-h-64 overflow-y-auto bg-white">
                    {searching ? (
                      <div className="p-6 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
                        <AutorenewOutlined sx={{ fontSize: 16 }} className="animate-spin text-teal-600" />
                        <span>Searching registered patients...</span>
                      </div>
                    ) : patients.length === 0 ? (
                      <div className="p-6 text-center space-y-2">
                        <p className="text-xs font-semibold text-slate-600">
                          No matching registered patients found.
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setMode("new")}
                          className="rounded-xl text-xs font-bold border-teal-200 text-teal-700 hover:bg-teal-50 cursor-pointer"
                        >
                          + Register as New Walk-In Patient
                        </Button>
                      </div>
                    ) : (
                      patients.map((p) => {
                        const ongoing = p.patientTreatments || [];
                        return (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => handleSelectPatient(p)}
                            className="w-full px-4 py-3 text-left hover:bg-teal-50/50 transition-colors flex items-center justify-between gap-3 cursor-pointer"
                          >
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-xs sm:text-sm font-extrabold text-slate-900 truncate">
                                  {p.name}
                                </span>
                                {p.patientCode && (
                                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                                    #{p.patientCode}
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                                {p.phone || "No phone"} · {p._count?.appointments ?? 0} visits
                              </p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              {ongoing.length > 0 && (
                                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                                  Ongoing: {ongoing[0].treatment.name}
                                </span>
                              )}
                              <span className="text-xs font-bold text-teal-700">Select →</span>
                            </div>
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Selected Patient Strip */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="size-10 rounded-xl bg-teal-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                        {selectedPatient.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black text-slate-900 truncate">
                            {selectedPatient.name}
                          </span>
                          {selectedPatient.patientCode && (
                            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-600">
                              #{selectedPatient.patientCode}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium">
                          {selectedPatient.phone || "No phone"}
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedPatient(null);
                        setHistory(null);
                        setSelectedPlanId("");
                        setTime("");
                      }}
                      className="rounded-xl text-xs font-bold border-slate-200 cursor-pointer shrink-0 gap-1"
                    >
                      <SwapHorizOutlined sx={{ fontSize: 15 }} />
                      <span>Change</span>
                    </Button>
                  </div>

                  {loadingHistory ? (
                    <div className="p-6 rounded-2xl border border-slate-200 bg-white text-center text-xs text-slate-500 flex items-center justify-center gap-2">
                      <AutorenewOutlined sx={{ fontSize: 16 }} className="animate-spin text-teal-600" />
                      <span>Checking ongoing treatments & clinical history...</span>
                    </div>
                  ) : (
                    <>
                      {/* Ongoing Treatment Detection & Choice */}
                      {activePlans.length > 0 && (
                        <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200 space-y-3">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[11px] font-black uppercase tracking-wider text-teal-900 flex items-center gap-1.5">
                              <AutoAwesomeOutlined sx={{ fontSize: 14 }} className="text-teal-600" />
                              <span>Ongoing Treatment Plan Detected</span>
                            </span>
                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-white text-teal-800 border border-teal-200">
                              {activePlans.length} Active
                            </span>
                          </div>

                          {/* Choice Toggle */}
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => handlePlanChoiceChange("continue")}
                              className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                                planChoice === "continue"
                                  ? "bg-white border-teal-500 shadow-2xs"
                                  : "bg-white/60 border-teal-200/70 hover:bg-white"
                              }`}
                            >
                              <p className="text-xs font-black text-slate-900">
                                Continue Ongoing Treatment
                              </p>
                              <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                                Link next session (Rs. 0 session fee)
                              </p>
                            </button>
                            <button
                              type="button"
                              onClick={() => handlePlanChoiceChange("separate")}
                              className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                                planChoice === "separate"
                                  ? "bg-white border-teal-500 shadow-2xs"
                                  : "bg-white/60 border-teal-200/70 hover:bg-white"
                              }`}
                            >
                              <p className="text-xs font-black text-slate-900">
                                Book Separate Procedure
                              </p>
                              <p className="text-[10px] text-slate-500 font-medium mt-0.5">
                                Start a new / unrelated visit
                              </p>
                            </button>
                          </div>

                          {planChoice === "continue" && selectedActivePlan && (
                            <div className="space-y-2">
                              {activePlans.length > 1 && (
                                <Select
                                  value={selectedActivePlan.id}
                                  onValueChange={handleSelectActivePlan}
                                >
                                  <SelectTrigger className="w-full h-10 bg-white border-teal-200 rounded-xl text-xs font-bold">
                                    <SelectValue placeholder="Choose active plan..." />
                                  </SelectTrigger>
                                  <SelectContent className="bg-white border-slate-200 shadow-xl rounded-xl">
                                    {activePlans.map((plan) => (
                                      <SelectItem key={plan.id} value={plan.id} className="text-xs font-semibold">
                                        {plan.treatment.name} ({plan.completedSessions}/{plan.totalSessions} completed)
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              )}

                              <div className="p-3 rounded-xl bg-white border border-teal-200/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                                <div>
                                  <p className="font-black text-slate-900">
                                    {selectedActivePlan.treatment.name}
                                  </p>
                                  <p className="text-[11px] text-slate-500 font-medium">
                                    Next Visit: Session {selectedActivePlan.completedSessions + 1} of{" "}
                                    {selectedActivePlan.totalSessions} · Balance Due:{" "}
                                    <strong className="text-amber-700">
                                      {formatPKR(selectedActivePlan.remainingBalance)}
                                    </strong>
                                  </p>
                                </div>
                                <span className="px-2.5 py-1 rounded-lg bg-teal-50 text-teal-800 border border-teal-200 text-[10px] font-black">
                                  Plan Visit · Rs. 0
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Treatment Selector when NOT continuing an ongoing plan */}
                      {!isContinuingPlan && (
                        <div className="space-y-1.5">
                          <Label className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
                            <MedicalServicesOutlined sx={{ fontSize: 14 }} className="text-teal-600" />
                            <span>Clinical Procedure *</span>
                          </Label>
                          <Select
                            value={treatmentId}
                            onValueChange={(val) => {
                              setTreatmentId(val);
                              setTime("");
                            }}
                          >
                            <SelectTrigger className="w-full h-11 bg-slate-50 border-slate-200 rounded-xl text-xs sm:text-sm font-semibold">
                              <SelectValue placeholder="Select dental procedure..." />
                            </SelectTrigger>
                            <SelectContent className="max-h-64 bg-white border-slate-200 shadow-xl rounded-xl">
                              {treatments.map((t) => (
                                <SelectItem key={t.id} value={t.id} className="text-xs sm:text-sm font-medium">
                                  {t.name} — {formatPKR(t.price)} ({t.durationMin} min)
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )
            ) : (
              /* NEW PATIENT INTAKE FIELDS */
              <div className="space-y-3.5">
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-extrabold text-slate-700">
                      Full Name *
                    </Label>
                    <Input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value.replace(/[0-9]/g, ""))}
                      placeholder="e.g. Ayesha Khan"
                      className="h-10 bg-slate-50 border-slate-200 rounded-xl text-xs sm:text-sm font-medium"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-extrabold text-slate-700">
                      WhatsApp / Phone Number *
                    </Label>
                    <Input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/[^0-9+]/g, ""))}
                      placeholder="e.g. 03001234567"
                      className="h-10 bg-slate-50 border-slate-200 rounded-xl text-xs sm:text-sm font-medium"
                      required
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-extrabold text-slate-700">
                      Age (Years) *
                    </Label>
                    <Input
                      value={age}
                      onChange={(e) => setAge(e.target.value.replace(/[^0-9]/g, ""))}
                      placeholder="e.g. 28"
                      maxLength={3}
                      className="h-10 bg-slate-50 border-slate-200 rounded-xl text-xs sm:text-sm font-medium"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-extrabold text-slate-700 flex items-center gap-1">
                      <BadgeOutlined sx={{ fontSize: 13 }} className="text-slate-400" />
                      <span>CNIC (Optional)</span>
                    </Label>
                    <Input
                      value={cnic}
                      onChange={(e) => setCnic(e.target.value.replace(/[^0-9-]/g, ""))}
                      placeholder="37405-1234567-1"
                      className="h-10 bg-slate-50 border-slate-200 rounded-xl text-xs sm:text-sm font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
                    <MedicalServicesOutlined sx={{ fontSize: 14 }} className="text-teal-600" />
                    <span>Clinical Procedure *</span>
                  </Label>
                  <Select
                    value={treatmentId}
                    onValueChange={(val) => {
                      setTreatmentId(val);
                      setTime("");
                    }}
                  >
                    <SelectTrigger className="w-full h-10 bg-slate-50 border-slate-200 rounded-xl text-xs sm:text-sm font-semibold">
                      <SelectValue placeholder="Select dental procedure..." />
                    </SelectTrigger>
                    <SelectContent className="max-h-64 bg-white border-slate-200 shadow-xl rounded-xl">
                      {treatments.map((t) => (
                        <SelectItem key={t.id} value={t.id} className="text-xs sm:text-sm font-medium">
                          {t.name} — {formatPKR(t.price)} ({t.durationMin} min)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* DATE, SLOTS & NOTES (Shown for New Patient, or once Existing Patient is selected) */}
            {(mode === "new" || (selectedPatient && !loadingHistory)) && (
              <div className="space-y-4 pt-1 border-t border-slate-100">
                <div className="space-y-1.5 pt-2">
                  <Label className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
                    <CalendarMonthOutlined sx={{ fontSize: 14 }} className="text-teal-600" />
                    <span>Appointment Date *</span>
                  </Label>
                  <DatePicker
                    value={date}
                    onChange={(val: string) => {
                      setDate(val);
                      setTime("");
                    }}
                    min={todayStr}
                    placeholder="Select appointment date"
                    disabledDays={(d: Date) => d.getDay() === 0}
                  />
                  <SundayWarning date={date} />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
                      <AccessTimeOutlined sx={{ fontSize: 14 }} className="text-teal-600" />
                      <span>Available Time Slots *</span>
                    </Label>
                    {selectedTreatmentObj && !isContinuingPlan && (
                      <span className="text-[11px] font-bold text-teal-800">
                        {selectedTreatmentObj.durationMin} min · {formatPKR(selectedTreatmentObj.price)}
                      </span>
                    )}
                  </div>
                  <TimeSlotSelector
                    date={date}
                    treatmentId={treatmentId}
                    value={time}
                    onChange={setTime}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-extrabold text-slate-700">
                    Clinical / Reception Notes (Optional)
                  </Label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Patient prefers Chair 1, continuing root canal dressing..."
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 resize-none font-medium"
                  />
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleClose(false)}
                    className="rounded-xl border-slate-200 font-bold text-xs cursor-pointer"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={submitting || !date || !time || !treatmentId || isSundayInKarachi(date)}
                    className="rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs px-5 shadow-sm cursor-pointer disabled:opacity-50 gap-1.5"
                  >
                    {submitting ? (
                      <>
                        <AutorenewOutlined sx={{ fontSize: 16 }} className="animate-spin" />
                        <span>Booking & Sending WhatsApp...</span>
                      </>
                    ) : (
                      <>
                        <WhatsApp sx={{ fontSize: 16 }} />
                        <span>Confirm Booking & Send WhatsApp</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
