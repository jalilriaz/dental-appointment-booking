import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';
import { z } from 'zod';
import { logger } from '../lib/logger';
import { logAudit } from '../lib/audit';
import { requireAuth, requireRole, optionalAuth } from '../middleware/auth.middleware';
import { createCalendarEvent, updateCalendarEvent, deleteCalendarEvent } from '../lib/googleCalendar';
import { sendAppointmentConfirmationEmail, sendAppointmentRescheduleEmail } from '../lib/email';
import { normalizePhone } from '../lib/phone';
import { isSundayInKarachi, parseKarachiDateTime, getKarachiDayBoundaries } from '../lib/timezone';
import { createAppointment } from '../lib/bookingService';
import { checkDoctorAvailability } from '../lib/doctorAvailability';
import {
    exceedsMaxBookingHorizon,
    hasBufferCollision,
    isOverlappingBreak,
    violatesAdvanceNotice,
} from '../lib/bookingRules';
import { generateRandomPatientPasswordHash } from '../lib/security';
import {
    getPrecautionsForTreatment,
    formatPrecautionsMessage,
    generateWhatsAppDeepLink,
    dispatchN8nPrecautionsWebhook,
} from '../lib/precautions';
import { ALL_TREATMENTS } from '../lib/treatmentsData';

async function resolveTreatment(treatmentId?: string, publicOnly = false) {
    if (!treatmentId) return null;
    const vis = publicOnly
        ? { isActive: true, showOnWeb: true, deletedAt: null }
        : { isActive: true, deletedAt: null };
    let treatment = await prisma.treatment.findFirst({
        where: { id: treatmentId, ...vis },
    });
    if (!treatment) {
        const mock = ALL_TREATMENTS.find((t) => t.id === treatmentId);
        if (mock) {
            treatment = await prisma.treatment.findFirst({
                where: { name: { equals: mock.name, mode: 'insensitive' }, ...vis },
            });
        }
    }
    return treatment;
}

const router = Router();

function buildAppointmentSearchOr(rawQuery: string): any[] {
    const query = rawQuery.trim();
    const orConditions: any[] = [
        { id: { contains: query, mode: 'insensitive' } },
        { guestName: { contains: query, mode: 'insensitive' } },
        { guestPhone: { contains: query, mode: 'insensitive' } },
        { patient: { name: { contains: query, mode: 'insensitive' } } },
        { patient: { phone: { contains: query, mode: 'insensitive' } } },
        { treatment: { name: { contains: query, mode: 'insensitive' } } },
    ];

    const digitsOnly = query.replace(/\D/g, '');
    if (digitsOnly.length >= 4) {
        let localNumber = digitsOnly;
        if (localNumber.startsWith('92') && localNumber.length > 2) {
            localNumber = localNumber.slice(2);
        } else if (localNumber.startsWith('0') && localNumber.length > 1) {
            localNumber = localNumber.slice(1);
        }
        orConditions.push({ guestPhone: { contains: localNumber } });
        orConditions.push({ patient: { phone: { contains: localNumber } } });
    }

    const numericQuery = parseInt(query.replace(/^#/, ''), 10);
    if (!isNaN(numericQuery) && numericQuery > 0 && numericQuery <= 2147483647 && query.length <= 9) {
        orConditions.push({ patient: { patientCode: numericQuery } });
    }

    return orConditions;
}

const bookingSchema = z.object({
    treatmentId: z.string().min(1, 'Treatment ID is required'),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
    time: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format (HH:MM)'),
    notes: z.string().optional(),
    patientId: z.string().optional(),
    newPatient: z.object({
        name: z.string().min(1, 'Name is required'),
        email: z.string().email().optional().or(z.literal('')),
        phone: z.string().min(10, 'Phone number is required'),
        dateOfBirth: z.string().optional(),
    }).optional(),
    guestName: z.string().optional(),
    guestPhone: z.string().optional(),
    guestEmail: z.string().email().optional().or(z.literal('')),
    guestDob: z.string().optional(),
}).superRefine((data, ctx) => {
    if (data.guestName || data.guestPhone || data.guestEmail || data.guestDob) {
        if (!data.guestName) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Guest name is required', path: ['guestName'] });
        }
        if (!data.guestPhone) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Guest phone is required', path: ['guestPhone'] });
        }
    }
});

