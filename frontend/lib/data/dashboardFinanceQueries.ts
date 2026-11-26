import prisma from "@/lib/prisma";

export async function fetchAdminFinanceData(
    currMonth: { startUtc: Date; endUtc: Date },
    prevMonth: { startUtc: Date; endUtc: Date },
    yearStart: Date
) {
    const [
        currCompletedRev,
        currInstallments,
        prevCompletedRev,
        prevInstallments,
        yearPayments,
        unpaidPlans,
        unpaidAppts,
    ] = await Promise.all([
        prisma.appointment.aggregate({
            where: {
                status: "COMPLETED",
                startTime: { gte: currMonth.startUtc, lte: currMonth.endUtc },
            },
            _sum: { amountPaid: true },
        }),
        prisma.payment.aggregate({
            where: {
                type: "PAYMENT",
                appointmentId: null,
                date: { gte: currMonth.startUtc, lte: currMonth.endUtc },
            },
            _sum: { amount: true },
        }),
        prisma.appointment.aggregate({
            where: {
                status: "COMPLETED",
                startTime: { gte: prevMonth.startUtc, lte: prevMonth.endUtc },
            },
            _sum: { amountPaid: true },
        }),
        prisma.payment.aggregate({
            where: {
                type: "PAYMENT",
                appointmentId: null,
                date: { gte: prevMonth.startUtc, lte: prevMonth.endUtc },
            },
            _sum: { amount: true },
        }),
        prisma.payment.findMany({
            where: { type: "PAYMENT", appointmentId: null, date: { gte: yearStart } },
            select: { date: true, amount: true },
        }),
        prisma.patientTreatment.findMany({
            where: { financialStatus: { in: ["UNPAID", "PARTIALLY_PAID"] } },
            select: {
                id: true,
                totalCost: true,
                patient: { select: { id: true, name: true } },
                treatment: { select: { name: true } },
                payments: { where: { type: "PAYMENT" }, select: { amount: true } },
            },
            take: 25,
        }),
        prisma.appointment.findMany({
            where: { status: "COMPLETED", patientTreatmentId: null },
            select: {
                id: true,
                price: true,
                discount: true,
                amountPaid: true,
                patient: { select: { id: true, name: true } },
                treatment: { select: { name: true } },
            },
            orderBy: { startTime: "desc" },
            take: 25,
        }),
    ]);

    return {
        revenueThisMonth: (currCompletedRev._sum.amountPaid || 0) + (currInstallments._sum.amount || 0),
        revenueLastMonth: (prevCompletedRev._sum.amountPaid || 0) + (prevInstallments._sum.amount || 0),
        yearPayments,
        unpaidPlans,
        unpaidAppts,
    };
}
