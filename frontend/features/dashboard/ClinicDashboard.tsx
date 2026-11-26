"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CalendarMonthOutlined from "@mui/icons-material/CalendarMonthOutlined";
import PersonAddAlt1Outlined from "@mui/icons-material/PersonAddAlt1Outlined";
import { ConfirmDialog, PageHeader } from "@/components/admin/shared";
import CheckoutDialog from "@/components/shared/CheckoutDialog";
import RescheduleDialog from "@/components/appointments/RescheduleDialog";
import StaffBookAppointmentModal from "@/components/staff/StaffBookAppointmentModal";
import { formatKarachiDate, getKarachiGreeting } from "@/lib/format";
import DashboardKpiStrip from "./DashboardKpiStrip";
import DashboardTrendChart from "./DashboardTrendChart";
import CurrentPatientsCard from "./CurrentPatientsCard";
import UpcomingScheduleCard from "./UpcomingScheduleCard";
import StatusBreakdownCard from "./StatusBreakdownCard";
import PopularTreatmentsCard from "./PopularTreatmentsCard";
import NeedsAttentionCard from "./NeedsAttentionCard";
import { useDashboardActions } from "./useDashboardActions";
import type { ClinicDashboardData } from "./types";

export default function ClinicDashboard({ data }: { data: ClinicDashboardData }) {
    const router = useRouter();
    const [bookModalOpen, setBookModalOpen] = useState(false);
    const [bookMode, setBookMode] = useState<"existing" | "new">("existing");
    const actions = useDashboardActions();

    useEffect(() => {
        const timer = setInterval(() => router.refresh(), 20000);
        return () => clearInterval(timer);
    }, [router]);

    const { role, clinic } = data;
    const isAdmin = role === "ADMIN";
    const walkInHref = isAdmin ? "/admin/walk-in" : "/staff/book";
    const greetingTitle = isAdmin
        ? `${getKarachiGreeting()}, ${clinic.doctor.name}`
        : `${getKarachiGreeting()}, Reception`;

    return (
        <div className="space-y-6 w-full min-w-0">
            <PageHeader
                title={greetingTitle}
                subtitle={`${formatKarachiDate(new Date(), "long")} · ${clinic.clinicName}`}
                badge={
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                        <span className="size-1.5 rounded-full bg-emerald-500" />
                        Shift {clinic.workDayStart} – {clinic.workDayEnd}
                    </span>
                }
                actions={
                    <>
                        {isAdmin ? (
                            <Link
                                href={walkInHref}
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-200"
                            >
                                <PersonAddAlt1Outlined sx={{ fontSize: 16 }} className="text-teal-600" />
                                <span>New walk-in patient</span>
                            </Link>
                        ) : (
                            <button
                                type="button"
                                onClick={() => { setBookMode("new"); setBookModalOpen(true); }}
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-200 cursor-pointer"
                            >
                                <PersonAddAlt1Outlined sx={{ fontSize: 16 }} className="text-teal-600" />
                                <span>New walk-in patient</span>
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={() => { setBookMode("existing"); setBookModalOpen(true); }}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold cursor-pointer"
                        >
                            <CalendarMonthOutlined sx={{ fontSize: 16 }} />
                            <span>New appointment</span>
                        </button>
                    </>
                }
            />

            <DashboardKpiStrip role={role} kpis={data.kpis} />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-8 space-y-6 min-w-0">
                    <DashboardTrendChart role={role} chartData={data.chartData} />
                    <CurrentPatientsCard
                        role={role}
                        appointments={data.queueAppointments}
                        busyId={actions.busyId}
                        onStatusChange={actions.handleStatusChange}
                        onCheckout={actions.openCheckout}
                        onReschedule={actions.openReschedule}
                        onRequestCancel={actions.setCancelTarget}
                        onAddPatientClick={() => { setBookMode("new"); setBookModalOpen(true); }}
                    />
                </div>
                <div className="lg:col-span-4 space-y-6 min-w-0">
                    <UpcomingScheduleCard appointments={data.upcomingAppointments} />
                    <NeedsAttentionCard items={data.needsAttention} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <StatusBreakdownCard distribution={data.statusDistribution} />
                <PopularTreatmentsCard items={data.popularTreatments} showRevenue={isAdmin} />
            </div>

            <CheckoutDialog
                apt={actions.checkoutApt}
                onClose={() => actions.setCheckoutApt(null)}
                onConfirm={actions.confirmCheckout}
                amountValue={actions.checkoutAmount}
                setAmountValue={actions.setCheckoutAmount}
            />
            {actions.rescheduleApt && (
                <RescheduleDialog
                    appointment={actions.rescheduleApt}
                    open={!!actions.rescheduleApt}
                    onOpenChange={(open) => !open && actions.setRescheduleApt(null)}
                    onSuccess={() => { actions.setRescheduleApt(null); router.refresh(); }}
                />
            )}
            <ConfirmDialog
                open={!!actions.cancelTarget}
                onOpenChange={(open) => !open && actions.setCancelTarget(null)}
                title="Cancel appointment"
                description={`Cancel ${actions.cancelTarget?.patient?.name || "this patient"}'s ${actions.cancelTarget?.treatment.name || ""} visit?`}
                confirmLabel="Cancel appointment"
                loading={Boolean(actions.cancelTarget && actions.busyId === actions.cancelTarget.id)}
                onConfirm={() =>
                    actions.cancelTarget && actions.handleStatusChange(actions.cancelTarget.id, "CANCELLED")
                }
            />
            <StaffBookAppointmentModal
                open={bookModalOpen}
                onOpenChange={setBookModalOpen}
                defaultMode={bookMode}
                onSuccess={() => router.refresh()}
            />
        </div>
    );
}
