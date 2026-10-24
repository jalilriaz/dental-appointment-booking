const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function main() {
  const treatments = await p.treatment.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, name: true, imageUrl: true, isActive: true }
  });
  console.log(JSON.stringify(treatments, null, 2));
  await p.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
