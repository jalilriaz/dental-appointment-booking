import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';
import { requireAuth, requireRole, optionalAuth } from '../middleware/auth.middleware';
import { logAudit } from '../lib/audit';
import { z } from 'zod';
import { logger } from '../lib/logger';

const router = Router();

const DEFAULT_PUBLIC_SETTINGS = {
    clinicName: 'Elite Dental & Aesthetic Centre',
    clinicAddress: 'Office# 6, 1st Floor, Doctors Plaza, G-8 Markaz (next to IDC), Islamabad',
    landlinePhone: '051-2340093',
    mobilePhone: '0303-5080011',
    whatsappNumber: '+92 314 5475528',
    clinicEmail: 'info@elitedental.com',
    pmdcRegNumber: '',
    workDayStart: '12:00',
    workDayEnd: '20:00',
    slotDurationMin: 30,
    weeklyWorkingDays: 'Monday,Tuesday,Wednesday,Thursday,Friday,Saturday',
};

function pickPublicSettings(settings: any) {
    if (!settings) return DEFAULT_PUBLIC_SETTINGS;
    return {
        clinicName: settings.clinicName,
        clinicAddress: settings.clinicAddress,
        landlinePhone: settings.landlinePhone,
        mobilePhone: settings.mobilePhone,
        whatsappNumber: settings.whatsappNumber,
        clinicEmail: settings.clinicEmail,
        pmdcRegNumber: settings.pmdcRegNumber,
        workDayStart: settings.workDayStart,
        workDayEnd: settings.workDayEnd,
        slotDurationMin: settings.slotDurationMin,
        weeklyWorkingDays: settings.weeklyWorkingDays,
        breakStart: settings.breakStart ?? null,
        breakEnd: settings.breakEnd ?? null,
        bufferMin: settings.bufferMin ?? 0,
        advanceNoticeMin: settings.advanceNoticeMin ?? 60,
        maxBookingDaysAhead: settings.maxBookingDaysAhead ?? 60,
        cancellationCutoffHours: settings.cancellationCutoffHours ?? 12,
        publicContent: settings.publicContent ?? null,
    };
}

const PUBLIC_HOLIDAY_SELECT = {
    id: true,
    title: true,
    startDate: true,
    endDate: true,
    showOnWeb: true,
    isActive: true,
};

const settingsSchema = z.object({
    clinicName: z.string().min(1).max(150).optional(),
    clinicAddress: z.string().min(1).max(300).optional(),
    landlinePhone: z.string().max(50).optional(),
    mobilePhone: z.string().max(50).optional(),
    whatsappNumber: z.string().max(50).optional(),
    clinicEmail: z.string().email().optional().or(z.literal('')),
    pmdcRegNumber: z.string().max(50).optional(),
    receiptFooter: z.string().max(500).optional(),
    workDayStart: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format').optional(),
    workDayEnd: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format').optional(),
    slotDurationMin: z.number().int().min(5).max(120).optional().or(z.string().regex(/^\d+$/).transform(Number).optional()),
    weeklyWorkingDays: z.string().optional(),
    breakStart: z.string().regex(/^\d{2}:\d{2}$/).optional().or(z.literal('')).nullable(),
    breakEnd: z.string().regex(/^\d{2}:\d{2}$/).optional().or(z.literal('')).nullable(),
    bufferMin: z.coerce.number().int().min(0).max(120).optional(),
    advanceNoticeMin: z.coerce.number().int().min(0).max(10080).optional(),
    maxBookingDaysAhead: z.coerce.number().int().min(1).max(365).optional(),
    cancellationCutoffHours: z.coerce.number().int().min(0).max(168).optional(),
    publicContent: z.record(z.string(), z.unknown()).optional().nullable(),
});

const holidaySchema = z.object({
    title: z.string().min(2, 'Holiday title is required'),
    startDate: z.string().min(10, 'Start date is required'),
    endDate: z.string().min(10, 'End date is required'),
    reason: z.string().optional().nullable(),
    showOnWeb: z.boolean().optional().default(true),
    isActive: z.boolean().optional().default(true),
});

