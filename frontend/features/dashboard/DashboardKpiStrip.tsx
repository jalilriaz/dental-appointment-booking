"use client";

import AttachMoneyOutlined from "@mui/icons-material/AttachMoneyOutlined";
import AccessTimeOutlined from "@mui/icons-material/AccessTimeOutlined";
import PeopleAltOutlined from "@mui/icons-material/PeopleAltOutlined";
import AccountBalanceWalletOutlined from "@mui/icons-material/AccountBalanceWalletOutlined";
import CalendarMonthOutlined from "@mui/icons-material/CalendarMonthOutlined";
import { StatCard } from "@/components/admin/shared";
import { formatPKR } from "@/lib/format";
import type { DashboardKPIs } from "./types";

interface DashboardKpiStripProps {
    role: "ADMIN" | "STAFF";
    kpis: DashboardKPIs;
}

export default function DashboardKpiStrip({ role, kpis }: DashboardKpiStripProps) {
    const todayPct =
        kpis.appointmentsTodayTotal > 0
            ? Math.round((kpis.appointmentsTodayDone / kpis.appointmentsTodayTotal) * 100)
            : 0;

    if (role === "STAFF") {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard
                    label="Today's appointments"
                    value={`${kpis.appointmentsTodayDone} / ${kpis.appointmentsTodayTotal}`}
                    icon={<AccessTimeOutlined sx={{ fontSize: 18 }} />}
                    iconTone="sky"
                    progressPct={todayPct}
                    subtext={
                        kpis.appointmentsTodayTotal === 0
                            ? "No visits scheduled today"
                            : `${kpis.appointmentsTodayRemaining} remaining`
                    }
                />
                <StatCard
                    label="Tomorrow's schedule"
                    value={kpis.tomorrowTotal}
                    icon={<CalendarMonthOutlined sx={{ fontSize: 18 }} />}
                    iconTone="teal"
                    subtext="Booked visits for tomorrow"
                />
                <StatCard
                    label="Total patients"
                    value={kpis.totalPatients}
                    icon={<PeopleAltOutlined sx={{ fontSize: 18 }} />}
                    iconTone="emerald"
                    trendText={`+${kpis.newPatientsThisMonth} new`}
                    trendPositive
                    subtext="this month"
                />
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <StatCard
                label="Revenue this month"
                value={formatPKR(kpis.revenueThisMonth ?? 0)}
                icon={<AttachMoneyOutlined sx={{ fontSize: 18 }} />}
                iconTone="teal"
                trendText={kpis.revenueTrendText}
                trendPositive={kpis.revenueTrendPositive}
                subtext="vs last month"
            />
            <StatCard
                label="Today's appointments"
                value={`${kpis.appointmentsTodayDone} / ${kpis.appointmentsTodayTotal}`}
                icon={<AccessTimeOutlined sx={{ fontSize: 18 }} />}
                iconTone="sky"
                progressPct={todayPct}
                subtext={
                    kpis.appointmentsTodayTotal === 0
                        ? "No visits scheduled today"
                        : `${kpis.appointmentsTodayRemaining} remaining`
                }
            />
            <StatCard
                label="Total patients"
                value={kpis.totalPatients}
                icon={<PeopleAltOutlined sx={{ fontSize: 18 }} />}
                iconTone="emerald"
                trendText={`+${kpis.newPatientsThisMonth} new`}
                trendPositive
                subtext="this month"
            />
            <StatCard
                label="Outstanding balance"
                value={formatPKR(kpis.outstandingBalance ?? 0)}
                icon={<AccountBalanceWalletOutlined sx={{ fontSize: 18 }} />}
                iconTone="gold"
                accent
                subtext="Across active plans and visits"
            />
        </div>
    );
}
