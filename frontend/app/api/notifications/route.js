"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
const server_1 = require("next/server");
const headers_1 = require("next/headers");
const auth_1 = require("@/lib/auth");
async function GET() {
    try {
        const cookie = (await (0, headers_1.cookies)()).get("session")?.value;
        if (!cookie)
            return server_1.NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        await (0, auth_1.decrypt)(cookie); // validate session
        // Notification model not yet in schema — return empty for now
        return server_1.NextResponse.json({ notifications: [] });
    }
    catch (error) {
        console.error("Fetch notifications error:", error);
        return server_1.NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
