const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // First, show all treatments regardless of isActive status
  const all = await prisma.treatment.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, name: true, isActive: true, imageUrl: true, description: true },
  });
  
  console.log('All treatments (' + all.length + '):');
  all.forEach(t => {
    const active = t.isActive ? 'ACTIVE' : 'INACTIVE';
    const img = t.imageUrl ? 'HAS_IMAGE' : 'NO_IMAGE';
    const desc = t.description ? t.description.substring(0, 50) + '...' : 'NO_DESC';
    console.log('  [' + active + '] [' + img + '] ' + t.name + ' -> ' + desc);
  });

  // Reactivate all treatments that should be active
  const result = await prisma.treatment.updateMany({
    where: { isActive: false },
    data: { isActive: true },
  });
  console.log('\nReactivated ' + result.count + ' treatments');
  
  // Show updated count
  const activeCount = await prisma.treatment.count({ where: { isActive: true } });
  console.log('Total active treatments now: ' + activeCount);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
