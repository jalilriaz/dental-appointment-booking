import { NextResponse } from "next/server";
import { google } from "googleapis";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/auth";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const code = searchParams.get("code");

        if (!code) {
            return NextResponse.json({ error: "Missing authorization code" }, { status: 400 });
        }

        const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.GOOGLE_REDIRECT_URI
        );

        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);

        // Get current user session
        const cookie = (await cookies()).get("session")?.value;
        if (!cookie) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const session = await decrypt(cookie);
        const userId = session.id as string;
        const role = session.role as string;

        // Save tokens to DB
        await prisma.user.update({
            where: { id: userId },
            data: {
                googleCalendarToken: JSON.stringify(tokens),
                googleCalendarRefreshToken: tokens.refresh_token || undefined,
                googleCalendarConnected: true,
            },
        });

        // Redirect back to settings page
        if (role === "ADMIN") {
            return NextResponse.redirect(new URL("/admin/settings", request.url));
        } else if (role === "STAFF") {
            return NextResponse.redirect(new URL("/staff", request.url)); // Staff settings page TBD, redirect to dashboard for now
        }

        return NextResponse.redirect(new URL("/", request.url));

    } catch (error) {
        console.error("Google Auth Callback Error:", error);
        return NextResponse.json({ error: "Failed to authenticate with Google" }, { status: 500 });
    }
}
