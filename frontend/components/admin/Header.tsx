"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchApi } from "@/lib/api-client";
import { performLogout } from "@/lib/logout";
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
  VerifiedUserOutlined,
  PersonOutlineOutlined,
  AutorenewOutlined,
} from "@mui/icons-material";

interface GlobalSearchPatient {
  id: string;
  name: string;
  phone: string | null;
  patientCode?: number | null;
}

interface GlobalSearchAppointment {
  id: string;
  startTime: string;
  status: string;
  guestName?: string | null;
  guestPhone?: string | null;
  patient?: {
    id: string;
    name: string;
    phone: string | null;
    patientCode?: number | null;
  } | null;
  treatment: { name: string };
}

interface AuthUser {
  id: string;
  name: string;
  email: string | null;
  role: string;
}

interface HeaderNotification {
  id: string;
  title: string;
  description: string;
  meta: string;
  status: string;
  createdAt: string;
  searchTerm: string;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "ST";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

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
  const queryClient = useQueryClient();
  const [visible, setVisible] = useState(true);
  const [currentDateStr, setCurrentDateStr] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchingDb, setSearchingDb] = useState(false);
  const [searchResults, setSearchResults] = useState<{
    patients: GlobalSearchPatient[];
    appointments: GlobalSearchAppointment[];
  }>({ patients: [], appointments: [] });
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const lastScrollY = useRef(0);

  const searchRef = useRef<HTMLFormElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const { data: currentUser } = useQuery<AuthUser | null>({
    queryKey: ["auth-me"],
    queryFn: async () => {
      const res = await fetchApi("/api/auth/me");
      if (!res.ok) return null;
      const data = await res.json();
      return data?.user ?? null;
    },
    staleTime: 5 * 60 * 1000,
  });

  const { data: notifications = [] } = useQuery<HeaderNotification[]>({
    queryKey: ["header-notifications"],
    queryFn: async () => {
      const res = await fetchApi("/api/notifications");
      if (!res.ok) return [];
      const data = await res.json();
      return Array.isArray(data?.notifications) ? data.notifications : [];
    },
    refetchInterval: 30000,
  });

  const isStaffMode = label === "Reception" || currentUser?.role === "STAFF";
  const staffName = currentUser?.name || "Reception Staff";
  const staffRoleLabel =
    currentUser?.role === "ADMIN" ? "Admin · Reception Desk" : "Staff · Reception Desk";
  const staffSubtitle = currentUser?.email || "On Duty · G-8 Markaz";

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
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
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

  useEffect(() => {
    const trimmed = searchQuery.trim();
    if (trimmed.length < 2) {
      setSearchResults({ patients: [], appointments: [] });
      setSearchOpen(false);
      setSearchingDb(false);
      return;
    }

    let active = true;
    setSearchingDb(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetchApi(`/api/appointments/search?q=${encodeURIComponent(trimmed)}`);
        if (res.ok && active) {
          const data = await res.json();
          setSearchResults({
            patients: data.patients || [],
            appointments: data.appointments || [],
          });
          setSearchOpen(true);
        }
      } catch {
        // Ignore transient network errors
      } finally {
        if (active) setSearchingDb(false);
      }
    }, 250);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [searchQuery]);

  const appointmentsBasePath = isStaffMode ? "/staff/appointments" : "/admin/appointments";
  const patientsBasePath = isStaffMode ? "/staff/patients" : "/admin/patients";

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    if (!trimmed) return;
    setSearchOpen(false);
    router.push(`${appointmentsBasePath}?search=${encodeURIComponent(trimmed)}`);
  };

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    await performLogout(queryClient, "/login");
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

          {/* Global Search Input (Backend DB Search) */}
          <form ref={searchRef} onSubmit={handleSearchSubmit} className="relative w-full">
            <div className="relative flex items-center">
              {searchingDb ? (
                <AutorenewOutlined
                  sx={{ fontSize: 18 }}
                  className="absolute left-3.5 text-teal-600 animate-spin pointer-events-none"
                />
              ) : (
                <SearchOutlined
                  sx={{ fontSize: 18 }}
                  className="absolute left-3.5 text-slate-400 pointer-events-none"
                />
              )}
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => {
                  if (searchQuery.trim().length >= 2) setSearchOpen(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Escape") setSearchOpen(false);
                }}
                aria-label="Search patients, appointments, treatments"
                placeholder="Search patients, appointments, MRN, phone..."
                className="w-full pl-10 pr-12 py-2 text-xs sm:text-sm bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200/80 focus:border-teal-500 rounded-xl text-slate-800 placeholder-slate-400 transition-all outline-hidden shadow-2xs font-medium"
              />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setSearchResults({ patients: [], appointments: [] });
                    setSearchOpen(false);
                  }}
                  aria-label="Clear search"
                  className="absolute right-3 p-1 rounded-md text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  <CloseOutlined sx={{ fontSize: 14 }} />
                </button>
              ) : (
                <div className="absolute right-3 hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-slate-200/60 text-[10px] font-bold text-slate-500 border border-slate-300/50">
                  <span>Enter</span>
                </div>
              )}
            </div>

            {searchOpen && (
              <div className="absolute left-0 right-0 mt-2 rounded-2xl bg-white border border-slate-200 shadow-xl py-2 z-50 max-h-96 overflow-y-auto">
                {searchResults.patients.length === 0 && searchResults.appointments.length === 0 ? (
                  <div className="px-4 py-4 text-center text-xs text-slate-500 font-medium">
                    {searchingDb ? "Searching database..." : `No records found for "${searchQuery.trim()}"`}
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {searchResults.patients.length > 0 && (
                      <div className="py-1">
                        <p className="px-4 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                          Patients
                        </p>
                        {searchResults.patients.map((p) => (
                          <Link
                            key={p.id}
                            href={`${patientsBasePath}/${p.id}`}
                            onClick={() => setSearchOpen(false)}
                            className="flex items-center justify-between gap-3 px-4 py-2 hover:bg-teal-50/60 transition-colors"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="size-7 rounded-lg bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center shrink-0">
                                <PersonOutlineOutlined sx={{ fontSize: 15 }} />
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-bold text-slate-900 truncate">
                                  {p.name}
                                  {p.patientCode ? (
                                    <span className="ml-1.5 text-[10px] font-mono text-slate-500">
                                      #{p.patientCode}
                                    </span>
                                  ) : null}
                                </p>
                                <p className="text-[11px] text-slate-500 truncate">
                                  {p.phone || "No phone"}
                                </p>
                              </div>
                            </div>
                            <span className="text-[10px] font-bold text-teal-700 shrink-0">
                              Profile →
                            </span>
                          </Link>
                        ))}
                      </div>
                    )}

                    {searchResults.appointments.length > 0 && (
                      <div className="py-1">
                        <p className="px-4 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                          Appointments
                        </p>
                        {searchResults.appointments.map((apt) => {
                          const patientName = apt.patient?.name || apt.guestName || "Patient";
                          const dateStr = new Date(apt.startTime).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          });
                          const filterTerm =
                            apt.patient?.name || apt.guestName || apt.patient?.phone || searchQuery.trim();
                          return (
                            <Link
                              key={apt.id}
                              href={`${appointmentsBasePath}?search=${encodeURIComponent(filterTerm)}`}
                              onClick={() => setSearchOpen(false)}
                              className="flex items-center justify-between gap-3 px-4 py-2 hover:bg-teal-50/60 transition-colors"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className="size-7 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center shrink-0">
                                  <CalendarTodayOutlined sx={{ fontSize: 14 }} />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-xs font-bold text-slate-900 truncate">
                                    {patientName} · {apt.treatment.name}
                                  </p>
                                  <p className="text-[11px] text-slate-500 truncate">
                                    {dateStr} · {apt.status}
                                  </p>
                                </div>
                              </div>
                              <span className="text-[10px] font-bold text-teal-700 shrink-0">
                                View →
                              </span>
                            </Link>
                          );
                        })}
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full px-4 py-2.5 text-left text-xs font-bold text-teal-700 hover:bg-teal-50 transition-colors cursor-pointer"
                    >
                      View all matching appointments for &quot;{searchQuery.trim()}&quot; →
                    </button>
                  </div>
                )}
              </div>
            )}
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
              {notifications.length > 0 && (
                <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-teal-600 ring-2 ring-white" />
              )}
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
                    {notifications.length > 0 ? `${notifications.length} Live` : "0 New"}
                  </span>
                </div>
                <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-6 text-center text-xs text-slate-500 font-medium">
                      No recent clinical activity today.
                    </div>
                  ) : (
                    notifications.map((item) => (
                      <Link
                        key={item.id}
                        href={
                          item.searchTerm
                            ? `${appointmentsBasePath}?search=${encodeURIComponent(item.searchTerm)}`
                            : appointmentsBasePath
                        }
                        onClick={() => setNotifOpen(false)}
                        className="block px-4 py-3 hover:bg-slate-50 transition-colors"
                      >
                        <p className="text-xs font-semibold text-slate-800">{item.title}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{item.description}</p>
                        <span className="text-[10px] text-slate-400 mt-1 block">{item.meta}</span>
                      </Link>
                    ))
                  )}
                </div>
                <div className="px-4 pt-2 border-t border-slate-100">
                  <Link
                    href={appointmentsBasePath}
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
              aria-expanded={profileOpen}
              aria-haspopup="menu"
              className="flex items-center gap-2.5 p-1 sm:px-2.5 sm:py-1.5 rounded-xl hover:bg-slate-100/80 border border-transparent hover:border-slate-200/80 transition-all cursor-pointer"
            >
              {isStaffMode ? (
                <>
                  <div className="size-8 rounded-xl bg-teal-600 text-white font-black text-xs flex items-center justify-center ring-1 ring-teal-500/30 shrink-0">
                    {getInitials(staffName)}
                  </div>
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="text-xs font-black text-slate-900 leading-none">
                      {staffName}
                    </span>
                    <span className="text-[10px] text-teal-700 font-bold uppercase tracking-wider leading-tight mt-0.5">
                      {staffRoleLabel}
                    </span>
                  </div>
                </>
              ) : (
                <>
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
                </>
              )}
              <KeyboardArrowDownOutlined sx={{ fontSize: 16 }} className="text-slate-400 hidden sm:block" />
            </button>

            {/* Profile Dropdown */}
            {profileOpen && (
              isStaffMode ? (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-slate-200 shadow-xl p-3 z-50 space-y-2 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-200/80 flex items-center gap-2.5">
                    <div className="size-9 rounded-lg bg-teal-600 text-white font-black text-xs flex items-center justify-center shrink-0 border border-teal-500/40">
                      {getInitials(staffName)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-extrabold text-slate-900 truncate block">
                          {staffName}
                        </span>
                        <VerifiedUserOutlined sx={{ fontSize: 12, color: "#0d9488" }} />
                      </div>
                      <span className="text-[11px] text-slate-500 font-medium block truncate">
                        {staffSubtitle}
                      </span>
                      <span className="text-[10px] text-teal-700 font-bold block truncate mt-0.5">
                        On Duty · G-8 Markaz
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 bg-rose-50/50 hover:bg-rose-50 hover:text-rose-700 border border-rose-200/70 transition-colors cursor-pointer w-full disabled:opacity-60"
                  >
                    <LogoutOutlined sx={{ fontSize: 16 }} />
                    <span>{loggingOut ? "Signing Out..." : "Sign Out Session"}</span>
                  </button>
                </div>
              ) : (
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
                      disabled={loggingOut}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors w-full text-left cursor-pointer disabled:opacity-60"
                    >
                      <LogoutOutlined sx={{ fontSize: 16 }} />
                      <span>{loggingOut ? "Signing out..." : "Sign out session"}</span>
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
