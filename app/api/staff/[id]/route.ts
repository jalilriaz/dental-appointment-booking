import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";
import { cookies } from "next/headers";
import { authenticate } from "@/lib/auth";
import { logAudit } from "@/lib/audit";
import { z } from "zod";

const updateStaffSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").optional(),
    email: z.string().email("Invalid email").optional(),
    phone: z.string().optional().nullable(),
    password: z.string().min(8, "Password must be at least 8 characters").optional().or(z.literal('')),
    role: z.nativeEnum(Role).optional(),
});

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const cookie = (await cookies()).get("session")?.value;
        const user = await authenticate(cookie);
        
        if (!user || user.role !== "ADMIN") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const { id } = await params;
        const body = await request.json();
        
        const parseResult = updateStaffSchema.safeParse(body);
        if (!parseResult.success) {
            return NextResponse.json({ error: "Validation Error", details: parseResult.error.errors }, { status: 400 });
        }

        const { name, email, phone, password, role } = parseResult.data;

        // Prevent admin from accidentally demoting themselves if they are the last admin?
        // Let's just do safe assignment
        const updateData: any = {};
        if (name !== undefined) updateData.name = name;
        if (email !== undefined) updateData.email = email;
        if (phone !== undefined) updateData.phone = phone;
        if (role !== undefined) updateData.role = role;
        
        if (password && password.trim() !== "") {
            updateData.password = await bcrypt.hash(password, 10);
        }

        const staff = await prisma.user.update({
            where: { id },
            data: updateData,
            select: { id: true, name: true, email: true, phone: true, role: true, isActive: true }
        });

        await logAudit(user.id, "UPDATE_STAFF", staff.id, { updateData: { ...updateData, password: "[REDACTED]" } });

        return NextResponse.json({ staff });
    } catch (error) {
        console.error("Update staff error:", error);
        return NextResponse.json({ error: "Failed to update staff" }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const cookie = (await cookies()).get("session")?.value;
        const user = await authenticate(cookie);
        
        if (!user || user.role !== "ADMIN") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const { id } = await params;

        // Soft delete
        await prisma.user.update({
            where: { id },
            data: { deletedAt: new Date(), isActive: false }
        });

        await logAudit(user.id, "DELETE_STAFF", id, {});

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Delete staff error:", error);
        return NextResponse.json({ error: "Failed to delete staff" }, { status: 500 });
    }
}
