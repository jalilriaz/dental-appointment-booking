import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/auth";

// GET: Fetch all treatments
export async function GET() {
    try {
        const treatments = await prisma.treatment.findMany({
            orderBy: { name: "asc" },
            include: { _count: { select: { appointments: true } } },
        });
        return NextResponse.json({ treatments });
    } catch (error) {
        console.error("Fetch treatments error:", error);
        return NextResponse.json({ error: "Failed to fetch treatments" }, { status: 500 });
    }
}

// POST: Create new treatment (Admin only)
export async function POST(request: Request) {
    try {
        const cookie = (await cookies()).get("session")?.value;
        if (!cookie) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        const session = await decrypt(cookie);
        if (session.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

        const body = await request.json();
        const { name, durationMin, price, discountedPrice, description, instructions, isActive, imageUrl } = body;

        if (!name || !durationMin || price === undefined) {
            return NextResponse.json({ error: "Name, duration, and price are required" }, { status: 400 });
        }

        const treatment = await prisma.treatment.create({
            data: {
                name: name.trim(),
                durationMin: parseInt(durationMin),
                price: parseInt(price),
                discountedPrice: discountedPrice ? parseInt(discountedPrice) : null,
                description: description?.trim() || null,
                instructions: instructions?.trim() || null,
                isActive: isActive !== false,
                imageUrl: imageUrl || null,
            },
        });

        return NextResponse.json({ treatment }, { status: 201 });
    } catch (error) {
        console.error("Create treatment error:", error);
        return NextResponse.json({ error: "Failed to create treatment" }, { status: 500 });
    }
}
