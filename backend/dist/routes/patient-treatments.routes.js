"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../lib/prisma"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// POST /api/patient-treatments - Create new patient treatment plan
// GET /api/patient-treatments/:id - Fetch treatment plan with all payments and appointments
router.post('/', auth_middleware_1.requireAuth, (0, auth_middleware_1.requireRole)('ADMIN', 'STAFF'), async (req, res) => {
    try {
        const { patientId, treatmentId, totalCost, initialPayment, method, notes, totalSessions } = req.body;
        if (!patientId || !treatmentId || totalCost === undefined) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const isFullyPaid = (initialPayment || 0) >= totalCost;
        const isPartiallyPaid = (initialPayment || 0) > 0 && !isFullyPaid;
        const patientTreatment = await prisma_1.default.patientTreatment.create({
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
    }
    catch (error) {
        console.error('Error creating patient treatment:', error);
        return res.status(500).json({ error: 'Failed to create patient treatment' });
    }
});
// GET /api/patient-treatments/:id - Get complete plan details with payment history
router.get('/:id', auth_middleware_1.requireAuth, (0, auth_middleware_1.requireRole)('ADMIN', 'STAFF'), async (req, res) => {
    try {
        const { id } = req.params;
        const plan = await prisma_1.default.patientTreatment.findUnique({
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
        const totalPaid = plan.payments.reduce((sum, p) => sum + p.amount, 0);
        const remainingDue = Math.max(0, plan.totalCost - totalPaid);
        return res.json({
            ...plan,
            totalPaid,
            remainingDue,
        });
    }
    catch (error) {
        console.error('Error fetching treatment plan:', error);
        return res.status(500).json({ error: 'Failed to fetch treatment plan' });
    }
});
// POST /api/patient-treatments/:id/payments - Record installment payment
router.post('/:id/payments', auth_middleware_1.requireAuth, (0, auth_middleware_1.requireRole)('ADMIN', 'STAFF'), async (req, res) => {
    try {
        const { id } = req.params;
        const { amount, method, notes, appointmentId } = req.body;
        if (!amount || amount <= 0) {
            return res.status(400).json({ error: 'Invalid payment amount' });
        }
        const patientTreatment = await prisma_1.default.patientTreatment.findUnique({
            where: { id },
            include: { payments: true },
        });
        if (!patientTreatment) {
            return res.status(404).json({ error: 'Treatment plan not found' });
        }
        const newPayment = await prisma_1.default.payment.create({
            data: {
                patientTreatmentId: id,
                amount,
                method: method || 'CASH',
                notes: notes || null,
                appointmentId: appointmentId || null,
            },
        });
        const totalPaid = patientTreatment.payments.reduce((sum, p) => sum + p.amount, 0) + amount;
        const isFullyPaid = totalPaid >= patientTreatment.totalCost;
        await prisma_1.default.patientTreatment.update({
            where: { id },
            data: {
                financialStatus: isFullyPaid ? 'FULLY_PAID' : 'PARTIALLY_PAID',
                status: isFullyPaid ? 'FULLY_PAID' : 'ONGOING',
            },
        });
        return res.status(201).json({
            payment: newPayment,
            totalPaid,
            remainingDue: Math.max(0, patientTreatment.totalCost - totalPaid),
            isFullyPaid,
        });
    }
    catch (error) {
        console.error('Error adding payment:', error);
        return res.status(500).json({ error: 'Failed to add payment' });
    }
});
exports.default = router;
//# sourceMappingURL=patient-treatments.routes.js.map