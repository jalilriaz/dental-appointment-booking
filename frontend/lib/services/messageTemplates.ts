import type { TemplateKey } from "@/lib/validations/operations";

export const ALLOWED_TEMPLATE_PLACEHOLDERS = [
    "patient_name",
    "date",
    "time",
    "treatment",
    "clinic_phone",
] as const;

export interface MessageTemplateEntry {
    label: string;
    whatsappBody: string;
    emailSubject: string;
    emailBody: string;
}

export const SAMPLE_TEMPLATE_DATA: Record<(typeof ALLOWED_TEMPLATE_PLACEHOLDERS)[number], string> = {
    patient_name: "Ayesha Khan",
    date: "28 Nov 2026",
    time: "3:30 PM",
    treatment: "Scaling & Polishing",
    clinic_phone: "0303-5080011",
};

export const DEFAULT_MESSAGE_TEMPLATES: Record<TemplateKey, MessageTemplateEntry> = {
    booking_confirmation: {
        label: "Booking confirmation",
        whatsappBody:
            "Assalam-o-Alaikum {{patient_name}}, your appointment for {{treatment}} is confirmed on {{date}} at {{time}}. Questions? Call {{clinic_phone}}.",
        emailSubject: "Appointment confirmed — {{treatment}} on {{date}}",
        emailBody:
            "Dear {{patient_name}}, your {{treatment}} visit is scheduled for {{date}} at {{time}}. Contact us at {{clinic_phone}} for changes.",
    },
    appointment_reminder: {
        label: "Appointment reminder",
        whatsappBody:
            "Reminder: {{patient_name}}, your {{treatment}} visit is scheduled for {{date}} at {{time}}. Please arrive 10 minutes early or call {{clinic_phone}}.",
        emailSubject: "Reminder: Upcoming dental visit on {{date}}",
        emailBody:
            "Dear {{patient_name}}, this is a reminder for your {{treatment}} appointment on {{date}} at {{time}}. Clinic helpline: {{clinic_phone}}.",
    },
    doctor_leave: {
        label: "Doctor unavailability notice",
        whatsappBody:
            "Dear {{patient_name}}, our clinic schedule for {{date}} ({{time}} - {{treatment}}) requires rescheduling due to doctor unavailability. Please call {{clinic_phone}} to pick a new slot.",
        emailSubject: "Schedule notice regarding your visit on {{date}}",
        emailBody:
            "Dear {{patient_name}}, we need to reschedule your {{treatment}} appointment on {{date}} at {{time}} because the doctor is unavailable. Call {{clinic_phone}}.",
    },
    recall_6_month: {
        label: "6-month dental recall",
        whatsappBody:
            "Assalam-o-Alaikum {{patient_name}}, it has been 6 months since your last {{treatment}} ({{date}}). Book your routine checkup by calling {{clinic_phone}}.",
        emailSubject: "6-Month Dental Checkup Reminder",
        emailBody:
            "Dear {{patient_name}}, it has been 6 months since your last {{treatment}} on {{date}}. Call {{clinic_phone}} to schedule your preventive checkup.",
    },
};

const PLACEHOLDER_REGEX = /\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g;

export function findInvalidPlaceholders(text: string): string[] {
    const allowed = new Set<string>(ALLOWED_TEMPLATE_PLACEHOLDERS);
    const invalid = new Set<string>();
    for (const match of text.matchAll(PLACEHOLDER_REGEX)) {
        const token = match[1];
        if (!allowed.has(token)) invalid.add(`{{${token}}}`);
    }
    if (/\{[^}]*$/.test(text.replace(PLACEHOLDER_REGEX, ""))) {
        invalid.add("malformed brace");
    }
    return Array.from(invalid);
}

export function renderMessageTemplate(
    template: string,
    vars: Partial<Record<(typeof ALLOWED_TEMPLATE_PLACEHOLDERS)[number], string>>
): string {
    return template.replace(PLACEHOLDER_REGEX, (_, token: string) => {
        const key = token as (typeof ALLOWED_TEMPLATE_PLACEHOLDERS)[number];
        return vars[key] ?? "";
    });
}

export function mergeSavedTemplates(
    raw: unknown
): Record<TemplateKey, MessageTemplateEntry> {
    const saved = (raw && typeof raw === "object" ? raw : {}) as Record<string, Partial<MessageTemplateEntry>>;
    const result = {} as Record<TemplateKey, MessageTemplateEntry>;
    for (const key of Object.keys(DEFAULT_MESSAGE_TEMPLATES) as TemplateKey[]) {
        const def = DEFAULT_MESSAGE_TEMPLATES[key];
        const custom = saved[key];
        result[key] = {
            label: def.label,
            whatsappBody: custom?.whatsappBody || def.whatsappBody,
            emailSubject: custom?.emailSubject || def.emailSubject,
            emailBody: custom?.emailBody || def.emailBody,
        };
    }
    return result;
}
