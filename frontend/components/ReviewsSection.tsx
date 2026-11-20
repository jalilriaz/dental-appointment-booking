"use client";
import { fetchApi } from "@/lib/api-client";

import React, { useState, useEffect } from "react";
import {
  Star,
  KeyboardArrowDown,
  KeyboardArrowUp,
  ShareOutlined,
  RateReviewOutlined,
  FilterListOutlined,
  VerifiedOutlined,
} from "@mui/icons-material";
import LeaveFeedbackModal from "./LeaveFeedbackModal";
import { FeedbackItem } from "@/lib/types";

const INITIAL_REVIEWS: FeedbackItem[] = [
  {
    id: "fb-1",
    name: "Hina Aman",
    rating: 5,
    treatmentName: "Orthodontics & Braces",
    date: "October 14, 2026",
    source: "Google",
    comment:
      "The treatment was handled very gently and explained clearly. The whole experience was comfortable, reassuring, and highly professional under Dr. Shehryar's care.",
    clinicResponse: {
      responder: "Elite Dental Centre",
      date: "October 15, 2026",
      message:
        "Thank you so much, Hina! We are thrilled to hear your orthodontic experience was smooth and comfortable. Keeping our patients relaxed and pain-free is our top priority.",
    },
  },
  {
    id: "fb-2",
    name: "Ayesha Shahid",
    rating: 5,
    treatmentName: "Cosmetic Restoration",
    date: "October 28, 2026",
    source: "Google",
    comment:
      "I had a very positive experience at the clinic in G-8 Markaz. Dr. Shehryar took the time to answer all my questions and made me feel completely at ease throughout the treatment.",
    clinicResponse: {
      responder: "Elite Dental Centre",
      date: "October 29, 2026",
      message:
        "Ayesha, hearing that your visit was comforting and reassuring means the world to our team. We appreciate your kind words!",
    },
  },
  {
    id: "fb-3",
    name: "Hamza",
    rating: 5,
    treatmentName: "Dental Implant Consultation",
    date: "November 04, 2026",
    source: "Google",
    comment:
      "The doctor was professional, patient and very clear about the treatment process. Everything was explained before starting the procedure with clear transparent fee breakdowns.",
    clinicResponse: {
      responder: "Elite Dental Centre",
      date: "November 05, 2026",
      message:
        "Thank you Hamza! Providing full transparency and clinical excellence is the foundation of our dental practice.",
    },
  },
  {
    id: "fb-4",
    name: "Mariam Sohail",
    rating: 5,
    treatmentName: "Clear Aligners",
    date: "November 08, 2026",
    source: "Google",
    comment:
      "Completed my aligner checkup with Dr. Shehryar. The digital simulation matched my progress perfectly. Transparent pricing, no hidden costs, and exceptionally gentle care throughout every checkup.",
    clinicResponse: {
      responder: "Elite Dental Centre",
      date: "November 09, 2026",
      message:
        "Mariam, your new smile looks radiant! Thank you for trusting Elite Dental with your orthodontic journey.",
    },
  },
  {
    id: "fb-5",
    name: "Zara",
    rating: 5,
    treatmentName: "Comprehensive Smile Care",
    date: "November 12, 2026",
    source: "Google",
    comment:
      "A comfortable and pleasant experience from start to finish. I especially appreciated the friendly communication, clean facility next to IDC in G-8, and Dr. Shehryar's professional approach.",
    clinicResponse: {
      responder: "Elite Dental Centre",
      date: "November 13, 2026",
      message:
        "Thank you Zara! We are committed to maintaining the highest hospital sterilization standards for all our patients.",
    },
  },
  {
    id: "fb-6",
    name: "Zainab Noor",
    rating: 5,
    treatmentName: "Cosmetic Veneers",
    date: "November 16, 2026",
    source: "Google",
    comment:
      "Got custom porcelain veneers crafted by Dr. Shehryar. The precision shade matching and artistic attention he gave was phenomenal. Friends keep complimenting my natural smile!",
    clinicResponse: {
      responder: "Elite Dental Centre",
      date: "November 16, 2026",
      message:
        "Zainab, it was an honor helping craft your dream smile. Keep smiling brightly!",
    },
  },
];

