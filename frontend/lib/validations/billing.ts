import { z } from "zod";

export const paymentMethodEnum = z.enum([
    "CASH",
    "CARD",
    "ONLINE",
    "BANK_TRANSFER",
    "JAZZCASH",
    "EASYPAISA",
]);

export const paymentTypeEnum = z.enum(["PAYMENT", "REFUND"]);

export const expenseCategoryEnum = z.enum([
    "RENT",
    "SUPPLIES",
    "LAB_FEES",
    "UTILITIES",
    "SALARY",
    "MAINTENANCE",
    "EQUIPMENT",
    "MARKETING",
    "OTHER",
]);

export const refundSchema = z.object({
    refundedPaymentId: z.string().uuid("Original payment ID is required"),
    amount: z.coerce.number().int().positive("Refund amount must be greater than 0"),
    method: paymentMethodEnum.default("CASH"),
    notes: z.string().trim().min(3, "Reason for refund is required").max(500),
});

export const expenseSchema = z.object({
    title: z.string().trim().min(2, "Expense title is required").max(120),
    category: expenseCategoryEnum.default("SUPPLIES"),
    amount: z.coerce.number().int().positive("Expense amount must be positive"),
    method: paymentMethodEnum.default("CASH"),
    expenseDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Valid YYYY-MM-DD date required"),
    vendor: z.string().trim().max(120).optional().nullable(),
    notes: z.string().trim().max(500).optional().nullable(),
});

export const dailyClosingSubmitSchema = z.object({
    dateKey: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Valid YYYY-MM-DD date required"),
    openingCash: z.coerce.number().int().min(0, "Opening cash cannot be negative").default(0),
    openingNote: z.string().trim().max(300).optional().nullable(),
    actualCash: z.coerce.number().int().min(0, "Counted cash cannot be negative"),
    notes: z.string().trim().max(500).optional().nullable(),
});

export const reopenClosingSchema = z.object({
    dateKey: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Valid YYYY-MM-DD date required"),
    reason: z.string().trim().min(3, "Reopen reason is required").max(400),
});

export type RefundInput = z.infer<typeof refundSchema>;
export type ExpenseInput = z.infer<typeof expenseSchema>;
export type DailyClosingSubmitInput = z.infer<typeof dailyClosingSubmitSchema>;
export type ReopenClosingInput = z.infer<typeof reopenClosingSchema>;
