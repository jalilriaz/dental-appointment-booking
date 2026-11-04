import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { clinicInfo } from "@/app/constants/mockData";
import {
  VerifiedOutlined,
  CheckCircleOutlined,
  HealthAndSafetyOutlined,
  MedicalServicesOutlined,
  SupportAgentOutlined,
} from "@mui/icons-material";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Our Clinic & Specialists | Elite Dental Centre Islamabad",
  description:
    "Meet Dr. Jalil Riaz and our specialized dental surgery team at Elite Dental Centre, F-10 Markaz Islamabad. 15+ years of clinical excellence in cosmetic dentistry, dental implants, and painless restorations.",
  alternates: {
    canonical: "https://elitedentalcentre.com/about",
  },
};

export default function AboutPage() {
  return (
    <div className="bg-slate-50 min-h-screen">
      <Navbar />

      {/* Hero / Philosophy */}
      <section className="bg-slate-950 text-white py-16 lg:py-24 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-400 bg-teal-950 border border-teal-800 px-3 py-1 rounded-full">
              Our Clinic & Medical Heritage
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white mt-4 tracking-tight">
              Excellence in Precision Dentistry
            </h1>
            <p className="mt-4 text-slate-300 text-base sm:text-lg leading-relaxed">
              Founded on the core belief that dental treatment should be pain-free, scientifically grounded, and transparent. We combine international sterilization standards with personalized patient care.
            </p>
          </div>
        </div>
      </section>

      {/* Lead Doctor Dossier (E-E-A-T Focus) */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Doctor Card Profile */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-slate-200 bg-slate-900 p-3 shadow-xl">
                <div className="relative h-96 w-full rounded-xl overflow-hidden bg-slate-800">
                  <Image
                    src="/images/services/dental_crown.png"
                    alt="Dr. Jalil Riaz - Chief Dental Surgeon"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="text-xs font-mono uppercase tracking-wider text-teal-400 font-bold">
                      PMC / PMDC Registered Specialist
                    </div>
                    <h3 className="text-2xl font-bold mt-1">Dr. Jalil Riaz</h3>
                    <p className="text-xs text-slate-300">BDS, RDS, C-Implant (Germany), MCPS (Oral Surgery)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Credentials & Background */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full">
                  Medical Leadership
                </span>
                <h2 className="text-3xl font-extrabold text-slate-950 mt-3 tracking-tight">
                  15+ Years of Dedicated Clinical Practice
                </h2>
                <p className="text-slate-600 mt-4 leading-relaxed text-base">
                  Dr. Jalil Riaz has pioneered computer-guided implant dentistry and aesthetic smile makeovers in Islamabad for over a decade. His philosophy prioritizes biological tooth preservation and minimally invasive surgical techniques.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 pt-2">
                {[
                  {
                    title: "German Certified Implantology",
                    desc: "Trained in advanced bone regeneration and immediate-load dental implants.",
                  },
                  {
                    title: "Painless Sedation Protocols",
                    desc: "Specialized in anxiety-free treatments for dental phobic patients.",
                  },
                  {
                    title: "Certified Digital Smile Design",
                    desc: "Utilizing 3D facial aesthetic software before prepping porcelain veneers.",
                  },
                  {
                    title: "Strict Spore-Tested Sterilization",
                    desc: "Continuous hospital-grade infection control certified under international ISO standards.",
                  },
                ].map((cred, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                    <div className="flex items-center gap-2 text-teal-700 font-bold text-sm mb-1">
                      <CheckCircleOutlined sx={{ fontSize: 16, color: "#0d9488" }} />
                      <span>{cred.title}</span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">{cred.desc}</p>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex items-center gap-4">
                <Link
                  href="/#book"
                  className="px-6 py-3 rounded-xl bg-slate-950 hover:bg-teal-700 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-colors"
                >
                  Schedule Consultation with Dr. Jalil
                </Link>
                <a
                  href={`tel:${clinicInfo.phone}`}
                  className="text-xs font-bold text-slate-700 hover:text-teal-700"
                >
                  Direct Clinic Line: {clinicInfo.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Clinic Values & Standards */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-100/70 border border-teal-200 px-3 py-1 rounded-full">
              Patient Charter
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 mt-3 tracking-tight">
              The Elite Dental Standard of Care
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl border border-slate-200 bg-white shadow-xs">
              <div className="size-12 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center mb-5">
                <VerifiedOutlined sx={{ fontSize: 26, color: "#0d9488" }} />
              </div>
              <h3 className="text-lg font-bold text-slate-950 mb-2">Zero Pressure, Transparent Advice</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                We explain all treatment options, biological trade-offs, and costs before initiating any treatment.
              </p>
            </div>

            <div className="p-8 rounded-2xl border border-slate-200 bg-white shadow-xs">
              <div className="size-12 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center mb-5">
                <MedicalServicesOutlined sx={{ fontSize: 26, color: "#0d9488" }} />
              </div>
              <h3 className="text-lg font-bold text-slate-950 mb-2">Single-Visit Restorations</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                High-precision intraoral scanning eliminates traditional messy impressions for crowns and aligners.
              </p>
            </div>

            <div className="p-8 rounded-2xl border border-slate-200 bg-white shadow-xs">
              <div className="size-12 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center mb-5">
                <SupportAgentOutlined sx={{ fontSize: 26, color: "#0d9488" }} />
              </div>
              <h3 className="text-lg font-bold text-slate-950 mb-2">24/7 Post-Operative Support</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Dedicated emergency lines and direct WhatsApp doctor contact after every surgical procedure.
              </p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
