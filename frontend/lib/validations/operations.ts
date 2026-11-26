import { z } from "zod";

export const staffCreateSchema = z.object({
    name: z.string().trim().min(2, "Full name is required").max(120),
    email: z.string().trim().email("Valid email is required").max(150),
    phone: z.string().trim().max(30).optional().nullable(),
    role: z.enum(["ADMIN", "STAFF"]).default("STAFF"),
    password: z.string().min(8, "Password must be at least 8 characters").max(100),
});

export const staffUpdateSchema = z.object({
    name: z.string().trim().min(2).max(120).optional(),
    email: z.string().trim().email().max(150).optional(),
    phone: z.string().trim().max(30).optional().nullable(),
    role: z.enum(["ADMIN", "STAFF"]).optional(),
    isActive: z.boolean().optional(),
});

export const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, "Current or temporary password is required"),
    newPassword: z
        .string()
        .min(8, "New password must be at least 8 characters")
        .max(100),
});

export const doctorAvailabilitySchema = z.object({
    isActive: z.boolean(),
    unavailableFrom: z.string().optional().nullable(),
    unavailableTo: z.string().optional().nullable(),
    unavailableReason: z.string().trim().max(250).optional().nullable(),
});

export const templateKeyEnum = z.enum([
    "booking_confirmation",
    "appointment_reminder",
    "doctor_leave",
    "recall_6_month",
]);

export const templateUpdateSchema = z.object({
    key: templateKeyEnum,
    whatsappBody: z.string().trim().min(5, "WhatsApp template cannot be empty").max(1500),
    emailSubject: z.string().trim().min(2, "Email subject cannot be empty").max(200),
    emailBody: z.string().trim().min(5, "Email body cannot be empty").max(3000),
});

export type TemplateKey = z.infer<typeof templateKeyEnum>;
