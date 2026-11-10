import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import {
  AccessTimeOutlined,
  ArrowBackOutlined,
  VerifiedOutlined,
  CalendarMonthOutlined,
  WhatsApp,
  AssignmentTurnedInOutlined,
  HelpOutlineOutlined,
  CheckCircleOutlined,
  CancelOutlined,
  WarningAmberOutlined,
  MedicalServicesOutlined,
  ShieldOutlined,
  HealingOutlined,
  ScienceOutlined,
  ThumbUpAltOutlined,
  LocalOfferOutlined,
  ChevronRightOutlined,
} from "@mui/icons-material";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FaqSection from "@/components/FaqSection";
import BookingForm from "@/components/BookingForm";
import { clinicInfo } from "@/app/constants/mockData";
import Link from "next/link";
import Image from "next/image";
import { formatPKR, formatPriceRange, getTreatmentImage } from "@/lib/utils";
import { getTreatmentExpectations } from "@/lib/treatmentDetails";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const treatment = await prisma.treatment.findUnique({ where: { id } });
  if (!treatment) return { title: "Treatment Details | Elite Dental Centre" };

  return {
    title: `${treatment.name} in Islamabad | Elite Dental Centre`,
    description:
      treatment.description ||
      `Professional ${treatment.name} at Elite Dental Centre, Islamabad. Transparent pricing, computerized diagnostics, and pain-free care.`,
    alternates: {
      canonical: `https://elitedentalcentre.com/services/${id}`,
    },
    openGraph: {
      title: `${treatment.name} | Elite Dental Centre Islamabad`,
      description: `Comprehensive procedure guide for ${treatment.name}. Transparent fee, pre-op prep, painless protocol, and post-op care.`,
      url: `https://elitedentalcentre.com/services/${id}`,
      type: "website",
    },
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [treatment, allTreatments] = await Promise.all([
    prisma.treatment.findUnique({ where: { id } }),
    prisma.treatment.findMany({ where: { isActive: true }, orderBy: { name: "asc" } }),
  ]);

  if (!treatment || !treatment.isActive) {
    notFound();
  }

  const detailData = getTreatmentExpectations(
    treatment.name,
    treatment.instructions
  );

  const mainImage = getTreatmentImage(treatment.name, treatment.imageUrl);

  // Structured Data (JSON-LD) for MedicalProcedure + FAQPage + Breadcrumbs
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "MedicalProcedure",
        "@id": `https://elitedentalcentre.com/services/${id}#procedure`,
        name: treatment.name,
        procedureType: "NoninvasiveProcedure",
        description:
          treatment.description ||
          `${treatment.name} performed under strict European Class-B sterilization protocols at Elite Dental Centre, Islamabad.`,
        bodyLocation: "Mouth",
        preparation: detailData.preCare.map((p) => `${p.title}: ${p.desc}`).join(" "),
        followup: detailData.postCare
          .flatMap((pc) => pc.instructions)
          .join(" "),
        howPerformed: detailData.expectations
          .map((e) => `Step ${e.step}: ${e.title} - ${e.desc || e.description || ""}`)
          .join(" "),
        offers: {
          "@type": "Offer",
          price: treatment.price,
          priceCurrency: "PKR",
          availability: "https://schema.org/InStock",
          url: `https://elitedentalcentre.com/services/${id}`,
        },
        provider: {
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
        "@type": "FAQPage",
        "@id": `https://elitedentalcentre.com/services/${id}#faq`,
        mainEntity: detailData.faqs.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: f.answer,
          },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://elitedentalcentre.com",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Services",
            item: "https://elitedentalcentre.com/services",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: treatment.name,
            item: `https://elitedentalcentre.com/services/${id}`,
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />

      <main className="min-h-screen bg-[#F8FAFC] text-slate-900 pb-24">
        {/* Top Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="bg-[#0B1528] text-white border-b border-slate-800 py-3.5 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-400">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <span>/</span>
              <Link href="/services" className="hover:text-white transition-colors">Services</Link>
              <span>/</span>
              <span className="text-teal-400 font-bold truncate max-w-[200px] sm:max-w-none">{treatment.name}</span>
            </div>
            <Link
              href="/services"
              className="inline-flex items-center gap-1.5 text-xs text-teal-400 hover:text-teal-300 font-bold transition-colors"
            >
              <ArrowBackOutlined sx={{ fontSize: 15 }} />
              <span>All Treatments</span>
            </Link>
          </div>
        </nav>

        {/* 1. HERO DOSSIER: Comprehensive Visual & Clinical Overview */}
        <section className="bg-white border-b border-slate-200/90 py-10 lg:py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">
              
              {/* Left Column: Clinical Imagery & Gallery Strip */}
              <div className="lg:col-span-6 space-y-4">
                <div className="relative rounded-3xl overflow-hidden border border-slate-200/90 bg-[#0B1528] shadow-xl p-2 sm:p-2.5">
                  <div className="relative h-80 sm:h-[420px] w-full rounded-2xl overflow-hidden bg-slate-900">
                    <Image
                      src={mainImage}
                      alt={`${treatment.name} clinical treatment at Elite Dental Centre`}
                      fill
                      className="object-cover"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent" />
                    
                    {/* Category Pill Tag */}
                    <div className="absolute top-4 left-4 px-3.5 py-1 rounded-full bg-slate-950/85 border border-slate-700/80 text-teal-400 font-bold text-xs backdrop-blur-md flex items-center gap-1.5 shadow-md">
                      <ScienceOutlined sx={{ fontSize: 14 }} />
                      <span>{detailData.categoryName}</span>
                    </div>

                    {/* Badge Overlay: Duration & Sterile Protocol */}
                    <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2 text-xs text-white">
                      <div className="flex items-center gap-1.5 bg-slate-900/85 px-3 py-1.5 rounded-xl border border-slate-700/80 backdrop-blur-md shadow-xs">
                        <AccessTimeOutlined sx={{ fontSize: 15, color: "#2dd4bf" }} />
                        <span className="font-mono font-semibold">Approx. {treatment.durationMin} mins</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-teal-950/85 text-teal-300 px-3 py-1.5 rounded-xl border border-teal-800/80 backdrop-blur-md font-semibold shadow-xs">
                        <VerifiedOutlined sx={{ fontSize: 15, color: "#2dd4bf" }} />
                        <span>Class-B 100% Sterile Protocol</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Secondary Clinical Gallery Thumbnails */}
                {detailData.galleryImages && detailData.galleryImages.length > 0 && (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2.5 flex items-center gap-1.5">
                      <MedicalServicesOutlined sx={{ fontSize: 14, color: "#0d9488" }} />
                      <span>Clinical Operatory & Equipment Gallery</span>
                    </p>
                    <div className="grid grid-cols-3 gap-3">
                      {detailData.galleryImages.map((img, i) => (
                        <div key={i} className="relative h-24 rounded-xl overflow-hidden border border-slate-200 bg-white shadow-2xs group">
                          <Image
                            src={img}
                            alt={`${treatment.name} equipment and procedure view ${i + 1}`}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Procedure Dossier, Pricing, Key Fast Facts */}
              <div className="lg:col-span-6 space-y-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold tracking-wide">
                    <VerifiedOutlined sx={{ fontSize: 14, color: "#0d9488" }} />
                    <span>{detailData.summaryBadge}</span>
                  </div>

                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0B1528] mt-3 tracking-tight font-sans">
                    {treatment.name}
                  </h1>

                  <p className="text-slate-600 mt-4 text-base sm:text-lg leading-relaxed">
                    {treatment.description ||
                      "Advanced clinical procedure performed with computerized diagnostics, biological tooth preservation, and painless anesthetic techniques."}
                  </p>
                </div>

                {/* Price & Immediate Action Box */}
                <div className="p-6 sm:p-7 rounded-3xl border border-slate-200 bg-[#F8FAFC] shadow-sm space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
                    <div>
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block">
                        Estimated Fee Range
                      </span>
                      <div className="flex items-baseline gap-2 mt-0.5">
                        <span className="text-3xl sm:text-4xl font-black text-[#0B1528] font-sans">
                          {formatPriceRange(treatment.price, (treatment as any).maxPrice)}
                        </span>
                        <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                          Varies by Case
                        </span>
                      </div>
                      <span className="text-xs text-slate-500 block mt-1">
                        Includes sterilization kit, diagnostics & postoperative follow-up
                      </span>
                    </div>

                    <a
                      href="#book-slot"
                      className="px-6 py-3.5 rounded-full bg-[#0B1528] hover:bg-teal-700 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 inline-flex items-center justify-center gap-2"
                    >
                      <CalendarMonthOutlined sx={{ fontSize: 16, color: "#2dd4bf" }} />
                      <span>Book Procedure</span>
                    </a>
                  </div>

                  {/* WhatsApp Quick Doctor Consultation */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <a
                      href={`https://wa.me/${clinicInfo.whatsapp}?text=${encodeURIComponent(
                        `Hello Doctor, I have questions regarding ${treatment.name} (PKR ${treatment.price}). Could you advise?`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-4 py-2.5 rounded-xl font-bold transition-colors w-full sm:w-auto justify-center"
                    >
                      <WhatsApp sx={{ fontSize: 17, color: "#059669" }} />
                      <span>WhatsApp Doctor With Questions</span>
                    </a>
                    <span className="text-slate-500 text-center sm:text-right">
                      Direct response from clinical front desk
                    </span>
                  </div>
                </div>

                {/* Clinical Fast Facts Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 pt-2">
                  <div className="p-4 rounded-2xl border border-slate-200/90 bg-white">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                      Anesthesia
                    </span>
                    <p className="text-xs font-bold text-[#0B1528] mt-1 line-clamp-2">
                      {detailData.effectsAndSensations.anesthesiaType}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl border border-slate-200/90 bg-white">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                      Infection Control
                    </span>
                    <p className="text-xs font-bold text-teal-700 mt-1">
                      Class-B Vacuum Autoclave
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl border border-slate-200/90 bg-white col-span-2 sm:col-span-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                      Guarantee
                    </span>
                    <p className="text-xs font-bold text-[#0B1528] mt-1">
                      100% Quality & Sterility
                    </p>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </section>

        {/* 2. PRE-OPERATIVE PREPARATION (PRE-CARE) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
          <div className="mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full">
              Phase 1: Preparation
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1528] mt-3 tracking-tight">
              Pre-Condition: What to Do Before Your Appointment
            </h2>
            <p className="text-slate-600 mt-2 text-sm leading-relaxed max-w-3xl">
              Following these pre-operative clinical guidelines ensures smooth anesthesia absorption, reduced bleeding, and optimal surgical safety.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {detailData.preCare.map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl border border-slate-200 bg-white shadow-xs hover:shadow-md transition-shadow duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="size-9 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 font-bold mb-4 font-mono text-sm">
                    0{idx + 1}
                  </div>
                  <h3 className="font-bold text-slate-900 text-base mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. THE CLINICAL PROCEDURE (DURING / THE PROCESS) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
          <div className="mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full">
              Phase 2: Procedure & Sensations
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1528] mt-3 tracking-tight">
              Step-by-Step Clinical Methodology
            </h2>
            <p className="text-slate-600 mt-2 text-sm leading-relaxed max-w-3xl">
              Transparency eliminates dental anxiety. Here is exactly what our surgeon executes in the operatory chair.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {detailData.expectations.map((step) => (
              <div
                key={step.step}
                className="p-6 rounded-3xl border border-slate-200 bg-white shadow-xs flex flex-col justify-between group hover:border-teal-500/60 transition-colors duration-200"
              >
                <div>
                  <span className="text-xs font-mono font-bold text-teal-700 uppercase bg-teal-50 px-2.5 py-1 rounded-md">
                    Step {step.step}
                  </span>
                  <h3 className="font-bold text-slate-900 text-base mt-4 mb-2 group-hover:text-teal-700 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {step.desc || step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Sensation & Comfort Guarantee Banner */}
          <div className="mt-8 p-6 sm:p-7 rounded-3xl border border-teal-200/80 bg-teal-50/70 flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="size-12 rounded-2xl bg-teal-600 text-white shrink-0 flex items-center justify-center shadow-md shadow-teal-600/30">
              <HealingOutlined sx={{ fontSize: 26 }} />
            </div>
            <div>
              <h4 className="font-bold text-[#0B1528] text-sm">
                What Will You Feel During the Procedure?
              </h4>
              <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                <span className="font-bold text-teal-900">During: </span>
                {detailData.effectsAndSensations.during}
              </p>
              <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                <span className="font-bold text-teal-900">Immediately After: </span>
                {detailData.effectsAndSensations.immediateAfter}
              </p>
            </div>
          </div>
        </section>

        {/* 4. POST-OPERATIVE CARE & PRECAUTIONS (POST-CONDITION) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
          <div className="mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full">
              Phase 3: Recovery Timeline
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1528] mt-3 tracking-tight">
              Post-Condition: Official Aftercare & Precautions
            </h2>
            <p className="text-slate-600 mt-2 text-sm leading-relaxed max-w-3xl">
              Strict adherence to postoperative precautions accelerates tissue recovery, prevents complications, and guarantees long-term procedural success.
            </p>
          </div>

          {/* Structured Timeline Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {detailData.postCare.map((phase, idx) => (
              <div
                key={idx}
                className="p-6 sm:p-7 rounded-3xl border border-slate-200 bg-white shadow-xs space-y-4"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-xs font-mono font-bold text-teal-700 uppercase bg-teal-50 px-2.5 py-1 rounded-md">
                    {phase.phase}
                  </span>
                  <span className="text-[11px] font-bold text-slate-400">Recovery Stage</span>
                </div>
                <h3 className="font-bold text-slate-900 text-base">
                  {phase.title}
                </h3>
                <ul className="space-y-2.5">
                  {phase.instructions.map((inst, i) => (
                    <li key={i} className="text-xs text-slate-600 leading-relaxed flex items-start gap-2">
                      <span className="size-1.5 rounded-full bg-teal-600 shrink-0 mt-1.5" />
                      <span>{inst}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Official Doctor Instructions Card (If present in database) */}
          {treatment.instructions && (
            <div className="mt-8 rounded-3xl border border-teal-200/80 bg-teal-50/60 p-7 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-teal-600 text-white shrink-0 flex items-center justify-center">
                  <AssignmentTurnedInOutlined sx={{ fontSize: 24 }} />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-teal-950">
                    Dr. Jalil Riaz&apos;s Specific Clinical Notes for {treatment.name}
                  </h3>
                  <div className="mt-3 text-sm text-slate-800 leading-relaxed bg-white/90 p-4 rounded-2xl border border-teal-200/50 shadow-2xs">
                    {treatment.instructions}
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* 5. CLINICAL BENEFITS & EFFECTS (OUTCOMES) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
          <div className="mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full">
              Phase 4: Outcomes & Effects
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1528] mt-3 tracking-tight">
              Expected Clinical Effects & Long-Term Health Impact
            </h2>
            <p className="text-slate-600 mt-2 text-sm leading-relaxed max-w-3xl">
              Beyond aesthetic improvements, here is how {treatment.name} safeguards your biological dentition and oral health.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {detailData.clinicalBenefits.map((benefit, idx) => (
              <div
                key={idx}
                className="p-5 sm:p-6 rounded-3xl border border-slate-200 bg-white shadow-xs flex items-start gap-4"
              >
                <div className="p-2 rounded-xl bg-teal-50 text-teal-700 shrink-0 flex items-center justify-center">
                  <CheckCircleOutlined sx={{ fontSize: 22, color: "#0d9488" }} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800 leading-relaxed">
                    {benefit}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 6. PROCEDURAL FAQS ACCORDION (UNIFIED FAQ DESIGN) */}
        <div className="bg-white border-t border-slate-200 mt-16">
          <FaqSection
            kicker="Patient Guidance"
            title={`Frequently Asked Questions About ${treatment.name}`}
            subtitle={`Here is everything you need to know about preparation, clinical recovery, and expected longevity for ${treatment.name} at Elite Dental.`}
            items={detailData.faqs.map((faq) => ({
              question: faq.question,
              answer: faq.answer,
            }))}
          />
        </div>

        {/* 7. INSTANT APPOINTMENT SCHEDULING (Anchor for #book-slot) */}
        <section id="book-slot" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 scroll-mt-20">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full">
              Instant Reservation
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1528] mt-3 tracking-tight">
              Reserve Your Slot for {treatment.name}
            </h2>
            <p className="text-slate-600 mt-2 text-sm">
              Select your date and time slot below. Receive instant confirmation via SMS and WhatsApp.
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 bg-white shadow-xl">
            <BookingForm
              treatments={allTreatments}
              defaultTreatmentId={treatment.id}
            />
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}
