export interface PatientFileRow {
    id: string;
    fileType: "XRAY" | "PHOTO" | "REPORT" | "DOCUMENT";
    title: string;
    mimeType: string;
    sizeBytes: number;
    notes: string | null;
    createdAt: string;
    uploadedBy?: { name: string } | null;
}

export interface ConsentFormRow {
    id: string;
    title: string;
    procedureName: string | null;
    content: string;
    version: number;
    supersededById: string | null;
    signatureData: string | null;
    signedByName: string;
    signedAt: string;
    witnessName: string | null;
    createdBy?: { name: string } | null;
}

export interface BeforeAfterRow {
    id: string;
    title: string;
    treatmentId: string | null;
    notes: string | null;
    hasConsent: boolean;
    showOnWeb: boolean;
    takenAt: string;
    treatment?: { name: string } | null;
}

export interface PrescriptionEntryRow {
    drug: string;
    dose: string;
    frequency: string;
    duration: string;
    instructions?: string | null;
}

export interface PrescriptionRow {
    id: string;
    doctorName: string;
    doctorPmdc: string | null;
    entries: PrescriptionEntryRow[];
    allergyWarnings?: string[] | null;
    notes: string | null;
    createdAt: string;
}

export interface PatientEditableFields {
    id: string;
    name: string | null;
    phone: string | null;
    email: string | null;
    gender: string | null;
    dateOfBirth: string | null;
    address: string | null;
    medicalAlerts: string | null;
    allergies: string[];
    medications: string[];
    patientCode: number | null;
}

export interface ClinicHeaderInfo {
    clinicName: string;
    clinicAddress: string;
    phone: string;
    doctorName: string;
    doctorPmdc: string;
}