// GET /api/appointments/availability
router.get('/availability', optionalAuth, async (req: Request, res: Response) => {
    try {
        const { date, treatmentId, excludeAppointmentId } = req.query as {
            date?: string;
            treatmentId?: string;
            excludeAppointmentId?: string;
        };

        if (!date) {
            return res.status(400).json({ error: 'date is required' });
        }

        const settings = await prisma.systemSettings.findUnique({
            where: { id: 'settings' },
        });

        // 1. Check weekly working days
        const weeklyWorkingDays = settings?.weeklyWorkingDays
            ? settings.weeklyWorkingDays.split(',').map((d: string) => d.trim().toLowerCase())
            : ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

        const targetDate = new Date(`${date}T12:00:00+05:00`);
        const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const targetDayName = dayNames[targetDate.getUTCDay()];

        if (!weeklyWorkingDays.includes(targetDayName)) {
            const capitalized = targetDayName.charAt(0).toUpperCase() + targetDayName.slice(1);
            return res.json({ slots: [], dayOff: true, reason: `${capitalized} is a weekly clinic off-day` });
        }

        // 2. Check active clinic holidays & special closures
        const { startOfDay, endOfDay } = getKarachiDayBoundaries(date);
        const holiday = await prisma.clinicHoliday.findFirst({
            where: {
                isActive: true,
                startDate: { lte: endOfDay },
                endDate: { gte: startOfDay },
            },
        });

        if (holiday) {
            return res.json({
                slots: [],
                dayOff: true,
                isHoliday: true,
                holidayTitle: holiday.title,
                reason: `The clinic is closed for ${holiday.title}`,
            });
        }

        const docCheck = await checkDoctorAvailability(date);
        if (!docCheck.available) {
            return res.json({
                slots: [],
                dayOff: true,
                reason: docCheck.reason || 'Doctor is currently unavailable.',
            });
        }

        const maxHorizon = settings?.maxBookingDaysAhead ?? 60;
        if (exceedsMaxBookingHorizon(date, maxHorizon)) {
            return res.json({
                slots: [],
                dayOff: true,
                reason: `Advance booking window is ${maxHorizon} days.`,
            });
        }

        let treatmentDuration = 30;
        if (treatmentId) {
            const publicOnly = !req.user || (req.user.role !== 'ADMIN' && req.user.role !== 'STAFF');
            const treatment = await resolveTreatment(treatmentId, publicOnly);
            if (!treatment) {
                return res.status(404).json({ error: 'Selected treatment is not available' });
            }
            if (treatment.durationMin) treatmentDuration = treatment.durationMin;
        }

        const workStart = settings?.workDayStart || '12:00';
        const workEnd = settings?.workDayEnd || '20:00';
        const slotIncrement = settings?.slotDurationMin || 30;

        const whereClause: any = {
            startTime: { gte: startOfDay, lte: endOfDay },
            status: { notIn: ['CANCELLED'] },
        };

        if (excludeAppointmentId) {
            whereClause.id = { not: excludeAppointmentId };
        }

        const existingAppointments = await prisma.appointment.findMany({
            where: whereClause,
            select: { startTime: true, endTime: true },
        });

        const slots = [];
        const [startH, startM] = workStart.split(':').map(Number);
        const [endH, endM] = workEnd.split(':').map(Number);
        const workStartMin = startH * 60 + startM;
        const workEndMin = endH * 60 + endM;

        const now = new Date();
        const isInternal = Boolean(req.user && ['ADMIN', 'STAFF'].includes(req.user.role));
        const bufferMin = settings?.bufferMin ?? 0;
        const advanceNoticeMin = settings?.advanceNoticeMin ?? 60;

        // Increment through the work day by the slot interval (default 30 min)
        for (let min = workStartMin; min < workEndMin; min += slotIncrement) {
            const slotH = Math.floor(min / 60);
            const slotM = min % 60;
            const slotEndMin = min + treatmentDuration;

            // If the full treatment cannot be completed before closing time or hits break window, omit the slot
            if (slotEndMin > workEndMin) continue;
            if (isOverlappingBreak(min, slotEndMin, settings?.breakStart, settings?.breakEnd)) continue;

            const timeStr = `${slotH.toString().padStart(2, '0')}:${slotM.toString().padStart(2, '0')}`;
            const slotStartTime = parseKarachiDateTime(date, timeStr);
            const slotEndTime = new Date(slotStartTime.getTime() + treatmentDuration * 60000);

            const isOccupied = hasBufferCollision(slotStartTime, slotEndTime, existingAppointments, bufferMin);

            const period = slotH >= 12 ? 'PM' : 'AM';
            const displayH = slotH === 0 ? 12 : slotH > 12 ? slotH - 12 : slotH;
            const label = `${displayH}:${slotM.toString().padStart(2, '0')} ${period}`;

            const endTimeH = Math.floor(slotEndMin / 60);
            const endTimeM = slotEndMin % 60;
            const endPeriod = endTimeH >= 12 ? 'PM' : 'AM';
            const endDisplayH = endTimeH === 0 ? 12 : endTimeH > 12 ? endTimeH - 12 : endTimeH;
            const endLabel = `${endDisplayH}:${endTimeM.toString().padStart(2, '0')} ${endPeriod}`;

            const isPast = slotStartTime.getTime() <= now.getTime();
            const tooSoon = !isInternal && violatesAdvanceNotice(slotStartTime, now, advanceNoticeMin);

            slots.push({
                value: timeStr,
                label,
                endLabel,
                available: !isOccupied && !isPast && !tooSoon,
            });
        }

        return res.json({ slots, dayOff: false });
    } catch (error) {
        console.error('Availability check error:', error);
        return res.status(500).json({ error: 'Failed to check availability' });
    }
});

