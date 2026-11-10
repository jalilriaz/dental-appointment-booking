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
    {
      name: 'German Implant Kit',
      price: 80000,
      durationMin: 75,
      description: 'Precision German titanium fixture offering exceptional biocompatibility and osseointegration, crowned with custom handcrafted porcelain for long-lasting bite stability and natural aesthetics.',
      instructions: 'Avoid hard foods for 2 weeks. Follow-up in 7 days.',
    },
    {
      name: 'American Implant Kit',
      price: 90000,
      durationMin: 75,
      description: 'Advanced American surgical implant engineering featuring patented micro-textured titanium surface, guaranteed lifetime structural warranty, and painless 3D computer-guided sterile placement protocol.',
      instructions: 'Avoid hard foods for 2 weeks. Follow-up in 7 days.',
    },
    {
      name: 'Korean Implant Kit',
      price: 70000,
      durationMin: 75,
      description: 'Cost-effective Korean titanium dental implant delivering outstanding clinical durability, rapid bone integration, and seamless aesthetic restoration for permanent missing tooth replacement.',
      instructions: 'Avoid hard foods for 2 weeks. Follow-up in 7 days.',
    },
    {
      name: 'American Whitening Kit',
      price: 22000,
      durationMin: 60,
      description: 'Fast-acting American clinical whitening formula that safely dissolves deep enamel stains, brightening your smile up to six shades in one session.',
      instructions: 'Avoid colored drinks (tea, coffee) for 48 hours.',
    },
    {
      name: 'German Whitening Kit',
      price: 27000,
      durationMin: 60,
      description: 'Gentle and effective German whitening technology formulated with enamel-protecting minerals to prevent tooth sensitivity while delivering vibrant, long-lasting cosmetic smile radiance.',
      instructions: 'Avoid colored drinks (tea, coffee) for 48 hours.',
    },
    {
      name: 'Laser Whitening',
      price: 37000,
      durationMin: 60,
      description: 'State-of-the-art medical laser activation system accelerating specialized whitening gel, dramatically lifting stubborn discolouration up to eight shades in forty-five minutes.',
      instructions: 'Avoid colored drinks for 48 hours. Sensitivity is normal for 24-48 hrs.',
    },
    {
      name: 'Basic Scaling',
      price: 2500,
      durationMin: 45,
      description: 'Standard ultrasonic scaling and gentle prophylactic polishing that effectively removes hardened tartar, plaque deposits, and surface stains to maintain healthy gums.',
    },
    {
      name: 'Deep Scaling',
      price: 5000,
      durationMin: 60,
      description: 'Thorough periodontal root planing and subgingival debridement designed to eliminate deep bacterial pockets, halt gum recession, and restore periodontal tissue health.',
    },
    {
      name: 'Full Mouth Scaling & Polishing',
      price: 7000,
      durationMin: 60,
      description: 'Comprehensive full-mouth ultrasonic scaling combined with high-gloss prophy-jet air polishing and protective fluoride treatment for total freshness and superior oral hygiene.',
    },
    {
      name: 'Single Canal RCT',
      price: 13000,
      durationMin: 60,
      description: 'Gentle single-sitting root canal treatment for anterior teeth using computerized rotary files, sterile irrigation, and bioceramic sealing to relieve tooth pain.',
      instructions: 'Avoid chewing on treated side for 24 hours. Take prescribed painkillers.',
    },
    {
      name: 'Multi Canal RCT',
      price: 22000,
      durationMin: 75,
      description: 'Microscopic endodontic therapy for complex multi-rooted molars, meticulously cleaning curved root canals, eliminating deep infection, and preserving your natural molar tooth.',
      instructions: 'Avoid chewing on treated side for 24 hours. Take prescribed painkillers.',
    },
    {
      name: 'Simple Extraction',
      price: 4000,
      durationMin: 45,
      description: 'Gentle and atraumatic removal of damaged or unrestorable visible teeth performed under painless local anesthesia with rapid recovery socket preservation care.',
      instructions: 'Bite on gauze for 30 min. Soft diet for 24 hours.',
    },
    {
      name: 'Surgical Extraction',
      price: 10000,
      durationMin: 60,
      description: 'Precision surgical removal of broken or severely fractured roots below gum line, using delicate sectioning techniques, sterile irrigation, and dissolvable microsutures.',
      instructions: 'Apply ice pack. Soft diet for 48 hours. Take prescribed medications.',
    },
    {
      name: 'Wisdom Tooth Extraction',
      price: 13000,
      durationMin: 75,
      description: 'Specialized surgical extraction of impacted third molars, safely relieving jaw stiffness, swelling, and crowding through modern pain-free techniques and guided recovery.',
      instructions: 'Apply ice pack. Soft diet for 48 hours. Take prescribed medications.',
    },
    {
      name: 'Metal Braces',
      price: 75000,
      durationMin: 60,
      description: 'Time-tested high-grade stainless steel orthodontic brackets delivering precise arch realignment, bite correction, and lasting smile symmetry for patients of all ages.',
    },
    {
      name: 'Ceramic Braces',
      price: 110000,
      durationMin: 60,
      description: 'Aesthetic tooth-colored ceramic brackets that blend naturally with your teeth, providing powerful bite alignment with enhanced cosmetic discretion throughout orthodontic treatment.',
    },
    {
      name: 'Invisible Aligners',
      price: 230000,
      durationMin: 45,
      description: 'Custom 3D-scanned clear removable aligner trays that straighten teeth discreetly without metal wires, allowing effortless brushing and unrestricted daily dietary freedom.',
    },
    {
      name: 'Composite Veneer (per tooth)',
      price: 7000,
      durationMin: 60,
      description: 'Direct composite resin sculpting performed in a single visit, seamlessly correcting chipped enamel, minor gaps, and discoloration for an instant smile makeover.',
    },
    {
      name: 'Porcelain Veneer (per tooth)',
      price: 22000,
      durationMin: 60,
      description: 'Handcrafted ultra-durable porcelain shells custom-bonded to anterior teeth for lifelike optical translucency, stain resistance, and a permanently radiant red-carpet smile.',
    },
    {
      name: 'Lumineers (per tooth)',
      price: 32000,
      durationMin: 60,
      description: 'Ultra-thin contact-lens-like porcelain veneers placed with minimal to zero enamel shaving, preserving natural tooth structure while achieving remarkable cosmetic perfection.',
    },
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