// GET /api/settings/public - Publicly accessible settings & active holidays for website/booking
router.get('/public', async (_req: Request, res: Response) => {
    try {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const [settings, activeHolidays, leadDoctor] = await Promise.all([
            prisma.systemSettings.findUnique({ where: { id: 'settings' } }),
            prisma.clinicHoliday.findMany({
                where: { isActive: true, showOnWeb: true, endDate: { gte: todayStart } },
                select: PUBLIC_HOLIDAY_SELECT,
                orderBy: { startDate: 'asc' },
            }),
            prisma.doctor.findFirst({
                where: { isActive: true },
                orderBy: { createdAt: 'asc' },
                select: { name: true, role: true, operatory: true, pmdcReg: true, image: true },
            }),
        ]);

        return res.json({
            success: true,
            settings: pickPublicSettings(settings),
            activeHolidays,
            doctor: leadDoctor || {
                name: 'Attending Dentist',
                role: 'Dental Surgeon',
                operatory: 'Main Operatory',
                pmdcReg: settings?.pmdcRegNumber || '',
                image: null,
            },
        });
    } catch (error) {
        logger.error({ err: error }, 'Failed to fetch public settings');
        return res.status(500).json({ error: 'Failed to fetch settings' });
    }
});

// GET /api/settings - Full settings for ADMIN/STAFF; public-safe fields only for unauthenticated/PATIENT callers
router.get('/', optionalAuth, async (req: Request, res: Response) => {
    try {
        const isClinicStaff = req.user && ['ADMIN', 'STAFF'].includes(req.user.role);

        let settings = await prisma.systemSettings.findUnique({
            where: { id: 'settings' },
        });

        if (!isClinicStaff) {
            const todayStart = new Date();
            todayStart.setHours(0, 0, 0, 0);

            const publicHolidays = await prisma.clinicHoliday.findMany({
                where: {
                    isActive: true,
                    showOnWeb: true,
                    endDate: { gte: todayStart },
                },
                select: PUBLIC_HOLIDAY_SELECT,
                orderBy: { startDate: 'asc' },
            });

            return res.json({
                settings: pickPublicSettings(settings),
                holidays: publicHolidays,
            });
        }

        if (!settings) {
            settings = await prisma.systemSettings.create({
                data: {
                    id: 'settings',
                    ...DEFAULT_PUBLIC_SETTINGS,
                    receiptFooter: 'Thank you for trusting Elite Dental & Aesthetic Centre. Valid for clinical record & tax submission.',
                },
            });
        }

        const holidays = await prisma.clinicHoliday.findMany({
            orderBy: { startDate: 'desc' },
        });

        return res.json({ settings, holidays });
    } catch (error) {
        logger.error({ err: error }, 'Failed to fetch settings');
        return res.status(500).json({ error: 'Failed to fetch settings' });
    }
});

