// ─── Canonical Shared Types ──────────────────────────────
// All components should import types from here instead of
// defining local copies. Keep in sync with Prisma schema.


// ─── Treatment ───────────────────────────────────────────

/** Full Treatment record — matches Prisma `Treatment` model. */
export interface Treatment {
    id: string;
    name: string;
    durationMin: number;
    price: number;
    discountedPrice?: number | null;
    description?: string | null;
    instructions?: string | null;
    isActive?: boolean;
    imageUrl?: string | null;
    _count?: { appointments: number };
}

/** Lightweight Treatment for booking-form selectors. */
export type TreatmentOption = Pick<Treatment, "id" | "name" | "price" | "durationMin">;


// ─── Appointment ─────────────────────────────────────────

export interface Appointment {
    id: string;
    startTime: string;
    endTime: string;
    status: string;
    amountPaid?: number;
    price?: number;
    discount?: number;
    bookedBy?: string;
    notes?: string | null;
    createdAt?: string;
    patient: {
        id: string;
        name: string | null;
        email?: string | null;
        phone?: string | null;
        noShowCount?: number;
        medicalAlerts?: string | null;
    } | null;
    treatment: {
        id?: string;
        name: string;
        price: number;
        durationMin: number;
    };
    clinicalNotes?: ClinicalNote[];
}

export interface ClinicalNote {
    id: string;
    diagnosis: string | null;
    treatmentDone: string;
    prescription: string | null;
    remarks: string | null;
    odontogramData?: any;
    createdAt: string;
    updatedAt: string;
}


// ─── Patient ─────────────────────────────────────────────

export interface Patient {
    id: string;
    name: string;
    email?: string | null;
    phone?: string | null;
    patientCode?: number | null;
    medicalAlerts?: string | null;
    dateOfBirth?: string | null;
    gender?: string | null;
    createdAt?: string;
}

/** Lightweight patient result for search/results lists. */
export interface PatientResult {
    id: string;
    name: string;
    phone: string | null;
    email: string | null;
    patientCode: number | null;
    medicalAlerts: string | null;
    createdAt: string;
    appointments: {
        id: string;
        startTime: string;
        status: string;
        treatment: { name: string };
    }[];
    _count: { appointments: number };
}


// ─── Time Slots ──────────────────────────────────────────

export interface TimeSlot {
    value: string;
    label: string;
    endLabel: string;
    available: boolean;
}


// ─── Status ──────────────────────────────────────────────

/** All possible appointment statuses — matches Prisma `ApptStatus` enum. */
export type ApptStatus = "SCHEDULED" | "RESCHEDULED" | "COMPLETED" | "CANCELLED" | "NO_SHOW";

/** Rich status metadata for rendering badges, labels, etc. */
export interface StatusConfig {
    label: string;
    color: string;
    bg: string;
}


// ─── Revenue ─────────────────────────────────────────────

export interface AppointmentData {
    id: string;
    startTime: string;
    amountPaid: number;
    discount: number;
    price: number;
    treatment: { name: string; price: number };
    patient: { name: string } | null;
}

export interface PaymentData {
    id: string;
    amount: number;
    date: string;
    treatmentName: string;
}


// ─── Service Manager ────────────────────────────────────

/** Treatment variant used by the ServiceManager (has `originalPrice` / `categoryId`). */
export interface ServiceTreatment {
    id: string;
    name: string;
    description: string | null;
    originalPrice: number;
    discountedPrice: number | null;
    durationMin: number;
    isActive: boolean;
    categoryId: string;
}

export interface Category {
    id: string;
    name: string;
}
