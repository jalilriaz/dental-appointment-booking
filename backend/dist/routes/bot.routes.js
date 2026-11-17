"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveCanonicalTreatment = resolveCanonicalTreatment;
const express_1 = require("express");
const prisma_1 = __importDefault(require("../lib/prisma"));
const auth_bot_1 = require("../lib/auth-bot");
const bookingService_1 = require("../lib/bookingService");
const googleCalendar_1 = require("../lib/googleCalendar");
const phone_1 = require("../lib/phone");
const utils_1 = require("../lib/utils");
const timezone_1 = require("../lib/timezone");
const router = (0, express_1.Router)();
// Apply timing-safe bot authorization to all bot endpoints
router.use(auth_bot_1.botAuthMiddleware);
/**
 * Resolves patient-supplied service string or treatmentId to canonical Treatment record.
 */
async function resolveCanonicalTreatment(serviceType, treatmentId) {
    if (treatmentId) {
        const tr = await prisma_1.default.treatment.findUnique({ where: { id: treatmentId } });
        if (tr)
            return tr;
    }
    if (!serviceType) {
        const consult = await prisma_1.default.treatment.findFirst({
            where: { name: { contains: 'Consultation', mode: 'insensitive' }, isActive: true },
        });
        if (consult)
            return consult;
        return await prisma_1.default.treatment.findFirst({ where: { isActive: true } });
    }
    const clean = serviceType.trim().toLowerCase();
    // 1. Direct contains match
    const directMatch = await prisma_1.default.treatment.findFirst({
        where: { name: { contains: clean, mode: 'insensitive' }, isActive: true },
    });
    if (directMatch)
        return directMatch;
    // 2. Canonical mapping for common patient phrasing & categories
    let targetName = null;
    if (clean.includes('check') || clean.includes('consult') || clean.includes('exam') || clean.includes('visit') || clean.includes('doctor')) {
        targetName = 'General Consultation & Dental Checkup';
    }
    else if (clean.includes('deep scale') || clean.includes('deep clean') || clean.includes('gum clean')) {
        targetName = 'Deep Scaling';
    }
    else if (clean.includes('full mouth') || clean.includes('polish')) {
        targetName = 'Full Mouth Scaling & Polishing';
    }
    else if (clean.includes('scale') || clean.includes('clean') || clean.includes('scaling')) {
        targetName = 'Basic Scaling';
    }
    else if (clean.includes('wisdom')) {
        targetName = 'Wisdom Tooth Extraction';
    }
    else if (clean.includes('surgical extract')) {
        targetName = 'Surgical Extraction';
    }
    else if (clean.includes('extract') || clean.includes('remove') || clean.includes('pull')) {
        targetName = 'Simple Extraction';
    }
    else if (clean.includes('laser white')) {
        targetName = 'Laser Whitening';
    }
    else if (clean.includes('german white')) {
        targetName = 'German Whitening Kit';
    }
    else if (clean.includes('white') || clean.includes('bleach')) {
        targetName = 'American Whitening Kit';
    }
    else if ((clean.includes('multi') && clean.includes('rct')) || clean.includes('molar rct')) {
        targetName = 'Multi Canal RCT';
    }
    else if (clean.includes('rct') || clean.includes('root canal')) {
        targetName = 'Single Canal RCT';
    }
    else if (clean.includes('german implant')) {
        targetName = 'German Implant Kit';
    }
    else if (clean.includes('american implant')) {
        targetName = 'American Implant Kit';
    }
    else if (clean.includes('korean implant')) {
        targetName = 'Korean Implant Kit';
    }
    else if (clean.includes('implant')) {
        targetName = 'German Implant Kit';
    }
    else if (clean.includes('ceramic brace')) {
        targetName = 'Ceramic Braces';
    }
    else if (clean.includes('brace')) {
        targetName = 'Metal Braces';
    }
    else if (clean.includes('align') || clean.includes('invisalign')) {
        targetName = 'Invisible Aligners';
    }
    else if (clean.includes('lumineer')) {
        targetName = 'Lumineers (per tooth)';
    }
    else if (clean.includes('porcelain veneer')) {
        targetName = 'Porcelain Veneer (per tooth)';
    }
    else if (clean.includes('veneer')) {
        targetName = 'Composite Veneer (per tooth)';
    }
    if (targetName) {
        const aliasMatch = await prisma_1.default.treatment.findFirst({
            where: { name: { equals: targetName, mode: 'insensitive' }, isActive: true },
        });
        if (aliasMatch)
            return aliasMatch;
    }
    const defaultConsult = await prisma_1.default.treatment.findFirst({
        where: { name: { contains: 'Consultation', mode: 'insensitive' }, isActive: true },
    });
    if (defaultConsult)
        return defaultConsult;
    return await prisma_1.default.treatment.findFirst({ where: { isActive: true } });
}
// POST /api/bot/check-availability
router.post('/check-availability', async (req, res) => {
    try {
        const { date, time, serviceType, treatmentId } = req.body;
        if (!date || !time) {
            return res.status(400).json({ message: 'Missing date or time' });
        }
        // Check weekly working days and holidays
        const settings = await prisma_1.default.systemSettings.findUnique({ where: { id: 'settings' } });
        const weeklyWorkingDays = settings?.weeklyWorkingDays
            ? settings.weeklyWorkingDays.split(',').map((d) => d.trim().toLowerCase())
            : ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const targetDate = new Date(`${date}T12:00:00+05:00`);
        const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const targetDayName = dayNames[targetDate.getUTCDay()];
        if (!weeklyWorkingDays.includes(targetDayName)) {
            const capitalized = targetDayName.charAt(0).toUpperCase() + targetDayName.slice(1);
            return res.json({
                isAvailable: false,
                message: `The clinic is closed on ${capitalized}s. Please select a working day.`,
            });
        }
        const { startOfDay, endOfDay } = (0, timezone_1.getKarachiDayBoundaries)(date);
        const holiday = await prisma_1.default.clinicHoliday.findFirst({
            where: {
                isActive: true,
                startDate: { lte: endOfDay },
                endDate: { gte: startOfDay },
            },
        });
        if (holiday) {
            return res.json({
                isAvailable: false,
                message: `The clinic will remain closed for ${holiday.title}. Please select a date after the holiday closure.`,
            });
        }
        const treatment = await resolveCanonicalTreatment(serviceType, treatmentId);
        const treatmentDuration = treatment?.durationMin || 30;
        const treatmentName = treatment?.name || 'General Consultation & Dental Checkup';
        const startTimeStamp = (0, timezone_1.parseKarachiDateTime)(date, time);
        const endTimeStamp = new Date(startTimeStamp.getTime() + treatmentDuration * 60000);
        // Check clinic working hours
        const workEnd = settings?.workDayEnd || '20:00';
        const [endH, endM] = workEnd.split(':').map(Number);
        const closingTime = new Date(endOfDay);
        closingTime.setHours(endH, endM, 0, 0);
        if (endTimeStamp.getTime() > closingTime.getTime()) {
            return res.json({
                isAvailable: false,
                message: `The clinic closes at ${workEnd}. A ${treatmentDuration}-minute treatment starting at ${time} cannot be accommodated.`,
            });
        }
        const existingAppointment = await prisma_1.default.appointment.findFirst({
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
    }
    catch (error) {
        console.error('Error in check-availability:', error);
        return res.status(500).json({ message: 'Internal server error while checking availability.' });
    }
});
// POST /api/bot/book-appointment
router.post('/book-appointment', async (req, res) => {
    try {
        const { patientName, phone, age, date, time, serviceType, patientTreatmentId } = req.body;
        if (!patientName || !phone || !date || !time) {
            return res.status(400).json({
                message: 'Missing required fields: please provide patientName, phone, date, and time',
            });
        }
        const treatment = await resolveCanonicalTreatment(serviceType);
        const treatmentId = treatment?.id;
        const result = await (0, bookingService_1.createAppointment)({
            patientName,
            phone,
            age,
            date,
            time,
            treatmentId: treatmentId,
            bookedBy: 'WHATSAPP_BOT',
            patientTreatmentId: patientTreatmentId || undefined,
            notes: `Booked via WhatsApp for ${patientName}. Age: ${age || 'N/A'}. Service: ${treatment?.name || serviceType || 'General Consultation & Dental Checkup'}`,
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
    }
    catch (error) {
        console.error('Bot booking error:', error);
        return res.status(500).json({ message: 'Internal server error while processing the appointment.' });
    }
});
// PATCH /api/bot/cancel
router.patch('/cancel', async (req, res) => {
    try {
        const { phone, currentDate, appointmentId } = req.body;
        if (!phone) {
            return res.status(400).json({ message: 'Missing required fields: please provide phone' });
        }
        const canonicalPhone = (0, phone_1.normalizePhone)(phone);
        const patient = await prisma_1.default.user.findFirst({
            where: { phone: canonicalPhone },
        });
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found with this phone number.' });
        }
        let appointmentQuery = {
            patientId: patient.id,
            status: { in: ['SCHEDULED', 'RESCHEDULED'] },
            startTime: { gt: new Date() },
        };
        if (appointmentId) {
            appointmentQuery.id = appointmentId;
        }
        else if (currentDate) {
            const { startOfDay, endOfDay } = (0, timezone_1.getKarachiDayBoundaries)(currentDate);
            appointmentQuery.startTime = { gte: startOfDay, lte: endOfDay };
        }
        else {
            const upcomingAppointments = await prisma_1.default.appointment.findMany({
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
        const targetAppointment = await prisma_1.default.appointment.findFirst({
            where: appointmentQuery,
            include: { treatment: true },
        });
        if (!targetAppointment) {
            return res.status(404).json({ message: 'No matching appointment found to cancel.' });
        }
        const updatedAppointment = await prisma_1.default.appointment.update({
            where: { id: targetAppointment.id },
            data: { status: 'CANCELLED' },
        });
        if (targetAppointment.googleEventId) {
            (0, googleCalendar_1.deleteCalendarEvent)(targetAppointment.googleEventId).catch((err) => console.error('Bot cancel calendar error:', err));
        }
        return res.json({
            message: 'Appointment successfully cancelled.',
            appointment: updatedAppointment,
        });
    }
    catch (error) {
        console.error('Bot cancel error:', error);
        return res.status(500).json({ message: 'Internal server error while cancelling appointment.' });
    }
});
// PATCH /api/bot/reschedule
router.patch('/reschedule', async (req, res) => {
    try {
        const { phone, currentDate, newDate, newTime, appointmentId } = req.body;
        if (!phone || !newDate || !newTime) {
            return res.status(400).json({
                message: 'Missing required fields: please provide phone, newDate, and newTime',
            });
        }
        const canonicalPhone = (0, phone_1.normalizePhone)(phone);
        const patient = await prisma_1.default.user.findFirst({
            where: { phone: canonicalPhone },
        });
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found with this phone number.' });
        }
        let appointmentQuery = {
            patientId: patient.id,
            status: { in: ['SCHEDULED', 'RESCHEDULED'] },
            startTime: { gt: new Date() },
        };
        if (appointmentId) {
            appointmentQuery.id = appointmentId;
        }
        else if (currentDate) {
            const { startOfDay, endOfDay } = (0, timezone_1.getKarachiDayBoundaries)(currentDate);
            appointmentQuery.startTime = { gte: startOfDay, lte: endOfDay };
        }
        else {
            const upcomingAppointments = await prisma_1.default.appointment.findMany({
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
        const targetAppointment = await prisma_1.default.appointment.findFirst({
            where: appointmentQuery,
            include: { treatment: true },
        });
        if (!targetAppointment) {
            return res.status(404).json({ message: 'No matching upcoming appointment found to reschedule.' });
        }
        if ((0, timezone_1.isSundayInKarachi)(newDate)) {
            return res.status(400).json({
                message: 'The clinic is closed on Sundays. Please select a different day (Monday-Saturday).',
            });
        }
        const newStartTime = (0, timezone_1.parseKarachiDateTime)(newDate, newTime);
        const durationMin = targetAppointment.treatment?.durationMin || 30;
        const newEndTime = new Date(newStartTime.getTime() + durationMin * 60000);
        const conflict = await prisma_1.default.appointment.findFirst({
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
        const updatedAppointment = await prisma_1.default.appointment.update({
            where: { id: targetAppointment.id },
            data: {
                startTime: newStartTime,
                endTime: newEndTime,
                status: 'RESCHEDULED',
            },
            include: { treatment: true, patient: true },
        });
        if (targetAppointment.googleEventId) {
            (0, googleCalendar_1.updateCalendarEvent)({
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
    }
    catch (error) {
        console.error('Bot reschedule error:', error);
        return res.status(500).json({ message: 'Internal server error while rescheduling appointment.' });
    }
});
// GET /api/bot/daily-reminders
router.get('/daily-reminders', async (_req, res) => {
    try {
        const todayStr = (0, timezone_1.getKarachiTodayStr)();
        const { startOfDay, endOfDay } = (0, timezone_1.getKarachiDayBoundaries)(todayStr);
        const appointments = await prisma_1.default.appointment.findMany({
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
            const phone = (0, phone_1.normalizePhone)(rawPhone);
            const timeString = (0, utils_1.formatTime)(apt.startTime);
            const dateString = (0, utils_1.formatDate)(apt.startTime, 'medium');
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
    }
    catch (error) {
        console.error('Daily reminders error:', error);
        return res.status(500).json({ error: 'Failed to fetch daily reminders' });
    }
});
// GET /api/bot/reminders (1-hour upcoming reminders)
router.get('/reminders', async (_req, res) => {
    try {
        const now = new Date();
        const targetTimeStart = new Date(now.getTime() + 55 * 60000);
        const targetTimeEnd = new Date(now.getTime() + 65 * 60000);
        const upcomingAppointments = await prisma_1.default.appointment.findMany({
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
    }
    catch (error) {
        console.error('Bot 1-hr reminders error:', error);
        return res.status(500).json({ message: 'Internal server error while fetching reminders' });
    }
});
exports.default = router;
//# sourceMappingURL=bot.routes.js.map