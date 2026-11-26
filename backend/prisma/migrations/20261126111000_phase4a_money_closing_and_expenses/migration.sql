-- Phase 4A: Money, Refunds, Expenses (Maintenance), and Daily Closing Workflow
-- Rollback note: Drop added columns/indexes/ClosingStatus enum and restore backup; enum value 'MAINTENANCE' in ExpenseCategory cannot be dropped easily in Postgres without type recreation.

ALTER TYPE "ExpenseCategory" ADD VALUE IF NOT EXISTS 'MAINTENANCE';

DO $$ BEGIN
    CREATE TYPE "ClosingStatus" AS ENUM ('SUBMITTED', 'APPROVED', 'REOPENED');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE "Payment" ADD COLUMN IF NOT EXISTS "recordedById" TEXT;

DO $$ BEGIN
    ALTER TABLE "Payment" ADD CONSTRAINT "Payment_recordedById_fkey" FOREIGN KEY ("recordedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    ALTER TABLE "Payment" ADD CONSTRAINT "Payment_refundedPaymentId_fkey" FOREIGN KEY ("refundedPaymentId") REFERENCES "Payment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE INDEX IF NOT EXISTS "Payment_refundedPaymentId_idx" ON "Payment"("refundedPaymentId");

ALTER TABLE "Expense"
    ADD COLUMN IF NOT EXISTS "receiptFileId" TEXT,
    ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP(3);

CREATE INDEX IF NOT EXISTS "Expense_deletedAt_idx" ON "Expense"("deletedAt");

ALTER TABLE "DailyClosing"
    ADD COLUMN IF NOT EXISTS "openingNote" TEXT,
    ADD COLUMN IF NOT EXISTS "cashRefundsTotal" INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS "cashExpensesTotal" INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS "status" "ClosingStatus" NOT NULL DEFAULT 'SUBMITTED',
    ADD COLUMN IF NOT EXISTS "submittedById" TEXT,
    ADD COLUMN IF NOT EXISTS "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ADD COLUMN IF NOT EXISTS "approvedById" TEXT,
    ADD COLUMN IF NOT EXISTS "approvedAt" TIMESTAMP(3),
    ADD COLUMN IF NOT EXISTS "reopenedById" TEXT,
    ADD COLUMN IF NOT EXISTS "reopenedAt" TIMESTAMP(3),
    ADD COLUMN IF NOT EXISTS "reopenReason" TEXT;

DO $$ BEGIN
    ALTER TABLE "DailyClosing" ADD CONSTRAINT "DailyClosing_submittedById_fkey" FOREIGN KEY ("submittedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    ALTER TABLE "DailyClosing" ADD CONSTRAINT "DailyClosing_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    ALTER TABLE "DailyClosing" ADD CONSTRAINT "DailyClosing_reopenedById_fkey" FOREIGN KEY ("reopenedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE INDEX IF NOT EXISTS "DailyClosing_status_idx" ON "DailyClosing"("status");
