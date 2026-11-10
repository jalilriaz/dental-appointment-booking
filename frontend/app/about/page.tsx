import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { clinicInfo } from "@/app/constants/mockData";
import {
  VerifiedOutlined,
  HealthAndSafetyOutlined,
  MedicalServicesOutlined,
  SupportAgentOutlined,
  LocationOnOutlined,
} from "@mui/icons-material";
import FaqSection from "@/components/FaqSection";
import AboutHero from "@/components/AboutHero";
import AboutClient from "@/components/AboutClient";
import AppointmentCtaBanner from "@/components/AppointmentCtaBanner";
import { ALL_TREATMENTS } from "@/lib/treatmentsData";
import prisma from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Our Clinic & Doctor | Elite Dental Centre Islamabad",
  description:
    "Meet Dr. Sheriyaar, PMDC-registered Lead Dental Surgeon at Elite Dental Centre, G-8 Markaz Islamabad (Doctors Plaza, next to IDC). Explore our 3D CBCT imaging bay, Class-B sterilization, and patient-first care.",
  alternates: {
    canonical: "https://elitedental.pk/about",
  },
  openGraph: {
    title: "Our Clinic & Doctor | Elite Dental Centre Islamabad",
    description: "PMDC-registered Lead Dental Surgeon Dr. Sheriyaar, European Class-B sterilization, and 3D CBCT diagnostics in G-8 Markaz, Islamabad.",
    url: "https://elitedental.pk/about",
    type: "website",
  },
};

const aboutFaqs = [
  {
    question: "What qualifications and clinical experience does Dr. Sheriyaar possess?",
    answer: "Dr. Sheriyaar holds BDS and RDS degrees with advanced certifications in dental implantology and microscopic endodontics. With over 12 years of dedicated clinical practice in Islamabad, he specializes in pain-free dental implants, root canals, and aesthetic smile restorations.",
    icon: VerifiedOutlined,
  },
  {
    question: "What hospital-grade sterilization protocols are enforced at your facility?",
    answer: "Our clinic operates European Class-B vacuum autoclaves at 134°C with daily biological spore test verification. Surgical handpieces, burs, and instruments undergo a rigorous 4-step ultrasonic scrubbing and are sealed in sterile pouches opened only at your chairside.",
    icon: HealthAndSafetyOutlined,
  },
  {
    question: "Do you accommodate patients with dental anxiety or severe phobia?",
    answer: "Yes. We offer computerized painless anesthesia delivery, noise-canceling headphones, and patient-paced breaks. We also provide oral premedication options for nervous patients.",
    icon: MedicalServicesOutlined,
  },
  {
    question: "Are second opinion consultations available for complex implant plans?",
    answer: "Absolutely. Many patients visit us with external OPG x-rays or treatment proposals for an honest, unbiased second opinion. We review biological longevity, bone health, and cost-effective alternatives.",
    icon: SupportAgentOutlined,
  },
  {
    question: "Where is Elite Dental Centre located and is parking available?",
    answer: "We are situated at Office #6, 1st Floor, Doctors Plaza, 6 Markaz Rd, directly next to Islamabad Diagnostic Centre (IDC), G-8 Markaz, G-8/2, Islamabad. Ample street and plaza parking is available with elevator access to our clinical suites.",
    icon: LocationOnOutlined,
  },
];

export default async function AboutPage() {
  let treatments = ALL_TREATMENTS as any;
  try {
    const dbTreatments = await prisma.treatment.findMany({
      where: { isActive: true },
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
            maxPrice: match.maxPrice,
          };
        }
        return dbT;
      }) as any;
    }
  } catch (e) {
    console.warn("[AboutPage] Using fallback authoritative treatments:", e instanceof Error ? e.message : e);
  }

  // Schema.org Structured Data for Google E-E-A-T, Physician Faculty & Local SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Dentist",
        "@id": "https://elitedental.pk/#clinic",
        name: "Elite Dental Centre",
        url: "https://elitedental.pk",
        logo: "https://elitedental.pk/logo.svg",
        telephone: clinicInfo.phone,
        address: {
          "@type": "PostalAddress",
          streetAddress: clinicInfo.address,
          addressLocality: "Islamabad",
          addressRegion: "Federal Capital",
          postalCode: "44000",
          addressCountry: "PK",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: 33.6938,
          longitude: 73.0189,
        },
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            opens: "12:00",
            closes: "20:00",
          },
        ],
        medicalSpecialty: [
          "Dentistry",
          "Implantology",
          "OralSurgery",
          "Orthodontics",
          "Periodontics",
          "Endodontics",
        ],
      },
      {
        "@type": "Physician",
        "@id": "https://elitedental.pk/about#dr-sheriyaar",
        name: "Dr. Sheriyaar",
        jobTitle: "Lead Dental Surgeon & Clinical Director",
        medicalSpecialty: [
          "Dentistry",
          "Implantology",
          "Endodontics",
          "Restorative Dentistry",
        ],
        alumniOf: "PMDC Registered BDS, RDS",
        worksFor: {
          "@id": "https://elitedental.pk/#clinic",
        },
      },
      {
        "@type": "FAQPage",
        "@id": "https://elitedental.pk/about#faq",
        mainEntity: aboutFaqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://elitedental.pk/about#breadcrumb",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://elitedental.pk",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Our Clinic & Doctor",
            item: "https://elitedental.pk/about",
          },
        ],
      },
    ],
  };

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col justify-between">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div>
        <Navbar />

        {/* 1. Hero: Light Modern Clinical Aesthetic with Male Dentist & Contact Strip */}
        <AboutHero treatments={treatments} />

        {/* 2. Comprehensive E-E-A-T Medical Faculty, 3D Facility Tour & Patient Care Flow */}
        <AboutClient treatments={treatments} />

        {/* 3. Accreditations & Clinical FAQ Section */}
        <section className="bg-white border-t border-slate-200">
          <FaqSection
            kicker="Clinic & Standards"
            title="About our practice & accreditations"
            subtitle="Everything you need to know about our clinical standards, surgical qualifications, and patient safety."
            items={aboutFaqs}
          />
        </section>

        {/* 4. High-Converting Booking Banner with Modal Dialog */}
        <AppointmentCtaBanner treatments={treatments} />
      </div>

      <Footer />
    </div>
  );
}
