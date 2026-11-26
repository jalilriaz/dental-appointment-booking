import prisma from "@/lib/prisma";
import { diffDaysInKarachi, getKarachiBoundsForDateKey, shiftDateKey } from "@/lib/karachi-date";

export async function getAppointmentReport(startDateKey: string, endDateKey: string) {
    const startUtc = getKarachiBoundsForDateKey(startDateKey).startUtc;
    const endUtc = getKarachiBoundsForDateKey(endDateKey).endUtc;

    const appts = await prisma.appointment.findMany({
        where: { startTime: { gte: startUtc, lte: endUtc } },
        select: {
            id: true,
            startTime: true,
            status: true,
            bookedBy: true,
            treatment: { select: { name: true } },
            patient: { select: { id: true, name: true, phone: true } },
        },
        orderBy: { startTime: "desc" },
    });

    const statusCounts: Record<string, number> = {};
    const sourceCounts: Record<string, number> = {};
    const treatmentCounts: Record<string, number> = {};

    for (const a of appts) {
        statusCounts[a.status] = (statusCounts[a.status] || 0) + 1;
        sourceCounts[a.bookedBy] = (sourceCounts[a.bookedBy] || 0) + 1;
        treatmentCounts[a.treatment.name] = (treatmentCounts[a.treatment.name] || 0) + 1;
    }

    return {
        startDateKey,
        endDateKey,
        total: appts.length,
        statusCounts: Object.entries(statusCounts).map(([status, count]) => ({ status, count })),
        sourceCounts: Object.entries(sourceCounts).map(([source, count]) => ({ source, count })),
        topTreatments: Object.entries(treatmentCounts)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10),
        appointments: appts.slice(0, 100).map((a) => ({
            id: a.id,
            startTime: a.startTime.toISOString(),
            status: a.status,
            bookedBy: a.bookedBy,
            treatmentName: a.treatment.name,
            patientName: a.patient.name,
            patientPhone: a.patient.phone,
        })),
    };
}

export async function getRetentionReport(startDateKey: string, endDateKey: string) {
    const curStart = getKarachiBoundsForDateKey(startDateKey);
    const curEnd = getKarachiBoundsForDateKey(endDateKey);
    const periodDays = Math.max(1, diffDaysInKarachi(curStart.startUtc, curEnd.endUtc) + 1);
    const prevEndKey = shiftDateKey(startDateKey, -1);
    const prevStartKey = shiftDateKey(prevEndKey, -(periodDays - 1));
    const prevStart = getKarachiBoundsForDateKey(prevStartKey);
    const prevEnd = getKarachiBoundsForDateKey(prevEndKey);

    const now = new Date();
    const recallCutoff = new Date(now.getTime() - 180 * 86400000);

    const [prevCompleted, curCompleted, patientsWithCompleted] = await Promise.all([
        prisma.appointment.findMany({
            where: { status: "COMPLETED", startTime: { gte: prevStart.startUtc, lte: prevEnd.endUtc } },
            select: { patientId: true },
            distinct: ["patientId"],
        }),
        prisma.appointment.findMany({
            where: { status: "COMPLETED", startTime: { gte: curStart.startUtc, lte: curEnd.endUtc } },
            select: { patientId: true },
            distinct: ["patientId"],
        }),
        prisma.user.findMany({
            where: { role: "PATIENT", deletedAt: null },
            select: {
                id: true,
                name: true,
                phone: true,
                appointments: {
                    where: { status: { in: ["COMPLETED", "SCHEDULED", "RESCHEDULED", "ARRIVED", "IN_PROGRESS"] } },
                    select: { status: true, startTime: true, treatment: { select: { name: true } } },
                    orderBy: { startTime: "desc" },
                },
            },
        }),
    ]);

    const prevSet = new Set(prevCompleted.map((r) => r.patientId));
    const curSet = new Set(curCompleted.map((r) => r.patientId));
    let returnedCount = 0;
    for (const pid of prevSet) if (curSet.has(pid)) returnedCount += 1;

    const retentionRate = prevSet.size > 0 ? Math.round((returnedCount / prevSet.size) * 100) : null;

    const overdueRecall = patientsWithCompleted
        .map((p) => {
            const hasUpcoming = p.appointments.some((a) => a.status !== "COMPLETED" && a.startTime >= now);
            const lastCompleted = p.appointments.find((a) => a.status === "COMPLETED");
            if (hasUpcoming || !lastCompleted || lastCompleted.startTime > recallCutoff) return null;
            return {
                patientId: p.id,
                patientName: p.name,
                phone: p.phone,
                lastVisitDate: lastCompleted.startTime.toISOString(),
                lastTreatment: lastCompleted.treatment.name,
                daysSinceVisit: diffDaysInKarachi(lastCompleted.startTime, now),
            };
        })
        .filter((x): x is NonNullable<typeof x> => Boolean(x))
        .sort((a, b) => b.daysSinceVisit - a.daysSinceVisit);

    return {
        startDateKey,
        endDateKey,
        prevStartKey,
        prevEndKey,
        previousCohortCount: prevSet.size,
        returnedCount,
        currentUniqueCount: curSet.size,
        retentionRate,
        overdueRecall,
    };
}
