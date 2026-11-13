import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';
import { requireAuth, requireRole } from '../middleware/auth.middleware';
import { createCalendarEvent } from '../lib/googleCalendar';
import { z } from 'zod';
import { logger } from '../lib/logger';
import { generatePatientCode } from '../lib/patientCode';
import { sendAppointmentConfirmationEmail } from '../lib/email';
import { normalizePhone } from '../lib/phone';
import { isSundayInKarachi, parseKarachiDateTime, getKarachiDayBoundaries } from '../lib/timezone';
import { generateRandomPatientPasswordHash } from '../lib/security';
import { createAppointment } from '../lib/bookingService';

const router = Router();

const walkInSchema = z.object({
    patientId: z.string().optional(),
    phone: z.string().min(10, 'Phone number must be at least 10 digits').optional(),
    cnic: z.string().optional().default(''),
    fullName: z.string().optional(),
    age: z.number().int().min(1).max(150).optional(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
    time: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format (HH:MM)'),
    treatmentId: z.string().min(1, 'Treatment is required'),
    patientTreatmentId: z.string().optional(),
    notes: z.string().optional(),
    doctorId: z.string().optional(),
}).superRefine((data, ctx) => {
    if (!data.patientId) {
        if (!data.phone) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Phone is required for new patients', path: ['phone'] });
        if (!data.fullName) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Name is required for new patients', path: ['fullName'] });
        if (!data.age) ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Age is required for new patients', path: ['age'] });
    }
});

// GET /api/admin/dashboard - Executive practice telemetry
router.get('/dashboard', requireAuth, requireRole('ADMIN'), async (_req: Request, res: Response) => {
    try {
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const todayEnd = new Date(todayStart.getTime() + 86400000);
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

        const [
            totalPatients,
            totalAppointments,
            appointmentsToday,
            completedAppointments,
            cancelledAppointments,
            upcomingAppointments,
            realizedRevenueAgg,
            projectedRevenueAgg,
            monthlyRealizedAgg,
            todayAppts,
            recentAppointments,
        ] = await Promise.all([
            prisma.user.count({ where: { role: 'PATIENT' } }),
            prisma.appointment.count(),
            prisma.appointment.count({
                where: {
                    startTime: { gte: todayStart, lt: todayEnd },
                    status: { not: 'CANCELLED' },
                },
            }),
            prisma.appointment.count({ where: { status: 'COMPLETED' } }),
            prisma.appointment.count({ where: { status: 'CANCELLED' } }),
            prisma.appointment.count({
                where: { startTime: { gte: now }, status: 'SCHEDULED' },
            }),
            prisma.appointment.aggregate({
                _sum: { amountPaid: true },
                where: { status: 'COMPLETED' },
            }),
            prisma.appointment.aggregate({
                _sum: { price: true },
                where: { status: { in: ['SCHEDULED', 'COMPLETED'] } },
            }),
            prisma.appointment.aggregate({
                _sum: { amountPaid: true },
                where: { status: 'COMPLETED', startTime: { gte: monthStart } },
            }),
            prisma.appointment.findMany({
                where: {
                    startTime: { gte: todayStart, lt: todayEnd },
                    status: { not: 'CANCELLED' },
                },
                include: {
                    patient: { select: { name: true, phone: true, medicalAlerts: true } },
                    treatment: { select: { name: true, durationMin: true, price: true } },
                },
                orderBy: { startTime: 'asc' },
            }),
            prisma.appointment.findMany({
                take: 8,
                orderBy: { startTime: 'desc' },
                include: {
                    patient: { select: { name: true, phone: true } },
                    treatment: { select: { name: true, price: true, category: true } },
                },
            }),
        ]);

        return res.json({
            totalPatients,
            totalAppointments,
            appointmentsToday,
            completedAppointments,
            cancelledAppointments,
            upcomingAppointments,
            realizedRevenue: realizedRevenueAgg._sum.amountPaid || 0,
            projectedRevenue: projectedRevenueAgg._sum.price || 0,
            monthRevenue: monthlyRealizedAgg._sum.amountPaid || 0,
            todayAppointments: todayAppts,
            recentAppointments,
        });
    } catch (error) {
        console.error('Admin dashboard telemetry error:', error);
        return res.status(500).json({ error: 'Failed to fetch admin dashboard telemetry' });
    }
});

// GET /api/admin/search - Global admin search
router.get('/search', requireAuth, requireRole('ADMIN'), async (req: Request, res: Response) => {
    try {
        const query = (req.query.q as string)?.trim();
        if (!query || query.length < 2) {
            return res.json({ results: [] });
        }

        const [users, appointments] = await Promise.all([
            prisma.user.findMany({
                where: {
                    OR: [
                        { name: { contains: query, mode: 'insensitive' } },
                        { email: { contains: query, mode: 'insensitive' } },
                    ],
                },
                select: { id: true, name: true, email: true, role: true },
                take: 5,
            }),
            prisma.appointment.findMany({
                where: {
                    OR: [
                        { patient: { name: { contains: query, mode: 'insensitive' } } },
                        { id: { contains: query, mode: 'insensitive' } },
                    ],
                },
                include: {
                    patient: { select: { name: true } },
                    treatment: { select: { name: true } },
                },
                take: 5,
                orderBy: { startTime: 'desc' },
            }),
        ]);

        const results = [
            ...users.map((u) => ({
                id: u.id,
                title: u.name || u.email,
                subtitle: `${u.role} • ${u.email}`,
                type: 'user',
                url: `/admin/${u.role === 'PATIENT' ? 'patients' : 'staff'}`,
            })),
            ...appointments.map((a) => ({
                id: a.id,
                title: `Apt: ${a.patient?.name || 'Unknown'}`,
                subtitle: `${a.treatment.name} • ${new Date(a.startTime).toLocaleDateString()}`,
                type: 'appointment',
                url: `/admin/appointments`,
            })),
        ];

        return res.json({ results });
    } catch (error) {
        console.error('Search error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// GET /api/admin/walk-in/search - Walk-in patient search
router.get('/walk-in/search', requireAuth, requireRole('ADMIN', 'STAFF'), async (req: Request, res: Response) => {
    try {
        const query = (req.query.q as string)?.trim() || '';
        const page = Math.max(1, parseInt((req.query.page as string) || '1', 10));
        const limit = 8;
        const skip = (page - 1) * limit;

        const where: any = { role: 'PATIENT' };
        if (query.length >= 2) {
            const conditions: any[] = [
                { name: { contains: query, mode: 'insensitive' } },
                { phone: { contains: query, mode: 'insensitive' } },
                { email: { contains: query, mode: 'insensitive' } },
            ];
            const numericQuery = parseInt(query, 10);
            if (!isNaN(numericQuery)) {
                conditions.push({ patientCode: numericQuery });
            }
            where.OR = conditions;
        }

        const [patients, total] = await Promise.all([
            prisma.user.findMany({
                where,
                select: {
                    id: true,
                    name: true,
                    phone: true,
                    email: true,
                    patientCode: true,
                    medicalAlerts: true,
                    createdAt: true,
                    _count: {
                        select: { appointments: true },
                    },
                    appointments: {
                        select: {
                            id: true,
                            startTime: true,
                            status: true,
                            treatment: { select: { name: true } },
                        },
                        orderBy: { startTime: 'desc' },
                        take: 1,
                    },
                    patientTreatments: {
                        where: { clinicalStatus: 'IN_PROGRESS' },
                        select: {
                            id: true,
                            treatment: { select: { name: true } },
                            totalSessions: true,
                            appointments: {
                                where: { status: { notIn: ['CANCELLED', 'NO_SHOW'] } },
                                select: { id: true },
                            },
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            prisma.user.count({ where }),
        ]);

        return res.json({
            patients,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        });
    } catch (error) {
        console.error('Walk-in patient search error:', error);
        return res.status(500).json({ error: 'Failed to search patients' });
    }
});

// POST /api/admin/walk-in - Book walk-in appointment
router.post('/walk-in', requireAuth, requireRole('ADMIN', 'STAFF'), async (req: Request, res: Response) => {
    let body = req.body;
    try {
        const validationResult = walkInSchema.safeParse(body);
        if (!validationResult.success) {
            return res.status(400).json({
                error: 'Validation failed',
                details: validationResult.error.format(),
            });
        }

        const { patientId, phone, fullName, age, date, time, treatmentId, patientTreatmentId, notes, doctorId } = validationResult.data;

        const bookingResult = await createAppointment({
            patientId,
            patientName: fullName,
            phone,
            age,
            treatmentId,
            doctorId,
            date,
            time,
            bookedBy: 'WALK_IN',
            patientTreatmentId,
            notes,
        });

        if (!bookingResult.success) {
            return res.status(bookingResult.status || 400).json({
                error: bookingResult.error || 'Failed to book walk-in appointment',
                code: bookingResult.status === 409 ? 'DOUBLE_BOOKING' : undefined,
            });
        }

        return res.status(201).json({
            success: true,
            appointment: bookingResult.appointment,
            patientCode: bookingResult.patientCode,
            message: 'Walk-in appointment booked successfully!',
        });
    } catch (error) {
        logger.error({ err: error, body }, 'Failed to book walk-in appointment');
        return res.status(500).json({ error: 'Failed to book walk-in appointment' });
    }
});

export default router;

