"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = POST;
const server_1 = require("next/server");
const prisma_1 = __importDefault(require("@/lib/prisma"));
const auth_1 = require("@/lib/auth");
const headers_1 = require("next/headers");
async function POST(request) {
    try {
        const body = await request.json();
        const { token, password, phone, dateOfBirth, gender, address } = body;
        if (!token || !password) {
            return server_1.NextResponse.json({ error: "Token and password are required" }, { status: 400 });
        }
        const user = await prisma_1.default.user.findFirst({
            where: {
                resetToken: token,
                resetTokenExpiry: {
                    gt: new Date(),
                },
            },
        });
        if (!user) {
            return server_1.NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
        }
        const hashedPassword = await (0, auth_1.hashPassword)(password);
        const updatedUser = await prisma_1.default.user.update({
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
        const cookieStore = await (0, headers_1.cookies)();
        // 1-Hour Access Token
        const accessExpires = new Date(Date.now() + 60 * 60 * 1000);
        const accessToken = await (0, auth_1.signAccessToken)({
            id: updatedUser.id,
            email: updatedUser.email,
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
        const refreshToken = await (0, auth_1.signRefreshToken)({
            id: updatedUser.id,
        });
        cookieStore.set("refreshToken", refreshToken, {
            expires: refreshExpires,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
        });
        return server_1.NextResponse.json({
            success: true,
            user: {
                id: updatedUser.id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
            },
        });
    }
    catch (error) {
        console.error("Setup password error:", error);
        return server_1.NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
