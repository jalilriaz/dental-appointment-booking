"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  MenuOutlined,
  CalendarTodayOutlined,
  OpenInNewOutlined,
  Circle,
  SearchOutlined,
  NotificationsNoneOutlined,
  NotificationsActiveOutlined,
  KeyboardArrowDownOutlined,
  LogoutOutlined,
  SettingsOutlined,
  AccountBalanceWalletOutlined,
  CheckCircleOutlineOutlined,
  CloseOutlined,
} from "@mui/icons-material";

interface HeaderProps {
  onMenuClick: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  label?: string;
}

export default function Header({
  onMenuClick,
  collapsed = false,
  onToggleCollapse,
  label = "Admin",
}: HeaderProps) {
  const router = useRouter();
  const [visible, setVisible] = useState(true);
  const [currentDateStr, setCurrentDateStr] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const lastScrollY = useRef(0);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const now = new Date();
    setCurrentDateStr(
      now.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    );

    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY > lastScrollY.current && currentY > 60) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      lastScrollY.current = currentY;
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/admin/appointments?search=${encodeURIComponent(searchQuery.trim())}`);
  };

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
        } catch {}
        window.location.replace("/login");
      }
    }
  };

  return (
    <header
      className={`sticky top-0 z-30 border-b border-slate-200/90 bg-white/95 backdrop-blur-md transition-all duration-300 ${
        visible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      }`}
    >
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8 gap-3 sm:gap-6">
        {/* Left: Mobile Menu Trigger + Global Search */}
        <div className="flex items-center gap-3 flex-1 max-w-xl">
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Toggle navigation menu"
            className="lg:hidden p-2 rounded-xl hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer shrink-0"
          >
            <MenuOutlined sx={{ fontSize: 22 }} />
          </button>

          {/* Global Search Input */}
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <div className="relative flex items-center">
              <SearchOutlined
                sx={{ fontSize: 18 }}
                className="absolute left-3.5 text-slate-400 pointer-events-none"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search patients, appointments, treatments..."
                className="w-full pl-10 pr-12 py-2 text-xs sm:text-sm bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200/80 focus:border-teal-500 rounded-xl text-slate-800 placeholder-slate-400 transition-all outline-hidden shadow-2xs font-medium"
              />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 p-1 rounded-md text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <CloseOutlined sx={{ fontSize: 14 }} />
                </button>
              ) : (
                <div className="absolute right-3 hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-slate-200/60 text-[10px] font-bold text-slate-500 border border-slate-300/50">
                  <span>Enter</span>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Right: Status context + Notification bell + Profile menu */}
        <div className="flex items-center gap-2 sm:gap-3.5 shrink-0">
          {/* Shift status badge (hidden on small mobile) */}
          <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200/80 text-xs text-slate-600">
            <CalendarTodayOutlined sx={{ fontSize: 14, color: "#0d9488" }} />
            <span className="font-semibold text-slate-800">{currentDateStr || "Today"}</span>
            <span className="text-slate-300">·</span>
            <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
              <Circle sx={{ fontSize: 8, color: "#10b981" }} className="animate-pulse" />
              <span>Shift active (12 PM – 8 PM)</span>
            </div>
          </div>

          {/* Public site link */}
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:text-teal-700 hover:bg-teal-50/70 border border-slate-200/80 transition-all cursor-pointer"
            title="Open patient-facing website"
          >
            <OpenInNewOutlined sx={{ fontSize: 14 }} />
            <span>Public site</span>
          </Link>

          {/* Notification Bell */}
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={() => setNotifOpen(!notifOpen)}
              aria-label="View notifications"
              className="relative p-2 rounded-xl text-slate-600 hover:text-teal-700 hover:bg-teal-50/70 border border-slate-200/80 transition-all cursor-pointer"
            >
              <NotificationsNoneOutlined sx={{ fontSize: 20 }} />
              <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-teal-600 ring-2 ring-white" />
            </button>

            {/* Notification Dropdown */}
            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-88 rounded-2xl bg-white border border-slate-200 shadow-xl py-3 z-50 text-left animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center justify-between px-4 pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <NotificationsActiveOutlined sx={{ fontSize: 18, color: "#0d9488" }} />
                    <span className="text-xs font-bold text-slate-900">Notifications</span>
                  </div>
                  <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                    Live
                  </span>
                </div>
                <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                  <div className="px-4 py-3 hover:bg-slate-50 transition-colors">
                    <p className="text-xs font-semibold text-slate-800">New patient intake</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Salman scheduled for Basic Scaling at 12:00 PM.</p>
                    <span className="text-[10px] text-slate-400 mt-1 block">Today · G-8 Markaz</span>
                  </div>
                  <div className="px-4 py-3 hover:bg-slate-50 transition-colors">
                    <p className="text-xs font-semibold text-slate-800">Monthly billing update</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Realized revenue this month reached Rs. 100,500 (+94%).</p>
                    <span className="text-[10px] text-slate-400 mt-1 block">November 2026</span>
                  </div>
                </div>
                <div className="px-4 pt-2 border-t border-slate-100">
                  <Link
                    href="/admin/appointments"
                    onClick={() => setNotifOpen(false)}
                    className="block text-center text-xs font-bold text-teal-700 hover:text-teal-800 py-1 rounded-lg hover:bg-teal-50 transition-colors"
                  >
                    View all appointments
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Profile Menu Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              type="button"
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2.5 p-1 sm:px-2.5 sm:py-1.5 rounded-xl hover:bg-slate-100/80 border border-transparent hover:border-slate-200/80 transition-all cursor-pointer"
            >
              <div className="relative size-8 rounded-xl overflow-hidden ring-1 ring-teal-500/30 bg-slate-900 shrink-0">
                <Image
                  src="/dr_sheriyaar.webp"
                  alt="Dr. Sheriyaar"
                  fill
                  className="object-cover object-top"
                  sizes="32px"
                />
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-black text-slate-900 leading-none">
                  Dr. Sheriyaar
                </span>
                <span className="text-[10px] text-teal-700 font-bold uppercase tracking-wider leading-tight mt-0.5">
                  Admin · Chief Surgeon
                </span>
              </div>
              <KeyboardArrowDownOutlined sx={{ fontSize: 16 }} className="text-slate-400 hidden sm:block" />
            </button>

            {/* Profile Dropdown */}
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-slate-200 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-3 border-b border-slate-100">
                  <p className="text-xs font-black text-slate-900">Dr. Sheriyaar</p>
                  <p className="text-[11px] text-slate-500">Chief Dental Surgeon & Head of Implantology</p>
                  <div className="inline-flex items-center gap-1.5 mt-2 px-2 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-[10px] font-bold text-teal-700">
                    <CheckCircleOutlineOutlined sx={{ fontSize: 12 }} />
                    <span>Administrator Access</span>
                  </div>
                </div>

                <div className="py-1">
                  <Link
                    href="/admin/settings"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-teal-700 transition-colors"
                  >
                    <SettingsOutlined sx={{ fontSize: 16 }} />
                    <span>Clinic settings</span>
                  </Link>

                  <Link
                    href="/admin/revenue"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-teal-700 transition-colors"
                  >
                    <AccountBalanceWalletOutlined sx={{ fontSize: 16 }} />
                    <span>Revenue ledger</span>
                  </Link>

                  <Link
                    href="/"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-teal-700 transition-colors"
                  >
                    <OpenInNewOutlined sx={{ fontSize: 16 }} />
                    <span>View public website</span>
                  </Link>
                </div>

                <div className="border-t border-slate-100 pt-1 mt-1">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors w-full text-left cursor-pointer"
                  >
                    <LogoutOutlined sx={{ fontSize: 16 }} />
                    <span>Sign out session</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
