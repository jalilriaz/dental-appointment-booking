import { requireRole } from "@/lib/auth/permissions";
import { getDashboardData } from "@/lib/data/dashboard";
import ClinicDashboard from "@/features/dashboard/ClinicDashboard";

export const dynamic = "force-dynamic";

export default async function StaffDashboard() {
    await requireRole(["ADMIN", "STAFF"], { callbackUrl: "/staff" });
    const data = await getDashboardData("STAFF");
    return <ClinicDashboard data={data} />;
}
