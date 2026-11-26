import { z } from "zod";

export const apptStatusEnum = z.enum([
    "SCHEDULED",
    "RESCHEDULED",
    "ARRIVED",
    "IN_PROGRESS",
    "COMPLETED",
    "CANCELLED",
    "Not_Visited",
]);

export const bookingRulesSchema = z.object({
    workDayStart: z.string().regex(/^\d{2}:\d{2}$/, "Use HH:MM format").optional(),
    workDayEnd: z.string().regex(/^\d{2}:\d{2}$/, "Use HH:MM format").optional(),
    breakStart: z.string().regex(/^\d{2}:\d{2}$/, "Use HH:MM format").optional().nullable().or(z.literal("")),
    breakEnd: z.string().regex(/^\d{2}:\d{2}$/, "Use HH:MM format").optional().nullable().or(z.literal("")),
    slotDurationMin: z.coerce.number().int().min(5).max(120).optional(),
    bufferMin: z.coerce.number().int().min(0).max(60).optional(),
    advanceNoticeMin: z.coerce.number().int().min(0).max(10080).optional(),
    maxBookingDaysAhead: z.coerce.number().int().min(1).max(365).optional(),
    cancellationCutoffHours: z.coerce.number().int().min(0).max(168).optional(),
});

export const treatmentLifecycleSchema = z.object({
    name: z.string().trim().min(2).max(120),
    category: z.string().trim().min(2).max(60).default("General"),
    durationMin: z.coerce.number().int().min(5).max(360),
    price: z.coerce.number().int().min(0),
    discountedPrice: z.coerce.number().int().min(0).optional().nullable(),
    description: z.string().trim().max(1000).optional().nullable(),
    instructions: z.string().trim().max(2000).optional().nullable(),
    isActive: z.boolean().default(true),
    showOnWeb: z.boolean().default(true),
    isMultiSession: z.boolean().default(false),
    defaultSessions: z.coerce.number().int().min(1).max(36).default(1),
});

export type BookingRulesInput = z.infer<typeof bookingRulesSchema>;
export type TreatmentLifecycleInput = z.infer<typeof treatmentLifecycleSchema>;
