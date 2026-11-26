import { requireRole } from "@/lib/auth/permissions";
import { getDashboardData } from "@/lib/data/dashboard";
import ClinicDashboard from "@/features/dashboard/ClinicDashboard";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
    await requireRole(["ADMIN"], { callbackUrl: "/admin" });
    const data = await getDashboardData("ADMIN");
    return <ClinicDashboard data={data} />;
}
