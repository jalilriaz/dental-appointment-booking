"use client";

import Link from "next/link";
import WarningAmberOutlined from "@mui/icons-material/WarningAmberOutlined";
import AccountBalanceWalletOutlined from "@mui/icons-material/AccountBalanceWalletOutlined";
import NotificationsNoneOutlined from "@mui/icons-material/NotificationsNoneOutlined";
import ChevronRightOutlined from "@mui/icons-material/ChevronRightOutlined";
import type { NeedsAttentionItem } from "./types";

export default function NeedsAttentionCard({ items }: { items: NeedsAttentionItem[] }) {
    return (
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80">
            <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
                <div>
                    <h2 className="text-base font-bold text-slate-900">Needs attention</h2>
                    <p className="text-xs text-slate-500">
                        Unconfirmed tomorrow visits, no-shows, and pending items
                    </p>
                </div>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                    {items.length}
                </span>
            </div>

            {items.length === 0 ? (
                <p className="text-xs text-slate-500 py-8 text-center">
                    Nothing requires immediate follow-up.
                </p>
            ) : (
                <div className="divide-y divide-slate-100 mt-1">
                    {items.map((item) => (
                        <Link
                            key={item.id}
                            href={item.href}
                            className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50/70 px-2 -mx-2 rounded-xl transition-colors"
                        >
                            <div className="flex items-start gap-2.5 min-w-0">
                                <div className="size-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                                    {item.type === "unpaid" ? (
                                        <AccountBalanceWalletOutlined sx={{ fontSize: 16 }} className="text-amber-700" />
                                    ) : item.type === "unconfirmed" ? (
                                        <NotificationsNoneOutlined sx={{ fontSize: 16 }} className="text-sky-700" />
                                    ) : (
                                        <WarningAmberOutlined sx={{ fontSize: 16 }} className="text-rose-600" />
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-semibold text-slate-900 truncate">{item.title}</p>
                                    <p className="text-[11px] text-slate-500 truncate">{item.subtitle}</p>
                                </div>
                            </div>
                            <ChevronRightOutlined sx={{ fontSize: 16 }} className="text-slate-400 shrink-0" />
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
