import { Router, Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma';
import { checkRateLimit } from '../lib/rateLimit';

const router = Router();

const feedbackCreateSchema = z.object({
    name: z.string().trim().min(2, 'Patient name must be at least 2 characters.').max(80),
    email: z.string().trim().email('Invalid email address.').optional().or(z.literal('')),
    rating: z.coerce.number().int().min(1, 'Rating must be between 1 and 5 stars.').max(5),
    comment: z.string().trim().min(5, 'Please provide a review comment of at least 5 characters.').max(1000),
    treatmentName: z.string().trim().max(120).optional(),
    appointmentId: z.string().uuid('Invalid appointment reference.').optional(),
});

// GET /api/feedback - Real database patient reviews (no synthetic counts)
router.get('/', async (_req: Request, res: Response) => {
    try {
        const [rows, settings] = await Promise.all([
            prisma.feedback.findMany({
                where: { isPublished: true },
                orderBy: { createdAt: 'desc' },
                take: 50,
            }),
            prisma.systemSettings.findUnique({
                where: { id: 'settings' },
                select: { clinicName: true },
            }),
        ]);

        const clinicLabel = settings?.clinicName || 'Clinic Reception';
        const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } as Record<1 | 2 | 3 | 4 | 5, number>;
        let ratingSum = 0;

        for (const r of rows) {
            const key = Math.min(5, Math.max(1, r.rating)) as 1 | 2 | 3 | 4 | 5;
            distribution[key] += 1;
            ratingSum += r.rating;
        }

        const averageRating = rows.length > 0 ? Number((ratingSum / rows.length).toFixed(1)) : null;

        const formatD = (d: Date) => d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        const reviews = rows.map((r) => ({
            id: r.id,
            name: r.patientName,
            rating: r.rating,
            comment: r.comment,
            treatmentName: r.treatmentName || 'General Consultation',
            date: formatD(r.createdAt),
            source: r.source === 'GOOGLE' ? 'Google' : r.source === 'WEBSITE' ? 'Website' : 'Verified Patient',
            ...(r.clinicResponse && {
                clinicResponse: { responder: clinicLabel, date: formatD(r.respondedAt || r.createdAt), message: r.clinicResponse },
            }),
        }));

        return res.json({
            success: true,
            stats: {
                averageRating,
                totalReviews: rows.length,
                distribution,
            },
            reviews,
        });
    } catch (err) {
        console.error('Fetch feedback error:', err);
        return res.status(500).json({ success: false, error: 'Failed to load reviews' });
    }
});

// POST /api/feedback
router.post('/', async (req: Request, res: Response) => {
    try {
        const rawIp = (req.headers['x-forwarded-for'] as string | undefined)?.split(',')[0]?.trim() || req.ip || 'unknown';
        const rateCheck = checkRateLimit(rawIp, '/api/feedback', { limit: 5, windowMs: 15 * 60 * 1000 });

        Object.entries(rateCheck.headers).forEach(([k, v]) => res.setHeader(k, v));
        if (!rateCheck.success) {
            return res.status(429).json({
                success: false,
                error: 'Too many feedback submissions. Please try again later.',
            });
        }

        const parsed = feedbackCreateSchema.safeParse(req.body);
        if (!parsed.success) {
            const firstErr = Object.values(parsed.error.flatten().fieldErrors).flat()[0] || 'Invalid feedback payload.';
            return res.status(400).json({ success: false, error: firstErr });
        }

        const { name, email, rating, comment, treatmentName, appointmentId } = parsed.data;
        let linkedPatientId: string | null = null;

        if (appointmentId) {
            const completedAppt = await prisma.appointment.findFirst({
                where: { id: appointmentId, status: 'COMPLETED' },
                select: { id: true, patientId: true },
            });
            if (!completedAppt) {
                return res.status(400).json({
                    success: false,
                    error: 'Feedback can only be linked to a completed appointment.',
                });
            }
            linkedPatientId = completedAppt.patientId;
        }

        const created = await prisma.feedback.create({
            data: {
                patientName: name,
                patientEmail: email || null,
                rating,
                comment,
                treatmentName: treatmentName || 'General Consultation',
                appointmentId: appointmentId || null,
                patientId: linkedPatientId,
                source: appointmentId ? 'VERIFIED_PATIENT' : 'WEBSITE',
                isPublished: true,
            },
        });

        return res.status(201).json({
            success: true,
            message: 'Thank you! Your feedback has been submitted successfully.',
            feedback: {
                id: created.id,
                name: created.patientName,
                rating: created.rating,
                comment: created.comment,
                treatmentName: created.treatmentName,
                date: created.createdAt.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
                source: created.source === 'VERIFIED_PATIENT' ? 'Verified Patient' : 'Website',
            },
        });
    } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Internal Server Error';
        return res.status(500).json({ success: false, error: msg });
    }
});

export default router;
