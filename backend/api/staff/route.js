"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = POST;
exports.GET = GET;
const server_1 = require("next/server");
const prisma_1 = __importDefault(require("@/lib/prisma"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const client_1 = require("@prisma/client");
const headers_1 = require("next/headers");
const auth_1 = require("@/lib/auth");
const audit_1 = require("@/lib/audit");
const zod_1 = require("zod");
const createStaffSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, "Name must be at least 2 characters"),
    email: zod_1.z.string().email("Invalid email format"),
    phone: zod_1.z.string().optional().nullable(),
    password: zod_1.z.string().min(8, "Password must be at least 8 characters").optional().or(zod_1.z.literal('')),
    role: zod_1.z.nativeEnum(client_1.Role).optional(),
});
async function POST(request) {
    try {
        const cookie = (await (0, headers_1.cookies)()).get("session")?.value;
        const user = await (0, auth_1.authenticate)(cookie);
        if (!user || user.role !== "ADMIN") {
            return server_1.NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
        const body = await request.json();
        const parseResult = createStaffSchema.safeParse(body);
        if (!parseResult.success) {
            return server_1.NextResponse.json({ error: "Validation Error", details: parseResult.error.errors }, { status: 400 });
        }
        const { name, email, phone, password, role } = parseResult.data;
        // Check if user exists
        const existingUser = await prisma_1.default.user.findUnique({ where: { email } });
        if (existingUser) {
            return server_1.NextResponse.json({ error: "User with this email already exists" }, { status: 400 });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password || "Staff123!", 10);
        const staff = await prisma_1.default.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: role || client_1.Role.STAFF,
                phone,
            },
        });
        await (0, audit_1.logAudit)(user.id, "CREATE_STAFF", staff.id, { name, role: staff.role });
        const { password: _, ...staffWithoutPassword } = staff;
        return server_1.NextResponse.json({ staff: staffWithoutPassword }, { status: 201 });
    }
    catch (error) {
        console.error("Create staff error:", error);
        return server_1.NextResponse.json({ error: "Failed to create staff" }, { status: 500 });
    }
}
async function GET() {
    try {
        const cookie = (await (0, headers_1.cookies)()).get("session")?.value;
        const user = await (0, auth_1.authenticate)(cookie);
        if (!user || user.role !== "ADMIN") {
            return server_1.NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
        const staff = await prisma_1.default.user.findMany({
            where: {
                role: { in: [client_1.Role.ADMIN, client_1.Role.STAFF] },
                deletedAt: null
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                createdAt: true,
                isActive: true,
            },
            orderBy: { createdAt: "desc" }
        });
        return server_1.NextResponse.json({ staff });
    }
    catch (error) {
        return server_1.NextResponse.json({ error: "Failed to fetch staff" }, { status: 500 });
    }
}
