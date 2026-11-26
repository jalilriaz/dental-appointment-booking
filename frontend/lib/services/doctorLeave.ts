import prisma from "@/lib/prisma";
import { logFrontendAudit } from "@/lib/audit";
import { formatKarachiDate, formatKarachiTime, getKarachiDayBounds } from "@/lib/format";
import { dispatchClinicNotification } from "@/lib/services/notifications";

function toDateOnly(dt: Date | null): string {
    return dt ? dt.toISOString().slice(0, 10) : "";
}

export async function getDoctorAvailabilityWithAffected() {
    const doctor = await prisma.doctor.findFirst({
        orderBy: [{ isLead: "desc" }, { createdAt: "asc" }],
    });
    if (!doctor) return { doctor: null, affectedAppointments: [] };

    const now = new Date();
    const whereAppts: Record<string, unknown> = {
        status: { in: ["SCHEDULED", "RESCHEDULED"] },
        startTime: { gte: now },
    };
    if (doctor.isActive && doctor.unavailableFrom && doctor.unavailableTo) {
        whereAppts.startTime = {
            gte: doctor.unavailableFrom > now ? doctor.unavailableFrom : now,
            lte: doctor.unavailableTo,
        };
    } else if (doctor.isActive) {
        return {
            doctor: {
                id: doctor.id,
                name: doctor.name,
                isActive: doctor.isActive,
                unavailableFrom: toDateOnly(doctor.unavailableFrom),
                unavailableTo: toDateOnly(doctor.unavailableTo),
                unavailableReason: doctor.unavailableReason || "",
            },
            affectedAppointments: [],
        };
    }

    const affected = await prisma.appointment.findMany({
        where: whereAppts,
        include: {
            patient: { select: { id: true, name: true, phone: true, email: true } },
            treatment: { select: { name: true } },
        },
        orderBy: { startTime: "asc" },
        take: 100,
    });

    return {
        doctor: {
            id: doctor.id,
            name: doctor.name,
            isActive: doctor.isActive,
            unavailableFrom: toDateOnly(doctor.unavailableFrom),
            unavailableTo: toDateOnly(doctor.unavailableTo),
            unavailableReason: doctor.unavailableReason || "",
        },
        affectedAppointments: affected.map((a) => ({
            id: a.id,
            startTime: a.startTime.toISOString(),
            patientName: a.patient?.name || "Patient",
            patientPhone: a.patient?.phone || null,
            patientEmail: a.patient?.email || null,
            treatmentName: a.treatment.name,
        })),
    };
}

export async function updateDoctorLeave(
    input: { isActive: boolean; unavailableFrom?: string | null; unavailableTo?: string | null; unavailableReason?: string | null },
    actorUserId: string
) {
    const doctor = await prisma.doctor.findFirst({
        orderBy: [{ isLead: "desc" }, { createdAt: "asc" }],
    });
    if (!doctor) throw new Error("Doctor profile not found.");

    const fromBounds = input.unavailableFrom ? getKarachiDayBounds(0) : null;
    void fromBounds;
    const fromDate = input.unavailableFrom ? new Date(`${input.unavailableFrom}T00:00:00+05:00`) : null;
    const toDate = input.unavailableTo ? new Date(`${input.unavailableTo}T23:59:59+05:00`) : null;

    if (fromDate && toDate && fromDate > toDate) {
        throw new Error("Unavailable 'to' date must be on or after the 'from' date.");
    }

    await prisma.doctor.update({
        where: { id: doctor.id },
        data: {
            isActive: input.isActive,
            unavailableFrom: fromDate,
            unavailableTo: toDate,
            unavailableReason: input.unavailableReason?.trim() || null,
        },
    });

    await logFrontendAudit({
        userId: actorUserId,
        action: "UPDATE_DOCTOR_AVAILABILITY",
        entity: "Doctor",
        entityId: doctor.id,
        details: {
            isActive: input.isActive,
            unavailableFrom: input.unavailableFrom || null,
            unavailableTo: input.unavailableTo || null,
        },
    });

    return getDoctorAvailabilityWithAffected();
}

export async function notifyAffectedLeavePatients(actorUserId: string) {
    const data = await getDoctorAvailabilityWithAffected();
    let sent = 0;
    let failed = 0;
    let skipped = 0;

    for (const apt of data.affectedAppointments) {
        const res = await dispatchClinicNotification({
            appointmentId: apt.id,
            channel: "WHATSAPP",
            recipient: apt.patientPhone,
            templateKey: "doctor_leave",
            vars: {
                patient_name: apt.patientName,
                date: formatKarachiDate(apt.startTime, "short"),
                time: formatKarachiTime(apt.startTime),
                treatment: apt.treatmentName,
            },
            n8nEvent: "DOCTOR_LEAVE_NOTICE",
        });
        if (res.status === "SENT") sent += 1;
        else if (res.status === "FAILED") failed += 1;
        else skipped += 1;
    }

    await logFrontendAudit({
        userId: actorUserId,
        action: "NOTIFY_AFFECTED_PATIENTS",
        entity: "Doctor",
        entityId: data.doctor?.id || undefined,
        details: { total: data.affectedAppointments.length, sent, failed, skipped },
    });

    return { total: data.affectedAppointments.length, sent, failed, skipped };
}
