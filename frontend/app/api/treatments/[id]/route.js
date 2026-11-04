"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PUT = PUT;
exports.DELETE = DELETE;
const server_1 = require("next/server");
const prisma_1 = __importDefault(require("@/lib/prisma"));
const headers_1 = require("next/headers");
const auth_1 = require("@/lib/auth");
// PUT: Update treatment
async function PUT(request, { params }) {
    try {
        const cookie = (await (0, headers_1.cookies)()).get("session")?.value;
        if (!cookie)
            return server_1.NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        const session = await (0, auth_1.decrypt)(cookie);
        if (session.role !== "ADMIN")
            return server_1.NextResponse.json({ error: "Forbidden" }, { status: 403 });
        const { id } = await params;
        const body = await request.json();
        const { name, durationMin, price, discountedPrice, description, instructions, isActive, imageUrl } = body;
        const treatment = await prisma_1.default.treatment.update({
            where: { id },
            data: {
                ...(name !== undefined && { name: name.trim() }),
                ...(durationMin !== undefined && { durationMin: parseInt(durationMin) }),
                ...(price !== undefined && { price: parseInt(price) }),
                ...(discountedPrice !== undefined && { discountedPrice: discountedPrice ? parseInt(discountedPrice) : null }),
                ...(description !== undefined && { description: description?.trim() || null }),
                ...(instructions !== undefined && { instructions: instructions?.trim() || null }),
                ...(isActive !== undefined && { isActive }),
                ...(imageUrl !== undefined && { imageUrl: imageUrl || null }),
            },
        });
        return server_1.NextResponse.json({ treatment });
    }
    catch (error) {
        console.error("Update treatment error:", error);
        return server_1.NextResponse.json({ error: "Failed to update treatment" }, { status: 500 });
    }
}
// DELETE: Delete treatment (only if no appointments linked)
async function DELETE(_request, { params }) {
    try {
        const cookie = (await (0, headers_1.cookies)()).get("session")?.value;
        if (!cookie)
            return server_1.NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        const session = await (0, auth_1.decrypt)(cookie);
        if (session.role !== "ADMIN")
            return server_1.NextResponse.json({ error: "Forbidden" }, { status: 403 });
        const { id } = await params;
        // Check if treatment has appointments
        const count = await prisma_1.default.appointment.count({ where: { treatmentId: id } });
        if (count > 0) {
            return server_1.NextResponse.json({
                error: `Cannot delete — ${count} appointment(s) use this treatment. Deactivate it instead.`,
            }, { status: 409 });
        }
        await prisma_1.default.treatment.delete({ where: { id } });
        return server_1.NextResponse.json({ success: true });
    }
    catch (error) {
        console.error("Delete treatment error:", error);
        return server_1.NextResponse.json({ error: "Failed to delete treatment" }, { status: 500 });
    }
}
