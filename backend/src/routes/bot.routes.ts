import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';
import { botAuthMiddleware } from '../lib/auth-bot';
import { createAppointment } from '../lib/bookingService';
import { deleteCalendarEvent, updateCalendarEvent } from '../lib/googleCalendar';
import { normalizePhone } from '../lib/phone';
import { formatTime, formatDate } from '../lib/utils';
import {
    isSundayInKarachi,
    parseKarachiDateTime,
    getKarachiDayBoundaries,
    getKarachiTodayStr,
} from '../lib/timezone';

const router = Router();

// Apply timing-safe bot authorization to all bot endpoints
router.use(botAuthMiddleware);

// POST /api/bot/check-availability
router.post('/check-availability', async (req: Request, res: Response) => {
    try {
        const { date, time, serviceType, treatmentId } = req.body;
        if (!date || !time) {
            return res.status(400).json({ message: 'Missing date or time' });
        }

        if (isSundayInKarachi(date)) {
            return res.json({
                isAvailable: false,
                message: 'The clinic is closed on Sundays. Please select a different day (Monday-Saturday).',
            });
        }

        let treatmentDuration = 30;
        let treatmentName = 'Standard';
        if (treatmentId) {
            const tr = await prisma.treatment.findUnique({ where: { id: treatmentId } });
            if (tr) {
                treatmentDuration = tr.durationMin || 30;
                treatmentName = tr.name;
            }
        } else if (serviceType) {
            const tr = await prisma.treatment.findFirst({
                where: { name: { contains: serviceType, mode: 'insensitive' } },
            });
            if (tr) {
                treatmentDuration = tr.durationMin || 30;
                treatmentName = tr.name;
            }
        }

        const startTimeStamp = parseKarachiDateTime(date, time);
        const endTimeStamp = new Date(startTimeStamp.getTime() + treatmentDuration * 60000);

        // Check clinic working hours
        const settings = await prisma.systemSettings.findUnique({ where: { id: 'settings' } });
        const workEnd = settings?.workDayEnd || '21:00';
        const [endH, endM] = workEnd.split(':').map(Number);
        const { endOfDay } = getKarachiDayBoundaries(date);
        const closingTime = new Date(endOfDay);
        closingTime.setHours(endH, endM, 0, 0);

        if (endTimeStamp.getTime() > closingTime.getTime()) {
            return res.json({
                isAvailable: false,
                message: `The clinic closes at ${workEnd}. A ${treatmentDuration}-minute treatment starting at ${time} cannot be accommodated.`,
            });
        }

        const existingAppointment = await prisma.appointment.findFirst({
            where: {
                status: { notIn: ['CANCELLED'] },
                AND: [
                    { startTime: { lt: endTimeStamp } },
                    { endTime: { gt: startTimeStamp } },
                ],
            },
        });

        if (existingAppointment) {
            return res.json({
                isAvailable: false,
                message: 'This time slot is already booked or overlaps with an existing appointment.',
            });
        }

        return res.json({
            isAvailable: true,
            durationMin: treatmentDuration,
            treatmentName,
            message: `Time slot is available for ${treatmentName} (${treatmentDuration} min)!`,
        });
    } catch (error) {
        console.error('Error in check-availability:', error);
        return res.status(500).json({ message: 'Internal server error while checking availability.' });
    }
});

// POST /api/bot/book-appointment
router.post('/book-appointment', async (req: Request, res: Response) => {
    try {
        const { patientName, phone, age, date, time, serviceType, patientTreatmentId } = req.body;

        if (!patientName || !phone || !date || !time) {
            return res.status(400).json({
                message: 'Missing required fields: please provide patientName, phone, date, and time',
            });
        }

        let treatmentId: string | undefined = undefined;
        if (serviceType) {
            const treatment = await prisma.treatment.findFirst({
                where: {
                    name: { contains: serviceType, mode: 'insensitive' },
                },
            });
            if (treatment) {
                treatmentId = treatment.id;
            }
        }

        const result = await createAppointment({
            patientName,
            phone,
            age,
            date,
            time,
            treatmentId: treatmentId as string,
            bookedBy: 'WHATSAPP_BOT',
            patientTreatmentId: patientTreatmentId || undefined,
            notes: `Booked via WhatsApp for ${patientName}. Age: ${age || 'N/A'}. Service: ${serviceType || 'Standard'}`,
        });

        if (!result.success) {
            return res.status(result.status || 400).json({
                message: result.error || 'Failed to book appointment.',
            });
        }

        return res.status(201).json({
            message: 'Appointment successfully created!',
            appointment: result.appointment,
        });
    } catch (error) {
        console.error('Bot booking error:', error);
        return res.status(500).json({ message: 'Internal server error while processing the appointment.' });
    }
});

