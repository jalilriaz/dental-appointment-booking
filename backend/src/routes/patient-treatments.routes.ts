import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';
import { requireAuth, requireRole } from '../middleware/auth.middleware';
import { logAudit } from '../lib/audit';

const router = Router();

// POST /api/patient-treatments - Create new patient treatment plan
// GET /api/patient-treatments/:id - Fetch treatment plan with all payments and appointments
router.post('/', requireAuth, requireRole('ADMIN', 'STAFF'), async (req: Request, res: Response) => {
    try {
        const { patientId, treatmentId, totalCost, initialPayment, method, notes, totalSessions } = req.body;

        if (!patientId || !treatmentId || totalCost === undefined) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const isFullyPaid = (initialPayment || 0) >= totalCost;
        const isPartiallyPaid = (initialPayment || 0) > 0 && !isFullyPaid;

        const patientTreatment = await prisma.patientTreatment.create({
            data: {
                patientId,
                treatmentId,
                totalCost,
                totalSessions: totalSessions ? Math.max(1, parseInt(totalSessions, 10)) : 1,
                clinicalStatus: 'IN_PROGRESS',
                financialStatus: isFullyPaid ? 'FULLY_PAID' : isPartiallyPaid ? 'PARTIALLY_PAID' : 'UNPAID',
                status: isFullyPaid ? 'FULLY_PAID' : 'ONGOING',
                payments: initialPayment > 0 ? {
                    create: {
                        amount: initialPayment,
                        method: method || 'CASH',
                        notes: notes || 'Initial downpayment',
                    },
                } : undefined,
            },
            include: {
                treatment: true,
                payments: { orderBy: { date: 'asc' } },
            },
        });

        return res.status(201).json(patientTreatment);
    } catch (error) {
        console.error('Error creating patient treatment:', error);
        return res.status(500).json({ error: 'Failed to create patient treatment' });
    }
});

// GET /api/patient-treatments/:id - Get complete plan details with payment history
router.get('/:id', requireAuth, requireRole('ADMIN', 'STAFF'), async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const plan = await prisma.patientTreatment.findUnique({
            where: { id },
            include: {
                treatment: true,
                patient: {
                    select: {
                        id: true,
                        name: true,
                        phone: true,
                        patientCode: true,
                        gender: true,
                        dateOfBirth: true,
                    },
                },
                payments: {
                    orderBy: { date: 'asc' },
                },
                appointments: {
                    orderBy: { startTime: 'asc' },
                    select: {
                        id: true,
                        startTime: true,
                        status: true,
                        sessionNumber: true,
                        sessionLabel: true,
                        amountPaid: true,
                        doctor: { select: { id: true, name: true, role: true } },
                    },
                },
            },
        });

        if (!plan) {
            return res.status(404).json({ error: 'Treatment plan not found' });
        }

        const totalPaid = Math.max(
            0,
            plan.payments.reduce((sum, p) => sum + (p.type === 'REFUND' ? -p.amount : p.amount), 0)
        );
        const remainingDue = Math.max(0, plan.totalCost - totalPaid);

        return res.json({
            ...plan,
            totalPaid,
            remainingDue,
        });
    } catch (error) {
        console.error('Error fetching treatment plan:', error);
        return res.status(500).json({ error: 'Failed to fetch treatment plan' });
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

        const shiftNow = new Date(Date.now() + 5 * 3600 * 1000);
        const closingDateUtc = new Date(Date.UTC(shiftNow.getUTCFullYear(), shiftNow.getUTCMonth(), shiftNow.getUTCDate()));
        const closingLock = await prisma.dailyClosing.findUnique({ where: { closingDate: closingDateUtc }, select: { status: true } });
        if (closingLock?.status === 'APPROVED') {
            return res.status(409).json({ error: 'Today is closed and locked. Reopen Daily Closing before recording payments.' });
        }

        const newPayment = await prisma.payment.create({
            data: {
                patientTreatmentId: id,
                amount,
                method: method || 'CASH',
                notes: notes || null,
                appointmentId: appointmentId || null,
                recordedById: req.user?.id || null,
            },
        });

        if (req.user) {
            await logAudit({
                userId: req.user.id,
                action: 'RECORD_PAYMENT',
                entity: 'Payment',
                entityId: newPayment.id,
                details: { patientTreatmentId: id, appointmentId: appointmentId || null, amount, method: method || 'CASH' },
                ipAddress: (req.headers['x-forwarded-for'] as string | undefined)?.split(',')[0]?.trim() || req.ip,
            });
        }

        const netPaid = Math.max(
            0,
            patientTreatment.payments.reduce((sum, p) => sum + (p.type === 'REFUND' ? -p.amount : p.amount), 0) + amount
        );
        const isFullyPaid = netPaid >= patientTreatment.totalCost;

        await prisma.patientTreatment.update({
            where: { id },
            data: {
                financialStatus: isFullyPaid ? 'FULLY_PAID' : 'PARTIALLY_PAID',
                status: isFullyPaid ? 'FULLY_PAID' : 'ONGOING',
            },
        });

        return res.status(201).json({
            payment: newPayment,
            totalPaid: netPaid,
            remainingDue: Math.max(0, patientTreatment.totalCost - netPaid),
            isFullyPaid,
        });
    } catch (error) {
        console.error('Error adding payment:', error);
        return res.status(500).json({ error: 'Failed to add payment' });
    }
});

export default router;

