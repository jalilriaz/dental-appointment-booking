import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';
import { requireAuth, requireRole } from '../middleware/auth.middleware';
import { z } from 'zod';
import { logger } from '../lib/logger';

const router = Router();

const doctorCreateSchema = z.object({
    name: z.string().min(2, 'Doctor name is required'),
    role: z.string().min(2, 'Role / clinical designation is required'),
    pmdcReg: z.string().min(2, 'PMDC Registration number is required'),
    qualifications: z.string().min(2, 'Qualifications are required'),
    experience: z.string().min(1, 'Experience is required'),
    specialty: z.string().min(2, 'Specialty is required'),
    operatory: z.string().min(2, 'Operatory / Chair assignment is required'),
    schedule: z.string().min(2, 'Schedule / consultation hours are required'),
    consultationFee: z.number().int().min(0).default(2000),
    image: z.string().optional().default('/images/dr_sheriyaar.jpg'),
    isLead: z.boolean().optional().default(false),
    isActive: z.boolean().optional().default(true),
});

const doctorUpdateSchema = doctorCreateSchema.partial();

// GET /api/doctors - Public list of active doctors
router.get('/', async (_req: Request, res: Response) => {
    try {
        const doctors = await prisma.doctor.findMany({
            where: { isActive: true },
            orderBy: [{ isLead: 'desc' }, { name: 'asc' }],
        });
        return res.json({ success: true, doctors });
    } catch (error) {
        logger.error(error, 'Failed to fetch public doctors');
        return res.status(500).json({ error: 'Failed to fetch doctors' });
    }
});

// GET /api/doctors/admin/all - Admin/Staff directory of all doctors with telemetry
router.get('/admin/all', requireAuth, requireRole('ADMIN', 'STAFF'), async (_req: Request, res: Response) => {
    try {
        const doctors = await prisma.doctor.findMany({
            orderBy: [{ isLead: 'desc' }, { createdAt: 'asc' }],
        });

        const activeCount = doctors.filter(d => d.isActive).length;
        const totalCount = doctors.length;

        return res.json({
            success: true,
            doctors,
            metrics: {
                totalCount,
                activeCount,
                inactiveCount: totalCount - activeCount,
            },
        });
    } catch (error) {
        logger.error({ err: error }, 'Failed to fetch admin doctor directory');
        return res.status(500).json({ error: 'Failed to fetch doctor directory' });
    }
});

// POST /api/doctors - Admin only: Add a new doctor
router.post('/', requireAuth, requireRole('ADMIN'), async (req: Request, res: Response) => {
    try {
        const parsed = doctorCreateSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({
                error: 'Validation failed',
                details: parsed.error.flatten().fieldErrors,
            });
        }

        const newDoctor = await prisma.doctor.create({
            data: parsed.data,
        });

        logger.info(`Doctor created: ${newDoctor.name} (${newDoctor.id})`);
        return res.status(201).json({ success: true, doctor: newDoctor });
    } catch (error) {
        logger.error({ err: error }, 'Failed to create doctor');
        return res.status(500).json({ error: 'Failed to create doctor profile' });
    }
});

// PATCH /api/doctors/:id - Admin only: Update doctor / Toggle active status
router.patch('/:id', requireAuth, requireRole('ADMIN'), async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const parsed = doctorUpdateSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({
                error: 'Validation failed',
                details: parsed.error.flatten().fieldErrors,
            });
        }

        const existing = await prisma.doctor.findUnique({ where: { id } });
        if (!existing) {
            return res.status(404).json({ error: 'Doctor not found' });
        }

        const updated = await prisma.doctor.update({
            where: { id },
            data: parsed.data,
        });

        logger.info(`Doctor updated: ${updated.name} (${updated.id})`);
        return res.json({ success: true, doctor: updated });
    } catch (error) {
        logger.error({ err: error }, 'Failed to update doctor');
        return res.status(500).json({ error: 'Failed to update doctor profile' });
    }
});

// DELETE /api/doctors/:id - Admin only: Delete doctor (protected if isLead)
router.delete('/:id', requireAuth, requireRole('ADMIN'), async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const doctor = await prisma.doctor.findUnique({ where: { id } });

        if (!doctor) {
            return res.status(404).json({ error: 'Doctor not found' });
        }

        if (doctor.isLead) {
            return res.status(403).json({
                error: 'Protected Profile: The Lead Dental Surgeon cannot be deleted from the system.',
            });
        }

        await prisma.doctor.delete({ where: { id } });
        logger.info(`Doctor deleted: ${doctor.name} (${doctor.id})`);
        return res.json({ success: true, message: `Doctor ${doctor.name} successfully deleted.` });
    } catch (error) {
        logger.error({ err: error }, 'Failed to delete doctor');
        return res.status(500).json({ error: 'Failed to delete doctor profile' });
    }
});

export default router;
