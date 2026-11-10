require('dotenv').config({ path: __dirname + '/../.env' });
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// ─── 73 Authentic Clinical Patient Profiles (30 Previous + 43 New) ───
const PATIENT_PROFILES = [
  // 1-10
  { name: "Hamza Tariq", phone: "+92-300-1122334", email: "hamza.tariq@gmail.com", gender: "Male", dob: "1992-04-15", address: "Sector F-10/2, Islamabad", alert: "Penicillin allergy - use Clindamycin" },
  { name: "Zainab Bibi", phone: "+92-301-2233445", email: "zainab.bibi@yahoo.com", gender: "Female", dob: "1988-11-20", address: "G-11/3, Islamabad", alert: null },
  { name: "Bilal Butt", phone: "+92-302-3344556", email: "bilal.butt@hotmail.com", gender: "Male", dob: "1995-07-08", address: "Bahria Town Phase 4, Rawalpindi", alert: "Hypertensive (on Amlodipine 5mg)" },
  { name: "Ayesha Farooq", phone: "+92-303-4455667", email: "ayesha.f@gmail.com", gender: "Female", dob: "2001-02-14", address: "DHA Phase 2, Islamabad", alert: null },
  { name: "Usman Javed", phone: "+92-304-5566778", email: "usman.javed@outlook.com", gender: "Male", dob: "1984-09-30", address: "Sector E-11/1, Islamabad", alert: "Type 2 Diabetic (HbA1c 6.8)" },
  { name: "Sana Mir", phone: "+92-305-6677889", email: "sana.mir@gmail.com", gender: "Female", dob: "1997-05-18", address: "Saddar, Rawalpindi", alert: null },
  { name: "Daniyal Qureshi", phone: "+92-306-7788990", email: "daniyal.q@gmail.com", gender: "Male", dob: "1990-12-05", address: "F-8/4, Islamabad", alert: "Asthmatic - carries Salbutamol inhaler" },
  { name: "Mahnoor Shah", phone: "+92-307-8899001", email: "mahnoor.shah@yahoo.com", gender: "Female", dob: "1999-03-25", address: "Chaklala Scheme 3, Rawalpindi", alert: null },
  { name: "Omer Farooq", phone: "+92-308-9900112", email: "omer.farooq@gmail.com", gender: "Male", dob: "1981-06-12", address: "Sector I-8/2, Islamabad", alert: null },
  { name: "Rabia Basri", phone: "+92-309-0011223", email: "rabia.basri@hotmail.com", gender: "Female", dob: "1976-10-09", address: "Westridge 1, Rawalpindi", alert: "Mild cardiac arrhythmia" },

  // 11-20
  { name: "Mustafa Kamal", phone: "+92-310-1234567", email: "mustafa.k@gmail.com", gender: "Male", dob: "1993-08-22", address: "Sector F-11/3, Islamabad", alert: null },
  { name: "Iqra Aziz", phone: "+92-311-2345678", email: "iqra.aziz@outlook.com", gender: "Female", dob: "2002-01-19", address: "Askari 14, Rawalpindi", alert: null },
  { name: "Haris Rauf", phone: "+92-312-3456789", email: "haris.rauf@gmail.com", gender: "Male", dob: "1994-11-07", address: "Sector G-9/1, Islamabad", alert: "Latex sensitivity" },
  { name: "Maryam Nawazish", phone: "+92-313-4567890", email: "maryam.nawazish@gmail.com", gender: "Female", dob: "1987-04-03", address: "Satellite Town, Rawalpindi", alert: null },
  { name: "Shahbaz Ahmed", phone: "+92-314-5678901", email: "shahbaz.ahmed@yahoo.com", gender: "Male", dob: "1980-08-16", address: "Sector F-7/2, Islamabad", alert: "Diabetic - requires morning appointments" },
  { name: "Arham Khan", phone: "+92-315-6789012", email: "arham.khan@gmail.com", gender: "Male", dob: "2000-09-11", address: "Bahria Phase 7, Rawalpindi", alert: null },
  { name: "Hira Mani", phone: "+92-316-7890123", email: "hira.mani@gmail.com", gender: "Female", dob: "1996-12-28", address: "Sector G-13/4, Islamabad", alert: null },
  { name: "Rehan Chaudhry", phone: "+92-317-8901234", email: "rehan.c@outlook.com", gender: "Male", dob: "1979-05-14", address: "Sector B-17, Islamabad", alert: "Aspirin blood thinner therapy" },
  { name: "Anum Fayyaz", phone: "+92-318-9012345", email: "anum.fayyaz@gmail.com", gender: "Female", dob: "1998-07-21", address: "Media Town, Rawalpindi", alert: null },
  { name: "Zeeshan Siddiqui", phone: "+92-319-0123456", email: "zeeshan.s@gmail.com", gender: "Male", dob: "1991-03-09", address: "Sector I-10/1, Islamabad", alert: null },

  // 21-30
  { name: "Khadija Aslam", phone: "+92-320-1122335", email: "khadija.aslam@yahoo.com", gender: "Female", dob: "1983-10-17", address: "PWD Housing Society, Islamabad", alert: null },
  { name: "Fahad Mustafa", phone: "+92-321-2233446", email: "fahad.mustafa@gmail.com", gender: "Male", dob: "1986-06-26", address: "Sector F-6/1, Islamabad", alert: "Gag reflex sensitivity" },
  { name: "Nida Yasir", phone: "+92-322-3344557", email: "nida.yasir@hotmail.com", gender: "Female", dob: "1978-02-11", address: "Gulberg Greens, Islamabad", alert: null },
  { name: "Babar Azam", phone: "+92-323-4455668", email: "babar.azam@gmail.com", gender: "Male", dob: "1994-10-15", address: "DHA Phase 1, Rawalpindi", alert: null },
  { name: "Sajal Aly", phone: "+92-324-5566779", email: "sajal.aly@gmail.com", gender: "Female", dob: "1994-01-17", address: "Sector E-7, Islamabad", alert: null },
  { name: "Imran Abbas", phone: "+92-325-6677880", email: "imran.abbas@outlook.com", gender: "Male", dob: "1982-10-15", address: "Bahria Phase 8, Rawalpindi", alert: "Dental phobia - needs gentle pacing" },
  { name: "Mehwish Hayat", phone: "+92-326-7788991", email: "mehwish.h@yahoo.com", gender: "Female", dob: "1990-01-06", address: "Sector G-10/2, Islamabad", alert: null },
  { name: "Ahsan Khan", phone: "+92-327-8899002", email: "ahsan.khan@gmail.com", gender: "Male", dob: "1985-11-23", address: "Sector F-10/4, Islamabad", alert: null },
  { name: "Yumna Zaidi", phone: "+92-328-9900113", email: "yumna.zaidi@gmail.com", gender: "Female", dob: "1993-07-30", address: "Sector H-13, Islamabad", alert: null },
  { name: "Waqas Shafi", phone: "+92-329-0011224", email: "waqas.shafi@gmail.com", gender: "Male", dob: "1989-04-12", address: "Westridge 3, Rawalpindi", alert: null },

  // 31-40 (43 New Starts Here)
  { name: "Tariq Jamil", phone: "+92-330-1122336", email: "tariq.jamil@gmail.com", gender: "Male", dob: "1965-03-12", address: "Sector F-8/1, Islamabad", alert: "Cardiac pacemaker in situ" },
  { name: "Bushra Ansari", phone: "+92-331-2233447", email: "bushra.ansari@gmail.com", gender: "Female", dob: "1974-06-25", address: "Sector F-11/2, Islamabad", alert: null },
  { name: "Asim Azhar", phone: "+92-332-3344558", email: "asim.azhar@outlook.com", gender: "Male", dob: "1996-10-29", address: "DHA Phase 1, Islamabad", alert: null },
  { name: "Momina Mustehsan", phone: "+92-333-4455669", email: "momina.m@gmail.com", gender: "Female", dob: "1992-09-05", address: "Sector E-7, Islamabad", alert: "Sulfa drug allergy" },
  { name: "Atif Aslam", phone: "+92-334-5566770", email: "atif.aslam@yahoo.com", gender: "Male", dob: "1983-03-12", address: "Bahria Town Phase 6, Rawalpindi", alert: null },
  { name: "Sanam Saeed", phone: "+92-335-6677881", email: "sanam.saeed@gmail.com", gender: "Female", dob: "1985-02-02", address: "Sector F-6/3, Islamabad", alert: null },
  { name: "Fawad Khan", phone: "+92-336-7788992", email: "fawad.khan@gmail.com", gender: "Male", dob: "1981-11-29", address: "Sector F-7/4, Islamabad", alert: "Type 1 Diabetic (Insulin dependent)" },
  { name: "Mahira Khan", phone: "+92-337-8899003", email: "mahira.k@yahoo.com", gender: "Female", dob: "1984-12-21", address: "Sector F-10/1, Islamabad", alert: null },
  { name: "Humayun Saeed", phone: "+92-338-9900114", email: "humayun.s@gmail.com", gender: "Male", dob: "1971-07-27", address: "G-10/4, Islamabad", alert: "Hypertension on ACE inhibitor" },
  { name: "Ayeza Khan", phone: "+92-339-0011225", email: "ayeza.khan@hotmail.com", gender: "Female", dob: "1991-01-15", address: "Sector G-11/1, Islamabad", alert: null },

  // 41-50
  { name: "Danish Taimoor", phone: "+92-340-1234568", email: "danish.t@gmail.com", gender: "Male", dob: "1983-02-16", address: "Sector G-13/2, Islamabad", alert: null },
  { name: "Kinza Hashmi", phone: "+92-341-2345679", email: "kinza.h@outlook.com", gender: "Female", dob: "1997-03-07", address: "Bahria Phase 3, Rawalpindi", alert: null },
  { name: "Feroze Khan", phone: "+92-342-3456780", email: "feroze.k@gmail.com", gender: "Male", dob: "1990-07-11", address: "Westridge 2, Rawalpindi", alert: "Asthma - mild exercise induced" },
  { name: "Sarah Khan", phone: "+92-343-4567891", email: "sarah.khan@gmail.com", gender: "Female", dob: "1992-07-14", address: "Sector I-8/3, Islamabad", alert: null },
  { name: "Falak Shabir", phone: "+92-344-5678902", email: "falak.s@yahoo.com", gender: "Male", dob: "1985-12-27", address: "Sector I-9/4, Islamabad", alert: null },
  { name: "Sonya Hussyn", phone: "+92-345-6789013", email: "sonya.h@gmail.com", gender: "Female", dob: "1991-07-15", address: "Sector F-8/2, Islamabad", alert: null },
  { name: "Bilal Abbas", phone: "+92-346-7890124", email: "bilal.abbas@gmail.com", gender: "Male", dob: "1993-06-04", address: "Sector G-9/3, Islamabad", alert: null },
  { name: "Ramsha Khan", phone: "+92-347-8901235", email: "ramsha.k@outlook.com", gender: "Female", dob: "1994-06-23", address: "Media Town, Rawalpindi", alert: null },
  { name: "Ahad Raza Mir", phone: "+92-348-9012346", email: "ahad.mir@gmail.com", gender: "Male", dob: "1993-09-29", address: "DHA Phase 2, Islamabad", alert: null },
  { name: "Yumna Khan", phone: "+92-349-0123457", email: "yumna.khan@gmail.com", gender: "Female", dob: "1996-08-14", address: "Bahria Phase 5, Rawalpindi", alert: "Erythromycin allergy" },

  // 51-60
  { name: "Sheheryar Munawar", phone: "+92-350-1122336", email: "sheheryar.m@yahoo.com", gender: "Male", dob: "1988-08-09", address: "Sector F-7/1, Islamabad", alert: null },
  { name: "Maya Ali", phone: "+92-351-2233447", email: "maya.ali@gmail.com", gender: "Female", dob: "1989-07-27", address: "Sector F-11/4, Islamabad", alert: null },
  { name: "Wahaj Ali", phone: "+92-352-3344558", email: "wahaj.ali@hotmail.com", gender: "Male", dob: "1988-12-01", address: "Sector G-10/3, Islamabad", alert: "Mild dental anxiety" },
  { name: "Hania Aamir", phone: "+92-353-4455669", email: "hania.aamir@gmail.com", gender: "Female", dob: "1997-02-12", address: "Sector E-11/2, Islamabad", alert: null },
  { name: "Farhan Saeed", phone: "+92-354-5566770", email: "farhan.saeed@gmail.com", gender: "Male", dob: "1984-09-14", address: "Sector G-11/4, Islamabad", alert: null },
  { name: "Urwa Hocane", phone: "+92-355-6677881", email: "urwa.h@outlook.com", gender: "Female", dob: "1991-07-02", address: "Sector F-6/2, Islamabad", alert: null },
  { name: "Mawra Hocane", phone: "+92-356-7788992", email: "mawra.h@gmail.com", gender: "Female", dob: "1992-09-28", address: "Sector F-6/2, Islamabad", alert: null },
  { name: "Imran Ashraf", phone: "+92-357-8899003", email: "imran.ashraf@gmail.com", gender: "Male", dob: "1989-09-11", address: "Sector I-8/1, Islamabad", alert: null },
  { name: "Saba Qamar", phone: "+92-358-9900114", email: "saba.qamar@yahoo.com", gender: "Female", dob: "1984-04-05", address: "Sector F-8/3, Islamabad", alert: "Codeine allergy" },
  { name: "Zahid Ahmed", phone: "+92-359-0011225", email: "zahid.ahmed@gmail.com", gender: "Male", dob: "1984-09-20", address: "Satellite Town, Rawalpindi", alert: null },

  // 61-73
  { name: "Sanam Baloch", phone: "+92-360-1234569", email: "sanam.baloch@gmail.com", gender: "Female", dob: "1986-07-14", address: "Bahria Phase 1, Rawalpindi", alert: null },
  { name: "Mikaal Zulfiqar", phone: "+92-361-2345670", email: "mikaal.z@gmail.com", gender: "Male", dob: "1981-09-05", address: "Sector F-10/3, Islamabad", alert: null },
  { name: "Syra Yousuf", phone: "+92-362-3456781", email: "syra.yousuf@outlook.com", gender: "Female", dob: "1988-04-20", address: "Sector F-7/3, Islamabad", alert: null },
  { name: "Shehzad Roy", phone: "+92-363-4567892", email: "shehzad.roy@gmail.com", gender: "Male", dob: "1977-02-16", address: "DHA Phase 3, Islamabad", alert: "Penicillin allergy" },
  { name: "Hadiqa Kiani", phone: "+92-364-5678903", email: "hadiqa.k@yahoo.com", gender: "Female", dob: "1974-08-11", address: "Sector E-7, Islamabad", alert: null },
  { name: "Ali Zafar", phone: "+92-365-6789014", email: "ali.zafar@gmail.com", gender: "Male", dob: "1980-05-18", address: "Sector F-8/4, Islamabad", alert: null },
  { name: "Aima Baig", phone: "+92-366-7890125", email: "aima.baig@gmail.com", gender: "Female", dob: "1995-03-10", address: "Bahria Phase 4, Rawalpindi", alert: null },
  { name: "Asad Siddiqui", phone: "+92-367-8901236", email: "asad.s@gmail.com", gender: "Male", dob: "1987-04-15", address: "Sector G-13/1, Islamabad", alert: null },
  { name: "Zara Noor Abbas", phone: "+92-368-9012347", email: "zara.noor@outlook.com", gender: "Female", dob: "1991-03-13", address: "Sector G-10/1, Islamabad", alert: null },
  { name: "Osman Khalid Butt", phone: "+92-369-0123458", email: "osman.kb@gmail.com", gender: "Male", dob: "1986-02-09", address: "Sector F-11/1, Islamabad", alert: null },
  { name: "Neelam Muneer", phone: "+92-370-1122337", email: "neelam.m@yahoo.com", gender: "Female", dob: "1992-03-20", address: "Sector I-10/2, Islamabad", alert: null },
  { name: "Muneeb Butt", phone: "+92-371-2233448", email: "muneeb.butt@gmail.com", gender: "Male", dob: "1992-04-14", address: "Sector G-11/2, Islamabad", alert: null },
  { name: "Aiman Khan", phone: "+92-372-3344559", email: "aiman.khan@gmail.com", gender: "Female", dob: "1998-11-20", address: "DHA Phase 1, Islamabad", alert: null },
];

