"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PUT = PUT;
exports.DELETE = DELETE;
const server_1 = require("next/server");
const prisma_1 = __importDefault(require("@/lib/prisma"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const client_1 = require("@prisma/client");
const headers_1 = require("next/headers");
const auth_1 = require("@/lib/auth");
const audit_1 = require("@/lib/audit");
const zod_1 = require("zod");
const updateStaffSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, "Name must be at least 2 characters").optional(),
    email: zod_1.z.string().email("Invalid email").optional(),
    phone: zod_1.z.string().optional().nullable(),
    password: zod_1.z.string().min(8, "Password must be at least 8 characters").optional().or(zod_1.z.literal('')),
    role: zod_1.z.nativeEnum(client_1.Role).optional(),
});
async function PUT(request, { params }) {
    try {
        const cookie = (await (0, headers_1.cookies)()).get("session")?.value;
        const user = await (0, auth_1.authenticate)(cookie);
        if (!user || user.role !== "ADMIN") {
            return server_1.NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
        const { id } = await params;
        const body = await request.json();
        const parseResult = updateStaffSchema.safeParse(body);
        if (!parseResult.success) {
            return server_1.NextResponse.json({ error: "Validation Error", details: parseResult.error.errors }, { status: 400 });
        }
        const { name, email, phone, password, role } = parseResult.data;
        // Prevent admin from accidentally demoting themselves if they are the last admin?
        // Let's just do safe assignment
        const updateData = {};
        if (name !== undefined)
            updateData.name = name;
        if (email !== undefined)
            updateData.email = email;
        if (phone !== undefined)
            updateData.phone = phone;
        if (role !== undefined)
            updateData.role = role;
        if (password && password.trim() !== "") {
            updateData.password = await bcryptjs_1.default.hash(password, 10);
        }
        const staff = await prisma_1.default.user.update({
            where: { id },
            data: updateData,
            select: { id: true, name: true, email: true, phone: true, role: true, isActive: true }
        });
        await (0, audit_1.logAudit)(user.id, "UPDATE_STAFF", staff.id, { updateData: { ...updateData, password: "[REDACTED]" } });
        return server_1.NextResponse.json({ staff });
    }
    catch (error) {
        console.error("Update staff error:", error);
        return server_1.NextResponse.json({ error: "Failed to update staff" }, { status: 500 });
    }
}
async function DELETE(request, { params }) {
    try {
        const cookie = (await (0, headers_1.cookies)()).get("session")?.value;
        const user = await (0, auth_1.authenticate)(cookie);
        if (!user || user.role !== "ADMIN") {
            return server_1.NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
        const { id } = await params;
        // Soft delete
        await prisma_1.default.user.update({
            where: { id },
            data: { deletedAt: new Date(), isActive: false }
        });
        await (0, audit_1.logAudit)(user.id, "DELETE_STAFF", id, {});
        return server_1.NextResponse.json({ success: true });
    }
    catch (error) {
        console.error("Delete staff error:", error);
        return server_1.NextResponse.json({ error: "Failed to delete staff" }, { status: 500 });
    }
}
