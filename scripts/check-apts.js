const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const apts = await prisma.appointment.findMany({
        where: {
            startTime: {
                gte: new Date('2026-03-20T00:00:00.000Z'),
                lte: new Date('2026-03-20T23:59:59.999Z')
            }
        },
        include: {
            treatment: true
        }
    });
    console.log(JSON.stringify(apts, null, 2));
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
