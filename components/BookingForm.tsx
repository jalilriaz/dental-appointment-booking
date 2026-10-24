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
import {
  Loader2,
  CheckCircle,
  Calendar,
  Clock,
  Stethoscope,
  ArrowRight,
  ArrowLeft,
  Search,
  ChevronDown,
  ChevronRight,
  MapPin,
  CreditCard,
  Wallet,
  AlertCircle
} from "lucide-react"
import { TimeSlotSelector, TimeSlot } from "@/components/ui/time-slot-selector";
import { formatPKR } from "@/lib/utils";
import type { Treatment } from "@/lib/types";
import { PremiumLoader } from "@/components/ui/premium-loader";

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
    if (!data.guestDob || data.guestDob.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Guest date of birth is required",
        path: ["guestDob"],
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


// ─── Treatment Category Grouping ─────────────────────────
const TREATMENT_CATEGORIES: { label: string; emoji: string; keywords: string[] }[] = [
  { label: "Implants", emoji: "🦷", keywords: ["implant"] },
  { label: "Whitening", emoji: "✨", keywords: ["whitening"] },
  { label: "Scaling & Cleaning", emoji: "🪥", keywords: ["scaling", "polishing"] },
  { label: "Root Canal (RCT)", emoji: "🔧", keywords: ["rct", "root canal"] },
  { label: "Extractions", emoji: "🦷", keywords: ["extraction"] },
  { label: "Braces & Aligners", emoji: "😁", keywords: ["braces", "aligner"] },
  { label: "Veneers & Cosmetic", emoji: "💎", keywords: ["veneer", "lumineer"] },
];

function groupTreatments(treatments: Treatment[]) {
  const groups: { label: string; emoji: string; treatments: Treatment[] }[] = [];
  const used = new Set<string>();

  for (const cat of TREATMENT_CATEGORIES) {
    const matched = treatments.filter(
      (t) =>
        !used.has(t.id) &&
        cat.keywords.some((kw) => t.name.toLowerCase().includes(kw))
    );
    if (matched.length > 0) {
      matched.forEach((t) => used.add(t.id));
      groups.push({ label: cat.label, emoji: cat.emoji, treatments: matched });
    }
  }

  const remaining = treatments.filter((t) => !used.has(t.id));
  if (remaining.length > 0) {
    groups.push({ label: "Other", emoji: "📋", treatments: remaining });
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
  const watchNotes = watch("notes");

  const [apiError, setApiError] = useState("");
  const [success, setSuccess] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

  const selectedTreatment = treatments.find((t) => t.id === watchTreatmentId);

  const today = new Date().toISOString().split("T")[0];
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 90);
  const maxDateStr = maxDate.toISOString().split("T")[0];

  // Automatically reset the selected time when date or treatment changes to prevent invalid bookings
  useEffect(() => {
    setValue("time", "");
    setSelectedSlot(null);
  }, [watchDate, watchTreatmentId, setValue]);

  function handleDateChange(value: string) {
    const date = new Date(value)
    const dayOfWeek = date.getDay()
    const todayDate = new Date()
    todayDate.setHours(0, 0, 0, 0)
    if (date < todayDate) {
      toast.warning("Invalid Date", { description: "You cannot book an appointment on a past date. Please select a future date." })
      setValue("date", "")
      return
    }
    if (dayOfWeek === 0) {
      toast.warning("Clinic Closed", { description: "Sunday is a clinic off day. Please select another date to book your appointment." })
      setValue("date", "")
      return
    }
    setValue("date", value)
    trigger("date")
  }

  const onSubmit = async (data: BookingFormData) => {
    setApiError("")
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          treatmentId: data.treatmentId,
          date: data.date,
          time: data.time,
          notes: data.notes,
          patientId: patientId || undefined,
          newPatient: newPatientData || undefined,
          guestName: data.isGuest ? data.guestName : undefined,
          guestPhone: data.isGuest ? data.guestPhone : undefined,
          guestEmail: data.isGuest ? data.guestEmail : undefined,
          guestDob: data.isGuest ? data.guestDob : undefined,
        }),
      })
      const result = await res.json()
      if (res.ok && result.success) {
        setSuccess(true)
      } else {
        setApiError(result.error || "Failed to book appointment")
      }
    } catch {
      setApiError("Something went wrong. Please try again.")
    }
  }

  const handleNextStep1 = async () => {
    const valid = await trigger(["treatmentId"]);
    if (valid) setStep(2);
  };

  const handleNextStep2 = async () => {
    const valid = await trigger(["date", "time"]);
    if (valid) setStep(3);
  };

  const inputClasses = "h-11 bg-white/[0.04] border-white/10 text-white placeholder:text-slate-500 focus:border-teal-500/50 focus:ring-teal-500/20"
  const errorClasses = "text-xs text-red-400 mt-1";

  if (success) {
    return (
      <div className="glass-card rounded-2xl max-w-md mx-auto text-center overflow-hidden">
        <div className="pt-10 pb-10 px-6 space-y-4">
          <div className="size-16 rounded-full bg-teal-500/10 flex items-center justify-center mx-auto animate-glow-pulse">
            <CheckCircle className="size-8 text-teal-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">
            Appointment Booked!
          </h2>
          <p className="text-slate-400">
            Your appointment for <strong className="text-white">{selectedTreatment?.name}</strong> has been confirmed.
          </p>
          <p className="text-sm text-slate-400">
            {watchDate && new Date(watchDate).toLocaleDateString("en-PK", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}{" "}
            at {selectedSlot?.label} – {selectedSlot?.endLabel}
          </p>
          <div className="flex gap-3 justify-center pt-4">
            <Button
              variant="outline"
              onClick={() => router.push(returnUrl)}
              className="border-slate-700 text-slate-200 hover:bg-white/[0.04]"
            >
              Go to Dashboard
            </Button>
            <Button
              className="btn-brand border-0 transition-premium active:scale-95"
              onClick={() => {
                setSuccess(false)
                setStep(1)
                reset()
              }}
            >
              Book Another
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      {/* Guest Booking Toggle */}
      <div className="flex items-center space-x-2 mb-6 bg-teal-500/10 p-3 rounded-lg border border-teal-500/20">
        <Controller
          name="isGuest"
          control={control}
          render={({ field }) => (
            <input
              type="checkbox"
              id="guestBooking"
              className="rounded border-slate-600 bg-slate-800 text-teal-500 focus:ring-teal-500"
              checked={field.value}
              onChange={(e) => field.onChange(e.target.checked)}
            />
          )}
        />
        <Label htmlFor="guestBooking" className="text-white cursor-pointer font-medium">
          Book for someone else (Family/Friend)
        </Label>
      </div>

      {watchIsGuest && (
        <div className="grid gap-4 mb-6 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] animate-in fade-in slide-in-from-top-2">
          <div>
            <Label className="text-slate-300 mb-1.5 block">Guest Name *</Label>
            <Controller
              name="guestName"
              control={control}
              render={({ field }) => (
                <>
                  <Input {...field} placeholder="Enter patient's name" className={inputClasses} />
                  {errors.guestName && <p className={errorClasses}>{errors.guestName.message}</p>}
                </>
              )}
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-slate-300 mb-1.5 block">Guest Phone *</Label>
              <Controller
                name="guestPhone"
                control={control}
                render={({ field }) => (
                  <>
                    <Input {...field} placeholder="0300..." className={inputClasses} />
                    {errors.guestPhone && <p className={errorClasses}>{errors.guestPhone.message}</p>}
                  </>
                )}
              />
            </div>
            <div>
              <Label className="text-slate-300 mb-1.5 block">Guest Email (Optional)</Label>
              <Controller
                name="guestEmail"
                control={control}
                render={({ field }) => (
                  <>
                    <Input {...field} placeholder="email@example.com" className={inputClasses} />
                    {errors.guestEmail && <p className={errorClasses}>{errors.guestEmail.message}</p>}
                  </>
                )}
              />
            </div>
            <div>
              <Label className="text-slate-300 mb-1.5 block">Guest Date of Birth *</Label>
              <Controller
                name="guestDob"
                control={control}
                render={({ field }) => (
                  <>
                    <Input type="date" {...field} max={today} className={inputClasses} />
                    {errors.guestDob && <p className={errorClasses}>{errors.guestDob.message}</p>}
                  </>
                )}
              />
            </div>
          </div>
        </div>
      )}

      {/* Step indicator */}
      <div className="flex items-center justify-between mb-8">
        {[
          { num: 1, label: "Treatment", icon: Stethoscope },
          { num: 2, label: "Date & Time", icon: Calendar },
          { num: 3, label: "Confirm", icon: CheckCircle },
        ].map((s, i) => (
          <div key={s.num} className="flex items-center">
            <div
              className={`flex items-center gap-2 ${step >= s.num ? "text-teal-400" : "text-slate-600"}`}
            >
              <div
                className={`size-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-premium ${step > s.num
                  ? "bg-teal-500 text-white border-teal-500"
                  : step === s.num
                    ? "border-teal-500 text-teal-400 bg-teal-500/10"
                    : "border-slate-700 text-slate-500"
                  }`}
              >
                {step > s.num ? <CheckCircle className="size-5" /> : s.num}
              </div>
              <span className="hidden sm:inline text-sm font-medium">
                {s.label}
              </span>
            </div>
            {i < 2 && (
              <div
                className={`w-8 sm:w-16 h-0.5 mx-2 ${step > s.num ? "bg-teal-500" : "bg-slate-700"}`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Select Treatment */}
      {step === 1 && (
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="px-6 py-5 border-b border-white/[0.06]">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Stethoscope className="size-5 text-teal-400" />
              Select Treatment
            </h2>
          </div>
          <div className="p-6 space-y-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search treatments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-4 rounded-lg bg-white/[0.04] border border-white/10 text-white placeholder:text-slate-500 focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/20 focus:outline-none text-sm transition-all"
              />
            </div>

            {/* Grouped Treatment List */}
            <div
              className="max-h-[420px] overflow-y-auto pr-1 space-y-4"
              style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(94,234,212,0.3) transparent' }}
            >
              {(() => {
                const filtered = treatments.filter((t) =>
                  t.name.toLowerCase().includes(searchQuery.toLowerCase())
                );
                const groups = groupTreatments(filtered);

                if (groups.length === 0) {
                  return (
                    <div className="py-8 text-center text-slate-400 text-sm">
                      No treatments found for &quot;{searchQuery}&quot;
                    </div>
                  );
                }

                return groups.map((group) => {
                  const isCollapsed = collapsedCategories.has(group.label);
                  return (
                    <div key={group.label}>
                      {/* Category Header */}
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
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05] transition-all cursor-pointer mb-2"
                      >
                        {isCollapsed ? (
                          <ChevronRight className="size-4 text-slate-400" />
                        ) : (
                          <ChevronDown className="size-4 text-teal-400" />
                        )}
                        <span className="text-sm">{group.emoji}</span>
                        <span className="text-sm font-semibold text-slate-200">
                          {group.label}
                        </span>
                        <span className="ml-auto text-xs text-slate-500 bg-white/[0.04] px-2 py-0.5 rounded-full">
                          {group.treatments.length}
                        </span>
                      </button>

                      {/* Treatment Cards */}
                      {!isCollapsed && (
                        <div className="space-y-2 pl-2">
                          {group.treatments.map((t) => (
                            <button
                              key={t.id}
                              type="button"
                              onClick={() => {
                                setValue("treatmentId", t.id);
                                trigger("treatmentId");
                              }}
                              className={`w-full p-4 rounded-xl border-2 text-left transition-premium cursor-pointer ${watchTreatmentId === t.id
                                ? "border-teal-500/50 bg-teal-500/10 ring-1 ring-teal-500/30"
                                : "border-white/[0.06] hover:border-teal-500/30 hover:bg-white/[0.03]"
                                }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="min-w-0 flex-1">
                                  <p
                                    className={`font-semibold ${watchTreatmentId === t.id ? "text-teal-400" : "text-white"
                                      }`}
                                  >
                                    {t.name}
                                  </p>
                                  {t.description && (
                                    <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                                      {t.description}
                                    </p>
                                  )}
                                  <div className="flex items-center gap-2 mt-2">
                                    <Clock className="size-3 text-slate-400" />
                                    <span className="text-xs text-slate-400">
                                      {t.durationMin} min
                                    </span>
                                  </div>
                                </div>
                                <div className="text-right ml-4 shrink-0">
                                  <p className="text-lg font-bold text-teal-400">
                                    {formatPKR(t.price)}
                                  </p>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                });
              })()}
            </div>

            {errors.treatmentId && <p className={errorClasses}>{errors.treatmentId.message}</p>}

            <div className="flex justify-end pt-2">
              <Button
                type="button"
                disabled={!watchTreatmentId}
                onClick={handleNextStep1}
                className="btn-brand border-0 transition-premium active:scale-95"
              >
                Next <ArrowRight className="ml-1 size-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Date & Time */}
      {step === 2 && (
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="px-6 py-5 border-b border-white/[0.06]">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Calendar className="size-5 text-teal-400" />
              Select Date & Time
            </h2>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <Label className="text-sm font-medium text-slate-300 mb-2 block">
                Select Date
              </Label>
              <Controller
                name="date"
                control={control}
                render={({ field }) => (
                  <>
                    <Input
                      type="date"
                      value={field.value}
                      onChange={(e) => handleDateChange(e.target.value)}
                      min={today}
                      max={maxDateStr}
                      className={`${inputClasses} max-w-xs`}
                    />
                    {errors.date && <p className={errorClasses}>{errors.date.message}</p>}
                  </>
                )}
              />
              <p className="text-xs text-slate-400 mt-1">
                📌 Clinic is closed on Sundays
              </p>
            </div>

            {watchDate && (
              <div>
                <Label className="text-sm font-medium text-slate-300 mb-2 block">
                  Available Time Slots
                  {selectedTreatment && (
                    <span className="font-normal text-slate-400 ml-2">
                      ({selectedTreatment.durationMin} min appointment)
                    </span>
                  )}
                </Label>

                <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-4">
                  <TimeSlotSelector
                    date={watchDate}
                    treatmentId={watchTreatmentId}
                    value={watchTime || ""}
                    onChange={(val) => {
                      setValue("time", val);
                      trigger("time");
                    }}
                    onSlotSelect={(slot) => setSelectedSlot(slot)}
                  />
                </div>
                {errors.time && <p className={errorClasses}>{errors.time.message}</p>}

                {watchTime && selectedSlot && selectedTreatment && (
                  <div className="mt-4 p-4 bg-teal-500/10 border border-teal-500/20 rounded-lg">
                    <p className="text-sm text-teal-300 font-medium">
                      ⏰ Your appointment:{" "}
                      <strong className="text-teal-200">
                        {selectedSlot.label} – {selectedSlot.endLabel}
                      </strong>{" "}
                      ({selectedTreatment.durationMin} minutes)
                    </p>
                  </div>
                )}
              </div>
            )}

            <div>
              <Label className="text-sm font-medium text-slate-300 mb-2 block">
                Notes (optional)
              </Label>
              <Controller
                name="notes"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    placeholder="Any special requests or information for the doctor..."
                    rows={3}
                    className="bg-white/[0.04] border-white/10 text-white placeholder:text-slate-500 focus:border-teal-500/50 focus:ring-teal-500/20"
                  />
                )}
              />
            </div>

            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(1)}
                className="border-slate-700 text-slate-200 hover:bg-white/[0.04]"
              >
                <ArrowLeft className="mr-1 size-4" /> Back
              </Button>
              <Button
                type="button"
                disabled={!watchTime}
                onClick={handleNextStep2}
                className="btn-brand border-0 transition-premium active:scale-95"
              >
                Review Booking <ArrowRight className="ml-1 size-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Confirm */}
      {step === 3 && (
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="px-6 py-5 border-b border-white/[0.06]">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <CheckCircle className="size-5 text-teal-400" />
              Confirm Your Booking
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wide">
                    Treatment
                  </p>
                  <p className="font-medium text-white">{selectedTreatment?.name}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wide">
                    Date
                  </p>
                  <p className="font-medium text-white">
                    {watchDate &&
                      new Date(watchDate).toLocaleDateString("en-PK", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wide">
                    Time
                  </p>
                  <p className="font-medium text-white">
                    {selectedSlot?.label} – {selectedSlot?.endLabel}
                    <span className="text-xs text-slate-400 ml-1">
                      ({selectedTreatment?.durationMin} min)
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wide">
                    Price
                  </p>
                  <p className="font-bold text-teal-400 text-lg">
                    {formatPKR(selectedTreatment?.price || 0)}
                  </p>
                </div>
              </div>
              {watchNotes && (
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wide">
                    Notes
                  </p>
                  <p className="text-sm text-slate-300">{watchNotes}</p>
                </div>
              )}
            </div>

            {apiError && (
              <div className="p-3 text-sm text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg">
                {apiError}
              </div>
            )}

            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(2)}
                className="border-slate-700 text-slate-200 hover:bg-white/[0.04]"
              >
                <ArrowLeft className="mr-1 size-4" /> Back
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="btn-brand border-0 min-w-[160px] transition-premium active:scale-95"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Booking...
                  </>
                ) : (
                  "Confirm Booking"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {isSubmitting && <PremiumLoader text="Processing Booking..." />}
    </form>
  )
}
