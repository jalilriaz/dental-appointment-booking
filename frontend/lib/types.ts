// ─── Canonical Shared Types ──────────────────────────────
// All components should import types from here instead of
// defining local copies. Keep in sync with Prisma schema.


// ─── Feedback ────────────────────────────────────────────

export interface FeedbackItem {
    id: string;
    name: string;
    email?: string;
    rating: number;
    comment: string;
    treatmentName?: string;
    date: string;
    source: "Google" | "Website" | "Verified Patient";
    clinicResponse?: {
        responder: string;
        date: string;
        message: string;
    };
}

// ─── Treatment ───────────────────────────────────────────

/** Full Treatment record — matches Prisma `Treatment` model. */
export interface Treatment {
    id: string;
    name: string;
    durationMin: number;
    price: number;
    maxPrice?: number | null;
    discountedPrice?: number | null;
    description?: string | null;
    instructions?: string | null;
    isActive?: boolean;
    imageUrl?: string | null;
    category?: string | null;
    isMultiSession?: boolean | null;
    defaultSessions?: number | null;
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
    guestName?: string | null;
    guestPhone?: string | null;
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
    doctorId?: string | null;
    doctor?: {
        id: string;
        name: string;
        role: string;
        operatory?: string | null;
        image?: string | null;
        isLead?: boolean;
    } | null;
    clinicalNotes?: ClinicalNote[];
    patientTreatmentId?: string | null;
    sessionNumber?: number | null;
    sessionLabel?: string | null;
    plannedFee?: number | null;
    patientTreatment?: {
        id: string;
        totalCost: number;
        totalSessions: number;
        clinicalStatus: string;
        financialStatus: string;
    } | null;
}

export interface DoctorOption {
    id: string;
    name: string;
    role: string;
    operatory: string;
    schedule?: string;
    consultationFee?: number;
    isLead?: boolean;
    isActive?: boolean;
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
    patientTreatments?: {
        id: string;
        treatment: { name: string };
        totalSessions: number;
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
