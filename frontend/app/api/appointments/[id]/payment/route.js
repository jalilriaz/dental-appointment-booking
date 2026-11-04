"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PATCH = PATCH;
const server_1 = require("next/server");
// Payment status has been removed from the appointment schema.
// This route is kept as a stub to avoid 404 errors.
async function PATCH() {
    return server_1.NextResponse.json({ error: "Payment status tracking has been removed from this version." }, { status: 410 });
}
