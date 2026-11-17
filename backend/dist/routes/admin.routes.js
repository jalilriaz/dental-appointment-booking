"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../lib/prisma"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const googleCalendar_1 = require("../lib/googleCalendar");
const zod_1 = require("zod");
const logger_1 = require("../lib/logger");
const bookingService_1 = require("../lib/bookingService");
const router = (0, express_1.Router)();
const walkInSchema = zod_1.z.object({
    patientId: zod_1.z.string().optional(),
    phone: zod_1.z.string().min(10, 'Phone number must be at least 10 digits').optional(),
    cnic: zod_1.z.string().optional().default(''),
    fullName: zod_1.z.string().optional(),
    age: zod_1.z.number().int().min(1).max(150).optional(),
    date: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
    time: zod_1.z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format (HH:MM)'),
    treatmentId: zod_1.z.string().min(1, 'Treatment is required'),
    patientTreatmentId: zod_1.z.string().optional(),
    notes: zod_1.z.string().optional(),
    doctorId: zod_1.z.string().optional(),
}).superRefine((data, ctx) => {
    if (!data.patientId) {
        if (!data.phone)
            ctx.addIssue({ code: zod_1.z.ZodIssueCode.custom, message: 'Phone is required for new patients', path: ['phone'] });
        if (!data.fullName)
            ctx.addIssue({ code: zod_1.z.ZodIssueCode.custom, message: 'Name is required for new patients', path: ['fullName'] });
        if (!data.age)
            ctx.addIssue({ code: zod_1.z.ZodIssueCode.custom, message: 'Age is required for new patients', path: ['age'] });
    }
});
// GET /api/admin/dashboard - Executive practice telemetry
router.get('/dashboard', auth_middleware_1.requireAuth, (0, auth_middleware_1.requireRole)('ADMIN'), async (_req, res) => {
    try {
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const todayEnd = new Date(todayStart.getTime() + 86400000);
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const [totalPatients, totalAppointments, appointmentsToday, completedAppointments, cancelledAppointments, upcomingAppointments, realizedRevenueAgg, projectedRevenueAgg, monthlyRealizedAgg, todayAppts, recentAppointments,] = await Promise.all([
            prisma_1.default.user.count({ where: { role: 'PATIENT' } }),
            prisma_1.default.appointment.count(),
            prisma_1.default.appointment.count({
                where: {
                    startTime: { gte: todayStart, lt: todayEnd },
                    status: { not: 'CANCELLED' },
                },
            }),
            prisma_1.default.appointment.count({ where: { status: 'COMPLETED' } }),
            prisma_1.default.appointment.count({ where: { status: 'CANCELLED' } }),
            prisma_1.default.appointment.count({
                where: { startTime: { gte: now }, status: 'SCHEDULED' },
            }),
            prisma_1.default.appointment.aggregate({
                _sum: { amountPaid: true },
                where: { status: 'COMPLETED' },
            }),
            prisma_1.default.appointment.aggregate({
                _sum: { price: true },
                where: { status: { in: ['SCHEDULED', 'COMPLETED'] } },
            }),
            prisma_1.default.appointment.aggregate({
                _sum: { amountPaid: true },
                where: { status: 'COMPLETED', startTime: { gte: monthStart } },
            }),
            prisma_1.default.appointment.findMany({
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
            prisma_1.default.appointment.findMany({
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
    }
    catch (error) {
        console.error('Admin dashboard telemetry error:', error);
        return res.status(500).json({ error: 'Failed to fetch admin dashboard telemetry' });
    }
});
// GET /api/admin/search - Global admin search
router.get('/search', auth_middleware_1.requireAuth, (0, auth_middleware_1.requireRole)('ADMIN'), async (req, res) => {
    try {
        const query = req.query.q?.trim();
        if (!query || query.length < 2) {
            return res.json({ results: [] });
        }
        const [users, appointments] = await Promise.all([
            prisma_1.default.user.findMany({
                where: {
                    OR: [
                        { name: { contains: query, mode: 'insensitive' } },
                        { email: { contains: query, mode: 'insensitive' } },
                    ],
                },
                select: { id: true, name: true, email: true, role: true },
                take: 5,
            }),
            prisma_1.default.appointment.findMany({
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
    }
    catch (error) {
        console.error('Search error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});
// GET /api/admin/walk-in/search - Walk-in patient search
router.get('/walk-in/search', auth_middleware_1.requireAuth, (0, auth_middleware_1.requireRole)('ADMIN', 'STAFF'), async (req, res) => {
    try {
        const query = req.query.q?.trim() || '';
        const channel = req.query.channel?.trim() || '';
        const page = Math.max(1, parseInt(req.query.page || '1', 10));
        const limit = 8;
        const skip = (page - 1) * limit;
        const where = { role: 'PATIENT' };
        if (channel && channel !== 'ALL') {
            where.appointments = {
                some: { bookedBy: channel },
            };
        }
        if (query.length >= 2) {
            const conditions = [
                { name: { contains: query, mode: 'insensitive' } },
                { phone: { contains: query, mode: 'insensitive' } },
                { email: { contains: query, mode: 'insensitive' } },
            ];
            // Normalize phone query: if user entered digits e.g. 03xx or +92xx, also search by bare local digits
            const digitsOnly = query.replace(/\D/g, '');
            if (digitsOnly.length >= 4) {
                let localNumber = digitsOnly;
                if (localNumber.startsWith('92') && localNumber.length > 2) {
                    localNumber = localNumber.slice(2);
                }
                else if (localNumber.startsWith('0') && localNumber.length > 1) {
                    localNumber = localNumber.slice(1);
                }
                conditions.push({ phone: { contains: localNumber } });
                conditions.push({ phone: { contains: digitsOnly } });
            }
            const numericQuery = parseInt(query, 10);
            if (!isNaN(numericQuery) && numericQuery > 0 && numericQuery <= 2147483647 && query.length <= 8) {
                conditions.push({ patientCode: numericQuery });
            }
            where.OR = conditions;
        }
        const [patients, total] = await Promise.all([
            prisma_1.default.user.findMany({
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
                            bookedBy: true,
                            treatment: { select: { name: true } },
                        },
                        orderBy: { startTime: 'desc' },
                        take: 3,
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
            prisma_1.default.user.count({ where }),
        ]);
        return res.json({
            patients,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        });
    }
    catch (error) {
        console.error('Walk-in patient search error:', error);
        return res.status(500).json({ error: 'Failed to search patients' });
    }
});
// POST /api/admin/walk-in - Book walk-in appointment
router.post('/walk-in', auth_middleware_1.requireAuth, (0, auth_middleware_1.requireRole)('ADMIN', 'STAFF'), async (req, res) => {
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
        const bookingResult = await (0, bookingService_1.createAppointment)({
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
    }
    catch (error) {
        logger_1.logger.error({ err: error, body }, 'Failed to book walk-in appointment');
        return res.status(500).json({ error: 'Failed to book walk-in appointment' });
    }
});
// POST /api/admin/sync-calendar - Force sync upcoming appointments to Google Calendar
router.post('/sync-calendar', auth_middleware_1.requireAuth, (0, auth_middleware_1.requireRole)('ADMIN', 'STAFF'), async (_req, res) => {
    try {
        const result = await (0, googleCalendar_1.syncUpcomingAppointmentsToGoogleCalendar)();
        return res.json({
            success: true,
            message: `Synced ${result.synced} appointment(s) to Google Calendar.`,
            ...result,
        });
    }
    catch (error) {
        logger_1.logger.error({ err: error }, 'Failed to manual sync to Google Calendar');
        return res.status(500).json({ error: 'Failed to sync Google Calendar' });
    }
});
exports.default = router;
//# sourceMappingURL=admin.routes.js.map