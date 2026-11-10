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

