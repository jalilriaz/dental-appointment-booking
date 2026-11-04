"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = POST;
const server_1 = require("next/server");
const prisma_1 = __importDefault(require("@/lib/prisma"));
async function POST(req) {
    try {
        const body = await req.json();
        const { patientId, treatmentId, totalCost, initialPayment, method, notes } = body;
        if (!patientId || !treatmentId || totalCost === undefined) {
            return server_1.NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }
        const patientTreatment = await prisma_1.default.patientTreatment.create({
            data: {
                patientId,
                treatmentId,
                totalCost,
                status: initialPayment >= totalCost ? "FULLY_PAID" : "ONGOING",
                payments: initialPayment > 0 ? {
                    create: {
                        amount: initialPayment,
                        method: method || "CASH",
                        notes: notes || "Initial payment",
                    }
                } : undefined
            },
            include: {
                treatment: true,
                payments: true
            }
        });
        return server_1.NextResponse.json(patientTreatment);
    }
    catch (error) {
        console.error("Error creating patient treatment:", error);
        return server_1.NextResponse.json({ error: "Failed to create patient treatment" }, { status: 500 });
    }
}
