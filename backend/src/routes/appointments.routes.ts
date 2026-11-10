import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';
import { z } from 'zod';
import { logger } from '../lib/logger';
import { requireAuth, requireRole, optionalAuth } from '../middleware/auth.middleware';
import { createCalendarEvent, updateCalendarEvent, deleteCalendarEvent } from '../lib/googleCalendar';
import { sendAppointmentConfirmationEmail, sendAppointmentRescheduleEmail } from '../lib/email';
import { normalizePhone } from '../lib/phone';
import { isSundayInKarachi, parseKarachiDateTime } from '../lib/timezone';
import { generateRandomPatientPasswordHash } from '../lib/security';
import {
    getPrecautionsForTreatment,
    formatPrecautionsMessage,
    generateWhatsAppDeepLink,
    dispatchN8nPrecautionsWebhook,
} from '../lib/precautions';

const router = Router();

const bookingSchema = z.object({
    treatmentId: z.string().min(1, 'Treatment ID is required'),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
    time: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format (HH:MM)'),
    notes: z.string().optional(),
    patientId: z.string().optional(),
    newPatient: z.object({
        name: z.string().min(1, 'Name is required'),
        email: z.string().email().optional().or(z.literal('')),
        phone: z.string().min(10, 'Phone number is required'),
        dateOfBirth: z.string().optional(),
    }).optional(),
    guestName: z.string().optional(),
    guestPhone: z.string().optional(),
    guestEmail: z.string().email().optional().or(z.literal('')),
    guestDob: z.string().optional(),
}).superRefine((data, ctx) => {
    if (data.guestName || data.guestPhone || data.guestEmail || data.guestDob) {
        if (!data.guestName) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Guest name is required', path: ['guestName'] });
        }
        if (!data.guestPhone) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Guest phone is required', path: ['guestPhone'] });
        }
    }
});

// GET /api/appointments/availability
router.get('/availability', async (req: Request, res: Response) => {
    try {
        const { date, treatmentId, excludeAppointmentId } = req.query as {
            date?: string;
            treatmentId?: string;
            excludeAppointmentId?: string;
        };

        if (!date) {
            return res.status(400).json({ error: 'date is required' });
        }

        const [year, month, day] = date.split('-').map(Number);
        const selectedDate = new Date(year, month - 1, day);

        if (selectedDate.getDay() === 0) {
            return res.json({ slots: [], dayOff: true, reason: 'Sunday is a clinic off day' });
        }

        let treatmentDuration = 30;
        if (treatmentId) {
            const treatment = await prisma.treatment.findUnique({
                where: { id: treatmentId },
                select: { durationMin: true },
            });
            if (treatment) treatmentDuration = treatment.durationMin;
        }

        const settings = await prisma.systemSettings.findUnique({
            where: { id: 'settings' },
        });

        const workStart = settings?.workDayStart || '09:00';
        const workEnd = settings?.workDayEnd || '17:00';

        const startOfDay = new Date(year, month - 1, day, 0, 0, 0, 0);
        const endOfDay = new Date(year, month - 1, day, 23, 59, 59, 999);

        const whereClause: any = {
            startTime: { gte: startOfDay, lte: endOfDay },
            status: { notIn: ['CANCELLED'] },
        };

        if (excludeAppointmentId) {
            whereClause.id = { not: excludeAppointmentId };
        }

        const existingAppointments = await prisma.appointment.findMany({
            where: whereClause,
            select: { startTime: true, endTime: true },
        });

        const slots = [];
        const [startH, startM] = workStart.split(':').map(Number);
        const [endH, endM] = workEnd.split(':').map(Number);
        const workStartMin = startH * 60 + startM;
        const workEndMin = endH * 60 + endM;

        for (let min = workStartMin; min < workEndMin; min += treatmentDuration) {
            const slotH = Math.floor(min / 60);
            const slotM = min % 60;
            const slotEndMin = min + treatmentDuration;

            if (slotEndMin > workEndMin) continue;

            const isOccupied = existingAppointments.some((apt) => {
                const aptStartMin = apt.startTime.getHours() * 60 + apt.startTime.getMinutes();
                const aptEndMin = apt.endTime.getHours() * 60 + apt.endTime.getMinutes();
                return min < aptEndMin && slotEndMin > aptStartMin;
            });

            const period = slotH >= 12 ? 'PM' : 'AM';
            const displayH = slotH === 0 ? 12 : slotH > 12 ? slotH - 12 : slotH;
            const label = `${displayH}:${slotM.toString().padStart(2, '0')} ${period}`;

            const endTimeH = Math.floor(slotEndMin / 60);
            const endTimeM = slotEndMin % 60;
            const endPeriod = endTimeH >= 12 ? 'PM' : 'AM';
            const endDisplayH = endTimeH === 0 ? 12 : endTimeH > 12 ? endTimeH - 12 : endTimeH;
            const endLabel = `${endDisplayH}:${endTimeM.toString().padStart(2, '0')} ${endPeriod}`;

            const now = new Date();
            const isToday = selectedDate.toDateString() === now.toDateString();
            const isPast = isToday && (slotH < now.getHours() || (slotH === now.getHours() && slotM <= now.getMinutes()));

            slots.push({
                value: `${slotH.toString().padStart(2, '0')}:${slotM.toString().padStart(2, '0')}`,
                label,
                endLabel,
                available: !isOccupied && !isPast,
            });
        }

        return res.json({ slots, dayOff: false });
    } catch (error) {
        console.error('Availability check error:', error);
        return res.status(500).json({ error: 'Failed to check availability' });
    }
});

