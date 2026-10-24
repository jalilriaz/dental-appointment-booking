"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function SimpleNavbar() {
    return (
        <nav className="absolute top-0 left-0 right-0 z-50 p-6">
            <div className="max-w-7xl mx-auto">
                <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-teal-400 transition-premium cursor-pointer group">
                    <div className="size-8 rounded-full bg-white/[0.03] border border-white/[0.06] flex items-center justify-center group-hover:border-teal-500/30 group-hover:bg-teal-500/10 transition-premium">
                        <ArrowLeft className="size-4" />
                    </div>
                    <span className="text-sm font-medium">Back to Home</span>
                </Link>
            </div>
        </nav>
    );
}
