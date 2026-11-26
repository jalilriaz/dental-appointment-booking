import { z } from "zod";

export const patientFileTypeEnum = z.enum(["XRAY", "PHOTO", "REPORT", "DOCUMENT"]);

export const consentFormSchema = z.object({
    patientId: z.string().uuid("Patient is required"),
    appointmentId: z.string().uuid().optional().nullable(),
    supersedeId: z.string().uuid().optional().nullable(),
    title: z.string().trim().min(3, "Consent title is required").max(160),
    procedureName: z.string().trim().max(150).optional().nullable(),
    content: z.string().trim().min(10, "Consent text is required").max(10000),
    signatureData: z.string().trim().min(10, "Patient signature is required").max(300000),
    signedByName: z.string().trim().min(2, "Signer name is required").max(120),
    witnessName: z.string().trim().max(120).optional().nullable(),
});

export const patientFileSchema = z.object({
    patientId: z.string().uuid("Patient is required"),
    appointmentId: z.string().uuid().optional().nullable(),
    fileType: patientFileTypeEnum.default("DOCUMENT"),
    title: z.string().trim().min(2, "File title is required").max(160),
    notes: z.string().trim().max(500).optional().nullable(),
    hasConsent: z.boolean().default(false),
    visibleToPatient: z.boolean().default(false),
});

export const beforeAfterToggleSchema = z.object({
    id: z.string().uuid(),
    hasConsent: z.boolean().optional(),
    showOnWeb: z.boolean().optional(),
});

export const patientEditSchema = z.object({
    name: z.string().trim().min(2, "Patient name is required").max(120),
    phone: z.string().trim().min(7, "Valid phone number is required").max(30),
    email: z.string().trim().email("Invalid email").optional().or(z.literal("")).nullable(),
    gender: z.string().trim().max(30).optional().nullable(),
    dateOfBirth: z.string().optional().nullable(),
    address: z.string().trim().max(300).optional().nullable(),
    medicalAlerts: z.string().trim().max(1000).optional().nullable(),
    allergies: z.array(z.string().trim().min(1).max(80)).max(30).optional().default([]),
    medications: z.array(z.string().trim().min(1).max(120)).max(30).optional().default([]),
});

export const prescriptionEntrySchema = z.object({
    drug: z.string().trim().min(1, "Drug name is required").max(120),
    dose: z.string().trim().min(1, "Dose is required").max(60),
    frequency: z.string().trim().min(1, "Frequency is required").max(60),
    duration: z.string().trim().min(1, "Duration is required").max(60),
    instructions: z.string().trim().max(200).optional().nullable(),
});

export const prescriptionSchema = z.object({
    patientId: z.string().uuid("Patient is required"),
    appointmentId: z.string().uuid().optional().nullable(),
    entries: z.array(prescriptionEntrySchema).min(1, "Add at least one medicine"),
    acknowledgedWarnings: z.array(z.string()).optional().default([]),
    notes: z.string().trim().max(500).optional().nullable(),
});

export type ConsentFormInput = z.infer<typeof consentFormSchema>;
export type PatientFileInput = z.infer<typeof patientFileSchema>;
export type PatientEditInput = z.infer<typeof patientEditSchema>;
export type PrescriptionInput = z.infer<typeof prescriptionSchema>;
export type PrescriptionEntry = z.infer<typeof prescriptionEntrySchema>;
