"use client";

import React from "react";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";

interface ActivePlanBannerProps {
    plans?: {
        id: string;
        totalCost: number;
        totalSessions: number;
        clinicalStatus: string;
        financialStatus: string;
        totalPaid: number;
        remainingBalance: number;
        completedSessions: number;
        treatment: { id: string; name: string; price: number };
    }[];
}

export default function ActivePlanBanner({ plans }: ActivePlanBannerProps) {
    const activePlans = (plans || []).filter((p) => p.clinicalStatus === "IN_PROGRESS");
    if (activePlans.length === 0) return null;

    return (
        <div className="space-y-4">
            {activePlans.map((plan) => {
                const percentCompleted = Math.min(
                    100,
                    Math.round((plan.completedSessions / (plan.totalSessions || 1)) * 100)
                );

                return (
                    <div
                        key={plan.id}
                        className="rounded-3xl bg-teal-50/70 border border-teal-200/90 p-5 sm:p-6 space-y-4 shadow-2xs"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-extrabold text-teal-950 uppercase tracking-wider flex items-center gap-1.5">
                                <AutoAwesomeOutlinedIcon sx={{ fontSize: 15, color: "#0D9488" }} />
                                <span>Active Multi-Session Plan</span>
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-white text-teal-800 border border-teal-200/80 shadow-2xs">
                                Installment Schedule Active
                            </span>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-1">
                            <div>
                                <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                                    {plan.treatment.name}
                                </h3>
                                <p className="text-xs font-semibold text-slate-500 mt-0.5">
                                    Session {plan.completedSessions} of {plan.totalSessions} Completed
                                    <span className="mx-1.5">·</span>
                                    {plan.totalSessions - plan.completedSessions} Sessions Remaining
                                </p>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className={`px-2.5 py-1 rounded-xl text-xs font-black border ${
                                    plan.financialStatus === "FULLY_PAID"
                                        ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                        : "bg-amber-50 text-amber-800 border-amber-200"
                                }`}>
                                    {plan.financialStatus === "FULLY_PAID" ? "Fully Paid" : "Partial Payment"}
                                </span>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-1.5 pt-1">
                            <div className="flex justify-between text-[11px] font-bold text-slate-600">
                                <span>Clinical Course Progress</span>
                                <span>{percentCompleted}% Completed</span>
                            </div>
                            <div className="w-full bg-slate-200/80 h-2.5 rounded-full overflow-hidden p-0.5">
                                <div
                                    className="bg-teal-600 h-full rounded-full transition-all duration-500 shadow-xs"
                                    style={{ width: `${percentCompleted}%` }}
                                />
                            </div>
                        </div>

                        {/* Financial Ledger Mini-Grid */}
                        <div className="grid grid-cols-3 gap-2.5 pt-1 text-xs">
                            <div className="bg-white/80 p-3 rounded-2xl border border-teal-100">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Total Agreed</span>
                                <span className="text-xs sm:text-sm font-black text-slate-900 mt-0.5 block">
                                    Rs. {plan.totalCost.toLocaleString()}
                                </span>
                            </div>
                            <div className="bg-white/80 p-3 rounded-2xl border border-teal-100">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">Total Paid</span>
                                <span className="text-xs sm:text-sm font-black text-emerald-800 mt-0.5 block">
                                    Rs. {plan.totalPaid.toLocaleString()}
                                </span>
                            </div>
                            <div className="bg-white/80 p-3 rounded-2xl border border-teal-100">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block">Balance Due</span>
                                <span className="text-xs sm:text-sm font-black text-amber-800 mt-0.5 block">
                                    Rs. {plan.remainingBalance.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
