"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    CalendarDays,
    CalendarPlus,
    Stethoscope,
    UsersRound,
    UserRound,
    UserPlus,
    DollarSign,
    Settings,
    X,
    LogOut,
    Package,
} from "lucide-react";

const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    // { label: "Book Appointment", href: "/admin/book", icon: CalendarPlus },
    { label: "Book Appointment", href: "/admin/walk-in", icon: UserPlus },
    { label: "Appointments", href: "/admin/appointments", icon: CalendarDays },
    { label: "Services", href: "/admin/services", icon: Stethoscope },
    // { label: "Staff", href: "/admin/staff", icon: UsersRound },
    { label: "Patients", href: "/admin/patients", icon: UserRound },
    { label: "Revenue", href: "/admin/revenue", icon: DollarSign },
    // { label: "Inventory", href: "/admin/inventory", icon: Package },
    { label: "Settings", href: "/admin/settings", icon: Settings },
];

interface SidebarProps {
    open: boolean;
    onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
    const pathname = usePathname();

    const isActive = (href: string) => {
        if (href === "/admin") return pathname === "/admin";
        return pathname.startsWith(href);
    };

    return (
        <>
            {/* Mobile overlay */}
            {open && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden" onClick={onClose} />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-slate-200 text-slate-800 transition-transform duration-300 lg:translate-x-0 shadow-xs ${open ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                {/* Logo area */}
                <div className="flex items-center justify-between px-5 py-5 border-b border-slate-100">
                    <Link href="/admin" className="flex items-center gap-2.5">
                        <div className="size-9 rounded-lg bg-teal-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-teal-600/20">
                            E
                        </div>
                        <div>
                            <span className="font-bold text-sm text-slate-900">Elite Dental</span>
                            <p className="text-[10px] text-teal-700 font-bold tracking-wider">ADMIN PANEL</p>
                        </div>
                    </Link>
                    <button onClick={onClose} className="lg:hidden text-slate-500 hover:text-slate-800 transition-premium">
                        <X className="size-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="mt-4 px-3 space-y-1">
                    <p className="px-3 py-2 text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                        Navigation
                    </p>
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={onClose}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-premium ${active
                                    ? "bg-teal-50 text-teal-800 font-semibold border-l-2 border-teal-600"
                                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium"
                                    }`}
                            >
                                <Icon className={`size-5 ${active ? "text-teal-600" : "text-slate-400"}`} />
                                {item.label}
                                {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-teal-600 shadow-sm" />}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom */}
                <div className="absolute bottom-0 left-0 right-0 px-3 py-4 border-t border-slate-100">
                    <Link
                        href="/api/auth/logout"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-600 hover:bg-red-50 hover:text-red-700 font-medium transition-premium"
                    >
                        <LogOut className="size-5" />
                        Sign Out
                    </Link>
                </div>
            </aside>
        </>
    );
}