// GET /api/appointments/today
router.get('/today', requireAuth, requireRole('ADMIN', 'STAFF'), async (_req: Request, res: Response) => {
    try {
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
        const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

        const appointments = await prisma.appointment.findMany({
            where: {
                startTime: { gte: todayStart, lte: todayEnd },
                status: { not: 'CANCELLED' },
            },
            include: {
                patient: {
                    select: {
                        id: true,
                        name: true,
                        phone: true,
                        patientCode: true,
                        gender: true,
                        dateOfBirth: true,
                        medicalAlerts: true,
                        appointments: {
                            where: { status: 'Not_Visited' },
                            select: { id: true },
                        },
                    },
                },
                doctor: {
                    select: { id: true, name: true, role: true, operatory: true },
                },
                treatment: {
                    select: { name: true, durationMin: true, price: true, isMultiSession: true, defaultSessions: true },
                },
                patientTreatment: {
                    select: {
                        id: true,
                        totalCost: true,
                        totalSessions: true,
                        clinicalStatus: true,
                        financialStatus: true,
                        payments: {
                            select: { amount: true, date: true, method: true },
                        },
                    },
                },
            },
            orderBy: { startTime: 'asc' },
        });

        const serialized = appointments.map((a) => ({
            id: a.id,
            startTime: a.startTime.toISOString(),
            endTime: a.endTime.toISOString(),
            status: a.status,
            amountPaid: a.amountPaid,
            price: a.price,
            discount: a.discount,
            bookedBy: a.bookedBy,
            notes: a.notes,
            patient: a.patient
                ? {
                    id: a.patient.id,
                    name: a.patient.name,
                    phone: a.patient.phone,
                    patientCode: a.patient.patientCode,
                    gender: a.patient.gender,
                    dateOfBirth: a.patient.dateOfBirth ? a.patient.dateOfBirth.toISOString() : null,
                    medicalAlerts: a.patient.medicalAlerts,
                    noShowCount: a.patient.appointments.length,
                }
                : null,
            doctor: a.doctor,
            treatment: a.treatment,
            patientTreatment: a.patientTreatment
                ? {
                    id: a.patientTreatment.id,
                    totalCost: a.patientTreatment.totalCost,
                    totalSessions: a.patientTreatment.totalSessions,
                    clinicalStatus: a.patientTreatment.clinicalStatus,
                    financialStatus: a.patientTreatment.financialStatus,
                    payments: a.patientTreatment.payments,
                }
                : null,
            sessionNumber: a.sessionNumber,
            sessionLabel: a.sessionLabel,
            plannedFee: a.plannedFee,
        }));

        return res.json({ appointments: serialized });
    } catch (error) {
        console.error('Fetch today appointments error:', error);
        return res.status(500).json({ error: 'Failed to fetch appointments' });
    }
});

