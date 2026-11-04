"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function SimpleNavbar() {
    return (
        <nav className="absolute top-0 left-0 right-0 z-50 p-6">
            <div className="max-w-7xl mx-auto">
                <Link href="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-teal-700 transition-premium cursor-pointer group">
                    <div className="size-8 rounded-full bg-white border border-slate-200 shadow-2xs flex items-center justify-center group-hover:border-teal-400 group-hover:bg-teal-50 transition-premium">
                        <ArrowLeft className="size-4" />
                    </div>
                    <span className="text-sm font-semibold">Back to Home</span>
                </Link>
            </div>
        </nav>
    );
}
