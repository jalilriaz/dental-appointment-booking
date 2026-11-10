"use client";

import { useState, useEffect, useRef } from "react";
import { MenuOutlined } from "@mui/icons-material";

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
      className={`sticky top-0 z-30 border-b border-slate-200/90 bg-white/95 backdrop-blur-md transition-all duration-300 ${
        visible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      }`}
    >
      <div className="flex items-center justify-between h-14 px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Toggle navigation menu"
            className="lg:hidden p-2 rounded-xl hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
          >
            <MenuOutlined sx={{ fontSize: 22 }} />
          </button>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200/80 shadow-2xs">
            <div className="size-7 rounded-full bg-[#0B1528] flex items-center justify-center text-teal-400 text-xs font-black shadow-xs font-mono">
              {label.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-900 leading-none">
                {label} Portal
              </span>
              <span className="text-[10px] text-teal-700 font-semibold leading-tight mt-0.5">
                Active Session
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
