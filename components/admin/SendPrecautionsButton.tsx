"use client";

import { useState } from "react";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import SendPrecautionsModal from "@/components/shared/SendPrecautionsModal";

interface SendPrecautionsButtonProps {
    appointmentId: string;
    patientName: string;
    patientPhone?: string | null;
    treatmentName: string;
    className?: string;
    size?: "sm" | "default" | "icon";
}

export default function SendPrecautionsButton({
    appointmentId,
    patientName,
    patientPhone,
    treatmentName,
    className = "",
    size = "sm",
}: SendPrecautionsButtonProps) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button
                type="button"
                size={size}
                variant="outline"
                onClick={() => setOpen(true)}
                className={`text-xs gap-1.5 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10 active:scale-95 transition-premium ${className}`}
                title="Send Post-Treatment Precautions to WhatsApp"
            >
                <MessageSquare className="size-3.5" />
                <span>WhatsApp Precautions</span>
            </Button>

            <SendPrecautionsModal
                appointmentId={appointmentId}
                patientName={patientName}
                patientPhone={patientPhone}
                treatmentName={treatmentName}
                isOpen={open}
                onClose={() => setOpen(false)}
            />
        </>
    );
}
