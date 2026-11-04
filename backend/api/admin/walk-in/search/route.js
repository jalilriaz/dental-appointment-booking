"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
const server_1 = require("next/server");
const prisma_1 = __importDefault(require("@/lib/prisma"));
const headers_1 = require("next/headers");
const auth_1 = require("@/lib/auth");
async function GET(request) {
    try {
        const cookie = (await (0, headers_1.cookies)()).get("session")?.value;
        if (!cookie)
            return server_1.NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        const session = await (0, auth_1.decrypt)(cookie);
        const role = session.role;
        if (role !== "ADMIN" && role !== "STAFF") {
            return server_1.NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
        const { searchParams } = new URL(request.url);
        const query = searchParams.get("q")?.trim() || "";
        const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
        const limit = 8;
        const skip = (page - 1) * limit;
        // Build where clause — show all patients, optionally filtered by search
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const where = { role: "PATIENT" };
        if (query.length >= 2) {
            const conditions = [
                { name: { contains: query, mode: "insensitive" } },
                { phone: { contains: query, mode: "insensitive" } },
                { email: { contains: query, mode: "insensitive" } },
            ];
            // If query is a number, also search by patientCode
            const numericQuery = parseInt(query);
            if (!isNaN(numericQuery)) {
                conditions.push({ patientCode: numericQuery });
            }
            where.OR = conditions;
        }
        const [patients, total] = await Promise.all([
            prisma_1.default.user.findMany({
                where,
                select: {
                    id: true,
                    name: true,
                    phone: true,
                    email: true,
                    patientCode: true,
                    medicalAlerts: true,
                    createdAt: true,
                    appointments: {
                        select: {
                            id: true,
                            startTime: true,
                            status: true,
                            treatment: { select: { name: true } },
                        },
                        orderBy: { startTime: "desc" },
                        take: 1,
                    },
                    _count: { select: { appointments: true } },
                },
                skip,
                take: limit,
                orderBy: { name: "asc" },
            }),
            prisma_1.default.user.count({ where }),
        ]);
        return server_1.NextResponse.json({
            patients,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        });
    }
    catch (error) {
        console.error("Walk-in search error:", error);
        return server_1.NextResponse.json({ error: "Search failed" }, { status: 500 });
    }
}
