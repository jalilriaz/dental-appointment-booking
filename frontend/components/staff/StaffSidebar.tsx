"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  DashboardOutlined,
  CalendarMonthOutlined,
  PersonAddAlt1Outlined,
  PeopleAltOutlined,
  LogoutOutlined,
  CloseOutlined,
} from "@mui/icons-material";

const navItems = [
  { label: "Dashboard", href: "/staff", icon: DashboardOutlined },
  { label: "Book Walk-In", href: "/staff/book", icon: PersonAddAlt1Outlined },
  { label: "Appointments", href: "/staff/appointments", icon: CalendarMonthOutlined },
  { label: "Patients", href: "/staff/patients", icon: PeopleAltOutlined },
];

export default function StaffSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/staff") return pathname === "/staff";
    return pathname.startsWith(href);
  }

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-slate-200/90 flex flex-col transition-transform duration-300 shadow-xs lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Clinic Brand Identity with Official SVG Logo */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-100">
          <Link href="/staff" className="flex items-center gap-2.5 group">
            <div className="relative size-9 rounded-xl bg-[#0B1528] p-1.5 flex items-center justify-center shadow-md shadow-teal-600/20 group-hover:scale-105 transition-transform duration-300">
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
              <h1 className="text-sm font-extrabold text-slate-900 tracking-tight font-sans">
                Elite <span className="text-teal-600">Dental</span>
              </h1>
              <p className="text-[10px] text-teal-700 font-bold tracking-wider uppercase">
                Reception Desk
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

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <p className="px-3 py-1.5 text-[10px] uppercase tracking-widest text-slate-400 font-extrabold">
            Clinical Operations
          </p>
          {navItems.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                  active
                    ? "bg-teal-50 text-teal-800 shadow-2xs border border-teal-200/80"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-950 font-semibold"
                }`}
              >
                <Icon
                  sx={{
                    fontSize: 20,
                    color: active ? "#0d9488" : "#94a3b8",
                  }}
                />
                <span>{item.label}</span>
                {active && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-teal-600 shadow-xs" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sign Out */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/50">
          <Link
            href="/api/auth/logout"
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-rose-50 hover:text-rose-700 transition-colors cursor-pointer w-full"
          >
            <LogoutOutlined sx={{ fontSize: 18 }} />
            <span>Sign Out</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
