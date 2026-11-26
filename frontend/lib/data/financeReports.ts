import prisma from "@/lib/prisma";
import { getKarachiBoundsForDateKey } from "@/lib/karachi-date";
import { ALL_PAYMENT_METHODS } from "@/lib/constants/payment-methods";
import { calculateCashBasisProfit } from "@/lib/services/moneyMath";

export { getAgingReport } from "@/lib/data/agingReport";

export async function getProfitReport(startDateKey: string, endDateKey: string) {
    const startUtc = getKarachiBoundsForDateKey(startDateKey).startUtc;
    const endUtc = getKarachiBoundsForDateKey(endDateKey).endUtc;

    const [payments, expenses] = await Promise.all([
        prisma.payment.findMany({
            where: { date: { gte: startUtc, lte: endUtc } },
            include: {
                patientTreatment: {
                    select: {
                        id: true,
                        patient: { select: { id: true, name: true, phone: true } },
                        treatment: { select: { name: true } },
                    },
                },
                refunds: { where: { type: "REFUND" }, select: { amount: true } },
            },
            orderBy: { date: "desc" },
        }),
        prisma.expense.findMany({
            where: { deletedAt: null, expenseDate: { gte: startUtc, lte: endUtc } },
            select: { id: true, title: true, category: true, amount: true, method: true, expenseDate: true },
            orderBy: { expenseDate: "desc" },
        }),
    ]);

    let paymentsTotal = 0;
    let refundsTotal = 0;
    const byMethod = new Map<string, { payments: number; refunds: number }>();
    for (const m of ALL_PAYMENT_METHODS) byMethod.set(m.value, { payments: 0, refunds: 0 });

    for (const p of payments) {
        const cur = byMethod.get(p.method) || { payments: 0, refunds: 0 };
        if (p.type === "REFUND") {
            refundsTotal += p.amount;
            cur.refunds += p.amount;
        } else {
            paymentsTotal += p.amount;
            cur.payments += p.amount;
        }
        byMethod.set(p.method, cur);
    }

    let expensesTotal = 0;
    const byExpenseCategory = new Map<string, number>();
    for (const e of expenses) {
        expensesTotal += e.amount;
        byExpenseCategory.set(e.category, (byExpenseCategory.get(e.category) || 0) + e.amount);
    }

    const { netRevenue, profit } = calculateCashBasisProfit({ paymentsTotal, refundsTotal, expensesTotal });

    return {
        startDateKey,
        endDateKey,
        paymentsTotal,
        refundsTotal,
        netRevenue,
        expensesTotal,
        profit,
        methodBreakdown: ALL_PAYMENT_METHODS.map((m) => {
            const vals = byMethod.get(m.value) || { payments: 0, refunds: 0 };
            return { method: m.value, label: m.label, ...vals, net: vals.payments - vals.refunds };
        }).filter((r) => r.payments > 0 || r.refunds > 0 || r.method === "CASH"),
        expenseBreakdown: Array.from(byExpenseCategory.entries())
            .map(([category, amount]) => ({ category, amount }))
            .sort((a, b) => b.amount - a.amount),
        recentPayments: payments.slice(0, 50).map((p) => ({
            id: p.id,
            date: p.date.toISOString(),
            type: p.type,
            method: p.method,
            amount: p.amount,
            notes: p.notes,
            patientId: p.patientTreatment.patient.id,
            patientName: p.patientTreatment.patient.name,
            treatmentName: p.patientTreatment.treatment.name,
            refundedPaymentId: p.refundedPaymentId,
            priorRefunded: p.refunds.reduce((s, r) => s + r.amount, 0),
        })),
    };
}
