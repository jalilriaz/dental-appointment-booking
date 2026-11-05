import prisma from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Metadata } from "next";
import ServicesClient from "./ServicesClient";
import FaqSection from "@/components/FaqSection";
import AppointmentCtaBanner from "@/components/AppointmentCtaBanner";
import MedicalServicesOutlinedIcon from "@mui/icons-material/MedicalServicesOutlined";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import { ALL_TREATMENTS } from "@/lib/treatmentsData";
import { clinicInfo } from "@/app/constants/mockData";

export const metadata: Metadata = {
    title: "Our Services & Clinical Treatments | Elite Dental Centre Islamabad",
    description: "Explore 20 specialized dental treatments at Elite Dental Centre Islamabad - titanium implants, cosmetic laser whitening, clear aligners, painless root canals with fixed transparent PKR pricing.",
    alternates: {
        canonical: "https://elitedental.pk/services",
    },
    openGraph: {
        title: "Specialized Dental Services & Treatments | Elite Dental Centre",
        description: "Transparent pricing in PKR, pain-free sedation techniques, and European Class-B sterilization for every procedure in Islamabad.",
        url: "https://elitedental.pk/services",
        type: "website",
    },
};

const servicesFaqs = [
    {
        question: "How do I choose between dental implants and dental bridges?",
        answer: "Dental implants are the clinical gold standard because they replace the root directly in the jawbone, preventing bone loss and preserving neighboring teeth without shaving them down. Bridges are recommended when bone density is insufficient or for quicker non-surgical replacement.",
        icon: MedicalServicesOutlinedIcon,
    },
    {
        question: "How long does professional laser teeth whitening last?",
        answer: "With good oral hygiene and avoiding staining substances like tobacco, black tea, and heavy coffee for the first 48 hours, laser whitening results typically remain bright and vibrant for 12 to 24 months. We also offer maintenance touch-up kits.",
        icon: AutoAwesomeOutlinedIcon,
    },
    {
        question: "What is the difference between single-canal and multi-canal root canals?",
        answer: "Front teeth have a single root canal, which can usually be disinfected and sealed in one quick session. Molars and premolars have 3 to 4 complex curved canals requiring microscope-guided rotary cleaning and bio-ceramic obturation across 1 or 2 visits.",
        icon: AccessTimeOutlinedIcon,
    },
    {
        question: "Are payment installments available for invisible aligners or braces?",
        answer: "Yes! For orthodontic aligners, metal braces, and ceramic braces, we structure milestone-based installment payments spread comfortably across your scheduled adjustments with 0% extra interest.",
        icon: PaymentsOutlinedIcon,
    },
    {
        question: "What hospital sterilization guarantees are provided for surgical procedures?",
        answer: "Every surgical procedure adheres to strict Class-B European standard autoclaving at 134°C with biological spore verification. All surgical burrs, scalpels, and suction tips are 100% single-use and unsealed right in front of you.",
        icon: SecurityOutlinedIcon,
    },
];

export default async function ServicesPage() {
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
        console.warn("[ServicesPage] Database unreachable at localhost:5432, using authoritative treatments:", e instanceof Error ? e.message : e);
    }

    // Schema.org Structured Data for Google E-E-A-T and Search Rich Snippets
    const structuredData = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "MedicalWebPage",
                "@id": "https://elitedental.pk/services#webpage",
                url: "https://elitedental.pk/services",
                name: "Dental Services & Clinical Treatments Catalog | Elite Dental Centre",
                description: "Comprehensive catalog of 20 specialized dental treatments with fixed transparent PKR pricing, painless sedation protocols, and European Class-B sterilization in Islamabad.",
                medicalSpecialty: "Dentistry",
                publisher: {
                    "@type": "Dentist",
                    name: "Elite Dental Centre",
                    telephone: clinicInfo.phone,
                    address: {
                        "@type": "PostalAddress",
                        streetAddress: clinicInfo.address,
                        addressLocality: "Islamabad",
                        addressCountry: "PK",
                    },
                },
            },
            {
                "@type": "ItemList",
                "@id": "https://elitedental.pk/services#procedurelist",
                name: "Specialized Dental Treatments",
                numberOfItems: treatments.length,
                itemListElement: treatments.map((t: any, index: number) => ({
                    "@type": "ListItem",
                    position: index + 1,
                    item: {
                        "@type": "MedicalProcedure",
                        name: t.name,
                        description: t.description,
                        procedureType: "Surgical",
                        offers: {
                            "@type": "Offer",
                            price: t.price,
                            priceCurrency: "PKR",
                            availability: "https://schema.org/InStock",
                            seller: {
                                "@type": "Dentist",
                                name: "Elite Dental Centre",
                            },
                        },
                    },
                })),
            },
            {
                "@type": "FAQPage",
                "@id": "https://elitedental.pk/services#faq",
                mainEntity: servicesFaqs.map((faq) => ({
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
                "@id": "https://elitedental.pk/services#breadcrumb",
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
                        name: "Services & Treatments",
                        item: "https://elitedental.pk/services",
                    },
                ],
            },
        ],
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />
            <div>
                <Navbar />
                <ServicesClient treatments={treatments} />

                {/* Unified FAQ Section */}
                <div className="bg-white border-t border-slate-200">
                    <FaqSection
                        kicker="Treatment Inquiries"
                        title="Dental procedures & questions"
                        subtitle="Everything you need to know about our specialized surgical procedures, recovery timelines, and longevity."
                        items={servicesFaqs}
                    />
                </div>

                {/* High-Converting Appointment Booking CTA Banner with Modal Dialog */}
                <AppointmentCtaBanner treatments={treatments} />
            </div>
            <Footer />
        </div>
    );
}
