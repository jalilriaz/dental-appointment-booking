import prisma from "@/lib/prisma";
import { logFrontendAudit } from "@/lib/audit";
import { getKarachiBoundsForDateKey } from "@/lib/karachi-date";
import { assertDayNotClosed } from "@/lib/services/closingLock";
import type { ExpenseInput } from "@/lib/validations/billing";

export async function listExpenses(filters?: {
    startDateKey?: string;
    endDateKey?: string;
    category?: string;
}) {
    const start = filters?.startDateKey
        ? getKarachiBoundsForDateKey(filters.startDateKey).startUtc
        : undefined;
    const end = filters?.endDateKey
        ? getKarachiBoundsForDateKey(filters.endDateKey).endUtc
        : undefined;

    const expenses = await prisma.expense.findMany({
        where: {
            deletedAt: null,
            ...(start || end ? { expenseDate: { ...(start && { gte: start }), ...(end && { lte: end }) } } : {}),
            ...(filters?.category && filters.category !== "ALL" ? { category: filters.category as never } : {}),
        },
        include: {
            recordedBy: { select: { id: true, name: true } },
        },
        orderBy: [{ expenseDate: "desc" }, { createdAt: "desc" }],
        take: 300,
    });

    const closings = await prisma.dailyClosing.findMany({
        where: { status: "APPROVED" },
        select: { closingDate: true },
    });
    const closedKeys = new Set(
        closings.map((c) => c.closingDate.toISOString().slice(0, 10))
    );

    return expenses.map((e) => ({
        ...e,
        expenseDate: e.expenseDate.toISOString(),
        createdAt: e.createdAt.toISOString(),
        updatedAt: e.updatedAt.toISOString(),
        isDayLocked: closedKeys.has(e.expenseDate.toISOString().slice(0, 10)),
    }));
}

export async function createExpense(input: ExpenseInput, actorUserId: string) {
    const { closingDateUtc } = getKarachiBoundsForDateKey(input.expenseDate);
    await assertDayNotClosed(closingDateUtc);

    const created = await prisma.expense.create({
        data: {
            title: input.title.trim(),
            category: input.category,
            amount: input.amount,
            method: input.method,
            expenseDate: new Date(closingDateUtc.getTime() + 12 * 3600 * 1000),
            vendor: input.vendor?.trim() || null,
            notes: input.notes?.trim() || null,
            recordedById: actorUserId,
        },
        include: { recordedBy: { select: { id: true, name: true } } },
    });

    await logFrontendAudit({
        userId: actorUserId,
        action: "CREATE_EXPENSE",
        entity: "Expense",
        entityId: created.id,
        details: { title: created.title, category: created.category, amount: created.amount, method: created.method },
    });

    return created;
}

export async function updateExpense(id: string, input: ExpenseInput, actorUserId: string) {
    const existing = await prisma.expense.findFirst({ where: { id, deletedAt: null } });
    if (!existing) throw new Error("Expense not found.");

    await assertDayNotClosed(existing.expenseDate);
    const { closingDateUtc } = getKarachiBoundsForDateKey(input.expenseDate);
    await assertDayNotClosed(closingDateUtc);

    const updated = await prisma.expense.update({
        where: { id },
        data: {
            title: input.title.trim(),
            category: input.category,
            amount: input.amount,
            method: input.method,
            expenseDate: new Date(closingDateUtc.getTime() + 12 * 3600 * 1000),
            vendor: input.vendor?.trim() || null,
            notes: input.notes?.trim() || null,
        },
        include: { recordedBy: { select: { id: true, name: true } } },
    });

    await logFrontendAudit({
        userId: actorUserId,
        action: "UPDATE_EXPENSE",
        entity: "Expense",
        entityId: id,
        details: { previousAmount: existing.amount, newAmount: updated.amount, category: updated.category },
    });

    return updated;
}

export async function deleteExpense(id: string, actorUserId: string) {
    const existing = await prisma.expense.findFirst({ where: { id, deletedAt: null } });
    if (!existing) throw new Error("Expense not found.");

    await assertDayNotClosed(existing.expenseDate);

    await prisma.expense.update({
        where: { id },
        data: { deletedAt: new Date() },
    });

    await logFrontendAudit({
        userId: actorUserId,
        action: "DELETE_EXPENSE",
        entity: "Expense",
        entityId: id,
        details: { title: existing.title, amount: existing.amount, category: existing.category },
    });
}