const INITIAL_DISTRIBUTION = [
  { stars: 5, label: "5 Stars", count: 712, pct: 84 },
  { stars: 4, label: "4 Stars", count: 112, pct: 13 },
  { stars: 3, label: "3 Stars", count: 20, pct: 2.4 },
  { stars: 2, label: "2 Stars", count: 5, pct: 0.6 },
  { stars: 1, label: "1 Star", count: 1, pct: 0.1 },
];

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<FeedbackItem[]>(INITIAL_REVIEWS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedRatingFilter, setSelectedRatingFilter] = useState<number | "ALL">("ALL");
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await fetchApi("/api/feedback", { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          if (data?.reviews && Array.isArray(data.reviews) && data.reviews.length > 0) {
            setReviews(data.reviews);
          }
        }
      } catch {
        // Fallback already preloaded
      }
    }
    fetchReviews();
  }, []);

  const handleFeedbackSubmitted = (newFeedback: FeedbackItem) => {
    setReviews((prev) => [newFeedback, ...prev]);
  };

  const toggleExpand = (id: string) => {
    setExpandedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredReviews = reviews.filter((r) => {
    if (selectedRatingFilter === "ALL") return true;
    return r.rating === selectedRatingFilter;
  });

  return (
    <section className="relative py-20 bg-white border-b border-slate-200 overflow-hidden font-sans">
      {/* Decorative Geometric Polygonal Accent (Matches Reference Image) */}
      <div
        className="absolute top-0 right-0 w-80 sm:w-96 h-96 pointer-events-none opacity-40 lg:opacity-70 select-none overflow-hidden"
        aria-hidden="true"
      >
        <svg viewBox="0 0 400 400" className="w-full h-full">
          <polygon points="400,0 200,100 350,180" fill="#E2E8F0" />
          <polygon points="400,0 350,180 400,280" fill="#CBD5E1" />
          <polygon points="350,180 400,280 240,240" fill="#0D9488" opacity="0.85" />
          <polygon points="200,100 350,180 240,240" fill="#F1F5F9" />
          <polygon points="400,280 300,380 400,400" fill="#0F766E" opacity="0.9" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="max-w-3xl mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0B1528] tracking-tight">
            Our Reviews
          </h2>
          <p className="text-slate-600 mt-4 text-base sm:text-lg leading-relaxed">
            Of course we constantly gather verified feedback from our patients to ensure the highest standards
            of pain-free care, gentle clinical excellence, and transparent pricing. Read authentic reviews from
            the families and professionals who trust Elite Dental Centre.
          </p>
        </div>

        {/* Rating Breakdown & Stats Card (Matches Screenshot) */}
        <div className="bg-[#F8FAFC] border border-slate-200/80 rounded-3xl p-6 sm:p-8 mb-10 max-w-2xl shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-4 mb-3">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-black text-[#0B1528] tracking-tight">
                4.9
              </span>
              <span className="text-sm sm:text-base font-bold text-slate-600">
                Out of 5 Stars
              </span>
            </div>

            {/* Amber Stars */}
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} sx={{ fontSize: 22, color: "#f59e0b" }} />
              ))}
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-500 font-medium mb-6">
            Overall rating of 850+ verified 1st-party and Google reviews
          </p>

          {/* Progress Bars Breakdown */}
          <div className="space-y-2.5 max-w-md">
            {INITIAL_DISTRIBUTION.map((d) => (
              <div key={d.stars} className="flex items-center text-xs font-semibold text-slate-700">
                <span className="w-16 text-slate-600">{d.label}</span>
                <div className="flex-1 h-3.5 bg-slate-200 rounded-md overflow-hidden mx-3">
                  <div
                    className="h-full bg-teal-600 rounded-md transition-all duration-500"
                    style={{ width: `${d.pct}%` }}
                  />
                </div>
                <span className="w-10 text-right text-slate-500 font-mono text-[11px] font-bold">
                  {d.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Action & Filter Bar (View Filters on left, Leave Us Feedback on right) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 mb-8">
          <button
            type="button"
            onClick={() => setFilterOpen(!filterOpen)}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-teal-700 hover:text-teal-800 transition-colors cursor-pointer w-fit"
          >
            <FilterListOutlined sx={{ fontSize: 18 }} />
            <span>View Filters</span>
            {filterOpen ? (
              <KeyboardArrowUp sx={{ fontSize: 18 }} />
            ) : (
              <KeyboardArrowDown sx={{ fontSize: 18 }} />
            )}
          </button>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-bold text-sm rounded-xl transition-all shadow-xs hover:shadow-md cursor-pointer"
          >
            <RateReviewOutlined sx={{ fontSize: 18 }} />
            <span>Leave Us Feedback</span>
          </button>
        </div>

        {/* Expandable Filter Chips */}
        {filterOpen && (
          <div className="p-4 mb-8 bg-slate-50 border border-slate-200 rounded-2xl flex flex-wrap items-center gap-2 animate-in fade-in duration-200">
            <span className="text-xs font-bold text-slate-500 mr-2">Filter by Rating:</span>
            <button
              type="button"
              onClick={() => setSelectedRatingFilter("ALL")}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                selectedRatingFilter === "ALL"
                  ? "bg-teal-600 text-white"
                  : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              All Reviews ({reviews.length})
            </button>
            {[5, 4, 3].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setSelectedRatingFilter(star)}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                  selectedRatingFilter === star
                    ? "bg-teal-600 text-white"
                    : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
                }`}
              >
                <span>{star} Stars</span>
                <Star sx={{ fontSize: 14, color: selectedRatingFilter === star ? "#ffffff" : "#f59e0b" }} />
              </button>
            ))}
          </div>
        )}

        {/* Reviews Grid (2 Columns, matching reference design) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredReviews.map((review) => {
            const isLong = review.comment.length > 130;
            const isExpanded = !!expandedCards[review.id];

            return (
              <div
                key={review.id}
                className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  {/* Top Row: Stars + Text Rating + Google Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-0.5">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star key={i} sx={{ fontSize: 18, color: "#f59e0b" }} />
                        ))}
                      </div>
                      <span className="text-xs font-bold text-slate-700">
                        {review.rating} out of 5 stars
                      </span>
                    </div>

                    {/* Google Brand Badge / Verified Patient Badge */}
                    {review.source === "Google" ? (
                      <div className="flex items-center gap-1 px-2 py-0.5 bg-slate-50 border border-slate-200 rounded-md">
                        <span className="font-sans font-bold text-xs">
                          <span className="text-[#4285F4]">G</span>
                          <span className="text-[#EA4335]">o</span>
                          <span className="text-[#FBBC05]">o</span>
                          <span className="text-[#4285F4]">g</span>
                          <span className="text-[#34A853]">l</span>
                          <span className="text-[#EA4335]">e</span>
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-[11px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                        <VerifiedOutlined sx={{ fontSize: 13 }} />
                        <span>Verified Patient</span>
                      </div>
                    )}
                  </div>

                  {/* Author Name, Date & Treatment */}
                  <div className="mb-3">
                    <p className="text-sm font-bold text-[#0B1528]">
                      {review.name}{" "}
                      <span className="text-slate-400 font-normal">
                        - {review.date}
                      </span>
                    </p>
                    {review.treatmentName && (
                      <span className="inline-block mt-0.5 text-[11px] font-semibold text-slate-500">
                        Treatment: {review.treatmentName}
                      </span>
                    )}
                  </div>

                  {/* Review Text */}
                  <div className="text-sm text-slate-600 leading-relaxed">
                    <p className={isExpanded ? "" : "line-clamp-3"}>
                      &ldquo;{review.comment}&rdquo;
                    </p>
                    {isLong && (
                      <button
                        type="button"
                        onClick={() => toggleExpand(review.id)}
                        className="text-teal-700 hover:text-teal-800 text-xs font-bold mt-2 cursor-pointer transition-colors block"
                      >
                        {isExpanded ? "Read Less" : "Read More"}
                      </button>
                    )}
                  </div>
                </div>

                {/* Bottom Row: Share Icon & Clinic Response */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <div className="flex justify-end mb-2">
                    <button
                      type="button"
                      title="Share Review"
                      className="text-slate-400 hover:text-teal-700 p-1 rounded-md hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <ShareOutlined sx={{ fontSize: 16 }} />
                    </button>
                  </div>

                  {/* Clinic Response Box (Matches Reference Image) */}
                  {review.clinicResponse && (
                    <div className="bg-slate-50 border-l-4 border-teal-600 rounded-r-xl p-3.5 text-xs text-slate-700">
                      <p className="font-extrabold text-[#0B1528] mb-1">
                        Response: {review.clinicResponse.responder}{" "}
                        <span className="text-slate-400 font-normal">
                          - {review.clinicResponse.date}
                        </span>
                      </p>
                      <p className="text-slate-600 leading-relaxed italic">
                        &ldquo;{review.clinicResponse.message}&rdquo;
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Leave Feedback Modal */}
      <LeaveFeedbackModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onFeedbackSubmitted={handleFeedbackSubmitted}
      />
    </section>
  );
}

