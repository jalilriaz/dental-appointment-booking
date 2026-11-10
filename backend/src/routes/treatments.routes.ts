import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';
import { requireAuth, requireRole } from '../middleware/auth.middleware';

const router = Router();

// GET /api/treatments - Fetch all treatments
router.get('/', async (_req: Request, res: Response) => {
    try {
        const treatments = await prisma.treatment.findMany({
            orderBy: { name: 'asc' },
            include: { _count: { select: { appointments: true } } },
        });
        return res.json({ treatments });
    } catch (error) {
        console.error('Fetch treatments error:', error);
        return res.status(500).json({ error: 'Failed to fetch treatments' });
    }
});

// GET /api/treatments/:id - Fetch single treatment
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const treatment = await prisma.treatment.findUnique({
            where: { id: req.params.id },
            include: { _count: { select: { appointments: true } } },
        });
        if (!treatment) {
            return res.status(404).json({ error: 'Treatment not found' });
        }
        return res.json({ treatment });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch treatment' });
    }
});

// POST /api/treatments - Create new treatment (Admin only)
router.post('/', requireAuth, requireRole('ADMIN'), async (req: Request, res: Response) => {
    try {
        const { name, durationMin, price, discountedPrice, description, instructions, isActive, imageUrl } = req.body;

        if (!name || !durationMin || price === undefined) {
            return res.status(400).json({ error: 'Name, duration, and price are required' });
        }

        const treatment = await prisma.treatment.create({
            data: {
                name: name.trim(),
                durationMin: parseInt(durationMin, 10),
                price: parseInt(price, 10),
                discountedPrice: discountedPrice ? parseInt(discountedPrice, 10) : null,
                description: description?.trim() || null,
                instructions: instructions?.trim() || null,
                isActive: isActive !== false,
                imageUrl: imageUrl || null,
            },
        });

        return res.status(201).json({ treatment });
    } catch (error) {
        console.error('Create treatment error:', error);
        return res.status(500).json({ error: 'Failed to create treatment' });
    }
});

// PUT /api/treatments/:id - Update treatment (Admin only)
router.put('/:id', requireAuth, requireRole('ADMIN'), async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, durationMin, price, discountedPrice, description, instructions, isActive, imageUrl } = req.body;

        const treatment = await prisma.treatment.update({
            where: { id },
            data: {
                ...(name !== undefined && { name: name.trim() }),
                ...(durationMin !== undefined && { durationMin: parseInt(durationMin, 10) }),
                ...(price !== undefined && { price: parseInt(price, 10) }),
                ...(discountedPrice !== undefined && { discountedPrice: discountedPrice ? parseInt(discountedPrice, 10) : null }),
                ...(description !== undefined && { description: description?.trim() || null }),
                ...(instructions !== undefined && { instructions: instructions?.trim() || null }),
                ...(isActive !== undefined && { isActive }),
                ...(imageUrl !== undefined && { imageUrl: imageUrl || null }),
            },
        });

        return res.json({ treatment });
    } catch (error) {
        console.error('Update treatment error:', error);
        return res.status(500).json({ error: 'Failed to update treatment' });
    }
});

// DELETE /api/treatments/:id - Delete treatment (Admin only)
router.delete('/:id', requireAuth, requireRole('ADMIN'), async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const count = await prisma.appointment.count({ where: { treatmentId: id } });
        if (count > 0) {
            return res.status(409).json({
                error: `Cannot delete — ${count} appointment(s) use this treatment. Deactivate it instead.`,
            });
        }

        await prisma.treatment.delete({ where: { id } });
        return res.json({ success: true });
    } catch (error) {
        console.error('Delete treatment error:', error);
        return res.status(500).json({ error: 'Failed to delete treatment' });
    }
});

export default router;

