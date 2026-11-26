"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { changeAppointmentStatusAction } from "@/app/actions/appointments";
import { checkoutAppointment } from "@/app/actions/billing";
import type { CheckoutAppointment } from "@/components/shared/CheckoutDialog";
import type { Appointment } from "@/lib/types";
import type { DashboardQueueAppointment } from "./types";

export function useDashboardActions() {
    const router = useRouter();
    const [busyId, setBusyId] = useState<string | null>(null);
    const [checkoutApt, setCheckoutApt] = useState<CheckoutAppointment | null>(null);
    const [checkoutAmount, setCheckoutAmount] = useState("");
    const [rescheduleApt, setRescheduleApt] = useState<Appointment | null>(null);
    const [cancelTarget, setCancelTarget] = useState<DashboardQueueAppointment | null>(null);

    const handleStatusChange = async (aptId: string, nextStatus: string) => {
        try {
            setBusyId(aptId);
            const res = await changeAppointmentStatusAction(aptId, nextStatus);
            if (!res.success) {
                toast.error("Status update failed", { description: res.error });
                return;
            }
            if (res.waitlistMatches && res.waitlistMatches > 0) {
                toast.info("Appointment cancelled — waitlist match found", {
                    description: `${res.waitlistMatches} waitlisted patient(s) match this date. Notify them from Waitlist.`,
                });
            } else {
                toast.success("Appointment status updated");
            }
            router.refresh();
        } catch {
            toast.error("Failed to update appointment status");
        } finally {
            setBusyId(null);
            setCancelTarget(null);
        }
    };

    const openCheckout = (apt: DashboardQueueAppointment) => {
        setCheckoutAmount(String(apt.price ?? apt.treatment.price ?? 0));
        setCheckoutApt({
            id: apt.id,
            patient: apt.patient,
            treatment: apt.treatment,
            price: apt.price ?? apt.treatment.price,
            discount: apt.discount ?? 0,
            patientTreatment: apt.patientTreatment,
        });
    };

    const confirmCheckout = async (
        amountPaid: number,
        billedPrice: number,
        discount: number,
        options?: Record<string, unknown>
    ) => {
        if (!checkoutApt?.id) return;
        const result = await checkoutAppointment({
            appointmentId: checkoutApt.id,
            amountCollected: amountPaid,
            billedPrice,
            discount,
            ...(options as object),
        });
        if (!result.success) {
            toast.error("Checkout failed", { description: result.error });
            return;
        }
        toast.success("Visit checked out", { description: result.message });
        setCheckoutApt(null);
        router.refresh();
    };

    const openReschedule = (apt: DashboardQueueAppointment) => {
        setRescheduleApt({
            id: apt.id,
            startTime: apt.startTime,
            endTime: apt.endTime,
            status: apt.status,
            patient: apt.patient,
            treatment: apt.treatment,
        });
    };

    return {
        busyId,
        checkoutApt,
        setCheckoutApt,
        checkoutAmount,
        setCheckoutAmount,
        rescheduleApt,
        setRescheduleApt,
        cancelTarget,
        setCancelTarget,
        handleStatusChange,
        openCheckout,
        confirmCheckout,
        openReschedule,
    };
}
