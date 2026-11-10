import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import {
  VerifiedOutlined,
  HealthAndSafetyOutlined,
  MedicalServicesOutlined,
  CheckCircleOutlineOutlined,
  Star,
  AccessTimeOutlined,
  LocationOnOutlined,
  PhoneOutlined,
  WhatsApp,
  CalendarMonthOutlined,
  ShieldOutlined,
  WorkspacePremiumOutlined,
  PsychologyOutlined,
} from "@mui/icons-material";
import AppointmentCtaBanner from "@/components/AppointmentCtaBanner";
import { ALL_TREATMENTS } from "@/lib/treatmentsData";
import prisma from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Meet Our Doctors & Specialists | Elite Dental Centre Islamabad",
  description:
    "Meet Dr. Sheriyaar, PMDC-registered Lead Dental Surgeon & Implantologist, and our consultant dental specialists at Elite Dental Centre, G-8 Markaz, Islamabad.",
  alternates: {
    canonical: "https://elitedental.pk/doctors",
  },
  openGraph: {
    title: "Meet Our Doctors & Specialists | Elite Dental Centre Islamabad",
    description:
      "Direct personalized care by Dr. Sheriyaar (12+ years experience) and specialized dental consultants in G-8 Markaz Islamabad.",
    url: "https://elitedental.pk/doctors",
    type: "website",
  },
};

const DOCTORS_ROSTER = [
  {
    name: "Dr. Sheriyaar",
    role: "Lead Dental Surgeon & Implantologist",
    credentials: "BDS, RDS (PMDC Reg: 14820-D)",
    experience: "12+ Years Clinical Practice",
    image: "/images/dr_sheriyaar.jpg",
    isLead: true,
    focus: [
      "3D Computer-Guided Dental Implants",
      "Microscopic Rotary Endodontics (RCT)",
      "Smile Makeovers & Porcelain Veneers",
      "Full-Mouth Surgical Restorations",
    ],
    bio: "Head dentist and founder of Elite Dental Centre. Dr. Sheriyaar personally oversees all surgical and aesthetic dental procedures. Trained in modern European implantology protocols, he prioritizes minimally invasive, pain-free patient experiences with zero handoffs to uncertified assistants.",
    schedule: "Monday – Saturday: 12:00 PM – 8:00 PM",
  },
  {
    name: "Dr. Ayesha Malik",
    role: "Consultant Orthodontist & Dentofacial Orthopedics",
    credentials: "BDS, FCPS (Orthodontics)",
    experience: "9+ Years Experience",
    isLead: false,
    focus: [
      "Invisible Aligners & Clear Trays",
      "Ceramic & Self-Ligating Braces",
      "Malocclusion & Bite Alignment",
      "Pediatric & Adolescent Orthodontics",
    ],
    bio: "Specializing in contemporary digital orthodontics and aesthetic smile symmetry. Dr. Ayesha works in tandem with Dr. Sheriyaar to craft tailored non-extraction clear aligner trajectories and discreet ceramic bracket plans.",
    schedule: "Tuesday & Friday: 2:00 PM – 6:00 PM",
  },
  {
    name: "Dr. Hamza Tariq",
    role: "Consultant Endodontist (Root Canal Specialist)",
    credentials: "BDS, MDS (Endodontics & Operative Dentistry)",
    experience: "8+ Years Experience",
    isLead: false,
    focus: [
      "Complex Multi-Canal Molar Retreatment",
      "Microscopic Endodontic Surgery",
      "Bioceramic Perforation Repair",
      "Broken Instrument Retrieval",
    ],
    bio: "Focused exclusively on preserving natural dentition through high-magnification computerized rotary endodontics. Dr. Hamza ensures even severely infected multi-rooted teeth are treated comfortably without extraction.",
    schedule: "Wednesday & Saturday: 4:00 PM – 8:00 PM",
  },
  {
    name: "Dr. Fatima Noor",
    role: "Specialist Periodontist & Aesthetic Laser Surgeon",
    credentials: "BDS, MSc (Periodontology & Laser Dentistry)",
    experience: "7+ Years Experience",
    isLead: false,
    focus: [
      "Laser Gingival Depigmentation",
      "Deep Ultrasonic Periodontal Therapy",
      "Gummy Smile Laser Contouring",
      "Bone Grafting & Socket Preservation",
    ],
    bio: "Expert in soft tissue aesthetics and periodontal health. Dr. Fatima utilizes medical laser therapies to eliminate gum bleeding, sculpt symmetric gumlines, and treat advanced periodontal bone loss.",
    schedule: "Monday & Thursday: 1:00 PM – 5:00 PM",
  },
];

