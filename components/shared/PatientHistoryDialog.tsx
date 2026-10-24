"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Loader2, History, CalendarDays, Activity, CheckCircle2 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface PatientHistory {
    patient: {
        id: string;
        name: string;
        email: string;
        phone: string;
    };
    appointments: {
        id: string;
        startTime: string;
        status: string;
        treatment: {
            name: string;
            price: number;
            durationMin: number;
        };
        clinicalNotes: any[];
    }[];
}

export default function PatientHistoryDialog({
    patientId,
    open,
    onOpenChange,
}: {
    patientId: string | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const [history, setHistory] = useState<PatientHistory | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!open || !patientId) {
            setHistory(null);
            setError(null);
            return;
        }

        const fetchHistory = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`/api/patients/${patientId}/history`);
                if (!res.ok) throw new Error("Failed to fetch patient history");
                const data = await res.json();
                setHistory(data);
            } catch (err: any) {
                setError(err.message || "An error occurred");
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [open, patientId]);

    const completedVisits = history?.appointments.filter(a => a.status === "COMPLETED").length || 0;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl bg-slate-900 border-white/[0.06] text-white max-h-[85vh] overflow-hidden flex flex-col">
                <DialogHeader className="shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                            <History className="size-5" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl">Patient History</DialogTitle>
                            <DialogDescription>
                                {history?.patient?.name ? `History for ${history.patient.name}` : "Loading patient details..."}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto pr-2 mt-4 space-y-6 custom-scrollbar">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                            <Loader2 className="size-8 animate-spin mb-4 text-teal-400" />
                            <p>Loading patient history...</p>
                        </div>
                    ) : error ? (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-300 text-sm text-center">
                            {error}
                        </div>
                    ) : history ? (
                        <>
                            {/* Summary Stats */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                <div className="p-4 bg-white/[0.03] border border-white/[0.06] rounded-xl text-center">
                                    <p className="text-xs text-slate-400 mb-1 flex items-center justify-center gap-1">
                                        <CheckCircle2 className="size-3 text-emerald-400" /> Completed
                                    </p>
                                    <p className="text-2xl font-bold text-white">{completedVisits}</p>
                                </div>
                                <div className="p-4 bg-white/[0.03] border border-white/[0.06] rounded-xl text-center">
                                    <p className="text-xs text-slate-400 mb-1 flex items-center justify-center gap-1">
                                        <CalendarDays className="size-3 text-blue-400" /> Total Booked
                                    </p>
                                    <p className="text-2xl font-bold text-white">{history.appointments.length}</p>
                                </div>
                                <div className="p-4 bg-white/[0.03] border border-white/[0.06] rounded-xl text-center md:col-span-1 col-span-2">
                                    <p className="text-xs text-slate-400 mb-1">Phone</p>
                                    <p className="text-sm font-medium text-white truncate">{history.patient.phone || "N/A"}</p>
                                </div>
                            </div>

                            {/* Appointments Timeline */}
                            <div>
                                <h3 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
                                    <Activity className="size-4 text-teal-400" /> Visit Timeline
                                </h3>

                                {history.appointments.length === 0 ? (
                                    <div className="text-center py-8 text-slate-400 text-sm bg-white/[0.02] rounded-lg border border-white/[0.04]">
                                        No appointments found for this patient.
                                    </div>
                                ) : (
                                    <div className="space-y-4 relative border-l border-white/[0.08] ml-3 pl-5">
                                        {history.appointments.map((apt) => {
                                            const statusColor =
                                                apt.status === "COMPLETED" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                                                    apt.status === "SCHEDULED" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                                                        apt.status === "CANCELLED" ? "bg-red-500/10 text-red-400 border-red-500/20" :
                                                            apt.status === "NO_SHOW" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                                                                "bg-slate-500/10 text-slate-400 border-slate-500/20";

                                            return (
                                                <div key={apt.id} className="relative">
                                                    {/* Timeline node */}
                                                    <div className={`absolute -left-[27px] top-1.5 size-3 rounded-full border-2 border-slate-900 ${apt.status === "COMPLETED" ? "bg-emerald-400" : "bg-slate-500"}`} />

                                                    <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl flex items-start flex-col sm:flex-row p-4 gap-4 hover:bg-white/[0.05] transition-premium">
                                                        <div className="min-w-[120px]">
                                                            <p className="font-semibold text-slate-200">
                                                                {format(new Date(apt.startTime), "MMM d, yyyy")}
                                                            </p>
                                                            <p className="text-xs text-slate-500 mt-1">
                                                                {format(new Date(apt.startTime), "h:mm a")}
                                                            </p>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                                <p className="font-medium text-white">{apt.treatment.name}</p>
                                                                <Badge variant="outline" className={`text-[10px] uppercase px-1.5 py-0 rounded ${statusColor}`}>
                                                                    {apt.status.replace("_", " ")}
                                                                </Badge>
                                                            </div>
                                                            {apt.clinicalNotes && apt.clinicalNotes.length > 0 && (
                                                                <div className="mt-2 text-xs text-slate-400 bg-white/[0.04] p-2 rounded-md">
                                                                    <p><span className="text-slate-500">Note:</span> {apt.clinicalNotes[0].treatmentDone}</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </>
                    ) : null}
                </div>
            </DialogContent>
        </Dialog>
    );
}
