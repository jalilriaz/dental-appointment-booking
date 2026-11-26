import { isCashMethod } from "../constants/payment-methods";

export interface RefundCheckResult {
    ok: boolean;
    error?: string;
    maxRefundable: number;
}

export function validateRefundEligibility(params: {
    originalType: "PAYMENT" | "REFUND";
    originalAmount: number;
    priorRefundedTotal: number;
    requestedAmount: number;
}): RefundCheckResult {
    const maxRefundable = Math.max(0, params.originalAmount - params.priorRefundedTotal);
    if (params.originalType !== "PAYMENT") {
        return { ok: false, error: "Refunds can only target an original payment.", maxRefundable: 0 };
    }
    if (!Number.isInteger(params.requestedAmount) || params.requestedAmount <= 0) {
        return { ok: false, error: "Refund amount must be a positive whole number.", maxRefundable };
    }
    if (params.requestedAmount > maxRefundable) {
        return {
            ok: false,
            error: `Refund cannot exceed remaining refundable amount (Rs. ${maxRefundable.toLocaleString("en-PK")}).`,
            maxRefundable,
        };
    }
    return { ok: true, maxRefundable };
}

export function calculatePlanFinancialState(
    totalCost: number,
    ledger: Array<{ amount: number; type: "PAYMENT" | "REFUND" }>
) {
    let paymentsTotal = 0;
    let refundsTotal = 0;
    for (const entry of ledger) {
        if (entry.type === "REFUND") refundsTotal += entry.amount;
        else paymentsTotal += entry.amount;
    }
    const netPaid = Math.max(0, paymentsTotal - refundsTotal);
    const remainingBalance = Math.max(0, totalCost - netPaid);
    const financialStatus: "UNPAID" | "PARTIALLY_PAID" | "FULLY_PAID" =
        netPaid >= totalCost && totalCost > 0
            ? "FULLY_PAID"
            : netPaid > 0
              ? "PARTIALLY_PAID"
              : "UNPAID";

    return { paymentsTotal, refundsTotal, netPaid, remainingBalance, financialStatus };
}

export function calculateCashBasisProfit(params: {
    paymentsTotal: number;
    refundsTotal: number;
    expensesTotal: number;
}) {
    const netRevenue = params.paymentsTotal - params.refundsTotal;
    const profit = netRevenue - params.expensesTotal;
    return { netRevenue, profit };
}

export function calculateExpectedCash(params: {
    openingCash: number;
    cashCollected: number;
    cashRefundsTotal: number;
    cashExpensesTotal: number;
}) {
    return (
        params.openingCash +
        params.cashCollected -
        params.cashRefundsTotal -
        params.cashExpensesTotal
    );
}

export function summarizeCashTransactions(
    payments: Array<{ amount: number; type: "PAYMENT" | "REFUND"; method: string }>,
    expenses: Array<{ amount: number; method: string }>
) {
    let cashCollected = 0;
    let cashRefundsTotal = 0;
    let cashExpensesTotal = 0;
    for (const p of payments) {
        if (!isCashMethod(p.method)) continue;
        if (p.type === "REFUND") cashRefundsTotal += p.amount;
        else cashCollected += p.amount;
    }
    for (const e of expenses) {
        if (isCashMethod(e.method)) cashExpensesTotal += e.amount;
    }
    return { cashCollected, cashRefundsTotal, cashExpensesTotal };
}

export function isDayLockedByClosingStatus(status: string | null | undefined): boolean {
    return status === "APPROVED";
}

export interface AgingBuckets {
    bucket0_30: number;
    bucket31_60: number;
    bucket61_90: number;
    bucket90Plus: number;
    total: number;
}

export function computeAgingBuckets(
    items: Array<{ balance: number; ageDays: number }>
): AgingBuckets {
    const out: AgingBuckets = { bucket0_30: 0, bucket31_60: 0, bucket61_90: 0, bucket90Plus: 0, total: 0 };
    for (const item of items) {
        if (item.balance <= 0) continue;
        out.total += item.balance;
        if (item.ageDays <= 30) out.bucket0_30 += item.balance;
        else if (item.ageDays <= 60) out.bucket31_60 += item.balance;
        else if (item.ageDays <= 90) out.bucket61_90 += item.balance;
        else out.bucket90Plus += item.balance;
    }
    return out;
}
