"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { clinicInfo } from "@/app/constants/mockData";
import {
  PhoneOutlined,
  AccessTimeOutlined,
  LocationOnOutlined,
  WhatsApp,
  VerifiedOutlined,
  ChevronRightOutlined,
  MenuOutlined,
  CloseOutlined,
  CalendarMonthOutlined,
} from "@mui/icons-material";
import { usePathname } from "next/navigation";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Services & Treatments", href: "/services" },
  { label: "Our Doctors", href: "/doctors" },
  { label: "Our Clinic", href: "/about" },
  { label: "Contact & Location", href: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300">
      {/* Top Clinical Utility Bar */}
      <div className="bg-slate-950 text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-slate-300 font-medium">
              <AccessTimeOutlined sx={{ fontSize: 15, color: "#2dd4bf" }} />
              {clinicInfo.workingHours}
            </span>
            <a
              href="https://www.google.com/maps/search/?api=1&query=Elite+Dental+%26+Aesthetic+Centre+G-8+Markaz+Islamabad"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1.5 text-slate-300 hover:text-teal-300 transition-colors"
              title="Open Elite Dental & Aesthetic Centre on Google Maps"
            >
              <LocationOnOutlined sx={{ fontSize: 15, color: "#2dd4bf" }} />
              <span className="hover:underline">{clinicInfo.address}</span>
            </a>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <div className="flex items-center gap-1 text-teal-300 bg-teal-950/70 border border-teal-800/60 px-2 py-0.5 rounded-full">
              <VerifiedOutlined sx={{ fontSize: 14, color: "#2dd4bf" }} />
              <span>ISO 9001 Certified Sterilization</span>
            </div>
            <a
              href={`tel:${clinicInfo.phone}`}
              className="flex items-center gap-1.5 text-white hover:text-teal-300 transition-colors"
            >
              <PhoneOutlined sx={{ fontSize: 14, color: "#2dd4bf" }} />
              <span>{clinicInfo.phone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav
        className={`transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-md shadow-slate-900/5 border-b border-slate-200/80 py-2.5"
            : "bg-white/90 backdrop-blur-sm border-b border-slate-200/50 py-3.5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-2 lg:gap-4">
            {/* Clinic Brand Identity with Official SVG Logo */}
            <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
              <div className="relative size-9 sm:size-10 rounded-xl bg-slate-950 p-1.5 flex items-center justify-center shadow-md shadow-teal-600/20 group-hover:scale-105 transition-transform duration-300 shrink-0">
                <Image
                  src="/logo.svg"
                  alt="Elite Dental Centre Logo"
                  width={32}
                  height={32}
                  className="w-full h-full object-contain"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-950 font-sans whitespace-nowrap">
                  ELITE <span className="text-teal-600">DENTAL</span>
                </span>
                <span className="text-[9px] sm:text-[10px] tracking-wider uppercase font-semibold text-slate-500 whitespace-nowrap hidden sm:inline-block">
                  Center of Advanced Implantology
                </span>
              </div>
            </Link>

            {/* Desktop Links */}
            <div className="hidden lg:flex items-center gap-0.5 xl:gap-1.5 shrink-0">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`whitespace-nowrap px-2.5 py-1.5 xl:px-3.5 xl:py-2 rounded-lg text-xs xl:text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "text-teal-700 bg-teal-50/80 font-semibold"
                        : "text-slate-700 hover:text-teal-700 hover:bg-slate-50"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Direct CTAs with MUI Icons */}
            <div className="hidden md:flex items-center gap-2 xl:gap-3 shrink-0">
              <a
                href={`https://wa.me/${clinicInfo.whatsapp}?text=${encodeURIComponent(
                  "Hello Elite Dental, I would like to consult or schedule an appointment."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="whitespace-nowrap flex items-center gap-1.5 px-3 py-2 xl:px-4 xl:py-2 text-xs font-semibold rounded-lg text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 transition-all duration-200 active:scale-95 shrink-0"
              >
                <WhatsApp sx={{ fontSize: 16, color: "#059669" }} />
                <span>WhatsApp Doctor</span>
              </a>

              <Link
                href="/#book"
                className="whitespace-nowrap flex items-center gap-1.5 xl:gap-2 px-3.5 py-2 xl:px-5 xl:py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-white bg-slate-950 hover:bg-teal-700 shadow-md shadow-slate-950/20 hover:shadow-teal-600/30 transition-all duration-200 active:scale-95 shrink-0"
              >
                <CalendarMonthOutlined sx={{ fontSize: 16, color: "#2dd4bf" }} />
                <span>Book Visit</span>
              </Link>

              <Link
                href="/login"
                className="whitespace-nowrap text-xs font-semibold text-slate-600 hover:text-slate-900 px-2 py-1.5 shrink-0"
                title="Staff & Doctor Login"
              >
                Portal
              </Link>
            </div>

            {/* Mobile Toggle Button */}
            <div className="flex lg:hidden items-center gap-2">
              <Link
                href="/#book"
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-slate-950"
              >
                Book
              </Link>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="p-2 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100"
                aria-label="Toggle navigation menu"
              >
                {mobileOpen ? (
                  <CloseOutlined sx={{ fontSize: 24 }} />
                ) : (
                  <MenuOutlined sx={{ fontSize: 24 }} />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-2.5 rounded-lg text-sm font-medium flex items-center justify-between ${
                      isActive
                        ? "text-teal-700 bg-teal-50 font-semibold"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span>{link.label}</span>
                    <ChevronRightOutlined sx={{ fontSize: 18, color: "#94a3b8" }} />
                  </Link>
                );
              })}

              <div className="pt-3 border-t border-slate-100 mt-2 flex flex-col gap-2">
                <a
                  href={`https://wa.me/${clinicInfo.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200"
                >
                  <WhatsApp sx={{ fontSize: 18, color: "#059669" }} />
                  <span>WhatsApp Clinic</span>
                </a>

                <Link
                  href="/#book"
                  className="flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold text-white bg-slate-950"
                >
                  <CalendarMonthOutlined sx={{ fontSize: 18, color: "#2dd4bf" }} />
                  <span>Book Instant Appointment</span>
                </Link>

                <Link
                  href="/login"
                  className="text-center py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  Doctor / Receptionist Login
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
