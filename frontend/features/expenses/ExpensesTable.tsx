"use client";

import EditOutlined from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlined from "@mui/icons-material/DeleteOutlineOutlined";
import LockOutlined from "@mui/icons-material/LockOutlined";
import { formatKarachiDate, formatPKR } from "@/lib/format";
import { getExpenseCategoryLabel, getPaymentMethodLabel } from "@/lib/constants/payment-methods";
import type { ExpenseRow } from "./types";

interface ExpensesTableProps {
    rows: ExpenseRow[];
    onEdit: (row: ExpenseRow) => void;
    onDelete: (row: ExpenseRow) => void;
}

export default function ExpensesTable({ rows, onEdit, onDelete }: ExpensesTableProps) {
    return (
        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50/90 border-b border-slate-200/80 text-slate-500 font-semibold">
                        <tr>
                            <th className="px-4 py-3">Date</th>
                            <th className="px-4 py-3">Expense</th>
                            <th className="px-4 py-3">Category</th>
                            <th className="px-4 py-3">Method</th>
                            <th className="px-4 py-3 text-right">Amount</th>
                            <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {rows.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="py-10 text-center text-slate-500">
                                    No expenses recorded for the selected filters.
                                </td>
                            </tr>
                        ) : rows.map((row) => (
                            <tr key={row.id} className="hover:bg-slate-50/60 transition-colors">
                                <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                                    {formatKarachiDate(row.expenseDate, "medium")}
                                </td>
                                <td className="px-4 py-3">
                                    <p className="font-semibold text-slate-900">{row.title}</p>
                                    {(row.vendor || row.notes) && (
                                        <p className="text-[11px] text-slate-500 truncate max-w-xs">
                                            {[row.vendor, row.notes].filter(Boolean).join(" · ")}
                                        </p>
                                    )}
                                </td>
                                <td className="px-4 py-3">
                                    <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                                        {getExpenseCategoryLabel(row.category)}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-slate-700 whitespace-nowrap">
                                    {getPaymentMethodLabel(row.method)}
                                </td>
                                <td className="px-4 py-3 text-right font-bold text-slate-900 whitespace-nowrap">
                                    {formatPKR(row.amount)}
                                </td>
                                <td className="px-4 py-3 text-right whitespace-nowrap">
                                    {row.isDayLocked ? (
                                        <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 font-medium" title="Day closed and locked">
                                            <LockOutlined sx={{ fontSize: 14 }} /> Locked
                                        </span>
                                    ) : (
                                        <div className="inline-flex items-center gap-1">
                                            <button type="button" onClick={() => onEdit(row)} aria-label={`Edit ${row.title}`} className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 cursor-pointer">
                                                <EditOutlined sx={{ fontSize: 15 }} />
                                            </button>
                                            <button type="button" onClick={() => onDelete(row)} aria-label={`Delete ${row.title}`} className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 cursor-pointer">
                                                <DeleteOutlineOutlined sx={{ fontSize: 15 }} />
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
