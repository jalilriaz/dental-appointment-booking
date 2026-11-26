import { NextResponse } from "next/server";
import { requireActionRole } from "@/lib/auth/permissions";
import { fetchPatientFileWithAudit } from "@/lib/services/secureFiles";

// Required role: ADMIN (STAFF and unauthenticated requests are rejected with 403/401)
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const auth = await requireActionRole(["ADMIN"]);
    if (!auth.ok) {
        return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    try {
        const { id } = await params;
        const isDownload = new URL(req.url).searchParams.get("download") === "1";
        const result = await fetchPatientFileWithAudit(
            id,
            auth.user.id,
            isDownload ? "download" : "view"
        );
        if (!result) {
            return NextResponse.json({ error: "File not found." }, { status: 404 });
        }

        const safeTitle = result.file.title.replace(/[^a-zA-Z0-9._-]/g, "_");
        const ext = result.file.mimeType === "application/pdf"
            ? "pdf"
            : result.file.mimeType.split("/")[1] || "bin";

        return new NextResponse(new Uint8Array(result.buffer), {
            status: 200,
            headers: {
                "Content-Type": result.file.mimeType,
                "Content-Disposition": `${isDownload ? "attachment" : "inline"}; filename="${safeTitle}.${ext}"`,
                "X-Content-Type-Options": "nosniff",
                "Cache-Control": "private, no-store, max-age=0",
            },
        });
    } catch {
        return NextResponse.json({ error: "Failed to read secure file." }, { status: 500 });
    }
}
