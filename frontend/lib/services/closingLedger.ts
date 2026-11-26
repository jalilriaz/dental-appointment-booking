import prisma from "@/lib/prisma";
import { getKarachiBoundsForDateKey } from "@/lib/karachi-date";

export async function computeDayLedger(dateKey: string) {
    const { startUtc, endUtc, closingDateUtc } = getKarachiBoundsForDateKey(dateKey);
    const [payments, expenses, existing, prevClosing] = await Promise.all([
        prisma.payment.findMany({
            where: { date: { gte: startUtc, lte: endUtc } },
            select: { amount: true, type: true, method: true },
        }),
        prisma.expense.findMany({
            where: { deletedAt: null, expenseDate: { gte: startUtc, lte: endUtc } },
            select: { amount: true, method: true },
        }),
        prisma.dailyClosing.findUnique({
            where: { closingDate: closingDateUtc },
            include: {
                submittedBy: { select: { name: true } },
                approvedBy: { select: { name: true } },
                reopenedBy: { select: { name: true } },
            },
        }),
        prisma.dailyClosing.findFirst({
            where: { closingDate: { lt: closingDateUtc }, status: "APPROVED" },
            orderBy: { closingDate: "desc" },
            select: { actualCash: true },
        }),
    ]);

    const totals = {
        cashCollected: 0, cardCollected: 0, onlineCollected: 0,
        bankTransferCollected: 0, jazzcashCollected: 0, easypaisaCollected: 0,
        refundsTotal: 0, cashRefundsTotal: 0, expensesTotal: 0, cashExpensesTotal: 0,
    };
    for (const p of payments) {
        if (p.type === "REFUND") {
            totals.refundsTotal += p.amount;
            if (p.method === "CASH") totals.cashRefundsTotal += p.amount;
        } else {
            if (p.method === "CASH") totals.cashCollected += p.amount;
            else if (p.method === "CARD") totals.cardCollected += p.amount;
            else if (p.method === "BANK_TRANSFER") totals.bankTransferCollected += p.amount;
            else if (p.method === "JAZZCASH") totals.jazzcashCollected += p.amount;
            else if (p.method === "EASYPAISA") totals.easypaisaCollected += p.amount;
            else totals.onlineCollected += p.amount;
        }
    }
    for (const e of expenses) {
        totals.expensesTotal += e.amount;
        if (e.method === "CASH") totals.cashExpensesTotal += e.amount;
    }

    return { dateKey, closingDateUtc, totals, defaultOpeningCash: prevClosing?.actualCash ?? 0, existing };
}
