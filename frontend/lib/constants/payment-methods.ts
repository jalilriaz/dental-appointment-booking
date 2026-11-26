export type PaymentMethodValue =
    | "CASH"
    | "CARD"
    | "BANK_TRANSFER"
    | "JAZZCASH"
    | "EASYPAISA"
    | "ONLINE";

export type PaymentIconKey = "cash" | "card" | "bank" | "phone" | "wallet" | "globe";

export interface PaymentMethodMeta {
    value: PaymentMethodValue;
    label: string;
    shortLabel: string;
    icon: PaymentIconKey;
    countsAsCash: boolean;
    selectable: boolean;
}

export const PAYMENT_METHODS: Record<PaymentMethodValue, PaymentMethodMeta> = {
    CASH: { value: "CASH", label: "Cash", shortLabel: "Cash", icon: "cash", countsAsCash: true, selectable: true },
    CARD: { value: "CARD", label: "Card / POS", shortLabel: "Card", icon: "card", countsAsCash: false, selectable: true },
    BANK_TRANSFER: { value: "BANK_TRANSFER", label: "Bank Transfer", shortLabel: "Bank", icon: "bank", countsAsCash: false, selectable: true },
    JAZZCASH: { value: "JAZZCASH", label: "JazzCash", shortLabel: "JazzCash", icon: "phone", countsAsCash: false, selectable: true },
    EASYPAISA: { value: "EASYPAISA", label: "EasyPaisa", shortLabel: "EasyPaisa", icon: "wallet", countsAsCash: false, selectable: true },
    ONLINE: { value: "ONLINE", label: "Online (Legacy)", shortLabel: "Online", icon: "globe", countsAsCash: false, selectable: false },
};

export const ALL_PAYMENT_METHODS = Object.values(PAYMENT_METHODS);
export const SELECTABLE_PAYMENT_METHODS = ALL_PAYMENT_METHODS.filter((m) => m.selectable);

export function getPaymentMethodMeta(method: string | null | undefined): PaymentMethodMeta {
    const key = (method || "CASH").toUpperCase() as PaymentMethodValue;
    return PAYMENT_METHODS[key] || PAYMENT_METHODS.CASH;
}

export function getPaymentMethodLabel(method: string | null | undefined): string {
    return getPaymentMethodMeta(method).label;
}

export function isCashMethod(method: string | null | undefined): boolean {
    return getPaymentMethodMeta(method).countsAsCash;
}

export type ExpenseCategoryValue =
    | "RENT"
    | "UTILITIES"
    | "SUPPLIES"
    | "LAB_FEES"
    | "SALARY"
    | "MAINTENANCE"
    | "EQUIPMENT"
    | "MARKETING"
    | "OTHER";

export const EXPENSE_CATEGORIES: { value: ExpenseCategoryValue; label: string }[] = [
    { value: "RENT", label: "Rent" },
    { value: "UTILITIES", label: "Utilities" },
    { value: "SUPPLIES", label: "Supplies" },
    { value: "LAB_FEES", label: "Lab fees" },
    { value: "SALARY", label: "Salaries" },
    { value: "MAINTENANCE", label: "Maintenance" },
    { value: "EQUIPMENT", label: "Equipment" },
    { value: "MARKETING", label: "Marketing" },
    { value: "OTHER", label: "Other" },
];

export function getExpenseCategoryLabel(category: string | null | undefined): string {
    const found = EXPENSE_CATEGORIES.find((c) => c.value === category);
    return found ? found.label : "Other";
}
