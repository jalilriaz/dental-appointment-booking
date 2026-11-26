import { requireRole } from "@/lib/auth/permissions";
import { getFeedbackDashboardData } from "@/lib/services/feedbackAdmin";
import FeedbackPanel from "@/features/polish/FeedbackPanel";

export default async function AdminFeedbackPage() {
    await requireRole(["ADMIN"], { callbackUrl: "/admin/feedback" });
    const data = await getFeedbackDashboardData();
    return <FeedbackPanel initialReviews={data.reviews} initialPending={data.pendingRequests} isAdmin />;
}
