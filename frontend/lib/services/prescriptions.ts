import prisma from "@/lib/prisma";
import { logFrontendAudit } from "@/lib/audit";
import { getClinicProfile } from "@/lib/data/clinic";
import { detectAllergyConflicts } from "@/lib/services/allergyConflicts";
import type { PrescriptionInput } from "@/lib/validations/clinical-records";

export function normalizeStringList(raw: unknown): string[] {
    if (!Array.isArray(raw)) return [];
    return raw.map((x) => String(x || "").trim()).filter(Boolean);
}

export async function createPrescription(input: PrescriptionInput, actorUserId: string) {
    const [patient, clinic] = await Promise.all([
        prisma.user.findUnique({
            where: { id: input.patientId },
            select: { id: true, allergies: true, medicalAlerts: true, deletedAt: true },
        }),
        getClinicProfile(),
    ]);
    if (!patient || patient.deletedAt) throw new Error("Patient not found or archived.");

    const structured = normalizeStringList(patient.allergies);
    const alertFallback = patient.medicalAlerts ? [patient.medicalAlerts] : [];
    const detectedWarnings = detectAllergyConflicts(input.entries, [...structured, ...alertFallback]);

    if (detectedWarnings.length > 0 && input.acknowledgedWarnings.length === 0) {
        return { success: false as const, status: 409, warnings: detectedWarnings, error: "Allergy conflict detected. Acknowledge warning before issuing." };
    }

    const created = await prisma.prescription.create({
        data: {
            patientId: input.patientId,
            appointmentId: input.appointmentId || null,
            prescribedById: actorUserId,
            doctorName: clinic.doctor.name,
            doctorPmdc: clinic.doctor.pmdcReg || clinic.pmdcRegNumber || null,
            entries: input.entries,
            allergyWarnings: detectedWarnings.length > 0 ? detectedWarnings : undefined,
            notes: input.notes?.trim() || null,
        },
        include: { prescribedBy: { select: { name: true } } },
    });

    await logFrontendAudit({
        userId: actorUserId,
        action: "CREATE_PRESCRIPTION",
        entity: "Prescription",
        entityId: created.id,
        details: { patientId: input.patientId, drugCount: input.entries.length, warningCount: detectedWarnings.length },
    });
    return { success: true as const, prescription: created, warnings: detectedWarnings };
}
