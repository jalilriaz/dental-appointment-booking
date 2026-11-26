import prisma from "@/lib/prisma";
import { can, type AppRole } from "@/lib/auth/permissions";
import { getClinicProfile } from "@/lib/data/clinic";
import { fetchAdminFinanceData } from "@/lib/data/dashboardFinanceQueries";
import { getKarachiDayBounds, getKarachiMonthBounds } from "@/lib/format";

export async function fetchDashboardRawData(role: AppRole) {
    const canViewFinance = can(role, "revenue:read");
    const today = getKarachiDayBounds(0);
    const tomorrow = getKarachiDayBounds(1);
    const futureLimit = getKarachiDayBounds(14);
    const queuePastLimit = getKarachiDayBounds(-30);
    const noShowWindow = getKarachiDayBounds(-14);
    const currMonth = getKarachiMonthBounds(0);
    const prevMonth = getKarachiMonthBounds(-1);
    const yearStart = new Date(Date.UTC(currMonth.year - 1, 0, 1));

    const [
        clinic,
        todayAppts,
        tomorrowCount,
        totalPatients,
        newPatientsThisMonth,
        queueAppts,
        upcomingAppts,
        apptsSinceLastYear,
        statusGroups,
        treatmentsList,
        unconfirmedTomorrow,
        recentNoShows,
    ] = await Promise.all([
        getClinicProfile(),
        prisma.appointment.findMany({
            where: { startTime: { gte: today.startUtc, lte: today.endUtc } },
            select: { id: true, status: true },
        }),
        prisma.appointment.count({
            where: { startTime: { gte: tomorrow.startUtc, lte: tomorrow.endUtc }, status: { not: "CANCELLED" } },
        }),
        prisma.user.count({ where: { role: "PATIENT", deletedAt: null } }),
        prisma.user.count({
            where: { role: "PATIENT", deletedAt: null, createdAt: { gte: currMonth.startUtc, lte: currMonth.endUtc } },
        }),
        prisma.appointment.findMany({
            where: { startTime: { gte: queuePastLimit.startUtc, lte: futureLimit.endUtc } },
            select: {
                id: true, startTime: true, endTime: true, status: true, isEmergency: true, notes: true,
                ...(canViewFinance ? { price: true, discount: true, amountPaid: true } : {}),
                patient: {
                    select: {
                        id: true, name: true, phone: true, patientCode: true,
                        medicalAlerts: true, allergies: true, medications: true, noShowCount: true, _count: { select: { appointments: true } },
                    },
                },
                treatment: {
                    select: { id: true, name: true, durationMin: true, price: true, isMultiSession: true, defaultSessions: true },
                },
                doctor: { select: { id: true, name: true, role: true, operatory: true } },
                patientTreatment: {
                    select: { id: true, totalCost: true, totalSessions: true, clinicalStatus: true, financialStatus: true },
                },
            },
            orderBy: { startTime: "asc" },
        }),
        prisma.appointment.findMany({
            where: {
                startTime: { gte: today.startUtc, lte: futureLimit.endUtc },
                status: { in: ["SCHEDULED", "RESCHEDULED", "ARRIVED", "IN_PROGRESS"] },
            },
            include: {
                patient: { select: { id: true, name: true, phone: true, _count: { select: { appointments: true } } } },
                treatment: { select: { name: true, durationMin: true } },
            },
            orderBy: { startTime: "asc" },
        }),
        prisma.appointment.findMany({
            where: { startTime: { gte: yearStart }, status: { not: "CANCELLED" } },
            select: { startTime: true, status: true, treatmentId: true, ...(canViewFinance ? { amountPaid: true } : {}) },
        }),
        prisma.appointment.groupBy({ by: ["status"], _count: { _all: true } }),
        prisma.treatment.findMany({
            where: { deletedAt: null },
            select: { id: true, name: true, category: true, _count: { select: { appointments: true } } },
        }),
        prisma.appointment.findMany({
            where: {
                startTime: { gte: tomorrow.startUtc, lte: tomorrow.endUtc },
                status: { in: ["SCHEDULED", "RESCHEDULED"] },
                notificationLogs: { none: { status: "SENT" } },
            },
            select: {
                id: true, startTime: true,
                patient: { select: { id: true, name: true, phone: true } },
                treatment: { select: { name: true } },
            },
            orderBy: { startTime: "asc" },
            take: 5,
        }),
        prisma.appointment.findMany({
            where: { status: "Not_Visited", startTime: { gte: noShowWindow.startUtc, lte: today.endUtc } },
            select: { id: true, startTime: true, patient: { select: { id: true, name: true } }, treatment: { select: { name: true } } },
            orderBy: { startTime: "desc" },
            take: 5,
        }),
    ]);

    const finance = canViewFinance
        ? await fetchAdminFinanceData(currMonth, prevMonth, yearStart)
        : null;

    return {
        canViewFinance, clinic, todayAppts, tomorrowCount, totalPatients,
        newPatientsThisMonth, queueAppts, upcomingAppts, apptsSinceLastYear,
        statusGroups, treatmentsList, unconfirmedTomorrow, recentNoShows, finance,
    };
}
