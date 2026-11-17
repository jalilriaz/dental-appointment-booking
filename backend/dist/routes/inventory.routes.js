"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../lib/prisma"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// GET /api/inventory - Fetch all inventory items
router.get('/', auth_middleware_1.requireAuth, (0, auth_middleware_1.requireRole)('ADMIN', 'STAFF'), async (_req, res) => {
    try {
        const items = await prisma_1.default.inventory.findMany({
            orderBy: { itemName: 'asc' },
        });
        return res.json({ items });
    }
    catch (error) {
        console.error('Fetch inventory error:', error);
        return res.status(500).json({ error: 'Failed to fetch inventory' });
    }
});
// POST /api/inventory - Create inventory item (Admin only)
router.post('/', auth_middleware_1.requireAuth, (0, auth_middleware_1.requireRole)('ADMIN'), async (req, res) => {
    try {
        const { itemName, quantity, minThreshold } = req.body;
        if (!itemName?.trim()) {
            return res.status(400).json({ error: 'Item name is required' });
        }
        const item = await prisma_1.default.inventory.create({
            data: {
                itemName: itemName.trim(),
                quantity: Math.max(0, Number(quantity) || 0),
                minThreshold: Math.max(0, Number(minThreshold) || 5),
            },
        });
        return res.status(201).json({ success: true, item });
    }
    catch (error) {
        console.error('Create inventory item error:', error);
        return res.status(500).json({ error: 'Failed to create item' });
    }
});
// PATCH /api/inventory/:id - Update inventory item (Admin only)
router.patch('/:id', auth_middleware_1.requireAuth, (0, auth_middleware_1.requireRole)('ADMIN'), async (req, res) => {
    try {
        const { id } = req.params;
        const { itemName, quantity, minThreshold } = req.body;
        const item = await prisma_1.default.inventory.update({
            where: { id },
            data: {
                itemName: itemName?.trim() || undefined,
                quantity: quantity !== undefined ? Math.max(0, Number(quantity)) : undefined,
                minThreshold: minThreshold !== undefined ? Math.max(0, Number(minThreshold)) : undefined,
            },
        });
        return res.json({ success: true, item });
    }
    catch (error) {
        console.error('Update inventory item error:', error);
        return res.status(500).json({ error: 'Failed to update item' });
    }
});
// DELETE /api/inventory/:id - Delete inventory item (Admin only)
router.delete('/:id', auth_middleware_1.requireAuth, (0, auth_middleware_1.requireRole)('ADMIN'), async (req, res) => {
    try {
        const { id } = req.params;
        await prisma_1.default.inventory.delete({ where: { id } });
        return res.json({ success: true });
    }
    catch (error) {
        console.error('Delete inventory item error:', error);
        return res.status(500).json({ error: 'Failed to delete item' });
    }
});
exports.default = router;
//# sourceMappingURL=inventory.routes.js.map