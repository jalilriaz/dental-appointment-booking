/*
  Warnings:

  - You are about to drop the column `cancelReason` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `googleCalendarEventId` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `paymentStatus` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `staffId` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Appointment` table. All the data in the column will be lost.
  - The `status` column on the `Appointment` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `address` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `allergies` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `bio` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `bloodGroup` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `dateOfBirth` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `experience` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `gender` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `googleCalendarConnected` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `googleCalendarRefreshToken` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `googleCalendarToken` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `medicalHistory` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `qualification` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `resetToken` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `resetTokenExpiry` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `specialization` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `workingHours` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `ClinicSettings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MedicalRecord` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Notification` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ServiceCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TreatmentOption` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[googleEventId]` on the table `Appointment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Made the column `name` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `phone` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "ApptStatus" AS ENUM ('SCHEDULED', 'RESCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_SHOW');

-- CreateEnum
CREATE TYPE "BookingSource" AS ENUM ('WEBSITE', 'WALK_IN', 'WHATSAPP_BOT');

-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_staffId_fkey";

-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_treatmentId_fkey";

-- DropForeignKey
ALTER TABLE "MedicalRecord" DROP CONSTRAINT "MedicalRecord_appointmentId_fkey";

-- DropForeignKey
ALTER TABLE "MedicalRecord" DROP CONSTRAINT "MedicalRecord_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "MedicalRecord" DROP CONSTRAINT "MedicalRecord_patientId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_userId_fkey";

-- DropForeignKey
ALTER TABLE "TreatmentOption" DROP CONSTRAINT "TreatmentOption_categoryId_fkey";

-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "cancelReason",
DROP COLUMN "googleCalendarEventId",
DROP COLUMN "notes",
DROP COLUMN "paymentStatus",
DROP COLUMN "staffId",
DROP COLUMN "updatedAt",
ADD COLUMN     "bookedBy" "BookingSource" NOT NULL DEFAULT 'WEBSITE',
ADD COLUMN     "googleEventId" TEXT,
DROP COLUMN "status",
ADD COLUMN     "status" "ApptStatus" NOT NULL DEFAULT 'SCHEDULED';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "address",
DROP COLUMN "allergies",
DROP COLUMN "bio",
DROP COLUMN "bloodGroup",
DROP COLUMN "dateOfBirth",
DROP COLUMN "experience",
DROP COLUMN "gender",
DROP COLUMN "googleCalendarConnected",
DROP COLUMN "googleCalendarRefreshToken",
DROP COLUMN "googleCalendarToken",
DROP COLUMN "image",
DROP COLUMN "medicalHistory",
DROP COLUMN "qualification",
DROP COLUMN "resetToken",
DROP COLUMN "resetTokenExpiry",
DROP COLUMN "specialization",
DROP COLUMN "updatedAt",
DROP COLUMN "workingHours",
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "phone" SET NOT NULL;

-- DropTable
DROP TABLE "ClinicSettings";

-- DropTable
DROP TABLE "MedicalRecord";

-- DropTable
DROP TABLE "Notification";

-- DropTable
DROP TABLE "ServiceCategory";

-- DropTable
DROP TABLE "TreatmentOption";

-- DropEnum
DROP TYPE "AppointmentStatus";

-- CreateTable
CREATE TABLE "Treatment" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "durationMin" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "description" TEXT,
    "instructions" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Treatment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SystemSettings" (
    "id" TEXT NOT NULL DEFAULT 'settings',
    "clinicName" TEXT NOT NULL DEFAULT 'Elite Dental Centre',
    "workDayStart" TEXT NOT NULL DEFAULT '09:00',
    "workDayEnd" TEXT NOT NULL DEFAULT '17:00',
    "slotDurationMin" INTEGER NOT NULL DEFAULT 30,

    CONSTRAINT "SystemSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Appointment_googleEventId_key" ON "Appointment"("googleEventId");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_treatmentId_fkey" FOREIGN KEY ("treatmentId") REFERENCES "Treatment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
