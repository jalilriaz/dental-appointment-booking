"use client";

import { FileText, Stethoscope, Pill, StickyNote, Download } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface MedicalRecord {
    id: string;
    type: string;
    title: string;
    description: string | null;
    fileUrl: string | null;
    createdAt: string;
    createdByUser: {
        name: string | null;
        role: string;
    };
}

interface MedicalRecordListProps {
    records: MedicalRecord[];
}

const typeConfig: Record<string, { icon: any, color: string, bg: string }> = {
    PRESCRIPTION: { icon: Pill, color: "text-blue-400", bg: "bg-blue-500/15" },
    LAB_REPORT: { icon: FileText, color: "text-purple-400", bg: "bg-purple-500/15" },
    X_RAY: { icon: Stethoscope, color: "text-slate-300", bg: "bg-white/[0.06]" },
    NOTES: { icon: StickyNote, color: "text-amber-400", bg: "bg-amber-500/15" },
};

export default function MedicalRecordList({ records }: MedicalRecordListProps) {
    if (records.length === 0) {
        return (
            <div className="text-center py-12 bg-white/[0.02] rounded-xl border border-dashed border-white/[0.1]">
                <FileText className="size-10 text-slate-600 mx-auto mb-3" />
                <h3 className="text-sm font-medium text-white">No medical records found</h3>
                <p className="text-xs text-slate-400 mt-1">Start by adding a prescription or clinical note.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
            {records.map((record) => {
                const config = typeConfig[record.type] || typeConfig.NOTES;
                const Icon = config.icon;

                return (
                    <div key={record.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        {/* Icon */}
                        <div className={cn(
                            "flex items-center justify-center w-10 h-10 rounded-full border border-white/[0.06] shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2",
                            config.bg, config.color
                        )}>
                            <Icon className="w-5 h-5" />
                        </div>

                        {/* Content Card */}
                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] glass-card p-4 rounded-xl">
                            <div className="flex justify-between items-start mb-1">
                                <time className="font-caveat font-medium text-indigo-500 text-xs">
                                    {formatDate(record.createdAt, "short")}
                                </time>
                                <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide", config.bg, config.color)}>
                                    {record.type.replace("_", " ")}
                                </span>
                            </div>
                            <h3 className="text-sm font-bold text-white mb-1">{record.title}</h3>
                            <p className="text-xs text-slate-400 mb-3 whitespace-pre-line">{record.description}</p>

                            <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
                                <div className="flex items-center gap-1.5">
                                    <div className="size-5 rounded-full bg-white/[0.06] flex items-center justify-center text-[10px] font-bold text-slate-400">
                                        {(record.createdByUser.name || "U").charAt(0)}
                                    </div>
                                    <span className="text-[10px] text-slate-400">
                                        Dr. {record.createdByUser.name}
                                    </span>
                                </div>
                                {record.fileUrl && (
                                    <Button variant="ghost" size="sm" className="h-6 text-[10px] gap-1 text-teal-400 hover:text-teal-300 hover:bg-teal-500/10">
                                        <Download className="size-3" /> Attachment
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
