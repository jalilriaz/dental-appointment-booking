"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = POST;
const server_1 = require("next/server");
const prisma_1 = __importDefault(require("@/lib/prisma"));
const crypto_1 = __importDefault(require("crypto"));
const email_1 = require("@/lib/email");
async function POST(request) {
    try {
        const { email } = await request.json();
        if (!email) {
            return server_1.NextResponse.json({ error: "Email is required" }, { status: 400 });
        }
        const user = await prisma_1.default.user.findUnique({
            where: { email },
        });
        if (!user) {
            // For security, don't reveal that the user does not exist
            return server_1.NextResponse.json({ success: true, message: "If an account exists, a reset link has been sent." });
        }
        // Generate Token
        const resetToken = crypto_1.default.randomBytes(32).toString("hex");
        const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now
        await prisma_1.default.user.update({
            where: { id: user.id },
            data: {
                resetToken,
                resetTokenExpiry,
            },
        });
        // Build reset link & send email
        const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/reset-password?token=${resetToken}`;
        try {
            await (0, email_1.sendPasswordResetEmail)(email, resetLink);
        }
        catch (emailError) {
            console.error("[FORGOT PASSWORD] Failed to send email:", emailError);
            // Still return success so we don't leak info, but log the error
        }
        return server_1.NextResponse.json({ success: true, message: "If an account exists, a reset link has been sent." });
    }
    catch (error) {
        console.error("Forgot password error:", error);
        return server_1.NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
