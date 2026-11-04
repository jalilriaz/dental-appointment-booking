"use strict";
/**
 * Asia/Karachi Timezone Utilities (UTC+5)
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.KARACHI_TZ = void 0;
exports.isSundayInKarachi = isSundayInKarachi;
exports.parseKarachiDateTime = parseKarachiDateTime;
exports.getKarachiDayBoundaries = getKarachiDayBoundaries;
exports.getKarachiTodayStr = getKarachiTodayStr;
exports.KARACHI_TZ = "Asia/Karachi";
/**
 * Returns whether a given date or "YYYY-MM-DD" string falls on Sunday in Asia/Karachi.
 */
function isSundayInKarachi(dateOrStr) {
    let dateObj;
    if (typeof dateOrStr === "string") {
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateOrStr)) {
            // For a YYYY-MM-DD string, construct noon in PKT to avoid any boundary bleed
            dateObj = new Date(`${dateOrStr}T12:00:00+05:00`);
        }
        else {
            dateObj = new Date(dateOrStr);
        }
    }
    else {
        dateObj = dateOrStr;
    }
    const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: exports.KARACHI_TZ,
        weekday: "short",
    });
    return formatter.format(dateObj) === "Sun";
}
/**
 * Parses YYYY-MM-DD and HH:mm strings into a Date object representing that exact time in Asia/Karachi.
 */
function parseKarachiDateTime(dateStr, timeStr) {
    // Normalise time to HH:mm
    const trimmed = timeStr.trim();
    let hourStr = "00";
    let minStr = "00";
    const ampmMatch = trimmed.match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)$/i);
    if (ampmMatch) {
        let hour = parseInt(ampmMatch[1], 10);
        minStr = ampmMatch[2] || "00";
        const mod = ampmMatch[3].toLowerCase();
        if (mod === "pm" && hour < 12)
            hour += 12;
        if (mod === "am" && hour === 12)
            hour = 0;
        hourStr = String(hour).padStart(2, "0");
    }
    else {
        const parts = trimmed.split(":");
        hourStr = parts[0].padStart(2, "0");
        minStr = (parts[1] || "00").padStart(2, "0");
    }
    // ISO string with +05:00 offset
    return new Date(`${dateStr}T${hourStr}:${minStr}:00+05:00`);
}
/**
 * Given a "YYYY-MM-DD" date string, returns the exact UTC start and end of that day in Asia/Karachi.
 * In PKT: 00:00:00 to 23:59:59.999
 */
function getKarachiDayBoundaries(dateStr) {
    const startOfDay = new Date(`${dateStr}T00:00:00.000+05:00`);
    const endOfDay = new Date(`${dateStr}T23:59:59.999+05:00`);
    return { startOfDay, endOfDay };
}
/**
 * Returns today's YYYY-MM-DD string in Asia/Karachi.
 */
function getKarachiTodayStr() {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat("en-CA", {
        timeZone: exports.KARACHI_TZ,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });
    return formatter.format(now); // en-CA yields YYYY-MM-DD
}
