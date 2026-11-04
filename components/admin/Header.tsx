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
            className={`sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur-md transition-all duration-300 ${visible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
                }`}
        >
            <div className="flex items-center justify-between h-14 px-4 lg:px-6">
                <div className="flex items-center gap-3">
                    <button onClick={onMenuClick} className="lg:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-premium">
                        <Menu className="size-5" />
                    </button>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2.5">
                        <div className="size-8 rounded-full bg-teal-600 flex items-center justify-center text-white text-sm font-bold shadow-xs">
                            {label.charAt(0)}
                        </div>
                        <span className="text-sm font-semibold text-slate-800 hidden sm:inline">{label}</span>
                    </div>
                </div>
            </div>
        </header>
    );
}
