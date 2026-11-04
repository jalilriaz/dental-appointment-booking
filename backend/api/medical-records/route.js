"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = POST;
const server_1 = require("next/server");
// Medical records have been removed from the schema.
// This route is kept as a stub to avoid 404 errors.
async function POST() {
    return server_1.NextResponse.json({ error: "Medical records feature has been removed from this version." }, { status: 410 });
}
