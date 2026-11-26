import prisma from "@/lib/prisma";
import { logFrontendAudit } from "@/lib/audit";
import { getKarachiBoundsForDateKey } from "@/lib/karachi-date";
import { computeDayLedger } from "@/lib/services/closingLedger";
import { calculateExpectedCash } from "@/lib/services/moneyMath";

export async function getDailyClosingPreview(dateKey: string) {
    const ledger = await computeDayLedger(dateKey);
    const openingCash = ledger.existing?.openingCash ?? ledger.defaultOpeningCash;
    const expectedCash = calculateExpectedCash({
        openingCash,
        cashCollected: ledger.totals.cashCollected,
        cashRefundsTotal: ledger.totals.cashRefundsTotal,
        cashExpensesTotal: ledger.totals.cashExpensesTotal,
    });
    return {
        dateKey,
        defaultOpeningCash: ledger.defaultOpeningCash,
        openingCash,
        expectedCash,
        totals: ledger.totals,
        closing: ledger.existing
            ? {
                  ...ledger.existing,
                  closingDate: ledger.existing.closingDate.toISOString(),
                  submittedAt: ledger.existing.submittedAt.toISOString(),
                  approvedAt: ledger.existing.approvedAt?.toISOString() ?? null,
                  reopenedAt: ledger.existing.reopenedAt?.toISOString() ?? null,
                  closedAt: ledger.existing.closedAt.toISOString(),
              }
            : null,
    };
}

export async function submitDailyClosingCount(params: {
    dateKey: string; openingCash: number; openingNote?: string | null;
    actualCash: number; notes?: string | null; userId: string;
}) {
    const ledger = await computeDayLedger(params.dateKey);
    if (ledger.existing?.status === "APPROVED") {
        throw new Error(`Day ${params.dateKey} is already approved and locked.`);
    }
    const expectedCash = calculateExpectedCash({
        openingCash: params.openingCash,
        cashCollected: ledger.totals.cashCollected,
        cashRefundsTotal: ledger.totals.cashRefundsTotal,
        cashExpensesTotal: ledger.totals.cashExpensesTotal,
    });
    const variance = params.actualCash - expectedCash;
    const row = await prisma.dailyClosing.upsert({
        where: { closingDate: ledger.closingDateUtc },
        create: {
            closingDate: ledger.closingDateUtc, openingCash: params.openingCash,
            openingNote: params.openingNote?.trim() || null, ...ledger.totals,
            expectedCash, actualCash: params.actualCash, variance,
            status: "SUBMITTED", notes: params.notes?.trim() || null,
            submittedById: params.userId, submittedAt: new Date(),
        },
        update: {
            openingCash: params.openingCash, openingNote: params.openingNote?.trim() || null,
            ...ledger.totals, expectedCash, actualCash: params.actualCash, variance,
            status: "SUBMITTED", notes: params.notes?.trim() || null,
            submittedById: params.userId, submittedAt: new Date(),
        },
    });
    await logFrontendAudit({
        userId: params.userId, action: "SUBMIT_DAILY_CLOSING", entity: "DailyClosing",
        entityId: row.id, details: { dateKey: params.dateKey, expectedCash, actualCash: params.actualCash, variance },
    });
    return row;
}

export async function approveDailyClosing(params: {
    dateKey: string; openingCash: number; openingNote?: string | null;
    actualCash: number; notes?: string | null; adminUserId: string;
}) {
    const ledger = await computeDayLedger(params.dateKey);
    const expectedCash = calculateExpectedCash({
        openingCash: params.openingCash,
        cashCollected: ledger.totals.cashCollected,
        cashRefundsTotal: ledger.totals.cashRefundsTotal,
        cashExpensesTotal: ledger.totals.cashExpensesTotal,
    });
    const variance = params.actualCash - expectedCash;
    const now = new Date();
    const row = await prisma.dailyClosing.upsert({
        where: { closingDate: ledger.closingDateUtc },
        create: {
            closingDate: ledger.closingDateUtc, openingCash: params.openingCash,
            openingNote: params.openingNote?.trim() || null, ...ledger.totals,
            expectedCash, actualCash: params.actualCash, variance, status: "APPROVED",
            notes: params.notes?.trim() || null, submittedById: params.adminUserId,
            approvedById: params.adminUserId, approvedAt: now, closedById: params.adminUserId, closedAt: now,
        },
        update: {
            openingCash: params.openingCash, openingNote: params.openingNote?.trim() || null,
            ...ledger.totals, expectedCash, actualCash: params.actualCash, variance, status: "APPROVED",
            notes: params.notes?.trim() || null,
            submittedById: ledger.existing?.submittedById || params.adminUserId,
            approvedById: params.adminUserId, approvedAt: now, closedById: params.adminUserId, closedAt: now,
        },
    });
    await logFrontendAudit({
        userId: params.adminUserId, action: "APPROVE_DAILY_CLOSING", entity: "DailyClosing",
        entityId: row.id, details: { dateKey: params.dateKey, expectedCash, actualCash: params.actualCash, variance },
    });
    return row;
}

export async function reopenDailyClosing(params: { dateKey: string; reason: string; adminUserId: string }) {
    const { closingDateUtc } = getKarachiBoundsForDateKey(params.dateKey);
    const existing = await prisma.dailyClosing.findUnique({ where: { closingDate: closingDateUtc } });
    if (!existing) throw new Error(`No closing record found for ${params.dateKey}.`);
    if (existing.status !== "APPROVED") throw new Error(`Day ${params.dateKey} is not currently locked.`);

    const updated = await prisma.dailyClosing.update({
        where: { id: existing.id },
        data: { status: "REOPENED", reopenedById: params.adminUserId, reopenedAt: new Date(), reopenReason: params.reason.trim() },
    });
    await logFrontendAudit({
        userId: params.adminUserId, action: "REOPEN_DAILY_CLOSING", entity: "DailyClosing",
        entityId: existing.id,
        details: {
            dateKey: params.dateKey, reason: params.reason.trim(),
            previousSnapshot: {
                openingCash: existing.openingCash, expectedCash: existing.expectedCash,
                actualCash: existing.actualCash, variance: existing.variance,
                cashCollected: existing.cashCollected, refundsTotal: existing.refundsTotal,
                expensesTotal: existing.expensesTotal,
            },
        },
    });
    return updated;
}