// GET /api/appointments/today
router.get('/today', requireAuth, requireRole('ADMIN', 'STAFF'), async (_req: Request, res: Response) => {
    try {
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
        const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

        const appointments = await prisma.appointment.findMany({
            where: {
                startTime: { gte: todayStart, lte: todayEnd },
                status: { not: 'CANCELLED' },
            },
            include: {
                patient: {
                    select: {
                        id: true,
                        name: true,
                        phone: true,
                        medicalAlerts: true,
                        appointments: {
                            where: { status: 'NO_SHOW' },
                            select: { id: true },
                        },
                    },
                },
                treatment: {
                    select: { name: true, durationMin: true, price: true, isMultiSession: true, defaultSessions: true },
                },
                patientTreatment: {
                    select: {
                        id: true,
                        totalCost: true,
                        totalSessions: true,
                        clinicalStatus: true,
                        financialStatus: true,
                        payments: {
                            select: { amount: true, date: true, method: true },
                        },
                    },
                },
            },
            orderBy: { startTime: 'asc' },
        });

        const serialized = appointments.map((a) => ({
            id: a.id,
            startTime: a.startTime.toISOString(),
            endTime: a.endTime.toISOString(),
            status: a.status,
            amountPaid: a.amountPaid,
            price: a.price,
            discount: a.discount,
            bookedBy: a.bookedBy,
            notes: a.notes,
            patient: a.patient
                ? {
                      id: a.patient.id,
                      name: a.patient.name,
                      phone: a.patient.phone,
                      medicalAlerts: a.patient.medicalAlerts,
                      noShowCount: a.patient.appointments.length,
                  }
                : null,
            treatment: a.treatment,
            patientTreatment: a.patientTreatment
                ? {
                      id: a.patientTreatment.id,
                      totalCost: a.patientTreatment.totalCost,
                      totalSessions: a.patientTreatment.totalSessions,
                      clinicalStatus: a.patientTreatment.clinicalStatus,
                      financialStatus: a.patientTreatment.financialStatus,
                      payments: a.patientTreatment.payments,
                  }
                : null,
            sessionNumber: a.sessionNumber,
            sessionLabel: a.sessionLabel,
            plannedFee: a.plannedFee,
        }));

        return res.json({ appointments: serialized });
    } catch (error) {
        console.error('Fetch today appointments error:', error);
        return res.status(500).json({ error: 'Failed to fetch appointments' });
    }
});

