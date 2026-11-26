import prisma from "@/lib/prisma";
import type { AppRole } from "@/lib/auth/permissions";
import { getClinicProfile } from "@/lib/data/clinic";
import { normalizeStringList } from "@/lib/services/prescriptions";
import type {
    BeforeAfterRow,
    ClinicHeaderInfo,
    ConsentFormRow,
    PatientFileRow,
    PrescriptionEntryRow,
    PrescriptionRow,
} from "@/features/patient-data/types";

export interface PatientClinicalBundle {
    files: PatientFileRow[];
    consents: ConsentFormRow[];
    beforeAfterPhotos: BeforeAfterRow[];
    prescriptions: PrescriptionRow[];
    clinicInfo: ClinicHeaderInfo;
}

export async function loadPatientProfileBundle(patientId: string, role: AppRole) {
    const isAdmin = role === "ADMIN";
    const [patient, treatments, clinic, filesRaw, consentsRaw, photosRaw, rxRaw] = await Promise.all([
        prisma.user.findUnique({
            where: { id: patientId },
            include: {
                appointments: {
                    include: {
                        treatment: { select: { id: true, name: true, price: true, durationMin: true } },
                        doctor: { select: { id: true, name: true } },
                        clinicalNotes: { orderBy: { createdAt: "desc" } },
                        payments: { orderBy: { date: "desc" } },
                    },
                    orderBy: { startTime: "desc" },
                },
                patientTreatments: {
                    include: {
                        treatment: { select: { id: true, name: true, description: true, price: true, durationMin: true } },
                        payments: { orderBy: { date: "desc" } },
                        appointments: { include: { treatment: { select: { name: true } } }, orderBy: { startTime: "asc" } },
                    },
                    orderBy: { startDate: "desc" },
                },
            },
        }),
        prisma.treatment.findMany({
            where: { isActive: true, deletedAt: null },
            select: { id: true, name: true, price: true, durationMin: true },
            orderBy: { name: "asc" },
        }),
        getClinicProfile(),
        isAdmin
            ? prisma.patientFile.findMany({
                  where: { patientId, deletedAt: null },
                  include: { uploadedBy: { select: { name: true } } },
                  orderBy: { createdAt: "desc" },
                  take: 100,
              })
            : Promise.resolve([]),
        prisma.consentForm.findMany({
            where: { patientId },
            include: { createdBy: { select: { name: true } } },
            orderBy: { signedAt: "desc" },
            take: 100,
        }),
        isAdmin
            ? prisma.beforeAfterPhoto.findMany({
                  where: { patientId },
                  include: { treatment: { select: { name: true } } },
                  orderBy: { createdAt: "desc" },
                  take: 50,
              })
            : Promise.resolve([]),
        prisma.prescription.findMany({
            where: { patientId },
            orderBy: { createdAt: "desc" },
            take: 100,
        }),
    ]);

    if (!patient) return null;

    const clinicalBundle: PatientClinicalBundle = {
        files: filesRaw.map((f) => ({
            id: f.id,
            fileType: f.fileType,
            title: f.title,
            mimeType: f.mimeType,
            sizeBytes: f.sizeBytes,
            notes: f.notes,
            createdAt: f.createdAt.toISOString(),
            uploadedBy: f.uploadedBy ? { name: f.uploadedBy.name || "Staff" } : null,
        })),
        consents: consentsRaw.map((c) => ({
            id: c.id,
            title: c.title,
            procedureName: c.procedureName,
            content: c.content,
            version: c.version,
            supersededById: c.supersededById,
            signatureData: c.signatureData,
            signedByName: c.signedByName,
            signedAt: c.signedAt.toISOString(),
            witnessName: c.witnessName,
            createdBy: c.createdBy ? { name: c.createdBy.name || "Staff" } : null,
        })),
        beforeAfterPhotos: photosRaw.map((p) => ({
            id: p.id,
            title: p.title,
            treatmentId: p.treatmentId,
            notes: p.notes,
            hasConsent: p.hasConsent,
            showOnWeb: p.showOnWeb,
            takenAt: p.takenAt.toISOString(),
            treatment: p.treatment,
        })),
        prescriptions: rxRaw.map((rx) => ({
            id: rx.id,
            doctorName: rx.doctorName,
            doctorPmdc: rx.doctorPmdc,
            entries: Array.isArray(rx.entries) ? (rx.entries as unknown as PrescriptionEntryRow[]) : [],
            allergyWarnings: normalizeStringList(rx.allergyWarnings),
            notes: rx.notes,
            createdAt: rx.createdAt.toISOString(),
        })),
        clinicInfo: {
            clinicName: clinic.clinicName,
            clinicAddress: clinic.clinicAddress,
            phone: clinic.mobilePhone || clinic.landlinePhone || "",
            doctorName: clinic.doctor.name,
            doctorPmdc: clinic.pmdcRegNumber,
        },
    };

    return {
        patient: {
            ...patient,
            allergies: normalizeStringList(patient.allergies),
            medications: normalizeStringList(patient.medications),
        },
        treatments,
        clinicalBundle,
    };
}
