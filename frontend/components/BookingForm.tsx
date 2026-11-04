"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

// MUI Material & Icons (Clean Root Package Imports)
import { CircularProgress } from "@mui/material";
import {
  CheckCircleOutlined as CheckCircleOutlineIcon,
  CalendarMonth as CalendarMonthIcon,
  AccessTime as AccessTimeIcon,
  MedicalServices as MedicalServicesIcon,
  ArrowForward as ArrowForwardIcon,
  ArrowBack as ArrowBackIcon,
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
  ChevronRight as ChevronRightIcon,
  LocationOn as LocationOnIcon,
  CreditCard as CreditCardIcon,
  AccountBalanceWallet as AccountBalanceWalletIcon,
  ErrorOutlineOutlined as ErrorOutlineIcon,
  AutoAwesome as AutoAwesomeIcon,
  CleanHands as CleanHandsIcon,
  Build as BuildIcon,
  ContentCut as ContentCutIcon,
  Mood as MoodIcon,
  Diamond as DiamondIcon,
  ListAlt as ListAltIcon,
} from "@mui/icons-material";

import { TimeSlotSelector, TimeSlot } from "@/components/ui/time-slot-selector"
import { formatPKR } from "@/lib/utils"
import type { Treatment } from "@/lib/types"

// Define Zod Schema for the Booking Form
const bookingSchema = z.object({
  treatmentId: z.string().min(1, "Please select a treatment"),
  date: z.string().min(1, "Please select a date"),
  time: z.string().min(1, "Please select a time slot"),
  notes: z.string().optional(),
  isGuest: z.boolean(),
  guestName: z.string().optional(),
  guestPhone: z.string().optional(),
  guestEmail: z.string().email("Invalid email address").optional().or(z.literal("")),
  guestDob: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.isGuest) {
    if (!data.guestName || data.guestName.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Guest name is required",
        path: ["guestName"],
      });
    }
    if (!data.guestPhone || data.guestPhone.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Guest phone is required",
        path: ["guestPhone"],
      });
    }
  }
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface BookingFormProps {
  treatments: Treatment[]
  patientId?: string
  newPatientData?: {
    name: string
    email: string
    phone: string
  }
  returnUrl?: string
  defaultTreatmentId?: string
}

// ─── Treatment Category Grouping with MUI Icons ─────────────────────────
const TREATMENT_CATEGORIES: { label: string; icon: any; keywords: string[] }[] = [
  { label: "Implants", icon: MedicalServicesIcon, keywords: ["implant"] },
  { label: "Whitening", icon: AutoAwesomeIcon, keywords: ["whitening"] },
  { label: "Scaling & Cleaning", icon: CleanHandsIcon, keywords: ["scaling", "polishing"] },
  { label: "Root Canal (RCT)", icon: BuildIcon, keywords: ["rct", "root canal"] },
  { label: "Extractions", icon: ContentCutIcon, keywords: ["extraction"] },
  { label: "Braces & Aligners", icon: MoodIcon, keywords: ["braces", "aligner"] },
  { label: "Veneers & Cosmetic", icon: DiamondIcon, keywords: ["veneer", "lumineer"] },
];

function groupTreatments(treatments: Treatment[]) {
  const groups: { label: string; icon: any; treatments: Treatment[] }[] = [];
  const used = new Set<string>();

  for (const cat of TREATMENT_CATEGORIES) {
    const matched = treatments.filter(
      (t) =>
        !used.has(t.id) &&
        cat.keywords.some((kw) => t.name.toLowerCase().includes(kw))
    );
    if (matched.length > 0) {
      matched.forEach((t) => used.add(t.id));
      groups.push({ label: cat.label, icon: cat.icon, treatments: matched });
    }
  }

  const remaining = treatments.filter((t) => !used.has(t.id));
  if (remaining.length > 0) {
    groups.push({ label: "Other", icon: ListAltIcon, treatments: remaining });
  }

  return groups;
}

