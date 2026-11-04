"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
const server_1 = require("next/server");
const googleapis_1 = require("googleapis");
const prisma_1 = __importDefault(require("@/lib/prisma"));
const headers_1 = require("next/headers");
const auth_1 = require("@/lib/auth");
async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const code = searchParams.get("code");
        if (!code) {
            return server_1.NextResponse.json({ error: "Missing authorization code" }, { status: 400 });
        }
        const oauth2Client = new googleapis_1.google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.GOOGLE_REDIRECT_URI);
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);
        // Get current user session
        const cookie = (await (0, headers_1.cookies)()).get("session")?.value;
        if (!cookie) {
            return server_1.NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const session = await (0, auth_1.decrypt)(cookie);
        const userId = session.id;
        const role = session.role;
        // Save tokens to DB
        await prisma_1.default.user.update({
            where: { id: userId },
            data: {
                googleCalendarToken: JSON.stringify(tokens),
                googleCalendarRefreshToken: tokens.refresh_token || undefined,
                googleCalendarConnected: true,
            },
        });
        // Redirect back to settings page
        if (role === "ADMIN") {
            return server_1.NextResponse.redirect(new URL("/admin/settings", request.url));
        }
        else if (role === "STAFF") {
            return server_1.NextResponse.redirect(new URL("/staff", request.url)); // Staff settings page TBD, redirect to dashboard for now
        }
        return server_1.NextResponse.redirect(new URL("/", request.url));
    }
    catch (error) {
        console.error("Google Auth Callback Error:", error);
        return server_1.NextResponse.json({ error: "Failed to authenticate with Google" }, { status: 500 });
    }
}
