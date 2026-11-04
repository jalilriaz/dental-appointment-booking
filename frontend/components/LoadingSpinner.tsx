"use client";

import { Loader2 } from "lucide-react";

export function LoadingSpinner({ size = "md", className = "" }: { size?: "sm" | "md" | "lg"; className?: string }) {
    const sizeMap = { sm: "h-4 w-4", md: "h-8 w-8", lg: "h-12 w-12" };
    return (
        <div className={`flex items-center justify-center ${className}`}>
            <Loader2 className={`animate-spin text-teal-400 ${sizeMap[size]}`} />
        </div>
    );
}

export function PageLoader() {
    return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
                <Loader2 className="h-10 w-10 animate-spin text-teal-400 mx-auto mb-3" />
                <p className="text-sm text-slate-400">Loading...</p>
            </div>
        </div>
    );
}

export function SkeletonCard() {
    return (
        <div className="glass-card rounded-xl p-6 animate-pulse">
            <div className="h-4 bg-slate-800/50 rounded w-1/3 mb-4" />
            <div className="h-8 bg-slate-800/50 rounded w-1/2 mb-2" />
            <div className="h-3 bg-slate-800/50 rounded w-2/3" />
        </div>
    );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
    return (
        <div className="glass-card rounded-xl overflow-hidden animate-pulse">
            <div className="bg-white/[0.03] px-6 py-3 flex gap-4">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-4 bg-slate-800/50 rounded flex-1" />
                ))}
            </div>
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="px-6 py-4 border-t border-white/[0.04] flex gap-4">
                    {[1, 2, 3, 4, 5].map((j) => (
                        <div key={j} className="h-4 bg-slate-800/50 rounded flex-1" />
                    ))}
                </div>
            ))}
        </div>
    );
}

export function DashboardSkeleton() {
    return (
        <div className="space-y-6 animate-pulse">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="glass-card rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-3 bg-slate-800/50 rounded w-24" />
                            <div className="size-10 rounded-lg bg-slate-800/50" />
                        </div>
                        <div className="h-8 bg-slate-800/50 rounded w-20 mb-2" />
                        <div className="h-3 bg-slate-800/50 rounded w-32" />
                    </div>
                ))}
            </div>
            {/* Table Skeleton */}
            <SkeletonTable rows={6} />
        </div>
    );
}

export function AppointmentsSkeleton() {
    return (
        <div className="space-y-4 animate-pulse">
            {/* Filter bar */}
            <div className="glass-card rounded-xl p-4 space-y-3">
                <div className="flex gap-3">
                    <div className="h-10 bg-slate-800/50 rounded flex-1 max-w-sm" />
                </div>
                <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="h-7 w-24 bg-slate-800/50 rounded-full" />
                    ))}
                </div>
            </div>
            {/* Table */}
            <SkeletonTable rows={8} />
        </div>
    );
}
