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
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={onClose} />
            )}

            <aside
                className={`fixed top-0 left-0 z-50 h-full w-64 bg-slate-950/80 backdrop-blur-xl border-r border-white/[0.06] flex flex-col transition-transform duration-300
                    lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}
            >
                {/* Logo / Branding */}
                <div className="h-16 flex items-center justify-between px-6 border-b border-white/[0.06]">
                    <div>
                        <h1 className="text-lg font-bold text-white">Elite Dental</h1>
                        <p className="text-[11px] text-teal-400/70 -mt-0.5 font-medium tracking-wider">RECEPTION DESK</p>
                    </div>
                    <button onClick={onClose} className="lg:hidden p-1 hover:bg-white/5 rounded-lg transition-premium">
                        <X className="size-5 text-slate-500" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const active = isActive(item.href);
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={onClose}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-premium
                                    ${active
                                        ? "bg-teal-500/10 text-teal-400 border-l-2 border-teal-400 glow-border-teal"
                                        : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-200"
                                    }`
                                }
                            >
                                <Icon className={`size-5 ${active ? "text-teal-400" : "text-slate-500"}`} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Sign Out */}
                <div className="p-3 border-t border-white/[0.06]">
                    <Link
                        href="/api/auth/logout"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-500 hover:bg-red-500/10 hover:text-red-400 transition-premium w-full"
                    >
                        <LogOut className="size-5" />
                        Sign Out
                    </Link>
                </div>
            </aside>
        </>
    );
}
