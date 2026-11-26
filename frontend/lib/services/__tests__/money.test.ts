import test from "node:test";
import assert from "node:assert/strict";
import {
    validateRefundEligibility,
    calculatePlanFinancialState,
    calculateCashBasisProfit,
    calculateExpectedCash,
    summarizeCashTransactions,
    isDayLockedByClosingStatus,
    computeAgingBuckets,
} from "../moneyMath";
import { buildCsvDocument, escapeCsvCell } from "../csvExport";

test("refund limit rejects over-refund and allows exact remaining refundable", () => {
    const tooHigh = validateRefundEligibility({
        originalType: "PAYMENT",
        originalAmount: 10000,
        priorRefundedTotal: 4000,
        requestedAmount: 6500,
    });
    assert.equal(tooHigh.ok, false);
    assert.equal(tooHigh.maxRefundable, 6000);

    const exact = validateRefundEligibility({
        originalType: "PAYMENT",
        originalAmount: 10000,
        priorRefundedTotal: 4000,
        requestedAmount: 6000,
    });
    assert.equal(exact.ok, true);

    const zeroReq = validateRefundEligibility({
        originalType: "PAYMENT",
        originalAmount: 10000,
        priorRefundedTotal: 0,
        requestedAmount: 0,
    });
    assert.equal(zeroReq.ok, false);

    const targetingRefund = validateRefundEligibility({
        originalType: "REFUND",
        originalAmount: 5000,
        priorRefundedTotal: 0,
        requestedAmount: 1000,
    });
    assert.equal(targetingRefund.ok, false);
});

test("plan balance and financialStatus update cleanly after refund", () => {
    const partial = calculatePlanFinancialState(20000, [
        { amount: 20000, type: "PAYMENT" },
        { amount: 5000, type: "REFUND" },
    ]);
    assert.equal(partial.netPaid, 15000);
    assert.equal(partial.remainingBalance, 5000);
    assert.equal(partial.financialStatus, "PARTIALLY_PAID");

    const fullRefund = calculatePlanFinancialState(20000, [
        { amount: 20000, type: "PAYMENT" },
        { amount: 20000, type: "REFUND" },
    ]);
    assert.equal(fullRefund.netPaid, 0);
    assert.equal(fullRefund.remainingBalance, 20000);
    assert.equal(fullRefund.financialStatus, "UNPAID");
});

test("cash-basis profit equals payments minus refunds minus expenses", () => {
    const result = calculateCashBasisProfit({
        paymentsTotal: 150000,
        refundsTotal: 12000,
        expensesTotal: 38000,
    });
    assert.equal(result.netRevenue, 138000);
    assert.equal(result.profit, 100000);
});

test("expected cash includes only CASH methods and ignores JazzCash/Card/Bank", () => {
    const summary = summarizeCashTransactions(
        [
            { amount: 12000, type: "PAYMENT", method: "CASH" },
            { amount: 8000, type: "PAYMENT", method: "JAZZCASH" },
            { amount: 15000, type: "PAYMENT", method: "BANK_TRANSFER" },
            { amount: 2000, type: "REFUND", method: "CASH" },
            { amount: 3000, type: "REFUND", method: "EASYPAISA" },
        ],
        [
            { amount: 1500, method: "CASH" },
            { amount: 5000, method: "CARD" },
        ]
    );
    assert.deepEqual(summary, { cashCollected: 12000, cashRefundsTotal: 2000, cashExpensesTotal: 1500 });
    const expected = calculateExpectedCash({ openingCash: 5000, ...summary });
    assert.equal(expected, 13500);
});

test("day-closing lock applies only when APPROVED", () => {
    assert.equal(isDayLockedByClosingStatus("APPROVED"), true);
    assert.equal(isDayLockedByClosingStatus("SUBMITTED"), false);
    assert.equal(isDayLockedByClosingStatus("REOPENED"), false);
    assert.equal(isDayLockedByClosingStatus(null), false);
});

test("CSV escaping neutralizes formula injection and preserves commas/quotes", () => {
    assert.equal(escapeCsvCell("=CMD('calc')"), "'=CMD('calc')");
    assert.equal(escapeCsvCell("+SUM(A1:A2)"), "'+SUM(A1:A2)");
    assert.equal(escapeCsvCell("-100+200"), "'-100+200");
    assert.equal(escapeCsvCell("@evil"), "'@evil");
    assert.equal(escapeCsvCell('Ahmed, "Ali"'), '"Ahmed, ""Ali"""');
    const doc = buildCsvDocument(["Patient", "Note"], [["=1+1", 'Cash, "Full"']]);
    assert.equal(doc, 'Patient,Note\r\n\'=1+1,"Cash, ""Full"""');
});

test("aging buckets partition unpaid balances cleanly", () => {
    const aging = computeAgingBuckets([
        { balance: 5000, ageDays: 10 },
        { balance: 7000, ageDays: 45 },
        { balance: 9000, ageDays: 75 },
        { balance: 12000, ageDays: 120 },
    ]);
    assert.deepEqual(aging, {
        bucket0_30: 5000,
        bucket31_60: 7000,
        bucket61_90: 9000,
        bucket90Plus: 12000,
        total: 33000,
    });
});
