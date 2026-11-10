"use client";

import React from "react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    description: string;
    action?: {
        label: string;
        onClick: () => void;
    };
}

export default function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="size-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center mb-4 shadow-xs">
                <Icon className="size-8 text-slate-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">{title}</h3>
            <p className="text-sm text-slate-500 text-center max-w-sm mb-6">{description}</p>
            {action && (
                <Button
                    onClick={action.onClick}
                    className="btn-brand border-0 transition-premium active:scale-95 text-xs font-semibold"
                >
                    {action.label}
                </Button>
            )}
        </div>
    );
}
