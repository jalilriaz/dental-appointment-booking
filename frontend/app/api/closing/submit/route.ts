import { NextResponse } from "next/server";
import { requireActionRole } from "@/lib/auth/permissions";
import { getKarachiDateKey } from "@/lib/format";
import { dailyClosingSubmitSchema } from "@/lib/validations/billing";
import { getDailyClosingPreview, submitDailyClosingCount } from "@/lib/services/dailyClosing";

// Required role: ADMIN or STAFF
export async function GET(req: Request) {
    const auth = await requireActionRole(["ADMIN", "STAFF"]);
    if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const dateKey = new URL(req.url).searchParams.get("date") || getKarachiDateKey(new Date());
    const preview = await getDailyClosingPreview(dateKey);
    return NextResponse.json(preview);
}

// Required role: ADMIN or STAFF
export async function POST(req: Request) {
    const auth = await requireActionRole(["ADMIN", "STAFF"]);
    if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

    try {
        const body = await req.json();
        const parsed = dailyClosingSubmitSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { error: parsed.error.issues[0]?.message || "Invalid cash count payload." },
                { status: 400 }
            );
        }
        const closing = await submitDailyClosingCount({ ...parsed.data, userId: auth.user.id });
        return NextResponse.json({ closing });
    } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to submit cash count";
        const status = msg.includes("already approved") ? 409 : 400;
        return NextResponse.json({ error: msg }, { status });
    }
}
