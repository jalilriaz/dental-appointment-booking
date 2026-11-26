import prisma from "@/lib/prisma";
import { diffDaysInKarachi } from "@/lib/karachi-date";
import { computeAgingBuckets } from "@/lib/services/moneyMath";

export interface AgingRow {
    id: string;
    kind: "Care plan" | "Visit";
    patientId: string;
    patientName: string;
    patientPhone: string | null;
    treatmentName: string;
    referenceDate: string;
    ageDays: number;
    totalCost: number;
    paid: number;
    balance: number;
}

export async function getAgingReport() {
    const now = new Date();
    const [plans, standaloneAppts] = await Promise.all([
        prisma.patientTreatment.findMany({
            where: { financialStatus: { in: ["UNPAID", "PARTIALLY_PAID"] } },
            select: {
                id: true,
                totalCost: true,
                startDate: true,
                patient: { select: { id: true, name: true, phone: true } },
                treatment: { select: { name: true } },
                payments: { select: { amount: true, type: true } },
            },
            orderBy: { startDate: "asc" },
        }),
        prisma.appointment.findMany({
            where: { status: "COMPLETED", patientTreatmentId: null },
            select: {
                id: true,
                price: true,
                discount: true,
                amountPaid: true,
                startTime: true,
                patient: { select: { id: true, name: true, phone: true } },
                treatment: { select: { name: true } },
            },
            orderBy: { startTime: "asc" },
        }),
    ]);

    const rows: AgingRow[] = [];

    for (const p of plans) {
        let paid = 0;
        for (const pay of p.payments) paid += pay.type === "REFUND" ? -pay.amount : pay.amount;
        const balance = Math.max(0, p.totalCost - Math.max(0, paid));
        if (balance <= 0) continue;
        rows.push({
            id: p.id, kind: "Care plan", patientId: p.patient.id, patientName: p.patient.name,
            patientPhone: p.patient.phone, treatmentName: p.treatment.name,
            referenceDate: p.startDate.toISOString(), ageDays: diffDaysInKarachi(p.startDate, now),
            totalCost: p.totalCost, paid: Math.max(0, paid), balance,
        });
    }

    for (const a of standaloneAppts) {
        const netBill = Math.max(0, a.price - (a.discount || 0));
        const balance = Math.max(0, netBill - (a.amountPaid || 0));
        if (balance <= 0) continue;
        rows.push({
            id: a.id, kind: "Visit", patientId: a.patient.id, patientName: a.patient.name,
            patientPhone: a.patient.phone, treatmentName: a.treatment.name,
            referenceDate: a.startTime.toISOString(), ageDays: diffDaysInKarachi(a.startTime, now),
            totalCost: netBill, paid: a.amountPaid || 0, balance,
        });
    }

    rows.sort((a, b) => b.ageDays - a.ageDays);
    return { summary: computeAgingBuckets(rows), rows };
}
