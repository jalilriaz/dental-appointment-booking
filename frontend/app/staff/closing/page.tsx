import { requireRole } from "@/lib/auth/permissions";
import { getKarachiDateKey } from "@/lib/format";
import { getDailyClosingPreview } from "@/lib/services/dailyClosing";
import ClosingView from "@/features/closing/ClosingView";

export default async function StaffClosingPage() {
    await requireRole(["ADMIN", "STAFF"], { callbackUrl: "/staff/closing" });
    const todayKey = getKarachiDateKey(new Date());
    const preview = await getDailyClosingPreview(todayKey);
    return <ClosingView role="STAFF" initialPreview={preview} />;
}
