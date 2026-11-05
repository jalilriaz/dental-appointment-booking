"use client";

import React, { useState } from "react";
import {
  Star,
  StarBorder,
  Close,
  CheckCircle,
  RateReviewOutlined,
  PersonOutlined,
  EmailOutlined,
  MedicalServicesOutlined,
} from "@mui/icons-material";
import { FeedbackItem } from "@/app/api/feedback/route";

interface LeaveFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFeedbackSubmitted: (newFeedback: FeedbackItem) => void;
}

const PROCEDURES = [
  "Dental Implants",
  "Root Canal Treatment",
  "Teeth Whitening",
  "Clear Aligners / Braces",
  "Cosmetic Veneers",
  "Routine Scaling & Cleaning",
  "Pediatric Dental Care",
  "Wisdom Tooth Extraction",
  "General Consultation",
];

export default function LeaveFeedbackModal({
  isOpen,
  onClose,
  onFeedbackSubmitted,
}: LeaveFeedbackModalProps) {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [procedure, setProcedure] = useState(PROCEDURES[0]);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Please provide your name.");
      return;
    }

    if (!comment.trim() || comment.trim().length < 5) {
      setError("Please write at least a few words describing your experience (min 5 characters).");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim() || undefined,
          rating,
          treatmentName: procedure,
          comment: comment.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit feedback.");
      }

      setSuccess(true);
      if (data.feedback) {
        onFeedbackSubmitted(data.feedback);
      }

      setTimeout(() => {
        setSuccess(false);
        setName("");
        setEmail("");
        setComment("");
        setRating(5);
        onClose();
      }, 1600);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Submission failed. Please try again.";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center">
              <RateReviewOutlined sx={{ fontSize: 18 }} />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0B1528]">Leave Us Feedback</h3>
              <p className="text-xs text-slate-500 font-medium">Your authentic experience helps us excel</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 flex items-center justify-center transition-colors"
            aria-label="Close"
          >
            <Close sx={{ fontSize: 18 }} />
          </button>
        </div>

        {/* Modal Body */}
        {success ? (
          <div className="p-8 text-center flex flex-col items-center justify-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center animate-in zoom-in-75">
              <CheckCircle sx={{ fontSize: 32 }} />
            </div>
            <h4 className="text-lg font-bold text-[#0B1528]">Thank You For Your Review!</h4>
            <p className="text-sm text-slate-600 max-w-sm">
              Your valuable feedback has been submitted and shared with our clinical staff.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="p-3 text-xs rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-medium">
                {error}
              </div>
            )}

            {/* Star Rating Selector */}
            <div className="text-center py-2 bg-slate-50 rounded-xl border border-slate-100">
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                Overall Experience Rating
              </label>
              <div className="flex justify-center items-center gap-1">
                {[1, 2, 3, 4, 5].map((starValue) => {
                  const filled = (hoverRating !== null ? hoverRating : rating) >= starValue;
                  return (
                    <button
                      key={starValue}
                      type="button"
                      onMouseEnter={() => setHoverRating(starValue)}
                      onMouseLeave={() => setHoverRating(null)}
                      onClick={() => setRating(starValue)}
                      className="p-1 focus:outline-hidden transition-transform hover:scale-110 cursor-pointer"
                      title={`${starValue} out of 5 stars`}
                    >
                      {filled ? (
                        <Star sx={{ fontSize: 30, color: "#f59e0b" }} />
                      ) : (
                        <StarBorder sx={{ fontSize: 30, color: "#cbd5e1" }} />
                      )}
                    </button>
                  );
                })}
              </div>
              <span className="text-xs font-bold text-slate-700 mt-1 inline-block">
                {rating === 5 && "Exceptional (5/5)"}
                {rating === 4 && "Very Good (4/5)"}
                {rating === 3 && "Average (3/5)"}
                {rating === 2 && "Could Be Better (2/5)"}
                {rating === 1 && "Unsatisfactory (1/5)"}
              </span>
            </div>

            {/* Patient Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Your Full Name <span className="text-teal-600">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <PersonOutlined sx={{ fontSize: 18 }} />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dr. Ayesha Khan"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:border-teal-600 focus:ring-1 focus:ring-teal-600 outline-hidden transition-colors"
                />
              </div>
            </div>

            {/* Email (Optional) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email / Phone <span className="text-slate-400 font-normal">(Optional, for verification)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <EmailOutlined sx={{ fontSize: 18 }} />
                </div>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. ayesha@example.com"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:border-teal-600 focus:ring-1 focus:ring-teal-600 outline-hidden transition-colors"
                />
              </div>
            </div>

            {/* Treatment Procedure */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Treatment / Procedure Visited
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <MedicalServicesOutlined sx={{ fontSize: 18 }} />
                </div>
                <select
                  value={procedure}
                  onChange={(e) => setProcedure(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:border-teal-600 focus:ring-1 focus:ring-teal-600 outline-hidden transition-colors appearance-none cursor-pointer"
                >
                  {PROCEDURES.map((proc) => (
                    <option key={proc} value={proc}>
                      {proc}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Review Comment */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Your Review <span className="text-teal-600">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience with our dental treatment, hygiene, painless procedure, or clinical staff..."
                className="w-full p-3 text-sm bg-white border border-slate-200 rounded-xl focus:border-teal-600 focus:ring-1 focus:ring-teal-600 outline-hidden transition-colors resize-none"
              />
            </div>

            {/* Submit & Cancel Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 disabled:opacity-50 rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
