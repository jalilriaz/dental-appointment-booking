import { requireRole } from "@/lib/auth/permissions";
import { getKarachiDateKey } from "@/lib/format";
import { getDailyClosingPreview } from "@/lib/services/dailyClosing";
import { getClosingHistory, getDaysNotClosed } from "@/lib/data/closingReports";
import ClosingView from "@/features/closing/ClosingView";

export default async function AdminClosingPage() {
    await requireRole(["ADMIN"], { callbackUrl: "/admin/closing" });
    const todayKey = getKarachiDateKey(new Date());
    const [preview, history, daysNotClosed] = await Promise.all([
        getDailyClosingPreview(todayKey),
        getClosingHistory("daily"),
        getDaysNotClosed(),
    ]);

    return (
        <ClosingView
            role="ADMIN"
            initialPreview={preview}
            initialDaily={history.daily}
            initialAggregated={history.aggregated}
            initialDaysNotClosed={daysNotClosed}
        />
    );
}
