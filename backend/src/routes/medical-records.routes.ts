import { Router, Request, Response } from 'express';

const router = Router();

// POST /api/medical-records (Deprecated stub)
router.post('/', (_req: Request, res: Response) => {
    return res.status(410).json({
        error: 'Medical records feature has been removed from this version.',
    });
});

export default router;

