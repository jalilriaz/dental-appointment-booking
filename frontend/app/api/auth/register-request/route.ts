import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";
import { sendAccountSetupEmail } from "@/lib/email";

export async function POST(request: Request) {
    try {
        const { name, email } = await request.json();

        if (!name || !email) {
            return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
        }

        // Check if email already exists
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            // Check if they already have a password
            if (existing.password) {
                return NextResponse.json({ error: "This email is already registered. Please login instead." }, { status: 409 });
            }
            // If they exist but have no password, they are in "pending" status, we can resend token
        }

        // Generate Setup Token (we'll reuse the resetToken fields)
        const setupToken = crypto.randomBytes(32).toString("hex");
        const setupTokenExpiry = new Date(Date.now() + 24 * 3600000); // 24 hours for new account setup

        if (existing) {
            await prisma.user.update({
                where: { email },
                data: {
                    name, // Update name if they changed it
                    resetToken: setupToken,
                    resetTokenExpiry: setupTokenExpiry,
                },
            });
        } else {
            await prisma.user.create({
                data: {
                    name,
                    email,
                    resetToken: setupToken,
                    resetTokenExpiry: setupTokenExpiry,
                    role: "PATIENT",
                } as any, // Cast to any to bypass Prisma Client type lag
            });
        }

        // Build setup link & send email
        const setupLink = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/setup-password?token=${setupToken}`;

        console.log(`[AUTH] Setup link for ${email}: ${setupLink}`);

        try {
            await sendAccountSetupEmail(email, name, setupLink);
        } catch (emailError) {
            console.error("[REGISTER REQUEST] Failed to send email:", emailError);
            // In a real environment, you might want to return an error, but for demo we proceed
        }

        return NextResponse.json({
            success: true,
            message: "Registration request received. Please check your email to complete setup."
        });

    } catch (error) {
        console.error("Register request error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
