import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';
import { requireAuth, requireRole } from '../middleware/auth.middleware';

const router = Router();

// GET /api/inventory - Fetch all inventory items
router.get('/', requireAuth, requireRole('ADMIN', 'STAFF'), async (_req: Request, res: Response) => {
    try {
        const items = await prisma.inventory.findMany({
            orderBy: { itemName: 'asc' },
        });
        return res.json({ items });
    } catch (error) {
        console.error('Fetch inventory error:', error);
        return res.status(500).json({ error: 'Failed to fetch inventory' });
    }
});

// POST /api/inventory - Create inventory item (Admin only)
router.post('/', requireAuth, requireRole('ADMIN'), async (req: Request, res: Response) => {
    try {
        const { itemName, quantity, minThreshold } = req.body;

        if (!itemName?.trim()) {
            return res.status(400).json({ error: 'Item name is required' });
        }

        const item = await prisma.inventory.create({
            data: {
                itemName: itemName.trim(),
                quantity: Math.max(0, Number(quantity) || 0),
                minThreshold: Math.max(0, Number(minThreshold) || 5),
            },
        });

        return res.status(201).json({ success: true, item });
    } catch (error) {
        console.error('Create inventory item error:', error);
        return res.status(500).json({ error: 'Failed to create item' });
    }
});

// PATCH /api/inventory/:id - Update inventory item (Admin only)
router.patch('/:id', requireAuth, requireRole('ADMIN'), async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { itemName, quantity, minThreshold } = req.body;

        const item = await prisma.inventory.update({
            where: { id },
            data: {
                itemName: itemName?.trim() || undefined,
                quantity: quantity !== undefined ? Math.max(0, Number(quantity)) : undefined,
                minThreshold: minThreshold !== undefined ? Math.max(0, Number(minThreshold)) : undefined,
            },
        });

        return res.json({ success: true, item });
    } catch (error) {
        console.error('Update inventory item error:', error);
        return res.status(500).json({ error: 'Failed to update item' });
    }
});

// DELETE /api/inventory/:id - Delete inventory item (Admin only)
router.delete('/:id', requireAuth, requireRole('ADMIN'), async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.inventory.delete({ where: { id } });
        return res.json({ success: true });
    } catch (error) {
        console.error('Delete inventory item error:', error);
        return res.status(500).json({ error: 'Failed to delete item' });
    }
});

export default router;

