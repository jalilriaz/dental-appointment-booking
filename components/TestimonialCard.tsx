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
        <div className="glass-card flex flex-col h-full rounded-xl p-6 hover:scale-[1.02] transition-premium">
            <div className="flex gap-1 mb-3">
                {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="size-4 fill-amber-400 text-amber-400" />
                ))}
            </div>

            <div className="flex-grow flex flex-col text-sm text-slate-300 italic leading-relaxed">
                <p className={expanded ? "" : "line-clamp-3"}>
                    &ldquo;{t.text}&rdquo;
                </p>

                {isLong && (
                    <button
                        type="button"
                        onClick={() => setExpanded(!expanded)}
                        className="text-teal-400 hover:text-teal-300 text-xs font-semibold mt-2 text-left w-fit transition-colors"
                    >
                        {expanded ? "Read less" : "Read more"}
                    </button>
                )}
            </div>

            <div className="mt-4 pt-4 border-t border-white/[0.06] mt-auto">
                <p className="font-semibold text-white text-sm">{t.name}</p>
                <p className="text-xs text-slate-500">{t.treatment}</p>
            </div>
        </div>
    );
}