// GET /api/appointments
router.get('/', requireAuth, requireRole('ADMIN', 'STAFF'), async (req: Request, res: Response) => {
    try {
        const { status, dateFrom, dateTo } = req.query as {
            status?: string;
            dateFrom?: string;
            dateTo?: string;
        };

        const where: any = {};
        if (status) where.status = status;
        if (dateFrom || dateTo) {
            where.startTime = {};
            if (dateFrom) where.startTime.gte = new Date(dateFrom);
            if (dateTo) where.startTime.lte = new Date(dateTo + 'T23:59:59');
        }

        const appointments = await prisma.appointment.findMany({
            where,
            include: {
                patient: { select: { id: true, name: true, email: true, phone: true } },
                treatment: { select: { id: true, name: true, price: true, durationMin: true } },
            },
            orderBy: { startTime: 'desc' },
        });

        return res.json({ appointments });
    } catch (error) {
        logger.error({ err: error }, 'Failed to fetch appointments');
        return res.status(500).json({ error: 'Failed to fetch appointments' });
    }
});

// POST /api/appointments
router.post('/', optionalAuth, async (req: Request, res: Response) => {
    let body = req.body;
    try {
        const session = req.user;
        const bookerRole = session?.role;
        let patientId = session?.id;

        const validationResult = bookingSchema.safeParse(body);
        if (!validationResult.success) {
            return res.status(400).json({
                error: 'Validation failed',
                details: validationResult.error.format(),
            });
        }

        const { treatmentId, date, time, notes, newPatient, guestName, guestPhone, guestEmail, guestDob } =
            validationResult.data;

        if (!session && (!guestName || !guestPhone)) {
            return res.status(400).json({ error: 'Name and phone number are required to book' });
        }

        if (bookerRole === 'STAFF' || bookerRole === 'ADMIN') {
            if (validationResult.data.patientId) {
                patientId = validationResult.data.patientId;
            }
            if (!patientId && !newPatient) {
                return res.status(400).json({ error: 'Patient ID or New Patient details required' });
            }
        }

        if (isSundayInKarachi(date)) {
            return res.status(400).json({
                error: 'Sunday is a clinic off day. Please select another date.',
            });
        }

        const treatment = await prisma.treatment.findUnique({
            where: { id: treatmentId },
        });
        if (!treatment) {
            return res.status(404).json({ error: 'Treatment not found' });
        }

        const startTime = parseKarachiDateTime(date, time);
        const endTime = new Date(startTime.getTime() + treatment.durationMin * 60000);

        let bookedBy: 'WEBSITE' | 'WALK_IN' | 'WHATSAPP_BOT' = 'WEBSITE';
        if (bookerRole === 'STAFF' || bookerRole === 'ADMIN') {
            bookedBy = body.bookedBy || 'WALK_IN';
        }

        const result = await prisma.$transaction(async (tx) => {
            let finalPatientId = patientId;

            if ((bookerRole === 'STAFF' || bookerRole === 'ADMIN') && newPatient) {
                const canonicalPhone = normalizePhone(newPatient.phone);
                const existingUser = await tx.user.findFirst({
                    where: { phone: canonicalPhone },
                });

                if (existingUser) {
                    finalPatientId = existingUser.id;
                } else {
                    const hashedPassword = await generateRandomPatientPasswordHash();
                    const createdUser = await tx.user.create({
                        data: {
                            name: newPatient.name,
                            email: newPatient.email || undefined,
                            phone: canonicalPhone,
                            password: hashedPassword,
                            role: 'PATIENT',
                            dateOfBirth: newPatient.dateOfBirth ? new Date(newPatient.dateOfBirth) : undefined,
                        },
                    });
                    finalPatientId = createdUser.id;
                }
            } else if (!finalPatientId && guestPhone && guestName) {
                const canonicalGuestPhone = normalizePhone(guestPhone);
                const existingUser = await tx.user.findFirst({
                    where: { phone: canonicalGuestPhone },
                });

                if (existingUser) {
                    finalPatientId = existingUser.id;
                } else {
                    const hashedPassword = await generateRandomPatientPasswordHash();
                    const createdUser = await tx.user.create({
                        data: {
                            name: guestName,
                            email: guestEmail || undefined,
                            phone: canonicalGuestPhone,
                            password: hashedPassword,
                            role: 'PATIENT',
                            dateOfBirth: guestDob ? new Date(guestDob) : undefined,
                        },
                    });
                    finalPatientId = createdUser.id;
                }
            }

            const conflict = await tx.appointment.findFirst({
                where: {
                    status: { notIn: ['CANCELLED'] },
                    AND: [
                        { startTime: { lt: endTime } },
                        { endTime: { gt: startTime } },
                    ],
                },
            });

            if (conflict) {
                throw new Error('DOUBLE_BOOKING');
            }

            if (!finalPatientId) {
                throw new Error('PATIENT_ID_REQUIRED');
            }

            const appointment = await tx.appointment.create({
                data: {
                    startTime,
                    endTime,
                    patientId: finalPatientId,
                    treatmentId,
                    status: 'SCHEDULED',
                    bookedBy,
                    price: treatment.price,
                    notes: notes || null,
                    guestName: guestName,
                    guestPhone: guestPhone,
                    guestEmail: guestEmail,
                    guestDob: guestDob ? new Date(guestDob) : undefined,
                },
                include: {
                    treatment: { select: { name: true, durationMin: true } },
                    patient: { select: { name: true, phone: true, email: true } },
                },
            });

            return appointment;
        });

        // Non-blocking Google Calendar Sync
        (async () => {
            try {
                const safeResult = result as any;
                if (safeResult.treatment && safeResult.patient) {
                    const googleEventId = await createCalendarEvent({
                        summary: `${safeResult.treatment.name} — ${safeResult.patient.name}`,
                        description: `Treatment: ${safeResult.treatment.name}\nDuration: ${safeResult.treatment.durationMin} min`,
                        startTime: safeResult.startTime,
                        endTime: safeResult.endTime,
                        patientName: safeResult.patient.name || 'Patient',
                    });

                    if (googleEventId) {
                        await prisma.appointment.update({
                            where: { id: result.id },
                            data: { googleEventId },
                        });
                    }
                }
            } catch (calError) {
                logger.warn({ err: calError, appointmentId: result.id }, 'Google Calendar sync failed');
            }
        })();

        // Non-blocking email
        const safeResultObj = result as any;
        const emailToNotify = safeResultObj.patient?.email;
        if (emailToNotify) {
            const formattedDate = new Date(safeResultObj.startTime).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
            const formattedTime = new Date(safeResultObj.startTime).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
            });

            sendAppointmentConfirmationEmail(
                emailToNotify,
                safeResultObj.patient.name,
                safeResultObj.treatment.name,
                formattedDate,
                formattedTime
            ).catch((err) => logger.warn({ err }, 'Failed to send confirmation email'));
        }

        return res.status(201).json({
            success: true,
            appointment: result,
            message: 'Appointment booked successfully!',
        });
    } catch (error) {
        if (error instanceof Error && error.message === 'DOUBLE_BOOKING') {
            return res.status(409).json({
                error: 'This time slot is no longer available. Please select another time.',
                code: 'DOUBLE_BOOKING',
            });
        }
        logger.error({ err: error, body }, 'Failed to book appointment');
        return res.status(500).json({ error: 'Failed to book appointment' });
    }
});

