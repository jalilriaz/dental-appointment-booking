import { getKarachiTodayStr } from "./timezone";

function toMinutes(hhmm: string): number | null {
    if (!/^\d{2}:\d{2}$/.test(hhmm)) return null;
    const [h, m] = hhmm.split(":").map(Number);
    if (h < 0 || h > 23 || m < 0 || m > 59) return null;
    return h * 60 + m;
}

export function isOverlappingBreak(
    slotStartMin: number,
    slotEndMin: number,
    breakStart?: string | null,
    breakEnd?: string | null
): boolean {
    if (!breakStart || !breakEnd) return false;
    const bStart = toMinutes(breakStart);
    const bEnd = toMinutes(breakEnd);
    if (bStart === null || bEnd === null || bStart >= bEnd) return false;
    return slotStartMin < bEnd && slotEndMin > bStart;
}

export function hasBufferCollision(
    slotStart: Date,
    slotEnd: Date,
    existingAppts: Array<{ startTime: Date; endTime: Date }>,
    bufferMin: number
): boolean {
    const padMs = Math.max(0, bufferMin) * 60_000;
    return existingAppts.some((apt) => {
        const blockedStart = apt.startTime.getTime() - padMs;
        const blockedEnd = apt.endTime.getTime() + padMs;
        return slotStart.getTime() < blockedEnd && slotEnd.getTime() > blockedStart;
    });
}

export function violatesAdvanceNotice(slotStart: Date, now: Date, advanceNoticeMin: number): boolean {
    if (advanceNoticeMin <= 0) return false;
    return slotStart.getTime() < now.getTime() + advanceNoticeMin * 60_000;
}

export function exceedsMaxBookingHorizon(targetDateStr: string, maxBookingDaysAhead: number): boolean {
    if (maxBookingDaysAhead <= 0) return false;
    const todayStr = getKarachiTodayStr();
    const target = new Date(`${targetDateStr}T12:00:00Z`);
    const today = new Date(`${todayStr}T12:00:00Z`);
    const diffDays = Math.round((target.getTime() - today.getTime()) / (24 * 60 * 60 * 1000));
    return diffDays > maxBookingDaysAhead;
}

export function violatesCancellationCutoff(
    appointmentStart: Date,
    now: Date,
    cancellationCutoffHours: number
): boolean {
    if (cancellationCutoffHours <= 0) return false;
    return appointmentStart.getTime() - now.getTime() < cancellationCutoffHours * 60 * 60 * 1000;
}
