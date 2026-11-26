import prisma from "@/lib/prisma";
import { getKarachiDateKey } from "@/lib/format";
import { getKarachiDateKeyFromClosingDate } from "@/lib/karachi-date";

export interface ClosingAggregateRow {
    period: string;
    collected: number;
    refunds: number;
    expenses: number;
    variance: number;
    daysClosed: number;
}

export async function getClosingHistory(view: "daily" | "monthly" | "yearly" = "daily") {
    const rows = await prisma.dailyClosing.findMany({
        include: {
            submittedBy: { select: { name: true } },
            approvedBy: { select: { name: true } },
        },
        orderBy: { closingDate: "desc" },
        take: 365,
    });

    const daily = rows.map((r) => {
        const dateKey = getKarachiDateKeyFromClosingDate(r.closingDate);
        const collected =
            r.cashCollected + r.cardCollected + r.onlineCollected +
            r.bankTransferCollected + r.jazzcashCollected + r.easypaisaCollected;
        return {
            id: r.id,
            dateKey,
            status: r.status,
            openingCash: r.openingCash,
            collected,
            cashCollected: r.cashCollected,
            refunds: r.refundsTotal,
            expenses: r.expensesTotal,
            expectedCash: r.expectedCash,
            actualCash: r.actualCash,
            variance: r.variance,
            submittedByName: r.submittedBy?.name || null,
            approvedByName: r.approvedBy?.name || null,
        };
    });

    if (view === "daily") return { view, daily, aggregated: [] as ClosingAggregateRow[] };

    const groups = new Map<string, ClosingAggregateRow>();
    for (const d of daily) {
        const key = view === "monthly" ? d.dateKey.slice(0, 7) : d.dateKey.slice(0, 4);
        const cur = groups.get(key) || {
            period: key, collected: 0, refunds: 0, expenses: 0, variance: 0, daysClosed: 0,
        };
        cur.collected += d.collected;
        cur.refunds += d.refunds;
        cur.expenses += d.expenses;
        cur.variance += d.variance;
        if (d.status === "APPROVED") cur.daysClosed += 1;
        groups.set(key, cur);
    }

    return {
        view,
        daily,
        aggregated: Array.from(groups.values()).sort((a, b) => b.period.localeCompare(a.period)),
    };
}

export async function getDaysNotClosed(lookbackDays = 60) {
    const since = new Date(Date.now() - lookbackDays * 86400000);
    const [payments, expenses, closings] = await Promise.all([
        prisma.payment.findMany({
            where: { date: { gte: since } },
            select: { date: true, amount: true, type: true },
        }),
        prisma.expense.findMany({
            where: { deletedAt: null, expenseDate: { gte: since } },
            select: { expenseDate: true, amount: true },
        }),
        prisma.dailyClosing.findMany({
            where: { closingDate: { gte: since }, status: "APPROVED" },
            select: { closingDate: true },
        }),
    ]);

    const approvedSet = new Set(closings.map((c) => getKarachiDateKeyFromClosingDate(c.closingDate)));
    const activeDates = new Map<string, { paymentsCount: number; expensesCount: number; netCashFlow: number }>();

    for (const p of payments) {
        const key = getKarachiDateKey(p.date);
        if (approvedSet.has(key)) continue;
        const cur = activeDates.get(key) || { paymentsCount: 0, expensesCount: 0, netCashFlow: 0 };
        cur.paymentsCount += 1;
        cur.netCashFlow += p.type === "REFUND" ? -p.amount : p.amount;
        activeDates.set(key, cur);
    }
    for (const e of expenses) {
        const key = getKarachiDateKey(e.expenseDate);
        if (approvedSet.has(key)) continue;
        const cur = activeDates.get(key) || { paymentsCount: 0, expensesCount: 0, netCashFlow: 0 };
        cur.expensesCount += 1;
        cur.netCashFlow -= e.amount;
        activeDates.set(key, cur);
    }

    return Array.from(activeDates.entries())
        .map(([dateKey, info]) => ({ dateKey, ...info }))
        .sort((a, b) => b.dateKey.localeCompare(a.dateKey));
}