// GET /api/appointments/search - Unified DB search for both Staff and Admin top search bar
router.get('/search', requireAuth, requireRole('ADMIN', 'STAFF'), async (req: Request, res: Response) => {
    try {
        const query = ((req.query.q as string) || '').trim();
        if (query.length < 2) {
            return res.json({ patients: [], appointments: [] });
        }

        const patientOr: any[] = [
            { name: { contains: query, mode: 'insensitive' } },
            { phone: { contains: query, mode: 'insensitive' } },
            { email: { contains: query, mode: 'insensitive' } },
        ];

        const digitsOnly = query.replace(/\D/g, '');
        if (digitsOnly.length >= 4) {
            let localNumber = digitsOnly;
            if (localNumber.startsWith('92') && localNumber.length > 2) {
                localNumber = localNumber.slice(2);
            } else if (localNumber.startsWith('0') && localNumber.length > 1) {
                localNumber = localNumber.slice(1);
            }
            patientOr.push({ phone: { contains: localNumber } });
        }

        const numericQuery = parseInt(query.replace(/^#/, ''), 10);
        if (!isNaN(numericQuery) && numericQuery > 0 && numericQuery <= 2147483647 && query.length <= 9) {
            patientOr.push({ patientCode: numericQuery });
        }

        const [patients, appointments] = await Promise.all([
            prisma.user.findMany({
                where: {
                    role: 'PATIENT',
                    OR: patientOr,
                },
                select: {
                    id: true,
                    name: true,
                    phone: true,
                    patientCode: true,
                },
                take: 5,
                orderBy: { createdAt: 'desc' },
            }),
            prisma.appointment.findMany({
                where: {
                    OR: buildAppointmentSearchOr(query),
                },
                select: {
                    id: true,
                    startTime: true,
                    status: true,
                    guestName: true,
                    guestPhone: true,
                    patient: {
                        select: {
                            id: true,
                            name: true,
                            phone: true,
                            patientCode: true,
                        },
                    },
                    treatment: {
                        select: { name: true },
                    },
                },
                take: 6,
                orderBy: { startTime: 'desc' },
            }),
        ]);

        return res.json({ patients, appointments });
    } catch (error) {
        logger.error({ err: error }, 'Unified appointment/patient search failed');
        return res.status(500).json({ error: 'Failed to search records' });
    }
});

// GET /api/appointments
router.get('/', requireAuth, requireRole('ADMIN', 'STAFF'), async (req: Request, res: Response) => {
    try {
        const { status, dateFrom, dateTo, search } = req.query as {
            status?: string;
            dateFrom?: string;
            dateTo?: string;
            search?: string;
        };

        const where: any = {};
        if (status) where.status = status;
        if (search && search.trim()) {
            where.OR = buildAppointmentSearchOr(search);
        }
        if (dateFrom || dateTo) {
            where.startTime = {};
            if (dateFrom) where.startTime.gte = new Date(dateFrom);
            if (dateTo) where.startTime.lte = new Date(dateTo + 'T23:59:59');
        }

        const appointments = await prisma.appointment.findMany({
            where,
            include: {
                patient: { select: { id: true, name: true, email: true, phone: true } },
                treatment: { select: { id: true, name: true, price: true, durationMin: true } },
            },
            orderBy: { startTime: 'desc' },
        });

        return res.json({ appointments });
    } catch (error) {
        logger.error({ err: error }, 'Failed to fetch appointments');
        return res.status(500).json({ error: 'Failed to fetch appointments' });
    }
});

// POST /api/appointments
router.post('/', optionalAuth, async (req: Request, res: Response) => {
    let body = req.body;
    try {
        const session = req.user;
        const bookerRole = session?.role;
        let patientId = session?.id;

        const validationResult = bookingSchema.safeParse(body);
        if (!validationResult.success) {
            return res.status(400).json({
                error: 'Validation failed',
                details: validationResult.error.format(),
            });
        }

        const { treatmentId, date, time, notes, newPatient, guestName, guestPhone, guestEmail, guestDob } =
            validationResult.data;

        if (
            bookerRole !== 'ADMIN' &&
            bookerRole !== 'STAFF' &&
            (validationResult.data.patientId || body?.patientId !== undefined || newPatient)
        ) {
            return res.status(403).json({
                error: 'Forbidden: Unauthenticated or patient callers cannot specify patientId or newPatient',
            });
        }

        if (!session && (!guestName || !guestPhone)) {
            return res.status(400).json({ error: 'Name and phone number are required to book' });
        }

        if (bookerRole === 'STAFF' || bookerRole === 'ADMIN') {
            if (validationResult.data.patientId) {
                patientId = validationResult.data.patientId;
            }
            if (!patientId && !newPatient) {
                return res.status(400).json({ error: 'Patient ID or New Patient details required' });
            }
        }

        let bookedBy: 'WEBSITE' | 'WALK_IN' | 'WHATSAPP_BOT' = 'WEBSITE';
        if (bookerRole === 'STAFF' || bookerRole === 'ADMIN') {
            bookedBy = body.bookedBy || 'WALK_IN';
        }

        const bookingResult = await createAppointment({
            patientId,
            patientName: newPatient?.name || guestName,
            phone: newPatient?.phone || guestPhone,
            email: newPatient?.email || guestEmail,
            dateOfBirth: newPatient?.dateOfBirth || guestDob,
            guestName,
            guestPhone,
            guestEmail,
            guestDob,
            treatmentId,
            doctorId: body.doctorId,
            date,
            time,
            bookedBy,
            notes,
            isEmergency: (bookerRole === 'STAFF' || bookerRole === 'ADMIN') ? Boolean(body.isEmergency) : false,
        });

        if (!bookingResult.success) {
            return res.status(bookingResult.status || 400).json({
                error: bookingResult.error || 'Failed to book appointment',
                code: bookingResult.status === 409 ? 'DOUBLE_BOOKING' : undefined,
            });
        }

        return res.status(201).json({
            success: true,
            appointment: bookingResult.appointment,
            patientCode: bookingResult.patientCode,
            message: 'Appointment booked successfully!',
        });
    } catch (error) {
        logger.error({ err: error, body }, 'Failed to book appointment');
        return res.status(500).json({ error: 'Failed to book appointment' });
    }
});

// GET /api/appointments/:id
router.get('/:id', requireAuth, async (req: Request, res: Response) => {
    try {
        const userRole = req.user?.role;
        const isClinicStaff = userRole === 'ADMIN' || userRole === 'STAFF';

        const appointment = await prisma.appointment.findUnique({
            where: { id: req.params.id },
            include: {
                treatment: true,
                patient: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                        patientCode: true,
                        gender: true,
                        dateOfBirth: true,
                        ...(isClinicStaff ? { medicalAlerts: true } : {}),
                    },
                },
                ...(isClinicStaff ? { clinicalNotes: { orderBy: { createdAt: 'desc' } } } : {}),
            },
        });
        if (!appointment) {
            return res.status(404).json({ error: 'Appointment not found' });
        }

        if (!isClinicStaff && appointment.patientId !== req.user?.id) {
            return res.status(403).json({ error: 'Forbidden: You may only view your own appointments' });
        }

        return res.json({ appointment });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch appointment' });
    }
});

