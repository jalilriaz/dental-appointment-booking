import prisma from "@/lib/prisma";
import { logFrontendAudit } from "@/lib/audit";
import { formatKarachiDate, getKarachiDateKey } from "@/lib/format";
import { dispatchClinicNotification } from "@/lib/services/notifications";
import type { WaitlistStatus } from "@/src/generated/client";

export async function listWaitlistEntries(statusFilter?: string) {
    return prisma.waitlistEntry.findMany({
        where: statusFilter && statusFilter !== "ALL" ? { status: statusFilter as WaitlistStatus } : undefined,
        include: {
            patient: { select: { id: true, name: true, patientCode: true } },
            treatment: { select: { id: true, name: true } },
        },
        orderBy: [{ preferredDate: "asc" }, { createdAt: "asc" }],
        take: 200,
    });
}

export async function createWaitlistEntry(
    input: {
        patientId?: string | null;
        patientName: string;
        patientPhone: string;
        treatmentId?: string | null;
        preferredDate: string;
        preferredTimeSlot?: string | null;
        notes?: string | null;
    },
    actorUserId: string
) {
    const entry = await prisma.waitlistEntry.create({
        data: {
            patientId: input.patientId || null,
            patientName: input.patientName.trim(),
            patientPhone: input.patientPhone.trim(),
            treatmentId: input.treatmentId || null,
            preferredDate: new Date(`${input.preferredDate.slice(0, 10)}T12:00:00+05:00`),
            preferredTimeSlot: input.preferredTimeSlot?.trim() || null,
            notes: input.notes?.trim() || null,
            status: "WAITING",
        },
        include: { treatment: { select: { id: true, name: true } } },
    });

    await logFrontendAudit({
        userId: actorUserId,
        action: "CREATE_WAITLIST_ENTRY",
        entity: "WaitlistEntry",
        entityId: entry.id,
        details: { preferredDate: input.preferredDate.slice(0, 10) },
    });
    return entry;
}

export async function findWaitlistBackfillMatches(cancelledStartTime: Date, treatmentId?: string | null) {
    const dateKey = getKarachiDateKey(cancelledStartTime);
    const dayStart = new Date(`${dateKey}T00:00:00+05:00`);
    const dayEnd = new Date(`${dateKey}T23:59:59+05:00`);

    return prisma.waitlistEntry.findMany({
        where: {
            status: "WAITING",
            preferredDate: { gte: dayStart, lte: dayEnd },
            ...(treatmentId ? { OR: [{ treatmentId }, { treatmentId: null }] } : {}),
        },
        include: { treatment: { select: { name: true } } },
        orderBy: { createdAt: "asc" },
        take: 10,
    });
}

export async function notifyWaitlistCandidate(entryId: string, actorUserId: string) {
    const entry = await prisma.waitlistEntry.findUnique({
        where: { id: entryId },
        include: { treatment: { select: { name: true } } },
    });
    if (!entry) throw new Error("Waitlist entry not found.");

    const log = await dispatchClinicNotification({
        patientId: entry.patientId,
        channel: "WHATSAPP",
        recipient: entry.patientPhone,
        templateKey: "appointment_reminder",
        vars: {
            patient_name: entry.patientName,
            date: formatKarachiDate(entry.preferredDate, "short"),
            time: entry.preferredTimeSlot || "opened slot",
            treatment: entry.treatment?.name || "Dental visit",
        },
        n8nEvent: "WAITLIST_BACKFILL_OFFER",
    });

    const updated = await prisma.waitlistEntry.update({
        where: { id: entryId },
        data: { status: "NOTIFIED", notifiedAt: new Date() },
        include: { treatment: { select: { id: true, name: true } } },
    });

    await logFrontendAudit({
        userId: actorUserId,
        action: "NOTIFY_WAITLIST_CANDIDATE",
        entity: "WaitlistEntry",
        entityId: entryId,
        details: { deliveryStatus: log.status },
    });
    return { entry: updated, deliveryStatus: log.status };
}

export async function updateWaitlistStatus(
    entryId: string,
    status: WaitlistStatus,
    notes: string | null | undefined,
    actorUserId: string
) {
    const updated = await prisma.waitlistEntry.update({
        where: { id: entryId },
        data: { status, ...(notes !== undefined ? { notes: notes?.trim() || null } : {}) },
        include: { treatment: { select: { id: true, name: true } } },
    });
    await logFrontendAudit({
        userId: actorUserId,
        action: "UPDATE_WAITLIST_STATUS",
        entity: "WaitlistEntry",
        entityId: entryId,
        details: { status },
    });
    return updated;
}
