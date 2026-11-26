import { requireRole } from "@/lib/auth/permissions";
import { listStaffAccounts } from "@/lib/services/staffAccounts";
import StaffAccountsPanel from "@/features/operations/StaffAccountsPanel";

export default async function AdminStaffPage() {
    await requireRole(["ADMIN"], { callbackUrl: "/admin/staff" });

    const rows = await listStaffAccounts();
    const initialStaff = rows.map((r) => ({
        id: r.id,
        name: r.name,
        email: r.email,
        phone: r.phone,
        role: r.role === "ADMIN" ? ("ADMIN" as const) : ("STAFF" as const),
        isActive: r.isActive,
        mustChangePassword: r.mustChangePassword,
        createdAt: r.createdAt.toISOString(),
    }));

    return <StaffAccountsPanel initialStaff={initialStaff} />;
}
