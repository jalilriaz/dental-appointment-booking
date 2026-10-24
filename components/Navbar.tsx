"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { clinicInfo } from "@/app/constants/mockData";
import { Phone, Menu, X, ChevronRight, Calendar, LogIn } from "lucide-react";
import { usePathname } from "next/navigation";

const navLinks = [
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Patient Portal", href: "/portal" },
    { label: "Book Online", href: "/book" },
    { label: "Contact", href: "/contact" },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [visible, setVisible] = useState(true);
    const [mobileOpen, setMobileOpen] = useState(false);
    const lastScrollY = useRef(0);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            setScrolled(currentScrollY > 20);
            if (Math.abs(currentScrollY - lastScrollY.current) > 10) {
                setVisible(currentScrollY <= lastScrollY.current || currentScrollY <= 20);
                lastScrollY.current = currentScrollY;
            }
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileOpen(false);
    }, [pathname]);

    // Prevent body scroll when menu is open
    useEffect(() => {
        document.body.style.overflow = mobileOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [mobileOpen]);

    return (
        <>
            <nav className={`sticky top-0 z-50 border-b transition-all duration-300 ${scrolled
                ? "bg-slate-950/95 border-white/10 shadow-lg py-1"
                : "glass border-white/[0.06] py-0"
                } ${visible ? "translate-y-0" : "-translate-y-full"}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2 shrink-0">
                            <div className="size-9 rounded-full gradient-primary flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-teal-500/20">
                                E
                            </div>
                            <span className="text-lg font-bold text-white">
                                Elite <span className="text-teal-400">Dental</span>
                            </span>
                        </Link>

                        {/* Desktop Nav */}
                        <div className="hidden md:flex items-center gap-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`text-sm transition-premium cursor-pointer ${pathname === link.href ? "text-teal-400 font-medium" : "text-slate-400 hover:text-teal-400"}`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <Link
                                href="/book"
                                className="flex items-center gap-2 px-5 py-2.5 gradient-primary-h text-white text-sm font-medium rounded-full hover:shadow-lg hover:shadow-teal-500/25 transition-premium active:scale-95 cursor-pointer"
                            >
                                <Calendar className="size-4" />
                                Book Online
                            </Link>
                            <Link
                                href="/login"
                                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white rounded-full border border-white/10 hover:border-teal-500/30 hover:bg-white/[0.04] transition-premium"
                            >
                                <LogIn className="size-3.5 text-teal-400" />
                                Sign In
                            </Link>
                        </div>

                        {/* Mobile: Hamburger */}
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="md:hidden relative size-10 flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] transition-all duration-200 focus:outline-none"
                            aria-label="Toggle navigation menu"
                        >
                            <span className={`absolute transition-all duration-300 ${mobileOpen ? "opacity-100 rotate-0" : "opacity-0 rotate-90"}`}>
                                <X className="size-5 text-teal-400" />
                            </span>
                            <span className={`absolute transition-all duration-300 ${mobileOpen ? "opacity-0 -rotate-90" : "opacity-100 rotate-0"}`}>
                                <Menu className="size-5 text-slate-300" />
                            </span>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Drawer Overlay */}
            <div
                className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${mobileOpen ? "visible" : "invisible"}`}
                onClick={() => setMobileOpen(false)}
            >
                <div className={`absolute inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity duration-300 ${mobileOpen ? "opacity-100" : "opacity-0"}`} />
            </div>

            {/* Mobile Drawer Panel */}
            <div
                className={`fixed top-0 right-0 h-full w-[280px] z-50 md:hidden transition-transform duration-300 ease-in-out ${mobileOpen ? "translate-x-0" : "translate-x-full"}`}
            >
                <div className="h-full bg-slate-950/98 border-l border-white/[0.08] flex flex-col shadow-2xl shadow-black/50 backdrop-blur-xl">
                    {/* Drawer Header */}
                    <div className="flex items-center justify-between px-6 h-16 border-b border-white/[0.06]">
                        <Link href="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
                            <div className="size-8 rounded-full gradient-primary flex items-center justify-center text-white font-bold text-sm">
                                E
                            </div>
                            <span className="text-base font-bold text-white">
                                Elite <span className="text-teal-400">Dental</span>
                            </span>
                        </Link>
                        <button
                            onClick={() => setMobileOpen(false)}
                            className="size-8 flex items-center justify-center rounded-lg border border-white/10 text-slate-400 hover:text-white hover:bg-white/[0.06] transition-all"
                        >
                            <X className="size-4" />
                        </button>
                    </div>

                    {/* Drawer Links */}
                    <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${pathname === link.href
                                    ? "bg-teal-500/10 text-teal-400 border border-teal-500/20"
                                    : "text-slate-300 hover:bg-white/[0.05] hover:text-white border border-transparent"
                                    }`}
                            >
                                {link.label}
                                <ChevronRight className={`size-4 transition-transform duration-200 group-hover:translate-x-1 ${pathname === link.href ? "text-teal-400" : "text-slate-600"}`} />
                            </Link>
                        ))}
                    </nav>

                    <div className="p-4 border-t border-white/[0.06] space-y-2">
                        <Link
                            href="/book"
                            className="flex items-center justify-center gap-2 w-full px-5 py-3 gradient-primary-h text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-teal-500/25 transition-premium active:scale-95"
                        >
                            <Calendar className="size-4" />
                            Book Online
                        </Link>
                        <a
                            href={`https://wa.me/${clinicInfo.whatsapp}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 w-full px-5 py-2.5 border border-white/10 text-slate-300 text-sm font-medium rounded-xl hover:bg-white/[0.04] transition-all"
                        >
                            <Phone className="size-4 text-teal-400" />
                            Book via WhatsApp
                        </a>
                        <Link
                            href="/login"
                            className="flex items-center justify-center gap-2 w-full px-5 py-2.5 border border-teal-500/20 bg-teal-500/5 text-teal-300 text-sm font-medium rounded-xl hover:bg-teal-500/10 transition-all"
                        >
                            <LogIn className="size-4 text-teal-400" />
                            Sign In (Admin / Staff / Patient)
                        </Link>
                        <p className="text-center text-xs text-slate-600">{clinicInfo.phone}</p>
                    </div>
                </div>
            </div>
        </>
    );
}

