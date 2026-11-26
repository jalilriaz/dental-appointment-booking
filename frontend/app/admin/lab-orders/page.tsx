import { requireRole } from "@/lib/auth/permissions";
import { loadLabOrdersBundle } from "@/lib/data/polishData";
import LabOrdersPanel from "@/features/polish/LabOrdersPanel";

export default async function AdminLabOrdersPage() {
    await requireRole(["ADMIN"], { callbackUrl: "/admin/lab-orders" });
    const bundle = await loadLabOrdersBundle(true);
    return <LabOrdersPanel initialOrders={bundle.orders} patients={bundle.patients} isAdmin />;
}
