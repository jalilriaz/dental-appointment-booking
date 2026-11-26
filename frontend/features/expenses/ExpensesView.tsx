"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import AddOutlined from "@mui/icons-material/AddOutlined";
import ReceiptLongOutlined from "@mui/icons-material/ReceiptLongOutlined";
import PaymentsOutlined from "@mui/icons-material/PaymentsOutlined";
import CategoryOutlined from "@mui/icons-material/CategoryOutlined";
import { ConfirmDialog, FilterBar, PageHeader, SearchInput, StatCard } from "@/components/admin/shared";
import { EXPENSE_CATEGORIES, isCashMethod } from "@/lib/constants/payment-methods";
import { formatPKR } from "@/lib/format";
import ExpenseFormDialog from "./ExpenseFormDialog";
import ExpensesTable from "./ExpensesTable";
import type { ExpenseRow } from "./types";

export default function ExpensesView({ initialExpenses }: { initialExpenses: ExpenseRow[] }) {
    const [rows, setRows] = useState<ExpenseRow[]>(initialExpenses);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("ALL");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editing, setEditing] = useState<ExpenseRow | null>(null);
    const [deleting, setDeleting] = useState<ExpenseRow | null>(null);
    const [busyDelete, setBusyDelete] = useState(false);

    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        return rows.filter((r) => {
            if (category !== "ALL" && r.category !== category) return false;
            if (!q) return true;
            return (
                r.title.toLowerCase().includes(q) ||
                (r.vendor || "").toLowerCase().includes(q) ||
                (r.notes || "").toLowerCase().includes(q)
            );
        });
    }, [rows, search, category]);

    const totals = useMemo(() => {
        let total = 0;
        let cashTotal = 0;
        for (const r of filtered) {
            total += r.amount;
            if (isCashMethod(r.method)) cashTotal += r.amount;
        }
        return { total, cashTotal, count: filtered.length };
    }, [filtered]);

    const confirmDelete = async () => {
        if (!deleting) return;
        setBusyDelete(true);
        try {
            const res = await fetch(`/api/expenses/${deleting.id}`, { method: "DELETE" });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Delete failed");
            setRows((prev) => prev.filter((r) => r.id !== deleting.id));
            toast.success("Expense deleted");
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to delete expense");
        } finally {
            setBusyDelete(false);
            setDeleting(null);
        }
    };

    return (
        <div className="space-y-5">
            <PageHeader
                title="Clinic expenses"
                subtitle="Track operational bills, lab fees, supplies, and cash outlays"
                actions={
                    <button
                        type="button"
                        onClick={() => { setEditing(null); setDialogOpen(true); }}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold cursor-pointer"
                    >
                        <AddOutlined sx={{ fontSize: 16 }} />
                        <span>Add expense</span>
                    </button>
                }
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard label="Filtered expenses" value={formatPKR(totals.total)} subtext="Across selected filters" icon={<ReceiptLongOutlined sx={{ fontSize: 18 }} />} />
                <StatCard label="Cash expenses" value={formatPKR(totals.cashTotal)} subtext="Deducted from drawer cash" icon={<PaymentsOutlined sx={{ fontSize: 18 }} />} />
                <StatCard label="Entries shown" value={totals.count} subtext="Approved closing days are locked" icon={<CategoryOutlined sx={{ fontSize: 18 }} />} />
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-3">
                <SearchInput value={search} onChange={setSearch} placeholder="Search title, vendor, note..." className="sm:w-72" />
                <FilterBar
                    value={category}
                    onChange={setCategory}
                    options={[{ value: "ALL", label: "All categories" }, ...EXPENSE_CATEGORIES]}
                />
            </div>

            <ExpensesTable
                rows={filtered}
                onEdit={(row) => { setEditing(row); setDialogOpen(true); }}
                onDelete={setDeleting}
            />

            <ExpenseFormDialog
                open={dialogOpen}
                editing={editing}
                onOpenChange={setDialogOpen}
                onSaved={(row, isNew) =>
                    setRows((prev) => (isNew ? [row, ...prev] : prev.map((x) => (x.id === row.id ? row : x))))
                }
            />

            <ConfirmDialog
                open={Boolean(deleting)}
                onOpenChange={(open) => !open && setDeleting(null)}
                title="Delete expense?"
                description={`Delete "${deleting?.title || ""}" (${deleting ? formatPKR(deleting.amount) : ""})? This action is written to the audit log.`}
                confirmLabel="Delete expense"
                variant="danger"
                loading={busyDelete}
                onConfirm={confirmDelete}
            />
        </div>
    );
}
