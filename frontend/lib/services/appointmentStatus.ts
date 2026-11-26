import prisma from "@/lib/prisma";
import { ApptStatus } from "@/src/generated/client";
import { canTransitionStatus } from "@/lib/constants/status";
import { logFrontendAudit } from "@/lib/audit";
import { findWaitlistBackfillMatches } from "@/lib/services/waitlist";
import { revalidatePath } from "next/cache";

export interface StatusTransitionInput {
    appointmentId: string;
    nextStatus: ApptStatus;
    actorUserId: string;
}

export async function transitionAppointmentStatus({
    appointmentId,
    nextStatus,
    actorUserId,
}: StatusTransitionInput): Promise<{ success: boolean; status?: ApptStatus; waitlistMatches?: number; error?: string }> {
    const existing = await prisma.appointment.findUnique({
        where: { id: appointmentId },
        select: { id: true, status: true, patientId: true, startTime: true, treatmentId: true },
    });

    if (!existing) {
        return { success: false, error: "Appointment not found" };
    }

    if (!canTransitionStatus(existing.status, nextStatus)) {
        return {
            success: false,
            error: `Cannot change status from ${existing.status} to ${nextStatus}`,
        };
    }

    if (nextStatus === "COMPLETED") {
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);
        if (existing.startTime > todayEnd) {
            return {
                success: false,
                error: "Cannot complete a future appointment before its scheduled date.",
            };
        }
    }

    await prisma.$transaction(async (tx) => {
        await tx.appointment.update({
            where: { id: appointmentId },
            data: { status: nextStatus },
        });

        if (nextStatus === "Not_Visited" && existing.status !== "Not_Visited") {
            await tx.user.update({
                where: { id: existing.patientId },
                data: { noShowCount: { increment: 1 } },
            });
        } else if (existing.status === "Not_Visited" && nextStatus !== "Not_Visited") {
            await tx.user.update({
                where: { id: existing.patientId },
                data: { noShowCount: { decrement: 1 } },
            });
        }
    });

    await logFrontendAudit({
        userId: actorUserId,
        action: nextStatus === "CANCELLED" ? "CANCEL_APPOINTMENT" : `APPOINTMENT_${nextStatus}`,
        entity: "Appointment",
        entityId: appointmentId,
        details: { previousStatus: existing.status, nextStatus },
    });

    revalidatePath("/admin");
    revalidatePath("/staff");
    revalidatePath("/admin/appointments");
    revalidatePath("/staff/appointments");

    const matches = nextStatus === "CANCELLED"
        ? await findWaitlistBackfillMatches(existing.startTime, existing.treatmentId).catch(() => [])
        : [];

    return { success: true, status: nextStatus, waitlistMatches: matches.length };
}
