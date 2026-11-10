"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  MenuOutlined,
  CalendarTodayOutlined,
  OpenInNewOutlined,
  Circle,
} from "@mui/icons-material";

interface HeaderProps {
  onMenuClick: () => void;
  label?: string;
}

export default function Header({ onMenuClick, label = "Admin" }: HeaderProps) {
  const [visible, setVisible] = useState(true);
  const [currentDateStr, setCurrentDateStr] = useState("");
  const lastScrollY = useRef(0);

  useEffect(() => {
    // Format formatted date on client
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
      <div className="flex items-center justify-between h-16 px-4 lg:px-8">
        {/* Left: Mobile Menu Trigger + Date Context */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Toggle navigation menu"
            className="lg:hidden p-2 rounded-xl hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
          >
            <MenuOutlined sx={{ fontSize: 22 }} />
          </button>

          {/* Clinical Shift Indicator */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200/80 text-xs text-slate-600">
            <CalendarTodayOutlined sx={{ fontSize: 14, color: "#0d9488" }} />
            <span className="font-semibold text-slate-800">{currentDateStr || "Today"}</span>
            <span className="text-slate-300">·</span>
            <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
              <Circle sx={{ fontSize: 8, color: "#10b981" }} className="animate-pulse" />
              <span>Shift Active (12 PM – 8 PM)</span>
            </div>
          </div>
        </div>

        {/* Right: Public Site Link + User Identity Badge */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:text-teal-700 hover:bg-teal-50/60 border border-slate-200/80 transition-all cursor-pointer"
            title="Open patient-facing website in new tab"
          >
            <OpenInNewOutlined sx={{ fontSize: 14 }} />
            <span>Public Site</span>
          </Link>

          <div className="flex items-center gap-2.5 pl-2 sm:pl-3 border-l border-slate-200/80">
            <div className="size-8 rounded-xl bg-[#0B1528] flex items-center justify-center text-teal-400 text-xs font-black shadow-xs font-sans ring-2 ring-teal-500/20">
              {label.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-extrabold text-slate-900 leading-none">
                {label} Portal
              </span>
              <span className="text-[10px] text-teal-700 font-bold uppercase tracking-wider leading-tight mt-0.5">
                F-10 Clinical Suite
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
