"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface PaymentStatusToggleProps {
    appointmentId: string;
    initialStatus: string;
}

export default function PaymentStatusToggle({ appointmentId, initialStatus }: PaymentStatusToggleProps) {
    const [status, setStatus] = useState(initialStatus);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const toggleStatus = async () => {
        setLoading(true);
        const newStatus = status === "PAID" ? "UNPAID" : "PAID";
        try {
            const res = await fetch(`/api/appointments/${appointmentId}/payment`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ paymentStatus: newStatus }),
            });

            if (res.ok) {
                setStatus(newStatus);
                router.refresh();
            }
        } catch (error) {
            console.error("Failed to update payment status", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={toggleStatus}
            disabled={loading}
            className={cn(
                "h-7 text-xs font-semibold gap-1.5 transition-all border",
                status === "PAID"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 hover:text-emerald-800"
                    : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 hover:text-amber-800"
            )}
        >
            {loading ? <Loader2 className="size-3 animate-spin" /> : (
                status === "PAID" ? <Check className="size-3" /> : <X className="size-3" />
            )}
            {status === "PAID" ? "Paid" : "Unpaid"}
        </Button>
    );
}
