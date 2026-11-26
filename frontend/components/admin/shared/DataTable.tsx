"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export interface DataTableColumn<T> {
    key: string;
    header: string;
    align?: "left" | "right";
    className?: string;
    render: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
    columns: DataTableColumn<T>[];
    rows: T[];
    rowKey: (row: T) => string;
    loading?: boolean;
    error?: string | null;
    emptyTitle?: string;
    emptyDescription?: string;
    emptyAction?: React.ReactNode;
    onRetry?: () => void;
    className?: string;
}

export default function DataTable<T>({
    columns,
    rows,
    rowKey,
    loading = false,
    error = null,
    emptyTitle = "No records found",
    emptyDescription = "Try adjusting your filters.",
    emptyAction,
    onRetry,
    className,
}: DataTableProps<T>) {
    if (error) {
        return (
            <div className="p-8 text-center bg-rose-50/50 border-t border-rose-100">
                <p className="text-sm font-semibold text-rose-800">{error}</p>
                {onRetry && (
                    <button
                        type="button"
                        onClick={onRetry}
                        className="mt-3 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-rose-200 text-rose-700 hover:bg-rose-50 cursor-pointer"
                    >
                        Retry
                    </button>
                )}
            </div>
        );
    }

    if (loading) {
        return (
            <div className="p-4 sm:p-5 space-y-3">
                {Array.from({ length: 4 }).map((_, idx) => (
                    <Skeleton key={idx} className="h-11 w-full rounded-xl" />
                ))}
            </div>
        );
    }

    if (rows.length === 0) {
        return (
            <div className="py-10 px-4 text-center">
                <p className="text-sm font-semibold text-slate-800">{emptyTitle}</p>
                <p className="text-xs text-slate-500 mt-1">{emptyDescription}</p>
                {emptyAction && <div className="mt-3">{emptyAction}</div>}
            </div>
        );
    }

    return (
        <div className={cn("overflow-x-auto", className)}>
            <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/90 border-b border-slate-200/80 text-slate-500 font-semibold">
                    <tr>
                        {columns.map((col) => (
                            <th
                                key={col.key}
                                className={cn(
                                    "px-4 py-3 whitespace-nowrap",
                                    col.align === "right" && "text-right",
                                    col.className
                                )}
                            >
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                    {rows.map((row) => (
                        <tr key={rowKey(row)} className="hover:bg-slate-50/70 transition-colors">
                            {columns.map((col) => (
                                <td
                                    key={col.key}
                                    className={cn(
                                        "px-4 py-3",
                                        col.align === "right" && "text-right whitespace-nowrap",
                                        col.className
                                    )}
                                >
                                    {col.render(row)}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
