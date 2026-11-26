export interface ExpenseRow {
    id: string;
    title: string;
    category: string;
    amount: number;
    method: string;
    expenseDate: string;
    vendor: string | null;
    notes: string | null;
    isDayLocked: boolean;
    recordedBy?: { id: string; name: string } | null;
}
