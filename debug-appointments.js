const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkAppointments() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const appointments = await prisma.appointment.findMany({
        orderBy: { startTime: 'desc' },
        take: 5,
        include: { treatment: true }
    });

    console.log("Recent 5 appointments in DB:");
    appointments.forEach((apt, i) => {
        console.log(`[${i}] ID: ${apt.id}`);
        console.log(`    Status: ${apt.status}`);
        console.log(`    Treatment: ${apt.treatment.name} (${apt.treatment.durationMin} min)`);
        console.log(`    startTime (raw UTC): ${apt.startTime.toISOString()}`);
        console.log(`    endTime (raw UTC): ${apt.endTime.toISOString()}`);
        console.log(`    startTime local (.toString()): ${apt.startTime.toString()}`);
        console.log(`    endTime local (.toString()): ${apt.endTime.toString()}`);
        console.log(`    Local hours via getHours(): ${apt.startTime.getHours()}:${apt.startTime.getMinutes()}`);
        console.log('-----------------------------------');
    });
}

checkAppointments().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
