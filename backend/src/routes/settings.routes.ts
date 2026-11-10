import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';
import { requireAuth, requireRole } from '../middleware/auth.middleware';
import { z } from 'zod';
import { logger } from '../lib/logger';

const router = Router();

const settingsSchema = z.object({
    clinicName: z.string().min(1).max(100).optional(),
    workDayStart: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format').optional(),
    workDayEnd: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format').optional(),
    slotDurationMin: z.number().int().min(5).max(120).optional().or(z.string().regex(/^\d+$/).transform(Number).optional()),
});

// GET /api/settings - Fetch settings
router.get('/', async (_req: Request, res: Response) => {
    try {
        let settings = await prisma.systemSettings.findUnique({
            where: { id: 'settings' },
        });

        if (!settings) {
            settings = await prisma.systemSettings.create({
                data: {
                    id: 'settings',
                    clinicName: 'Dr. Sheriyaar Dental Care',
                    workDayStart: '09:00',
                    workDayEnd: '18:00',
                    slotDurationMin: 30,
                },
            });
        }

        return res.json({ settings });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch settings' });
    }
});

// PUT /api/settings - Update settings (Admin only)
router.put('/', requireAuth, requireRole('ADMIN'), async (req: Request, res: Response) => {
    try {
        const parseResult = settingsSchema.safeParse(req.body);
        if (!parseResult.success) {
            return res.status(400).json({ error: 'Invalid data format' });
        }

        const { clinicName, workDayStart, workDayEnd, slotDurationMin } = parseResult.data;

        const settings = await prisma.systemSettings.upsert({
            where: { id: 'settings' },
            update: {
                clinicName,
                workDayStart,
                workDayEnd,
                slotDurationMin: slotDurationMin ? Number(slotDurationMin) : undefined,
            },
            create: {
                id: 'settings',
                clinicName: clinicName || 'Dr. Sheriyaar Dental Care',
                workDayStart: workDayStart || '09:00',
                workDayEnd: workDayEnd || '18:00',
                slotDurationMin: slotDurationMin ? Number(slotDurationMin) : 30,
            },
        });

        if (req.user) {
            logger.info({ adminId: req.user.id, action: 'update_system_settings' }, 'Admin updated global system settings');
        }

        return res.json({ settings });
    } catch (error) {
        console.error('Update settings error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;

