"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../lib/prisma"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const zod_1 = require("zod");
const logger_1 = require("../lib/logger");
const router = (0, express_1.Router)();
const settingsSchema = zod_1.z.object({
    clinicName: zod_1.z.string().min(1).max(150).optional(),
    clinicAddress: zod_1.z.string().min(1).max(300).optional(),
    landlinePhone: zod_1.z.string().max(50).optional(),
    mobilePhone: zod_1.z.string().max(50).optional(),
    whatsappNumber: zod_1.z.string().max(50).optional(),
    clinicEmail: zod_1.z.string().email().optional().or(zod_1.z.literal('')),
    pmdcRegNumber: zod_1.z.string().max(50).optional(),
    receiptFooter: zod_1.z.string().max(500).optional(),
    workDayStart: zod_1.z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format').optional(),
    workDayEnd: zod_1.z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format').optional(),
    slotDurationMin: zod_1.z.number().int().min(5).max(120).optional().or(zod_1.z.string().regex(/^\d+$/).transform(Number).optional()),
    weeklyWorkingDays: zod_1.z.string().optional(),
});
const holidaySchema = zod_1.z.object({
    title: zod_1.z.string().min(2, 'Holiday title is required'),
    startDate: zod_1.z.string().min(10, 'Start date is required'),
    endDate: zod_1.z.string().min(10, 'End date is required'),
    reason: zod_1.z.string().optional().nullable(),
    showOnWeb: zod_1.z.boolean().optional().default(true),
    isActive: zod_1.z.boolean().optional().default(true),
});
// GET /api/settings/public - Publicly accessible settings & active holidays for website/booking
router.get('/public', async (_req, res) => {
    try {
        const settings = await prisma_1.default.systemSettings.findUnique({
            where: { id: 'settings' },
        });
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        // Fetch upcoming/active holidays that should show on web
        const activeHolidays = await prisma_1.default.clinicHoliday.findMany({
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
    }
    catch (error) {
        logger_1.logger.error({ err: error }, 'Failed to fetch public settings');
        return res.status(500).json({ error: 'Failed to fetch settings' });
    }
});
// GET /api/settings - Fetch settings + all holidays (Admin / Staff)
router.get('/', async (_req, res) => {
    try {
        let settings = await prisma_1.default.systemSettings.findUnique({
            where: { id: 'settings' },
        });
        if (!settings) {
            settings = await prisma_1.default.systemSettings.create({
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
        const holidays = await prisma_1.default.clinicHoliday.findMany({
            orderBy: { startDate: 'desc' },
        });
        return res.json({ settings, holidays });
    }
    catch (error) {
        logger_1.logger.error({ err: error }, 'Failed to fetch settings');
        return res.status(500).json({ error: 'Failed to fetch settings' });
    }
});
// PUT /api/settings - Update settings (Admin only)
router.put('/', auth_middleware_1.requireAuth, (0, auth_middleware_1.requireRole)('ADMIN'), async (req, res) => {
    try {
        const parseResult = settingsSchema.safeParse(req.body);
        if (!parseResult.success) {
            return res.status(400).json({
                error: 'Invalid data format',
                details: parseResult.error.flatten().fieldErrors,
            });
        }
        const data = parseResult.data;
        const settings = await prisma_1.default.systemSettings.upsert({
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
            logger_1.logger.info({ adminId: req.user.id, action: 'update_system_settings' }, 'Admin updated global system settings');
        }
        return res.json({ success: true, settings });
    }
    catch (error) {
        logger_1.logger.error({ err: error }, 'Update settings error');
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});
// POST /api/settings/holidays - Add a new holiday/off-period (Admin only)
router.post('/holidays', auth_middleware_1.requireAuth, (0, auth_middleware_1.requireRole)('ADMIN'), async (req, res) => {
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
        const holiday = await prisma_1.default.clinicHoliday.create({
            data: {
                title: title.trim(),
                startDate: start,
                endDate: end,
                reason: reason?.trim() || null,
                showOnWeb: showOnWeb !== false,
                isActive: isActive !== false,
            },
        });
        logger_1.logger.info(`Holiday created: ${holiday.title} (${startDate} to ${endDate})`);
        return res.status(201).json({ success: true, holiday });
    }
    catch (error) {
        logger_1.logger.error({ err: error }, 'Failed to create clinic holiday');
        return res.status(500).json({ error: 'Failed to create holiday' });
    }
});
// PATCH /api/settings/holidays/:id - Update / Toggle holiday (Admin only)
router.patch('/holidays/:id', auth_middleware_1.requireAuth, (0, auth_middleware_1.requireRole)('ADMIN'), async (req, res) => {
    try {
        const { id } = req.params;
        const { title, startDate, endDate, reason, showOnWeb, isActive } = req.body;
        const existing = await prisma_1.default.clinicHoliday.findUnique({ where: { id } });
        if (!existing) {
            return res.status(404).json({ error: 'Holiday not found' });
        }
        const updateData = {};
        if (title !== undefined)
            updateData.title = String(title).trim();
        if (reason !== undefined)
            updateData.reason = reason ? String(reason).trim() : null;
        if (showOnWeb !== undefined)
            updateData.showOnWeb = Boolean(showOnWeb);
        if (isActive !== undefined)
            updateData.isActive = Boolean(isActive);
        if (startDate) {
            const start = new Date(startDate);
            if (!isNaN(start.getTime()))
                updateData.startDate = start;
        }
        if (endDate) {
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            if (!isNaN(end.getTime()))
                updateData.endDate = end;
        }
        const updated = await prisma_1.default.clinicHoliday.update({
            where: { id },
            data: updateData,
        });
        return res.json({ success: true, holiday: updated });
    }
    catch (error) {
        logger_1.logger.error({ err: error }, 'Failed to update clinic holiday');
        return res.status(500).json({ error: 'Failed to update holiday' });
    }
});
// DELETE /api/settings/holidays/:id - Delete holiday (Admin only)
router.delete('/holidays/:id', auth_middleware_1.requireAuth, (0, auth_middleware_1.requireRole)('ADMIN'), async (req, res) => {
    try {
        const { id } = req.params;
        const existing = await prisma_1.default.clinicHoliday.findUnique({ where: { id } });
        if (!existing) {
            return res.status(404).json({ error: 'Holiday not found' });
        }
        await prisma_1.default.clinicHoliday.delete({ where: { id } });
        logger_1.logger.info(`Holiday deleted: ${existing.title} (${id})`);
        return res.json({ success: true, message: 'Holiday deleted successfully' });
    }
    catch (error) {
        logger_1.logger.error({ err: error }, 'Failed to delete clinic holiday');
        return res.status(500).json({ error: 'Failed to delete holiday' });
    }
});
exports.default = router;
//# sourceMappingURL=settings.routes.js.map