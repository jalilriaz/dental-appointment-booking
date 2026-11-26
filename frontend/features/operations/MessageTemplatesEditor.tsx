"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import ChatOutlined from "@mui/icons-material/ChatOutlined";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    ALLOWED_TEMPLATE_PLACEHOLDERS,
    findInvalidPlaceholders,
    renderMessageTemplate,
    SAMPLE_TEMPLATE_DATA,
    type MessageTemplateEntry,
} from "@/lib/services/messageTemplates";
import type { TemplateKey } from "@/lib/validations/operations";

export default function MessageTemplatesEditor({
    initialTemplates,
}: {
    initialTemplates: Record<TemplateKey, MessageTemplateEntry>;
}) {
    const [templates, setTemplates] = useState(initialTemplates);
    const [selectedKey, setSelectedKey] = useState<TemplateKey>("booking_confirmation");
    const [saving, setSaving] = useState(false);

    const current = templates[selectedKey];
    const invalidTokens = useMemo(() => {
        return Array.from(new Set([
            ...findInvalidPlaceholders(current.whatsappBody),
            ...findInvalidPlaceholders(current.emailSubject),
            ...findInvalidPlaceholders(current.emailBody),
        ]));
    }, [current]);

    const updateField = (field: "whatsappBody" | "emailSubject" | "emailBody", value: string) => {
        setTemplates((prev) => ({
            ...prev,
            [selectedKey]: { ...prev[selectedKey], [field]: value },
        }));
    };

    const insertToken = (token: string) => {
        updateField("whatsappBody", `${current.whatsappBody} {{${token}}}`);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (invalidTokens.length > 0) {
            toast.error(`Remove unknown placeholders: ${invalidTokens.join(", ")}`);
            return;
        }
        setSaving(true);
        try {
            const res = await fetch("/api/settings/templates", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    key: selectedKey,
                    whatsappBody: current.whatsappBody,
                    emailSubject: current.emailSubject,
                    emailBody: current.emailBody,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to save template");
            setTemplates(data.templates);
            toast.success("Message template saved");
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to save template");
        } finally {
            setSaving(false);
        }
    };

    return (
        <section id="message-templates" className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center">
                        <ChatOutlined sx={{ fontSize: 20 }} />
                    </div>
                    <div>
                        <h2 className="text-base font-bold text-slate-900">WhatsApp &amp; email templates</h2>
                        <p className="text-xs text-slate-500">Whitelisted placeholders only; unknown tokens are rejected on save.</p>
                    </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                    {(Object.keys(templates) as TemplateKey[]).map((key) => (
                        <button
                            key={key}
                            type="button"
                            onClick={() => setSelectedKey(key)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                                selectedKey === key ? "bg-teal-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}
                        >
                            {templates[key].label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                <span className="font-semibold text-slate-600 mr-1">Allowed placeholders:</span>
                {ALLOWED_TEMPLATE_PLACEHOLDERS.map((tok) => (
                    <button key={tok} type="button" onClick={() => insertToken(tok)} className="px-2 py-0.5 rounded-md bg-teal-50 border border-teal-200 text-teal-800 font-mono hover:bg-teal-100 cursor-pointer">
                        {`{{${tok}}}`}
                    </button>
                ))}
            </div>

            <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-5 text-xs">
                <div className="space-y-3">
                    <div>
                        <Label>WhatsApp template body</Label>
                        <textarea rows={4} value={current.whatsappBody} onChange={(e) => updateField("whatsappBody", e.target.value)} className="w-full mt-1 p-2.5 rounded-lg border border-slate-200 text-xs" />
                    </div>
                    <div>
                        <Label>Email subject</Label>
                        <Input value={current.emailSubject} onChange={(e) => updateField("emailSubject", e.target.value)} />
                    </div>
                    <div>
                        <Label>Email body</Label>
                        <textarea rows={3} value={current.emailBody} onChange={(e) => updateField("emailBody", e.target.value)} className="w-full mt-1 p-2.5 rounded-lg border border-slate-200 text-xs" />
                    </div>
                    {invalidTokens.length > 0 && (
                        <p className="text-rose-700 font-semibold bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">
                            Unknown placeholder(s) detected: {invalidTokens.join(", ")}
                        </p>
                    )}
                    <button type="submit" disabled={saving || invalidTokens.length > 0} className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold cursor-pointer disabled:opacity-50">
                        {saving ? "Saving..." : "Save template"}
                    </button>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                    <p className="font-bold text-slate-800">Sample preview (with placeholder data)</p>
                    <div className="rounded-xl bg-white border border-slate-200 p-3 space-y-1">
                        <p className="text-[11px] font-semibold text-teal-700">WhatsApp preview</p>
                        <p className="text-xs text-slate-700 whitespace-pre-wrap">{renderMessageTemplate(current.whatsappBody, SAMPLE_TEMPLATE_DATA)}</p>
                    </div>
                    <div className="rounded-xl bg-white border border-slate-200 p-3 space-y-1">
                        <p className="text-[11px] font-semibold text-slate-600">Email subject: {renderMessageTemplate(current.emailSubject, SAMPLE_TEMPLATE_DATA)}</p>
                        <p className="text-xs text-slate-700 whitespace-pre-wrap">{renderMessageTemplate(current.emailBody, SAMPLE_TEMPLATE_DATA)}</p>
                    </div>
                </div>
            </form>
        </section>
    );
}
