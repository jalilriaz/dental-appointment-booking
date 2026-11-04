"use client";

import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// Standard dental numbering (FDI / Universal)
const upperTeeth = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
const lowerTeeth = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];

const issueOptions = [
    { value: "Caries", color: "bg-red-500", label: "🦷 Caries" },
    { value: "Filling", color: "bg-blue-500", label: "🔵 Filling" },
    { value: "Crown", color: "bg-amber-500", label: "👑 Crown" },
    { value: "Extraction", color: "bg-rose-700", label: "✕ Extraction" },
    { value: "RCT", color: "bg-purple-500", label: "💜 RCT" },
    { value: "Missing", color: "bg-slate-600", label: "⬜ Missing" },
    { value: "Healthy", color: "", label: "✓ Clear" },
] as const;

type ToothIssue = typeof issueOptions[number]["value"];
export type OdontogramData = Record<string, ToothIssue>;

const issueColorMap: Record<string, string> = {
    Caries: "bg-red-500/80 border-red-400 text-white",
    Filling: "bg-blue-500/80 border-blue-400 text-white",
    Crown: "bg-amber-500/80 border-amber-400 text-white",
    Extraction: "bg-rose-700/80 border-rose-500 text-white line-through",
    RCT: "bg-purple-500/80 border-purple-400 text-white",
    Missing: "bg-slate-700/80 border-slate-500 text-slate-400",
};

interface OdontogramChartProps {
    value: OdontogramData;
    onChange: (data: OdontogramData) => void;
    readOnly?: boolean;
}

function ToothButton({
    toothNum,
    issue,
    onClick,
    readOnly,
}: {
    toothNum: number;
    issue?: ToothIssue;
    onClick: () => void;
    readOnly?: boolean;
}) {
    const colorClass = issue && issue !== "Healthy" ? issueColorMap[issue] : "bg-white/[0.06] border-white/10 text-slate-300";

    const btn = (
        <button
            type="button"
            onClick={readOnly ? undefined : onClick}
            className={`w-9 h-10 rounded-md border-2 text-[10px] font-bold flex items-center justify-center transition-all ${colorClass} ${!readOnly ? "hover:scale-110 hover:shadow-lg cursor-pointer" : "cursor-default"
                }`}
            title={issue && issue !== "Healthy" ? `#${toothNum}: ${issue}` : `Tooth #${toothNum}`}
        >
            {toothNum}
        </button>
    );

    return btn;
}

export default function OdontogramChart({ value, onChange, readOnly = false }: OdontogramChartProps) {
    const [openTooth, setOpenTooth] = useState<number | null>(null);

    function handleSelect(toothNum: number, issue: ToothIssue) {
        const newData = { ...value };
        if (issue === "Healthy") {
            delete newData[String(toothNum)];
        } else {
            newData[String(toothNum)] = issue;
        }
        onChange(newData);
        setOpenTooth(null);
    }

    const renderRow = (teeth: number[]) => (
        <div className="flex gap-1 justify-center">
            {teeth.map((t) => {
                const issue = value[String(t)];
                if (readOnly) {
                    return <ToothButton key={t} toothNum={t} issue={issue} onClick={() => { }} readOnly />;
                }
                return (
                    <Popover key={t} open={openTooth === t} onOpenChange={(open) => setOpenTooth(open ? t : null)}>
                        <PopoverTrigger asChild>
                            <div>
                                <ToothButton toothNum={t} issue={issue} onClick={() => setOpenTooth(t)} />
                            </div>
                        </PopoverTrigger>
                        <PopoverContent
                            className="w-40 p-1.5 bg-slate-900 border-white/[0.08] shadow-2xl"
                            side="top"
                            align="center"
                        >
                            <p className="text-[10px] text-slate-400 px-2 py-1 font-semibold uppercase tracking-wider">
                                Tooth #{t}
                            </p>
                            <div className="space-y-0.5">
                                {issueOptions.map((opt) => (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => handleSelect(t, opt.value)}
                                        className={`w-full text-left px-2 py-1.5 rounded text-xs transition-colors ${value[String(t)] === opt.value
                                            ? "bg-teal-500/20 text-teal-300 font-medium"
                                            : "text-slate-300 hover:bg-white/[0.06]"
                                            }`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </PopoverContent>
                    </Popover>
                );
            })}
        </div>
    );

    const issuesCount = Object.keys(value).length;

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Upper Jaw (Maxilla)</p>
                {issuesCount > 0 && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 font-medium">
                        {issuesCount} issue{issuesCount !== 1 ? "s" : ""} marked
                    </span>
                )}
            </div>
            {renderRow(upperTeeth)}

            <div className="border-t border-dashed border-white/[0.08] my-2" />

            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Lower Jaw (Mandible)</p>
            {renderRow(lowerTeeth)}

            {/* Legend */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-white/[0.06]">
                {issueOptions.filter(o => o.value !== "Healthy").map(opt => (
                    <div key={opt.value} className="flex items-center gap-1">
                        <div className={`w-2.5 h-2.5 rounded-sm ${opt.color}`} />
                        <span className="text-[9px] text-slate-500">{opt.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
