import { NextResponse } from "next/server";
import { requireActionRole } from "@/lib/auth/permissions";
import { patientEditSchema } from "@/lib/validations/clinical-records";
import {
    archivePatientAccount,
    restorePatientAccount,
    updatePatientProfile,
} from "@/lib/services/patientLifecycle";

// Required role: ADMIN or STAFF (edit profile, medications, allergies)
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const auth = await requireActionRole(["ADMIN", "STAFF"]);
    if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

    try {
        const { id } = await params;
        const body = await req.json();
        const parsed = patientEditSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { error: parsed.error.issues[0]?.message || "Invalid patient details." },
                { status: 400 }
            );
        }
        const patient = await updatePatientProfile(id, parsed.data, auth.user.id);
        return NextResponse.json({ patient });
    } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to update patient";
        return NextResponse.json({ error: msg }, { status: 400 });
    }
}

// Required role: ADMIN (archive blocked if unpaid balance or upcoming appointments exist)
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
    const auth = await requireActionRole(["ADMIN"]);
    if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

    try {
        const { id } = await params;
        const res = await archivePatientAccount(id, auth.user.id);
        if (!res.ok) {
            return NextResponse.json(res, { status: res.status });
        }
        return NextResponse.json({ success: true });
    } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to archive patient";
        return NextResponse.json({ error: msg }, { status: 500 });
    }
}

// Required role: ADMIN or STAFF (restore an archived patient matching duplicate phone)
export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
    const auth = await requireActionRole(["ADMIN", "STAFF"]);
    if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

    try {
        const { id } = await params;
        const patient = await restorePatientAccount(id, auth.user.id);
        return NextResponse.json({ success: true, patient });
    } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to restore patient";
        return NextResponse.json({ error: msg }, { status: 400 });
    }
}
