import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await req.json();
        const { amount, method, notes, appointmentId } = body;

        if (!amount || amount <= 0) {
            return NextResponse.json({ error: "Invalid payment amount" }, { status: 400 });
        }

        const patientTreatment = await prisma.patientTreatment.findUnique({
            where: { id },
            include: { payments: true }
        });

        if (!patientTreatment) {
            return NextResponse.json({ error: "Treatment plan not found" }, { status: 404 });
        }

        // Add the new payment
        const newPayment = await prisma.payment.create({
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
            await prisma.patientTreatment.update({
                where: { id },
                data: { status: "FULLY_PAID" }
            });
        }

        return NextResponse.json(newPayment);
    } catch (error) {
        console.error("Error adding payment:", error);
        return NextResponse.json({ error: "Failed to add payment" }, { status: 500 });
    }
}
