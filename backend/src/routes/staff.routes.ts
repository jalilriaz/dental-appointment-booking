import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';
import bcrypt from 'bcryptjs';
import { requireAuth, requireRole } from '../middleware/auth.middleware';
import { logAudit } from '../lib/audit';
import { z } from 'zod';

const router = Router();

const createStaffSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email format'),
    phone: z.string().optional().nullable(),
    password: z.string().min(8, 'Password must be at least 8 characters').optional().or(z.literal('')),
    role: z.enum(['ADMIN', 'STAFF', 'PATIENT']).optional(),
});

const updateStaffSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').optional(),
    email: z.string().email('Invalid email').optional(),
    phone: z.string().optional().nullable(),
    password: z.string().min(8, 'Password must be at least 8 characters').optional().or(z.literal('')),
    role: z.enum(['ADMIN', 'STAFF', 'PATIENT']).optional(),
});

// GET /api/staff/dashboard - Real-time reception telemetry
router.get('/dashboard', requireAuth, async (_req: Request, res: Response) => {
    try {
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const todayEnd = new Date(todayStart.getTime() + 86400000);
        const tomorrowStart = new Date(todayEnd);
        const tomorrowEnd = new Date(tomorrowStart.getTime() + 86400000);
        const sevenDaysAgo = new Date(todayStart.getTime() - 6 * 86400000);

        const [
            todayAppointments,
            tomorrowAppointments,
            todayCompleted,
            totalPatients,
            pastWeekAppointments,
            allCompletedCount,
            allNoShowCount,
        ] = await Promise.all([
            prisma.appointment.findMany({
                where: { startTime: { gte: todayStart, lt: todayEnd }, status: { not: 'CANCELLED' } },
                include: {
                    patient: { select: { id: true, name: true, phone: true, email: true, medicalAlerts: true } },
                    treatment: { select: { name: true, durationMin: true, price: true } },
                },
                orderBy: { startTime: 'asc' },
            }),
            prisma.appointment.findMany({
                where: { startTime: { gte: tomorrowStart, lt: tomorrowEnd }, status: { not: 'CANCELLED' } },
                include: {
                    patient: { select: { id: true, name: true, phone: true } },
                    treatment: { select: { name: true, durationMin: true, price: true } },
                },
                orderBy: { startTime: 'asc' },
            }),
            prisma.appointment.count({
                where: { startTime: { gte: todayStart, lt: todayEnd }, status: 'COMPLETED' },
            }),
            prisma.user.count({ where: { role: 'PATIENT' } }),
            prisma.appointment.findMany({
                where: { startTime: { gte: sevenDaysAgo, lte: todayEnd } },
                select: { startTime: true, status: true },
            }),
            prisma.appointment.count({ where: { status: 'COMPLETED' } }),
            prisma.appointment.count({ where: { status: 'NO_SHOW' } }),
        ]);

        const todayTotal = todayAppointments.length;
        const remainingToday = todayAppointments.filter(
            (a) => new Date(a.startTime) >= now && a.status === 'SCHEDULED'
        ).length;
        const tomorrowTotal = tomorrowAppointments.length;

        const totalAttendedOrMissed = allCompletedCount + allNoShowCount;
        const attendanceRate = totalAttendedOrMissed > 0
            ? Math.round((allCompletedCount / totalAttendedOrMissed) * 100)
            : 94;

        // 7-day trend curve
        const daysMap: Record<string, { count: number; completed: number }> = {};
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        for (let i = 6; i >= 0; i--) {
            const d = new Date(now.getTime() - i * 86400000);
            const label = days[d.getDay()];
            daysMap[label] = { count: 0, completed: 0 };
        }

        for (const apt of pastWeekAppointments) {
            const label = days[new Date(apt.startTime).getDay()];
            if (daysMap[label]) {
                daysMap[label].count += 1;
                if (apt.status === 'COMPLETED') daysMap[label].completed += 1;
            }
        }

        const weeklyTrend = Object.keys(daysMap).map((day) => ({
            day,
            count: daysMap[day].count || 1,
            completed: daysMap[day].completed,
        }));

        // Hourly chair load (12 PM to 8 PM)
        const hours = ['12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM'];
        const hourlyMap: Record<string, number> = {
            '12 PM': 0, '1 PM': 0, '2 PM': 0, '3 PM': 0, '4 PM': 0, '5 PM': 0, '6 PM': 0, '7 PM': 0,
        };

        for (const apt of todayAppointments) {
            const h = new Date(apt.startTime).getHours();
            if (h >= 12 && h <= 19) {
                const label = h === 12 ? '12 PM' : `${h - 12} PM`;
                if (hourlyMap[label] !== undefined) hourlyMap[label] += 1;
            }
        }

        const hourlyDistribution = hours.map((hour) => ({
            hour,
            count: hourlyMap[hour] || 0,
            active: hourlyMap[hour] > 0,
        }));

        return res.json({
            todayTotal,
            remainingToday,
            todayCompleted,
            tomorrowTotal,
            totalPatients,
            attendanceRate,
            todayAppointments,
            tomorrowAppointments,
            weeklyTrend,
            hourlyDistribution,
        });
    } catch (error) {
        console.error('Reception dashboard telemetry error:', error);
        return res.status(500).json({ error: 'Failed to fetch reception dashboard telemetry' });
    }
});

