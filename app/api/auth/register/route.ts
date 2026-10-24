import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hashPassword, encrypt } from "@/lib/auth";
import { cookies } from "next/headers";
import { registerSchema } from "@/lib/validation";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Validate input
        const parsed = registerSchema.safeParse(body);
        if (!parsed.success) {
            const firstError = parsed.error.issues[0];
            return NextResponse.json({ error: firstError.message }, { status: 400 });
        }

        const { name, email, password, phone, dateOfBirth, gender, address } = parsed.data;

        // Check if email already exists
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return NextResponse.json({ error: "This email is already registered" }, { status: 409 });
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Create user
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                phone,
                dateOfBirth: new Date(dateOfBirth),
                gender: gender || undefined,
                address: address || undefined,
                role: "PATIENT",
            },
        });

        // Auto-login: Create session
        const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        const session = await encrypt({
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            expires: expires.toISOString(),
        });

        (await cookies()).set("session", session, {
            expires,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
        });

        return NextResponse.json({
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        }, { status: 201 });
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
