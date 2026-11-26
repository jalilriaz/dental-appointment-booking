import type { DoctorOption, TreatmentOption, PatientResult } from "@/lib/types";

export interface PatientHistory {
    patient: {
        id: string;
        name: string;
        phone: string | null;
        email: string | null;
        patientCode?: number | null;
    };
    plans?: {
        id: string;
        totalCost: number;
        totalSessions: number;
        clinicalStatus: string;
        financialStatus: string;
        totalPaid: number;
        remainingBalance: number;
        completedSessions: number;
        treatment: { id: string; name: string; price: number };
    }[];
    appointments: {
        id: string;
        startTime: string;
        endTime: string;
        status: string;
        bookedBy?: "WEBSITE" | "WALK_IN" | "WHATSAPP_BOT" | string;
        price: number;
        notes: string | null;
        sessionNumber?: number | null;
        sessionLabel?: string | null;
        doctor?: {
            id: string;
            name: string;
            role?: string;
            operatory?: string;
        } | null;
        treatment: { name: string; price: number; durationMin: number };
        clinicalNotes: {
            id: string;
            diagnosis: string | null;
            treatmentDone: string;
            prescription: string | null;
            remarks: string | null;
            createdAt: string;
        }[];
    }[];
}

export interface BookingForm {
    date: string;
    time: string;
    treatmentId: string;
    notes: string;
    patientTreatmentId?: string;
    doctorId?: string;
    isEmergency?: boolean;
}

export interface NewPatientForm extends BookingForm {
    phone: string;
    cnic: string;
    fullName: string;
    age: string;
}

export interface SuccessData {
    patientId?: number | null;
    patientCode?: number | null;
    patientName?: string;
    appointment: any;
    message?: string;
}

export type { DoctorOption, TreatmentOption, PatientResult };
