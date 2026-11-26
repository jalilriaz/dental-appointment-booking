import prisma from "@/lib/prisma";
import { logFrontendAudit } from "@/lib/audit";
import { writeSecureBlob } from "@/lib/services/secureFiles";
import type { ConsentFormInput } from "@/lib/validations/clinical-records";

export async function createConsentForm(input: ConsentFormInput, actorUserId: string) {
    const created = await prisma.$transaction(async (tx) => {
        let nextVersion = 1;
        if (input.supersedeId) {
            const prev = await tx.consentForm.findFirst({
                where: { id: input.supersedeId, patientId: input.patientId },
                select: { id: true, version: true, supersededById: true },
            });
            if (!prev) throw new Error("Prior consent form version not found.");
            if (prev.supersededById) throw new Error("This consent form version has already been superseded.");
            nextVersion = prev.version + 1;
        }

        const record = await tx.consentForm.create({
            data: {
                patientId: input.patientId,
                appointmentId: input.appointmentId || null,
                title: input.title,
                procedureName: input.procedureName?.trim() || null,
                content: input.content,
                version: nextVersion,
                signatureData: input.signatureData,
                signedByName: input.signedByName,
                witnessName: input.witnessName?.trim() || null,
                createdById: actorUserId,
            },
            include: { createdBy: { select: { name: true } } },
        });

        if (input.supersedeId) {
            await tx.consentForm.update({
                where: { id: input.supersedeId },
                data: { supersededById: record.id },
            });
        }
        return record;
    });

    await logFrontendAudit({
        userId: actorUserId,
        action: "CREATE_CONSENT_FORM",
        entity: "ConsentForm",
        entityId: created.id,
        details: { patientId: input.patientId, version: created.version, supersedeId: input.supersedeId || null },
    });
    return created;
}

export async function createBeforeAfterRecord(params: {
    patientId: string;
    treatmentId?: string | null;
    title: string;
    notes?: string | null;
    beforeBuffer: Buffer;
    afterBuffer: Buffer;
    actorUserId: string;
}) {
    const [beforeBlob, afterBlob] = await Promise.all([
        writeSecureBlob(params.beforeBuffer),
        writeSecureBlob(params.afterBuffer),
    ]);

    const photo = await prisma.$transaction(async (tx) => {
        const createPhotoFile = (label: string, blob: typeof beforeBlob) =>
            tx.patientFile.create({
                data: {
                    patientId: params.patientId, fileType: "PHOTO", title: `${params.title.trim()} (${label})`,
                    storagePath: blob.storageName, mimeType: blob.mimeType, sizeBytes: blob.sizeBytes,
                    hasConsent: false, uploadedById: params.actorUserId,
                },
            });
        const [beforeFile, afterFile] = await Promise.all([
            createPhotoFile("Before", beforeBlob),
            createPhotoFile("After", afterBlob),
        ]);

        return tx.beforeAfterPhoto.create({
            data: {
                patientId: params.patientId,
                treatmentId: params.treatmentId || null,
                title: params.title.trim(),
                beforeImagePath: beforeFile.storagePath,
                afterImagePath: afterFile.storagePath,
                beforeFileId: beforeFile.id,
                afterFileId: afterFile.id,
                notes: params.notes?.trim() || null,
                hasConsent: false,
                showOnWeb: false,
                createdById: params.actorUserId,
            },
            include: { treatment: { select: { name: true } } },
        });
    });

    await logFrontendAudit({
        userId: params.actorUserId,
        action: "CREATE_BEFORE_AFTER",
        entity: "BeforeAfterPhoto",
        entityId: photo.id,
        details: { patientId: params.patientId, hasConsent: false, showOnWeb: false },
    });
    return photo;
}

export async function updateBeforeAfterVisibility(params: {
    id: string;
    hasConsent?: boolean;
    showOnWeb?: boolean;
    actorUserId: string;
}) {
    const existing = await prisma.beforeAfterPhoto.findUnique({ where: { id: params.id } });
    if (!existing) throw new Error("Before/After record not found.");

    const nextConsent = params.hasConsent !== undefined ? params.hasConsent : existing.hasConsent;
    const requestedWeb = params.showOnWeb !== undefined ? params.showOnWeb : existing.showOnWeb;
    if (params.showOnWeb === true && !nextConsent) {
        throw new Error("Patient consent must be enabled before publishing to the website.");
    }
    const nextWeb = nextConsent ? requestedWeb : false;

    const updated = await prisma.beforeAfterPhoto.update({
        where: { id: params.id },
        data: { hasConsent: nextConsent, showOnWeb: nextWeb },
        include: { treatment: { select: { name: true } } },
    });

    await logFrontendAudit({
        userId: params.actorUserId,
        action: "UPDATE_BEFORE_AFTER_CONSENT",
        entity: "BeforeAfterPhoto",
        entityId: params.id,
        details: { hasConsent: nextConsent, showOnWeb: nextWeb },
    });
    return updated;
}
