import { NextResponse } from "next/server";
import { requireActionRole } from "@/lib/auth/permissions";
import { doctorAvailabilitySchema } from "@/lib/validations/operations";
import {
    getDoctorAvailabilityWithAffected,
    notifyAffectedLeavePatients,
    updateDoctorLeave,
} from "@/lib/services/doctorLeave";

// Required role: ADMIN
export async function GET() {
    const auth = await requireActionRole(["ADMIN"]);
    if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });
    const data = await getDoctorAvailabilityWithAffected();
    return NextResponse.json(data);
}

// Required role: ADMIN (updates Doctor.isActive or planned unavailable range)
export async function PATCH(req: Request) {
    const auth = await requireActionRole(["ADMIN"]);
    if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

    try {
        const body = await req.json();
        const parsed = doctorAvailabilitySchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { error: parsed.error.issues[0]?.message || "Invalid availability payload." },
                { status: 400 }
            );
        }
        const data = await updateDoctorLeave(parsed.data, auth.user.id);
        return NextResponse.json(data);
    } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to update availability";
        return NextResponse.json({ error: msg }, { status: 400 });
    }
}

// Required role: ADMIN (one-click notification dispatch to affected upcoming appointments)
export async function POST() {
    const auth = await requireActionRole(["ADMIN"]);
    if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

    try {
        const result = await notifyAffectedLeavePatients(auth.user.id);
        return NextResponse.json(result);
    } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to notify affected patients";
        return NextResponse.json({ error: msg }, { status: 500 });
    }
}
