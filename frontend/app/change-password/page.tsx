import { requireRole } from "@/lib/auth/permissions";
import ChangePasswordForm from "@/features/auth/ChangePasswordForm";

export default async function ChangePasswordPage() {
    const user = await requireRole(["ADMIN", "STAFF"], {
        callbackUrl: "/change-password",
        allowPasswordChange: true,
    });

    return <ChangePasswordForm userName={user.name} forced={Boolean(user.mustChangePassword)} />;
}
