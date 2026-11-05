import Image from "next/image";
import Link from "next/link";
import { clinicInfo, testimonials } from "@/app/constants/mockData";
import {
  VerifiedOutlined,
  ChevronRightOutlined,
  ArrowForwardOutlined,
  CheckCircleOutlined,
  HealthAndSafetyOutlined,
  MedicalServicesOutlined,
  SentimentSatisfiedAltOutlined,
  StarOutlined,
  AddOutlined,
  LocationOnOutlined,
  AccessTimeOutlined,
  PhoneOutlined,
  WhatsApp,
  BiotechOutlined,
  ShieldOutlined,
  WorkspacePremiumOutlined,
  LocalHospitalOutlined,
  HelpOutlineOutlined,
  PaymentsOutlined,
  CreditCardOutlined,
} from "@mui/icons-material";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import prisma from "@/lib/prisma";
import AppointmentCtaBanner from "@/components/AppointmentCtaBanner";
import ToothOrbitalBadge from "@/components/ToothOrbitalBadge";
import SmileShowcase from "@/components/SmileShowcase";
import FaqSection from "@/components/FaqSection";
import ReviewsSection from "@/components/ReviewsSection";
import { formatPKR, getTreatmentImage } from "@/lib/utils";

export const metadata = {
  title: "Elite Dental Centre | Islamabad's Premier Cosmetic & Implant Clinic",
  description:
    "Leading dental clinic in F-10 Markaz, Islamabad. Advanced dental implants, laser teeth whitening, ceramic braces, and gentle root canal treatments by licensed oral surgeons.",
  keywords: [
    "dental clinic islamabad",
    "dentist f-10 markaz",
    "teeth whitening islamabad",
    "dental implants pakistan",
    "braces islamabad",
    "root canal specialist",
    "best dentist islamabad",
  ],
  alternates: {
    canonical: "https://elitedentalcentre.com",
  },
  openGraph: {
    title: "Elite Dental Centre | Advanced Implantology & Cosmetic Dentistry",
    description: "Book painless dental treatments in Islamabad with licensed surgeons.",
    url: "https://elitedentalcentre.com",
    siteName: "Elite Dental Centre",
    locale: "en_US",
    type: "website",
  },
};

const landingFaqs = [
  {
    question: "Is dental implant surgery painful?",
    answer:
      "No. At Elite Dental, all implant placements are performed under localized computerized anesthesia and minimally invasive 3D-guided surgery. Most patients report feeling only mild pressure during the procedure and return to normal daily routines within 24 to 48 hours with standard over-the-counter pain relievers.",
    icon: MedicalServicesOutlined,
  },
  {
    question: "How much does a dental procedure cost at Elite Dental?",
    answer:
      "We believe in 100% transparent healthcare. Standard procedures start from Rs. 2,500 for scaling and cleaning, Rs. 13,000 for single-canal root canal therapy, and Rs. 70,000 for certified titanium implants. Every patient receives a comprehensive, itemized written treatment plan with zero surprise fees before any work begins.",
    icon: PaymentsOutlined,
  },
  {
    question: "Do you offer emergency or same-day appointments?",
    answer:
      "Yes. We maintain reserved daily emergency slots for severe toothaches, dental trauma, knocked-out teeth, or acute facial swelling. You can contact our emergency WhatsApp line or book online for same-day priority clinical triage.",
    icon: LocalHospitalOutlined,
  },
  {
    question: "What sterilization standards are followed at your Islamabad facility?",
    answer:
      "We strictly follow ISO 9001 hospital-grade sterilization protocols. Every surgical instrument undergoes multi-stage ultrasonic scrubbing, Class-B vacuum autoclaving at 134°C with biological spore testing, and is sealed in single-use medical pouches opened directly in your presence.",
    icon: HealthAndSafetyOutlined,
  },
  {
    question: "Can I pay in installments for orthodontic braces or multi-visit treatments?",
    answer:
      "Yes. For multi-session dental treatments such as orthodontic braces, clear aligners, and comprehensive smile makeovers, we provide structured installment plans spread across your active session visits without additional interest.",
    icon: CreditCardOutlined,
  },
];

import { ALL_TREATMENTS } from "@/lib/treatmentsData";

