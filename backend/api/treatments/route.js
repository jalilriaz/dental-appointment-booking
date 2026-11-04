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
// GET: Fetch all treatments
async function GET() {
    try {
        const treatments = await prisma_1.default.treatment.findMany({
            orderBy: { name: "asc" },
            include: { _count: { select: { appointments: true } } },
        });
        return server_1.NextResponse.json({ treatments });
    }
    catch (error) {
        console.error("Fetch treatments error:", error);
        return server_1.NextResponse.json({ error: "Failed to fetch treatments" }, { status: 500 });
    }
}
// POST: Create new treatment (Admin only)
async function POST(request) {
    try {
        const cookie = (await (0, headers_1.cookies)()).get("session")?.value;
        if (!cookie)
            return server_1.NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        const session = await (0, auth_1.decrypt)(cookie);
        if (session.role !== "ADMIN")
            return server_1.NextResponse.json({ error: "Forbidden" }, { status: 403 });
        const body = await request.json();
        const { name, durationMin, price, discountedPrice, description, instructions, isActive, imageUrl } = body;
        if (!name || !durationMin || price === undefined) {
            return server_1.NextResponse.json({ error: "Name, duration, and price are required" }, { status: 400 });
        }
        const treatment = await prisma_1.default.treatment.create({
            data: {
                name: name.trim(),
                durationMin: parseInt(durationMin),
                price: parseInt(price),
                discountedPrice: discountedPrice ? parseInt(discountedPrice) : null,
                description: description?.trim() || null,
                instructions: instructions?.trim() || null,
                isActive: isActive !== false,
                imageUrl: imageUrl || null,
            },
        });
        return server_1.NextResponse.json({ treatment }, { status: 201 });
    }
    catch (error) {
        console.error("Create treatment error:", error);
        return server_1.NextResponse.json({ error: "Failed to create treatment" }, { status: 500 });
    }
}
