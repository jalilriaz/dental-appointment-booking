import { requireRole } from "@/lib/auth/permissions";
import { listExpenses } from "@/lib/services/expenses";
import ExpensesView from "@/features/expenses/ExpensesView";

export default async function AdminExpensesPage() {
    await requireRole(["ADMIN"], { callbackUrl: "/admin/expenses" });
    const expenses = await listExpenses();
    return <ExpensesView initialExpenses={expenses} />;
}
