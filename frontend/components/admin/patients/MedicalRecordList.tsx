"use client";

import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import MedicalServicesOutlinedIcon from "@mui/icons-material/MedicalServicesOutlined";
import MedicationOutlinedIcon from "@mui/icons-material/MedicationOutlined";
import NoteAltOutlinedIcon from "@mui/icons-material/NoteAltOutlined";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
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
    PRESCRIPTION: { icon: MedicationOutlinedIcon, color: "text-sky-700", bg: "bg-sky-50 border border-sky-200" },
    LAB_REPORT: { icon: DescriptionOutlinedIcon, color: "text-teal-700", bg: "bg-teal-50 border border-teal-200" },
    X_RAY: { icon: MedicalServicesOutlinedIcon, color: "text-slate-700", bg: "bg-slate-100 border border-slate-200" },
    NOTES: { icon: NoteAltOutlinedIcon, color: "text-amber-800", bg: "bg-amber-50 border border-amber-200" },
};

export default function MedicalRecordList({ records }: MedicalRecordListProps) {
    if (records.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300 shadow-xs">
                <DescriptionOutlinedIcon className="size-10 text-slate-400 mx-auto mb-3 opacity-60" />
                <h3 className="text-sm font-bold text-slate-900">No medical records found</h3>
                <p className="text-xs text-slate-500 font-medium mt-1">Start by adding a prescription or clinical note.</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
            {records.map((record) => {
                const config = typeConfig[record.type] || typeConfig.NOTES;
                const Icon = config.icon;

                return (
                    <div key={record.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        {/* Icon */}
                        <div className={cn(
                            "flex items-center justify-center w-10 h-10 rounded-full shadow-xs shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2",
                            config.bg, config.color
                        )}>
                            <Icon className="w-5 h-5" />
                        </div>

                        {/* Content Card */}
                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white border border-slate-200/90 shadow-xs p-5 rounded-2xl">
                            <div className="flex justify-between items-start mb-1.5">
                                <time className="font-semibold text-teal-700 text-xs">
                                    {formatDate(record.createdAt, "short")}
                                </time>
                                <span className={cn("text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider", config.bg, config.color)}>
                                    {record.type.replace("_", " ")}
                                </span>
                            </div>
                            <h3 className="text-sm font-bold text-slate-900 mb-1">{record.title}</h3>
                            <p className="text-xs text-slate-600 mb-3 font-medium whitespace-pre-line leading-relaxed">{record.description}</p>

                            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                                <div className="flex items-center gap-1.5">
                                    <div className="size-5 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-700">
                                        {(record.createdByUser.name || "U").charAt(0)}
                                    </div>
                                    <span className="text-[11px] text-slate-600 font-medium">
                                        Dr. {record.createdByUser.name}
                                    </span>
                                </div>
                                {record.fileUrl && (
                                    <Button variant="ghost" size="sm" className="h-7 text-xs font-semibold gap-1 text-teal-700 hover:text-teal-800 hover:bg-teal-50 rounded-lg">
                                        <DownloadOutlinedIcon className="size-3.5" /> Attachment
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
