"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import CheckCircleOutlineOutlined from "@mui/icons-material/CheckCircleOutlineOutlined";

function FeedbackFormInner() {
    const params = useSearchParams();
    const appointmentId = params.get("appointmentId") || "";
    const treatment = params.get("treatment") || "Dental Consultation";
    const [name, setName] = useState(params.get("name") || "");
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [done, setDone] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSubmitting(true);
        try {
            const res = await fetch("/api/feedback", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    rating,
                    comment,
                    treatmentName: treatment,
                    ...(appointmentId ? { appointmentId } : {}),
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Unable to submit feedback.");
            setDone(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unable to submit feedback.");
        } finally {
            setSubmitting(false);
        }
    };

    if (done) {
        return (
            <div className="max-w-md mx-auto rounded-2xl border border-emerald-200 bg-white p-8 text-center space-y-2 shadow-sm">
                <CheckCircleOutlineOutlined className="text-emerald-600 mx-auto" sx={{ fontSize: 36 }} />
                <h1 className="text-lg font-bold text-slate-900">Thank you for your feedback!</h1>
                <p className="text-xs text-slate-600">Your verified review helps us continue improving dental care.</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto rounded-2xl border border-slate-200 bg-white p-6 space-y-4 shadow-sm text-xs">
            <div>
                <h1 className="text-lg font-bold text-slate-900">Share your visit feedback</h1>
                <p className="text-slate-500 mt-0.5">{treatment}</p>
            </div>
            {error && <p className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 font-medium">{error}</p>}
            <div>
                <label className="block font-semibold text-slate-700 mb-1">Your name</label>
                <input required value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-slate-200" />
            </div>
            <div>
                <label className="block font-semibold text-slate-700 mb-1">Rating</label>
                <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button key={star} type="button" onClick={() => setRating(star)} className={`px-3 py-1.5 rounded-lg border font-bold cursor-pointer ${rating >= star ? "bg-amber-50 border-amber-300 text-amber-700" : "border-slate-200 text-slate-400"}`}>
                            {star} ★
                        </button>
                    ))}
                </div>
            </div>
            <div>
                <label className="block font-semibold text-slate-700 mb-1">Comments</label>
                <textarea required minLength={5} rows={4} value={comment} onChange={(e) => setComment(e.target.value)} placeholder="How was your appointment experience?" className="w-full p-3 rounded-lg border border-slate-200" />
            </div>
            <button type="submit" disabled={submitting} className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold cursor-pointer disabled:opacity-50">
                {submitting ? "Submitting..." : "Submit feedback"}
            </button>
        </form>
    );
}

export default function PublicFeedbackPage() {
    return (
        <main className="min-h-screen bg-slate-50 py-14 px-4">
            <Suspense fallback={<p className="text-center text-xs text-slate-500">Loading feedback form...</p>}>
                <FeedbackFormInner />
            </Suspense>
        </main>
    );
}
