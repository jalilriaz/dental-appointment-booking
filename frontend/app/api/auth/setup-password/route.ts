import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hashPassword, signAccessToken, signRefreshToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { token, password, phone, dateOfBirth, gender, address } = body;

        if (!token || !password) {
            return NextResponse.json({ error: "Token and password are required" }, { status: 400 });
        }

        const user = await prisma.user.findFirst({
            where: {
                resetToken: token,
                resetTokenExpiry: {
                    gt: new Date(),
                },
            },
        });

        if (!user) {
            return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
        }

        const hashedPassword = await hashPassword(password);

        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                phone: phone || null,
                dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
                gender: gender || null,
                address: address || null,
                resetToken: null,
                resetTokenExpiry: null,
            },
        });

        // Auto-login after setup
        const cookieStore = await cookies();

        // 1-Hour Access Token
        const accessExpires = new Date(Date.now() + 60 * 60 * 1000);
        const accessToken = await signAccessToken({
            id: updatedUser.id,
            email: updatedUser.email!,
            name: updatedUser.name,
            role: updatedUser.role,
        });

        cookieStore.set("session", accessToken, {
            expires: accessExpires,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
        });

        // 1-Day Refresh Token
        const refreshExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
        const refreshToken = await signRefreshToken({
            id: updatedUser.id,
        });

        cookieStore.set("refreshToken", refreshToken, {
            expires: refreshExpires,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
        });

        return NextResponse.json({
            success: true,
            user: {
                id: updatedUser.id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
            },
        });

    } catch (error) {
        console.error("Setup password error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
