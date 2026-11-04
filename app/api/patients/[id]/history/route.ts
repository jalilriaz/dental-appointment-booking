import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/auth";

// GET: Fetch complete patient history (all appointments, multi-session plans, and revenue ledger)
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const cookie = (await cookies()).get("session")?.value;
        if (!cookie) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const session = await decrypt(cookie);
        const role = session.role as string;

        if (!["ADMIN", "STAFF"].includes(role)) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const { id } = await params;

        const patient = await prisma.user.findUnique({
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
            return NextResponse.json({ error: "Patient not found" }, { status: 404 });
        }

        // 1. Fetch Patient's multi-session treatment plans with payment ledger & sessions
        const patientTreatments = await prisma.patientTreatment.findMany({
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
        const appointments = await prisma.appointment.findMany({
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
        const allPayments = await prisma.payment.findMany({
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

        return NextResponse.json({
            patient,
            plans,
            appointments,
            allPayments,
            totalRevenueCollected,
        });
    } catch (error) {
        console.error("Fetch patient history error:", error);
        return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 });
    }
}

