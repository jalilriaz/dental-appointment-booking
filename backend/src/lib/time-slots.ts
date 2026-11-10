/**
 * Time slot utilities for the booking system.
 * Working hours: 12:00 PM to 8:00 PM, 30-minute intervals.
 * Buffer time: 15 minutes between appointments (rounds up to next slot).
 */

export interface TimeSlot {
    value: string;   // "12:00", "12:30", "13:00", etc. (24h for internal use)
    label: string;   // "12:00 PM", "12:30 PM", "1:00 PM", etc. (12h display)
    available: boolean;
}

const WORKING_START_HOUR = 12; // 12:00 PM
const WORKING_END_HOUR = 20;  // 8:00 PM
const SLOT_INTERVAL = 30;     // minutes
const BUFFER_TIME = 0;        // exactly 30 mins each, no buffer

/**
 * Convert 24h time string to 12h display format.
 * "13:00" → "1:00 PM", "12:30" → "12:30 PM"
 */
export function to12HourFormat(time24: string): string {
    const [h, m] = time24.split(":").map(Number);
    const period = h >= 12 ? "PM" : "AM";
    const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${hour12}:${m.toString().padStart(2, "0")} ${period}`;
}

/**
 * Generate all possible time slots for clinic working hours.
 */
export function generateAllSlots(): TimeSlot[] {
    const slots: TimeSlot[] = [];
    for (let hour = WORKING_START_HOUR; hour < WORKING_END_HOUR; hour++) {
        for (let min = 0; min < 60; min += SLOT_INTERVAL) {
            const value = `${hour.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}`;
            slots.push({ value, label: to12HourFormat(value), available: true });
        }
    }
    return slots;
}

/**
 * Parse staff working hours JSON string. Falls back to default 12-8 PM.
 */
export function parseStaffWorkingHours(workingHoursJson: string | null | undefined, dayOfWeek: string): { start: string; end: string } | null {
    const defaultHours = { start: "12:00", end: "20:00" };
    if (!workingHoursJson) return defaultHours;
    try {
        const parsed = JSON.parse(workingHoursJson);
        const dayKey = dayOfWeek.toLowerCase().slice(0, 3); // "mon", "tue", etc.
        if (parsed[dayKey] && parsed[dayKey].start && parsed[dayKey].end) {
            return parsed[dayKey];
        }
        if (parsed[dayKey] === null || parsed[dayKey]?.off) return null; // day off
        return defaultHours;
    } catch {
        return defaultHours;
    }
}

/**
 * Calculate end time given a start time string and duration in minutes.
 * "14:00" + 90min → "15:30"
 */
export function calculateEndTime(startTime: string, durationMin: number): string {
    const [h, m] = startTime.split(":").map(Number);
    const totalMin = h * 60 + m + durationMin;
    const endH = Math.floor(totalMin / 60);
    const endM = totalMin % 60;
    return `${endH.toString().padStart(2, "0")}:${endM.toString().padStart(2, "0")}`;
}

interface OccupiedPeriod {
    startTime: Date;
    endTime: Date;
}

/**
 * Given a list of existing appointments, a treatment duration, and optional staff working hours,
 * return the list of available time slots.
 * Implements 15-minute buffer: if appointment ends at 2:30, next slot is 3:00 (rounded up to next 30-min).
 */
export function getAvailableSlots(
    existingAppointments: OccupiedPeriod[],
    treatmentDurationMin: number,
    staffWorkingHours?: { start: string; end: string } | null,
): TimeSlot[] {
    // If staff has a day off
    if (staffWorkingHours === null) return [];

    const allSlots = generateAllSlots();
    const hours = staffWorkingHours || { start: "12:00", end: "20:00" };

    // Filter by staff working hours
    const workSlots = allSlots.filter((slot) => {
        return slot.value >= hours.start && slot.value < hours.end;
    });

    // Filter out slots where the appointment would extend past working hours
    const validSlots = workSlots.filter((slot) => {
        const endTime = calculateEndTime(slot.value, treatmentDurationMin);
        return endTime <= hours.end;
    });

    // Mark occupied slots
    return validSlots.map((slot) => {
        const [slotH, slotM] = slot.value.split(":").map(Number);
        const slotStartMin = slotH * 60 + slotM;
        const slotEndMin = slotStartMin + treatmentDurationMin;

        const isOccupied = existingAppointments.some((apt) => {
            const aptStartMin = apt.startTime.getHours() * 60 + apt.startTime.getMinutes();
            // Add buffer: 15 min after appointment, rounded up to next 30-min slot
            const bufferEndMin = aptStartMin + getOccupiedDurationWithBuffer(apt);

            const aptEndWithBuffer = bufferEndMin;
            const aptStart = aptStartMin;

            // Check overlap: [slotStart, slotEnd) overlaps [aptStart, aptEndWithBuffer)
            return slotStartMin < aptEndWithBuffer && slotEndMin > aptStart;
        });

        return { ...slot, available: !isOccupied };
    });
}

/**
 * Calculate how many minutes a slot is occupied including the 15-min buffer,
 * rounded up to the next 30-min boundary.
 */
function getOccupiedDurationWithBuffer(apt: OccupiedPeriod): number {
    const durationMs = apt.endTime.getTime() - apt.startTime.getTime();
    const durationMin = durationMs / 60000;
    const withBuffer = durationMin + BUFFER_TIME;
    // Round up to next 30-minute interval
    return Math.ceil(withBuffer / SLOT_INTERVAL) * SLOT_INTERVAL;
}
