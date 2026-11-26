-- Rollback: DROP TABLE IF EXISTS "LabOrder", "DailyClosing", "Expense"; ALTER TABLE "Payment" DROP COLUMN IF EXISTS "type", DROP COLUMN IF EXISTS "refundedPaymentId"; DROP TYPE IF EXISTS "LabOrderStatus", "ExpenseCategory", "PaymentType";

-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('PAYMENT', 'REFUND');

-- CreateEnum
CREATE TYPE "ExpenseCategory" AS ENUM ('RENT', 'SUPPLIES', 'LAB_FEES', 'UTILITIES', 'SALARY', 'EQUIPMENT', 'MARKETING', 'OTHER');

-- CreateEnum
CREATE TYPE "LabOrderStatus" AS ENUM ('SENT', 'IN_PROGRESS', 'RECEIVED', 'DELIVERED', 'CANCELLED');

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "refundedPaymentId" TEXT,
ADD COLUMN     "type" "PaymentType" NOT NULL DEFAULT 'PAYMENT';

-- CreateTable
CREATE TABLE "Expense" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" "ExpenseCategory" NOT NULL DEFAULT 'SUPPLIES',
    "amount" INTEGER NOT NULL,
    "method" "PaymentMethod" NOT NULL DEFAULT 'CASH',
    "expenseDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "vendor" TEXT,
    "notes" TEXT,
    "recordedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Expense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyClosing" (
    "id" TEXT NOT NULL,
    "closingDate" TIMESTAMP(3) NOT NULL,
    "openingCash" INTEGER NOT NULL DEFAULT 0,
    "cashCollected" INTEGER NOT NULL DEFAULT 0,
    "cardCollected" INTEGER NOT NULL DEFAULT 0,
    "onlineCollected" INTEGER NOT NULL DEFAULT 0,
    "bankTransferCollected" INTEGER NOT NULL DEFAULT 0,
    "jazzcashCollected" INTEGER NOT NULL DEFAULT 0,
    "easypaisaCollected" INTEGER NOT NULL DEFAULT 0,
    "refundsTotal" INTEGER NOT NULL DEFAULT 0,
    "expensesTotal" INTEGER NOT NULL DEFAULT 0,
    "expectedCash" INTEGER NOT NULL DEFAULT 0,
    "actualCash" INTEGER NOT NULL DEFAULT 0,
    "variance" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "closedById" TEXT,
    "closedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DailyClosing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LabOrder" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "appointmentId" TEXT,
    "labName" TEXT NOT NULL,
    "workType" TEXT NOT NULL,
    "toothNumbers" TEXT,
    "shade" TEXT,
    "cost" INTEGER NOT NULL DEFAULT 0,
    "status" "LabOrderStatus" NOT NULL DEFAULT 'SENT',
    "sentDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expectedDate" TIMESTAMP(3),
    "receivedDate" TIMESTAMP(3),
    "deliveredDate" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LabOrder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Expense_expenseDate_idx" ON "Expense"("expenseDate");

-- CreateIndex
CREATE INDEX "Expense_category_idx" ON "Expense"("category");

-- CreateIndex
CREATE UNIQUE INDEX "DailyClosing_closingDate_key" ON "DailyClosing"("closingDate");

-- CreateIndex
CREATE INDEX "DailyClosing_closingDate_idx" ON "DailyClosing"("closingDate");

-- CreateIndex
CREATE INDEX "LabOrder_patientId_idx" ON "LabOrder"("patientId");

-- CreateIndex
CREATE INDEX "LabOrder_status_idx" ON "LabOrder"("status");

-- CreateIndex
CREATE INDEX "LabOrder_expectedDate_idx" ON "LabOrder"("expectedDate");

-- CreateIndex
CREATE INDEX "Payment_type_date_idx" ON "Payment"("type", "date");

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_recordedById_fkey" FOREIGN KEY ("recordedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyClosing" ADD CONSTRAINT "DailyClosing_closedById_fkey" FOREIGN KEY ("closedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LabOrder" ADD CONSTRAINT "LabOrder_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LabOrder" ADD CONSTRAINT "LabOrder_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE SET NULL ON UPDATE CASCADE;
