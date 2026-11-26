import prisma from "@/lib/prisma";
import { logFrontendAudit } from "@/lib/audit";
import { getClinicProfile } from "@/lib/data/clinic";
import { mergeSavedTemplates, renderMessageTemplate, SAMPLE_TEMPLATE_DATA } from "@/lib/services/messageTemplates";
import { sendEmailNotification, sendWhatsAppN8nNotification } from "@/lib/services/notificationTransports";
import type { TemplateKey } from "@/lib/validations/operations";

export async function dispatchClinicNotification(params: {
    patientId?: string | null;
    appointmentId?: string | null;
    channel: "WHATSAPP" | "EMAIL";
    recipient?: string | null;
    templateKey: TemplateKey;
    vars: Partial<typeof SAMPLE_TEMPLATE_DATA>;
    n8nEvent?: string;
    webhookEnvKey?: "N8N_BOOKING_WEBHOOK_URL" | "N8N_RECALL_WEBHOOK_URL";
}) {
    const [settings, clinic] = await Promise.all([
        prisma.systemSettings.findUnique({ where: { id: "settings" }, select: { messageTemplates: true } }).catch(() => null),
        getClinicProfile(),
    ]);
    const tpl = mergeSavedTemplates(settings?.messageTemplates)[params.templateKey];
    const vars = { clinic_phone: clinic.mobilePhone || clinic.landlinePhone || "", ...params.vars };
    const message = renderMessageTemplate(params.channel === "EMAIL" ? tpl.emailBody : tpl.whatsappBody, vars);
    const safePreview = message.slice(0, 140);
    const recipient = (params.recipient || "").trim();

    let result: { status: "SENT" | "FAILED" | "SKIPPED"; errorMessage?: string };
    if (!recipient) {
        result = { status: "SKIPPED", errorMessage: `Missing ${params.channel.toLowerCase()} contact` };
    } else if (params.channel === "EMAIL") {
        result = await sendEmailNotification({
            clinicName: clinic.clinicName,
            to: recipient,
            subject: renderMessageTemplate(tpl.emailSubject, vars),
            text: message,
        });
    } else {
        result = await sendWhatsAppN8nNotification({
            recipient,
            message,
            templateKey: params.templateKey,
            patientId: params.patientId,
            appointmentId: params.appointmentId,
            n8nEvent: params.n8nEvent,
            webhookEnvKey: params.webhookEnvKey,
        });
    }

    return prisma.notificationLog.create({
        data: {
            patientId: params.patientId || null,
            appointmentId: params.appointmentId || null,
            channel: params.channel,
            recipient: recipient || "missing",
            templateKey: params.templateKey,
            messagePreview: safePreview,
            status: result.status,
            errorMessage: result.errorMessage || null,
            sentAt: result.status === "SENT" ? new Date() : null,
        },
    });
}

export async function retryNotificationLogEntry(logId: string, actorUserId: string) {
    const entry = await prisma.notificationLog.findUnique({
        where: { id: logId },
        include: {
            patient: { select: { name: true, phone: true, email: true } },
            appointment: { include: { treatment: { select: { name: true } } } },
        },
    });
    if (!entry) throw new Error("Notification log entry not found.");

    const templateKey = (["booking_confirmation", "appointment_reminder", "doctor_leave", "recall_6_month"].includes(entry.templateKey)
        ? entry.templateKey
        : "booking_confirmation") as TemplateKey;

    const newLog = await dispatchClinicNotification({
        patientId: entry.patientId,
        appointmentId: entry.appointmentId,
        channel: entry.channel === "EMAIL" ? "EMAIL" : "WHATSAPP",
        recipient: entry.recipient === "missing" ? (entry.channel === "EMAIL" ? entry.patient?.email : entry.patient?.phone) : entry.recipient,
        templateKey,
        vars: {
            patient_name: entry.patient?.name || "Valued Patient",
            treatment: entry.appointment?.treatment?.name || "Dental Visit",
        },
    });

    await logFrontendAudit({
        userId: actorUserId,
        action: "RETRY_NOTIFICATION",
        entity: "NotificationLog",
        entityId: logId,
        details: { newLogId: newLog.id, status: newLog.status },
    });

    return newLog;
}
