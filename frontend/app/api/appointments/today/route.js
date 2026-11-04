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
async function GET() {
    try {
        const cookie = (await (0, headers_1.cookies)()).get("session")?.value;
        if (!cookie)
            return server_1.NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        const session = await (0, auth_1.decrypt)(cookie);
        const role = session.role;
        if (!["ADMIN", "STAFF"].includes(role)) {
            return server_1.NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
        const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
        const appointments = await prisma_1.default.appointment.findMany({
            where: {
                startTime: { gte: todayStart, lte: todayEnd },
                status: { not: "CANCELLED" },
            },
            include: {
                patient: {
                    select: {
                        id: true,
                        name: true,
                        phone: true,
                        medicalAlerts: true,
                        appointments: {
                            where: { status: "NO_SHOW" },
                            select: { id: true },
                        },
                    },
                },
                treatment: {
                    select: { name: true, durationMin: true, price: true, isMultiSession: true, defaultSessions: true },
                },
                patientTreatment: {
                    select: {
                        id: true,
                        totalCost: true,
                        totalSessions: true,
                        clinicalStatus: true,
                        financialStatus: true,
                        payments: {
                            select: { amount: true, date: true, method: true },
                        },
                    },
                },
            },
            orderBy: { startTime: "asc" },
        });
        const serialized = appointments.map((a) => ({
            id: a.id,
            startTime: a.startTime.toISOString(),
            endTime: a.endTime.toISOString(),
            status: a.status,
            amountPaid: a.amountPaid ?? 0,
            price: a.price ?? a.treatment.price,
            discount: a.discount ?? 0,
            sessionNumber: a.sessionNumber,
            sessionLabel: a.sessionLabel,
            patientTreatmentId: a.patientTreatmentId,
            patientTreatment: a.patientTreatment,
            patient: a.patient
                ? {
                    id: a.patient.id,
                    name: a.patient.name,
                    phone: a.patient.phone,
                    medicalAlerts: a.patient.medicalAlerts,
                    noShowCount: a.patient.appointments.length,
                }
                : null,
            treatment: a.treatment,
        }));
        return server_1.NextResponse.json({ appointments: serialized });
    }
    catch (error) {
        console.error("Today appointments fetch error:", error);
        return server_1.NextResponse.json({ error: "Failed to fetch today's appointments" }, { status: 500 });
    }
}
