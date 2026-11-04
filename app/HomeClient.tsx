"use client"

import Image from "next/image"
import Link from "next/link"
import {
  clinicInfo,
  testimonials,
  whyChooseUs,
  teamMembers,
} from "@/app/constants/mockData"
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Star,
  ChevronRight,
  ArrowRight,
  Award,
} from "lucide-react"
import TestimonialCard from "@/components/TestimonialCard"
import ScrollReveal from "@/components/ScrollReveal"
import { getTreatmentImage, getServiceDescription } from "@/lib/utils"
interface Treatment {
  id: string
  name: string
  description: string | null
  imageUrl: string | null
  durationMin: number
}

interface HomeClientProps {
  treatments: Treatment[]
  workingHours: string
}

export default function HomeClient({
  treatments,
  workingHours,
}: HomeClientProps) {
  return (
    <>
      {/* Why Choose Us */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-14">
              <h2 className="text-3xl font-extrabold text-slate-900">
                Why Choose{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-teal-800">
                  Elite Dental?
                </span>
              </h2>
              <p className="mt-3 text-lg text-slate-600 max-w-2xl mx-auto">
                We combine expertise, technology, and compassion for the best
                dental experience.
              </p>
            </div>
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyChooseUs.map((item, idx) => (
              <ScrollReveal key={item.title} delay={idx * 0.08}>
                <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-lg hover:border-teal-300 transition-premium group h-full">
                  <span className="text-3xl">{item.icon}</span>
                  <h3 className="mt-4 text-lg font-bold text-slate-900 group-hover:text-teal-700 transition-premium">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 border-t border-slate-200/80 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-14">
              <h2 className="text-3xl font-extrabold text-slate-900">
                Our{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-teal-800">
                  Services
                </span>
              </h2>
              <p className="mt-3 text-lg text-slate-600 max-w-2xl mx-auto">
                Professional dental treatments to keep your smile healthy and
                beautiful.
              </p>
            </div>
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {treatments.map((treatment, idx) => (
              <ScrollReveal key={treatment.id} delay={idx * 0.08}>
                <div className="group rounded-2xl p-0 border border-slate-200/80 bg-white shadow-xs hover:border-teal-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col h-full">
                  <div className="w-full h-52 relative overflow-hidden flex items-center justify-center p-0 bg-slate-100">
                    <Image
                      src={
                        treatment.imageUrl || getTreatmentImage(treatment.name)
                      }
                      alt={treatment.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 relative z-10"
                    />
                    {/* Duration badge */}
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-xs border border-slate-200 text-xs font-semibold text-slate-700 z-20 shadow-xs">
                      <Clock className="size-3 text-teal-600" />
                      {treatment.durationMin} min
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col bg-white">
                    <h3 className="text-lg lg:text-xl font-bold text-slate-900 group-hover:text-teal-700 transition-premium">
                      {treatment.name}
                    </h3>
                    <p className="mt-3 text-sm text-slate-600 leading-relaxed flex-1">
                      {treatment.description ||
                        getServiceDescription(treatment.name)}
                    </p>
                    <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-end">
                      <Link
                        href={`/services/${treatment.id}`}
                        className="text-sm font-semibold text-teal-700 hover:text-teal-800 inline-flex items-center gap-1 transition-premium group-hover:translate-x-1"
                      >
                        Learn More <ChevronRight className="size-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
          <ScrollReveal delay={0.3}>
            <div className="text-center mt-10">
              <Link
                href="/services"
                className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-full font-semibold shadow-md shadow-teal-600/20 hover:shadow-lg transition-premium active:scale-95"
              >
                View All Services <ArrowRight className="size-4" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-14">
              <h2 className="text-3xl font-extrabold text-slate-900">
                What Our{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-teal-800">
                  Patients Say
                </span>
              </h2>
              <p className="mt-3 text-lg text-slate-600">
                Real stories from happy patients.
              </p>
            </div>
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {testimonials.map((t, idx) => (
              <ScrollReveal key={t.name} delay={idx * 0.1}>
                <TestimonialCard t={t} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA & Map Section */}
      <section className="border-t border-slate-200/80 relative overflow-hidden bg-teal-50/30">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row relative z-10 w-full min-h-[400px]">
          {/* Left Side: CTA Content */}
          <div className="flex-1 flex flex-col justify-center p-8 lg:p-16 text-center lg:text-left relative z-10 lg:border-r border-slate-200">
            <ScrollReveal direction="left">
              <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900">
                Ready to Transform Your Smile?
              </h2>
              <p className="mt-4 text-lg text-slate-600 max-w-xl mx-auto lg:mx-0">
                Book your appointment today and experience the difference of
                professional dental care at Elite Dental Centre.
              </p>
              <div className="mt-8 flex flex-wrap gap-4 justify-center lg:justify-start">
                <a
                  href={`https://wa.me/${clinicInfo.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-teal-600 hover:bg-teal-700 text-white text-lg font-semibold rounded-full shadow-lg shadow-teal-600/20 hover:shadow-xl transition-premium active:scale-95"
                >
                  <Phone className="size-5" />
                  Book Your Appointment
                </a>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Side: Map */}
          <div className="flex-1 h-[400px] lg:h-auto w-full relative">
            <div className="absolute inset-0">
              <iframe
                src="https://maps.google.com/maps?q=D-Watson+Chemist,+F-10+Markaz,+Islamabad&amp;hl=en&amp;z=15&amp;ie=UTF8&amp;iwloc=&amp;output=embed"
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Clinic Location at D-Watson Chemist, F-10 Markaz, Islamabad"
                className="absolute inset-0"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="size-8 rounded-full bg-teal-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-teal-600/20">
                  E
                </div>
                <span className="text-slate-900 font-extrabold text-base">
                  Elite Dental Centre
                </span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                {clinicInfo.tagline}. Professional dental care in a comfortable,
                modern setting.
              </p>
            </div>
            <div>
              <h3 className="text-slate-900 font-bold mb-4">Quick Links</h3>
              <div className="space-y-2 text-sm">
                <Link
                  href="/about"
                  className="block text-slate-600 hover:text-teal-600 font-medium transition-premium"
                >
                  About Us
                </Link>
                <Link
                  href="/services"
                  className="block text-slate-600 hover:text-teal-600 font-medium transition-premium"
                >
                  Our Services
                </Link>
                <Link
                  href="/contact"
                  className="block text-slate-600 hover:text-teal-600 font-medium transition-premium"
                >
                  Contact Us
                </Link>
              </div>
            </div>
            <div>
              <h3 className="text-slate-900 font-bold mb-4">Clinic Hours</h3>
              <div className="space-y-2 text-sm">
                <p className="flex items-center gap-2 text-slate-600 font-medium">
                  <Clock className="size-4 text-teal-600" /> {workingHours}
                </p>
                <p className="flex items-center gap-2 text-slate-600 font-medium">
                  <Clock className="size-4 text-teal-600" />{" "}
                  {clinicInfo.sundayHours}
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-slate-900 font-bold mb-4">Contact</h3>
              <div className="space-y-3 text-sm">
                <p className="flex items-start gap-2 text-slate-600 font-medium">
                  <MapPin className="size-4 text-teal-600 mt-0.5 shrink-0" />
                  <span>{clinicInfo.address}</span>
                </p>
                <p className="flex items-center gap-2 text-slate-600 font-medium">
                  <Phone className="size-4 text-teal-600" />
                  {clinicInfo.phone}
                </p>
                <p className="flex items-center gap-2 text-slate-600 font-medium">
                  <Mail className="size-4 text-teal-600" />
                  {clinicInfo.email}
                </p>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} {clinicInfo.name}. All rights
              reserved.
            </p>
            <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
              <Award className="size-4 text-teal-600" />
              <span>Certified by Pakistan Dental Association</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
