import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clean up in correct order (children before parents)
  await prisma.payment.deleteMany();
  await prisma.clinicalNote.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.patientTreatment.deleteMany();
  await prisma.treatment.deleteMany();
  await prisma.user.deleteMany();
  await prisma.systemSettings.deleteMany();
  await prisma.inventory.deleteMany();

  console.log('🧹 Cleaned existing data');

  // --- 1. Users ---
  const adminHash = await bcrypt.hash('admin123', 10);
  const staffHash = await bcrypt.hash('staff123', 10);
  const patientHash = await bcrypt.hash('patient123', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@elitedental.com',
      phone: '+92-300-0000001',
      password: adminHash,
      name: 'Dr. Admin',
      role: 'ADMIN',
    },
  });
  console.log(`✅ Created Admin: ${admin.email}`);

  const staff1 = await prisma.user.create({
    data: {
      email: 'staff1@elitedental.com',
      phone: '+92-300-0000002',
      password: staffHash,
      name: 'Receptionist Sarah',
      role: 'STAFF',
    },
  });
  console.log(`✅ Created Staff: ${staff1.email}`);

  const patients = [];
  const patientData = [
    { email: 'patient1@example.com', name: 'Ali Khan', phone: '+92-300-1111111' },
    { email: 'patient2@example.com', name: 'Sara Ahmed', phone: '+92-301-2222222' },
    { email: 'patient3@example.com', name: 'Fatima Khan', phone: '+92-302-3333333' },
    { email: 'patient4@example.com', name: 'Hassan Ali', phone: '+92-303-4444444' },
    { email: 'patient5@example.com', name: 'Ayesha Malik', phone: '+92-304-5555555' },
  ];

  for (const pd of patientData) {
    const p = await prisma.user.create({
      data: {
        email: pd.email,
        phone: pd.phone,
        password: patientHash,
        name: pd.name,
        role: 'PATIENT',
      },
    });
    patients.push(p);
  }
  console.log(`✅ Created ${patients.length} Patients`);

  // --- 2. Treatments (flat list, no categories) ---
  const treatmentsData = [
    { name: 'German Implant Kit', price: 80000, durationMin: 30, description: 'Premium German quality implant system with titanium posts and ceramic crowns.', instructions: 'Avoid hard foods for 2 weeks. Follow-up in 7 days.' },
    { name: 'American Implant Kit', price: 90000, durationMin: 30, description: 'Advanced American implant technology with lifetime warranty.', instructions: 'Avoid hard foods for 2 weeks. Follow-up in 7 days.' },
    { name: 'Korean Implant Kit', price: 70000, durationMin: 30, description: 'Cost-effective Korean implant system with excellent durability.', instructions: 'Avoid hard foods for 2 weeks. Follow-up in 7 days.' },
    { name: 'American Whitening Kit', price: 22000, durationMin: 30, description: 'Fast-acting American whitening formula for visible results in one session.', instructions: 'Avoid colored drinks (tea, coffee) for 48 hours.' },
    { name: 'German Whitening Kit', price: 27000, durationMin: 30, description: 'Gentle and effective German whitening technology.', instructions: 'Avoid colored drinks (tea, coffee) for 48 hours.' },
    { name: 'Laser Whitening', price: 37000, durationMin: 30, description: 'Advanced laser whitening for dramatic results up to 8 shades lighter.', instructions: 'Avoid colored drinks for 48 hours. Sensitivity is normal for 24-48 hrs.' },
    { name: 'Basic Scaling', price: 2500, durationMin: 30, description: 'Standard plaque and tartar removal for routine cleaning.' },
    { name: 'Deep Scaling', price: 5000, durationMin: 30, description: 'Thorough deep cleaning for advanced periodontal needs.' },
    { name: 'Full Mouth Scaling & Polishing', price: 7000, durationMin: 30, description: 'Complete cleaning and polishing for a fresh, healthy smile.' },
    { name: 'Single Canal RCT', price: 13000, durationMin: 30, description: 'Standard root canal therapy for single-rooted teeth.', instructions: 'Avoid chewing on treated side for 24 hours. Take prescribed painkillers.' },
    { name: 'Multi Canal RCT', price: 22000, durationMin: 30, description: 'Complex root canal for multi-rooted teeth requiring precision.', instructions: 'Avoid chewing on treated side for 24 hours. Take prescribed painkillers.' },
    { name: 'Simple Extraction', price: 4000, durationMin: 30, description: 'Routine removal of a visible erupted tooth.', instructions: 'Bite on gauze for 30 min. Soft diet for 24 hours.' },
    { name: 'Surgical Extraction', price: 10000, durationMin: 30, description: 'Complex removal of impacted or below-gumline teeth.', instructions: 'Apply ice pack. Soft diet for 48 hours. Take prescribed medications.' },
    { name: 'Wisdom Tooth Extraction', price: 13000, durationMin: 30, description: 'Specialized removal of wisdom teeth with sedation options.', instructions: 'Apply ice pack. Soft diet for 48 hours. Take prescribed medications.' },
    { name: 'Metal Braces', price: 75000, durationMin: 30, description: 'Traditional and reliable metal braces for effective alignment.' },
    { name: 'Ceramic Braces', price: 110000, durationMin: 30, description: 'Aesthetic clear ceramic braces for a discreet look.' },
    { name: 'Invisible Aligners', price: 230000, durationMin: 30, description: 'Clear removable aligners for a virtually invisible treatment.' },
    { name: 'Composite Veneer (per tooth)', price: 7000, durationMin: 30, description: 'Cost-effective and quick aesthetic enhancement per tooth.' },
    { name: 'Porcelain Veneer (per tooth)', price: 22000, durationMin: 30, description: 'High-durability porcelain veneer for a premium natural look.' },
    { name: 'Lumineers (per tooth)', price: 32000, durationMin: 30, description: 'Ultra-thin no-prep veneers for minimal tooth modification.' },
  ];

  const treatments = [];
  for (const t of treatmentsData) {
    const created = await prisma.treatment.create({
      data: {
        name: t.name,
        price: t.price,
        durationMin: t.durationMin,
        description: t.description,
        instructions: t.instructions || null,
      },
    });
    treatments.push(created);
  }
  console.log(`✅ Created ${treatments.length} Treatments`);

  // --- 3. Sample Appointments ---
  const now = new Date();

  const appointmentData = [
    // Past completed
    { daysAgo: 20, hour: 13, min: 0, patIdx: 0, treatIdx: 0, status: 'COMPLETED' as const },
    { daysAgo: 18, hour: 14, min: 30, patIdx: 1, treatIdx: 3, status: 'COMPLETED' as const },
    { daysAgo: 15, hour: 12, min: 0, patIdx: 2, treatIdx: 6, status: 'COMPLETED' as const },
    { daysAgo: 12, hour: 15, min: 0, patIdx: 3, treatIdx: 9, status: 'COMPLETED' as const },
    { daysAgo: 10, hour: 16, min: 0, patIdx: 4, treatIdx: 12, status: 'COMPLETED' as const },
    { daysAgo: 7, hour: 13, min: 30, patIdx: 0, treatIdx: 14, status: 'COMPLETED' as const },
    // Past cancelled
    { daysAgo: 5, hour: 14, min: 0, patIdx: 1, treatIdx: 17, status: 'CANCELLED' as const },
    // Future scheduled
    { daysAgo: -1, hour: 13, min: 0, patIdx: 0, treatIdx: 1, status: 'SCHEDULED' as const },
    { daysAgo: -2, hour: 15, min: 0, patIdx: 1, treatIdx: 4, status: 'SCHEDULED' as const },
    { daysAgo: -3, hour: 12, min: 0, patIdx: 3, treatIdx: 7, status: 'SCHEDULED' as const },
    { daysAgo: -5, hour: 16, min: 30, patIdx: 4, treatIdx: 10, status: 'SCHEDULED' as const },
    { daysAgo: -7, hour: 14, min: 0, patIdx: 2, treatIdx: 13, status: 'SCHEDULED' as const },
    { daysAgo: -10, hour: 12, min: 30, patIdx: 0, treatIdx: 16, status: 'SCHEDULED' as const },
    // Walk-in
    { daysAgo: 2, hour: 17, min: 0, patIdx: 2, treatIdx: 11, status: 'COMPLETED' as const, bookedBy: 'WALK_IN' as const },
  ];

  for (const apt of appointmentData) {
    const date = new Date(now);
    date.setDate(date.getDate() - apt.daysAgo);
    date.setHours(apt.hour, apt.min, 0, 0);

    const treatment = treatments[apt.treatIdx % treatments.length];
    const endTime = new Date(date);
    endTime.setMinutes(endTime.getMinutes() + treatment.durationMin);

    await prisma.appointment.create({
      data: {
        startTime: date,
        endTime: endTime,
        patientId: patients[apt.patIdx].id,
        treatmentId: treatment.id,
        status: apt.status,
        bookedBy: apt.bookedBy || 'WEBSITE',
      },
    });
  }
  console.log(`✅ Created ${appointmentData.length} Sample Appointments`);

  // --- 4. System Settings ---
  await prisma.systemSettings.create({
    data: {
      id: 'settings',
      clinicName: 'Elite Dental Centre',
      workDayStart: '12:00',
      workDayEnd: '20:00',
      slotDurationMin: 30,
    },
  });
  console.log('✅ Created System Settings');

  console.log('\n🎉 Seeding completed successfully!\n');
  console.log('Login credentials:');
  console.log('  Admin:   admin@elitedental.com / admin123');
  console.log('  Staff:   staff1@elitedental.com / staff123');
  console.log('  Patient: patient1@example.com / patient123');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
