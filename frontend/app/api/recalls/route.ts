import { NextResponse } from "next/server";
import { z } from "zod";
import { requireActionRole } from "@/lib/auth/permissions";
import {
    getRecallDashboardData,
    setPatientRecallOptOut,
    triggerRecallNotifications,
} from "@/lib/services/recalls";

// Required role: ADMIN
export async function GET() {
    const auth = await requireActionRole(["ADMIN"]);
    if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
    const data = await getRecallDashboardData();
    return NextResponse.json(data);
}

// Required role: ADMIN (sends 6-month recall via n8n webhook, blocking night sends in Asia/Karachi)
export async function POST(req: Request) {
    const auth = await requireActionRole(["ADMIN"]);
    if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const body = await req.json().catch(() => ({}));
    const parsed = z.object({ patientIds: z.array(z.string().uuid()).min(1) }).safeParse(body);
    if (!parsed.success) {
        return NextResponse.json({ error: "Select at least one patient." }, { status: 400 });
    }

    const res = await triggerRecallNotifications(parsed.data.patientIds, auth.user.id);
    return NextResponse.json(res);
}

// Required role: ADMIN (toggle patient opt-out)
export async function PATCH(req: Request) {
    const auth = await requireActionRole(["ADMIN"]);
    if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const parsed = z.object({ patientId: z.string().uuid(), optOut: z.boolean() }).safeParse(await req.json().catch(() => ({})));
    if (!parsed.success) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

    await setPatientRecallOptOut(parsed.data.patientId, parsed.data.optOut, auth.user.id);
    return NextResponse.json({ success: true });
}
