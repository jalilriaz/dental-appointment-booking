-- Rollback: Drop added indexes and columns on User/Treatment/Appointment/SystemSettings/Payment (note: PostgreSQL cannot drop individual enum values in-place without type recreation).

-- AlterEnum
ALTER TYPE "ApptStatus" ADD VALUE IF NOT EXISTS 'ARRIVED';
ALTER TYPE "ApptStatus" ADD VALUE IF NOT EXISTS 'IN_PROGRESS';

-- AlterEnum
ALTER TYPE "PaymentMethod" ADD VALUE IF NOT EXISTS 'BANK_TRANSFER';
ALTER TYPE "PaymentMethod" ADD VALUE IF NOT EXISTS 'JAZZCASH';
ALTER TYPE "PaymentMethod" ADD VALUE IF NOT EXISTS 'EASYPAISA';

-- AlterTable
ALTER TABLE "Appointment"
    ADD COLUMN IF NOT EXISTS "isEmergency" BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "SystemSettings"
    ADD COLUMN IF NOT EXISTS "advanceNoticeMin" INTEGER NOT NULL DEFAULT 60,
    ADD COLUMN IF NOT EXISTS "breakEnd" TEXT,
    ADD COLUMN IF NOT EXISTS "breakStart" TEXT,
    ADD COLUMN IF NOT EXISTS "bufferMin" INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS "cancellationCutoffHours" INTEGER NOT NULL DEFAULT 12,
    ADD COLUMN IF NOT EXISTS "maxBookingDaysAhead" INTEGER NOT NULL DEFAULT 60;

-- AlterTable
ALTER TABLE "Treatment"
    ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP(3),
    ADD COLUMN IF NOT EXISTS "showOnWeb" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "User"
    ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP(3),
    ADD COLUMN IF NOT EXISTS "isActive" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Appointment_startTime_status_idx" ON "Appointment"("startTime", "status");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Payment_date_idx" ON "Payment"("date");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Payment_patientTreatmentId_idx" ON "Payment"("patientTreatmentId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Payment_appointmentId_idx" ON "Payment"("appointmentId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Treatment_isActive_showOnWeb_idx" ON "Treatment"("isActive", "showOnWeb");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "User_phone_idx" ON "User"("phone");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "User_role_isActive_idx" ON "User"("role", "isActive");