// GET /api/appointments/:id
router.get('/:id', requireAuth, async (req: Request, res: Response) => {
    try {
        const appointment = await prisma.appointment.findUnique({
            where: { id: req.params.id },
            include: {
                treatment: true,
                patient: true,
                clinicalNotes: true,
            },
        });
        if (!appointment) {
            return res.status(404).json({ error: 'Appointment not found' });
        }
        return res.json({ appointment });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch appointment' });
    }
});

// PATCH /api/appointments/:id/status
router.patch('/:id/status', requireAuth, requireRole('ADMIN', 'STAFF'), async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status, amountPaid, price, discount } = req.body;

        const validStatuses = ['SCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_SHOW', 'RESCHEDULED'];
        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({
                error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
            });
        }

        const existingAppointment = await prisma.appointment.findUnique({
            where: { id },
            select: { status: true, patientId: true, startTime: true, endTime: true },
        });

        if (!existingAppointment) {
            return res.status(404).json({ error: 'Appointment not found' });
        }

        let updateData: any = {
            status,
            amountPaid: status === 'COMPLETED' ? (amountPaid ?? 0) : 0,
            price: price !== undefined ? price : undefined,
            discount: discount !== undefined ? discount : undefined,
        };

        if (status === 'COMPLETED') {
            const todayEnd = new Date();
            todayEnd.setHours(23, 59, 59, 999);
            if (existingAppointment.startTime > todayEnd) {
                return res.status(400).json({
                    error: 'Cannot check out a future appointment. Please book a new appointment for today instead.',
                });
            }
        }

        const appointment = await prisma.appointment.update({
            where: { id },
            data: updateData,
            include: {
                treatment: { select: { name: true, price: true } },
                patient: { select: { name: true } },
            },
        });

        if (status === 'NO_SHOW' && existingAppointment.status !== 'NO_SHOW') {
            await prisma.user.update({
                where: { id: existingAppointment.patientId },
                data: { noShowCount: { increment: 1 } } as any,
            });
        } else if (existingAppointment.status === 'NO_SHOW' && status !== 'NO_SHOW') {
            await prisma.user.update({
                where: { id: existingAppointment.patientId },
                data: { noShowCount: { decrement: 1 } } as any,
            });
        }

        if (appointment.googleEventId) {
            (async () => {
                try {
                    if (status === 'CANCELLED' || status === 'NO_SHOW') {
                        await deleteCalendarEvent(appointment.googleEventId!);
                    } else if (status === 'COMPLETED') {
                        await updateCalendarEvent({
                            eventId: appointment.googleEventId!,
                            summary: `✅ ${appointment.treatment.name} — ${appointment.patient?.name || 'Patient'} (Completed)`,
                            description: `Treatment: ${appointment.treatment.name}\nStatus: COMPLETED\nAmount Paid Today: Rs. ${(appointment.amountPaid ?? 0).toLocaleString('en-PK')}`,
                            startTime: appointment.startTime,
                            endTime: appointment.endTime,
                            patientName: appointment.patient?.name || 'Patient',
                        });
                    }
                } catch (syncError) {
                    console.error('Google Calendar sync error:', syncError);
                }
            })();
        }

        return res.json({
            success: true,
            appointment,
            message: status === 'COMPLETED'
                ? `Patient checked out — Rs. ${(appointment.amountPaid ?? 0).toLocaleString('en-PK')} recorded`
                : `Appointment marked as ${status}`,
        });
    } catch (error) {
        console.error('Update appointment status error:', error);
        return res.status(500).json({ error: 'Failed to update status' });
    }
});

