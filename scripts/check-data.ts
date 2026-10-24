import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

import fs from 'fs';

async function main() {
    let output = '--- Database Content Verification ---\n';

    // Check Users
    const users = await prisma.user.findMany({
        select: { email: true, role: true, name: true }
    });
    output += `\nUsers (${users.length}):\n`;
    users.forEach(u => output += ` - [${u.role}] ${u.name} (${u.email})\n`);

    // Check Appointments
    const appointmentCount = await prisma.appointment.count();
    output += `\nAppointments: ${appointmentCount}\n`;

    // Check Treatments
    const treatmentCount = await prisma.treatmentOption.count();
    output += `treatmentOptions: ${treatmentCount}\n`;

    // Check Categories
    const categoryCount = await prisma.serviceCategory.count();
    output += `serviceCategories: ${categoryCount}\n`;

    // Check Clinic Settings
    const settings = await prisma.clinicSettings.findFirst();
    output += `\nClinic Settings Present: ${!!settings}\n`;
    if (settings) {
        output += ` - Name: ${settings.clinicName}\n`;
        output += ` - Email: ${settings.email}\n`;
    }

    fs.writeFileSync('e:/dentalccentre/verify-db.txt', output);
}

main()
    .catch(e => {
        console.error(e);
        fs.writeFileSync('e:/dentalccentre/verify-db.txt', 'Error: ' + e);
    })
    .finally(async () => await prisma.$disconnect());
