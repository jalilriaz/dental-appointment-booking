import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("Starting Booking Flow Test...");

    // 1. Fetch a patient
    const patient = await prisma.user.findFirst({
        where: { role: "PATIENT" },
    });

    if (!patient) {
        console.error("No patient found. Please seed data first.");
        return;
    }
    console.log(`Found Patient: ${patient.email}`);

    // 2. Fetch a treatment
    const treatment = await prisma.treatmentOption.findFirst({
        where: { isActive: true },
        include: { category: true },
    });

    if (!treatment) {
        console.error("No active treatment found.");
        return;
    }
    console.log(
        `Found Treatment: ${treatment.name} (${treatment.category.name})`
    );

    // 3. Fetch a staff member (Doctor/Admin) - We specifically want to test if Admin is bookable
    // logic in page.tsx was updated to include ADMIN, so this should match.
    const staff = await prisma.user.findFirst({
        where: {
            role: { in: ["ADMIN", "STAFF"] }
        },
    });

    if (!staff) {
        console.error("No staff member found (Admin or Staff).");
        return;
    }
    console.log(`Found Staff: ${staff.name} (${staff.role})`);

    // 4. Create an appointment
    const startTime = new Date();
    startTime.setDate(startTime.getDate() + 1); // Tomorrow
    startTime.setHours(14, 0, 0, 0); // 2:00 PM

    const endTime = new Date(startTime);
    endTime.setMinutes(endTime.getMinutes() + treatment.durationMin);

    console.log(`Attempting to book for ${startTime.toISOString()} with duration ${treatment.durationMin}m...`);

    try {
        const appointment = await prisma.appointment.create({
            data: {
                startTime,
                endTime,
                status: "SCHEDULED",
                patientId: patient.id,
                staffId: staff.id,
                treatmentId: treatment.id,
                notes: "Automated test booking",
            },
        });

        console.log("✅ Appointment created successfully!");
        console.log(`Appointment ID: ${appointment.id}`);

        // Verify retrieval
        const fetched = await prisma.appointment.findUnique({
            where: { id: appointment.id },
            include: { staff: true }
        });

        if (fetched && fetched.staffId === staff.id) {
            console.log(`✅ Verified: Appointment linked to ${fetched.staff?.name} (${fetched.staff?.role})`);
        } else {
            console.error("❌ Failed to verify appointment creation specifics.");
        }

        // Cleanup
        await prisma.appointment.delete({ where: { id: appointment.id } });
        console.log("Cleanup: Test appointment deleted.");

    } catch (error) {
        console.error("Failed to create appointment:", error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

main();
