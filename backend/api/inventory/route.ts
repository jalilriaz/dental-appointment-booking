import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/auth";

// GET: Fetch all inventory items
export async function GET() {
    try {
        const cookie = (await cookies()).get("session")?.value;
        if (!cookie) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const session = await decrypt(cookie);
        if (!["ADMIN", "STAFF"].includes(session.role as string)) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const items = await prisma.inventory.findMany({
            orderBy: { itemName: "asc" },
        });

        return NextResponse.json({ items });
    } catch (error) {
        console.error("Fetch inventory error:", error);
        return NextResponse.json({ error: "Failed to fetch inventory" }, { status: 500 });
    }
}

// POST: Create inventory item (Admin only)
export async function POST(request: Request) {
    try {
        const cookie = (await cookies()).get("session")?.value;
        if (!cookie) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const session = await decrypt(cookie);
        if (session.role !== "ADMIN") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const body = await request.json();
        const { itemName, quantity, minThreshold } = body;

        if (!itemName?.trim()) {
            return NextResponse.json({ error: "Item name is required" }, { status: 400 });
        }

        const item = await prisma.inventory.create({
            data: {
                itemName: itemName.trim(),
                quantity: Math.max(0, Number(quantity) || 0),
                minThreshold: Math.max(0, Number(minThreshold) || 5),
            },
        });

        return NextResponse.json({ success: true, item });
    } catch (error) {
        console.error("Create inventory item error:", error);
        return NextResponse.json({ error: "Failed to create item" }, { status: 500 });
    }
}
