import { Metadata } from "next";
import { getClinicHours } from "@/lib/getClinicHours";
import ContactForm from "@/components/ContactForm";
import { ALL_TREATMENTS } from "@/lib/treatmentsData";
import prisma from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Contact & Location | Elite Dental Centre Islamabad (F-10 Markaz)",
  description:
    "Visit Elite Dental Centre at F-10 Markaz, Islamabad. Book with Lead Dental Surgeon Dr. Sheriyaar, get same-day emergency relief, or call +92 314 5475528. 2nd Floor, D-Watson Chemist Building, elevator access & dedicated parking.",
  alternates: {
    canonical: "https://elitedental.pk/contact",
  },
  openGraph: {
    title: "Contact & Location | Elite Dental Centre Islamabad",
    description:
      "Elite Dental Centre in F-10 Markaz, Islamabad. 2nd Floor D-Watson Chemist Building, elevator access, ample parking, and same-day dental emergency care with Dr. Sheriyaar.",
    url: "https://elitedental.pk/contact",
    type: "website",
  },
};

export default async function ContactPage() {
  const workingHours = await getClinicHours();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let treatments = ALL_TREATMENTS as any;
  try {
    const dbTreatments = await prisma.treatment.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    });
    if (dbTreatments && dbTreatments.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      treatments = dbTreatments.map((dbT: any) => {
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
      });
    }
  } catch {
    // Graceful fallback to static ALL_TREATMENTS
  }

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": ["Dentist", "MedicalClinic", "LocalBusiness"],
      "@id": "https://elitedental.pk/#dentist",
      "name": "Elite Dental Centre Islamabad",
      "image": "https://elitedental.pk/images/og-image.jpg",
      "telephone": "+92 314 5475528",
      "email": "contact@elitedental.pk",
      "url": "https://elitedental.pk/contact",
      "priceRange": "$$",
      "currenciesAccepted": "PKR",
      "paymentAccepted": "Cash, Credit Card, Bank Transfer, Online Transfer",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "D-Watson Chemist Building, 2nd Floor, Main Roundabout, F-10 Markaz",
        "addressLocality": "Islamabad",
        "addressRegion": "Islamabad Capital Territory",
        "postalCode": "44000",
        "addressCountry": "PK"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 33.6938,
        "longitude": 73.0113
      },
      "hasMap": "https://maps.google.com/maps?q=D-Watson+Chemist+F-10+Markaz+Islamabad",
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
          "opens": "12:00",
          "closes": "20:00"
        }
      ],
      "founder": {
        "@type": "Physician",
        "name": "Dr. Sheriyaar",
        "jobTitle": "Lead Dental Surgeon & Restorative Specialist",
        "medicalSpecialty": "Dentistry"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How do I reach Elite Dental Centre in F-10 Markaz, Islamabad?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We are located at D-Watson Chemist Building, 2nd Floor, Main Roundabout, F-10 Markaz, Islamabad. Elevator access is available directly from the ground floor lobby, and dedicated patient parking is located right in front of the plaza."
          }
        },
        {
          "@type": "Question",
          "name": "Do you provide same-day emergency dental appointments in Islamabad?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, Dr. Sheriyaar reserves daily priority slots for acute toothache, broken crowns, dental abscesses, or facial trauma. Please call our emergency hotline (+92 314 5475528) or WhatsApp us immediately for urgent triage."
          }
        },
        {
          "@type": "Question",
          "name": "What should I bring for my first clinical consultation?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Please bring any prior dental records, recent OPG x-rays if available, and a list of current medications or allergies so our clinical team can tailor a safe and comprehensive treatment plan."
          }
        },
        {
          "@type": "Question",
          "name": "Are installment payment plans available for orthodontic or surgical procedures?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! We offer flexible, milestone-based 0% interest installment plans for clear aligners, ceramic/metal braces, and multi-stage dental implant rehabilitations."
          }
        },
        {
          "@type": "Question",
          "name": "Is elevator and wheelchair accessibility available for elderly or injured patients?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, our building features step-free street access with a modern elevator directly serving our 2nd-floor surgical suites. Wheelchair assistance can be requested at reception upon arrival."
          }
        }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://elitedental.pk"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Contact & Location",
          "item": "https://elitedental.pk/contact"
        }
      ]
    }
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <ContactForm workingHours={workingHours} treatments={treatments} />
    </>
  );
}
