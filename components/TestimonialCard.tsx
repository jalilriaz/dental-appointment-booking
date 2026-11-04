"use client";

import { useState } from "react";
import { Star } from "lucide-react";

interface Testimonial {
    name: string;
    text: string;
    rating: number;
    treatment: string;
}

export default function TestimonialCard({ t }: { t: Testimonial }) {
    const [expanded, setExpanded] = useState(false);

    // We consider text longer than 90 characters to need a Read More button
    const isLong = t.text.length > 90;

    return (
        <div className="glass-card flex flex-col h-full rounded-2xl p-6 hover:shadow-lg hover:border-teal-200 transition-premium bg-white border border-slate-200/80 shadow-xs">
            <div className="flex gap-1 mb-3">
                {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="size-4 fill-amber-400 text-amber-400" />
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
                        className="text-teal-600 hover:text-teal-700 text-xs font-semibold mt-2 text-left w-fit transition-colors"
                    >
                        {expanded ? "Read less" : "Read more"}
                    </button>
                )}
            </div>

            <div className="pt-4 border-t border-slate-100 mt-auto">
                <p className="font-bold text-slate-900 text-sm">{t.name}</p>
                <p className="text-xs text-slate-500 font-medium">{t.treatment}</p>
            </div>
        </div>
    );
}
