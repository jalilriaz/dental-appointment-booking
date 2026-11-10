require('dotenv').config({ path: __dirname + '/../.env' });
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Connecting to database...');

  // 1. Delete dependent child records
  const deletedPayments = await prisma.payment.deleteMany();
  console.log(`🗑️ Deleted ${deletedPayments.count} payments`);

  const deletedNotes = await prisma.clinicalNote.deleteMany();
  console.log(`🗑️ Deleted ${deletedNotes.count} clinical notes`);

  const deletedAppointments = await prisma.appointment.deleteMany();
  console.log(`🗑️ Deleted ${deletedAppointments.count} appointments`);

  const deletedChangeLogs = await prisma.planChangeLog.deleteMany();
  console.log(`🗑️ Deleted ${deletedChangeLogs.count} treatment plan change logs`);

  const deletedPlans = await prisma.patientTreatment.deleteMany();
  console.log(`🗑️ Deleted ${deletedPlans.count} patient treatment plans`);

  // 2. Delete only PATIENT users (keep ADMIN and STAFF)
  const deletedPatients = await prisma.user.deleteMany({
    where: { role: 'PATIENT' },
  });
  console.log(`🗑️ Deleted ${deletedPatients.count} patient user accounts`);

  // 3. Confirm remaining users and treatments
  const remainingStaff = await prisma.user.findMany({
    select: { name: true, email: true, role: true },
  });
  const treatmentCount = await prisma.treatment.count();

  console.log('\n✅ Portal mock data cleared successfully!');
  console.log('Preserved staff/admin accounts:', remainingStaff);
  console.log(`Preserved dental treatments catalog: ${treatmentCount} treatments`);
}

main()
  .catch((err) => {
    console.error('❌ Error clearing mock data:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

