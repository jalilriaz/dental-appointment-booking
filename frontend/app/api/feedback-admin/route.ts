import { NextResponse } from "next/server";
import { z } from "zod";
import { requireActionRole } from "@/lib/auth/permissions";
import { getFeedbackDashboardData, sendFeedbackCollectionInvite } from "@/lib/services/feedbackAdmin";

// Required role: ADMIN or STAFF
export async function GET() {
    const auth = await requireActionRole(["ADMIN", "STAFF"]);
    if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
    const data = await getFeedbackDashboardData();
    return NextResponse.json(data);
}

// Required role: ADMIN or STAFF (send post-visit feedback invite for completed appointment)
export async function POST(req: Request) {
    const auth = await requireActionRole(["ADMIN", "STAFF"]);
    if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const parsed = z.object({ appointmentId: z.string().uuid() }).safeParse(await req.json().catch(() => ({})));
    if (!parsed.success) return NextResponse.json({ error: "Appointment ID required." }, { status: 400 });

    try {
        const log = await sendFeedbackCollectionInvite(parsed.data.appointmentId, auth.user.id);
        return NextResponse.json({ status: log.status });
    } catch (err) {
        return NextResponse.json({ error: err instanceof Error ? err.message : "Invite failed" }, { status: 400 });
    }
}
