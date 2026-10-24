"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  CalendarPlus,
  LogOut,
  FileText,
  CreditCard,
  CheckCircle2,
  CalendarClock,
  AlertCircle,
  ChevronRight,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";
import { formatPKR, formatDate, formatTime } from "@/lib/utils";
import { clinicInfo } from "@/app/constants/mockData";

interface AppointmentItem {
  id: string;
  startTime: string;
  endTime: string;
  status: string;
  price: number;
  amountPaid: number | null;
  notes: string | null;
  bookedBy: string;
  treatment: {
    id: string;
    name: string;
    durationMin: number;
    price: number;
    category: string;
  };
  clinicalNotes: {
    id: string;
    diagnosis: string | null;
    treatmentDone: string;
    prescription: string | null;
    remarks: string | null;
  }[];
  payments: {
    id: string;
    amount: number;
    method: string;
    date: string;
  }[];
}

interface UserProfile {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  patientCode: number | null;
  dateOfBirth: string | null;
}

export default function PortalClient({
  user,
  appointments,
}: {
  user: UserProfile;
  appointments: AppointmentItem[];
}) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const [filter, setFilter] = useState<"ALL" | "UPCOMING" | "PAST">("ALL");

  const now = new Date();
  const upcoming = appointments.filter(
    (a) => new Date(a.startTime) >= now && a.status !== "CANCELLED"
  );
  const past = appointments.filter(
    (a) => new Date(a.startTime) < now || a.status === "COMPLETED" || a.status === "CANCELLED"
  );

  const displayedAppointments =
    filter === "UPCOMING"
      ? upcoming
      : filter === "PAST"
      ? past
      : appointments;

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch {
      setLoggingOut(false);
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "SCHEDULED":
        return "bg-teal-500/15 text-teal-300 border-teal-500/30";
      case "COMPLETED":
        return "bg-emerald-500/15 text-emerald-300 border-emerald-500/30";
      case "RESCHEDULED":
        return "bg-amber-500/15 text-amber-300 border-amber-500/30";
      case "CANCELLED":
        return "bg-rose-500/15 text-rose-300 border-rose-500/30";
      default:
        return "bg-slate-500/15 text-slate-300 border-slate-500/30";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="size-9 rounded-full gradient-primary flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-teal-500/20">
              E
            </div>
            <span className="text-lg font-bold text-white">
              Elite <span className="text-teal-400">Dental</span>
              <span className="ml-2 text-xs font-medium px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/20">
                Patient Portal
              </span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/book"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 gradient-primary-h text-white text-xs sm:text-sm font-semibold rounded-full shadow-lg shadow-teal-500/20 hover:shadow-teal-500/30 transition-premium"
            >
              <CalendarPlus className="size-4" />
              Book Appointment
            </Link>
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="inline-flex items-center gap-2 px-3 py-2 text-xs sm:text-sm text-slate-400 hover:text-white rounded-lg border border-white/10 hover:bg-white/[0.05] transition-all"
            >
              <LogOut className="size-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Welcome & Profile Card */}
        <div className="glass-card rounded-2xl p-6 sm:p-8 border border-white/10 relative overflow-hidden mb-8">
          <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                  Welcome back, {user.name}
                </h1>
                {user.patientCode && (
                  <span className="px-2.5 py-0.5 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-300 text-xs font-semibold">
                    ID #{user.patientCode}
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-400">
                Track your dental visits, upcoming appointments, and clinical treatment history.
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-400">
                {user.phone && (
                  <span className="flex items-center gap-1.5">
                    <Phone className="size-3.5 text-teal-400" />
                    {user.phone}
                  </span>
                )}
                {user.email && (
                  <span className="flex items-center gap-1.5">
                    <Mail className="size-3.5 text-teal-400" />
                    {user.email}
                  </span>
                )}
              </div>
            </div>

            <div className="flex sm:flex-col gap-3">
              <Link
                href="/book"
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 gradient-primary-h text-white text-sm font-semibold rounded-full shadow-lg shadow-teal-500/20 hover:shadow-teal-500/30 transition-premium"
              >
                <CalendarPlus className="size-4" />
                Book New Slot
              </Link>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 mt-6 pt-6 border-t border-white/[0.06]">
            <div className="p-3 sm:p-4 rounded-xl bg-slate-950/50 border border-white/5">
              <p className="text-xs text-slate-400">Total Visits</p>
              <p className="text-xl sm:text-2xl font-bold text-white mt-1">
                {appointments.length}
              </p>
            </div>
            <div className="p-3 sm:p-4 rounded-xl bg-slate-950/50 border border-white/5">
              <p className="text-xs text-slate-400">Upcoming</p>
              <p className="text-xl sm:text-2xl font-bold text-teal-400 mt-1">
                {upcoming.length}
              </p>
            </div>
            <div className="p-3 sm:p-4 rounded-xl bg-slate-950/50 border border-white/5">
              <p className="text-xs text-slate-400">Completed</p>
              <p className="text-xl sm:text-2xl font-bold text-emerald-400 mt-1">
                {appointments.filter((a) => a.status === "COMPLETED").length}
              </p>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-950/50 border border-white/5">
            <button
              onClick={() => setFilter("ALL")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filter === "ALL"
                  ? "bg-teal-500/20 text-teal-300 border border-teal-500/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              All Records ({appointments.length})
            </button>
            <button
              onClick={() => setFilter("UPCOMING")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filter === "UPCOMING"
                  ? "bg-teal-500/20 text-teal-300 border border-teal-500/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Upcoming ({upcoming.length})
            </button>
            <button
              onClick={() => setFilter("PAST")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filter === "PAST"
                  ? "bg-teal-500/20 text-teal-300 border border-teal-500/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              History ({past.length})
            </button>
          </div>
        </div>

        {/* Appointment Cards */}
        {displayedAppointments.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center border border-white/10">
            <CalendarClock className="size-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-white">No Appointments Found</h3>
            <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">
              {filter === "UPCOMING"
                ? "You do not have any upcoming visits scheduled."
                : "You don't have any appointment records in this view."}
            </p>
            <Link
              href="/book"
              className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 gradient-primary-h text-white text-sm font-semibold rounded-full shadow-lg shadow-teal-500/20"
            >
              <CalendarPlus className="size-4" />
              Schedule a Visit
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {displayedAppointments.map((item) => (
              <div
                key={item.id}
                className="glass-card rounded-xl p-5 sm:p-6 border border-white/10 hover:border-teal-500/30 transition-all bg-slate-900/40"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
                  <div className="flex items-start gap-3">
                    <div className="size-10 rounded-xl bg-teal-500/10 flex items-center justify-center shrink-0 border border-teal-500/20 text-teal-400">
                      <Stethoscope className="size-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h4 className="text-base sm:text-lg font-bold text-white">
                          {item.treatment?.name || "Dental Procedure"}
                        </h4>
                        <span
                          className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${getStatusBadge(
                            item.status
                          )}`}
                        >
                          {item.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Clock className="size-3 text-teal-400" />
                          {item.treatment?.durationMin || 30} mins
                        </span>
                        <span>•</span>
                        <span>Fee: {formatPKR(item.price)}</span>
                      </p>
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <p className="text-sm font-semibold text-white">
                      {formatDate(item.startTime, "medium")}
                    </p>
                    <p className="text-xs text-teal-400 font-medium">
                      {formatTime(item.startTime)} – {formatTime(item.endTime)}
                    </p>
                  </div>
                </div>

                {/* Clinical Notes / Doctor Records (if completed) */}
                {item.clinicalNotes && item.clinicalNotes.length > 0 && (
                  <div className="mt-4 p-4 rounded-xl bg-slate-950/60 border border-teal-500/20 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-teal-300">
                      <FileText className="size-3.5" />
                      Doctor&apos;s Clinical Findings
                    </div>
                    {item.clinicalNotes.map((note) => (
                      <div key={note.id} className="text-xs text-slate-300 space-y-1">
                        {note.diagnosis && (
                          <p>
                            <strong className="text-slate-400">Diagnosis:</strong>{" "}
                            {note.diagnosis}
                          </p>
                        )}
                        <p>
                          <strong className="text-slate-400">Procedure Done:</strong>{" "}
                          {note.treatmentDone}
                        </p>
                        {note.prescription && (
                          <p>
                            <strong className="text-slate-400">Prescription:</strong>{" "}
                            {note.prescription}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Footer notes & support */}
                <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
                  <span>Booking Reference: #{item.id.slice(0, 8)}</span>

                  {item.status === "SCHEDULED" && (
                    <a
                      href={`https://wa.me/${clinicInfo.whatsapp}?text=Hi, I would like to inquire/reschedule my appointment #${item.id.slice(0, 8)} for ${item.treatment?.name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal-400 hover:text-teal-300 font-medium inline-flex items-center gap-1"
                    >
                      Need to reschedule? WhatsApp Clinic <ChevronRight className="size-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
