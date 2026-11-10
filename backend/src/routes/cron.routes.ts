import { Router, Request, Response } from 'express';
import { expirePastAppointments } from '../lib/appointment-status';
import { decrypt } from '../lib/auth';
import { extractToken } from '../middleware/auth.middleware';

const router = Router();

async function isCronAuthorized(req: Request): Promise<boolean> {
    const authHeader = req.headers.authorization;
    const configuredSecret = (process.env.N8N_SECRET_KEY || 'elite-dental-n8n-bot-secret-key-2026').trim();
    const fallbackSecret = 'elite-dental-n8n-bot-secret-key-2026';
    const cronSecret = (process.env.CRON_SECRET || '').trim();

    if (authHeader && authHeader.toLowerCase().startsWith('bearer ')) {
        const token = authHeader.substring(7).trim();
        if (token === configuredSecret || token === fallbackSecret || (cronSecret && token === cronSecret)) {
            return true;
        }
    }

    const querySecret = req.query.secret as string;
    if (querySecret && (querySecret === configuredSecret || querySecret === fallbackSecret || (cronSecret && querySecret === cronSecret))) {
        return true;
    }

    try {
        const token = extractToken(req);
        if (token) {
            const session = await decrypt(token);
            if (['ADMIN', 'STAFF'].includes(session.role as string)) {
                return true;
            }
        }
    } catch {
        // Continue
    }

    return false;
}

// GET or POST /api/cron/mark-missed
const handleMarkMissed = async (req: Request, res: Response) => {
    if (!(await isCronAuthorized(req))) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const result = await expirePastAppointments();
    return res.json({
        success: true,
        message: `Processed expired appointments. Marked ${result.updatedCount} as Missed (NO_SHOW).`,
        ...result,
        timestamp: new Date().toISOString(),
    });
};

router.get('/mark-missed', handleMarkMissed);
router.post('/mark-missed', handleMarkMissed);

// GET or POST /api/cron/mark-no-show
const handleMarkNoShow = async (req: Request, res: Response) => {
    if (!(await isCronAuthorized(req))) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const result = await expirePastAppointments();
    return res.json({
        success: true,
        message: `Successfully processed ${result.updatedCount} past no-show appointments.`,
        ...result,
    });
};

router.get('/mark-no-show', handleMarkNoShow);
router.post('/mark-no-show', handleMarkNoShow);

export default router;

