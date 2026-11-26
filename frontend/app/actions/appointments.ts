"use server";

import { ApptStatus } from "@/src/generated/client";
import { requireActionRole } from "@/lib/auth/permissions";
import { transitionAppointmentStatus } from "@/lib/services/appointmentStatus";
import { apptStatusEnum } from "@/lib/validations/settings";

export async function changeAppointmentStatusAction(
    appointmentId: string,
    rawNextStatus: string
): Promise<{ success: boolean; status?: ApptStatus; waitlistMatches?: number; error?: string }> {
    const auth = await requireActionRole(["ADMIN", "STAFF"]);
    if (!auth.ok) {
        return { success: false, error: auth.error };
    }

    const parsed = apptStatusEnum.safeParse(rawNextStatus);
    if (!parsed.success || !appointmentId) {
        return { success: false, error: "Invalid appointment ID or status." };
    }

    return transitionAppointmentStatus({
        appointmentId,
        nextStatus: parsed.data as ApptStatus,
        actorUserId: auth.user.id,
    });
}
