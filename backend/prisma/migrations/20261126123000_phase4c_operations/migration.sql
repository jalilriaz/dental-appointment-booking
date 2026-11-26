-- Phase 4C: Operations (Staff session invalidation, Doctor planned leave, Message templates, Recall opt-out, Notification SKIPPED status)
-- Rollback note: ALTER TABLE "User" DROP COLUMN IF EXISTS "tokenVersion", DROP COLUMN IF EXISTS "mustChangePassword", DROP COLUMN IF EXISTS "recallOptOut"; ALTER TABLE "Doctor" DROP COLUMN IF EXISTS "unavailableFrom", DROP COLUMN IF EXISTS "unavailableTo", DROP COLUMN IF EXISTS "unavailableReason"; ALTER TABLE "SystemSettings" DROP COLUMN IF EXISTS "messageTemplates"; (Postgres enum value SKIPPED can remain safely without breaking reads).

ALTER TYPE "NotificationDeliveryStatus" ADD VALUE IF NOT EXISTS 'SKIPPED';

ALTER TABLE "User"
    ADD COLUMN IF NOT EXISTS "tokenVersion" INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS "mustChangePassword" BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN IF NOT EXISTS "recallOptOut" BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE "Doctor"
    ADD COLUMN IF NOT EXISTS "unavailableFrom" TIMESTAMP(3),
    ADD COLUMN IF NOT EXISTS "unavailableTo" TIMESTAMP(3),
    ADD COLUMN IF NOT EXISTS "unavailableReason" TEXT;

ALTER TABLE "SystemSettings"
    ADD COLUMN IF NOT EXISTS "messageTemplates" JSONB;
