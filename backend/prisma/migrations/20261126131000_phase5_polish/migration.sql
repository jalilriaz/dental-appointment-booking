-- Phase 5: Polish (Public content settings JSON)
-- Rollback note: ALTER TABLE "SystemSettings" DROP COLUMN IF EXISTS "publicContent";

ALTER TABLE "SystemSettings"
    ADD COLUMN IF NOT EXISTS "publicContent" JSONB;
