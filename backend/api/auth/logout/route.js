"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
exports.POST = POST;
const server_1 = require("next/server");
const headers_1 = require("next/headers");
async function GET() {
    const cookieStore = await (0, headers_1.cookies)();
    cookieStore.delete("session");
    return server_1.NextResponse.redirect(new URL("/login", "http://localhost:3000"));
}
async function POST() {
    const cookieStore = await (0, headers_1.cookies)();
    cookieStore.delete("session");
    return server_1.NextResponse.json({ success: true });
}
