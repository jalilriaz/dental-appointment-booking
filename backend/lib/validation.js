"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactSchema = exports.treatmentSchema = exports.serviceCategorySchema = exports.bookingSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    name: zod_1.z.string().min(3, "Name must be at least 3 characters"),
    email: zod_1.z.string().email("Please enter a valid email"),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: zod_1.z.string(),
    phone: zod_1.z.string().min(10, "Please enter a valid phone number"),
    dateOfBirth: zod_1.z.string().refine((val) => {
        const dob = new Date(val);
        const age = (Date.now() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
        return age >= 18;
    }, "You must be at least 18 years old"),
    gender: zod_1.z.string().optional(),
    address: zod_1.z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email("Please enter a valid email"),
    password: zod_1.z.string().min(1, "Password is required"),
});
exports.bookingSchema = zod_1.z.object({
    categoryId: zod_1.z.string().min(1, "Please select a service category"),
    treatmentId: zod_1.z.string().min(1, "Please select a treatment"),
    staffId: zod_1.z.string().min(1, "Please select a doctor"),
    date: zod_1.z.string().min(1, "Please select a date"),
    time: zod_1.z.string().min(1, "Please select a time"),
    notes: zod_1.z.string().optional(),
});
exports.serviceCategorySchema = zod_1.z.object({
    name: zod_1.z.string().min(2, "Name must be at least 2 characters"),
    description: zod_1.z.string().optional(),
    icon: zod_1.z.string().optional(),
});
exports.treatmentSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, "Name must be at least 2 characters"),
    categoryId: zod_1.z.string().min(1, "Please select a category"),
    originalPrice: zod_1.z.number().positive("Price must be positive"),
    discountedPrice: zod_1.z.number().positive().optional(),
    durationMin: zod_1.z.number().int().min(15, "Duration must be at least 15 minutes"),
    description: zod_1.z.string().optional(),
});
exports.contactSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, "Name must be at least 2 characters"),
    email: zod_1.z.string().email("Please enter a valid email"),
    phone: zod_1.z.string().optional(),
    subject: zod_1.z.string().min(2, "Subject is required"),
    message: zod_1.z.string().min(10, "Message must be at least 10 characters"),
});
