import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";
import { cookies } from "next/headers";
import { authenticate } from "@/lib/auth";
import { logAudit } from "@/lib/audit";
import { z } from "zod";

const createStaffSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email format"),
    phone: z.string().optional().nullable(),
    password: z.string().min(8, "Password must be at least 8 characters").optional().or(z.literal('')),
    role: z.nativeEnum(Role).optional(),
});

export async function POST(request: Request) {
    try {
        const cookie = (await cookies()).get("session")?.value;
        const user = await authenticate(cookie);
        
        if (!user || user.role !== "ADMIN") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const body = await request.json();
        const parseResult = createStaffSchema.safeParse(body);
        if (!parseResult.success) {
            return NextResponse.json({ error: "Validation Error", details: parseResult.error.errors }, { status: 400 });
        }

        const { name, email, phone, password, role } = parseResult.data;

        // Check if user exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return NextResponse.json({ error: "User with this email already exists" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password || "Staff123!", 10);

        const staff = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: role || Role.STAFF,
                phone,
            },
        });

        await logAudit(user.id, "CREATE_STAFF", staff.id, { name, role: staff.role });

        const { password: _, ...staffWithoutPassword } = staff;
        return NextResponse.json({ staff: staffWithoutPassword }, { status: 201 });
    } catch (error) {
        console.error("Create staff error:", error);
        return NextResponse.json({ error: "Failed to create staff" }, { status: 500 });
    }
}

export async function GET() {
    try {
        const cookie = (await cookies()).get("session")?.value;
        const user = await authenticate(cookie);
        
        if (!user || user.role !== "ADMIN") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const staff = await prisma.user.findMany({
            where: { 
                role: { in: [Role.ADMIN, Role.STAFF] },
                deletedAt: null
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                createdAt: true,
                isActive: true,
            },
            orderBy: { createdAt: "desc" }
        });
        return NextResponse.json({ staff });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch staff" }, { status: 500 });
    }
}