async function main() {
  console.log('🚀 Starting Comprehensive Dental Data Population...');
  console.log(`🎯 Target: ${PATIENT_PROFILES.length} Patients & 150 Clinical Appointments`);

  // Ensure Admin & Staff exist
  const adminHash = await bcrypt.hash('admin123', 10);
  const staffHash = await bcrypt.hash('staff123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@elitedental.com' },
    update: {},
    create: {
      email: 'admin@elitedental.com',
      phone: '+92-300-0000001',
      password: adminHash,
      name: 'Dr. Admin',
      role: 'ADMIN',
    },
  });

  const staff = await prisma.user.upsert({
    where: { email: 'staff1@elitedental.com' },
    update: {},
    create: {
      email: 'staff1@elitedental.com',
      phone: '+92-300-0000002',
      password: staffHash,
      name: 'Receptionist Sarah',
      role: 'STAFF',
    },
  });

  console.log(`✅ Admin (${admin.email}) and Staff (${staff.email}) ready.`);

  // Load available treatments
  const treatments = await prisma.treatment.findMany();
  if (treatments.length === 0) {
    console.error('❌ No treatments found! Please seed treatments first.');
    return;
  }
  console.log(`ℹ️ Found ${treatments.length} treatments in database.`);

  const patientHash = await bcrypt.hash('patient123', 10);
  const createdPatients = [];

  // 1. Create or Update 73 Patients
  console.log(`👤 Seeding ${PATIENT_PROFILES.length} clinical patient profiles...`);
  for (let i = 0; i < PATIENT_PROFILES.length; i++) {
    const p = PATIENT_PROFILES[i];
    const patientCode = 1000 + i;
    const noShow = (i === 4 || i === 12 || i === 42) ? (i % 2 + 1) : 0;

    const created = await prisma.user.upsert({
      where: { email: p.email },
      update: {
        name: p.name,
        phone: p.phone,
        address: p.address,
        medicalAlerts: p.alert,
        dateOfBirth: new Date(p.dob),
        gender: p.gender,
        patientCode: patientCode,
        noShowCount: noShow,
      },
      create: {
        email: p.email,
        phone: p.phone,
        password: patientHash,
        name: p.name,
        role: 'PATIENT',
        address: p.address,
        medicalAlerts: p.alert,
        dateOfBirth: new Date(p.dob),
        gender: p.gender,
        patientCode: patientCode,
        noShowCount: noShow,
      },
    });
    createdPatients.push(created);
  }
  console.log(`✅ ${createdPatients.length} Patients ready.`);

  // Purge prior appointments and dependent records to create clean 150-record dataset
  console.log('🧹 Purging prior appointments and payments...');
  await prisma.payment.deleteMany();
  await prisma.clinicalNote.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.planChangeLog.deleteMany();
  await prisma.patientTreatment.deleteMany();

  // Helper date function in working hours (12:00 PM to 7:30 PM)
  function createSlotDate(daysOffset, hour, minute) {
    const d = new Date();
    d.setDate(d.getDate() + daysOffset);
    d.setHours(hour, minute, 0, 0);
    // If Sunday, shift to Monday (+1 day)
    if (d.getDay() === 0) {
      d.setDate(d.getDate() + 1);
    }
    return d;
  }

  // 2. Multi-Session Treatment Plans Setup
  console.log('🦷 Creating multi-session treatment plans with installment payments...');

  // Plan 1: Invisible Aligners (Ayesha Farooq - #3)
  const alignerTreatment = treatments.find(t => t.name.includes('Aligner')) || treatments[0];
  const planAligner = await prisma.patientTreatment.create({
    data: {
      patientId: createdPatients[3].id,
      treatmentId: alignerTreatment.id,
      totalCost: 230000,
      totalSessions: 4,
      clinicalStatus: 'IN_PROGRESS',
      financialStatus: 'PARTIALLY_PAID',
    },
  });

  // Plan 2: German Implant Kit (Bilal Butt - #2)
  const implantTreatment = treatments.find(t => t.name.includes('German Implant')) || treatments[0];
  const planImplant = await prisma.patientTreatment.create({
    data: {
      patientId: createdPatients[2].id,
      treatmentId: implantTreatment.id,
      totalCost: 80000,
      totalSessions: 3,
      clinicalStatus: 'IN_PROGRESS',
      financialStatus: 'PARTIALLY_PAID',
    },
  });

  // Plan 3: Multi-Canal RCT (Usman Javed - #4)
  const rctTreatment = treatments.find(t => t.name.includes('Multi Canal RCT')) || treatments[1];
  const planRct = await prisma.patientTreatment.create({
    data: {
      patientId: createdPatients[4].id,
      treatmentId: rctTreatment.id,
      totalCost: 22000,
      totalSessions: 2,
      clinicalStatus: 'COMPLETED',
      financialStatus: 'FULLY_PAID',
    },
  });

  // Plan 4: Ceramic Braces (Kinza Hashmi - #41)
  const ceramicBracesTreatment = treatments.find(t => t.name.includes('Ceramic Braces')) || treatments[2];
  const planBraces = await prisma.patientTreatment.create({
    data: {
      patientId: createdPatients[41].id,
      treatmentId: ceramicBracesTreatment.id,
      totalCost: 110000,
      totalSessions: 6,
      clinicalStatus: 'IN_PROGRESS',
      financialStatus: 'PARTIALLY_PAID',
    },
  });

  // Plan 5: American Implant Kit (Babar Azam - #23)
  const americanImplant = treatments.find(t => t.name.includes('American Implant')) || treatments[0];
  const planAmericanImplant = await prisma.patientTreatment.create({
    data: {
      patientId: createdPatients[23].id,
      treatmentId: americanImplant.id,
      totalCost: 90000,
      totalSessions: 3,
      clinicalStatus: 'IN_PROGRESS',
      financialStatus: 'PARTIALLY_PAID',
    },
  });

  // Plan 6: Porcelain Veneers Smile Makeover (Maya Ali - #51)
  const veneerTreatment = treatments.find(t => t.name.includes('Porcelain Veneer')) || treatments[3];
  const planVeneers = await prisma.patientTreatment.create({
    data: {
      patientId: createdPatients[51].id,
      treatmentId: veneerTreatment.id,
      totalCost: 88000,
      totalSessions: 3,
      clinicalStatus: 'IN_PROGRESS',
      financialStatus: 'PARTIALLY_PAID',
    },
  });

  // 3. Construct 150 Clinically Structured Appointments
  console.log('📅 Constructing 150 diverse clinical appointments...');

  const APPOINTMENT_BLUEPRINTS = [];

  // Helper arrays for deterministic generator
  const treatmentKeywords = [
    "Basic Scaling", "Deep Scaling", "Full Mouth Scaling & Polishing",
    "American Whitening Kit", "German Whitening Kit", "Laser Whitening",
    "Single Canal RCT", "Multi Canal RCT",
    "Simple Extraction", "Surgical Extraction", "Wisdom Tooth Extraction",
    "German Implant Kit", "American Implant Kit", "Korean Implant Kit",
    "Composite Veneer", "Porcelain Veneer", "Lumineers",
    "Metal Braces", "Ceramic Braces", "Invisible Aligners"
  ];

  const bookingSources = ["WEBSITE", "WALK_IN", "WHATSAPP_BOT"];

  // ─── A. 88 Past Completed Appointments (Days -90 to -1) ───
  for (let i = 0; i < 88; i++) {
    const daysAgo = -Math.floor(1 + (i * 1.02)); // spread across -1 to -90 days
    const hour = 12 + (i % 7); // 12, 13, 14, 15, 16, 17, 18
    const min = (i % 2 === 0) ? 0 : 30;
    const pIdx = i % createdPatients.length;
    const tKeyword = treatmentKeywords[i % treatmentKeywords.length];
    const source = bookingSources[i % bookingSources.length];

    // Check if this appointment fits into one of our multi-session plans
    let planId = null;
    let sNum = null;
    let sLabel = null;

    if (pIdx === 2 && i < 20) {
      planId = planImplant.id;
      sNum = 1;
      sLabel = "Session 1: Implant Fixture Placement (Site #36)";
    } else if (pIdx === 3 && i < 30) {
      planId = planAligner.id;
      sNum = 1;
      sLabel = "Session 1: Digital Arch Scan & Attachments";
    } else if (pIdx === 4 && i < 15) {
      planId = planRct.id;
      sNum = 1;
      sLabel = "Session 1: Biomechanical Rotary Preparation";
    } else if (pIdx === 41 && i < 40) {
      planId = planBraces.id;
      sNum = 1;
      sLabel = "Session 1: Bracket Bonding & Initial Archwire";
    } else if (pIdx === 23 && i < 35) {
      planId = planAmericanImplant.id;
      sNum = 1;
      sLabel = "Session 1: 3D Computer-Guided Implant Placement";
    } else if (pIdx === 51 && i < 50) {
      planId = planVeneers.id;
      sNum = 1;
      sLabel = "Session 1: Aesthetic Mockup & Minimal Prep";
    }

    APPOINTMENT_BLUEPRINTS.push({
      days: daysAgo,
      hour,
      min,
      pIdx,
      tName: tKeyword,
      status: "COMPLETED",
      source,
      disc: (i % 7 === 0) ? 2000 : 0,
      planId,
      sNum,
      sLabel,
      note: `Procedure performed under sterile clinical protocol. Patient reported complete comfort. Post-op review in order.`
    });
  }

  // ─── B. 7 Today's Appointments (Day 0) ───
  APPOINTMENT_BLUEPRINTS.push(
    { days: 0, hour: 12, min: 0, pIdx: 25, tName: "American Whitening Kit", status: "COMPLETED", source: "WEBSITE", note: "Morning whitening session completed. Shade improved by 6 tones." },
    { days: 0, hour: 13, min: 0, pIdx: 26, tName: "Basic Scaling", status: "COMPLETED", source: "WEBSITE", note: "Full oral scaling and gentle prophy polish completed." },
    { days: 0, hour: 14, min: 0, pIdx: 2, tName: "German Implant Kit", status: "SCHEDULED", source: "WALK_IN", planId: planImplant.id, sNum: 2, sLabel: "Session 2: Soft Tissue Healing Abutment Check" },
    { days: 0, hour: 15, min: 30, pIdx: 27, tName: "Wisdom Tooth Extraction", status: "SCHEDULED", source: "WHATSAPP_BOT" },
    { days: 0, hour: 16, min: 30, pIdx: 41, tName: "Ceramic Braces", status: "SCHEDULED", source: "WEBSITE", planId: planBraces.id, sNum: 2, sLabel: "Session 2: Archwire Tightening & O-Ring Change" },
    { days: 0, hour: 17, min: 30, pIdx: 30, tName: "Simple Extraction", status: "SCHEDULED", source: "WALK_IN" },
    { days: 0, hour: 18, min: 30, pIdx: 35, tName: "Laser Whitening", status: "SCHEDULED", source: "WEBSITE" }
  );

  // ─── C. 35 Upcoming Future Appointments (Days +1 to +25) ───
  for (let i = 0; i < 35; i++) {
    const daysAhead = Math.floor(1 + (i * 0.7)); // spread over +1 to +25 days
    const hour = 12 + (i % 7);
    const min = (i % 2 === 0) ? 30 : 0;
    const pIdx = (30 + i) % createdPatients.length;
    const tKeyword = treatmentKeywords[(i + 5) % treatmentKeywords.length];
    const source = bookingSources[(i + 1) % bookingSources.length];

    let planId = null;
    let sNum = null;
    let sLabel = null;

    if (pIdx === 3) {
      planId = planAligner.id;
      sNum = 2;
      sLabel = "Session 2: Trays 5-10 Delivery & Progress Tracking";
    } else if (pIdx === 23) {
      planId = planAmericanImplant.id;
      sNum = 2;
      sLabel = "Session 2: Osseointegration Check & Abutment Seating";
    } else if (pIdx === 51) {
      planId = planVeneers.id;
      sNum = 2;
      sLabel = "Session 2: Veneer Cementation & Bite Occlusion";
    }

    APPOINTMENT_BLUEPRINTS.push({
      days: daysAhead,
      hour,
      min,
      pIdx,
      tName: tKeyword,
      status: "SCHEDULED",
      source,
      planId,
      sNum,
      sLabel
    });
  }

  // ─── D. 12 No-Shows (Missed Appointments) ───
  const noShowDays = [-75, -64, -55, -48, -39, -31, -22, -18, -14, -10, -6, -2];
  for (let i = 0; i < 12; i++) {
    APPOINTMENT_BLUEPRINTS.push({
      days: noShowDays[i],
      hour: 14 + (i % 4),
      min: (i % 2 === 0) ? 0 : 30,
      pIdx: (i * 3 + 4) % createdPatients.length,
      tName: treatmentKeywords[(i * 2) % treatmentKeywords.length],
      status: "NO_SHOW",
      source: bookingSources[i % bookingSources.length]
    });
  }

  // ─── E. 8 Cancellations (Advance Notice) ───
  const cancelDays = [-80, -60, -45, -33, -20, -11, -4, 5];
  for (let i = 0; i < 8; i++) {
    APPOINTMENT_BLUEPRINTS.push({
      days: cancelDays[i],
      hour: 13 + (i % 5),
      min: 30,
      pIdx: (i * 5 + 8) % createdPatients.length,
      tName: treatmentKeywords[(i * 3) % treatmentKeywords.length],
      status: "CANCELLED",
      source: bookingSources[(i + 2) % bookingSources.length]
    });
  }

  console.log(`Blueprint assembled: ${APPOINTMENT_BLUEPRINTS.length} appointments ready to insert.`);

  let createdCount = 0;
  for (const item of APPOINTMENT_BLUEPRINTS) {
    const patient = createdPatients[item.pIdx % createdPatients.length];
    const treatment = treatments.find(t => t.name.toLowerCase().includes(item.tName.toLowerCase())) || treatments[0];

    const startTime = createSlotDate(item.days, item.hour, item.min);
    const endTime = new Date(startTime);
    endTime.setMinutes(endTime.getMinutes() + treatment.durationMin);

    const price = treatment.price;
    const discount = item.disc || 0;
    const amountPaid = item.paid !== undefined ? item.paid : (item.status === "COMPLETED" ? (price - discount) : 0);

    const apt = await prisma.appointment.create({
      data: {
        startTime,
        endTime,
        status: item.status,
        bookedBy: item.source || "WEBSITE",
        patientId: patient.id,
        treatmentId: treatment.id,
        price: price,
        amountPaid: amountPaid,
        discount: discount,
        patientTreatmentId: item.planId || null,
        sessionNumber: item.sNum || null,
        sessionLabel: item.sLabel || null,
        checkoutTime: item.status === "COMPLETED" ? endTime : null,
      },
    });

    // If completed, add clinical note
    if (item.status === "COMPLETED") {
      const treatmentNote = item.note || `Procedure for ${treatment.name} carried out successfully. Local anesthesia administered where indicated. Normal postoperative recovery expected.`;
      await prisma.clinicalNote.create({
        data: {
          appointmentId: apt.id,
          diagnosis: `Clinical examination completed. Indicated for ${treatment.name}.`,
          treatmentDone: treatmentNote,
          prescription: treatment.instructions || "Amoxicillin 500mg TDS x 5 days, Paracetamol 1000mg SOS, Chlorhexidine mouthwash 0.2%",
          remarks: "Patient advised on oral hygiene and post-procedure precautions.",
        },
      });
    }

    // If attached to a multi-session plan and paid, record installment payment
    if (item.planId && amountPaid > 0) {
      await prisma.payment.create({
        data: {
          patientTreatmentId: item.planId,
          appointmentId: apt.id,
          amount: amountPaid,
          method: (createdCount % 2 === 0) ? "CASH" : "CARD",
          date: startTime,
          notes: item.sLabel || "Treatment plan installment",
        },
      });
    }

    createdCount++;
  }

  console.log(`\n🎉 Data Population Finished Successfully!`);
  console.log(`✅ Patients in DB: ${createdPatients.length}`);
  console.log(`✅ Appointments in DB: ${createdCount}`);
  console.log(`✅ Treatments in DB: ${treatments.length}`);
  console.log(`\nAccess Credentials:`);
  console.log(`  Admin: admin@elitedental.com / admin123`);
  console.log(`  Staff: staff1@elitedental.com / staff123`);
}

main()
  .catch((err) => {
    console.error('❌ Data population failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
