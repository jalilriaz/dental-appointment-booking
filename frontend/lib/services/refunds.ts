import prisma from "@/lib/prisma";
import { logFrontendAudit } from "@/lib/audit";
import { assertDayNotClosed } from "@/lib/services/closingLock";
import {
    calculatePlanFinancialState,
    validateRefundEligibility,
} from "@/lib/services/moneyMath";
import type { PaymentMethodValue } from "@/lib/constants/payment-methods";

export interface IssueRefundInput {
    refundedPaymentId: string;
    amount: number;
    method: PaymentMethodValue;
    notes: string;
    actorUserId: string;
}

export async function issueRefund(input: IssueRefundInput) {
    const now = new Date();
    await assertDayNotClosed(now);

    const original = await prisma.payment.findUnique({
        where: { id: input.refundedPaymentId },
        include: {
            refunds: { where: { type: "REFUND" }, select: { amount: true } },
            patientTreatment: {
                select: {
                    id: true,
                    totalCost: true,
                    patientId: true,
                    treatment: { select: { name: true } },
                    payments: { select: { amount: true, type: true } },
                },
            },
        },
    });

    if (!original) {
        return { success: false as const, status: 404, error: "Original payment not found." };
    }

    const priorRefunded = original.refunds.reduce((s, r) => s + r.amount, 0);
    const check = validateRefundEligibility({
        originalType: original.type,
        originalAmount: original.amount,
        priorRefundedTotal: priorRefunded,
        requestedAmount: input.amount,
    });
    if (!check.ok) {
        return { success: false as const, status: 400, error: check.error || "Invalid refund." };
    }

    const updated = await prisma.$transaction(async (tx) => {
        const refund = await tx.payment.create({
            data: {
                amount: input.amount,
                type: "REFUND",
                method: input.method,
                date: now,
                notes: input.notes.trim(),
                refundedPaymentId: original.id,
                patientTreatmentId: original.patientTreatmentId,
                appointmentId: original.appointmentId,
                recordedById: input.actorUserId,
            },
        });

        if (original.appointmentId) {
            const apt = await tx.appointment.findUnique({
                where: { id: original.appointmentId },
                select: { amountPaid: true },
            });
            if (apt) {
                await tx.appointment.update({
                    where: { id: original.appointmentId },
                    data: { amountPaid: Math.max(0, (apt.amountPaid || 0) - input.amount) },
                });
            }
        }

        const ledger = [
            ...original.patientTreatment.payments.map((p) => ({
                amount: p.amount,
                type: p.type as "PAYMENT" | "REFUND",
            })),
            { amount: input.amount, type: "REFUND" as const },
        ];
        const fin = calculatePlanFinancialState(original.patientTreatment.totalCost, ledger);

        await tx.patientTreatment.update({
            where: { id: original.patientTreatmentId },
            data: {
                financialStatus: fin.financialStatus,
                status: fin.financialStatus === "FULLY_PAID" ? "FULLY_PAID" : "ONGOING",
            },
        });

        return { refund, fin };
    });

    await logFrontendAudit({
        userId: input.actorUserId,
        action: "ISSUE_REFUND",
        entity: "Payment",
        entityId: updated.refund.id,
        details: {
            refundedPaymentId: original.id,
            patientId: original.patientTreatment.patientId,
            amount: input.amount,
            method: input.method,
            reason: input.notes.trim(),
            newRemainingBalance: updated.fin.remainingBalance,
        },
    });

    return { success: true as const, refund: updated.refund, financials: updated.fin };
}
