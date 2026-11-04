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
        if (session.role !== "ADMIN") { // Only admins can search globally
            return server_1.NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
        const { searchParams } = new URL(request.url);
        const query = searchParams.get("q");
        if (!query || query.length < 2) {
            return server_1.NextResponse.json({ results: [] });
        }
        // Parallel search: Users and Appointments
        const [users, appointments] = await Promise.all([
            prisma_1.default.user.findMany({
                where: {
                    OR: [
                        { name: { contains: query, mode: "insensitive" } },
                        { email: { contains: query, mode: "insensitive" } },
                    ]
                },
                select: { id: true, name: true, email: true, role: true },
                take: 5
            }),
            prisma_1.default.appointment.findMany({
                where: {
                    OR: [
                        { patient: { name: { contains: query, mode: "insensitive" } } },
                        // Search by ID is exact match usually, but 'contains' works for string IDs too if partial
                        { id: { contains: query, mode: "insensitive" } }
                    ]
                },
                include: {
                    patient: { select: { name: true } },
                    treatment: { select: { name: true } }
                },
                take: 5,
                orderBy: { startTime: 'desc' }
            })
        ]);
        const results = [
            ...users.map(u => ({
                id: u.id,
                title: u.name || u.email,
                subtitle: `${u.role} • ${u.email}`,
                type: 'user',
                url: `/admin/${u.role === 'PATIENT' ? 'patients' : 'staff'}` // generic link for now
            })),
            ...appointments.map(a => ({
                id: a.id,
                title: `Apt: ${a.patient.name}`,
                subtitle: `${a.treatment.name} • ${new Date(a.startTime).toLocaleDateString()}`,
                type: 'appointment',
                url: `/admin/appointments` // ideally deep link to appointment details
            }))
        ];
        return server_1.NextResponse.json({ results });
    }
    catch (error) {
        console.error("Search error:", error);
        return server_1.NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
