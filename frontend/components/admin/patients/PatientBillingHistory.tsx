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
            <Card className="bg-white border border-slate-200/90 rounded-2xl shadow-xs">
                <CardContent className="py-8 text-center text-slate-500">
                    <CreditCard className="size-10 mx-auto mb-3 opacity-40 text-slate-400" />
                    <p className="font-medium">No billing history available.</p>
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
                    <Card key={pt.id} className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden">
                        <div
                            className="p-6 cursor-pointer hover:bg-slate-50/60 transition-colors"
                            onClick={() => setExpandedId(isExpanded ? null : pt.id)}
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                {/* Header Info */}
                                <div className="flex items-start gap-4">
                                    <div className={`p-3 rounded-xl border ${pt.status === "FULLY_PAID"
                                        ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                        : "bg-teal-50 text-teal-600 border-teal-100"
                                        }`}>
                                        {pt.status === "FULLY_PAID" ? <CheckCircle2 className="size-6" /> : <DollarSign className="size-6" />}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                            {pt.treatment.name}
                                            {pt.status === "FULLY_PAID" && (
                                                <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200 font-bold text-[10px]">
                                                    Paid in Full
                                                </Badge>
                                            )}
                                            {pt.status === "ONGOING" && (
                                                <Badge variant="secondary" className="bg-teal-50 text-teal-800 border-teal-200 font-bold text-[10px]">
                                                    Ongoing
                                                </Badge>
                                            )}
                                        </h3>
                                        <p className="text-sm text-slate-500 font-medium flex items-center gap-2 mt-1">
                                            <Calendar className="size-3.5 text-teal-600" />
                                            Started {format(new Date(pt.startDate), "MMMM d, yyyy")}
                                        </p>
                                    </div>
                                </div>

                                {/* Financial Summary */}
                                <div className="flex items-center gap-6 text-right">
                                    <div>
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Cost</p>
                                        <p className="text-lg font-extrabold text-slate-900">{formatPKR(pt.totalCost)}</p>
                                    </div>
                                    <div className="hidden sm:block w-px h-8 bg-slate-200" />
                                    <div>
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Paid</p>
                                        <p className="text-lg font-extrabold text-emerald-700">{formatPKR(totalPaid)}</p>
                                    </div>
                                    <div className="hidden sm:block w-px h-8 bg-slate-200" />
                                    <div>
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Remaining</p>
                                        <p className={`text-lg font-extrabold ${remaining > 0 ? "text-amber-800" : "text-slate-400"}`}>
                                            {formatPKR(remaining)}
                                        </p>
                                    </div>
                                    <div className="ml-2 text-slate-400">
                                        {isExpanded ? <ChevronUp className="size-5" /> : <ChevronDown className="size-5" />}
                                    </div>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="mt-4 h-2 w-full bg-slate-100 border border-slate-200/60 rounded-full overflow-hidden">
                                <div
                                    className={`h-full transition-all duration-500 ${remaining <= 0 ? "bg-emerald-600" : "bg-teal-600"
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
                            <div className="border-t border-slate-200/90 bg-slate-50/60 animate-in slide-in-from-top-2">
                                <div className="p-6">
                                    <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                                        <Clock className="size-4 text-teal-600" /> Payment History
                                    </h4>
                                    {pt.payments.length === 0 ? (
                                        <p className="text-sm text-slate-500 italic">No payments recorded yet.</p>
                                    ) : (
                                        <div className="rounded-xl border border-slate-200/90 bg-white overflow-hidden shadow-xs">
                                            <Table>
                                                <TableHeader className="bg-slate-50/90 border-b border-slate-200/90">
                                                    <TableRow className="border-slate-200/90 hover:bg-transparent">
                                                        <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Date</TableHead>
                                                        <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Amount</TableHead>
                                                        <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Method</TableHead>
                                                        <TableHead className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Notes</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody className="divide-y divide-slate-100">
                                                    {pt.payments.map((payment) => (
                                                        <TableRow key={payment.id} className="border-slate-100 hover:bg-slate-50/80 transition-colors">
                                                            <TableCell className="text-slate-800 font-semibold text-sm">
                                                                {format(new Date(payment.date), "MMM d, yyyy")}
                                                            </TableCell>
                                                            <TableCell className="text-emerald-700 font-bold text-sm">
                                                                {formatPKR(payment.amount)}
                                                            </TableCell>
                                                            <TableCell className="text-xs">
                                                                <Badge variant="outline" className="border-slate-200 bg-slate-100 text-slate-700 font-semibold">
                                                                    {payment.method}
                                                                </Badge>
                                                            </TableCell>
                                                            <TableCell className="text-slate-600 text-sm max-w-[200px] truncate">
                                                                {payment.notes || "—"}
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