// PATCH /api/appointments/:id/status
router.patch('/:id/status', requireAuth, requireRole('ADMIN', 'STAFF'), async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status, amountPaid, price, discount } = req.body;

        const validStatuses = ['SCHEDULED', 'ARRIVED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'Not_Visited', 'RESCHEDULED'];
        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({
                error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
            });
        }

        const existingAppointment = await prisma.appointment.findUnique({
            where: { id },
            select: { status: true, patientId: true, startTime: true, endTime: true },
        });

        if (!existingAppointment) {
            return res.status(404).json({ error: 'Appointment not found' });
        }

        const allowedTransitions: Record<string, string[]> = {
            SCHEDULED: ['ARRIVED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'Not_Visited', 'RESCHEDULED'],
            RESCHEDULED: ['ARRIVED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'Not_Visited', 'RESCHEDULED'],
            ARRIVED: ['IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'Not_Visited', 'SCHEDULED'],
            IN_PROGRESS: ['COMPLETED', 'CANCELLED', 'Not_Visited'],
            COMPLETED: ['COMPLETED'],
            CANCELLED: ['SCHEDULED'],
            Not_Visited: ['SCHEDULED', 'RESCHEDULED'],
        };
        const allowed = allowedTransitions[existingAppointment.status] || [];
        if (status !== existingAppointment.status && !allowed.includes(status)) {
            return res.status(400).json({
                error: `Cannot transition appointment from ${existingAppointment.status} to ${status}`,
            });
        }

        let updateData: any = {
            status,
            amountPaid: status === 'COMPLETED' ? (amountPaid ?? 0) : 0,
            price: price !== undefined ? price : undefined,
            discount: discount !== undefined ? discount : undefined,
        };

        if (status === 'COMPLETED') {
            const todayEnd = new Date();
            todayEnd.setHours(23, 59, 59, 999);
            if (existingAppointment.startTime > todayEnd) {
                return res.status(400).json({
                    error: 'Cannot check out a future appointment. Please book a new appointment for today instead.',
                });
            }
        }

        const appointment = await prisma.appointment.update({
            where: { id },
            data: updateData,
            include: {
                treatment: { select: { name: true, price: true } },
                patient: { select: { name: true } },
            },
        });

        if (status === 'Not_Visited' && existingAppointment.status !== 'Not_Visited') {
            await prisma.user.update({
                where: { id: existingAppointment.patientId },
                data: { noShowCount: { increment: 1 } } as any,
            });
        } else if (existingAppointment.status === 'Not_Visited' && status !== 'Not_Visited') {
            await prisma.user.update({
                where: { id: existingAppointment.patientId },
                data: { noShowCount: { decrement: 1 } } as any,
            });
        }

        if (appointment.googleEventId) {
            (async () => {
                try {
                    if (status === 'CANCELLED' || status === 'Not_Visited') {
                        await deleteCalendarEvent(appointment.googleEventId!);
                    } else if (status === 'COMPLETED') {
                        await updateCalendarEvent({
                            eventId: appointment.googleEventId!,
                            summary: `✅ ${appointment.treatment.name} — ${appointment.patient?.name || 'Patient'} (Completed)`,
                            description: `Treatment: ${appointment.treatment.name}\nStatus: COMPLETED\nAmount Paid Today: Rs. ${(appointment.amountPaid ?? 0).toLocaleString('en-PK')}`,
                            startTime: appointment.startTime,
                            endTime: appointment.endTime,
                            patientName: appointment.patient?.name || 'Patient',
                        });
                    }
                } catch (syncError) {
                    console.error('Google Calendar sync error:', syncError);
                }
            })();
        }

        if (req.user) {
            await logAudit({
                userId: req.user.id,
                action: status === 'CANCELLED' ? 'CANCEL_APPOINTMENT' : `APPOINTMENT_${status}`,
                entity: 'Appointment',
                entityId: id,
                details: {
                    previousStatus: existingAppointment.status,
                    newStatus: status,
                    amountPaid: appointment.amountPaid,
                    discount: appointment.discount,
                },
                ipAddress: (req.headers['x-forwarded-for'] as string | undefined)?.split(',')[0]?.trim() || req.ip,
            });
        }

        return res.json({
            success: true,
            appointment,
            message: status === 'COMPLETED'
                ? `Patient checked out — Rs. ${(appointment.amountPaid ?? 0).toLocaleString('en-PK')} recorded`
                : `Appointment marked as ${status}`,
        });
    } catch (error) {
        console.error('Update appointment status error:', error);
        return res.status(500).json({ error: 'Failed to update status' });
    }
});

