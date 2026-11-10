import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';
import { requireAuth, requireRole } from '../middleware/auth.middleware';

const router = Router();

// POST /api/patient-treatments - Create new patient treatment plan
router.post('/', requireAuth, requireRole('ADMIN', 'STAFF'), async (req: Request, res: Response) => {
    try {
        const { patientId, treatmentId, totalCost, initialPayment, method, notes } = req.body;

        if (!patientId || !treatmentId || totalCost === undefined) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const patientTreatment = await prisma.patientTreatment.create({
            data: {
                patientId,
                treatmentId,
                totalCost,
                status: initialPayment >= totalCost ? 'FULLY_PAID' : 'ONGOING',
                payments: initialPayment > 0 ? {
                    create: {
                        amount: initialPayment,
                        method: method || 'CASH',
                        notes: notes || 'Initial payment',
                    },
                } : undefined,
            },
            include: {
                treatment: true,
                payments: true,
            },
        });

        return res.status(201).json(patientTreatment);
    } catch (error) {
        console.error('Error creating patient treatment:', error);
        return res.status(500).json({ error: 'Failed to create patient treatment' });
    }
});

// POST /api/patient-treatments/:id/payments - Record installment payment
router.post('/:id/payments', requireAuth, requireRole('ADMIN', 'STAFF'), async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { amount, method, notes, appointmentId } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({ error: 'Invalid payment amount' });
        }

        const patientTreatment = await prisma.patientTreatment.findUnique({
            where: { id },
            include: { payments: true },
        });

        if (!patientTreatment) {
            return res.status(404).json({ error: 'Treatment plan not found' });
        }

        const newPayment = await prisma.payment.create({
            data: {
                patientTreatmentId: id,
                amount,
                method: method || 'CASH',
                notes: notes || null,
                appointmentId: appointmentId || null,
            },
        });

        const totalPaid = patientTreatment.payments.reduce((sum, p) => sum + p.amount, 0) + amount;

        if (totalPaid >= patientTreatment.totalCost && patientTreatment.status !== 'FULLY_PAID') {
            await prisma.patientTreatment.update({
                where: { id },
                data: { status: 'FULLY_PAID' },
            });
        }

        return res.status(201).json(newPayment);
    } catch (error) {
        console.error('Error adding payment:', error);
        return res.status(500).json({ error: 'Failed to add payment' });
    }
});

export default router;