// PUT /api/settings - Update settings (Admin only)
router.put('/', requireAuth, requireRole('ADMIN'), async (req: Request, res: Response) => {
    try {
        const parseResult = settingsSchema.safeParse(req.body);
        if (!parseResult.success) {
            return res.status(400).json({
                error: 'Invalid data format',
                details: parseResult.error.flatten().fieldErrors,
            });
        }

        const data = parseResult.data;

        const { publicContent, ...scalarSettings } = data;
        const settings = await prisma.systemSettings.upsert({
            where: { id: 'settings' },
            update: {
                ...scalarSettings,
                ...(publicContent !== undefined && publicContent !== null ? { publicContent: publicContent as object } : {}),
                slotDurationMin: data.slotDurationMin !== undefined ? Number(data.slotDurationMin) : undefined,
            },
            create: {
                id: 'settings',
                clinicName: data.clinicName || 'Elite Dental & Aesthetic Centre',
                clinicAddress: data.clinicAddress || 'Office# 6, 1st Floor, Doctors Plaza, G-8 Markaz (next to IDC), Islamabad',
                landlinePhone: data.landlinePhone || '051-2340093',
                mobilePhone: data.mobilePhone || '0303-5080011',
                whatsappNumber: data.whatsappNumber || '+92 314 5475528',
                clinicEmail: data.clinicEmail || 'info@elitedental.com',
                pmdcRegNumber: data.pmdcRegNumber || '',
                receiptFooter: data.receiptFooter || 'Thank you for trusting Elite Dental & Aesthetic Centre. Valid for clinical record & tax submission.',
                workDayStart: data.workDayStart || '12:00',
                workDayEnd: data.workDayEnd || '20:00',
                slotDurationMin: data.slotDurationMin ? Number(data.slotDurationMin) : 30,
                weeklyWorkingDays: data.weeklyWorkingDays || 'Monday,Tuesday,Wednesday,Thursday,Friday,Saturday',
            },
        });

        if (req.user) {
            logger.info({ adminId: req.user.id, action: 'update_system_settings' }, 'Admin updated global system settings');
            await logAudit({
                userId: req.user.id,
                action: 'UPDATE_SETTINGS',
                entity: 'SystemSettings',
                entityId: 'settings',
                details: { updatedFields: Object.keys(data) },
                ipAddress: (req.headers['x-forwarded-for'] as string | undefined)?.split(',')[0]?.trim() || req.ip,
            });
        }

        return res.json({ success: true, settings });
    } catch (error) {
        logger.error({ err: error }, 'Update settings error');
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// POST /api/settings/holidays - Add a new holiday/off-period (Admin only)
router.post('/holidays', requireAuth, requireRole('ADMIN'), async (req: Request, res: Response) => {
    try {
        const parseResult = holidaySchema.safeParse(req.body);
        if (!parseResult.success) {
            const firstError = Object.values(parseResult.error.flatten().fieldErrors).flat()[0] || 'Validation failed';
            return res.status(400).json({ error: firstError });
        }

        const { title, startDate, endDate, reason, showOnWeb, isActive } = parseResult.data;

        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return res.status(400).json({ error: 'Invalid start or end date format' });
        }

        if (end < start) {
            return res.status(400).json({ error: 'End date cannot be earlier than start date' });
        }

        const holiday = await prisma.clinicHoliday.create({
            data: {
                title: title.trim(),
                startDate: start,
                endDate: end,
                reason: reason?.trim() || null,
                showOnWeb: showOnWeb !== false,
                isActive: isActive !== false,
            },
        });

        logger.info(`Holiday created: ${holiday.title} (${startDate} to ${endDate})`);
        if (req.user) {
            await logAudit({
                userId: req.user.id,
                action: 'CREATE_HOLIDAY',
                entity: 'ClinicHoliday',
                entityId: holiday.id,
                details: { title: holiday.title, startDate, endDate },
                ipAddress: (req.headers['x-forwarded-for'] as string | undefined)?.split(',')[0]?.trim() || req.ip,
            });
        }
        return res.status(201).json({ success: true, holiday });
    } catch (error) {
        logger.error({ err: error }, 'Failed to create clinic holiday');
        return res.status(500).json({ error: 'Failed to create holiday' });
    }
});

// PATCH /api/settings/holidays/:id - Update / Toggle holiday (Admin only)
router.patch('/holidays/:id', requireAuth, requireRole('ADMIN'), async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { title, startDate, endDate, reason, showOnWeb, isActive } = req.body;

        const existing = await prisma.clinicHoliday.findUnique({ where: { id } });
        if (!existing) {
            return res.status(404).json({ error: 'Holiday not found' });
        }

        const updateData: any = {};
        if (title !== undefined) updateData.title = String(title).trim();
        if (reason !== undefined) updateData.reason = reason ? String(reason).trim() : null;
        if (showOnWeb !== undefined) updateData.showOnWeb = Boolean(showOnWeb);
        if (isActive !== undefined) updateData.isActive = Boolean(isActive);

        if (startDate) {
            const start = new Date(startDate);
            if (!isNaN(start.getTime())) updateData.startDate = start;
        }
        if (endDate) {
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            if (!isNaN(end.getTime())) updateData.endDate = end;
        }

        const updated = await prisma.clinicHoliday.update({
            where: { id },
            data: updateData,
        });

        if (req.user) {
            await logAudit({
                userId: req.user.id,
                action: 'UPDATE_HOLIDAY',
                entity: 'ClinicHoliday',
                entityId: id,
                details: { updatedFields: Object.keys(updateData) },
                ipAddress: (req.headers['x-forwarded-for'] as string | undefined)?.split(',')[0]?.trim() || req.ip,
            });
        }

        return res.json({ success: true, holiday: updated });
    } catch (error) {
        logger.error({ err: error }, 'Failed to update clinic holiday');
        return res.status(500).json({ error: 'Failed to update holiday' });
    }
});

// DELETE /api/settings/holidays/:id - Delete holiday (Admin only)
router.delete('/holidays/:id', requireAuth, requireRole('ADMIN'), async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const existing = await prisma.clinicHoliday.findUnique({ where: { id } });
        if (!existing) {
            return res.status(404).json({ error: 'Holiday not found' });
        }

        await prisma.clinicHoliday.delete({ where: { id } });
        logger.info(`Holiday deleted: ${existing.title} (${id})`);
        if (req.user) {
            await logAudit({
                userId: req.user.id,
                action: 'DELETE_HOLIDAY',
                entity: 'ClinicHoliday',
                entityId: id,
                details: { title: existing.title },
                ipAddress: (req.headers['x-forwarded-for'] as string | undefined)?.split(',')[0]?.trim() || req.ip,
            });
        }
        return res.json({ success: true, message: 'Holiday deleted successfully' });
    } catch (error) {
        logger.error({ err: error }, 'Failed to delete clinic holiday');
        return res.status(500).json({ error: 'Failed to delete holiday' });
    }
});

export default router;
