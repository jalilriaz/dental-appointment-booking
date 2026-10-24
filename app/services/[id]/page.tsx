import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import {
  Clock,
  Phone,
  ArrowLeft,
  ShieldCheck,
  Sparkles,
  HelpCircle,
  FileCheck,
  Calendar,
} from "lucide-react"
import Navbar from "@/components/Navbar"
import { clinicInfo } from "@/app/constants/mockData"
import Link from "next/link"
import { getTreatmentImage } from "@/lib/utils"
import { getTreatmentExpectations } from "@/lib/treatmentDetails"

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const treatment = await prisma.treatment.findUnique({
    where: { id },
  })

  if (!treatment || !treatment.isActive) {
    notFound()
  }

  const { categoryName, expectations, faqs } = getTreatmentExpectations(
    treatment.name,
    treatment.instructions
  )

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 overflow-hidden flex-1">
        <div className="absolute inset-0 gradient-primary opacity-10" />
        <div className="absolute top-0 right-1/4 w-[600px] h-[400px] bg-teal-500/10 rounded-full blur-3xl" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-teal-400 mt-4 mb-6 transition-premium"
          >
            <ArrowLeft className="size-4" />
            Back to Services
          </Link>

          <div className="glass-card rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl">
            <div className="w-full h-[300px] md:h-[400px] relative">
              <img
                src={treatment.imageUrl || getTreatmentImage(treatment.name)}
                alt={treatment.name}
                className="w-full h-full object-cover rounded-t-[2rem]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />

              <div className="absolute bottom-0 left-0 w-full p-8 md:p-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-medium mb-3 border border-teal-500/30">
                  {categoryName}
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
                  {treatment.name}
                </h1>
                <div className="flex items-center gap-4 text-slate-300">
                  <div className="flex items-center gap-2">
                    <Clock className="size-5 text-teal-400" />
                    <span>Approx. {treatment.durationMin} mins</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 md:p-12 bg-slate-900/50">
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-white">
                  About this Treatment
                </h2>
                <p className="text-lg text-slate-300 leading-relaxed">
                  {treatment.description ||
                    "Experience top-tier professional dental care tailored to your specific needs. Our expert team ensures comfort and excellence in every procedure."}
                </p>

                {treatment.instructions && (
                  <div className="bg-teal-950/30 border border-teal-500/30 rounded-2xl p-5 flex items-start gap-3">
                    <FileCheck className="size-5 text-teal-400 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="text-sm font-semibold text-teal-300">
                        Doctor&apos;s Clinical Aftercare Note
                      </h4>
                      <p className="text-sm text-slate-300 mt-1">
                        {treatment.instructions}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Why Choose Us For This */}
              <div className="mt-12">
                <h2 className="text-2xl font-semibold text-white mb-6">
                  Why Choose Elite Dental?
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-slate-950/50 p-6 rounded-2xl border border-white/5 flex gap-4 items-start">
                    <div className="size-10 rounded-full bg-teal-500/10 flex items-center justify-center shrink-0">
                      <ShieldCheck className="size-5 text-teal-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-white mb-1">
                        Board-Certified Specialists
                      </h3>
                      <p className="text-sm text-slate-400">
                        Performed by qualified dental surgeons with specialized clinical training and thousands of completed procedures.
                      </p>
                    </div>
                  </div>
                  <div className="bg-slate-950/50 p-6 rounded-2xl border border-white/5 flex gap-4 items-start">
                    <div className="size-10 rounded-full bg-teal-500/10 flex items-center justify-center shrink-0">
                      <Sparkles className="size-5 text-teal-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-white mb-1">
                        State-of-the-Art Technology
                      </h3>
                      <p className="text-sm text-slate-400">
                        Utilizing digital 3D scans, ultrasonic instruments, and sterile autoclave protocols for maximum safety and comfort.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* What to Expect */}
              <div className="mt-12">
                <h2 className="text-2xl font-semibold text-white mb-2">
                  What to Expect
                </h2>
                <p className="text-sm text-slate-400 mb-6">
                  Step-by-step clinical process for your {treatment.name} procedure.
                </p>
                <div className="space-y-4 relative before:absolute before:inset-y-0 before:left-5 before:w-0.5 before:bg-slate-800 ml-2">
                  {expectations.map((item) => (
                    <div key={item.step} className="relative flex items-center gap-6 pl-12">
                      <div className="absolute left-0 size-10 rounded-full bg-slate-900 border-4 border-slate-950 flex items-center justify-center -ml-5 text-teal-400 font-bold text-sm">
                        {item.step}
                      </div>
                      <div className="bg-slate-950/50 p-5 rounded-xl border border-white/5 w-full">
                        <h3 className="font-semibold text-white mb-1 text-base">
                          {item.title}
                        </h3>
                        <p className="text-sm text-slate-400 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* FAQs / Quick Info */}
              <div className="mt-12 mb-12">
                <h2 className="text-2xl font-semibold text-white mb-2">
                  Common Questions
                </h2>
                <p className="text-sm text-slate-400 mb-6">
                  Frequently asked questions specifically about {treatment.name}.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  {faqs.map((faq, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-950/50 p-5 rounded-xl border border-white/5 flex flex-col justify-start"
                    >
                      <div className="flex items-start gap-3">
                        <HelpCircle className="size-5 text-teal-400 mt-0.5 shrink-0" />
                        <div>
                          <h3 className="font-semibold text-white mb-1 text-sm sm:text-base">
                            {faq.question}
                          </h3>
                          <p className="text-sm text-slate-400 leading-relaxed mt-2">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-950/50 rounded-2xl p-8 border border-teal-500/20 text-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <h3 className="text-2xl font-bold text-white mb-3">
                  Ready to Schedule?
                </h3>
                <p className="text-slate-400 mb-8 max-w-lg mx-auto">
                  Take the next step towards a healthier, brighter smile.
                  Contact our clinic to book your appointment for {treatment.name} today.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link
                    href={`/book?treatment=${treatment.id}`}
                    className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 sm:px-10 py-3 sm:py-4 gradient-primary-h text-white text-base sm:text-lg font-semibold rounded-full shadow-lg shadow-teal-500/20 hover:shadow-teal-500/40 hover:-translate-y-0.5 transition-all duration-300 active:scale-95"
                  >
                    <Calendar className="size-4 sm:size-5" />
                    Book Online Now
                  </Link>
                  <a
                    href={`https://wa.me/${clinicInfo.whatsapp}?text=Hi, I would like to book an appointment for: ${treatment.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 border border-white/10 text-slate-300 hover:bg-white/[0.05] hover:text-white text-base sm:text-lg font-semibold rounded-full transition-all duration-300"
                  >
                    <Phone className="size-4 sm:size-5 text-teal-400" />
                    Book via WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
