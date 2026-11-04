"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
exports.PATCH = PATCH;
const server_1 = require("next/server");
const prisma_1 = __importDefault(require("@/lib/prisma"));
const headers_1 = require("next/headers");
const auth_1 = require("@/lib/auth");
const zod_1 = require("zod");
const logger_1 = require("@/lib/logger");
const updatePatientSchema = zod_1.z.object({
    medicalAlerts: zod_1.z.string().max(1000).optional().nullable(),
});
async function GET(request, { params }) {
    try {
        const cookie = (await (0, headers_1.cookies)()).get("session")?.value;
        if (!cookie)
            return server_1.NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        const session = await (0, auth_1.decrypt)(cookie);
        const { id } = await params;
        if (session.role !== "ADMIN" && session.role !== "STAFF") {
            return server_1.NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
        const patient = await prisma_1.default.user.findUnique({
            where: { id },
            include: {
                appointments: {
                    include: {
                        treatment: { select: { name: true, price: true, durationMin: true } },
                    },
                    orderBy: { startTime: "desc" },
                },
                _count: { select: { appointments: true } },
            },
        });
        if (!patient) {
            return server_1.NextResponse.json({ error: "Patient not found" }, { status: 404 });
        }
        return server_1.NextResponse.json({ patient });
    }
    catch (error) {
        console.error("Fetch patient details error:", error);
        return server_1.NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
// PATCH: Update patient details (Admin only)
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
        const parseResult = updatePatientSchema.safeParse(body);
        if (!parseResult.success) {
            return server_1.NextResponse.json({ error: "Invalid data format or length" }, { status: 400 });
        }
        const { medicalAlerts } = parseResult.data;
        const patient = await prisma_1.default.user.update({
            where: { id },
            data: {
                medicalAlerts: medicalAlerts !== undefined ? (medicalAlerts || null) : undefined,
            },
            select: { id: true, medicalAlerts: true },
        });
        if (medicalAlerts !== undefined) {
            logger_1.logger.info({ adminId: session.id, patientId: id, action: "update_medical_alerts" }, "Admin updated patient medical alerts");
        }
        return server_1.NextResponse.json({ success: true, patient });
    }
    catch (error) {
        console.error("Update patient error:", error);
        return server_1.NextResponse.json({ error: "Failed to update patient" }, { status: 500 });
    }
}
