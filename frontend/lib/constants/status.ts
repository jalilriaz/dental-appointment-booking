import type { ApptStatus } from "@/src/generated/client";

export interface AppointmentStatusMeta {
    value: string;
    label: string;
    badgeClass: string;
    dotColor: string;
    legacyBg: string;
    textColor: string;
}

export const APPT_STATUS_META: Record<string, AppointmentStatusMeta> = {
    SCHEDULED: {
        value: "SCHEDULED",
        label: "Scheduled",
        badgeClass: "bg-sky-50 text-sky-700 border border-sky-200",
        dotColor: "bg-sky-500",
        legacyBg: "badge-scheduled",
        textColor: "text-sky-700",
    },
    RESCHEDULED: {
        value: "RESCHEDULED",
        label: "Rescheduled",
        badgeClass: "bg-teal-50 text-teal-700 border border-teal-200",
        dotColor: "bg-teal-500",
        legacyBg: "badge-rescheduled",
        textColor: "text-teal-700",
    },
    ARRIVED: {
        value: "ARRIVED",
        label: "Arrived",
        badgeClass: "bg-amber-50 text-amber-800 border border-amber-200",
        dotColor: "bg-amber-500",
        legacyBg: "badge-arrived",
        textColor: "text-amber-800",
    },
    IN_PROGRESS: {
        value: "IN_PROGRESS",
        label: "In progress",
        badgeClass: "bg-cyan-50 text-cyan-800 border border-cyan-200",
        dotColor: "bg-cyan-600",
        legacyBg: "badge-in-progress",
        textColor: "text-cyan-800",
    },
    COMPLETED: {
        value: "COMPLETED",
        label: "Completed",
        badgeClass: "bg-emerald-50 text-emerald-700 border border-emerald-200",
        dotColor: "bg-emerald-500",
        legacyBg: "badge-completed",
        textColor: "text-emerald-700",
    },
    CANCELLED: {
        value: "CANCELLED",
        label: "Cancelled",
        badgeClass: "bg-rose-50 text-rose-700 border border-rose-200",
        dotColor: "bg-rose-500",
        legacyBg: "badge-cancelled",
        textColor: "text-rose-700",
    },
    Not_Visited: {
        value: "Not_Visited",
        label: "No-show",
        badgeClass: "bg-orange-50 text-orange-800 border border-orange-200",
        dotColor: "bg-orange-500",
        legacyBg: "badge-no-show",
        textColor: "text-orange-800",
    },
};

export const APPOINTMENT_STATUS_LIST = Object.values(APPT_STATUS_META);

export const ALLOWED_STATUS_TRANSITIONS: Record<ApptStatus, ApptStatus[]> = {
    SCHEDULED: ["ARRIVED", "IN_PROGRESS", "COMPLETED", "CANCELLED", "Not_Visited", "RESCHEDULED"],
    RESCHEDULED: ["ARRIVED", "IN_PROGRESS", "COMPLETED", "CANCELLED", "Not_Visited", "RESCHEDULED"],
    ARRIVED: ["IN_PROGRESS", "COMPLETED", "CANCELLED", "Not_Visited"],
    IN_PROGRESS: ["COMPLETED", "CANCELLED", "Not_Visited"],
    COMPLETED: [],
    CANCELLED: [],
    Not_Visited: ["RESCHEDULED", "SCHEDULED"],
};

const OPERATIONAL_STATUS_META: Record<string, AppointmentStatusMeta> = {
    SENT: { value: "SENT", label: "Sent", badgeClass: "bg-emerald-50 text-emerald-700 border border-emerald-200", dotColor: "bg-emerald-500", legacyBg: "", textColor: "text-emerald-700" },
    FAILED: { value: "FAILED", label: "Failed", badgeClass: "bg-rose-50 text-rose-700 border border-rose-200", dotColor: "bg-rose-500", legacyBg: "", textColor: "text-rose-700" },
    SKIPPED: { value: "SKIPPED", label: "Skipped", badgeClass: "bg-amber-50 text-amber-800 border border-amber-200", dotColor: "bg-amber-500", legacyBg: "", textColor: "text-amber-800" },
    PENDING: { value: "PENDING", label: "Pending", badgeClass: "bg-sky-50 text-sky-700 border border-sky-200", dotColor: "bg-sky-500", legacyBg: "", textColor: "text-sky-700" },
    ACTIVE: { value: "ACTIVE", label: "Active", badgeClass: "bg-emerald-50 text-emerald-700 border border-emerald-200", dotColor: "bg-emerald-500", legacyBg: "", textColor: "text-emerald-700" },
    DEACTIVATED: { value: "DEACTIVATED", label: "Deactivated", badgeClass: "bg-slate-100 text-slate-600 border border-slate-300", dotColor: "bg-slate-400", legacyBg: "", textColor: "text-slate-600" },
    RECEIVED: { value: "RECEIVED", label: "Received", badgeClass: "bg-teal-50 text-teal-800 border border-teal-200", dotColor: "bg-teal-600", legacyBg: "", textColor: "text-teal-800" },
    DELIVERED: { value: "DELIVERED", label: "Delivered", badgeClass: "bg-emerald-50 text-emerald-700 border border-emerald-200", dotColor: "bg-emerald-500", legacyBg: "", textColor: "text-emerald-700" },
    WAITING: { value: "WAITING", label: "Waiting", badgeClass: "bg-amber-50 text-amber-800 border border-amber-200", dotColor: "bg-amber-500", legacyBg: "", textColor: "text-amber-800" },
    NOTIFIED: { value: "NOTIFIED", label: "Notified", badgeClass: "bg-sky-50 text-sky-700 border border-sky-200", dotColor: "bg-sky-500", legacyBg: "", textColor: "text-sky-700" },
    BOOKED: { value: "BOOKED", label: "Booked", badgeClass: "bg-emerald-50 text-emerald-700 border border-emerald-200", dotColor: "bg-emerald-500", legacyBg: "", textColor: "text-emerald-700" },
    EXPIRED: { value: "EXPIRED", label: "Expired", badgeClass: "bg-slate-100 text-slate-600 border border-slate-200", dotColor: "bg-slate-400", legacyBg: "", textColor: "text-slate-600" },
};

export function getStatusMeta(status: string): AppointmentStatusMeta {
    return (
        APPT_STATUS_META[status] ||
        OPERATIONAL_STATUS_META[status] || {
            value: status,
            label: status,
            badgeClass: "bg-slate-100 text-slate-700 border border-slate-200",
            dotColor: "bg-slate-400",
            legacyBg: "",
            textColor: "text-slate-700",
        }
    );
}

export function canTransitionStatus(from: ApptStatus, to: ApptStatus): boolean {
    if (from === to) return true;
    return ALLOWED_STATUS_TRANSITIONS[from]?.includes(to) ?? false;
}
