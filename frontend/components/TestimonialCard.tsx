"use client";

import { useState } from "react";
import { Star } from "@mui/icons-material";

interface Testimonial {
  name: string;
  text: string;
  rating: number;
  treatment: string;
}

export default function TestimonialCard({ t }: { t: Testimonial }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = t.text.length > 90;

  return (
    <div className="flex flex-col h-full rounded-2xl p-6 hover:shadow-lg hover:border-teal-300 transition-all duration-300 bg-white border border-slate-200/90 shadow-xs group">
      <div className="flex gap-1 mb-3">
        {Array.from({ length: t.rating }).map((_, i) => (
          <Star key={i} sx={{ fontSize: 16, color: "#f59e0b" }} />
        ))}
      </div>

      <div className="flex-grow flex flex-col text-sm text-slate-600 italic leading-relaxed">
        <p className={expanded ? "" : "line-clamp-3"}>
          &ldquo;{t.text}&rdquo;
        </p>

        {isLong && (
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="text-teal-700 hover:text-teal-800 text-xs font-bold mt-2 text-left w-fit transition-colors cursor-pointer"
          >
            {expanded ? "Read less" : "Read more"}
          </button>
        )}
      </div>

      <div className="pt-4 border-t border-slate-100 mt-auto flex items-center justify-between">
        <div>
          <p className="font-extrabold text-[#0B1528] text-sm group-hover:text-teal-700 transition-colors">
            {t.name}
          </p>
          <p className="text-xs text-slate-500 font-medium">{t.treatment}</p>
        </div>
        <span className="text-[10px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
          Verified Visit
        </span>
      </div>
    </div>
  );
}