// PATCH /api/bot/cancel
router.patch('/cancel', async (req: Request, res: Response) => {
    try {
        const { phone, currentDate, appointmentId } = req.body;
        if (!phone) {
            return res.status(400).json({ message: 'Missing required fields: please provide phone' });
        }

        const canonicalPhone = normalizePhone(phone);
        const patient = await prisma.user.findFirst({
            where: { phone: canonicalPhone },
        });

        if (!patient) {
            return res.status(404).json({ message: 'Patient not found with this phone number.' });
        }

        let appointmentQuery: any = {
            patientId: patient.id,
            status: { in: ['SCHEDULED', 'RESCHEDULED'] },
            startTime: { gt: new Date() },
        };

        if (appointmentId) {
            appointmentQuery.id = appointmentId;
        } else if (currentDate) {
            const { startOfDay, endOfDay } = getKarachiDayBoundaries(currentDate);
            appointmentQuery.startTime = { gte: startOfDay, lte: endOfDay };
        } else {
            const upcomingAppointments = await prisma.appointment.findMany({
                where: appointmentQuery,
                orderBy: { startTime: 'asc' },
            });

            if (upcomingAppointments.length === 0) {
                return res.status(404).json({ message: 'No upcoming appointments found for this patient.' });
            }

            if (upcomingAppointments.length > 1) {
                return res.status(400).json({
                    message: 'Multiple upcoming appointments found. Please specify which date you want to cancel.',
                    appointments: upcomingAppointments.map((a) => ({
                        id: a.id,
                        date: a.startTime.toISOString().split('T')[0],
                        time: a.startTime.toISOString().split('T')[1].substring(0, 5),
                    })),
                });
            }

            appointmentQuery.id = upcomingAppointments[0].id;
        }

        const targetAppointment = await prisma.appointment.findFirst({
            where: appointmentQuery,
            include: { treatment: true },
        });

        if (!targetAppointment) {
            return res.status(404).json({ message: 'No matching appointment found to cancel.' });
        }

        const updatedAppointment = await prisma.appointment.update({
            where: { id: targetAppointment.id },
            data: { status: 'CANCELLED' },
        });

        if (targetAppointment.googleEventId) {
            deleteCalendarEvent(targetAppointment.googleEventId).catch((err) =>
                console.error('Bot cancel calendar error:', err)
            );
        }

        return res.json({
            message: 'Appointment successfully cancelled.',
            appointment: updatedAppointment,
        });
    } catch (error) {
        console.error('Bot cancel error:', error);
        return res.status(500).json({ message: 'Internal server error while cancelling appointment.' });
    }
});

// PATCH /api/bot/reschedule
router.patch('/reschedule', async (req: Request, res: Response) => {
    try {
        const { phone, currentDate, newDate, newTime, appointmentId } = req.body;
        if (!phone || !newDate || !newTime) {
            return res.status(400).json({
                message: 'Missing required fields: please provide phone, newDate, and newTime',
            });
        }

        const canonicalPhone = normalizePhone(phone);
        const patient = await prisma.user.findFirst({
            where: { phone: canonicalPhone },
        });

        if (!patient) {
            return res.status(404).json({ message: 'Patient not found with this phone number.' });
        }

        let appointmentQuery: any = {
            patientId: patient.id,
            status: { in: ['SCHEDULED', 'RESCHEDULED'] },
            startTime: { gt: new Date() },
        };

        if (appointmentId) {
            appointmentQuery.id = appointmentId;
        } else if (currentDate) {
            const { startOfDay, endOfDay } = getKarachiDayBoundaries(currentDate);
            appointmentQuery.startTime = { gte: startOfDay, lte: endOfDay };
        } else {
            const upcomingAppointments = await prisma.appointment.findMany({
                where: appointmentQuery,
                orderBy: { startTime: 'asc' },
            });

            if (upcomingAppointments.length === 0) {
                return res.status(404).json({ message: 'No upcoming appointments found for this patient.' });
            }

            if (upcomingAppointments.length > 1) {
                return res.status(400).json({
                    message: 'Multiple upcoming appointments found. Please specify which appointment to reschedule.',
                    appointments: upcomingAppointments.map((a) => ({
                        id: a.id,
                        date: a.startTime.toISOString().split('T')[0],
                        time: a.startTime.toISOString().split('T')[1].substring(0, 5),
                    })),
                });
            }

            appointmentQuery.id = upcomingAppointments[0].id;
        }

        const targetAppointment = await prisma.appointment.findFirst({
            where: appointmentQuery,
            include: { treatment: true },
        });

        if (!targetAppointment) {
            return res.status(404).json({ message: 'No matching upcoming appointment found to reschedule.' });
        }

        if (isSundayInKarachi(newDate)) {
            return res.status(400).json({
                message: 'The clinic is closed on Sundays. Please select a different day (Monday-Saturday).',
            });
        }

        const newStartTime = parseKarachiDateTime(newDate, newTime);
        const durationMin = targetAppointment.treatment?.durationMin || 30;
        const newEndTime = new Date(newStartTime.getTime() + durationMin * 60000);

        const conflict = await prisma.appointment.findFirst({
            where: {
                id: { not: targetAppointment.id },
                status: { notIn: ['CANCELLED'] },
                AND: [
                    { startTime: { lt: newEndTime } },
                    { endTime: { gt: newStartTime } },
                ],
            },
        });

        if (conflict) {
            return res.status(409).json({
                message: 'That time slot is already booked. Please choose another time.',
            });
        }

        const updatedAppointment = await prisma.appointment.update({
            where: { id: targetAppointment.id },
            data: {
                startTime: newStartTime,
                endTime: newEndTime,
                status: 'RESCHEDULED',
            },
            include: { treatment: true, patient: true },
        });

        if (targetAppointment.googleEventId) {
            updateCalendarEvent({
                eventId: targetAppointment.googleEventId,
                summary: `${targetAppointment.treatment.name} — ${patient.name} (Rescheduled)`,
                description: `Rescheduled via WhatsApp Bot\nTreatment: ${targetAppointment.treatment.name}`,
                startTime: newStartTime,
                endTime: newEndTime,
                patientName: patient.name,
            }).catch((err) => console.error('Bot reschedule calendar error:', err));
        }

        return res.json({
            message: 'Appointment successfully rescheduled!',
            appointment: updatedAppointment,
        });
    } catch (error) {
        console.error('Bot reschedule error:', error);
        return res.status(500).json({ message: 'Internal server error while rescheduling appointment.' });
    }
});

