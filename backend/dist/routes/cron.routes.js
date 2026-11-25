"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const appointment_status_1 = require("../lib/appointment-status");
const auth_1 = require("../lib/auth");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
async function isCronAuthorized(req) {
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
    const querySecret = req.query.secret;
    if (querySecret && (querySecret === configuredSecret || querySecret === fallbackSecret || (cronSecret && querySecret === cronSecret))) {
        return true;
    }
    try {
        const token = (0, auth_middleware_1.extractToken)(req);
        if (token) {
            const session = await (0, auth_1.decrypt)(token);
            if (['ADMIN', 'STAFF'].includes(session.role)) {
                return true;
            }
        }
    }
    catch {
        // Continue
    }
    return false;
}
// GET or POST /api/cron/mark-missed
const handleMarkMissed = async (req, res) => {
    if (!(await isCronAuthorized(req))) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const result = await (0, appointment_status_1.expirePastAppointments)();
    return res.json({
        success: true,
        message: `Processed expired appointments. Marked ${result.updatedCount} as Missed (Not_Visited).`,
        ...result,
        timestamp: new Date().toISOString(),
    });
};
router.get('/mark-missed', handleMarkMissed);
router.post('/mark-missed', handleMarkMissed);
// GET or POST /api/cron/mark-Not Visited
const handleMarkNoShow = async (req, res) => {
    if (!(await isCronAuthorized(req))) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const result = await (0, appointment_status_1.expirePastAppointments)();
    return res.json({
        success: true,
        message: `Successfully processed ${result.updatedCount} past Not Visited appointments.`,
        ...result,
    });
};
router.get('/mark-Not Visited', handleMarkNoShow);
router.post('/mark-Not Visited', handleMarkNoShow);
exports.default = router;
//# sourceMappingURL=cron.routes.js.map