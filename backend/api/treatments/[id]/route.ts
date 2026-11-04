import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/auth";

// PUT: Update treatment
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const cookie = (await cookies()).get("session")?.value;
        if (!cookie) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        const session = await decrypt(cookie);
        if (session.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

        const { id } = await params;
        const body = await request.json();
        const { name, durationMin, price, discountedPrice, description, instructions, isActive, imageUrl } = body;

        const treatment = await prisma.treatment.update({
            where: { id },
            data: {
                ...(name !== undefined && { name: name.trim() }),
                ...(durationMin !== undefined && { durationMin: parseInt(durationMin) }),
                ...(price !== undefined && { price: parseInt(price) }),
                ...(discountedPrice !== undefined && { discountedPrice: discountedPrice ? parseInt(discountedPrice) : null }),
                ...(description !== undefined && { description: description?.trim() || null }),
                ...(instructions !== undefined && { instructions: instructions?.trim() || null }),
                ...(isActive !== undefined && { isActive }),
                ...(imageUrl !== undefined && { imageUrl: imageUrl || null }),
            },
        });

        return NextResponse.json({ treatment });
    } catch (error) {
        console.error("Update treatment error:", error);
        return NextResponse.json({ error: "Failed to update treatment" }, { status: 500 });
    }
}

// DELETE: Delete treatment (only if no appointments linked)
export async function DELETE(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const cookie = (await cookies()).get("session")?.value;
        if (!cookie) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        const session = await decrypt(cookie);
        if (session.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

        const { id } = await params;

        // Check if treatment has appointments
        const count = await prisma.appointment.count({ where: { treatmentId: id } });
        if (count > 0) {
            return NextResponse.json({
                error: `Cannot delete — ${count} appointment(s) use this treatment. Deactivate it instead.`,
            }, { status: 409 });
        }

        await prisma.treatment.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Delete treatment error:", error);
        return NextResponse.json({ error: "Failed to delete treatment" }, { status: 500 });
    }
}