// PATCH /api/appointments/:id/reschedule
router.patch('/:id/reschedule', requireAuth, requireRole('ADMIN', 'STAFF'), async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { date, time, cancel } = req.body;

        const existingApt = await prisma.appointment.findUnique({
            where: { id },
            include: {
                treatment: { select: { id: true, name: true, durationMin: true } },
                patient: { select: { name: true, phone: true, email: true } },
            },
        });

        if (!existingApt) {
            return res.status(404).json({ error: 'Appointment not found' });
        }

        if (cancel === true) {
            const updatedApt = await prisma.appointment.update({
                where: { id },
                data: { status: 'CANCELLED' },
                include: {
                    treatment: { select: { name: true } },
                    patient: { select: { name: true } },
                },
            });

            if (updatedApt.googleEventId) {
                deleteCalendarEvent(updatedApt.googleEventId).catch((err) =>
                    console.error('Calendar delete error:', err)
                );
            }

            return res.json({
                success: true,
                appointment: updatedApt,
                message: 'Appointment cancelled successfully',
            });
        }

        if (!date || !time) {
            return res.status(400).json({ error: 'Date and time are required for rescheduling' });
        }

        const selectedDate = new Date(date);
        const todaySearch = new Date();
        todaySearch.setHours(0, 0, 0, 0);

        if (selectedDate < todaySearch) {
            return res.status(400).json({ error: 'Cannot reschedule to a past date' });
        }

        if (selectedDate.getDay() === 0) {
            return res.status(400).json({
                error: 'Sunday is a clinic off day. Please select another date.',
            });
        }

        if (existingApt.status === 'CANCELLED') {
            return res.status(400).json({ error: 'Cannot reschedule a cancelled appointment' });
        }

        const [timeH, timeM] = time.split(':').map(Number);
        const newStartTime = new Date(date);
        newStartTime.setHours(timeH, timeM, 0, 0);

        const newEndTime = new Date(newStartTime);
        newEndTime.setMinutes(newEndTime.getMinutes() + existingApt.treatment.durationMin);

        const conflict = await prisma.appointment.findFirst({
            where: {
                id: { not: id },
                status: { notIn: ['CANCELLED'] },
                AND: [
                    { startTime: { lt: newEndTime } },
                    { endTime: { gt: newStartTime } },
                ],
            },
        });

        if (conflict) {
            return res.status(409).json({
                error: 'This time slot is no longer available. Please select another time.',
                code: 'DOUBLE_BOOKING',
            });
        }

        const updatedApt = await prisma.appointment.update({
            where: { id },
            data: {
                startTime: newStartTime,
                endTime: newEndTime,
                status: 'RESCHEDULED',
            },
            include: {
                treatment: { select: { name: true, durationMin: true } },
                patient: { select: { name: true, phone: true, email: true } },
            },
        });

        // Google Calendar sync
        (async () => {
            try {
                if (updatedApt.googleEventId) {
                    await updateCalendarEvent({
                        eventId: updatedApt.googleEventId,
                        summary: `${updatedApt.treatment.name} — ${updatedApt.patient.name} (Rescheduled)`,
                        description: `Treatment: ${updatedApt.treatment.name}\nDuration: ${updatedApt.treatment.durationMin} min\nStatus: RESCHEDULED`,
                        startTime: newStartTime,
                        endTime: newEndTime,
                        patientName: updatedApt.patient.name || 'Patient',
                    });
                } else {
                    const newEventId = await createCalendarEvent({
                        summary: `${updatedApt.treatment.name} — ${updatedApt.patient.name} (Rescheduled)`,
                        description: `Treatment: ${updatedApt.treatment.name}\nDuration: ${updatedApt.treatment.durationMin} min\nStatus: RESCHEDULED`,
                        startTime: newStartTime,
                        endTime: newEndTime,
                        patientName: updatedApt.patient.name || 'Patient',
                    });
                    if (newEventId) {
                        await prisma.appointment.update({
                            where: { id: updatedApt.id },
                            data: { googleEventId: newEventId },
                        });
                    }
                }
            } catch (syncError) {
                console.error('Google Calendar sync error:', syncError);
            }
        })();

        const emailToNotify = updatedApt.patient.email;
        if (emailToNotify) {
            const formattedDate = newStartTime.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
            const formattedTime = newStartTime.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
            });

            sendAppointmentRescheduleEmail(
                emailToNotify,
                updatedApt.patient.name,
                updatedApt.treatment.name,
                formattedDate,
                formattedTime
            ).catch((err) => console.error('Failed to send reschedule email:', err));
        }

        return res.json({
            success: true,
            appointment: updatedApt,
            message: `Appointment rescheduled to ${newStartTime.toLocaleDateString()} at ${newStartTime.toLocaleTimeString()}`,
        });
    } catch (error) {
        console.error('Reschedule appointment error:', error);
        return res.status(500).json({
            error: error instanceof Error ? error.message : 'Failed to process appointment update',
        });
    }
});

