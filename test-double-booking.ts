import { PrismaClient } from "@prisma/client";
import "dotenv/config";

const prisma = new PrismaClient();

async function testDoubleBooking() {
    console.log("🧪 Starting Double-Booking Test...");

    // 1. Get a staff member and a patient
    const staff = await prisma.user.findFirst({ where: { role: "STAFF" } });
    const patient = await prisma.user.findFirst({ where: { role: "PATIENT" } });
    const treatment = await prisma.treatmentOption.findFirst();

    if (!staff || !patient || !treatment) {
        console.error("❌ Pre-requisites not met: Missing staff, patient, or treatment.");
        return;
    }

    const startTime = new Date();
    startTime.setHours(10, 0, 0, 0); // Today at 10 AM
    startTime.setDate(startTime.getDate() + 1); // Tomorrow

    const endTime = new Date(startTime.getTime() + treatment.durationMin * 60000);

    console.log(`Test Parameters: Staff ${staff.name}, Time: ${startTime.toISOString()}`);

    // 2. Clear any existing appointments for this slot
    await prisma.appointment.deleteMany({
        where: {
            staffId: staff.id,
            startTime: startTime,
        },
    });

    // 3. Create First Appointment
    console.log("Attempting First Booking...");
    try {
        await prisma.appointment.create({
            data: {
                staffId: staff.id,
                patientId: patient.id,
                treatmentId: treatment.id,
                startTime: startTime,
                endTime: endTime,
                status: "SCHEDULED",
            },
        });
        console.log("✅ First booking successful.");
    } catch (error) {
        console.error("❌ First booking failed:", error);
        return;
    }

    // 4. Attempt Second Booking (Overlap)
    console.log("Attempting Second Booking (Duplicate Slot)...");

    // We need to simulate the API logic here, which uses validateSlotAvailability or the transaction logic.
    // Since we are running a script, we can just call the Prisma check directly to see if it detects it.

    const conflictingAppointment = await prisma.appointment.findFirst({
        where: {
            staffId: staff.id,
            status: { not: "CANCELLED" },
            OR: [
                { startTime: { lte: startTime }, endTime: { gt: startTime } },
                { startTime: { lt: endTime }, endTime: { gte: endTime } },
            ],
        },
    });

    if (conflictingAppointment) {
        console.log("✅ Double booking correctly detected! (Conflict found)");
    } else {
        console.error("❌ Double booking NOT detected! (No conflict found)");
    }
}

testDoubleBooking()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
