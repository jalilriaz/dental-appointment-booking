"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    badge?: React.ReactNode;
    actions?: React.ReactNode;
    className?: string;
}

export default function PageHeader({
    title,
    subtitle,
    badge,
    actions,
    className,
}: PageHeaderProps) {
    return (
        <div
            className={cn(
                "flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-3 border-b border-slate-200/80",
                className
            )}
        >
            <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                    <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                        {title}
                    </h1>
                    {badge}
                </div>
                {subtitle && (
                    <p className="text-xs sm:text-sm text-slate-500 font-medium">
                        {subtitle}
                    </p>
                )}
            </div>
            {actions && (
                <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                    {actions}
                </div>
            )}
        </div>
    );
}
