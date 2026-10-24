"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
    CreditCard,
    DollarSign,
    Calendar,
    CheckCircle2,
    Clock,
    ChevronDown,
    ChevronUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import RecordPayment from "@/components/admin/patients/RecordPayment";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPKR } from "@/lib/utils";
import {

    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface Payment {
    id: string;
    amount: number;
    date: string; // ISO string
    method: string;
    notes: string | null;
    appointment?: {
        treatment: { name: string };
    } | null;
}

interface PatientTreatment {
    id: string;
    totalCost: number;
    status: "ONGOING" | "COMPLETED" | "FULLY_PAID";
    startDate: string; // ISO string
    treatment: {
        name: string;
        description: string | null;
    };
    payments: Payment[];
}

interface PatientBillingHistoryProps {
    treatments: PatientTreatment[];
}



export default function PatientBillingHistory({ treatments }: PatientBillingHistoryProps) {
    const [expandedId, setExpandedId] = useState<string | null>(treatments[0]?.id || null);

    if (treatments.length === 0) {
        return (
            <Card className="glass-card border-white/[0.06]">
                <CardContent className="py-8 text-center text-slate-400">
                    <CreditCard className="size-10 mx-auto mb-3 opacity-50" />
                    <p>No billing history available.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {treatments.map((pt) => {
                const totalPaid = pt.payments.reduce((sum, p) => sum + p.amount, 0);
                const remaining = pt.totalCost - totalPaid;
                const progress = Math.min((totalPaid / pt.totalCost) * 100, 100);
                const isExpanded = expandedId === pt.id;

                return (
                    <Card key={pt.id} className="glass-card border-white/[0.06] overflow-hidden">
                        <div
                            className="p-6 cursor-pointer hover:bg-white/[0.02] transition-colors"
                            onClick={() => setExpandedId(isExpanded ? null : pt.id)}
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                {/* Header Info */}
                                <div className="flex items-start gap-4">
                                    <div className={`p-3 rounded-xl ${pt.status === "FULLY_PAID"
                                        ? "bg-emerald-500/10 text-emerald-400"
                                        : "bg-teal-500/10 text-teal-400"
                                        }`}>
                                        {pt.status === "FULLY_PAID" ? <CheckCircle2 className="size-6" /> : <DollarSign className="size-6" />}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                            {pt.treatment.name}
                                            {pt.status === "FULLY_PAID" && (
                                                <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px]">
                                                    Paid in Full
                                                </Badge>
                                            )}
                                            {pt.status === "ONGOING" && (
                                                <Badge variant="secondary" className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-[10px]">
                                                    Ongoing
                                                </Badge>
                                            )}
                                        </h3>
                                        <p className="text-sm text-slate-400 flex items-center gap-2 mt-1">
                                            <Calendar className="size-3.5" />
                                            Started {format(new Date(pt.startDate), "MMMM d, yyyy")}
                                        </p>
                                    </div>
                                </div>

                                {/* Financial Summary */}
                                <div className="flex items-center gap-6 text-right">
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase tracking-wider">Total Cost</p>
                                        <p className="text-lg font-bold text-white">{formatPKR(pt.totalCost)}</p>
                                    </div>
                                    <div className="hidden sm:block w-px h-8 bg-white/10" />
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase tracking-wider">Paid</p>
                                        <p className="text-lg font-bold text-emerald-400">{formatPKR(totalPaid)}</p>
                                    </div>
                                    <div className="hidden sm:block w-px h-8 bg-white/10" />
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase tracking-wider">Remaining</p>
                                        <p className={`text-lg font-bold ${remaining > 0 ? "text-amber-400" : "text-slate-400"}`}>
                                            {formatPKR(remaining)}
                                        </p>
                                    </div>
                                    <div className="ml-2 text-slate-400">
                                        {isExpanded ? <ChevronUp className="size-5" /> : <ChevronDown className="size-5" />}
                                    </div>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="mt-4 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                <div
                                    className={`h-full transition-all duration-500 ${remaining <= 0 ? "bg-emerald-500" : "bg-teal-500"
                                        }`}
                                    style={{ width: `${progress}%` }}
                                />
                            </div>

                            {/* Record Payment Button (Only if remaining balance > 0) */}
                            {remaining > 0 && (
                                <div className="mt-4 flex justify-end">
                                    <RecordPayment
                                        treatmentPlanId={pt.id}
                                        treatmentName={pt.treatment.name}
                                        remainingBalance={remaining}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Expanded Payment History */}
                        {isExpanded && (
                            <div className="border-t border-white/[0.06] bg-black/20 animate-in slide-in-from-top-2">
                                <div className="p-6">
                                    <h4 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
                                        <Clock className="size-4" /> Payment History
                                    </h4>
                                    {pt.payments.length === 0 ? (
                                        <p className="text-sm text-slate-500 italic">No payments recorded yet.</p>
                                    ) : (
                                        <div className="rounded-lg border border-white/[0.06] overflow-hidden">
                                            <Table>
                                                <TableHeader className="bg-white/[0.02]">
                                                    <TableRow className="border-white/[0.06] hover:bg-transparent">
                                                        <TableHead className="text-slate-400">Date</TableHead>
                                                        <TableHead className="text-slate-400">Amount</TableHead>
                                                        <TableHead className="text-slate-400">Method</TableHead>
                                                        <TableHead className="text-slate-400">Notes</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {pt.payments.map((payment) => (
                                                        <TableRow key={payment.id} className="border-white/[0.06] hover:bg-white/[0.02]">
                                                            <TableCell className="text-slate-300 font-medium">
                                                                {format(new Date(payment.date), "MMM d, yyyy")}
                                                            </TableCell>
                                                            <TableCell className="text-emerald-400 font-bold">
                                                                {formatPKR(payment.amount)}
                                                            </TableCell>
                                                            <TableCell className="text-slate-400 text-xs">
                                                                <Badge variant="outline" className="border-slate-700 text-slate-400">
                                                                    {payment.method}
                                                                </Badge>
                                                            </TableCell>
                                                            <TableCell className="text-slate-400 text-sm max-w-[200px] truncate">
                                                                {payment.notes || "-"}
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </Card>
                );
            })}
        </div>
    );
}
