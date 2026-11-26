import { NextResponse } from "next/server";
import { requireActionRole } from "@/lib/auth/permissions";
import { buildClinicBackupSnapshot } from "@/lib/services/clinicBackup";
import { getKarachiDateKey } from "@/lib/format";

// Required role: ADMIN (exports full clinic operational snapshot excluding credentials/tokens)
export async function GET() {
    const auth = await requireActionRole(["ADMIN"]);
    if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const snapshot = await buildClinicBackupSnapshot(auth.user.id);
    const fileDate = getKarachiDateKey(new Date());

    return new NextResponse(JSON.stringify(snapshot, null, 2), {
        status: 200,
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Content-Disposition": `attachment; filename="elite-dental-backup-${fileDate}.json"`,
            "Cache-Control": "private, no-store, max-age=0",
        },
    });
}
