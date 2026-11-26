import nodemailer from "nodemailer";

export interface TransportResult {
    status: "SENT" | "FAILED" | "SKIPPED";
    errorMessage?: string;
}

export async function sendEmailNotification(params: {
    clinicName: string;
    to: string;
    subject: string;
    text: string;
}): Promise<TransportResult> {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        return { status: "SKIPPED", errorMessage: "SMTP credentials not configured" };
    }
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || "smtp.gmail.com",
            port: Number(process.env.SMTP_PORT) || 587,
            secure: false,
            auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
        });
        await transporter.sendMail({
            from: `"${params.clinicName}" <${process.env.SMTP_USER}>`,
            to: params.to,
            subject: params.subject,
            text: params.text,
        });
        return { status: "SENT" };
    } catch (err) {
        return {
            status: "FAILED",
            errorMessage: err instanceof Error ? err.message : "Email dispatch failed",
        };
    }
}

export async function sendWhatsAppN8nNotification(params: {
    recipient: string;
    message: string;
    templateKey: string;
    patientId?: string | null;
    appointmentId?: string | null;
    n8nEvent?: string;
    webhookEnvKey?: "N8N_BOOKING_WEBHOOK_URL" | "N8N_RECALL_WEBHOOK_URL";
}): Promise<TransportResult> {
    const digits = params.recipient.replace(/[^0-9]/g, "");
    const phone = digits.startsWith("0") && digits.length === 11 ? `92${digits.slice(1)}` : digits;
    const url =
        (params.webhookEnvKey && process.env[params.webhookEnvKey]) ||
        process.env.N8N_BOOKING_WEBHOOK_URL ||
        process.env.N8N_WEBHOOK_URL ||
        "http://localhost:5678/webhook/elite-dental-booking";

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(process.env.N8N_SECRET_KEY ? { Authorization: `Bearer ${process.env.N8N_SECRET_KEY}` } : {}),
            },
            body: JSON.stringify({
                event: params.n8nEvent || params.templateKey.toUpperCase(),
                templateKey: params.templateKey,
                phone,
                message: params.message,
                patientId: params.patientId || null,
                appointmentId: params.appointmentId || null,
            }),
            signal: AbortSignal.timeout(5000),
        });
        return res.ok
            ? { status: "SENT" }
            : { status: "FAILED", errorMessage: `Webhook HTTP ${res.status}` };
    } catch (err) {
        return {
            status: "FAILED",
            errorMessage: err instanceof Error ? err.message : "n8n dispatch unreachable",
        };
    }
}
