import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import prisma from "@/lib/prisma";
import { logFrontendAudit } from "@/lib/audit";
import { detectRealFileType, stripImageMetadata } from "@/lib/services/imageStrip";

export const MAX_PATIENT_FILE_BYTES = 10 * 1024 * 1024;
const STORAGE_ROOT = path.resolve(process.cwd(), "../storage/patient-files");

export async function writeSecureBlob(buffer: Buffer): Promise<{
    storageName: string;
    mimeType: string;
    sizeBytes: number;
}> {
    if (buffer.length === 0 || buffer.length > MAX_PATIENT_FILE_BYTES) {
        throw new Error("File size must be between 1 byte and 10 MB.");
    }
    const detected = detectRealFileType(buffer);
    if (!detected) {
        throw new Error("Unsupported or spoofed file content. Allowed: JPEG, PNG, WEBP, PDF.");
    }
    const sanitized = stripImageMetadata(buffer, detected.mimeType);
    await fs.mkdir(STORAGE_ROOT, { recursive: true });
    const storageName = `${crypto.randomUUID()}.${detected.ext}`;
    const fullPath = path.join(STORAGE_ROOT, storageName);
    await fs.writeFile(fullPath, sanitized);
    return { storageName, mimeType: detected.mimeType, sizeBytes: sanitized.length };
}

export async function readSecureBlob(storageName: string): Promise<Buffer> {
    const safeName = path.basename(storageName);
    const fullPath = path.resolve(STORAGE_ROOT, safeName);
    if (!fullPath.startsWith(STORAGE_ROOT + path.sep)) {
        throw new Error("Invalid file path.");
    }
    return fs.readFile(fullPath);
}

export async function savePatientFile(params: {
    buffer: Buffer;
    patientId: string;
    appointmentId?: string | null;
    fileType: "XRAY" | "PHOTO" | "REPORT" | "DOCUMENT";
    title: string;
    notes?: string | null;
    hasConsent?: boolean;
    visibleToPatient?: boolean;
    actorUserId: string;
}) {
    const blob = await writeSecureBlob(params.buffer);
    const record = await prisma.patientFile.create({
        data: {
            patientId: params.patientId,
            appointmentId: params.appointmentId || null,
            fileType: params.fileType,
            title: params.title.trim(),
            storagePath: blob.storageName,
            mimeType: blob.mimeType,
            sizeBytes: blob.sizeBytes,
            notes: params.notes?.trim() || null,
            hasConsent: Boolean(params.hasConsent),
            visibleToPatient: Boolean(params.visibleToPatient),
            uploadedById: params.actorUserId,
        },
        include: { uploadedBy: { select: { name: true } } },
    });

    await logFrontendAudit({
        userId: params.actorUserId,
        action: "UPLOAD_PATIENT_FILE",
        entity: "PatientFile",
        entityId: record.id,
        details: { patientId: params.patientId, fileType: params.fileType, mimeType: blob.mimeType, sizeBytes: blob.sizeBytes },
    });
    return record;
}

export async function fetchPatientFileWithAudit(fileId: string, actorUserId: string, disposition: "view" | "download") {
    const file = await prisma.patientFile.findFirst({ where: { id: fileId, deletedAt: null } });
    if (!file) return null;
    const buffer = await readSecureBlob(file.storagePath);
    await logFrontendAudit({
        userId: actorUserId,
        action: disposition === "download" ? "DOWNLOAD_PATIENT_FILE" : "VIEW_PATIENT_FILE",
        entity: "PatientFile",
        entityId: file.id,
        details: { patientId: file.patientId, fileType: file.fileType },
    });
    return { file, buffer };
}

export async function archivePatientFile(fileId: string, actorUserId: string) {
    const existing = await prisma.patientFile.findFirst({ where: { id: fileId, deletedAt: null } });
    if (!existing) throw new Error("File not found.");
    await prisma.patientFile.update({ where: { id: fileId }, data: { deletedAt: new Date() } });
    await logFrontendAudit({
        userId: actorUserId,
        action: "DELETE_PATIENT_FILE",
        entity: "PatientFile",
        entityId: fileId,
        details: { patientId: existing.patientId, title: existing.title },
    });
}
