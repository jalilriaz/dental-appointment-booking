"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = POST;
const server_1 = require("next/server");
const prisma_1 = __importDefault(require("@/lib/prisma"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
async function POST(request) {
    try {
        const { token, password } = await request.json();
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
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        await prisma_1.default.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetToken: null,
                resetTokenExpiry: null,
            },
        });
        return server_1.NextResponse.json({ success: true, message: "Password reset successfully" });
    }
    catch (error) {
        console.error("Reset password error:", error);
        return server_1.NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
