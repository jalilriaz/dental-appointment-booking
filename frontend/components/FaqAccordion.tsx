"use client";

import { useState } from "react";
import { ExpandMoreOutlined, HelpOutlineOutlined } from "@mui/icons-material";

export interface FaqItem {
  question: string;
  answer: string;
  category?: string;
}

export default function FaqAccordion({ faqs }: { faqs: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="space-y-3.5">
      {faqs.map((faq, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div
            key={idx}
            className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
              isOpen
                ? "bg-white border-teal-500 shadow-md ring-1 ring-teal-500/20"
                : "bg-white border-slate-200/90 hover:border-slate-300"
            }`}
          >
            <button
              type="button"
              onClick={() => toggle(idx)}
              className="w-full flex items-center justify-between gap-4 p-5 sm:p-6 text-left cursor-pointer transition-colors"
              aria-expanded={isOpen}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div
                  className={`size-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                    isOpen
                      ? "bg-teal-50 text-teal-700 border border-teal-200"
                      : "bg-slate-50 text-slate-500 border border-slate-200"
                  }`}
                >
                  <HelpOutlineOutlined sx={{ fontSize: 18 }} />
                </div>
                <h3 className="font-extrabold text-[#0B1528] text-sm sm:text-base tracking-tight">
                  {faq.question}
                </h3>
              </div>
              <div
                className={`size-8 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 ${
                  isOpen
                    ? "rotate-180 bg-teal-50 text-teal-700"
                    : "bg-slate-50 text-slate-400"
                }`}
              >
                <ExpandMoreOutlined sx={{ fontSize: 20 }} />
              </div>
            </button>

            {isOpen && (
              <div className="px-5 sm:px-6 pb-6 pt-1 text-slate-600 text-sm sm:text-base leading-relaxed border-t border-slate-100/80">
                <p>{faq.answer}</p>
                {faq.category && (
                  <span className="inline-block mt-3 text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
                    {faq.category}
                  </span>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

