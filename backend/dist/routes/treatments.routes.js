"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../lib/prisma"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const treatmentsData_1 = require("../lib/treatmentsData");
const router = (0, express_1.Router)();
// GET /api/treatments - Fetch all treatments
router.get('/', async (_req, res) => {
    try {
        const treatments = await prisma_1.default.treatment.findMany({
            orderBy: { name: 'asc' },
            include: { _count: { select: { appointments: true } } },
        });
        return res.json({ treatments });
    }
    catch (error) {
        console.error('Fetch treatments error:', error);
        return res.status(500).json({ error: 'Failed to fetch treatments' });
    }
});
// GET /api/treatments/:id - Fetch single treatment
router.get('/:id', async (req, res) => {
    try {
        let treatment = await prisma_1.default.treatment.findUnique({
            where: { id: req.params.id },
            include: { _count: { select: { appointments: true } } },
        });
        if (!treatment) {
            const mock = treatmentsData_1.ALL_TREATMENTS.find((t) => t.id === req.params.id);
            if (mock) {
                treatment = await prisma_1.default.treatment.findFirst({
                    where: { name: { equals: mock.name, mode: 'insensitive' } },
                    include: { _count: { select: { appointments: true } } },
                });
            }
        }
        if (!treatment) {
            return res.status(404).json({ error: 'Treatment not found' });
        }
        return res.json({ treatment });
    }
    catch (error) {
        return res.status(500).json({ error: 'Failed to fetch treatment' });
    }
});
// POST /api/treatments - Create new treatment (Admin only)
router.post('/', auth_middleware_1.requireAuth, (0, auth_middleware_1.requireRole)('ADMIN'), async (req, res) => {
    try {
        const { name, durationMin, price, discountedPrice, description, instructions, isActive, imageUrl } = req.body;
        if (!name || !durationMin || price === undefined) {
            return res.status(400).json({ error: 'Name, duration, and price are required' });
        }
        const treatment = await prisma_1.default.treatment.create({
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
    }
    catch (error) {
        console.error('Create treatment error:', error);
        return res.status(500).json({ error: 'Failed to create treatment' });
    }
});
// PUT /api/treatments/:id - Update treatment (Admin only)
router.put('/:id', auth_middleware_1.requireAuth, (0, auth_middleware_1.requireRole)('ADMIN'), async (req, res) => {
    try {
        const { id } = req.params;
        const { name, durationMin, price, discountedPrice, description, instructions, isActive, imageUrl } = req.body;
        const treatment = await prisma_1.default.treatment.update({
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
    }
    catch (error) {
        console.error('Update treatment error:', error);
        return res.status(500).json({ error: 'Failed to update treatment' });
    }
});
// DELETE /api/treatments/:id - Delete treatment (Admin only)
router.delete('/:id', auth_middleware_1.requireAuth, (0, auth_middleware_1.requireRole)('ADMIN'), async (req, res) => {
    try {
        const { id } = req.params;
        const count = await prisma_1.default.appointment.count({ where: { treatmentId: id } });
        if (count > 0) {
            return res.status(409).json({
                error: `Cannot delete — ${count} appointment(s) use this treatment. Deactivate it instead.`,
            });
        }
        await prisma_1.default.treatment.delete({ where: { id } });
        return res.json({ success: true });
    }
    catch (error) {
        console.error('Delete treatment error:', error);
        return res.status(500).json({ error: 'Failed to delete treatment' });
    }
});
exports.default = router;
//# sourceMappingURL=treatments.routes.js.map