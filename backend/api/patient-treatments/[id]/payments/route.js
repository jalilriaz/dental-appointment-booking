"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = POST;
const server_1 = require("next/server");
const prisma_1 = __importDefault(require("@/lib/prisma"));
async function POST(req, { params }) {
    try {
        const { id } = await params;
        const body = await req.json();
        const { amount, method, notes, appointmentId } = body;
        if (!amount || amount <= 0) {
            return server_1.NextResponse.json({ error: "Invalid payment amount" }, { status: 400 });
        }
        const patientTreatment = await prisma_1.default.patientTreatment.findUnique({
            where: { id },
            include: { payments: true }
        });
        if (!patientTreatment) {
            return server_1.NextResponse.json({ error: "Treatment plan not found" }, { status: 404 });
        }
        // Add the new payment
        const newPayment = await prisma_1.default.payment.create({
            data: {
                patientTreatmentId: id,
                amount,
                method: method || "CASH",
                notes: notes || null,
                appointmentId: appointmentId || null,
            }
        });
        // Recalculate total paid
        const totalPaid = patientTreatment.payments.reduce((sum, p) => sum + p.amount, 0) + amount;
        // Update status if fully paid
        if (totalPaid >= patientTreatment.totalCost && patientTreatment.status !== "FULLY_PAID") {
            await prisma_1.default.patientTreatment.update({
                where: { id },
                data: { status: "FULLY_PAID" }
            });
        }
        return server_1.NextResponse.json(newPayment);
    }
    catch (error) {
        console.error("Error adding payment:", error);
        return server_1.NextResponse.json({ error: "Failed to add payment" }, { status: 500 });
    }
}
