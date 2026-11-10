import Link from "next/link";
import Image from "next/image";
import { clinicInfo } from "@/app/constants/mockData";
import {
  LocationOnOutlined,
  PhoneOutlined,
  WhatsApp,
  VerifiedOutlined,
  HealthAndSafetyOutlined,
  SupportAgentOutlined,
} from "@mui/icons-material";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800">
      {/* Upper Clinical Guarantee Bar */}
      <div className="border-b border-slate-800/80 bg-slate-900/60 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-3">
              <div className="p-2 rounded-lg bg-teal-950 text-teal-400 flex items-center justify-center">
                <VerifiedOutlined sx={{ fontSize: 22, color: "#2dd4bf" }} />
              </div>
              <div>
                <p className="font-bold text-white text-sm">Class-B Sterilization</p>
                <p className="text-[11px] text-slate-400">Biological spore testing on every cycle</p>
              </div>
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-3">
              <div className="p-2 rounded-lg bg-teal-950 text-teal-400 flex items-center justify-center">
                <HealthAndSafetyOutlined sx={{ fontSize: 22, color: "#2dd4bf" }} />
              </div>
              <div>
                <p className="font-bold text-white text-sm">Emergency Pain Relief</p>
                <p className="text-[11px] text-slate-400">Same-day priority allocation</p>
              </div>
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-3">
              <div className="p-2 rounded-lg bg-teal-950 text-teal-400 flex items-center justify-center">
                <SupportAgentOutlined sx={{ fontSize: 22, color: "#2dd4bf" }} />
              </div>
              <div>
                <p className="font-bold text-white text-sm">Post-Care Support</p>
                <p className="text-[11px] text-slate-400">Direct WhatsApp access to your doctor</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand info with Official SVG Logo */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="size-9 rounded-lg bg-slate-900 p-1.5 flex items-center justify-center border border-slate-800">
                <Image
                  src="/logo.svg"
                  alt="Elite Dental Logo"
                  width={26}
                  height={26}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">
                ELITE <span className="text-teal-400">DENTAL</span>
              </span>
            </Link>
            <p className="text-slate-400 max-w-sm leading-relaxed text-xs">
              Center of Advanced Implantology and Aesthetic Dentistry in G-8 Markaz, Islamabad. Dedicated to evidence-based practice, biological tooth preservation, and patient comfort.
            </p>
            <div className="space-y-1.5 text-slate-400 text-xs">
              <div className="flex items-start gap-2">
                <LocationOnOutlined sx={{ fontSize: 16, color: "#2dd4bf" }} className="shrink-0 mt-0.5" />
                <span>{clinicInfo.address}</span>
              </div>
              <a
                href="https://www.google.com/maps/dir/?api=1&destination=Doctors+Plaza+6+Markaz+Rd+next+to+Islamabad+Diagnostic+Centre+G-8+Markaz+Islamabad"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-teal-400 hover:text-teal-300 font-bold text-[11px] ml-6 transition-colors"
              >
                <span>View Pin on Google Maps</span>
                <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-4">
              Patient Navigation
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/" className="hover:text-teal-300 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-teal-300 transition-colors">
                  Treatments & Pricing
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-teal-300 transition-colors">
                  Our Surgeons & Clinic
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-teal-300 transition-colors">
                  Location & Contact
                </Link>
              </li>
              <li>
                <Link href="/#book" className="text-teal-400 font-semibold hover:text-teal-300 transition-colors">
                  Online Appointment Booking
                </Link>
              </li>
            </ul>
          </div>

          {/* Timings & Direct Contact */}
          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-4">
              Working Hours
            </h4>
            <div className="space-y-1 text-xs">
              <p className="text-teal-400 font-bold font-mono">{clinicInfo.workingHours}</p>
              <p className="text-slate-500 text-[11px] pt-1">Sunday: Emergency appointments on-call</p>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-800 space-y-2">
              <a
                href={`tel:${clinicInfo.phone}`}
                className="flex items-center gap-2 text-white font-bold hover:text-teal-300 transition-colors"
              >
                <PhoneOutlined sx={{ fontSize: 16, color: "#2dd4bf" }} />
                <span>{clinicInfo.phone}</span>
              </a>
              <a
                href={`https://wa.me/${clinicInfo.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-emerald-400 font-bold hover:text-emerald-300 transition-colors"
              >
                <WhatsApp sx={{ fontSize: 16, color: "#10b981" }} />
                <span>WhatsApp: {clinicInfo.whatsapp}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-10 mt-10 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-slate-500 text-[11px] gap-3">
          <p>© {new Date().getFullYear()} Elite Dental Centre. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/login" className="hover:text-slate-300 transition-colors">
              Staff Portal
            </Link>
            <span>•</span>
            <span>PMC / PMDC Registered</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
