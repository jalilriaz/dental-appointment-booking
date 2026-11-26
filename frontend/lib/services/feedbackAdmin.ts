import prisma from "@/lib/prisma";
import { logFrontendAudit } from "@/lib/audit";
import { formatKarachiDate, formatKarachiTime } from "@/lib/format";
import { dispatchClinicNotification } from "@/lib/services/notifications";

export async function getFeedbackDashboardData() {
    const [reviews, completedVisits] = await Promise.all([
        prisma.feedback.findMany({
            include: {
                appointment: { select: { id: true, startTime: true } },
            },
            orderBy: { createdAt: "desc" },
            take: 100,
        }),
        prisma.appointment.findMany({
            where: {
                status: "COMPLETED",
                feedbacks: { none: {} },
                patient: { deletedAt: null },
            },
            include: {
                patient: { select: { id: true, name: true, phone: true, email: true } },
                treatment: { select: { name: true } },
            },
            orderBy: { startTime: "desc" },
            take: 40,
        }),
    ]);

    return {
        reviews: reviews.map((r) => ({
            id: r.id,
            patientName: r.patientName,
            treatmentName: r.treatmentName || "Dental Consultation",
            rating: r.rating,
            comment: r.comment,
            source: r.source,
            isPublished: r.isPublished,
            clinicResponse: r.clinicResponse,
            createdAt: r.createdAt.toISOString(),
        })),
        pendingRequests: completedVisits.map((v) => ({
            appointmentId: v.id,
            patientId: v.patientId,
            patientName: v.patient?.name || "Patient",
            patientPhone: v.patient?.phone || null,
            patientEmail: v.patient?.email || null,
            treatmentName: v.treatment.name,
            visitDate: v.startTime.toISOString(),
        })),
    };
}

export async function updateFeedbackEntry(
    id: string,
    input: { isPublished?: boolean; clinicResponse?: string | null },
    actorUserId: string
) {
    const updated = await prisma.feedback.update({
        where: { id },
        data: {
            ...(input.isPublished !== undefined ? { isPublished: input.isPublished } : {}),
            ...(input.clinicResponse !== undefined
                ? {
                      clinicResponse: input.clinicResponse?.trim() || null,
                      respondedAt: input.clinicResponse?.trim() ? new Date() : null,
                  }
                : {}),
        },
    });
    await logFrontendAudit({
        userId: actorUserId,
        action: "UPDATE_FEEDBACK",
        entity: "Feedback",
        entityId: id,
        details: { isPublished: updated.isPublished, responded: Boolean(updated.clinicResponse) },
    });
    return updated;
}

export async function sendFeedbackCollectionInvite(appointmentId: string, actorUserId: string) {
    const apt = await prisma.appointment.findUnique({
        where: { id: appointmentId },
        include: {
            patient: { select: { id: true, name: true, phone: true, email: true } },
            treatment: { select: { name: true } },
        },
    });
    if (!apt || apt.status !== "COMPLETED") {
        throw new Error("Feedback invites can only be sent for completed visits.");
    }

    const recipient = apt.patient?.phone || apt.patient?.email;
    const channel = apt.patient?.phone ? "WHATSAPP" : "EMAIL";

    const log = await dispatchClinicNotification({
        patientId: apt.patientId,
        appointmentId: apt.id,
        channel,
        recipient,
        templateKey: "booking_confirmation",
        vars: {
            patient_name: apt.patient?.name || "Valued Patient",
            date: formatKarachiDate(apt.startTime, "short"),
            time: formatKarachiTime(apt.startTime),
            treatment: `Feedback request for ${apt.treatment.name}`,
        },
        n8nEvent: "POST_VISIT_FEEDBACK_REQUEST",
    });

    await logFrontendAudit({
        userId: actorUserId,
        action: "SEND_FEEDBACK_INVITE",
        entity: "Appointment",
        entityId: appointmentId,
        details: { status: log.status, channel },
    });
    return log;
}
