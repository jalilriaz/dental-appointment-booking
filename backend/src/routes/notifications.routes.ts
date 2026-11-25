import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';
import { requireAuth, requireRole } from '../middleware/auth.middleware';
import { formatTime } from '../lib/utils';

const router = Router();

interface NotificationItem {
    id: string;
    title: string;
    description: string;
    meta: string;
    status: string;
    createdAt: string;
    searchTerm: string;
}

// GET /api/notifications - Live clinical notifications from recent appointments
router.get('/', requireAuth, requireRole('ADMIN', 'STAFF'), async (_req: Request, res: Response) => {
    try {
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
        const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
        const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);

        const recentAppointments = await prisma.appointment.findMany({
            where: {
                OR: [
                    { startTime: { gte: todayStart, lte: todayEnd } },
                    { createdAt: { gte: last24h } },
                ],
            },
            include: {
                patient: { select: { name: true, phone: true } },
                treatment: { select: { name: true } },
            },
            orderBy: { createdAt: 'desc' },
            take: 8,
        });

        const notifications: NotificationItem[] = recentAppointments.map((apt) => {
            const patientName = apt.guestName || apt.patient?.name || 'Patient';
            const timeStr = formatTime(apt.startTime);
            const treatmentName = apt.treatment?.name || 'Dental Consultation';
            const channelLabel =
                apt.bookedBy === 'WHATSAPP_BOT'
                    ? 'WhatsApp Bot'
                    : apt.bookedBy === 'WEBSITE'
                        ? 'Website Portal'
                        : 'Walk-In Desk';

            let title = `${channelLabel} Booking`;
            let description = `${patientName} scheduled for ${treatmentName} at ${timeStr}.`;

            if (apt.status === 'COMPLETED') {
                const paid = apt.amountPaid ?? 0;
                title = 'Patient Checked Out';
                description = `${patientName} completed ${treatmentName} (Rs. ${paid.toLocaleString()}).`;
            } else if (apt.status === 'CANCELLED') {
                title = 'Appointment Cancelled';
                description = `${patientName}'s ${treatmentName} slot (${timeStr}) was cancelled.`;
            } else if (apt.status === 'Not_Visited') {
                title = 'Marked Not Visited';
                description = `${patientName} missed ${treatmentName} (${timeStr}).`;
            }

            return {
                id: apt.id,
                title,
                description,
                meta: `${channelLabel} · G-8 Markaz`,
                status: apt.status,
                createdAt: apt.createdAt.toISOString(),
                searchTerm: apt.guestName || apt.patient?.name || apt.guestPhone || apt.patient?.phone || '',
            };
        });

        return res.json({ notifications });
    } catch (error) {
        console.error('Fetch live notifications error:', error);
        return res.status(500).json({ error: 'Failed to load notifications' });
    }
});

// PATCH /api/notifications/:id
router.patch('/:id', requireAuth, requireRole('ADMIN', 'STAFF'), (req: Request, res: Response) => {
    return res.json({ success: true, id: req.params.id });
});

export default router;
