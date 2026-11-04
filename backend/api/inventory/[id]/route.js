"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PATCH = PATCH;
exports.DELETE = DELETE;
const server_1 = require("next/server");
const prisma_1 = __importDefault(require("@/lib/prisma"));
const headers_1 = require("next/headers");
const auth_1 = require("@/lib/auth");
// PATCH: Update inventory item (Admin only)
async function PATCH(request, { params }) {
    try {
        const cookie = (await (0, headers_1.cookies)()).get("session")?.value;
        if (!cookie)
            return server_1.NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        const session = await (0, auth_1.decrypt)(cookie);
        if (session.role !== "ADMIN") {
            return server_1.NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
        const { id } = await params;
        const body = await request.json();
        const { itemName, quantity, minThreshold } = body;
        const item = await prisma_1.default.inventory.update({
            where: { id },
            data: {
                itemName: itemName?.trim() || undefined,
                quantity: quantity !== undefined ? Math.max(0, Number(quantity)) : undefined,
                minThreshold: minThreshold !== undefined ? Math.max(0, Number(minThreshold)) : undefined,
            },
        });
        return server_1.NextResponse.json({ success: true, item });
    }
    catch (error) {
        console.error("Update inventory item error:", error);
        return server_1.NextResponse.json({ error: "Failed to update item" }, { status: 500 });
    }
}
// DELETE: Delete inventory item (Admin only)
async function DELETE(_request, { params }) {
    try {
        const cookie = (await (0, headers_1.cookies)()).get("session")?.value;
        if (!cookie)
            return server_1.NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        const session = await (0, auth_1.decrypt)(cookie);
        if (session.role !== "ADMIN") {
            return server_1.NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
        const { id } = await params;
        await prisma_1.default.inventory.delete({ where: { id } });
        return server_1.NextResponse.json({ success: true });
    }
    catch (error) {
        console.error("Delete inventory item error:", error);
        return server_1.NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
    }
}
