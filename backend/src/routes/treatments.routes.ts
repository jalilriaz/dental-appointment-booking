import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';
import { optionalAuth, requireAuth, requireRole } from '../middleware/auth.middleware';
import { logAudit } from '../lib/audit';
import { ALL_TREATMENTS } from '../lib/treatmentsData';
import { buildTreatmentUpdateData } from '../lib/treatmentHelpers';

const router = Router();
const ipFromReq = (req: Request) =>
    (req.headers['x-forwarded-for'] as string | undefined)?.split(',')[0]?.trim() || req.ip;

router.get('/', optionalAuth, async (req: Request, res: Response) => {
    try {
        const scope = String(req.query.scope || 'public');
        const role = req.user?.role;
        const where =
            scope === 'admin' && role === 'ADMIN'
                ? { deletedAt: null }
                : scope === 'desk' && (role === 'ADMIN' || role === 'STAFF')
                  ? { isActive: true, deletedAt: null }
                  : { isActive: true, showOnWeb: true, deletedAt: null };
        const treatments = await prisma.treatment.findMany({
            where,
            orderBy: { name: 'asc' },
            include: { _count: { select: { appointments: true, patientTreatments: true } } },
        });
        return res.json({ treatments });
    } catch (error) {
        console.error('Fetch treatments error:', error);
        return res.status(500).json({ error: 'Failed to fetch treatments' });
    }
});

router.get('/:id', optionalAuth, async (req: Request, res: Response) => {
    try {
        const isInternal = req.user?.role === 'ADMIN' || req.user?.role === 'STAFF';
        const vis = isInternal ? { deletedAt: null } : { isActive: true, showOnWeb: true, deletedAt: null };
        let treatment = await prisma.treatment.findFirst({
            where: { id: req.params.id, ...vis },
            include: { _count: { select: { appointments: true, patientTreatments: true } } },
        });
        if (!treatment) {
            const mock = ALL_TREATMENTS.find((t) => t.id === req.params.id);
            if (mock) {
                treatment = await prisma.treatment.findFirst({
                    where: { name: { equals: mock.name, mode: 'insensitive' }, ...vis },
                    include: { _count: { select: { appointments: true, patientTreatments: true } } },
                });
            }
        }
        if (!treatment) return res.status(404).json({ error: 'Treatment not found' });
        return res.json({ treatment });
    } catch {
        return res.status(500).json({ error: 'Failed to fetch treatment' });
    }
});

router.post('/', requireAuth, requireRole('ADMIN'), async (req: Request, res: Response) => {
    try {
        const { name, durationMin, price } = req.body;
        if (!name?.trim() || !durationMin || price === undefined) {
            return res.status(400).json({ error: 'Name, duration, and price are required' });
        }
        const treatment = await prisma.treatment.create({
            data: buildTreatmentUpdateData({ isActive: true, showOnWeb: true, ...req.body }) as Parameters<typeof prisma.treatment.create>[0]['data'],
            include: { _count: { select: { appointments: true, patientTreatments: true } } },
        });
        if (req.user) {
            await logAudit({ userId: req.user.id, action: 'CREATE_TREATMENT', entity: 'Treatment', entityId: treatment.id, ipAddress: ipFromReq(req) });
        }
        return res.status(201).json({ treatment });
    } catch (error) {
        console.error('Create treatment error:', error);
        return res.status(500).json({ error: 'Failed to create treatment' });
    }
});

router.put('/:id', requireAuth, requireRole('ADMIN'), async (req: Request, res: Response) => {
    try {
        const existing = await prisma.treatment.findFirst({ where: { id: req.params.id, deletedAt: null } });
        if (!existing) return res.status(404).json({ error: 'Treatment not found' });
        const treatment = await prisma.treatment.update({
            where: { id: req.params.id },
            data: buildTreatmentUpdateData(req.body, existing),
            include: { _count: { select: { appointments: true, patientTreatments: true } } },
        });
        if (req.user) {
            await logAudit({ userId: req.user.id, action: 'UPDATE_TREATMENT', entity: 'Treatment', entityId: req.params.id, ipAddress: ipFromReq(req) });
        }
        return res.json({ treatment });
    } catch (error) {
        console.error('Update treatment error:', error);
        return res.status(500).json({ error: 'Failed to update treatment' });
    }
});

router.patch('/:id/archive', requireAuth, requireRole('ADMIN'), async (req: Request, res: Response) => {
    try {
        const treatment = await prisma.treatment.update({
            where: { id: req.params.id },
            data: { deletedAt: new Date(), isActive: false, showOnWeb: false },
        });
        if (req.user) {
            await logAudit({ userId: req.user.id, action: 'ARCHIVE_TREATMENT', entity: 'Treatment', entityId: req.params.id, ipAddress: ipFromReq(req) });
        }
        return res.json({ success: true, treatment });
    } catch {
        return res.status(500).json({ error: 'Failed to archive treatment' });
    }
});

router.delete('/:id', requireAuth, requireRole('ADMIN'), async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const [apptCount, planCount] = await Promise.all([
            prisma.appointment.count({ where: { treatmentId: id } }),
            prisma.patientTreatment.count({ where: { treatmentId: id } }),
        ]);
        const totalRefs = apptCount + planCount;
        if (totalRefs > 0) {
            return res.status(409).json({
                error: `Cannot delete — ${totalRefs} booking(s) or care plan(s) reference this treatment. Archive or hide it instead.`,
            });
        }
        await prisma.treatment.delete({ where: { id } });
        if (req.user) {
            await logAudit({ userId: req.user.id, action: 'DELETE_TREATMENT', entity: 'Treatment', entityId: id, ipAddress: ipFromReq(req) });
        }
        return res.json({ success: true });
    } catch (error) {
        console.error('Delete treatment error:', error);
        return res.status(500).json({ error: 'Failed to delete treatment' });
    }
});

export default router;
