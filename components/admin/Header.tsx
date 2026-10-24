"use client";

import { useState, useEffect, useRef } from "react";
import { Menu } from "lucide-react";

interface HeaderProps {
    onMenuClick: () => void;
    label?: string;
}

export default function Header({ onMenuClick, label = "Admin" }: HeaderProps) {
    const [visible, setVisible] = useState(true);
    const lastScrollY = useRef(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentY = window.scrollY;
            if (currentY > lastScrollY.current && currentY > 60) {
                setVisible(false); // scrolling down — hide
            } else {
                setVisible(true); // scrolling up — show
            }
            lastScrollY.current = currentY;
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={`sticky top-0 z-30 border-b border-white/[0.04] transition-all duration-300 ${visible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
                }`}
            style={{ background: "rgba(8, 12, 21, 0.92)", backdropFilter: "blur(16px)" }}
        >
            <div className="flex items-center justify-between h-14 px-4 lg:px-6">
                <div className="flex items-center gap-3">
                    <button onClick={onMenuClick} className="lg:hidden p-2 rounded-lg hover:bg-white/5 transition-premium">
                        <Menu className="size-5 text-slate-400" />
                    </button>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2.5">
                        <div className="size-8 rounded-full gradient-primary flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-teal-500/20">
                            {label.charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-slate-300 hidden sm:inline">{label}</span>
                    </div>
                </div>
            </div>
        </header>
    );
}