// PATCH /api/appointments/:id/reschedule
router.patch('/:id/reschedule', requireAuth, requireRole('ADMIN', 'STAFF'), async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { date, time, cancel } = req.body;

        const existingApt = await prisma.appointment.findUnique({
            where: { id },
            include: {
                treatment: { select: { id: true, name: true, durationMin: true } },
                patient: { select: { name: true, phone: true, email: true } },
            },
        });

        if (!existingApt) {
            return res.status(404).json({ error: 'Appointment not found' });
        }

        if (cancel === true) {
            const updatedApt = await prisma.appointment.update({
                where: { id },
                data: { status: 'CANCELLED' },
                include: {
                    treatment: { select: { name: true } },
                    patient: { select: { name: true } },
                },
            });

            if (updatedApt.googleEventId) {
                deleteCalendarEvent(updatedApt.googleEventId).catch((err) =>
                    console.error('Calendar delete error:', err)
                );
            }

            if (req.user) {
                await logAudit({
                    userId: req.user.id,
                    action: 'CANCEL_APPOINTMENT',
                    entity: 'Appointment',
                    entityId: id,
                    details: { previousStatus: existingApt.status },
                    ipAddress: (req.headers['x-forwarded-for'] as string | undefined)?.split(',')[0]?.trim() || req.ip,
                });
            }

            return res.json({
                success: true,
                appointment: updatedApt,
                message: 'Appointment cancelled successfully',
            });
        }

        if (!date || !time) {
            return res.status(400).json({ error: 'Date and time are required for rescheduling' });
        }

        const selectedDate = new Date(date);
        const todaySearch = new Date();
        todaySearch.setHours(0, 0, 0, 0);

        if (selectedDate < todaySearch) {
            return res.status(400).json({ error: 'Cannot reschedule to a past date' });
        }

        if (selectedDate.getDay() === 0) {
            return res.status(400).json({
                error: 'Sunday is a clinic off day. Please select another date.',
            });
        }

        if (existingApt.status === 'CANCELLED') {
            return res.status(400).json({ error: 'Cannot reschedule a cancelled appointment' });
        }

        const docCheck = await checkDoctorAvailability(date, existingApt.doctorId);
        if (!docCheck.available) {
            return res.status(400).json({ error: docCheck.reason || 'Doctor is unavailable on this date' });
        }

        const [timeH, timeM] = time.split(':').map(Number);
        const newStartTime = new Date(date);
        newStartTime.setHours(timeH, timeM, 0, 0);

        const newEndTime = new Date(newStartTime);
        newEndTime.setMinutes(newEndTime.getMinutes() + existingApt.treatment.durationMin);

        const conflict = await prisma.appointment.findFirst({
            where: {
                id: { not: id },
                status: { notIn: ['CANCELLED'] },
                AND: [
                    { startTime: { lt: newEndTime } },
                    { endTime: { gt: newStartTime } },
                ],
            },
        });

        if (conflict) {
            return res.status(409).json({
                error: 'This time slot is no longer available. Please select another time.',
                code: 'DOUBLE_BOOKING',
            });
        }

        const updatedApt = await prisma.appointment.update({
            where: { id },
            data: {
                startTime: newStartTime,
                endTime: newEndTime,
                status: 'RESCHEDULED',
            },
            include: {
                treatment: { select: { name: true, durationMin: true } },
                patient: { select: { name: true, phone: true, email: true } },
            },
        });

        // Google Calendar sync
        (async () => {
            try {
                if (updatedApt.googleEventId) {
                    await updateCalendarEvent({
                        eventId: updatedApt.googleEventId,
                        summary: `${updatedApt.treatment.name} — ${updatedApt.patient.name} (Rescheduled)`,
                        description: `Treatment: ${updatedApt.treatment.name}\nDuration: ${updatedApt.treatment.durationMin} min\nStatus: RESCHEDULED`,
                        startTime: newStartTime,
                        endTime: newEndTime,
                        patientName: updatedApt.patient.name || 'Patient',
                    });
                } else {
                    const newEventId = await createCalendarEvent({
                        summary: `${updatedApt.treatment.name} — ${updatedApt.patient.name} (Rescheduled)`,
                        description: `Treatment: ${updatedApt.treatment.name}\nDuration: ${updatedApt.treatment.durationMin} min\nStatus: RESCHEDULED`,
                        startTime: newStartTime,
                        endTime: newEndTime,
                        patientName: updatedApt.patient.name || 'Patient',
                    });
                    if (newEventId) {
                        await prisma.appointment.update({
                            where: { id: updatedApt.id },
                            data: { googleEventId: newEventId },
                        });
                    }
                }
            } catch (syncError) {
                console.error('Google Calendar sync error:', syncError);
            }
        })();

        const emailToNotify = updatedApt.patient.email;
        if (emailToNotify) {
            const formattedDate = newStartTime.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
            const formattedTime = newStartTime.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
            });

            sendAppointmentRescheduleEmail(
                emailToNotify,
                updatedApt.patient.name,
                updatedApt.treatment.name,
                formattedDate,
                formattedTime
            ).catch((err) => console.error('Failed to send reschedule email:', err));
        }

        if (req.user) {
            await logAudit({
                userId: req.user.id,
                action: 'RESCHEDULE_APPOINTMENT',
                entity: 'Appointment',
                entityId: id,
                details: {
                    previousStartTime: existingApt.startTime.toISOString(),
                    newStartTime: newStartTime.toISOString(),
                },
                ipAddress: (req.headers['x-forwarded-for'] as string | undefined)?.split(',')[0]?.trim() || req.ip,
            });
        }

        return res.json({
            success: true,
            appointment: updatedApt,
            message: `Appointment rescheduled to ${newStartTime.toLocaleDateString()} at ${newStartTime.toLocaleTimeString()}`,
        });
    } catch (error: any) {
        const isOverlapExclusion =
            error?.code === '23P01' ||
            error?.meta?.code === '23P01' ||
            String(error?.message || '').includes('Appointment_no_overlap_active');
        if (isOverlapExclusion) {
            return res.status(409).json({
                error: 'This time slot is already booked. Please choose another time.',
            });
        }
        console.error('Reschedule appointment error:', error);
        return res.status(500).json({
            error: error instanceof Error ? error.message : 'Failed to process appointment update',
        });
    }
});

