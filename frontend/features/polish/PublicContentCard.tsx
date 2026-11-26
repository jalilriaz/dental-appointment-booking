"use client";

import { useState } from "react";
import { toast } from "sonner";
import WebOutlined from "@mui/icons-material/WebOutlined";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { PublicContentConfig } from "@/lib/services/publicContent";

export default function PublicContentCard({ initialContent }: { initialContent: PublicContentConfig }) {
    const [content, setContent] = useState<PublicContentConfig>(initialContent);
    const [saving, setSaving] = useState(false);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch("/api/settings/rules", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ publicContent: content }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Save failed");
            toast.success("Public website content settings saved");
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to save public content");
        } finally {
            setSaving(false);
        }
    };

    return (
        <section id="public-content" className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center">
                        <WebOutlined sx={{ fontSize: 20 }} />
                    </div>
                    <div>
                        <h2 className="text-base font-bold text-slate-900">Public website content settings</h2>
                        <p className="text-xs text-slate-500">Manage live top announcement bar, hero messaging, and review visibility.</p>
                    </div>
                </div>
                <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                    <Switch checked={content.announcementEnabled} onCheckedChange={(v) => setContent((p) => ({ ...p, announcementEnabled: v }))} />
                    <span>Show top website announcement</span>
                </label>
            </div>

            <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="sm:col-span-2">
                    <Label>Public announcement banner text</Label>
                    <Input value={content.announcementText} onChange={(e) => setContent((p) => ({ ...p, announcementText: e.target.value }))} placeholder="e.g. Same-day emergency dental slots available Mon–Sat." />
                </div>
                <div>
                    <Label>Hero headline</Label>
                    <Input required value={content.heroHeadline} onChange={(e) => setContent((p) => ({ ...p, heroHeadline: e.target.value }))} />
                </div>
                <div>
                    <Label>Reviews section heading</Label>
                    <Input value={content.reviewsHeading} onChange={(e) => setContent((p) => ({ ...p, reviewsHeading: e.target.value }))} />
                </div>
                <div className="sm:col-span-2">
                    <Label>Hero subheadline</Label>
                    <Input value={content.heroSubheadline} onChange={(e) => setContent((p) => ({ ...p, heroSubheadline: e.target.value }))} />
                </div>
                <div>
                    <Label>Google review link (optional)</Label>
                    <Input value={content.googleReviewUrl} onChange={(e) => setContent((p) => ({ ...p, googleReviewUrl: e.target.value }))} placeholder="https://g.page/r/..." />
                </div>
                <div className="flex items-end justify-between gap-4">
                    <label className="inline-flex items-center gap-2 font-semibold text-slate-700 cursor-pointer pb-2">
                        <Switch checked={content.showReviewsOnWeb} onCheckedChange={(v) => setContent((p) => ({ ...p, showReviewsOnWeb: v }))} />
                        <span>Display published reviews</span>
                    </label>
                    <button type="submit" disabled={saving} className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold cursor-pointer disabled:opacity-50">
                        {saving ? "Saving..." : "Save public content"}
                    </button>
                </div>
            </form>
        </section>
    );
}
