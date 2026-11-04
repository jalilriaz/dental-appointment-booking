import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth";
import { signAccessToken, signRefreshToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email().max(150),
  password: z.string().min(1).max(250)
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const parseResult = loginSchema.safeParse(body);

        if (!parseResult.success) {
            return NextResponse.json({ error: "Invalid email or password format" }, { status: 400 });
        }

        const { email, password } = parseResult.data;

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || !user.password) {
            return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
        }

        const isValid = await verifyPassword(password, user.password);

        if (!isValid) {
            return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
        }

        // Restrict login to ADMIN and STAFF only — Patients are handled strictly via WhatsApp
        if (user.role === "PATIENT") {
            return NextResponse.json({
                error: "Patient web portal has moved to WhatsApp. Please message us on WhatsApp at +92 314 5475528 to manage your appointments.",
                code: "PATIENT_PORTAL_DEPRECATED"
            }, { status: 403 });
        }

        const cookieStore = await cookies();

        // 1-Hour Access Token
        const accessExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
        const accessToken = await signAccessToken({
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
        });

        cookieStore.set("session", accessToken, {
            expires: accessExpires,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
        });

        // 1-Day Refresh Token
        const refreshExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day
        const refreshToken = await signRefreshToken({
            id: user.id,
        });

        cookieStore.set("refreshToken", refreshToken, {
            expires: refreshExpires,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
        });

        // Return role so client knows where to redirect
        return NextResponse.json({
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
