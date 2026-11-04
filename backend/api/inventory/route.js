"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
exports.POST = POST;
const server_1 = require("next/server");
const prisma_1 = __importDefault(require("@/lib/prisma"));
const headers_1 = require("next/headers");
const auth_1 = require("@/lib/auth");
// GET: Fetch all inventory items
async function GET() {
    try {
        const cookie = (await (0, headers_1.cookies)()).get("session")?.value;
        if (!cookie)
            return server_1.NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        const session = await (0, auth_1.decrypt)(cookie);
        if (!["ADMIN", "STAFF"].includes(session.role)) {
            return server_1.NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
        const items = await prisma_1.default.inventory.findMany({
            orderBy: { itemName: "asc" },
        });
        return server_1.NextResponse.json({ items });
    }
    catch (error) {
        console.error("Fetch inventory error:", error);
        return server_1.NextResponse.json({ error: "Failed to fetch inventory" }, { status: 500 });
    }
}
// POST: Create inventory item (Admin only)
async function POST(request) {
    try {
        const cookie = (await (0, headers_1.cookies)()).get("session")?.value;
        if (!cookie)
            return server_1.NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        const session = await (0, auth_1.decrypt)(cookie);
        if (session.role !== "ADMIN") {
            return server_1.NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
        const body = await request.json();
        const { itemName, quantity, minThreshold } = body;
        if (!itemName?.trim()) {
            return server_1.NextResponse.json({ error: "Item name is required" }, { status: 400 });
        }
        const item = await prisma_1.default.inventory.create({
            data: {
                itemName: itemName.trim(),
                quantity: Math.max(0, Number(quantity) || 0),
                minThreshold: Math.max(0, Number(minThreshold) || 5),
            },
        });
        return server_1.NextResponse.json({ success: true, item });
    }
    catch (error) {
        console.error("Create inventory item error:", error);
        return server_1.NextResponse.json({ error: "Failed to create item" }, { status: 500 });
    }
}
