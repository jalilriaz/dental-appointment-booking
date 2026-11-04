"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    CalendarDays,
    CalendarPlus,
    Users,
    X,
    LogOut,
} from "lucide-react";

const navItems = [
    { label: "Dashboard", href: "/reception", icon: LayoutDashboard },
    { label: "Book Appointment", href: "/reception/book", icon: CalendarPlus },
    { label: "Appointments", href: "/reception/appointments", icon: CalendarDays },
    { label: "Patients", href: "/reception/patients", icon: Users },
];

export default function StaffSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
    const pathname = usePathname();

    function isActive(href: string) {
        if (href === "/reception") return pathname === "/reception" || pathname === "/staff";
        return pathname.startsWith(href) || pathname.startsWith(href.replace("/reception", "/staff"));
    }

    return (
        <>
            {/* Mobile overlay */}
            {open && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden" onClick={onClose} />
            )}

            <aside
                className={`fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-slate-200/90 flex flex-col transition-transform duration-300 shadow-xs
                    lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}
            >
                {/* Logo / Branding */}
                <div className="h-16 flex items-center justify-between px-5 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                        <div className="size-8 rounded-lg bg-teal-600 flex items-center justify-center text-white font-bold text-sm shadow-xs">
                            E
                        </div>
                        <div>
                            <h1 className="text-sm font-bold text-slate-900">Elite Dental</h1>
                            <p className="text-[10px] text-teal-700 font-bold tracking-wider">RECEPTION DESK</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="lg:hidden p-1 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-premium">
                        <X className="size-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                    <p className="px-3 py-1.5 text-[10px] uppercase tracking-widest text-slate-500 font-bold">
                        Menu
                    </p>
                    {navItems.map((item) => {
                        const active = isActive(item.href);
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={onClose}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-premium
                                    ${active
                                        ? "bg-teal-50 text-teal-800 font-semibold border-l-2 border-teal-600"
                                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium"
                                    }`
                                }
                            >
                                <Icon className={`size-5 ${active ? "text-teal-600" : "text-slate-400"}`} />
                                {item.label}
                                {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-teal-600" />}
                            </Link>
                        );
                    })}
                </nav>

                {/* Sign Out */}
                <div className="p-3 border-t border-slate-100">
                    <Link
                        href="/api/auth/logout"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-700 transition-premium w-full"
                    >
                        <LogOut className="size-5" />
                        Sign Out
                    </Link>
                </div>
            </aside>
        </>
    );
}
