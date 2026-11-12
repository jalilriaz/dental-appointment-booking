"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  DashboardOutlined,
  PersonAddAlt1Outlined,
  CalendarMonthOutlined,
  MedicalServicesOutlined,
  PeopleAltOutlined,
  AttachMoneyOutlined,
  SettingsOutlined,
  Inventory2Outlined,
  BadgeOutlined,
  LogoutOutlined,
  CloseOutlined,
  VerifiedUserOutlined,
  LocalHospitalOutlined,
} from "@mui/icons-material";

const navSections = [
  {
    title: "Clinical Desk",
    items: [
      { label: "Dashboard", href: "/admin", icon: DashboardOutlined },
      { label: "Walk-In Booking", href: "/admin/walk-in", icon: PersonAddAlt1Outlined, highlight: true },
      { label: "Appointments", href: "/admin/appointments", icon: CalendarMonthOutlined },
      { label: "Patients Directory", href: "/admin/patients", icon: PeopleAltOutlined },
      { label: "Doctors & Specialists", href: "/admin/doctors", icon: LocalHospitalOutlined },
    ],
  },
  {
    title: "Practice & Revenue",
    items: [
      { label: "Services & Pricing", href: "/admin/services", icon: MedicalServicesOutlined },
      { label: "Revenue Analytics", href: "/admin/revenue", icon: AttachMoneyOutlined },
      { label: "Supplies & Inventory", href: "/admin/inventory", icon: Inventory2Outlined },
    ],
  },
  {
    title: "Governance",
    items: [
      { label: "Staff Accounts", href: "/admin/staff", icon: BadgeOutlined },
      { label: "Clinic Settings", href: "/admin/settings", icon: SettingsOutlined },
    ],
  },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {
      console.error("Logout request failed:", e);
    } finally {
      if (typeof window !== "undefined") {
        try {
          localStorage.clear();
          sessionStorage.clear();
          document.cookie = "session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
          document.cookie = "refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        } catch {}
        window.location.href = "/";
      }
    }
  };

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-slate-200/90 flex flex-col text-slate-800 transition-transform duration-300 lg:translate-x-0 shadow-sm ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Area */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-100">
          <Link href="/admin" className="flex items-center gap-3 group">
            <div className="relative size-10 rounded-2xl bg-[#0B1528] p-2 flex items-center justify-center shadow-md shadow-teal-700/15 group-hover:scale-105 transition-transform duration-300">
              <Image
                src="/logo.svg"
                alt="Elite Dental Logo"
                width={28}
                height={28}
                className="w-full h-full object-contain"
                priority
              />
            </div>
            <div>
              <span className="font-black text-sm text-slate-900 tracking-tight font-sans block leading-none">
                ELITE <span className="text-teal-600">DENTAL</span>
              </span>
              <p className="text-[10px] text-teal-700 font-extrabold tracking-wider uppercase mt-1">
                Clinical Suite
              </p>
            </div>
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="lg:hidden p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <CloseOutlined sx={{ fontSize: 20 }} />
          </button>
        </div>

        {/* Grouped Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-5 overflow-y-auto">
          {navSections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-1">
              <p className="px-3 text-[10px] uppercase tracking-wider text-slate-400 font-extrabold">
                {section.title}
              </p>
              <div className="space-y-0.5 pt-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                        active
                          ? "bg-teal-50 text-teal-800 border border-teal-200/80 shadow-2xs font-extrabold"
                          : item.highlight
                          ? "text-teal-700 hover:bg-teal-50/50 hover:text-teal-800 font-bold"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-950 font-semibold"
                      }`}
                    >
                      <Icon
                        sx={{
                          fontSize: 19,
                          color: active
                            ? "#0d9488"
                            : item.highlight
                            ? "#0d9488"
                            : "#94a3b8",
                        }}
                      />
                      <span className="truncate">{item.label}</span>
                      {active && (
                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-teal-600 shadow-xs" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Doctor & Clinic Identity Card */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/60 space-y-2">
          <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs flex items-center gap-2.5">
            <div className="relative size-8 rounded-lg overflow-hidden border border-teal-500/40 shrink-0">
              <Image
                src="/images/dr_sheriyaar.jpg"
                alt="Dr. Sheriyaar"
                fill
                className="object-cover object-top"
                sizes="32px"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1">
                <span className="text-[11px] font-extrabold text-slate-900 truncate block">
                  Dr. Sheriyaar
                </span>
                <VerifiedUserOutlined sx={{ fontSize: 11, color: "#0d9488" }} />
              </div>
              <span className="text-[10px] text-slate-500 font-medium block truncate">
                Head Dental Surgeon
              </span>
            </div>
          </div>

          {/* Sign Out Action */}
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 border border-transparent transition-colors cursor-pointer w-full"
          >
            <LogoutOutlined sx={{ fontSize: 16 }} />
            <span>Sign Out Session</span>
          </button>
        </div>
      </aside>
    </>
  );
}
