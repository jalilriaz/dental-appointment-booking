import prisma from "@/lib/prisma";
import { logFrontendAudit } from "@/lib/audit";

export async function buildClinicBackupSnapshot(actorUserId: string) {
    const [
        patients,
        treatments,
        doctors,
        appointments,
        payments,
        expenses,
        closings,
        labOrders,
        waitlist,
        feedbacks,
        settings,
    ] = await Promise.all([
        prisma.user.findMany({
            where: { role: "PATIENT" },
            select: {
                id: true,
                patientCode: true,
                name: true,
                phone: true,
                email: true,
                gender: true,
                dateOfBirth: true,
                address: true,
                medicalAlerts: true,
                allergies: true,
                medications: true,
                recallOptOut: true,
                deletedAt: true,
                createdAt: true,
            },
        }),
        prisma.treatment.findMany(),
        prisma.doctor.findMany(),
        prisma.appointment.findMany({ orderBy: { startTime: "desc" }, take: 2000 }),
        prisma.payment.findMany({ orderBy: { date: "desc" }, take: 2000 }),
        prisma.expense.findMany({ orderBy: { expenseDate: "desc" }, take: 2000 }),
        prisma.dailyClosing.findMany({ orderBy: { closingDate: "desc" }, take: 365 }),
        prisma.labOrder.findMany({ orderBy: { createdAt: "desc" }, take: 1000 }),
        prisma.waitlistEntry.findMany({ orderBy: { createdAt: "desc" }, take: 1000 }),
        prisma.feedback.findMany({ orderBy: { createdAt: "desc" }, take: 500 }),
        prisma.systemSettings.findUnique({ where: { id: "settings" } }),
    ]);

    await logFrontendAudit({
        userId: actorUserId,
        action: "EXPORT_CLINIC_BACKUP",
        entity: "SystemSettings",
        entityId: "backup",
        details: {
            patients: patients.length,
            appointments: appointments.length,
            payments: payments.length,
        },
    });

    return {
        exportedAt: new Date().toISOString(),
        schemaVersion: "phase5",
        clinicSettings: settings,
        doctors,
        treatments,
        patients,
        appointments,
        payments,
        expenses,
        dailyClosings: closings,
        labOrders,
        waitlist,
        feedbacks,
    };
}
