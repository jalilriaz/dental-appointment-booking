import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { patientId, treatmentId, totalCost, initialPayment, method, notes } = body;

        if (!patientId || !treatmentId || totalCost === undefined) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const patientTreatment = await prisma.patientTreatment.create({
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

        return NextResponse.json(patientTreatment);
    } catch (error) {
        console.error("Error creating patient treatment:", error);
        return NextResponse.json({ error: "Failed to create patient treatment" }, { status: 500 });
    }
}