// GET /api/appointments/:id/notes
router.get('/:id/notes', requireAuth, requireRole('ADMIN', 'STAFF'), async (req: Request, res: Response) => {
    try {
        const notes = await prisma.clinicalNote.findMany({
            where: { appointmentId: req.params.id },
            orderBy: { createdAt: 'desc' },
        });
        return res.json({ notes });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch notes' });
    }
});

// POST /api/appointments/:id/notes
router.post('/:id/notes', requireAuth, requireRole('ADMIN'), async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { diagnosis, treatmentDone, prescription, remarks, odontogramData } = req.body;

        if (!treatmentDone?.trim()) {
            return res.status(400).json({ error: 'Treatment done is required' });
        }

        const appointment = await prisma.appointment.findUnique({
            where: { id },
            select: { patientId: true },
        });

        if (!appointment) {
            return res.status(404).json({ error: 'Appointment not found' });
        }

        const note = await prisma.clinicalNote.create({
            data: {
                appointmentId: id,
                diagnosis: diagnosis?.trim() || null,
                treatmentDone: treatmentDone.trim(),
                prescription: prescription?.trim() || null,
                remarks: remarks?.trim() || null,
                odontogramData: odontogramData ? odontogramData : undefined,
            },
        });

        return res.status(201).json({ note });
    } catch (error) {
        console.error('Create clinical note error:', error);
        return res.status(500).json({ error: 'Failed to create note' });
    }
});

