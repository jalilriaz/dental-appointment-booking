import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/auth";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const cookie = (await cookies()).get("session")?.value;
        if (!cookie) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const session = await decrypt(cookie);
        const userId = session.id as string;
        const { id } = await params;

        // Ensure notification belongs to user
        // const notification = await prisma.notification.findFirst({
        //     where: { id, userId },
        // });

        // if (!notification) {
        //     return NextResponse.json({ error: "Not found" }, { status: 404 });
        // }

        // const updated = await prisma.notification.update({
        //     where: { id },
        //     data: { read: true },
        // });

        return NextResponse.json({ success: true, notification: null });

    } catch (error) {
        console.error("Update notification error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