export default async function LandingPage() {
  let treatments = ALL_TREATMENTS.slice(0, 8) as any;
  try {
    const dbTreatments = await prisma.treatment.findMany({
      where: { isActive: true },
      take: 8,
      orderBy: { name: "asc" },
    });
    if (dbTreatments && dbTreatments.length > 0) {
      treatments = dbTreatments.map((dbT) => {
        const match = ALL_TREATMENTS.find((t) => t.name.toLowerCase() === dbT.name.toLowerCase());
        if (match) {
          return {
            ...dbT,
            durationMin: match.durationMin,
            description: match.description,
          };
        }
        return dbT;
      }) as any;
    }
  } catch (error) {
    console.warn("[LandingPage] Database unavailable at localhost:5432, utilizing clinical fallback catalog:", error instanceof Error ? error.message : error);
  }

  // Structured Data (JSON-LD) for Google MedicalClinic, Dentist, and FAQPage Schema
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Dentist",
        "@id": "https://elitedentalcentre.com/#clinic",
        name: "Elite Dental Centre",
        image: "https://elitedentalcentre.com/images/services/dental_crown.png",
        url: "https://elitedentalcentre.com",
        telephone: clinicInfo.phone,
        address: {
          "@type": "PostalAddress",
          streetAddress: clinicInfo.address,
          addressLocality: "Islamabad",
          postalCode: "44000",
          addressCountry: "PK",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: 33.6938,
          longitude: 73.0125,
        },
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
            ],
            opens: "12:00",
            closes: "20:00",
          },
        ],
        priceRange: "$$",
        paymentAccepted: "Cash, Credit Card, Bank Transfer",
        medicalSpecialty: [
          "Dentistry",
          "OralSurgery",
          "Orthodontics",
          "Prosthodontics",
          "Periodontics",
        ],
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.9",
          reviewCount: "850",
        },
      },
      {
        "@type": "FAQPage",
        "@id": "https://elitedentalcentre.com/#faq",
        mainEntity: landingFaqs.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: f.answer,
          },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Navbar />

      <main className="min-h-screen bg-[#F8FAFC] text-slate-900">
        {/* ── 1. HERO SECTION — Asymmetrical Clinical Mosaic & Prestige Typography ── */}
        <section className="relative overflow-hidden bg-[#F8FAFC] border-b border-slate-200/80 pt-8 pb-16 lg:pt-12 lg:pb-20">
          {/* Subtle topographic contour wave background */}
          <div className="absolute right-0 bottom-0 pointer-events-none opacity-40 overflow-hidden w-full max-w-2xl h-96">
            <svg
              viewBox="0 0 600 400"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full object-cover translate-x-12 translate-y-8"
              aria-hidden="true"
            >
              <path d="M100 400 C 250 380, 400 300, 600 120" stroke="#94A3B8" strokeWidth="1.2" strokeOpacity="0.45" />
              <path d="M150 400 C 300 370, 440 280, 600 80" stroke="#94A3B8" strokeWidth="1.2" strokeOpacity="0.5" />
              <path d="M200 400 C 350 350, 480 250, 600 40" stroke="#0D9488" strokeWidth="1.2" strokeOpacity="0.45" />
              <path d="M260 400 C 400 340, 520 220, 600 10" stroke="#94A3B8" strokeWidth="1.2" strokeOpacity="0.4" />
              <path d="M320 400 C 450 320, 550 190, 600 0" stroke="#94A3B8" strokeWidth="1.2" strokeOpacity="0.35" />
            </svg>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-14 items-center">
              {/* Left Column: Asymmetrical Clinical Mosaic */}
              <div className="lg:col-span-6 relative">
                <div className="grid grid-cols-2 gap-3.5 sm:gap-4 relative items-start">
                  {/* Left Sub-Column */}
                  <div className="flex flex-col gap-3.5 sm:gap-4">
                    <div className="relative h-44 sm:h-52 rounded-3xl overflow-hidden shadow-sm border border-slate-200/90 bg-slate-100 group">
                      <Image
                        src="/images/services/dental_filling.png"
                        alt="Dental procedure in sterile clinical operatory"
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        priority
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/25 via-transparent to-transparent" />
                    </div>

                    {/* Dark Navy Card */}
                    <div className="rounded-3xl bg-[#0B1528] text-white p-5 sm:p-6 shadow-lg border border-slate-900 flex flex-col justify-between min-h-[140px]">
                      <div className="flex items-center gap-1.5 text-teal-400">
                        <span className="size-5 rounded-full bg-teal-950/80 border border-teal-800 flex items-center justify-center">
                          <AddOutlined sx={{ fontSize: 13, color: "#2dd4bf" }} />
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm font-extrabold uppercase tracking-tight text-white leading-snug pt-3">
                        Building healthy smiles for your family, together.
                      </p>
                    </div>

                    <div className="relative h-40 sm:h-48 rounded-3xl overflow-hidden shadow-sm border border-slate-200/90 bg-slate-100 group">
                      <Image
                        src="/images/services/surgical_extraction.png"
                        alt="Specialist oral surgery team operating"
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/25 via-transparent to-transparent" />
                    </div>
                  </div>

                  {/* Right Sub-Column */}
                  <div className="flex flex-col gap-3.5 sm:gap-4">
                    <div className="relative h-72 sm:h-88 rounded-3xl overflow-hidden shadow-md border border-slate-200/90 bg-slate-100 group">
                      <Image
                        src="/images/services/laser_whitening.png"
                        alt="Doctor and happy patient smiling in clinical chair"
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        priority
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/25 via-transparent to-transparent" />
                    </div>

                    <div className="relative h-44 sm:h-48 rounded-3xl overflow-hidden shadow-sm border border-slate-200/90 bg-slate-100 group">
                      <Image
                        src="/images/services/american_implant.png"
                        alt="Precision implant crown restoration"
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  </div>

                  {/* Center Overlap: 3D Tooth Medallion with Pointer Line */}
                  <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none sm:pointer-events-auto">
                    <ToothOrbitalBadge />
                  </div>
                </div>
              </div>

              {/* Right Column: High-Impact Clinical Typography */}
              <div className="lg:col-span-6 flex flex-col items-start space-y-6 lg:pl-4">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold tracking-wide shadow-2xs">
                  <VerifiedOutlined sx={{ fontSize: 16, color: "#0d9488" }} />
                  <span>PMC / PMDC Registered Specialist Surgeons</span>
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-[54px] font-black text-[#0B1528] uppercase tracking-tight leading-[1.08] font-sans">
                  Experience Gentle Care For Long-Lasting <span className="text-teal-700">Oral Health</span>
                </h1>

                <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal max-w-xl">
                  Beyond routine checkups, we offer a full spectrum of advanced dental services to meet your specific needs and goals. Get a personalized treatment plan tailored to your unique smile!
                </p>

                <div className="pt-2 flex flex-wrap gap-4 items-center w-full sm:w-auto">
                  <a
                    href="#book"
                    className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#0B1528] hover:bg-teal-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-slate-950/20 hover:shadow-teal-700/30 transition-all duration-200 active:scale-95 w-full sm:w-auto"
                  >
                    <span>Book Procedure</span>
                    <ChevronRightOutlined sx={{ fontSize: 16, color: "#2dd4bf" }} />
                  </a>

                  <Link
                    href="/services"
                    className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-2xs w-full sm:w-auto"
                  >
                    <span>View Treatments</span>
                    <ArrowForwardOutlined sx={{ fontSize: 16, color: "#0d9488" }} />
                  </Link>
                </div>

                {/* Trust Credibility Bar */}
                <div className="pt-6 border-t border-slate-200/80 grid grid-cols-3 gap-6 w-full max-w-lg">
                  <div>
                    <div className="text-2xl font-black text-[#0B1528]">15+</div>
                    <div className="text-xs text-slate-500 font-medium">Years Experience</div>
                  </div>
                  <div>
                    <div className="text-2xl font-black text-teal-700">12k+</div>
                    <div className="text-xs text-slate-500 font-medium">Restored Smiles</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-2xl font-black text-[#0B1528]">
                      <span>4.9</span>
                      <StarOutlined sx={{ fontSize: 20, color: "#f59e0b" }} />
                    </div>
                    <div className="text-xs text-slate-500 font-medium">850+ Google Reviews</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 2. CLINICAL ACCREDITATIONS & STERILIZATION TICKER STRIP ── */}
        <section className="bg-white border-b border-slate-200 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 shrink-0">
                  <ShieldOutlined sx={{ fontSize: 22 }} />
                </div>
                <div>
                  <h4 className="text-xs font-black text-[#0B1528] uppercase tracking-wider">ISO 9001 Certified</h4>
                  <p className="text-[11px] text-slate-500 font-medium">Class-B Vacuum Autoclaves</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 shrink-0">
                  <WorkspacePremiumOutlined sx={{ fontSize: 22 }} />
                </div>
                <div>
                  <h4 className="text-xs font-black text-[#0B1528] uppercase tracking-wider">PMDC Specialists</h4>
                  <p className="text-[11px] text-slate-500 font-medium">Certified Oral Surgeons</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 shrink-0">
                  <BiotechOutlined sx={{ fontSize: 22 }} />
                </div>
                <div>
                  <h4 className="text-xs font-black text-[#0B1528] uppercase tracking-wider">3D Digital CBCT</h4>
                  <p className="text-[11px] text-slate-500 font-medium">Low-Dose Panoramic Scan</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 shrink-0">
                  <LocalHospitalOutlined sx={{ fontSize: 22 }} />
                </div>
                <div>
                  <h4 className="text-xs font-black text-[#0B1528] uppercase tracking-wider">Zero Pain Protocol</h4>
                  <p className="text-[11px] text-slate-500 font-medium">Computerized Anesthesia</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 3. FEATURED TREATMENTS & PROCEDURES MATRIX ── */}
        <section className="py-20 bg-[#F8FAFC] border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-100/70 border border-teal-200 px-3 py-1 rounded-full">
                  Clinical Services
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-[#0B1528] mt-3 tracking-tight font-sans">
                  Comprehensive Dental Care Under One Roof
                </h2>
                <p className="text-slate-600 mt-2 text-base max-w-xl font-normal">
                  Upfront transparent estimates with zero hidden charges. Every procedure is performed under strict sterilization standards.
                </p>
              </div>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 text-sm font-bold text-teal-700 hover:text-teal-800 transition-colors"
              >
                <span>View Full Procedure Catalog</span>
                <ArrowForwardOutlined sx={{ fontSize: 18 }} />
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {treatments.map((t: any) => (
                <div
                  key={t.id}
                  className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs hover:shadow-md hover:border-teal-400 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                    <Image
                      src={getTreatmentImage(t.name, t.imageUrl)}
                      alt={t.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-slate-950/80 text-white font-mono text-[11px] font-semibold backdrop-blur-xs">
                      {t.durationMin} mins
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <Link href={`/services/${t.id}`} className="block group/title hover:opacity-95">
                        <h3 className="font-bold text-slate-900 text-base group-hover:text-teal-700 transition-colors hover:underline underline-offset-2 decoration-teal-500">
                          {t.name}
                        </h3>
                      </Link>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-1.5 leading-relaxed">
                        {t.description || "Certified procedural protocol performed under hospital-grade sterile barrier isolation."}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                          Standard Fee
                        </span>
                        <span className="font-black text-[#0B1528] text-base font-sans">
                          {formatPKR(t.price)}
                        </span>
                      </div>
                      <Link
                        href={`/services/${t.id}`}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200/80 transition-colors inline-flex items-center gap-1"
                      >
                        <span>Details</span>
                        <ChevronRightOutlined sx={{ fontSize: 14 }} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 4. REAL SMILE TRANSFORMATIONS (BEFORE & AFTER CASE STUDIES) ── */}
        <section className="py-20 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full">
                Clinical Outcomes
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#0B1528] mt-3 tracking-tight font-sans">
                Real Patient Smile Transformations
              </h2>
              <p className="text-slate-600 mt-2 text-base font-normal">
                Explore real clinical cases treated by our specialists in Islamabad. Precision aesthetic dentistry designed for longevity and natural harmony.
              </p>
            </div>

            <SmileShowcase />
          </div>
        </section>

        {/* ── 5. E-E-A-T LEAD CLINICIAN SPOTLIGHT ── */}
        <section className="py-20 bg-[#F8FAFC] border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-12 gap-10 items-center">
              {/* Doctor Portrait Image Card */}
              <div className="lg:col-span-5 relative">
                <div className="relative h-[440px] sm:h-[480px] rounded-3xl overflow-hidden shadow-xl border border-slate-200 bg-slate-100">
                  <Image
                    src="/images/dr_sheriyaar.jpg"
                    alt="Dr. Sheriyaar - Chief Implantologist & Dental Surgeon"
                    fill
                    className="object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1528]/85 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-teal-300 bg-teal-950/80 px-2.5 py-1 rounded border border-teal-800">
                      Chief Clinical Director
                    </span>
                    <h3 className="text-2xl font-black mt-2 text-white">Dr. Sheriyaar</h3>
                    <p className="text-xs text-slate-300 font-medium">
                      BDS, RDS, Fellowship in Oral Implantology (ICOI) · 15+ Years Clinical Practice
                    </p>
                  </div>
                </div>
              </div>

              {/* Doctor Credentials & Philosophy */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold tracking-wide">
                  <WorkspacePremiumOutlined sx={{ fontSize: 16, color: "#0d9488" }} />
                  <span>Licensed Medical Practitioner (PMDC Registered)</span>
                </div>

                <h2 className="text-3xl sm:text-4xl font-black text-[#0B1528] tracking-tight font-sans leading-tight">
                  Passionate About Painless, Biological Tooth Preservation
                </h2>

                <p className="text-slate-600 text-base leading-relaxed">
                  &ldquo;Our clinical philosophy at Elite Dental is built around minimally invasive dentistry. We believe natural teeth are irreplaceable treasures. When restoration or implantology is required, we use computerized 3D planning to ensure painless precision, biological integration, and lifelong stability.&rdquo;
                </p>

                <div className="grid sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                    <h4 className="text-xs font-black uppercase tracking-wider text-[#0B1528]">Education & Credentials</h4>
                    <p className="text-xs text-slate-600 mt-1">BDS, RDS (Pakistan Medical & Dental Council Registered)</p>
                    <p className="text-xs text-teal-700 font-semibold mt-0.5">Fellow of International Congress of Oral Implantologists</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                    <h4 className="text-xs font-black uppercase tracking-wider text-[#0B1528]">Specialty Focus</h4>
                    <p className="text-xs text-slate-600 mt-1">Computer-guided titanium implants, aesthetic veneers & pain-free sedation.</p>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap gap-4 items-center">
                  <a
                    href={`https://wa.me/${clinicInfo.whatsapp}?text=${encodeURIComponent(
                      "Hello Dr. Sheriyaar, I would like to consult with you regarding a dental treatment."
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-all active:scale-95"
                  >
                    <WhatsApp sx={{ fontSize: 18 }} />
                    <span>Consult Dr. Sheriyaar on WhatsApp</span>
                  </a>

                  <Link
                    href="/about"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-xs uppercase tracking-wider transition-all"
                  >
                    <span>Read Full Clinic Biography</span>
                    <ArrowForwardOutlined sx={{ fontSize: 16, color: "#0d9488" }} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 6. 4-STEP PATIENT PROTOCOL JOURNEY ── */}
        <section className="py-20 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full">
                The Patient Care Protocol
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#0B1528] mt-3 tracking-tight font-sans">
                Seamless, Anxiety-Free Dental Experience
              </h2>
              <p className="text-slate-600 mt-2 text-base font-normal">
                From your initial digital consultation to your follow-up aftercare, here is what your visit looks like.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-6 relative">
              {[
                {
                  step: "01",
                  title: "Fast-Track Booking",
                  desc: "Select your preferred slot online or via WhatsApp with instant automated confirmation.",
                },
                {
                  step: "02",
                  title: "Digital 3D Diagnostics",
                  desc: "High-definition intraoral camera and panoramic X-ray to diagnose precisely without guesswork.",
                },
                {
                  step: "03",
                  title: "Painless Treatment",
                  desc: "Gentle procedural care using minimally invasive dental technologies and modern sedation.",
                },
                {
                  step: "04",
                  title: "Lifetime Aftercare",
                  desc: "Direct post-procedure WhatsApp assistance and personalized precautions delivered to your phone.",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl border border-slate-200/90 bg-slate-50/50 hover:bg-white hover:border-teal-500/50 hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300 relative group"
                >
                  <div className="text-3xl font-extrabold text-slate-300 group-hover:text-teal-600 transition-colors duration-200 font-mono mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2 font-sans">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed font-normal">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 7. HOSPITAL STERILIZATION & OPERATORY SAFETY ── */}
        <section className="py-20 bg-slate-950 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-400 bg-teal-950 border border-teal-800 px-3 py-1 rounded-full">
                  Uncompromising Safety
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-white mt-4 tracking-tight font-sans">
                  Hospital-Grade Sterilization Protocols
                </h2>
                <p className="text-slate-300 mt-4 text-base leading-relaxed">
                  Your safety is our first priority. We employ multi-stage Class-B vacuum autoclaving and disposable barrier isolation for every single patient.
                </p>

                <div className="mt-8 space-y-4">
                  {[
                    "Class-B Vacuum Autoclaves operating at 134°C with biological spore testing",
                    "Individual vacuum-sealed instrument packaging opened directly in front of you",
                    "UV-C Air purification and continuous operatory disinfection cycles",
                    "Ultra-low radiation digital intraoral imaging with instant chairside results",
                  ].map((text, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="p-1 rounded-full bg-teal-950 text-teal-400 mt-0.5 flex items-center justify-center">
                        <CheckCircleOutlined sx={{ fontSize: 18, color: "#2dd4bf" }} />
                      </div>
                      <span className="text-sm text-slate-200">{text}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
                <div className="space-y-6">
                  <div className="flex items-center gap-4 border-b border-slate-800 pb-6">
                    <div className="size-12 rounded-xl bg-teal-950/80 border border-teal-800 text-teal-400 flex items-center justify-center font-bold">
                      <HealthAndSafetyOutlined sx={{ fontSize: 28, color: "#2dd4bf" }} />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-base">Emergency Pain Relief Protocol</h4>
                      <p className="text-xs text-slate-400">Same-day priority allocation for dental trauma and acute pain</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 border-b border-slate-800 pb-6">
                    <div className="size-12 rounded-xl bg-teal-950/80 border border-teal-800 text-teal-400 flex items-center justify-center font-bold">
                      <MedicalServicesOutlined sx={{ fontSize: 28, color: "#2dd4bf" }} />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-base">PMDC / PMC Certified Practitioners</h4>
                      <p className="text-xs text-slate-400">Oral & Maxillofacial surgeons with international accreditations</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="size-12 rounded-xl bg-teal-950/80 border border-teal-800 text-teal-400 flex items-center justify-center font-bold">
                      <SentimentSatisfiedAltOutlined sx={{ fontSize: 28, color: "#2dd4bf" }} />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-base">100% Satisfaction & Warranty</h4>
                      <p className="text-xs text-slate-400">Comprehensive warranty on crown restorations & implant fixtures</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 8. PATIENT REVIEWS & GOOGLE SOCIAL PROOF (REDESIGNED) ── */}
        <ReviewsSection />

        {/* ── 9. CLINICAL FAQ SECTION (SEO & CONVERSION) ── */}
        <section className="bg-white border-b border-slate-200">
          <FaqSection
            kicker="Help & Support"
            title="Frequently asked questions"
            subtitle="Here's everything you need to know about our treatments, procedures, and transparent fees. Can't spot the answer you need? Our friendly clinical team is just a call away."
            items={landingFaqs}
          />
        </section>

        {/* ── 10. DIRECT APPOINTMENT SCHEDULING BANNER & MODAL ── */}
        <AppointmentCtaBanner treatments={treatments} />

        {/* ── 11. CLINIC LOCATION, HOURS & OPERATORY MAP ── */}
        <section className="py-20 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full">
                    Visit Our Clinic
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-black text-[#0B1528] mt-3 tracking-tight font-sans">
                    Conveniently Located in F-10 Markaz, Islamabad
                  </h2>
                  <p className="text-slate-600 mt-2 text-sm leading-relaxed">
                    Centrally positioned with dedicated patient parking and state-of-the-art operatory suites designed for patient comfort.
                  </p>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200/90">
                    <div className="p-2.5 rounded-xl bg-teal-50 text-teal-700 border border-teal-200 shrink-0">
                      <LocationOnOutlined sx={{ fontSize: 20 }} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Address</h4>
                      <p className="text-sm font-bold text-slate-900 mt-0.5">{clinicInfo.address}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200/90">
                    <div className="p-2.5 rounded-xl bg-teal-50 text-teal-700 border border-teal-200 shrink-0">
                      <AccessTimeOutlined sx={{ fontSize: 20 }} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Working Hours</h4>
                      <p className="text-sm font-bold text-slate-900 mt-0.5">{clinicInfo.workingHours}</p>
                      <p className="text-xs text-rose-600 font-semibold mt-0.5">{clinicInfo.sundayHours}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200/90">
                    <div className="p-2.5 rounded-xl bg-teal-50 text-teal-700 border border-teal-200 shrink-0">
                      <PhoneOutlined sx={{ fontSize: 20 }} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Telephone / Front Desk</h4>
                      <a href={`tel:${clinicInfo.phone}`} className="text-sm font-bold text-teal-700 hover:underline block mt-0.5">
                        {clinicInfo.phone}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Embed Card */}
              <div className="lg:col-span-7">
                <div className="relative h-80 sm:h-96 rounded-3xl overflow-hidden border border-slate-200 shadow-md">
                  <iframe
                    title="Elite Dental Centre Islamabad Location Map"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13279.791550993952!2d73.0039233!3d33.6938173!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38dfbe6b7d5f0b4d%3A0x6b4c1a5e1d4d1234!2sF-10%20Markaz%20Islamabad!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={false}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