export default async function DoctorsPage() {
  // Fetch real treatments from database to feed the booking modal inside the CTA banner
  let treatments = [];
  try {
    treatments = await prisma.treatment.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        price: true,
        durationMin: true,
        description: true,
        category: true,
      },
      orderBy: { price: "asc" },
    });
  } catch {
    treatments = ALL_TREATMENTS;
  }

  const leadDoctor = DOCTORS_ROSTER[0];
  const specialistDoctors = DOCTORS_ROSTER.slice(1);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-teal-500 selection:text-white">
      <Navbar />

      <main className="space-y-16 sm:space-y-24 pb-20">
        {/* ──────────────────────────────────────────────────────────────────
            1. HERO INTRO BANNER
            ────────────────────────────────────────────────────────────────── */}
        <section className="relative pt-12 pb-16 lg:pt-20 lg:pb-24 bg-gradient-to-b from-teal-950/15 via-slate-50 to-slate-50 overflow-hidden border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-black uppercase tracking-wider mb-6 shadow-2xs">
              <WorkspacePremiumOutlined sx={{ fontSize: 16, color: "#0D9488" }} />
              <span>Dedicated Dental Specialists</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0B1528] tracking-tight font-sans max-w-3xl mx-auto">
              Meet Dr. Sheriyaar & Our Clinical Dental Team
            </h1>

            <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Every procedure is personally performed by PMDC-registered dental surgeons. Experience transparent, compassionate care backed by modern digital technology.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs font-bold text-slate-600">
              <span className="flex items-center gap-1.5">
                <CheckCircleOutlineOutlined sx={{ fontSize: 18, color: "#0D9488" }} />
                100% Doctor-Performed Care
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldOutlined sx={{ fontSize: 18, color: "#0D9488" }} />
                PMDC Verified Credentials
              </span>
              <span className="flex items-center gap-1.5">
                <HealthAndSafetyOutlined sx={{ fontSize: 18, color: "#0D9488" }} />
                European Class-B 134°C Autoclave
              </span>
            </div>
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────────────────
            2. LEAD SURGEON SPOTLIGHT: DR. SHERIYAAR
            ────────────────────────────────────────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative">
            {/* Ambient Background Accent */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

            {/* Doctor Portrait Image Column (5 Cols) */}
            <div className="lg:col-span-5 relative min-h-[380px] lg:min-h-[500px] bg-slate-900 overflow-hidden">
              <Image
                src={leadDoctor.image || "/images/dr_sheriyaar.jpg"}
                alt="Dr. Sheriyaar - Lead Dental Surgeon"
                fill
                className="object-cover object-top"
                sizes="(max-width: 1024px) 100vw, 40vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent lg:hidden" />
              <div className="absolute bottom-4 left-4 right-4 text-white lg:hidden">
                <span className="px-2.5 py-0.5 rounded-full bg-teal-500 text-white text-[10px] font-black uppercase tracking-wider inline-block mb-1">
                  Lead Surgeon
                </span>
                <h3 className="text-xl font-extrabold">{leadDoctor.name}</h3>
                <p className="text-xs text-teal-300 font-medium">{leadDoctor.role}</p>
              </div>
            </div>

            {/* Doctor Credentials & Narrative (7 Cols) */}
            <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="hidden lg:flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 text-xs font-black uppercase tracking-wider">
                    Head Dental Surgeon
                  </span>
                  <span className="text-xs font-extrabold text-slate-400">·</span>
                  <span className="text-xs font-bold text-slate-500">{leadDoctor.experience}</span>
                </div>

                <div className="hidden lg:block">
                  <h2 className="text-3xl font-black text-[#0B1528] tracking-tight font-sans">
                    {leadDoctor.name}
                  </h2>
                  <p className="text-sm font-extrabold text-teal-700 mt-0.5">{leadDoctor.role}</p>
                  <p className="text-xs font-semibold text-slate-500">{leadDoctor.credentials}</p>
                </div>

                {/* 5-Star Rating Badge */}
                <div className="flex items-center gap-1.5 text-amber-500 py-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} sx={{ fontSize: 18 }} />
                  ))}
                  <span className="text-xs font-extrabold text-slate-800 ml-1">
                    5.0 Patient Satisfaction Score
                  </span>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed font-normal">
                  {leadDoctor.bio}
                </p>

                {/* Clinical Areas of Expertise */}
                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">
                    Clinical Focus & Procedures:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {leadDoctor.focus.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs font-bold text-slate-800"
                      >
                        <CheckCircleOutlineOutlined sx={{ fontSize: 16, color: "#0D9488" }} />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Operating Hours Info */}
                <div className="p-3.5 rounded-2xl bg-teal-50/60 border border-teal-200/80 flex items-center gap-3 text-xs">
                  <AccessTimeOutlined sx={{ fontSize: 18, color: "#0D9488" }} />
                  <div>
                    <span className="font-extrabold text-slate-900 block">Personal Consultation Hours:</span>
                    <span className="text-slate-600 font-medium">{leadDoctor.schedule}</span>
                  </div>
                </div>
              </div>

              {/* Consultation CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-100">
                <a
                  href={`https://wa.me/923145475528?text=${encodeURIComponent(
                    "Hello Dr. Sheriyaar, I would like to book a dental consultation."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#0D9488] hover:bg-teal-700 text-white font-extrabold text-xs shadow-md shadow-teal-700/20 active:scale-95 transition-all cursor-pointer"
                >
                  <WhatsApp sx={{ fontSize: 18 }} />
                  <span>Consult Dr. Sheriyaar on WhatsApp</span>
                </a>

                <a
                  href="tel:+923145475528"
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-200/80 transition-all cursor-pointer"
                >
                  <PhoneOutlined sx={{ fontSize: 16 }} />
                  <span>Call: +92-314-5475528</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────────────────
            3. SPECIALIST CONSULTANT ROSTER GRID
            ────────────────────────────────────────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-[#0B1528] tracking-tight font-sans">
              Specialist Consultant Dental Panel
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Multidisciplinary dental care under one roof. Our specialists collaborate directly on complex smile alignment, microsurgery, and periodontal aesthetics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {specialistDoctors.map((doc, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl border border-slate-200/80 shadow-md hover:shadow-lg transition-all p-6 sm:p-7 flex flex-col justify-between relative group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="size-14 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-800 font-black text-xl shadow-2xs">
                      {doc.name.replace("Dr. ", "").charAt(0)}
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-slate-100 text-slate-700">
                      {doc.experience}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">{doc.name}</h3>
                    <p className="text-xs font-extrabold text-teal-700 mt-0.5">{doc.role}</p>
                    <p className="text-[11px] font-semibold text-slate-500">{doc.credentials}</p>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-normal">{doc.bio}</p>

                  <div className="space-y-1.5 pt-2 border-t border-slate-100">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                      Key Procedures:
                    </span>
                    <ul className="space-y-1 text-xs text-slate-700 font-medium">
                      {doc.focus.map((f, fIdx) => (
                        <li key={fIdx} className="flex items-center gap-1.5">
                          <div className="size-1 rounded-full bg-teal-600" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-slate-500">
                    <AccessTimeOutlined sx={{ fontSize: 14, color: "#0D9488" }} />
                    <span className="text-[11px] font-semibold">{doc.schedule}</span>
                  </div>
                  <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200/60">
                    Consultant
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────────────────
            4. CLINICAL PHILOSOPHY / STANDARDS OF EXCELLENCE
            ────────────────────────────────────────────────────────────────── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#0B1528] rounded-3xl text-white p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-2xl">
            <div className="absolute -bottom-24 -right-24 size-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-bold uppercase tracking-wider">
                <PsychologyOutlined sx={{ fontSize: 16 }} />
                <span>Our Clinical Promise</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight font-sans">
                &ldquo;Every patient is treated directly by our specialist surgeons — no assistants doing surgical work.&rdquo;
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                At Elite Dental Centre in G-8 Markaz Islamabad, we reject assembly-line dentistry. Dr. Sheriyaar and our consultant panel provide unhurried, gentle, and digitally guided treatment designed for your comfort and lifelong dental health.
              </p>
            </div>
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────────────────
            5. APPOINTMENT CTA BANNER (Embeds the Interactive Booking Form)
            ────────────────────────────────────────────────────────────────── */}
        <AppointmentCtaBanner treatments={treatments} />
      </main>

      <Footer />
    </div>
  );
}
