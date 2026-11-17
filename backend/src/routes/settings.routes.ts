import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';
import { requireAuth, requireRole } from '../middleware/auth.middleware';
import { z } from 'zod';
import { logger } from '../lib/logger';

const router = Router();

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
        const settings = await prisma.systemSettings.findUnique({
            where: { id: 'settings' },
        });

        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        // Fetch upcoming/active holidays that should show on web
        const activeHolidays = await prisma.clinicHoliday.findMany({
            where: {
                isActive: true,
                endDate: { gte: todayStart },
            },
            orderBy: { startDate: 'asc' },
        });

        return res.json({
            success: true,
            settings: settings || {
                clinicName: 'Elite Dental & Aesthetic Centre',
                clinicAddress: 'Office# 6, 1st Floor, Doctors Plaza, G-8 Markaz (next to IDC), Islamabad',
                landlinePhone: '051-2340093',
                mobilePhone: '0303-5080011',
                whatsappNumber: '+92 314 5475528',
                clinicEmail: 'info@elitedental.com',
                pmdcRegNumber: '14820-D',
                workDayStart: '12:00',
                workDayEnd: '20:00',
                slotDurationMin: 30,
                weeklyWorkingDays: 'Monday,Tuesday,Wednesday,Thursday,Friday,Saturday',
            },
            activeHolidays,
        });
    } catch (error) {
        logger.error({ err: error }, 'Failed to fetch public settings');
        return res.status(500).json({ error: 'Failed to fetch settings' });
    }
});

// GET /api/settings - Fetch settings + all holidays (Admin / Staff)
router.get('/', async (_req: Request, res: Response) => {
    try {
        let settings = await prisma.systemSettings.findUnique({
            where: { id: 'settings' },
        });

        if (!settings) {
            settings = await prisma.systemSettings.create({
                data: {
                    id: 'settings',
                    clinicName: 'Elite Dental & Aesthetic Centre',
                    clinicAddress: 'Office# 6, 1st Floor, Doctors Plaza, G-8 Markaz (next to IDC), Islamabad',
                    landlinePhone: '051-2340093',
                    mobilePhone: '0303-5080011',
                    whatsappNumber: '+92 314 5475528',
                    clinicEmail: 'info@elitedental.com',
                    pmdcRegNumber: '14820-D',
                    receiptFooter: 'Thank you for trusting Elite Dental & Aesthetic Centre. Valid for clinical record & tax submission.',
                    workDayStart: '12:00',
                    workDayEnd: '20:00',
                    slotDurationMin: 30,
                    weeklyWorkingDays: 'Monday,Tuesday,Wednesday,Thursday,Friday,Saturday',
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

        const settings = await prisma.systemSettings.upsert({
            where: { id: 'settings' },
            update: {
                ...data,
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
                pmdcRegNumber: data.pmdcRegNumber || '14820-D',
                receiptFooter: data.receiptFooter || 'Thank you for trusting Elite Dental & Aesthetic Centre. Valid for clinical record & tax submission.',
                workDayStart: data.workDayStart || '12:00',
                workDayEnd: data.workDayEnd || '20:00',
                slotDurationMin: data.slotDurationMin ? Number(data.slotDurationMin) : 30,
                weeklyWorkingDays: data.weeklyWorkingDays || 'Monday,Tuesday,Wednesday,Thursday,Friday,Saturday',
            },
        });

        if (req.user) {
            logger.info({ adminId: req.user.id, action: 'update_system_settings' }, 'Admin updated global system settings');
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
        return res.json({ success: true, message: 'Holiday deleted successfully' });
    } catch (error) {
        logger.error({ err: error }, 'Failed to delete clinic holiday');
        return res.status(500).json({ error: 'Failed to delete holiday' });
    }
});

export default router;
