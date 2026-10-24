
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        await prisma.$connect();
        console.log('Successfully connected to the database.');

        const userCount = await prisma.user.count();
        console.log(`Current user count: ${userCount}`);

        const settings = await prisma.clinicSettings.findFirst();
        if (settings) {
            console.log(`Clinic Name in DB: ${settings.clinicName}`);
        } else {
            console.log('No clinic settings found.');
        }

    } catch (error) {
        console.error('Error connecting to the database:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