// GET /api/appointments/:id/send-precautions
router.get('/:id/send-precautions', requireAuth, requireRole('ADMIN', 'STAFF'), async (req: Request, res: Response) => {
    try {
        const appointment = await prisma.appointment.findUnique({
            where: { id: req.params.id },
            include: {
                patient: { select: { id: true, name: true, phone: true } },
                treatment: { select: { id: true, name: true, instructions: true } },
            },
        });

        if (!appointment) {
            return res.status(404).json({ error: 'Appointment not found' });
        }

        const patientName = appointment.patient?.name || appointment.guestName || 'Valued Patient';
        const patientPhone = appointment.patient?.phone || appointment.guestPhone;

        if (!patientPhone) {
            return res.status(400).json({ error: 'No WhatsApp/phone number recorded for this patient' });
        }

        const precautionsList = getPrecautionsForTreatment(
            appointment.treatment.name,
            appointment.treatment.instructions
        );

        const message = formatPrecautionsMessage({
            patientName,
            treatmentName: appointment.treatment.name,
            precautions: precautionsList,
            doctorName: 'Dr. Sheriyaar',
        });

        const whatsappUrl = generateWhatsAppDeepLink(patientPhone, message);

        return res.json({
            success: true,
            patientName,
            patientPhone,
            treatmentName: appointment.treatment.name,
            precautions: precautionsList,
            message,
            whatsappUrl,
            n8nConfigured: Boolean(process.env.N8N_WEBHOOK_URL),
        });
    } catch (error) {
        console.error('Failed to load precautions preview:', error);
        return res.status(500).json({ error: 'Failed to load precautions preview' });
    }
});

// POST /api/appointments/:id/send-precautions
router.post('/:id/send-precautions', requireAuth, requireRole('ADMIN', 'STAFF'), async (req: Request, res: Response) => {
    try {
        const appointment = await prisma.appointment.findUnique({
            where: { id: req.params.id },
            include: {
                patient: { select: { id: true, name: true, phone: true } },
                treatment: { select: { id: true, name: true, instructions: true } },
            },
        });

        if (!appointment) {
            return res.status(404).json({ error: 'Appointment not found' });
        }

        const patientName = appointment.patient?.name || appointment.guestName || 'Valued Patient';
        const patientPhone = appointment.patient?.phone || appointment.guestPhone;

        if (!patientPhone) {
            return res.status(400).json({ error: 'No phone number found' });
        }

        const precautionsList = getPrecautionsForTreatment(
            appointment.treatment.name,
            appointment.treatment.instructions
        );

        const message = formatPrecautionsMessage({
            patientName,
            treatmentName: appointment.treatment.name,
            precautions: precautionsList,
            doctorName: 'Dr. Sheriyaar',
        });

        const result = await dispatchN8nPrecautionsWebhook({
            patientName,
            phone: patientPhone,
            treatmentName: appointment.treatment.name,
            precautions: precautionsList,
            message,
            appointmentId: appointment.id,
        });

        return res.json({ success: true, dispatched: result });
    } catch (error) {
        console.error('Failed to send precautions:', error);
        return res.status(500).json({ error: 'Failed to dispatch precautions' });
    }
});

// PATCH /api/appointments/:id/payment (Deprecated stub)
router.patch('/:id/payment', (_req: Request, res: Response) => {
    return res.status(410).json({
        error: 'Payment status tracking has been removed from this version.',
    });
});

export default router;
