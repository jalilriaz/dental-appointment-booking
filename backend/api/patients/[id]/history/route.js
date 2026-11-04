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
// GET: Fetch complete patient history (all appointments, multi-session plans, and revenue ledger)
async function GET(request, { params }) {
    try {
        const cookie = (await (0, headers_1.cookies)()).get("session")?.value;
        if (!cookie)
            return server_1.NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        const session = await (0, auth_1.decrypt)(cookie);
        const role = session.role;
        if (!["ADMIN", "STAFF"].includes(role)) {
            return server_1.NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
        const { id } = await params;
        const patient = await prisma_1.default.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                patientCode: true,
                createdAt: true,
            },
        });
        if (!patient) {
            return server_1.NextResponse.json({ error: "Patient not found" }, { status: 404 });
        }
        // 1. Fetch Patient's multi-session treatment plans with payment ledger & sessions
        const patientTreatments = await prisma_1.default.patientTreatment.findMany({
            where: { patientId: id },
            include: {
                treatment: true,
                payments: {
                    orderBy: { date: "desc" },
                },
                appointments: {
                    orderBy: { startTime: "asc" },
                    include: {
                        treatment: true,
                        clinicalNotes: true,
                    },
                },
            },
            orderBy: { startDate: "desc" },
        });
        const plans = patientTreatments.map((pt) => {
            const totalPaid = pt.payments.reduce((sum, p) => sum + p.amount, 0);
            const remainingBalance = Math.max(0, pt.totalCost - totalPaid);
            const completedSessions = pt.appointments.filter(a => a.status === "COMPLETED").length;
            const scheduledSessions = pt.appointments.filter(a => a.status === "SCHEDULED").length;
            return {
                ...pt,
                totalPaid,
                remainingBalance,
                completedSessions,
                scheduledSessions,
            };
        });
        // 2. Fetch all appointments with treatment and notes
        const appointments = await prisma_1.default.appointment.findMany({
            where: { patientId: id },
            include: {
                treatment: { select: { name: true, price: true, durationMin: true } },
                clinicalNotes: {
                    orderBy: { createdAt: "desc" },
                },
                patientTreatment: {
                    select: {
                        id: true,
                        totalCost: true,
                        totalSessions: true,
                        clinicalStatus: true,
                        financialStatus: true,
                    },
                },
                payments: true,
            },
            orderBy: { startTime: "desc" },
        });
        // 3. Overall Revenue Ledger for this patient
        const allPayments = await prisma_1.default.payment.findMany({
            where: {
                OR: [
                    { appointment: { patientId: id } },
                    { patientTreatment: { patientId: id } },
                ],
            },
            include: {
                appointment: {
                    select: {
                        treatment: { select: { name: true } },
                        sessionNumber: true,
                        sessionLabel: true,
                    },
                },
            },
            orderBy: { date: "desc" },
        });
        const totalRevenueCollected = allPayments.reduce((sum, p) => sum + p.amount, 0);
        return server_1.NextResponse.json({
            patient,
            plans,
            appointments,
            allPayments,
            totalRevenueCollected,
        });
    }
    catch (error) {
        console.error("Fetch patient history error:", error);
        return server_1.NextResponse.json({ error: "Failed to fetch history" }, { status: 500 });
    }
}
