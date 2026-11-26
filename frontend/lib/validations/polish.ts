import { z } from "zod";

export const labOrderStatusEnum = z.enum(["SENT", "IN_PROGRESS", "RECEIVED", "DELIVERED", "CANCELLED"]);
export const waitlistStatusEnum = z.enum(["WAITING", "NOTIFIED", "BOOKED", "CANCELLED", "EXPIRED"]);

export const labOrderCreateSchema = z.object({
    patientId: z.string().uuid("Select a patient"),
    appointmentId: z.string().uuid().optional().nullable(),
    labName: z.string().trim().min(2, "Lab name is required").max(120),
    workType: z.string().trim().min(2, "Work type is required").max(120),
    toothNumbers: z.string().trim().max(80).optional().nullable(),
    shade: z.string().trim().max(40).optional().nullable(),
    cost: z.coerce.number().int().min(0).max(5000000).default(0),
    expectedDate: z.string().optional().nullable(),
    notes: z.string().trim().max(500).optional().nullable(),
});

export const labOrderUpdateSchema = z.object({
    status: labOrderStatusEnum.optional(),
    labName: z.string().trim().min(2).max(120).optional(),
    workType: z.string().trim().min(2).max(120).optional(),
    toothNumbers: z.string().trim().max(80).optional().nullable(),
    shade: z.string().trim().max(40).optional().nullable(),
    cost: z.coerce.number().int().min(0).max(5000000).optional(),
    expectedDate: z.string().optional().nullable(),
    notes: z.string().trim().max(500).optional().nullable(),
});

export const waitlistCreateSchema = z.object({
    patientId: z.string().uuid().optional().nullable(),
    patientName: z.string().trim().min(2, "Patient name is required").max(120),
    patientPhone: z.string().trim().min(7, "Phone number is required").max(30),
    treatmentId: z.string().uuid().optional().nullable(),
    preferredDate: z.string().min(10, "Preferred date is required"),
    preferredTimeSlot: z.string().trim().max(40).optional().nullable(),
    notes: z.string().trim().max(400).optional().nullable(),
});

export const waitlistUpdateSchema = z.object({
    status: waitlistStatusEnum,
    notes: z.string().trim().max(400).optional().nullable(),
});

const HHMM_OPT = z.string().regex(/^\d{2}:\d{2}$/, "Use HH:MM format").optional().or(z.literal("")).nullable();

export const bookingRulesSchema = z.object({
    breakStart: HHMM_OPT,
    breakEnd: HHMM_OPT,
    bufferMin: z.coerce.number().int().min(0).max(120),
    advanceNoticeMin: z.coerce.number().int().min(0).max(10080),
    maxBookingDaysAhead: z.coerce.number().int().min(1).max(365),
    cancellationCutoffHours: z.coerce.number().int().min(0).max(168),
});

export const publicContentSchema = z.object({
    announcementEnabled: z.boolean().default(false),
    announcementText: z.string().trim().max(240).default(""),
    heroHeadline: z.string().trim().min(3).max(160),
    heroSubheadline: z.string().trim().max(400).default(""),
    reviewsHeading: z.string().trim().max(120).default("Verified Patient Stories"),
    googleReviewUrl: z.string().trim().max(300).default(""),
    showReviewsOnWeb: z.boolean().default(true),
});

export const feedbackAdminUpdateSchema = z.object({
    isPublished: z.boolean().optional(),
    clinicResponse: z.string().trim().max(800).optional().nullable(),
});
