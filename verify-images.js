const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const treatments = await prisma.treatment.findMany({
    orderBy: { name: 'asc' },
    select: { name: true, imageUrl: true },
  });
  treatments.forEach(t => {
    console.log(`${t.name}: ${t.imageUrl || 'NO IMAGE'}`);
  });
  console.log(`\nTotal: ${treatments.length} treatments`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
