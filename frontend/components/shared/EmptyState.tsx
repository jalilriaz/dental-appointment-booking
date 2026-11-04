"use client";

import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
    icon: LucideIcon;
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
            <div className="size-16 rounded-2xl bg-slate-800/50 flex items-center justify-center mb-4">
                <Icon className="size-8 text-slate-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-300 mb-1">{title}</h3>
            <p className="text-sm text-slate-500 text-center max-w-sm mb-6">{description}</p>
            {action && (
                <Button
                    onClick={action.onClick}
                    className="btn-brand border-0 transition-premium active:scale-95"
                >
                    {action.label}
                </Button>
            )}
        </div>
    );
}
