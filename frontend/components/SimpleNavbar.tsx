"use client";

import Link from "next/link";
import { ArrowBackOutlined } from "@mui/icons-material";

export default function SimpleNavbar() {
  return (
    <nav className="absolute top-0 left-0 right-0 z-50 p-6">
      <div className="max-w-7xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-teal-700 transition-colors cursor-pointer group"
        >
          <div className="size-8 rounded-full bg-white border border-slate-200 shadow-2xs flex items-center justify-center group-hover:border-teal-400 group-hover:bg-teal-50 transition-colors">
            <ArrowBackOutlined sx={{ fontSize: 16 }} />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider">Back to Home</span>
        </Link>
      </div>
    </nav>
  );
}