// GET /api/appointments/:id/notes
router.get('/:id/notes', requireAuth, requireRole('ADMIN', 'STAFF'), async (req: Request, res: Response) => {
    try {
        const notes = await prisma.clinicalNote.findMany({
            where: { appointmentId: req.params.id },
            orderBy: { createdAt: 'desc' },
        });
        return res.json({ notes });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch notes' });
    }
});

// POST /api/appointments/:id/notes
router.post('/:id/notes', requireAuth, requireRole('ADMIN'), async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { diagnosis, treatmentDone, prescription, remarks, odontogramData } = req.body;

        if (!treatmentDone?.trim()) {
            return res.status(400).json({ error: 'Treatment done is required' });
        }

        const appointment = await prisma.appointment.findUnique({
            where: { id },
            select: { patientId: true },
        });

        if (!appointment) {
            return res.status(404).json({ error: 'Appointment not found' });
        }

        const note = await prisma.clinicalNote.create({
            data: {
                appointmentId: id,
                diagnosis: diagnosis?.trim() || null,
                treatmentDone: treatmentDone.trim(),
                prescription: prescription?.trim() || null,
                remarks: remarks?.trim() || null,
                odontogramData: odontogramData ? odontogramData : undefined,
            },
        });

        return res.status(201).json({ note });
    } catch (error) {
        console.error('Create clinical note error:', error);
        return res.status(500).json({ error: 'Failed to create note' });
    }
});

