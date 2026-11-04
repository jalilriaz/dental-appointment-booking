"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
exports.POST = POST;
const server_1 = require("next/server");
const appointment_status_1 = require("@/lib/appointment-status");
const headers_1 = require("next/headers");
const auth_1 = require("@/lib/auth");
async function isAuthorized(request) {
    const authHeader = request.headers.get("authorization");
    const configuredSecret = (process.env.N8N_SECRET_KEY || "elite-dental-n8n-bot-secret-key-2026").replace(/^["']|["']$/g, "").trim();
    const fallbackSecret = "elite-dental-n8n-bot-secret-key-2026";
    const cronSecret = (process.env.CRON_SECRET || "").replace(/^["']|["']$/g, "").trim();
    // Check Bearer Token
    if (authHeader && authHeader.toLowerCase().startsWith("bearer ")) {
        const token = authHeader.substring(7).replace(/^["']|["']$/g, "").trim();
        if (token === configuredSecret || token === fallbackSecret || (cronSecret && token === cronSecret)) {
            return true;
        }
    }
    // Check query parameter ?secret=
    const url = new URL(request.url);
    const querySecret = url.searchParams.get("secret");
    if (querySecret && (querySecret === secretKey || (cronSecret && querySecret === cronSecret))) {
        return true;
    }
    // Check Admin/Staff Cookie session
    try {
        const cookie = (await (0, headers_1.cookies)()).get("session")?.value;
        if (cookie) {
            const session = await (0, auth_1.decrypt)(cookie);
            if (["ADMIN", "STAFF"].includes(session.role)) {
                return true;
            }
        }
    }
    catch {
        // Continue
    }
    return false;
}
async function GET(request) {
    if (!(await isAuthorized(request))) {
        return server_1.NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const result = await (0, appointment_status_1.expirePastAppointments)();
    return server_1.NextResponse.json({
        success: true,
        message: `Processed expired appointments. Marked ${result.updatedCount} as Missed (NO_SHOW).`,
        ...result,
        timestamp: new Date().toISOString(),
    });
}
async function POST(request) {
    if (!(await isAuthorized(request))) {
        return server_1.NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const result = await (0, appointment_status_1.expirePastAppointments)();
    return server_1.NextResponse.json({
        success: true,
        message: `Processed expired appointments. Marked ${result.updatedCount} as Missed (NO_SHOW).`,
        ...result,
        timestamp: new Date().toISOString(),
    });
}
