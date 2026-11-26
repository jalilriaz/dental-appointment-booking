import { requireRole } from "@/lib/auth/permissions";
import { loadWaitlistBundle } from "@/lib/data/polishData";
import WaitlistPanel from "@/features/polish/WaitlistPanel";

export default async function AdminWaitlistPage() {
    await requireRole(["ADMIN"], { callbackUrl: "/admin/waitlist" });
    const bundle = await loadWaitlistBundle();
    return <WaitlistPanel initialEntries={bundle.entries} treatments={bundle.treatments} />;
}
