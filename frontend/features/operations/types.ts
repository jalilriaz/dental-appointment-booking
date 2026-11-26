export interface StaffAccountRow {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    role: "ADMIN" | "STAFF";
    isActive: boolean;
    mustChangePassword: boolean;
    createdAt: string;
}

export interface AffectedAppointmentRow {
    id: string;
    startTime: string;
    patientName: string;
    patientPhone: string | null;
    patientEmail: string | null;
    treatmentName: string;
}

export interface DoctorAvailabilityState {
    id: string;
    name: string;
    isActive: boolean;
    unavailableFrom: string;
    unavailableTo: string;
    unavailableReason: string;
}

export interface NotificationLogRow {
    id: string;
    channel: string;
    recipient: string;
    templateKey: string;
    messagePreview: string | null;
    status: string;
    errorMessage: string | null;
    sentAt: string | null;
    createdAt: string;
    patientName: string | null;
}

export interface RecallDashboardPayload {
    due: Array<{
        patientId: string;
        name: string;
        phone: string | null;
        lastVisit: string;
        treatmentName: string;
    }>;
    sent: Array<{
        patientId: string;
        name: string;
        phone: string | null;
        sentAt: string;
    }>;
    booked: Array<{
        patientId: string;
        name: string;
        phone: string | null;
        bookedFor: string;
    }>;
    optedOut: Array<{
        patientId: string;
        name: string;
        phone: string | null;
    }>;
    isNightHours: boolean;
}
