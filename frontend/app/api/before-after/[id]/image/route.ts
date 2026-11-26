import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerUser } from "@/lib/auth/permissions";
import { readSecureBlob } from "@/lib/services/secureFiles";

// Public only when hasConsent=true AND showOnWeb=true; otherwise requires ADMIN
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const side = new URL(req.url).searchParams.get("side") === "before" ? "before" : "after";
        const photo = await prisma.beforeAfterPhoto.findUnique({ where: { id } });
        if (!photo) return NextResponse.json({ error: "Photo not found." }, { status: 404 });

        const isPubliclyVisible = photo.hasConsent && photo.showOnWeb;
        if (!isPubliclyVisible) {
            const user = await getServerUser();
            if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            if (user.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const storageName = side === "before" ? photo.beforeImagePath : photo.afterImagePath;
        const buffer = await readSecureBlob(storageName);
        const mimeType = storageName.endsWith(".png")
            ? "image/png"
            : storageName.endsWith(".webp")
              ? "image/webp"
              : "image/jpeg";

        return new NextResponse(new Uint8Array(buffer), {
            status: 200,
            headers: {
                "Content-Type": mimeType,
                "X-Content-Type-Options": "nosniff",
                "Cache-Control": isPubliclyVisible ? "public, max-age=300" : "private, no-store",
            },
        });
    } catch {
        return NextResponse.json({ error: "Failed to load image." }, { status: 500 });
    }
}