// GET /api/appointments/:id/send-precautions
router.get('/:id/send-precautions', requireAuth, requireRole('ADMIN', 'STAFF'), async (req: Request, res: Response) => {
    try {
        const appointment = await prisma.appointment.findUnique({
            where: { id: req.params.id },
            include: {
                patient: { select: { id: true, name: true, phone: true } },
                treatment: { select: { id: true, name: true, instructions: true } },
            },
        });

        if (!appointment) {
            return res.status(404).json({ error: 'Appointment not found' });
        }

        const patientName = appointment.patient?.name || appointment.guestName || 'Valued Patient';
        const patientPhone = appointment.patient?.phone || appointment.guestPhone;

        if (!patientPhone) {
            return res.status(400).json({ error: 'No WhatsApp/phone number recorded for this patient' });
        }

        const precautionsList = getPrecautionsForTreatment(
            appointment.treatment.name,
            appointment.treatment.instructions
        );

        const message = formatPrecautionsMessage({
            patientName,
            treatmentName: appointment.treatment.name,
            precautions: precautionsList,
            doctorName: 'Attending Dentist',
        });

        const whatsappUrl = generateWhatsAppDeepLink(patientPhone, message);

        return res.json({
            success: true,
            patientName,
            patientPhone,
            treatmentName: appointment.treatment.name,
            precautions: precautionsList,
            message,
            whatsappUrl,
            n8nConfigured: Boolean(process.env.N8N_WEBHOOK_URL),
        });
    } catch (error) {
        console.error('Failed to load precautions preview:', error);
        return res.status(500).json({ error: 'Failed to load precautions preview' });
    }
});

// POST /api/appointments/:id/send-precautions
router.post('/:id/send-precautions', requireAuth, requireRole('ADMIN', 'STAFF'), async (req: Request, res: Response) => {
    try {
        const appointment = await prisma.appointment.findUnique({
            where: { id: req.params.id },
            include: {
                patient: { select: { id: true, name: true, phone: true } },
                treatment: { select: { id: true, name: true, instructions: true } },
            },
        });

        if (!appointment) {
            return res.status(404).json({ error: 'Appointment not found' });
        }

        const patientName = appointment.patient?.name || appointment.guestName || 'Valued Patient';
        const patientPhone = appointment.patient?.phone || appointment.guestPhone;

        if (!patientPhone) {
            return res.status(400).json({ error: 'No phone number found' });
        }

        const precautionsList = getPrecautionsForTreatment(
            appointment.treatment.name,
            appointment.treatment.instructions
        );

        const message = formatPrecautionsMessage({
            patientName,
            treatmentName: appointment.treatment.name,
            precautions: precautionsList,
            doctorName: 'Attending Dentist',
        });

        const result = await dispatchN8nPrecautionsWebhook({
            patientName,
            phone: patientPhone,
            treatmentName: appointment.treatment.name,
            precautions: precautionsList,
            message,
            appointmentId: appointment.id,
        });

        return res.json({
            success: true,
            n8nDispatched: result.success,
            n8nError: result.error,
            dispatched: result,
            patientPhone,
        });
    } catch (error) {
        console.error('Failed to send precautions:', error);
        return res.status(500).json({ error: 'Failed to dispatch precautions' });
    }
});

// PATCH /api/appointments/:id/payment (Deprecated stub)
router.patch('/:id/payment', (_req: Request, res: Response) => {
    return res.status(410).json({
        error: 'Payment status tracking has been removed from this version.',
    });
});

export default router;
