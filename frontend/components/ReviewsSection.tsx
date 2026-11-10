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
    name: "Ayesha Malik",
    rating: 5,
    treatmentName: "Dental Implants",
    date: "March 18, 2026",
    source: "Google",
    comment:
      "I was extremely anxious about getting an implant done, but Dr. Zeeshan and the team at Elite Dental made it completely seamless and painless. The 3D scan and pre-planning was top tier. Highly recommended to anyone looking for genuine surgical precision!",
    clinicResponse: {
      responder: "Elite Dental Centre",
      date: "March 19, 2026",
      message:
        "Thank you so much, Ayesha! We are thrilled to hear your implant procedure was smooth and comfortable. Keeping our patients relaxed and pain-free is our top priority.",
    },
  },
  {
    id: "fb-2",
    name: "Hamza Tariq",
    rating: 5,
    treatmentName: "Root Canal Treatment",
    date: "April 02, 2026",
    source: "Google",
    comment:
      "Painless single-sitting root canal! Absolutely incredible hygiene and state-of-the-art facility in F-7 Islamabad. The staff was courteous and followed up the next day to check on my recovery. Outstanding dental care.",
    clinicResponse: {
      responder: "Elite Dental Centre",
      date: "April 03, 2026",
      message:
        "Hamza, hearing that your root canal was completely painless is fantastic. We appreciate you taking the time to share your positive experience!",
    },
  },
  {
    id: "fb-3",
    name: "Dr. Bilal Rafiq",
    rating: 5,
    treatmentName: "Teeth Whitening",
    date: "April 15, 2026",
    source: "Verified Patient",
    comment:
      "Came in for laser teeth whitening before my wedding. The results exceeded all my expectations — 4 shades brighter in just 45 minutes with zero sensitivity afterward. The clinic ambiance feels like a boutique hospital.",
    clinicResponse: {
      responder: "Elite Dental Centre",
      date: "April 15, 2026",
      message:
        "Congratulations on your wedding, Dr. Bilal! It was our pleasure to brighten your smile for such a special milestone.",
    },
  },
  {
    id: "fb-4",
    name: "Mariam Sohail",
    rating: 5,
    treatmentName: "Clear Aligners",
    date: "April 28, 2026",
    source: "Google",
    comment:
      "Completed my 8-month Invisalign aligner treatment here. The digital simulation matched my final smile 100%. Transparent pricing, no hidden costs, and exceptionally gentle care throughout every checkup.",
    clinicResponse: {
      responder: "Elite Dental Centre",
      date: "April 29, 2026",
      message:
        "Mariam, your new smile looks radiant! Thank you for trusting Elite Dental with your orthodontic journey.",
    },
  },
  {
    id: "fb-5",
    name: "Usman Ghani",
    rating: 4,
    treatmentName: "Routine Scaling & Polishing",
    date: "May 01, 2026",
    source: "Website",
    comment:
      "Very thorough deep cleaning with ultrasonic scaler. The hygienist explained every step. The appointment started 10 minutes late due to an emergency trauma case, but the quality of care and sterile measures were exceptional.",
    clinicResponse: {
      responder: "Elite Dental Centre",
      date: "May 02, 2026",
      message:
        "Thank you Usman for your valuable review! We apologize for the brief wait while we accommodated an emergency trauma patient, and we are glad the cleaning met your high standards.",
    },
  },
  {
    id: "fb-6",
    name: "Zainab Noor",
    rating: 5,
    treatmentName: "Cosmetic Veneers",
    date: "May 03, 2026",
    source: "Google",
    comment:
      "Got custom porcelain veneers crafted by the cosmetic specialist. The precision shade matching and artistic attention Dr. Sarah gave was phenomenal. Friends keep complimenting my natural smile!",
    clinicResponse: {
      responder: "Elite Dental Centre",
      date: "May 03, 2026",
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

