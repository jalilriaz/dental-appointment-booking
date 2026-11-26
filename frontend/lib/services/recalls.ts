import prisma from "@/lib/prisma";
import { logFrontendAudit } from "@/lib/audit";
import { formatKarachiDate } from "@/lib/format";
import { dispatchClinicNotification } from "@/lib/services/notifications";
import { isKarachiNightHours, isRecallEligible } from "@/lib/services/recallMath";

export async function getRecallDashboardData() {
    const now = new Date();
    const patients = await prisma.user.findMany({
        where: { role: "PATIENT", deletedAt: null, isActive: true },
        select: {
            id: true, name: true, phone: true, email: true, deletedAt: true, isActive: true, recallOptOut: true,
            appointments: {
                where: { status: { in: ["COMPLETED", "SCHEDULED", "RESCHEDULED", "ARRIVED", "IN_PROGRESS"] } },
                select: { id: true, status: true, startTime: true, treatment: { select: { name: true } } },
                orderBy: { startTime: "desc" },
            },
            recallReminders: {
                select: { id: true, status: true, sentAt: true, dueDate: true },
                orderBy: { createdAt: "desc" },
                take: 3,
            },
        },
        take: 400,
    });

    const due: Array<{ patientId: string; name: string; phone: string | null; lastVisit: string; treatmentName: string }> = [];
    const sent: Array<{ patientId: string; name: string; phone: string | null; sentAt: string }> = [];
    const booked: Array<{ patientId: string; name: string; phone: string | null; bookedFor: string }> = [];
    const optedOut: Array<{ patientId: string; name: string; phone: string | null }> = [];

    for (const p of patients) {
        if (p.recallOptOut) {
            optedOut.push({ patientId: p.id, name: p.name, phone: p.phone });
            continue;
        }
        const completed = p.appointments.filter((a) => a.status === "COMPLETED");
        const future = p.appointments.find((a) => a.startTime >= now && a.status !== "COMPLETED");
        const latestSent = p.recallReminders.find((r) => r.status === "SENT" || r.status === "BOOKED");

        if (latestSent && future && latestSent.sentAt && future.startTime >= latestSent.sentAt) {
            if (latestSent.status === "SENT") {
                await prisma.recallReminder.update({ where: { id: latestSent.id }, data: { status: "BOOKED" } }).catch(() => {});
            }
            booked.push({ patientId: p.id, name: p.name, phone: p.phone, bookedFor: future.startTime.toISOString() });
            continue;
        }
        if (latestSent?.status === "BOOKED") {
            booked.push({ patientId: p.id, name: p.name, phone: p.phone, bookedFor: latestSent.dueDate.toISOString() });
            continue;
        }
        if (latestSent?.status === "SENT" && latestSent.sentAt) {
            sent.push({ patientId: p.id, name: p.name, phone: p.phone, sentAt: latestSent.sentAt.toISOString() });
        }

        const lastDone = completed[0];
        if (lastDone && isRecallEligible({
            lastCompletedAt: lastDone.startTime,
            hasFutureAppt: Boolean(future),
            deletedAt: p.deletedAt,
            isActive: p.isActive,
            recallOptOut: p.recallOptOut,
            lastRecallSentAt: latestSent?.sentAt || null,
            now,
        })) {
            due.push({
                patientId: p.id,
                name: p.name,
                phone: p.phone,
                lastVisit: lastDone.startTime.toISOString(),
                treatmentName: lastDone.treatment.name,
            });
        }
    }

    return { due, sent, booked, optedOut, isNightHours: isKarachiNightHours(now) };
}

export async function triggerRecallNotifications(patientIds: string[], actorUserId: string) {
    const now = new Date();
    const { due, isNightHours } = await getRecallDashboardData();
    const targets = due.filter((d) => patientIds.includes(d.patientId));

    if (isNightHours) {
        for (const t of targets) {
            await prisma.notificationLog.create({
                data: {
                    patientId: t.patientId,
                    channel: "WHATSAPP",
                    recipient: t.phone || "missing",
                    templateKey: "recall_6_month",
                    messagePreview: "6-month recall skipped due to night quiet hours (Asia/Karachi)",
                    status: "SKIPPED",
                    errorMessage: "Night quiet hours (21:00-07:59 Asia/Karachi)",
                },
            });
        }
        return { blockedByNight: true, sent: 0, skipped: targets.length, failed: 0 };
    }

    let sent = 0;
    let skipped = 0;
    let failed = 0;

    for (const t of targets) {
        const log = await dispatchClinicNotification({
            patientId: t.patientId,
            channel: "WHATSAPP",
            recipient: t.phone,
            templateKey: "recall_6_month",
            vars: { patient_name: t.name, date: formatKarachiDate(t.lastVisit, "short"), treatment: t.treatmentName },
            n8nEvent: "SIX_MONTH_RECALL",
            webhookEnvKey: "N8N_RECALL_WEBHOOK_URL",
        });
        if (log.status === "SENT") {
            sent += 1;
            await prisma.recallReminder.create({
                data: { patientId: t.patientId, dueDate: now, status: "SENT", sentAt: now },
            });
        } else if (log.status === "SKIPPED") skipped += 1;
        else failed += 1;
    }

    await logFrontendAudit({
        userId: actorUserId,
        action: "TRIGGER_RECALLS",
        entity: "RecallReminder",
        details: { requested: patientIds.length, eligible: targets.length, sent, skipped, failed },
    });

    return { blockedByNight: false, sent, skipped, failed };
}

export async function setPatientRecallOptOut(patientId: string, optOut: boolean, actorUserId: string) {
    await prisma.user.update({ where: { id: patientId }, data: { recallOptOut: optOut } });
    await logFrontendAudit({
        userId: actorUserId,
        action: optOut ? "RECALL_OPT_OUT" : "RECALL_OPT_IN",
        entity: "User",
        entityId: patientId,
        details: { recallOptOut: optOut },
    });
}
