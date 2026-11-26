import { NextResponse } from "next/server";
import { requireActionRole } from "@/lib/auth/permissions";
import { feedbackAdminUpdateSchema } from "@/lib/validations/polish";
import { updateFeedbackEntry } from "@/lib/services/feedbackAdmin";

// Required role: ADMIN (publish/unpublish review or add clinic response)
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const auth = await requireActionRole(["ADMIN"]);
    if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const { id } = await params;
    const parsed = feedbackAdminUpdateSchema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ error: "Invalid feedback update." }, { status: 400 });

    const feedback = await updateFeedbackEntry(id, parsed.data, auth.user.id);
    return NextResponse.json({ feedback });
}
