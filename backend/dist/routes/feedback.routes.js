"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const fallbackFeedback = [
    {
        id: 'fb-1',
        name: 'Ayesha Malik',
        rating: 5,
        treatmentName: 'Dental Implants',
        date: 'March 18, 2026',
        source: 'Google',
        comment: 'I was extremely anxious about getting an implant done, but Dr. Sheriyaar and the team made it completely seamless and painless. The 3D scan and pre-planning was top tier. Highly recommended!',
        clinicResponse: {
            responder: 'Dr. Sheriyaar Dental Care',
            date: 'March 19, 2026',
            message: 'Thank you so much, Ayesha! We are thrilled to hear your implant procedure was smooth and comfortable.',
        },
    },
    {
        id: 'fb-2',
        name: 'Hamza Tariq',
        rating: 5,
        treatmentName: 'Root Canal Treatment',
        date: 'April 02, 2026',
        source: 'Google',
        comment: 'Painless single-sitting root canal! Absolutely incredible hygiene and state-of-the-art facility. The staff was courteous and followed up the next day.',
        clinicResponse: {
            responder: 'Dr. Sheriyaar Dental Care',
            date: 'April 03, 2026',
            message: 'Hamza, hearing that your root canal was completely painless is fantastic. We appreciate your feedback!',
        },
    },
    {
        id: 'fb-3',
        name: 'Dr. Bilal Rafiq',
        rating: 5,
        treatmentName: 'Teeth Whitening',
        date: 'April 15, 2026',
        source: 'Verified Patient',
        comment: 'Came in for laser teeth whitening before my wedding. The results exceeded all my expectations — 4 shades brighter in just 45 minutes.',
        clinicResponse: {
            responder: 'Dr. Sheriyaar Dental Care',
            date: 'April 15, 2026',
            message: 'Congratulations on your wedding, Dr. Bilal! It was our pleasure to brighten your smile.',
        },
    },
];
// GET /api/feedback
router.get('/', (_req, res) => {
    const total = fallbackFeedback.length + 844;
    const distribution = {
        5: 712,
        4: 112,
        3: 20,
        2: 5,
        1: 1,
    };
    return res.json({
        success: true,
        stats: {
            averageRating: 4.9,
            totalReviews: total,
            distribution,
        },
        reviews: fallbackFeedback,
    });
});
// POST /api/feedback
router.post('/', (req, res) => {
    try {
        const { name, email, rating, comment, treatmentName } = req.body;
        if (!name || typeof name !== 'string' || name.trim().length === 0) {
            return res.status(400).json({ success: false, error: 'Patient name is required.' });
        }
        const numericRating = Number(rating);
        if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
            return res.status(400).json({ success: false, error: 'Rating must be between 1 and 5 stars.' });
        }
        if (!comment || typeof comment !== 'string' || comment.trim().length < 5) {
            return res.status(400).json({ success: false, error: 'Please provide a review comment of at least 5 characters.' });
        }
        const newFeedback = {
            id: `fb-${Date.now()}`,
            name: name.trim(),
            email: email ? String(email).trim() : undefined,
            rating: numericRating,
            comment: comment.trim(),
            treatmentName: treatmentName?.trim() || 'General Consultation',
            date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
            source: 'Verified Patient',
            clinicResponse: {
                responder: 'Dr. Sheriyaar Dental Care',
                date: 'Just now',
                message: `Thank you ${name.trim()} for your feedback! Our clinical team appreciates your trust.`,
            },
        };
        fallbackFeedback.unshift(newFeedback);
        return res.status(201).json({
            success: true,
            message: 'Thank you! Your feedback has been submitted successfully.',
            feedback: newFeedback,
        });
    }
    catch (err) {
        return res.status(500).json({ success: false, error: err?.message || 'Internal Server Error' });
    }
});
exports.default = router;
//# sourceMappingURL=feedback.routes.js.map