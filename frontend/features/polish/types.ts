export interface LabOrderRow {
    id: string;
    patientId: string;
    patientName: string;
    patientPhone: string | null;
    labName: string;
    workType: string;
    toothNumbers: string | null;
    shade: string | null;
    cost: number;
    status: string;
    sentDate: string;
    expectedDate: string | null;
    receivedDate: string | null;
    deliveredDate: string | null;
    notes: string | null;
}

export interface WaitlistRow {
    id: string;
    patientId: string | null;
    patientName: string;
    patientPhone: string;
    treatmentId: string | null;
    treatmentName: string | null;
    preferredDate: string;
    preferredTimeSlot: string | null;
    status: string;
    notes: string | null;
    notifiedAt: string | null;
}

export interface FeedbackReviewRow {
    id: string;
    patientName: string;
    treatmentName: string;
    rating: number;
    comment: string;
    source: string;
    isPublished: boolean;
    clinicResponse: string | null;
    createdAt: string;
}

export interface PendingFeedbackRow {
    appointmentId: string;
    patientId: string;
    patientName: string;
    patientPhone: string | null;
    patientEmail: string | null;
    treatmentName: string;
    visitDate: string;
}

export interface BookingRulesState {
    breakStart: string;
    breakEnd: string;
    bufferMin: number;
    advanceNoticeMin: number;
    maxBookingDaysAhead: number;
    cancellationCutoffHours: number;
}
