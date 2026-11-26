import { requireRole } from "@/lib/auth/permissions";
import { getRecallDashboardData } from "@/lib/services/recalls";
import RecallsPanel from "@/features/operations/RecallsPanel";

export default async function AdminRecallsPage() {
    await requireRole(["ADMIN"], { callbackUrl: "/admin/recalls" });
    const data = await getRecallDashboardData();
    return <RecallsPanel initialData={data} />;
}
