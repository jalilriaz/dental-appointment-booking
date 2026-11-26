-- Phase 4B: Structured Allergies/Medications, Consent Versioning, Before/After Secure File Links, Prescriptions
-- Rollback note: Drop Prescription table and added columns on User, ConsentForm, BeforeAfterPhoto (or restore elitedental_pre_4b.sql).

ALTER TABLE "User"
    ADD COLUMN IF NOT EXISTS "allergies" JSONB,
    ADD COLUMN IF NOT EXISTS "medications" JSONB;

ALTER TABLE "ConsentForm"
    ADD COLUMN IF NOT EXISTS "version" INTEGER NOT NULL DEFAULT 1,
    ADD COLUMN IF NOT EXISTS "supersededById" TEXT;

DO $$ BEGIN
    ALTER TABLE "ConsentForm" ADD CONSTRAINT "ConsentForm_supersededById_fkey" FOREIGN KEY ("supersededById") REFERENCES "ConsentForm"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

ALTER TABLE "BeforeAfterPhoto"
    ADD COLUMN IF NOT EXISTS "beforeFileId" TEXT,
    ADD COLUMN IF NOT EXISTS "afterFileId" TEXT;

CREATE TABLE IF NOT EXISTS "Prescription" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "appointmentId" TEXT,
    "prescribedById" TEXT,
    "doctorName" TEXT NOT NULL,
    "doctorPmdc" TEXT,
    "entries" JSONB NOT NULL,
    "allergyWarnings" JSONB,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Prescription_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "Prescription_patientId_idx" ON "Prescription"("patientId");
CREATE INDEX IF NOT EXISTS "Prescription_appointmentId_idx" ON "Prescription"("appointmentId");

DO $$ BEGIN
    ALTER TABLE "Prescription" ADD CONSTRAINT "Prescription_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    ALTER TABLE "Prescription" ADD CONSTRAINT "Prescription_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    ALTER TABLE "Prescription" ADD CONSTRAINT "Prescription_prescribedById_fkey" FOREIGN KEY ("prescribedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
