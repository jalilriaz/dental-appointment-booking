export interface ClosingPreviewData {
    dateKey: string;
    defaultOpeningCash: number;
    openingCash: number;
    expectedCash: number;
    totals: {
        cashCollected: number;
        cardCollected: number;
        onlineCollected: number;
        bankTransferCollected: number;
        jazzcashCollected: number;
        easypaisaCollected: number;
        refundsTotal: number;
        cashRefundsTotal: number;
        expensesTotal: number;
        cashExpensesTotal: number;
    };
    closing: {
        id: string;
        closingDate: string;
        openingCash: number;
        openingNote: string | null;
        expectedCash: number;
        actualCash: number;
        variance: number;
        status: "SUBMITTED" | "APPROVED" | "REOPENED";
        notes: string | null;
        reopenReason: string | null;
        submittedBy?: { name: string } | null;
        approvedBy?: { name: string } | null;
        reopenedBy?: { name: string } | null;
    } | null;
}

export interface ClosingDailyRow {
    id: string;
    dateKey: string;
    status: string;
    openingCash: number;
    collected: number;
    cashCollected: number;
    refunds: number;
    expenses: number;
    expectedCash: number;
    actualCash: number;
    variance: number;
    submittedByName: string | null;
    approvedByName: string | null;
}

export interface ClosingAggregateRow {
    period: string;
    collected: number;
    refunds: number;
    expenses: number;
    variance: number;
    daysClosed: number;
}

export interface DaysNotClosedItem {
    dateKey: string;
    paymentsCount: number;
    expensesCount: number;
    netCashFlow: number;
}