// GET /api/staff - List all staff
router.get('/', requireAuth, requireRole('ADMIN'), async (_req: Request, res: Response) => {
    try {
        const staff = await prisma.user.findMany({
            where: {
                role: { in: ['ADMIN', 'STAFF'] },
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
        });
        return res.json({ staff });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch staff' });
    }
});

// POST /api/staff - Create new staff member
router.post('/', requireAuth, requireRole('ADMIN'), async (req: Request, res: Response) => {
    try {
        const parseResult = createStaffSchema.safeParse(req.body);
        if (!parseResult.success) {
            return res.status(400).json({ error: 'Validation Error', details: parseResult.error.issues });
        }

        const { name, email, phone, password, role } = parseResult.data;

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'User with this email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password || 'Staff123!', 10);

        const staff = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: (role as any) || 'STAFF',
                phone: phone || null,
            },
        });

        if (req.user) {
            await logAudit(req.user.id, 'CREATE_STAFF', staff.id, { name, role: staff.role });
        }

        const { password: _, ...staffWithoutPassword } = staff;
        return res.status(201).json({ staff: staffWithoutPassword });
    } catch (error) {
        console.error('Create staff error:', error);
        return res.status(500).json({ error: 'Failed to create staff' });
    }
});

// PUT /api/staff/:id - Update staff member
router.put('/:id', requireAuth, requireRole('ADMIN'), async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const parseResult = updateStaffSchema.safeParse(req.body);
        if (!parseResult.success) {
            return res.status(400).json({ error: 'Validation Error', details: parseResult.error.issues });
        }

        const { name, email, phone, password, role } = parseResult.data;
        const updateData: any = {};
        if (name !== undefined) updateData.name = name;
        if (email !== undefined) updateData.email = email;
        if (phone !== undefined) updateData.phone = phone;
        if (role !== undefined) updateData.role = role;

        if (password && password.trim() !== '') {
            updateData.password = await bcrypt.hash(password, 10);
        }

        const staff = await prisma.user.update({
            where: { id },
            data: updateData,
            select: { id: true, name: true, email: true, phone: true, role: true },
        });

        if (req.user) {
            await logAudit(req.user.id, 'UPDATE_STAFF', staff.id, {
                updateData: { ...updateData, password: '[REDACTED]' },
            });
        }

        return res.json({ staff });
    } catch (error) {
        console.error('Update staff error:', error);
        return res.status(500).json({ error: 'Failed to update staff' });
    }
});

// DELETE /api/staff/:id - Remove staff member
router.delete('/:id', requireAuth, requireRole('ADMIN'), async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.user.delete({ where: { id } });

        if (req.user) {
            await logAudit(req.user.id, 'DELETE_STAFF', id, {});
        }

        return res.json({ success: true });
    } catch (error) {
        console.error('Delete staff error:', error);
        return res.status(500).json({ error: 'Failed to delete staff' });
    }
});

export default router;

