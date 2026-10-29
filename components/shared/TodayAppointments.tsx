"use client";

import { useState } from "react";
import { toast } from "sonner";
import { checkoutAppointment } from "@/app/actions/billing";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
    CheckCircle2,
    XCircle,
    UserX,
    Clock,
    Phone,
    Loader2,
    Stethoscope,
    AlertTriangle,
    History,
    MessageSquare,
} from "lucide-react";
import PatientHistoryDialog from "@/components/shared/PatientHistoryDialog";
import CheckoutDialog from "@/components/shared/CheckoutDialog";
import SendPrecautionsModal from "@/components/shared/SendPrecautionsModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { formatPKR, formatTime, statusConfig } from "@/lib/utils";


interface TodayAppointment {
    id: string;
    startTime: string;
    endTime: string;
    status: string;
    amountPaid?: number;
    price?: number;
    patient: { id?: string; name: string | null; phone: string | null; medicalAlerts?: string | null } | null;
    treatment: { name: string; durationMin: number; price: number };
    discount?: number;
}





export default function TodayAppointments({
    initialAppointments,
    title = "Today's Appointments",
}: {
    initialAppointments: TodayAppointment[];
    title?: string;
}) {
    const router = useRouter();
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const [confirmAction, setConfirmAction] = useState<{ id: string; status: string; label: string } | null>(null);
    const [checkoutApt, setCheckoutApt] = useState<TodayAppointment | null>(null);
    const [precautionsApt, setPrecautionsApt] = useState<TodayAppointment | null>(null);
    const [amountValue, setAmountValue] = useState<string>("");
    const [historyPatientId, setHistoryPatientId] = useState<string | null>(null);

    const { data: appointments = initialAppointments, refetch } = useQuery({
        queryKey: ['todayAppointments'],
        queryFn: async () => {
            const res = await fetch('/api/appointments/today');
            if (!res.ok) throw new Error('Failed to fetch appointments');
            const data = await res.json();
            return data.appointments;
        },
        initialData: initialAppointments,
        refetchInterval: 30000, // Poll every 30 seconds to keep dashboard fresh
    });

    async function updateStatus(id: string, status: string, amountPaid?: number, price?: number, discount?: number) {
        setLoadingId(id);
        try {
            if (status === "COMPLETED") {
                // Use Server Action for Checkout
                const result = await checkoutAppointment(id, amountPaid ?? 0, undefined, price, discount);

                if (!result.success) {
                    toast.error("Checkout Failed", { description: result.error });
                    return;
                }

                toast.success("Checked Out", {
                    description: `Payment of Rs. ${(amountPaid ?? 0).toLocaleString()} recorded.`
                });

                if (checkoutApt) {
                    setPrecautionsApt(checkoutApt);
                }
            } else {
                // Use existing API for other statuses (Cancel, No Show)
                const res = await fetch(`/api/appointments/${id}/status`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ status }),
                });

                if (!res.ok) {
                    const data = await res.json();
                    toast.error("Update Failed", { description: data.error });
                    return;
                }
            }

            refetch();
            router.refresh();
        } catch {
            toast.error("Update Failed", { description: "Something went wrong. Please try again." });
        } finally {
            setLoadingId(null);
        }
    }

    const scheduled = appointments.filter((a: TodayAppointment) => a.status === "SCHEDULED");
    const completed = appointments.filter((a: TodayAppointment) => a.status === "COMPLETED");
    const other = appointments.filter(
        (a: TodayAppointment) => !["SCHEDULED", "COMPLETED"].includes(a.status)
    );

    const realizedRevenue = completed.reduce((sum: number, a: TodayAppointment) => sum + (a.amountPaid ?? 0), 0);

    return (
        <>
            <div className="glass-card rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
                    <div>
                        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                            <Stethoscope className="size-5 text-teal-400" />
                            {title}
                        </h2>
                        <p className="text-xs text-slate-400 mt-0.5">
                            {scheduled.length} waiting · {completed.length} checked out · {other.length} other
                            {realizedRevenue > 0 && (
                                <span className="ml-2 text-teal-400 font-medium">
                                    — {formatPKR(realizedRevenue)} collected today
                                </span>
                            )}
                        </p>
                    </div>
                </div>

                {appointments.length === 0 ? (
                    <div className="px-6 py-12 text-center">
                        <Clock className="size-10 mx-auto mb-3 text-slate-600" />
                        <p className="font-medium text-slate-300">No appointments today</p>
                        <p className="text-sm text-slate-500 mt-1">All clear for now!</p>
                    </div>
                ) : (
                    <div className="divide-y divide-white/[0.04]">
                        {appointments.map((apt: TodayAppointment, index: number) => {
                            const time = new Date(apt.startTime);
                            const isLoading = loadingId === apt.id;
                            const conf = statusConfig[apt.status] || statusConfig.SCHEDULED;
                            const isPast = time < new Date();
                            const displayPrice = apt.price !== undefined && apt.price !== null ? apt.price : apt.treatment.price;

                            return (
                                <div
                                    key={apt.id}
                                    className={`px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 transition-premium animate-fade-in-up opacity-0 ${apt.status === "COMPLETED" ? "bg-emerald-500/[0.04]" : "hover:bg-white/[0.03]"
                                        }`}
                                    style={{ animationDelay: `${index * 0.06}s` }}
                                >
                                    {/* Time */}
                                    <div className="w-16 shrink-0 text-center hidden sm:block">
                                        <p className="text-sm font-bold text-slate-200">
                                            {formatTime(time)}
                                        </p>
                                        <p className="text-[10px] text-slate-500">{apt.treatment.durationMin} min</p>
                                    </div>

                                    {/* Divider */}
                                    <div className={`hidden sm:block w-1 h-12 rounded-full shrink-0 ${apt.status === "COMPLETED" ? "bg-emerald-400" :
                                        apt.status === "CANCELLED" ? "bg-red-400/60" :
                                            apt.status === "NO_SHOW" ? "bg-amber-400/60" :
                                                isPast ? "bg-orange-400/60" : "bg-blue-400/60"
                                        }`} />

                                    {/* Mobile time badge */}
                                    <div className="flex items-center gap-2 sm:hidden">
                                        <span className="text-xs font-bold text-slate-300 bg-white/[0.05] px-2 py-1 rounded">
                                            {formatTime(time)}
                                        </span>
                                        <span className="text-[10px] text-slate-500">{apt.treatment.durationMin} min</span>
                                    </div>

                                    {/* Patient + Treatment */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className="font-medium text-slate-200 truncate flex items-center gap-2">
                                                {apt.patient?.name || "Unknown Patient"}
                                                {(apt.patient as any)?.noShowCount > 0 && (
                                                    <span className="inline-flex items-center gap-1 rounded bg-red-500/10 px-1.5 py-0.5 text-[10px] font-medium text-red-400 border border-red-500/20" title={`${(apt.patient as any)?.noShowCount} previous No-Shows`}>
                                                        <AlertTriangle className="size-3" />
                                                        {(apt.patient as any)?.noShowCount} No-Show
                                                    </span>
                                                )}
                                            </p>
                                            {apt.patient?.medicalAlerts && (
                                                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-red-500/20 text-red-400 border border-red-500/30 shrink-0 animate-pulse" title={apt.patient.medicalAlerts}>
                                                    ⚠ Alert
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-slate-400 truncate">
                                            {apt.treatment.name} · {formatPKR(displayPrice)}
                                        </p>
                                        {apt.patient?.phone && (
                                            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                                <Phone className="size-3" /> {apt.patient.phone}
                                            </p>
                                        )}
                                    </div>

                                    {/* Status Badge */}
                                    <Badge variant="secondary" className={`${conf.bg} ${conf.color} shrink-0 border-0`}>
                                        {conf.label}
                                    </Badge>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-1.5 shrink-0">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => apt.patient?.id && setHistoryPatientId(apt.patient.id)}
                                            className="h-8 w-8 p-0 text-blue-400 border-blue-500/30 hover:bg-blue-500/10 active:scale-95 transition-premium"
                                            title="Patient History"
                                        >
                                            <History className="size-3.5" />
                                        </Button>
                                        {isLoading ? (
                                            <Loader2 className="size-4 animate-spin text-slate-500" />
                                        ) : apt.status === "SCHEDULED" ? (
                                            <>
                                                <Button
                                                    size="sm"
                                                    onClick={() => {
                                                        setCheckoutApt(apt);
                                                        setAmountValue(""); // Reset paid amount input
                                                    }}
                                                    className="gradient-primary-h text-white h-8 text-xs gap-1 shadow-lg shadow-teal-500/20 active:scale-95 transition-premium border-0"
                                                >
                                                    <CheckCircle2 className="size-3.5" />
                                                    Check Out
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => setConfirmAction({ id: apt.id, status: "NO_SHOW", label: "No Show" })}
                                                    className="h-8 text-xs gap-1 text-amber-400 border-amber-500/30 hover:bg-amber-500/10 active:scale-95 transition-premium"
                                                >
                                                    <UserX className="size-3.5" />
                                                    No Show
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => setConfirmAction({ id: apt.id, status: "CANCELLED", label: "Cancel" })}
                                                    className="h-8 text-xs gap-1 text-red-400 border-red-500/30 hover:bg-red-500/10 active:scale-95 transition-premium"
                                                >
                                                    <XCircle className="size-3.5" />
                                                </Button>
                                            </>
                                        ) : apt.status === "COMPLETED" ? (
                                            <div className="flex items-center gap-1">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => setPrecautionsApt(apt)}
                                                    className="h-8 text-xs gap-1 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10 active:scale-95 transition-premium"
                                                    title="Send Care Precautions to WhatsApp"
                                                >
                                                    <MessageSquare className="size-3.5" />
                                                    Precautions
                                                </Button>
                                                <span className="text-xs text-emerald-400 font-medium hidden sm:flex items-center gap-1">
                                                    <CheckCircle2 className="size-3.5" /> Done
                                                </span>
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Confirmation Dialog for destructive actions */}
            <AlertDialog open={!!confirmAction} onOpenChange={(open) => { if (!open) setConfirmAction(null); }}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <div className="mx-auto size-12 rounded-full bg-red-500/10 flex items-center justify-center mb-2">
                            <AlertTriangle className="size-6 text-red-400" />
                        </div>
                        <AlertDialogTitle className="text-center">
                            {confirmAction?.status === "CANCELLED" ? "Cancel Appointment" : "Mark as No Show"}
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-center">
                            {confirmAction?.status === "CANCELLED"
                                ? "Are you sure you want to cancel this appointment? The patient will need to book again."
                                : "Mark this patient as a no-show? This helps track attendance patterns."}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="sm:justify-center gap-3">
                        <AlertDialogCancel>Go Back</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                if (confirmAction) {
                                    updateStatus(confirmAction.id, confirmAction.status);
                                    setConfirmAction(null);
                                }
                            }}
                            className={confirmAction?.status === "CANCELLED"
                                ? "bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white border-0"
                                : "bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white border-0"
                            }
                        >
                            {confirmAction?.status === "CANCELLED" ? "Yes, Cancel It" : "Confirm No Show"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <CheckoutDialog
                apt={checkoutApt}
                amountValue={amountValue}
                setAmountValue={setAmountValue}
                editablePrice={true}
                onClose={() => setCheckoutApt(null)}
                onConfirm={(amount, price, discount) => {
                    if (checkoutApt) {
                        updateStatus(checkoutApt.id, "COMPLETED", amount, price, discount);
                        setCheckoutApt(null);
                    }
                }}
            />

            <PatientHistoryDialog
                patientId={historyPatientId}
                open={!!historyPatientId}
                onOpenChange={(open) => { if (!open) setHistoryPatientId(null); }}
            />

            <SendPrecautionsModal
                appointmentId={precautionsApt?.id || null}
                patientName={precautionsApt?.patient?.name || undefined}
                patientPhone={precautionsApt?.patient?.phone}
                treatmentName={precautionsApt?.treatment?.name}
                isOpen={!!precautionsApt}
                onClose={() => setPrecautionsApt(null)}
            />
        </>
    );
}

