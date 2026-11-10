import { Router, Request, Response } from 'express';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

// GET /api/notifications
router.get('/', requireAuth, (_req: Request, res: Response) => {
    return res.json({ notifications: [] });
});

// PATCH /api/notifications/:id
router.patch('/:id', requireAuth, (_req: Request, res: Response) => {
    return res.json({ success: true, notification: null });
});

export default router;

