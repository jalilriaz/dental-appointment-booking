import { requireRole } from "@/lib/auth/permissions";
import { loadLabOrdersBundle } from "@/lib/data/polishData";
import LabOrdersPanel from "@/features/polish/LabOrdersPanel";

export default async function StaffLabOrdersPage() {
    await requireRole(["ADMIN", "STAFF"], { callbackUrl: "/staff/lab-orders" });
    const bundle = await loadLabOrdersBundle(false);
    return <LabOrdersPanel initialOrders={bundle.orders} patients={[]} isAdmin={false} />;
}
