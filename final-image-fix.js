const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

(async () => {
  const updates = [
    { name: 'Amalgam filling per tooth', imageUrl: '/images/services/dental_filling.png' },
    { name: 'Composite laser filling per tooth', imageUrl: '/images/services/laser_whitening.png' },
    { name: 'Gic filling per tooth', imageUrl: '/images/services/dental_filling.png' },
    { name: 'PFM Crown per unit', imageUrl: '/images/services/dental_crown.png' },
    { name: 'Temporary Filling', imageUrl: '/images/services/dental_filling.png' },
    { name: 'Zirconia Crown per unit', imageUrl: '/images/services/dental_crown.png' },
    { name: 'Zirconia e max Crown per unit', imageUrl: '/images/services/dental_veneers.png' },
  ];

  for (const u of updates) {
    const t = await p.treatment.findFirst({ where: { name: u.name } });
    if (t) {
      await p.treatment.update({
        where: { id: t.id },
        data: { imageUrl: u.imageUrl }
      });
      console.log('Updated image for: ' + u.name);
    }
  }

  process.stdout.write('Database updated successfully.\n');
  await p.$disconnect();
})();
