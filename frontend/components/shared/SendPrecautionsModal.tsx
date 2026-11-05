"use client";

import { useState, useEffect } from "react";

import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import OpenInNewOutlinedIcon from "@mui/icons-material/OpenInNewOutlined";
import AutorenewOutlinedIcon from "@mui/icons-material/AutorenewOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface SendPrecautionsModalProps {
    appointmentId: string | null;
    patientName?: string;
    patientPhone?: string | null;
    treatmentName?: string;
    isOpen: boolean;
    onClose: () => void;
}

export default function SendPrecautionsModal({
    appointmentId,
    patientName,
    patientPhone,
    treatmentName,
    isOpen,
    onClose,
}: SendPrecautionsModalProps) {
    const [loadingPreview, setLoadingPreview] = useState(false);
    const [sending, setSending] = useState(false);
    const [sentSuccess, setSentSuccess] = useState(false);
    const [copied, setCopied] = useState(false);
    const [message, setMessage] = useState<string>("");
    const [whatsappUrl, setWhatsappUrl] = useState<string>("");
    const [n8nError, setN8nError] = useState<string | null>(null);

    // Load preview message on modal open without sending anything yet
    useEffect(() => {
        if (isOpen && appointmentId) {
            setSentSuccess(false);
            setN8nError(null);
            fetchPreview(appointmentId);
        } else {
            setMessage("");
            setWhatsappUrl("");
            setSentSuccess(false);
            setN8nError(null);
        }
    }, [isOpen, appointmentId]);

    async function fetchPreview(id: string) {
        setLoadingPreview(true);
        setN8nError(null);
        try {
            const res = await fetch(`/api/appointments/${id}/send-precautions`);
            const data = await res.json();
            if (res.ok && data.success) {
                setMessage(data.message);
                setWhatsappUrl(data.whatsappUrl);
            } else {
                toast.error("Failed to load precautions preview", {
                    description: data.error || "Please try again."
                });
            }
        } catch {
            toast.error("Network error while loading precautions preview");
        } finally {
            setLoadingPreview(false);
        }
    }

    // 🚀 Primary automated action: Doctor clicks send, message is dispatched in background via n8n
    async function handleSendDirectly() {
        if (!appointmentId) return;
        setSending(true);
        setN8nError(null);

        try {
            const res = await fetch(`/api/appointments/${appointmentId}/send-precautions`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            });
            const data = await res.json();

            if (res.ok && data.success) {
                if (data.n8nDispatched) {
                    setSentSuccess(true);
                    toast.success("Precautions sent directly to WhatsApp!", {
                        description: `Delivered to ${patientPhone || data.patientPhone}`
                    });
                } else {
                    // n8n webhook was unreachable (e.g., service offline or error)
                    setN8nError(data.n8nError || "Failed to reach n8n WhatsApp webhook");
                    toast.warning("n8n Webhook Offline", {
                        description: "You can send manually via WhatsApp Web using the button below."
                    });
                }
            } else {
                toast.error("Failed to send precautions", {
                    description: data.error || "Please try again."
                });
            }
        } catch {
            toast.error("Network error while sending precautions to WhatsApp");
        } finally {
            setSending(false);
        }
    }

    const handleCopy = () => {
        if (!message) return;
        navigator.clipboard.writeText(message);
        setCopied(true);
        toast.success("Care precautions copied to clipboard");
        setTimeout(() => setCopied(false), 2000);
    };

    const handleOpenWhatsAppWeb = () => {
        if (!whatsappUrl) return;
        window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[540px] bg-white border-slate-200 text-slate-900 shadow-2xl">
                <DialogHeader>
                    <div className="mx-auto size-12 rounded-full bg-emerald-50 flex items-center justify-center mb-2 border border-emerald-200">
                        {sentSuccess ? (
                            <CheckCircleOutlineOutlinedIcon className="size-6 text-emerald-600" />
                        ) : (
                            <ChatBubbleOutlineOutlinedIcon className="size-6 text-emerald-600" />
                        )}
                    </div>
                    <DialogTitle className="text-center text-xl font-bold text-slate-900">
                        {sentSuccess ? "Care Precautions Delivered" : "Send Care Precautions to WhatsApp"}
                    </DialogTitle>
                    <DialogDescription className="text-center text-slate-600">
                        Post-treatment instructions for <strong className="text-slate-900">{patientName}</strong> ({treatmentName}).
                    </DialogDescription>
                </DialogHeader>

                <div className="py-2 space-y-4">
                    {/* Patient Phone & Status Bar */}
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                        <div className="flex items-center gap-2 text-sm text-slate-700">
                            <PhoneOutlinedIcon className="size-4 text-emerald-600" />
                            <span>WhatsApp: <strong className="text-slate-900">{patientPhone || "No phone provided"}</strong></span>
                        </div>
                        {sentSuccess ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <CheckOutlinedIcon className="size-3.5" /> Sent via Bot
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-teal-50 text-teal-700 border border-teal-200">
                                Dr. Sheriyaar
                            </span>
                        )}
                    </div>

                    {/* Success Banner */}
                    {sentSuccess ? (
                        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                            <CheckCircleOutlineOutlinedIcon className="size-10 text-emerald-600 mx-auto" />
                            <h4 className="text-base font-bold text-slate-900">Directly Forwarded to Patient!</h4>
                            <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                                The care precautions have been sent directly to <strong className="text-slate-900">{patientPhone}</strong> from the clinic WhatsApp AI assistant.
                            </p>
                        </div>
                    ) : null}

                    {/* Webhook Error Notice (if n8n was not reachable) */}
                    {n8nError && !sentSuccess && (
                        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 space-y-1">
                            <div className="flex items-center gap-2 text-amber-800 text-xs font-semibold">
                                <ErrorOutlineOutlinedIcon className="size-4 text-amber-600" />
                                <span>n8n Webhook Unreachable ({n8nError})</span>
                            </div>
                            <p className="text-[11px] text-amber-700">
                                Make sure your n8n workflow is activated. You can still use the <strong>Open WhatsApp Web</strong> button below as an instant backup.
                            </p>
                        </div>
                    )}

                    {/* Loading State or Message Preview */}
                    {loadingPreview ? (
                        <div className="py-10 flex flex-col items-center justify-center space-y-3">
                            <AutorenewOutlinedIcon className="size-8 text-teal-600 animate-spin" />
                            <p className="text-sm text-slate-600">Loading tailored care instructions...</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                    Message Preview
                                </span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleCopy}
                                    className="h-7 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 gap-1"
                                >
                                    {copied ? <CheckOutlinedIcon className="size-3.5 text-emerald-600" /> : <ContentCopyOutlinedIcon className="size-3.5" />}
                                    {copied ? "Copied" : "Copy Text"}
                                </Button>
                            </div>
                            <div className="max-h-[200px] overflow-y-auto p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs leading-relaxed text-slate-800 whitespace-pre-wrap font-sans">
                                {message || "Loading precautions..."}
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between items-center pt-2 border-t border-slate-200">
                    <div>
                        {n8nError && !sentSuccess && whatsappUrl && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleOpenWhatsAppWeb}
                                className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 text-xs gap-1.5"
                            >
                                <OpenInNewOutlinedIcon className="size-3.5" />
                                Open WhatsApp Web (Backup)
                            </Button>
                        )}
                    </div>

                    <div className="flex gap-2 w-full sm:w-auto justify-end">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            className="border-slate-300 text-slate-700 hover:bg-slate-100"
                        >
                            {sentSuccess ? "Close" : "Cancel"}
                        </Button>

                        {!sentSuccess ? (
                            <Button
                                onClick={handleSendDirectly}
                                disabled={sending || loadingPreview || !message}
                                className="bg-teal-600 hover:bg-teal-700 text-white font-semibold gap-2 shadow-sm border-0"
                            >
                                {sending ? (
                                    <>
                                        <AutorenewOutlinedIcon className="size-4 animate-spin" />
                                        Sending to WhatsApp...
                                    </>
                                ) : (
                                    <>
                                        <SendOutlinedIcon className="size-4" />
                                        Send to Patient WhatsApp (1-Click)
                                    </>
                                )}
                            </Button>
                        ) : (
                            <Button
                                onClick={onClose}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                            >
                                Done
                            </Button>
                        )}
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
