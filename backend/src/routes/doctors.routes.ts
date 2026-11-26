import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';
import { requireAuth, requireRole } from '../middleware/auth.middleware';
import { z } from 'zod';
import { logger } from '../lib/logger';
import { logAudit } from '../lib/audit';

const router = Router();

const cleanString = (fallback: string) =>
    z.string().optional().nullable().transform((val) => (val && val.trim() ? val.trim() : fallback));

const doctorCreateSchema = z.object({
    name: z.string().min(2, 'Doctor name is required (min 2 characters)'),
    role: z.string().min(2, 'Role / clinical designation is required'),
    pmdcReg: z.string().min(2, 'PMDC Registration number is required'),
    qualifications: cleanString('BDS'),
    experience: cleanString('Qualified Practitioner'),
    specialty: cleanString('General Dental Surgery & Care'),
    operatory: cleanString('Main Operatory'),
    schedule: cleanString('Mon – Fri: 12:00 PM – 8:00 PM'),
    consultationFee: z.coerce.number().int().min(0).default(2000),
    image: cleanString(''),
    isLead: z.boolean().optional().default(false),
    isActive: z.boolean().optional().default(true),
});

const doctorUpdateSchema = z.object({
    name: z.string().min(2, 'Doctor name is required').optional(),
    role: z.string().min(2, 'Role / clinical designation is required').optional(),
    pmdcReg: z.string().min(2, 'PMDC Registration number is required').optional(),
    qualifications: z.string().optional(),
    experience: z.string().optional(),
    specialty: z.string().optional(),
    operatory: z.string().optional(),
    schedule: z.string().optional(),
    consultationFee: z.coerce.number().int().min(0).optional(),
    image: z.string().optional(),
    isLead: z.boolean().optional(),
    isActive: z.boolean().optional(),
});

// GET /api/doctors - Public list of active doctors
router.get('/', async (_req: Request, res: Response) => {
    try {
        const doctors = await prisma.doctor.findMany({
            where: { isActive: true },
            orderBy: [{ isLead: 'desc' }, { name: 'asc' }],
            include: {
                _count: {
                    select: { appointments: true },
                },
            },
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
            include: {
                _count: {
                    select: { appointments: true },
                },
            },
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
            const firstError = Object.values(parsed.error.flatten().fieldErrors).flat()[0] || 'Validation failed';
            return res.status(400).json({
                error: firstError,
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
            const firstError = Object.values(parsed.error.flatten().fieldErrors).flat()[0] || 'Validation failed';
            return res.status(400).json({
                error: firstError,
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
        if (req.user) {
            await logAudit({
                userId: req.user.id,
                action: 'DELETE_DOCTOR',
                entity: 'Doctor',
                entityId: id,
                details: { name: doctor.name },
                ipAddress: (req.headers['x-forwarded-for'] as string | undefined)?.split(',')[0]?.trim() || req.ip,
            });
        }
        return res.json({ success: true, message: `Doctor ${doctor.name} successfully deleted.` });
    } catch (error) {
        logger.error({ err: error }, 'Failed to delete doctor');
        return res.status(500).json({ error: 'Failed to delete doctor profile' });
    }
});

export default router;
