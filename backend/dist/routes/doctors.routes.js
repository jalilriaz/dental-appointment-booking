"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../lib/prisma"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const zod_1 = require("zod");
const logger_1 = require("../lib/logger");
const router = (0, express_1.Router)();
const cleanString = (fallback) => zod_1.z.string().optional().nullable().transform((val) => (val && val.trim() ? val.trim() : fallback));
const doctorCreateSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Doctor name is required (min 2 characters)'),
    role: zod_1.z.string().min(2, 'Role / clinical designation is required'),
    pmdcReg: zod_1.z.string().min(2, 'PMDC Registration number is required'),
    qualifications: cleanString('BDS'),
    experience: cleanString('Qualified Practitioner'),
    specialty: cleanString('General Dental Surgery & Care'),
    operatory: cleanString('Chair 1 · Surgical Suite A'),
    schedule: cleanString('Mon – Fri: 12:00 PM – 8:00 PM'),
    consultationFee: zod_1.z.coerce.number().int().min(0).default(2000),
    image: cleanString('/dr_sheriyaar.webp'),
    isLead: zod_1.z.boolean().optional().default(false),
    isActive: zod_1.z.boolean().optional().default(true),
});
const doctorUpdateSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Doctor name is required').optional(),
    role: zod_1.z.string().min(2, 'Role / clinical designation is required').optional(),
    pmdcReg: zod_1.z.string().min(2, 'PMDC Registration number is required').optional(),
    qualifications: zod_1.z.string().optional(),
    experience: zod_1.z.string().optional(),
    specialty: zod_1.z.string().optional(),
    operatory: zod_1.z.string().optional(),
    schedule: zod_1.z.string().optional(),
    consultationFee: zod_1.z.coerce.number().int().min(0).optional(),
    image: zod_1.z.string().optional(),
    isLead: zod_1.z.boolean().optional(),
    isActive: zod_1.z.boolean().optional(),
});
// GET /api/doctors - Public list of active doctors
router.get('/', async (_req, res) => {
    try {
        const doctors = await prisma_1.default.doctor.findMany({
            where: { isActive: true },
            orderBy: [{ isLead: 'desc' }, { name: 'asc' }],
            include: {
                _count: {
                    select: { appointments: true },
                },
            },
        });
        return res.json({ success: true, doctors });
    }
    catch (error) {
        logger_1.logger.error(error, 'Failed to fetch public doctors');
        return res.status(500).json({ error: 'Failed to fetch doctors' });
    }
});
// GET /api/doctors/admin/all - Admin/Staff directory of all doctors with telemetry
router.get('/admin/all', auth_middleware_1.requireAuth, (0, auth_middleware_1.requireRole)('ADMIN', 'STAFF'), async (_req, res) => {
    try {
        const doctors = await prisma_1.default.doctor.findMany({
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
    }
    catch (error) {
        logger_1.logger.error({ err: error }, 'Failed to fetch admin doctor directory');
        return res.status(500).json({ error: 'Failed to fetch doctor directory' });
    }
});
// POST /api/doctors - Admin only: Add a new doctor
router.post('/', auth_middleware_1.requireAuth, (0, auth_middleware_1.requireRole)('ADMIN'), async (req, res) => {
    try {
        const parsed = doctorCreateSchema.safeParse(req.body);
        if (!parsed.success) {
            const firstError = Object.values(parsed.error.flatten().fieldErrors).flat()[0] || 'Validation failed';
            return res.status(400).json({
                error: firstError,
                details: parsed.error.flatten().fieldErrors,
            });
        }
        const newDoctor = await prisma_1.default.doctor.create({
            data: parsed.data,
        });
        logger_1.logger.info(`Doctor created: ${newDoctor.name} (${newDoctor.id})`);
        return res.status(201).json({ success: true, doctor: newDoctor });
    }
    catch (error) {
        logger_1.logger.error({ err: error }, 'Failed to create doctor');
        return res.status(500).json({ error: 'Failed to create doctor profile' });
    }
});
// PATCH /api/doctors/:id - Admin only: Update doctor / Toggle active status
router.patch('/:id', auth_middleware_1.requireAuth, (0, auth_middleware_1.requireRole)('ADMIN'), async (req, res) => {
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
        const existing = await prisma_1.default.doctor.findUnique({ where: { id } });
        if (!existing) {
            return res.status(404).json({ error: 'Doctor not found' });
        }
        const updated = await prisma_1.default.doctor.update({
            where: { id },
            data: parsed.data,
        });
        logger_1.logger.info(`Doctor updated: ${updated.name} (${updated.id})`);
        return res.json({ success: true, doctor: updated });
    }
    catch (error) {
        logger_1.logger.error({ err: error }, 'Failed to update doctor');
        return res.status(500).json({ error: 'Failed to update doctor profile' });
    }
});
// DELETE /api/doctors/:id - Admin only: Delete doctor (protected if isLead)
router.delete('/:id', auth_middleware_1.requireAuth, (0, auth_middleware_1.requireRole)('ADMIN'), async (req, res) => {
    try {
        const { id } = req.params;
        const doctor = await prisma_1.default.doctor.findUnique({ where: { id } });
        if (!doctor) {
            return res.status(404).json({ error: 'Doctor not found' });
        }
        if (doctor.isLead) {
            return res.status(403).json({
                error: 'Protected Profile: The Lead Dental Surgeon cannot be deleted from the system.',
            });
        }
        await prisma_1.default.doctor.delete({ where: { id } });
        logger_1.logger.info(`Doctor deleted: ${doctor.name} (${doctor.id})`);
        return res.json({ success: true, message: `Doctor ${doctor.name} successfully deleted.` });
    }
    catch (error) {
        logger_1.logger.error({ err: error }, 'Failed to delete doctor');
        return res.status(500).json({ error: 'Failed to delete doctor profile' });
    }
});
exports.default = router;
//# sourceMappingURL=doctors.routes.js.map