export default function BookingForm({
  treatments,
  patientId = "",
  newPatientData,
  returnUrl = "/",
  defaultTreatmentId = "",
}: BookingFormProps) {
  const router = useRouter()
  const [step, setStep] = useState(defaultTreatmentId ? 2 : 1)
  const [searchQuery, setSearchQuery] = useState("")
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set())

  // React Hook Form Setup
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      treatmentId: defaultTreatmentId || "",
      date: "",
      time: "",
      notes: "",
      isGuest: !patientId,
      guestName: "",
      guestPhone: "",
      guestEmail: "",
      guestDob: "",
    },
    mode: "onTouched",
  });

  const watchTreatmentId = watch("treatmentId");
  const watchDate = watch("date");
  const watchTime = watch("time");
  const watchIsGuest = watch("isGuest");

  // Sync defaultTreatmentId if it changes
  useEffect(() => {
    if (defaultTreatmentId) {
      setValue("treatmentId", defaultTreatmentId);
      setStep(2);
    }
  }, [defaultTreatmentId, setValue]);

  // Set new patient data if provided
  useEffect(() => {
    if (newPatientData && newPatientData.name) {
      setValue("isGuest", true);
      setValue("guestName", newPatientData.name);
      setValue("guestPhone", newPatientData.phone);
      setValue("guestEmail", newPatientData.email);
    }
  }, [newPatientData, setValue]);

  const selectedTreatment = treatments.find((t) => t.id === watchTreatmentId);

  const nextStep = async () => {
    if (step === 1) {
      const isValid = await trigger("treatmentId");
      if (!isValid) {
        toast.error("Please select a treatment first");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      const isValid = await trigger(["date", "time"]);
      if (!isValid) {
        toast.error("Please select both a date and time slot");
        return;
      }
      setStep(3);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const onSubmit = async (data: BookingFormData) => {
    try {
      const payload: any = {
        treatmentId: data.treatmentId,
        date: data.date,
        time: data.time,
        notes: data.notes || undefined,
      };

      if (data.isGuest) {
        payload.guestName = data.guestName;
        payload.guestPhone = data.guestPhone;
        payload.guestEmail = data.guestEmail || undefined;
        payload.guestDob = data.guestDob || undefined;
      } else {
        payload.patientId = patientId;
      }

      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();

      if (!res.ok) {
        throw new Error(resData.error || "Failed to book appointment");
      }

      toast.success("Appointment booked successfully!");
      reset();
      router.push(returnUrl);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    }
  };

  const steps = [
    { num: 1, label: "Select Treatment" },
    { num: 2, label: "Date & Time" },
    { num: 3, label: "Patient Details" },
  ];

  const inputClasses =
    "w-full h-11 px-3.5 rounded-xl border border-slate-300 text-slate-900 bg-white placeholder:text-slate-400 focus:border-teal-600 focus:ring-1 focus:ring-teal-500/20 focus:outline-none text-sm transition-all";
  const errorClasses = "text-rose-500 text-xs mt-1 font-medium";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Step Indicator Header */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-200">
        {steps.map((s, i) => (
          <div key={s.num} className="flex items-center">
            <div
              className={`flex items-center gap-2.5 font-bold ${
                step >= s.num ? "text-teal-700" : "text-slate-400"
              }`}
            >
              <div
                className={`size-9 rounded-full flex items-center justify-center text-xs font-black border-2 transition-all ${
                  step > s.num
                    ? "bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-600/20"
                    : step === s.num
                    ? "border-teal-600 text-teal-700 bg-teal-50 shadow-sm"
                    : "border-slate-300 text-slate-400 bg-white"
                }`}
              >
                {step > s.num ? <CheckCircleOutlineIcon sx={{ fontSize: 18 }} /> : s.num}
              </div>
              <span className="hidden sm:inline text-xs uppercase tracking-wider">{s.label}</span>
            </div>
            {i < 2 && (
              <div
                className={`w-6 sm:w-14 h-0.5 mx-2.5 rounded-full ${
                  step > s.num ? "bg-teal-600" : "bg-slate-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Select Treatment */}
      {step === 1 && (
        <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
            <h2 className="text-base font-extrabold text-slate-950 flex items-center gap-2">
              <MedicalServicesIcon sx={{ fontSize: 20, color: "#0d9488" }} />
              <span>Select Treatment</span>
            </h2>
            <span className="text-xs text-slate-500 font-semibold">
              {treatments.length} Available Procedures
            </span>
          </div>

          <div className="p-6 space-y-4">
            {/* Search Input */}
            <div className="relative">
              <SearchIcon sx={{ fontSize: 18, color: "#94a3b8" }} className="absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search treatments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-50/60 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-teal-600 focus:ring-1 focus:ring-teal-500/20 focus:outline-none text-sm transition-all"
              />
            </div>

            {/* Grouped Treatment List with MUI Category Icons */}
            <div className="max-h-[440px] overflow-y-auto pr-1 space-y-3.5 custom-scrollbar">
              {(() => {
                const filtered = treatments.filter((t) =>
                  t.name.toLowerCase().includes(searchQuery.toLowerCase())
                );
                const groups = groupTreatments(filtered);

                if (groups.length === 0) {
                  return (
                    <div className="py-12 text-center text-slate-500 text-sm">
                      No treatments found matching &quot;{searchQuery}&quot;
                    </div>
                  );
                }

                return groups.map((group) => {
                  const isCollapsed = collapsedCategories.has(group.label);
                  const IconComponent = group.icon;

                  return (
                    <div key={group.label} className="rounded-2xl border border-slate-200/80 overflow-hidden bg-white">
                      {/* Category Header with MUI Icon */}
                      <button
                        type="button"
                        onClick={() => {
                          setCollapsedCategories((prev) => {
                            const next = new Set(prev);
                            if (next.has(group.label)) next.delete(group.label);
                            else next.add(group.label);
                            return next;
                          });
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-3 bg-slate-50/90 hover:bg-slate-100/90 transition-all cursor-pointer text-left"
                      >
                        {isCollapsed ? (
                          <ChevronRightIcon sx={{ fontSize: 18, color: "#64748b" }} />
                        ) : (
                          <ExpandMoreIcon sx={{ fontSize: 20, color: "#0d9488" }} />
                        )}
                        <IconComponent sx={{ fontSize: 18, color: "#0d9488" }} />
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                          {group.label}
                        </span>
                        <span className="ml-auto text-xs text-slate-600 font-bold bg-slate-200/80 px-2 py-0.5 rounded-full font-mono">
                          {group.treatments.length}
                        </span>
                      </button>

                      {/* Treatment Items */}
                      {!isCollapsed && (
                        <div className="p-2 space-y-2 bg-white">
                          {group.treatments.map((t) => {
                            const isSelected = watchTreatmentId === t.id;
                            return (
                              <button
                                key={t.id}
                                type="button"
                                onClick={() => {
                                  setValue("treatmentId", t.id, { shouldValidate: true });
                                }}
                                className={`w-full p-4 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                                  isSelected
                                    ? "bg-teal-50/60 border-teal-500 shadow-sm ring-1 ring-teal-500/30"
                                    : "bg-white border-slate-200/70 hover:border-teal-300 hover:bg-slate-50/40"
                                }`}
                              >
                                <div className="flex items-start justify-between gap-4 w-full">
                                  <div>
                                    <h4 className="font-extrabold text-slate-950 text-sm">
                                      {t.name}
                                    </h4>
                                    <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                                      {t.description || "Certified procedural protocol"}
                                    </p>
                                    <div className="flex items-center gap-1.5 mt-2 text-xs font-mono text-slate-400">
                                      <AccessTimeIcon sx={{ fontSize: 14 }} />
                                      <span>{t.durationMin} min</span>
                                    </div>
                                  </div>
                                  <div className="text-right shrink-0">
                                    <span className="text-sm font-black text-teal-800">
                                      {formatPKR(t.price)}
                                    </span>
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                });
              })()}
            </div>
            {errors.treatmentId && (
              <p className={errorClasses}>{errors.treatmentId.message}</p>
            )}
          </div>
        </div>
      )}

      {/* Step 2: Date & Time */}
      {step === 2 && (
        <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md">
                Selected Treatment
              </span>
              <h3 className="font-extrabold text-slate-950 text-lg mt-1.5">
                {selectedTreatment?.name}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5 font-mono">
                {selectedTreatment?.durationMin} min • {selectedTreatment ? formatPKR(selectedTreatment.price) : ""}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-xs font-bold text-teal-700 hover:text-teal-800 underline cursor-pointer"
            >
              Change
            </button>
          </div>

          <Controller
            name="date"
            control={control}
            render={({ field }) => (
              <div>
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 block">
                  Select Preferred Date *
                </Label>
                <input
                  type="date"
                  value={field.value}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    setValue("time", "");
                  }}
                  className={inputClasses}
                />
                {errors.date && <p className={errorClasses}>{errors.date.message}</p>}
              </div>
            )}
          />

          {watchDate && (
            <Controller
              name="time"
              control={control}
              render={({ field }) => (
                <div>
                  <Label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 block">
                    Select Available Time Slot *
                  </Label>
                  <TimeSlotSelector
                    date={watchDate}
                    treatmentId={watchTreatmentId}
                    value={field.value}
                    onChange={(val) => field.onChange(val)}
                  />
                  {errors.time && <p className={errorClasses}>{errors.time.message}</p>}
                </div>
              )}
            />
          )}
        </div>
      )}

      {/* Step 3: Patient Information */}
      {step === 3 && (
        <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs p-6 space-y-6">
          <div className="pb-4 border-b border-slate-100">
            <h3 className="font-extrabold text-slate-950 text-base">
              Patient Contact Information
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Confirmations & reminders will be sent via SMS & WhatsApp
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 block">
                Patient Name *
              </Label>
              <Controller
                name="guestName"
                control={control}
                render={({ field }) => (
                  <Input {...field} placeholder="Full Name" className={inputClasses} />
                )}
              />
              {errors.guestName && <p className={errorClasses}>{errors.guestName.message}</p>}
            </div>

            <div>
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 block">
                Phone Number (WhatsApp) *
              </Label>
              <Controller
                name="guestPhone"
                control={control}
                render={({ field }) => (
                  <Input {...field} placeholder="0300 1234567" className={inputClasses} />
                )}
              />
              {errors.guestPhone && <p className={errorClasses}>{errors.guestPhone.message}</p>}
            </div>
          </div>

          <div>
            <Label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 block">
              Email Address (Optional)
            </Label>
            <Controller
              name="guestEmail"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="patient@example.com" className={inputClasses} />
              )}
            />
            {errors.guestEmail && <p className={errorClasses}>{errors.guestEmail.message}</p>}
          </div>

          <div>
            <Label className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 block">
              Additional Notes or Medical History
            </Label>
            <Controller
              name="notes"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  placeholder="Any allergies, current toothache, or special requirements..."
                  className="rounded-xl border border-slate-300 text-sm"
                  rows={3}
                />
              )}
            />
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-4">
        {step > 1 ? (
          <button
            type="button"
            onClick={prevStep}
            className="px-5 py-3 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs uppercase tracking-wider hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowBackIcon sx={{ fontSize: 16 }} />
            <span>Back</span>
          </button>
        ) : (
          <div />
        )}

        {step < 3 ? (
          <button
            type="button"
            onClick={nextStep}
            className="px-7 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-md shadow-teal-600/30 transition-transform active:scale-95 flex items-center gap-1.5 cursor-pointer"
          >
            <span>Next</span>
            <ArrowForwardIcon sx={{ fontSize: 16 }} />
          </button>
        ) : (
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3.5 rounded-xl bg-slate-950 hover:bg-teal-700 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-slate-950/20 transition-all active:scale-95 flex items-center gap-2 cursor-pointer disabled:opacity-70"
          >
            {isSubmitting ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              <CalendarMonthIcon sx={{ fontSize: 18, color: "#2dd4bf" }} />
            )}
            <span>{isSubmitting ? "Booking..." : "Confirm & Reserve Slot"}</span>
          </button>
        )}
      </div>
    </form>
  );
}
