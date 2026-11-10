import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';
import { requireAuth, requireRole } from '../middleware/auth.middleware';
import { z } from 'zod';
import { logger } from '../lib/logger';

const router = Router();

const updatePatientSchema = z.object({
    medicalAlerts: z.string().max(1000).optional().nullable(),
});

// GET /api/patients/:id - Fetch patient details
router.get('/:id', requireAuth, requireRole('ADMIN', 'STAFF'), async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const patient = await prisma.user.findUnique({
            where: { id },
            include: {
                appointments: {
                    include: {
                        treatment: { select: { name: true, price: true, durationMin: true } },
                    },
                    orderBy: { startTime: 'desc' },
                },
                _count: { select: { appointments: true } },
            },
        });

        if (!patient) {
            return res.status(404).json({ error: 'Patient not found' });
        }

        return res.json({ patient });
    } catch (error) {
        console.error('Fetch patient details error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// PATCH /api/patients/:id - Update patient details (Admin only)
router.patch('/:id', requireAuth, requireRole('ADMIN'), async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const parseResult = updatePatientSchema.safeParse(req.body);
        if (!parseResult.success) {
            return res.status(400).json({ error: 'Invalid data format or length' });
        }

        const { medicalAlerts } = parseResult.data;

        const patient = await prisma.user.update({
            where: { id },
            data: {
                medicalAlerts: medicalAlerts !== undefined ? medicalAlerts || null : undefined,
            },
            select: { id: true, medicalAlerts: true },
        });

        logger.info({ patientId: id, medicalAlerts }, 'Updated patient medical alerts');
        return res.json({ success: true, patient });
    } catch (error) {
        console.error('Update patient details error:', error);
        return res.status(500).json({ error: 'Failed to update patient' });
    }
});

// GET /api/patients/:id/history - Complete patient history
router.get('/:id/history', requireAuth, requireRole('ADMIN', 'STAFF'), async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const patient = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                patientCode: true,
                createdAt: true,
            },
        });

        if (!patient) {
            return res.status(404).json({ error: 'Patient not found' });
        }

        const patientTreatments = await prisma.patientTreatment.findMany({
            where: { patientId: id },
            include: {
                treatment: true,
                payments: { orderBy: { date: 'desc' } },
                appointments: {
                    orderBy: { startTime: 'asc' },
                    include: {
                        treatment: true,
                        clinicalNotes: true,
                    },
                },
            },
            orderBy: { startDate: 'desc' },
        });

        const plans = patientTreatments.map((pt) => {
            const totalPaid = pt.payments.reduce((sum, p) => sum + p.amount, 0);
            const remainingBalance = Math.max(0, pt.totalCost - totalPaid);
            const completedSessions = pt.appointments.filter((a) => a.status === 'COMPLETED').length;
            const scheduledSessions = pt.appointments.filter((a) => a.status === 'SCHEDULED').length;

            return {
                ...pt,
                totalPaid,
                remainingBalance,
                completedSessions,
                scheduledSessions,
            };
        });

        const appointments = await prisma.appointment.findMany({
            where: { patientId: id },
            include: {
                treatment: { select: { name: true, price: true, durationMin: true } },
                clinicalNotes: { orderBy: { createdAt: 'desc' } },
                patientTreatment: {
                    select: {
                        id: true,
                        totalCost: true,
                        totalSessions: true,
                        clinicalStatus: true,
                        financialStatus: true,
                    },
                },
                payments: true,
            },
            orderBy: { startTime: 'desc' },
        });

        const allPayments = await prisma.payment.findMany({
            where: {
                OR: [
                    { appointment: { patientId: id } },
                    { patientTreatment: { patientId: id } },
                ],
            },
            include: {
                appointment: {
                    select: {
                        treatment: { select: { name: true } },
                        sessionNumber: true,
                        sessionLabel: true,
                    },
                },
            },
            orderBy: { date: 'desc' },
        });

        const totalRevenueCollected = allPayments.reduce((sum, p) => sum + p.amount, 0);

        return res.json({
            patient,
            plans,
            appointments,
            allPayments,
            totalRevenueCollected,
        });
    } catch (error) {
        console.error('Fetch patient history error:', error);
        return res.status(500).json({ error: 'Failed to fetch history' });
    }
});

export default router;

