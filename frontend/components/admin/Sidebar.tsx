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
  BadgeOutlined,
  CloseOutlined,
  ReceiptLongOutlined,
  PointOfSaleOutlined,
  NotificationsActiveOutlined,
  MarkEmailReadOutlined,
  BiotechOutlined,
  HourglassTopOutlined,
  StarOutlineOutlined,
} from "@mui/icons-material";

const navSections = [
  {
    title: "Clinical Desk",
    items: [
      { label: "Dashboard", href: "/admin", icon: DashboardOutlined },
      { label: "Walk-In Booking", href: "/admin/walk-in", icon: PersonAddAlt1Outlined, highlight: true },
      { label: "Appointments", href: "/admin/appointments", icon: CalendarMonthOutlined },
      { label: "Waitlist", href: "/admin/waitlist", icon: HourglassTopOutlined },
      { label: "Lab Orders", href: "/admin/lab-orders", icon: BiotechOutlined },
      { label: "Patients Directory", href: "/admin/patients", icon: PeopleAltOutlined },
    ],
  },
  {
    title: "Practice & Revenue",
    items: [
      { label: "Services & Pricing", href: "/admin/services", icon: MedicalServicesOutlined },
      { label: "Reports & Profit", href: "/admin/revenue", icon: AttachMoneyOutlined },
      { label: "Expenses", href: "/admin/expenses", icon: ReceiptLongOutlined },
      { label: "Daily Closing", href: "/admin/closing", icon: PointOfSaleOutlined },
    ],
  },
  {
    title: "Governance",
    items: [
      { label: "6-Month Recalls", href: "/admin/recalls", icon: NotificationsActiveOutlined },
      { label: "Notification Log", href: "/admin/notifications", icon: MarkEmailReadOutlined },
      { label: "Patient Feedback", href: "/admin/feedback", icon: StarOutlineOutlined },
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
  const isActive = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-slate-200/90 flex flex-col text-slate-800 transition-transform duration-300 lg:translate-x-0 shadow-sm ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-16 flex items-center justify-between px-5 border-b border-slate-100 shrink-0">
          <Link href="/admin" className="flex items-center gap-3 group">
            <div className="relative size-10 rounded-2xl bg-[#0B1528] p-2 flex items-center justify-center shadow-md shadow-teal-700/15 group-hover:scale-105 transition-transform duration-300 shrink-0">
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

        <nav className="flex-1 py-3 px-3 space-y-4 overflow-y-auto">
          {navSections.map((section) => (
            <div key={section.title} className="space-y-0.5">
              <p className="px-3 pb-1 text-[10px] uppercase tracking-wider text-slate-400 font-extrabold">
                {section.title}
              </p>
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-center gap-3 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                      active
                        ? "bg-teal-50 text-teal-800 border border-teal-200/80 shadow-2xs font-extrabold"
                        : item.highlight
                        ? "text-teal-700 hover:bg-teal-50/50 hover:text-teal-800 font-bold"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-950 font-semibold"
                    }`}
                  >
                    <Icon sx={{ fontSize: 18, color: active || item.highlight ? "#0d9488" : "#94a3b8" }} />
                    <span className="truncate">{item.label}</span>
                    {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-teal-600 shadow-xs" />}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
