import prisma from "@/lib/prisma";
import { logFrontendAudit } from "@/lib/audit";
import { isValidPakistaniPhone, normalizePhone } from "@/lib/phone";
import { calculatePlanFinancialState } from "@/lib/services/moneyMath";
import type { PatientEditInput } from "@/lib/validations/clinical-records";

export async function updatePatientProfile(
    patientId: string,
    input: PatientEditInput,
    actorUserId: string
) {
    const canonicalPhone = normalizePhone(input.phone);
    if (!isValidPakistaniPhone(canonicalPhone)) {
        throw new Error("Please enter a valid Pakistani mobile number.");
    }

    const phoneConflict = await prisma.user.findFirst({
        where: { phone: canonicalPhone, id: { not: patientId } },
        select: { id: true, name: true, deletedAt: true },
    });
    if (phoneConflict) {
        throw new Error(`Phone number already belongs to ${phoneConflict.name}${phoneConflict.deletedAt ? " (archived)" : ""}.`);
    }

    const cleanEmail = input.email?.trim().toLowerCase() || null;
    if (cleanEmail) {
        const emailConflict = await prisma.user.findFirst({ where: { email: cleanEmail, id: { not: patientId } }, select: { id: true } });
        if (emailConflict) throw new Error("Email address already belongs to another account.");
    }

    const rawDob = input.dateOfBirth ? new Date(input.dateOfBirth) : null;
    const parsedDob = rawDob && !isNaN(rawDob.getTime()) ? rawDob : null;

    const allergies = input.allergies.map((s) => s.trim()).filter(Boolean);
    const medications = input.medications.map((s) => s.trim()).filter(Boolean);

    const updated = await prisma.user.update({
        where: { id: patientId },
        data: {
            name: input.name.trim(),
            phone: canonicalPhone,
            email: cleanEmail,
            gender: input.gender?.trim() || null,
            dateOfBirth: parsedDob,
            address: input.address?.trim() || null,
            medicalAlerts: input.medicalAlerts?.trim() || null,
            allergies,
            medications,
        },
        select: {
            id: true, name: true, phone: true, email: true, gender: true,
            dateOfBirth: true, address: true, medicalAlerts: true, allergies: true, medications: true,
        },
    });

    await logFrontendAudit({
        userId: actorUserId,
        action: "UPDATE_PATIENT",
        entity: "User",
        entityId: patientId,
        details: { allergyCount: allergies.length, medicationCount: medications.length },
    });
    return updated;
}

export async function archivePatientAccount(patientId: string, actorUserId: string) {
    const patient = await prisma.user.findFirst({
        where: { id: patientId, role: "PATIENT", deletedAt: null },
        include: {
            patientTreatments: {
                select: { totalCost: true, payments: { select: { amount: true, type: true } } },
            },
            appointments: {
                select: { status: true, startTime: true, price: true, discount: true, amountPaid: true, patientTreatmentId: true },
            },
        },
    });
    if (!patient) return { ok: false as const, status: 404, error: "Active patient not found." };

    let unpaidBalance = 0;
    for (const pt of patient.patientTreatments) {
        const fin = calculatePlanFinancialState(
            pt.totalCost,
            pt.payments.map((p) => ({ amount: p.amount, type: p.type as "PAYMENT" | "REFUND" }))
        );
        unpaidBalance += fin.remainingBalance;
    }
    for (const a of patient.appointments) {
        if (a.status === "COMPLETED" && !a.patientTreatmentId) {
            unpaidBalance += Math.max(0, a.price - (a.discount || 0) - (a.amountPaid || 0));
        }
    }

    const now = new Date();
    const futureAppointments = patient.appointments.filter(
        (a) => a.startTime >= now && ["SCHEDULED", "RESCHEDULED", "ARRIVED", "IN_PROGRESS"].includes(a.status)
    ).length;

    if (unpaidBalance > 0 || futureAppointments > 0) {
        const parts: string[] = [];
        if (unpaidBalance > 0) parts.push(`unpaid balance of Rs. ${unpaidBalance.toLocaleString("en-PK")}`);
        if (futureAppointments > 0) parts.push(`${futureAppointments} upcoming appointment(s)`);
        return {
            ok: false as const,
            status: 409,
            unpaidBalance,
            futureAppointments,
            error: `Cannot archive while patient has ${parts.join(" and ")}. Clear or cancel them first.`,
        };
    }

    await prisma.user.update({
        where: { id: patientId },
        data: { deletedAt: now, isActive: false },
    });

    await logFrontendAudit({
        userId: actorUserId,
        action: "ARCHIVE_PATIENT",
        entity: "User",
        entityId: patientId,
        details: { patientName: patient.name },
    });
    return { ok: true as const };
}

export async function restorePatientAccount(patientId: string, actorUserId: string) {
    const existing = await prisma.user.findFirst({ where: { id: patientId, role: "PATIENT" } });
    if (!existing) throw new Error("Patient record not found.");
    const restored = await prisma.user.update({
        where: { id: patientId },
        data: { deletedAt: null, isActive: true },
        select: { id: true, name: true, phone: true, patientCode: true },
    });
    await logFrontendAudit({
        userId: actorUserId,
        action: "RESTORE_PATIENT",
        entity: "User",
        entityId: patientId,
        details: { patientName: restored.name, patientCode: restored.patientCode },
    });
    return restored;
}
