import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("=== EXECUTING MULTI-SESSION SCHEMA BACKFILL ===");

    // 1. Backfill Treatment Catalog with multi-session flags and default sessions
    console.log("\n1. Updating Treatment catalog flags...");
    const multiSessionTreatments: { pattern: string; sessions: number }[] = [
        { pattern: "braces", sessions: 10 },
        { pattern: "implant", sessions: 4 },
        { pattern: "rct", sessions: 3 },
        { pattern: "root canal", sessions: 3 },
        { pattern: "aligner", sessions: 8 },
        { pattern: "veneer", sessions: 2 },
        { pattern: "lumineer", sessions: 2 },
    ];

    const allTreatments = await prisma.treatment.findMany();
    for (const t of allTreatments) {
        const lower = t.name.toLowerCase();
        const match = multiSessionTreatments.find((m) => lower.includes(m.pattern));
        if (match) {
            await prisma.treatment.update({
                where: { id: t.id },
                data: {
                    isMultiSession: true,
                    defaultSessions: match.sessions,
                },
            });
            console.log(`  ✓ Flagged [${t.name}] as Multi-Session (default ${match.sessions} sessions)`);
        }
    }

    // 2. Backfill PatientTreatment status enums and totalSessions
    console.log("\n2. Backfilling PatientTreatment lifecycle enums...");
    const plans = await prisma.patientTreatment.findMany({
        include: {
            payments: true,
            treatment: true,
        },
    });

    for (const plan of plans) {
        const totalPaid = plan.payments.reduce((sum, p) => sum + p.amount, 0);
        let finStatus: "UNPAID" | "PARTIALLY_PAID" | "FULLY_PAID" = "UNPAID";
        if (totalPaid >= plan.totalCost) {
            finStatus = "FULLY_PAID";
        } else if (totalPaid > 0) {
            finStatus = "PARTIALLY_PAID";
        }

        const clinStatus = plan.status === "COMPLETED" ? "COMPLETED" : "IN_PROGRESS";
        const sessions = plan.treatment?.defaultSessions || 1;

        await prisma.patientTreatment.update({
            where: { id: plan.id },
            data: {
                financialStatus: finStatus,
                clinicalStatus: clinStatus,
                totalSessions: plan.totalSessions > 1 ? plan.totalSessions : sessions,
            },
        });
        console.log(`  ✓ Plan ${plan.id.slice(0, 8)}: clinical=${clinStatus}, financial=${finStatus}, paid=${totalPaid}/${plan.totalCost}`);
    }

    // 3. Backfill Appointments linked to treatments
    console.log("\n3. Backfilling Appointment session numbers...");
    const linkedAppointments = await prisma.appointment.findMany({
        where: {
            patientTreatmentId: { not: null },
            sessionNumber: null,
        },
        orderBy: {
            startTime: "asc",
        },
    });

    for (let i = 0; i < linkedAppointments.length; i++) {
        const apt = linkedAppointments[i];
        await prisma.appointment.update({
            where: { id: apt.id },
            data: {
                sessionNumber: i + 1,
                sessionLabel: `Session ${i + 1}`,
            },
        });
        console.log(`  ✓ Appointment ${apt.id.slice(0, 8)} set to sessionNumber=${i + 1}`);
    }

    console.log("\n✅ BACKFILL COMPLETED SUCCESSFULLY.");
    await prisma.$disconnect();
}

main().catch((err) => {
    console.error("Backfill failed:", err);
    process.exit(1);
});
