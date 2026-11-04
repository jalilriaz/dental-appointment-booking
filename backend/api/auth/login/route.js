"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = POST;
const server_1 = require("next/server");
const prisma_1 = __importDefault(require("@/lib/prisma"));
const auth_1 = require("@/lib/auth");
const auth_2 = require("@/lib/auth");
const headers_1 = require("next/headers");
const zod_1 = require("zod");
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email().max(150),
    password: zod_1.z.string().min(1).max(250)
});
async function POST(request) {
    try {
        const body = await request.json();
        const parseResult = loginSchema.safeParse(body);
        if (!parseResult.success) {
            return server_1.NextResponse.json({ error: "Invalid email or password format" }, { status: 400 });
        }
        const { email, password } = parseResult.data;
        const user = await prisma_1.default.user.findUnique({ where: { email } });
        if (!user || !user.password) {
            return server_1.NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
        }
        const isValid = await (0, auth_1.verifyPassword)(password, user.password);
        if (!isValid) {
            return server_1.NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
        }
        // Restrict login to ADMIN and STAFF only — Patients are handled strictly via WhatsApp
        if (user.role === "PATIENT") {
            return server_1.NextResponse.json({
                error: "Patient web portal has moved to WhatsApp. Please message us on WhatsApp at +92 314 5475528 to manage your appointments.",
                code: "PATIENT_PORTAL_DEPRECATED"
            }, { status: 403 });
        }
        const cookieStore = await (0, headers_1.cookies)();
        // 1-Hour Access Token
        const accessExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
        const accessToken = await (0, auth_2.signAccessToken)({
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
        const refreshToken = await (0, auth_2.signRefreshToken)({
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
        return server_1.NextResponse.json({
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    }
    catch (error) {
        console.error("Login error:", error);
        return server_1.NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
