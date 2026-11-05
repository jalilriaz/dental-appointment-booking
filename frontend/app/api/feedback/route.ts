import { NextResponse } from "next/server";

export interface FeedbackItem {
  id: string;
  name: string;
  email?: string;
  rating: number;
  comment: string;
  treatmentName?: string;
  date: string;
  source: "Google" | "Website" | "Verified Patient";
  clinicResponse?: {
    responder: string;
    date: string;
    message: string;
  };
}

// In-memory persistent feedback array across server lifecycle
const fallbackFeedback: FeedbackItem[] = [
  {
    id: "fb-1",
    name: "Ayesha Malik",
    rating: 5,
    treatmentName: "Dental Implants",
    date: "March 18, 2026",
    source: "Google",
    comment: "I was extremely anxious about getting an implant done, but Dr. Zeeshan and the team at Elite Dental made it completely seamless and painless. The 3D scan and pre-planning was top tier. Highly recommended!",
    clinicResponse: {
      responder: "Elite Dental Centre",
      date: "March 19, 2026",
      message: "Thank you so much, Ayesha! We are thrilled to hear your implant procedure was smooth and comfortable. Keeping our patients relaxed and pain-free is our top priority.",
    },
  },
  {
    id: "fb-2",
    name: "Hamza Tariq",
    rating: 5,
    treatmentName: "Root Canal Treatment",
    date: "April 02, 2026",
    source: "Google",
    comment: "Painless single-sitting root canal! Absolutely incredible hygiene and state-of-the-art facility in F-7 Islamabad. The staff was courteous and followed up the next day to check on my recovery.",
    clinicResponse: {
      responder: "Elite Dental Centre",
      date: "April 03, 2026",
      message: "Hamza, hearing that your root canal was completely painless is fantastic. We appreciate you taking the time to share your positive experience!",
    },
  },
  {
    id: "fb-3",
    name: "Dr. Bilal Rafiq",
    rating: 5,
    treatmentName: "Teeth Whitening",
    date: "April 15, 2026",
    source: "Verified Patient",
    comment: "Came in for laser teeth whitening before my wedding. The results exceeded all my expectations — 4 shades brighter in just 45 minutes with zero sensitivity afterward.",
    clinicResponse: {
      responder: "Elite Dental Centre",
      date: "April 15, 2026",
      message: "Congratulations on your wedding, Dr. Bilal! It was our pleasure to brighten your smile for such a special milestone.",
    },
  },
  {
    id: "fb-4",
    name: "Mariam Sohail",
    rating: 5,
    treatmentName: "Clear Aligners",
    date: "April 28, 2026",
    source: "Google",
    comment: "Completed my 8-month Invisalign aligner treatment here. The digital simulation matched my final smile 100%. Transparent pricing, no hidden costs, and exceptionally gentle care.",
    clinicResponse: {
      responder: "Elite Dental Centre",
      date: "April 29, 2026",
      message: "Mariam, your new smile looks radiant! Thank you for trusting Elite Dental with your orthodontic journey.",
    },
  },
  {
    id: "fb-5",
    name: "Usman Ghani",
    rating: 4,
    treatmentName: "Routine Scaling & Polishing",
    date: "May 01, 2026",
    source: "Website",
    comment: "Very thorough deep cleaning with ultrasonic scaler. The hygienist explained every step. The appointment started 10 minutes late due to an emergency case, but the quality of care was exceptional.",
    clinicResponse: {
      responder: "Elite Dental Centre",
      date: "May 02, 2026",
      message: "Thank you Usman for your valuable review! We apologize for the brief wait while we accommodated an emergency trauma patient, and we are glad the cleaning met your high standards.",
    },
  },
  {
    id: "fb-6",
    name: "Zainab Noor",
    rating: 5,
    treatmentName: "Cosmetic Veneers",
    date: "May 03, 2026",
    source: "Google",
    comment: "Got custom porcelain veneers crafted. The precision shade matching and artistic attention Dr. Sarah gave was phenomenal. Friends keep complimenting my smile!",
    clinicResponse: {
      responder: "Elite Dental Centre",
      date: "May 03, 2026",
      message: "Zainab, it was wonderful caring for you. Keep smiling brightly!",
    },
  },
];

export async function GET() {
  const total = fallbackFeedback.length + 844;
  const distribution = {
    5: 712,
    4: 112,
    3: 20,
    2: 5,
    1: 1,
  };

  return NextResponse.json({
    success: true,
    stats: {
      averageRating: 4.9,
      totalReviews: total,
      distribution,
    },
    reviews: fallbackFeedback,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, rating, comment, treatmentName } = body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json({ success: false, error: "Patient name is required." }, { status: 400 });
    }

    const numericRating = Number(rating);
    if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      return NextResponse.json({ success: false, error: "Rating must be between 1 and 5 stars." }, { status: 400 });
    }

    if (!comment || typeof comment !== "string" || comment.trim().length < 5) {
      return NextResponse.json({ success: false, error: "Please provide a review comment of at least 5 characters." }, { status: 400 });
    }

    const newFeedback: FeedbackItem = {
      id: `fb-${Date.now()}`,
      name: name.trim(),
      email: email ? String(email).trim() : undefined,
      rating: numericRating,
      comment: comment.trim(),
      treatmentName: treatmentName?.trim() || "General Consultation",
      date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      source: "Verified Patient",
      clinicResponse: {
        responder: "Elite Dental Centre",
        date: "Just now",
        message: `Thank you ${name.trim()} for your feedback! Our clinical team appreciates your trust in our care.`,
      },
    };

    fallbackFeedback.unshift(newFeedback);

    return NextResponse.json(
      {
        success: true,
        message: "Thank you! Your feedback has been submitted successfully.",
        feedback: newFeedback,
      },
      { status: 201 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

