-- AlterTable
ALTER TABLE "User" ADD COLUMN     "googleCalendarConnected" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "googleCalendarRefreshToken" TEXT,
ADD COLUMN     "googleCalendarToken" TEXT;
