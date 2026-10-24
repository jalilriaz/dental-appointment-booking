import { z } from "zod";

export const registerSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    phone: z.string().min(10, "Please enter a valid phone number"),
    dateOfBirth: z.string().refine((val) => {
        const dob = new Date(val);
        const age = (Date.now() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
        return age >= 18;
    }, "You must be at least 18 years old"),
    gender: z.string().optional(),
    address: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export const loginSchema = z.object({
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(1, "Password is required"),
});

export const bookingSchema = z.object({
    categoryId: z.string().min(1, "Please select a service category"),
    treatmentId: z.string().min(1, "Please select a treatment"),
    staffId: z.string().min(1, "Please select a doctor"),
    date: z.string().min(1, "Please select a date"),
    time: z.string().min(1, "Please select a time"),
    notes: z.string().optional(),
});

export const serviceCategorySchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    description: z.string().optional(),
    icon: z.string().optional(),
});

export const treatmentSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    categoryId: z.string().min(1, "Please select a category"),
    originalPrice: z.number().positive("Price must be positive"),
    discountedPrice: z.number().positive().optional(),
    durationMin: z.number().int().min(15, "Duration must be at least 15 minutes"),
    description: z.string().optional(),
});

export const contactSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email"),
    phone: z.string().optional(),
    subject: z.string().min(2, "Subject is required"),
    message: z.string().min(10, "Message must be at least 10 characters"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type BookingInput = z.infer<typeof bookingSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
