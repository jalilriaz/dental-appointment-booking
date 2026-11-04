import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/auth";

// PATCH: Update inventory item (Admin only)
export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const cookie = (await cookies()).get("session")?.value;
        if (!cookie) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const session = await decrypt(cookie);
        if (session.role !== "ADMIN") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const { id } = await params;
        const body = await request.json();
        const { itemName, quantity, minThreshold } = body;

        const item = await prisma.inventory.update({
            where: { id },
            data: {
                itemName: itemName?.trim() || undefined,
                quantity: quantity !== undefined ? Math.max(0, Number(quantity)) : undefined,
                minThreshold: minThreshold !== undefined ? Math.max(0, Number(minThreshold)) : undefined,
            },
        });

        return NextResponse.json({ success: true, item });
    } catch (error) {
        console.error("Update inventory item error:", error);
        return NextResponse.json({ error: "Failed to update item" }, { status: 500 });
    }
}

// DELETE: Delete inventory item (Admin only)
export async function DELETE(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const cookie = (await cookies()).get("session")?.value;
        if (!cookie) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const session = await decrypt(cookie);
        if (session.role !== "ADMIN") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const { id } = await params;

        await prisma.inventory.delete({ where: { id } });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Delete inventory item error:", error);
        return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
    }
}
