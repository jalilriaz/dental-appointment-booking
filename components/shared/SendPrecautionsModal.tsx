"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Phone, Copy, Check, ExternalLink, Loader2, AlertCircle, CheckCircle2, Send, RefreshCw } from "lucide-react";
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
            <DialogContent className="sm:max-w-[540px] bg-slate-900 border-white/[0.08] text-white shadow-2xl">
                <DialogHeader>
                    <div className="mx-auto size-12 rounded-full bg-emerald-500/10 flex items-center justify-center mb-2 border border-emerald-500/20">
                        {sentSuccess ? (
                            <CheckCircle2 className="size-6 text-emerald-400" />
                        ) : (
                            <MessageSquare className="size-6 text-emerald-400" />
                        )}
                    </div>
                    <DialogTitle className="text-center text-xl font-bold">
                        {sentSuccess ? "Care Precautions Delivered" : "Send Care Precautions to WhatsApp"}
                    </DialogTitle>
                    <DialogDescription className="text-center text-slate-400">
                        Post-treatment instructions for <strong className="text-white">{patientName}</strong> ({treatmentName}).
                    </DialogDescription>
                </DialogHeader>

                <div className="py-2 space-y-4">
                    {/* Patient Phone & Status Bar */}
                    <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                        <div className="flex items-center gap-2 text-sm text-slate-300">
                            <Phone className="size-4 text-emerald-400" />
                            <span>WhatsApp: <strong className="text-white">{patientPhone || "No phone provided"}</strong></span>
                        </div>
                        {sentSuccess ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                <Check className="size-3.5" /> Sent via Bot
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-teal-500/10 text-teal-300 border border-teal-500/20">
                                Dr. Sheriyaar
                            </span>
                        )}
                    </div>

                    {/* Success Banner */}
                    {sentSuccess ? (
                        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2">
                            <CheckCircle2 className="size-10 text-emerald-400 mx-auto" />
                            <h4 className="text-base font-bold text-white">Directly Forwarded to Patient!</h4>
                            <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
                                The care precautions have been sent directly to <strong>{patientPhone}</strong> from the clinic WhatsApp AI assistant.
                            </p>
                        </div>
                    ) : null}

                    {/* Webhook Error Notice (if n8n was not reachable) */}
                    {n8nError && !sentSuccess && (
                        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 space-y-1">
                            <div className="flex items-center gap-2 text-amber-300 text-xs font-semibold">
                                <AlertCircle className="size-4" />
                                <span>n8n Webhook Unreachable ({n8nError})</span>
                            </div>
                            <p className="text-[11px] text-slate-400">
                                Make sure your n8n workflow is activated. You can still use the <strong>Open WhatsApp Web</strong> button below as an instant backup.
                            </p>
                        </div>
                    )}

                    {/* Loading State or Message Preview */}
                    {loadingPreview ? (
                        <div className="py-10 flex flex-col items-center justify-center space-y-3">
                            <Loader2 className="size-8 text-teal-400 animate-spin" />
                            <p className="text-sm text-slate-400">Loading tailored care instructions...</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                    Message Preview
                                </span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleCopy}
                                    className="h-7 text-xs text-slate-300 hover:text-white hover:bg-white/[0.06] gap-1"
                                >
                                    {copied ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
                                    {copied ? "Copied" : "Copy Text"}
                                </Button>
                            </div>
                            <div className="max-h-[200px] overflow-y-auto p-3.5 rounded-xl bg-slate-950/70 border border-white/[0.06] text-xs leading-relaxed text-slate-200 whitespace-pre-wrap font-sans">
                                {message || "Loading precautions..."}
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between items-center pt-2 border-t border-white/[0.06]">
                    <div>
                        {n8nError && !sentSuccess && whatsappUrl && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleOpenWhatsAppWeb}
                                className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 text-xs gap-1.5"
                            >
                                <ExternalLink className="size-3.5" />
                                Open WhatsApp Web (Backup)
                            </Button>
                        )}
                    </div>

                    <div className="flex gap-2 w-full sm:w-auto justify-end">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            className="border-slate-700 text-slate-300 hover:bg-white/5"
                        >
                            {sentSuccess ? "Close" : "Cancel"}
                        </Button>

                        {!sentSuccess ? (
                            <Button
                                onClick={handleSendDirectly}
                                disabled={sending || loadingPreview || !message}
                                className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-semibold gap-2 shadow-lg shadow-emerald-500/20 border-0"
                            >
                                {sending ? (
                                    <>
                                        <Loader2 className="size-4 animate-spin" />
                                        Sending to WhatsApp...
                                    </>
                                ) : (
                                    <>
                                        <Send className="size-4" />
                                        Send to Patient WhatsApp (1-Click)
                                    </>
                                )}
                            </Button>
                        ) : (
                            <Button
                                onClick={onClose}
                                className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
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