// GET /api/bot/daily-reminders
router.get('/daily-reminders', async (_req: Request, res: Response) => {
    try {
        const todayStr = getKarachiTodayStr();
        const { startOfDay, endOfDay } = getKarachiDayBoundaries(todayStr);

        const appointments = await prisma.appointment.findMany({
            where: {
                status: { in: ['SCHEDULED', 'RESCHEDULED'] },
                startTime: { gte: startOfDay, lte: endOfDay },
            },
            include: {
                patient: { select: { name: true, phone: true } },
                treatment: { select: { name: true, durationMin: true } },
            },
            orderBy: { startTime: 'asc' },
        });

        const reminders = appointments
            .filter((apt) => Boolean(apt.guestPhone || apt.patient?.phone))
            .map((apt) => {
                const patientName = apt.guestName || apt.patient?.name || 'Patient';
                const rawPhone = apt.guestPhone || apt.patient?.phone || '';
                const phone = normalizePhone(rawPhone);
                const timeString = formatTime(apt.startTime);
                const dateString = formatDate(apt.startTime, 'medium');
                const treatmentName = apt.treatment?.name || 'Dental Visit';

                return {
                    appointmentId: apt.id,
                    patientName,
                    phone,
                    startTime: apt.startTime,
                    treatmentName,
                    timeString,
                    dateString,
                    message: `Salam ${patientName}, this is a reminder for your dental appointment for ${treatmentName} today at ${timeString} at Dr. Sheriyaar's Dental Surgery. Reply CANCEL or RESCHEDULE if needed.`,
                };
            });

        return res.json({ date: todayStr, totalReminders: reminders.length, reminders });
    } catch (error) {
        console.error('Daily reminders error:', error);
        return res.status(500).json({ error: 'Failed to fetch daily reminders' });
    }
});

// GET /api/bot/reminders (1-hour upcoming reminders)
router.get('/reminders', async (_req: Request, res: Response) => {
    try {
        const now = new Date();
        const targetTimeStart = new Date(now.getTime() + 55 * 60000);
        const targetTimeEnd = new Date(now.getTime() + 65 * 60000);

        const upcomingAppointments = await prisma.appointment.findMany({
            where: {
                status: 'SCHEDULED',
                startTime: { gte: targetTimeStart, lte: targetTimeEnd },
            },
            include: {
                patient: { select: { name: true, phone: true } },
                treatment: { select: { name: true } },
            },
        });

        const reminders = upcomingAppointments.map((appt) => {
            const timeString = new Date(appt.startTime).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
                timeZone: 'Asia/Karachi',
            });

            return {
                appointmentId: appt.id,
                patientName: appt.patient.name,
                phone: appt.patient.phone,
                treatment: appt.treatment.name,
                startTime: appt.startTime,
                formattedTime: timeString,
                message: `Salam ${appt.patient.name}, this is a reminder for your upcoming appointment for ${appt.treatment.name} at ${timeString} today.`,
            };
        });

        return res.json({ count: reminders.length, reminders });
    } catch (error) {
        console.error('Bot 1-hr reminders error:', error);
        return res.status(500).json({ message: 'Internal server error while fetching reminders' });
    }
});

export default router;

