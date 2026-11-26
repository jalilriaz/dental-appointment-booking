export const KARACHI_TZ = "Asia/Karachi";
const KARACHI_OFFSET_MS = 5 * 60 * 60 * 1000;

export function formatPKR(amount: number | null | undefined): string {
    if (amount === null || amount === undefined || Number.isNaN(amount)) {
        return "Rs. 0";
    }
    return `Rs. ${Math.round(amount).toLocaleString("en-PK")}`;
}

export function formatPercentChange(current: number, previous: number): string {
    if (!previous || previous <= 0) return "-";
    const pct = Math.round(((current - previous) / previous) * 100);
    return `${pct >= 0 ? "+" : ""}${pct}%`;
}

export function formatPhoneDisplay(phone: string | null | undefined): string {
    if (!phone) return "-";
    return phone;
}

function toKarachiShiftedDate(date: Date | string = new Date()): Date {
    const d = typeof date === "string" ? new Date(date) : date;
    return new Date(d.getTime() + KARACHI_OFFSET_MS);
}

export function getKarachiDateKey(date: Date | string = new Date()): string {
    const shifted = toKarachiShiftedDate(date);
    const y = shifted.getUTCFullYear();
    const m = String(shifted.getUTCMonth() + 1).padStart(2, "0");
    const day = String(shifted.getUTCDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}

export function getKarachiDayBoundsFromKey(dateKey: string): {
    startUtc: Date;
    endUtc: Date;
    dateKey: string;
} {
    const [y, m, d] = dateKey.split("-").map(Number);
    const startUtc = new Date(Date.UTC(y, m - 1, d, 0, 0, 0, 0) - KARACHI_OFFSET_MS);
    const endUtc = new Date(Date.UTC(y, m - 1, d, 23, 59, 59, 999) - KARACHI_OFFSET_MS);
    return { startUtc, endUtc, dateKey };
}

export function getKarachiDayBounds(offsetDays = 0): {
    startUtc: Date;
    endUtc: Date;
    dateKey: string;
} {
    const shifted = toKarachiShiftedDate(new Date());
    shifted.setUTCDate(shifted.getUTCDate() + offsetDays);
    const key = [
        shifted.getUTCFullYear(),
        String(shifted.getUTCMonth() + 1).padStart(2, "0"),
        String(shifted.getUTCDate()).padStart(2, "0"),
    ].join("-");
    return getKarachiDayBoundsFromKey(key);
}

export function getKarachiMonthBounds(monthOffset = 0): {
    startUtc: Date;
    endUtc: Date;
    year: number;
    monthIndex: number;
} {
    const shifted = toKarachiShiftedDate(new Date());
    const base = new Date(Date.UTC(shifted.getUTCFullYear(), shifted.getUTCMonth() + monthOffset, 1));
    const year = base.getUTCFullYear();
    const monthIndex = base.getUTCMonth();
    const startUtc = new Date(Date.UTC(year, monthIndex, 1, 0, 0, 0, 0) - KARACHI_OFFSET_MS);
    const endUtc = new Date(Date.UTC(year, monthIndex + 1, 1, 0, 0, 0, 0) - KARACHI_OFFSET_MS - 1);
    return { startUtc, endUtc, year, monthIndex };
}

export interface KarachiWeekDay {
    dateKey: string;
    dayName: string;
    dateNum: number;
    monthName: string;
    year: number;
    isToday: boolean;
    offset: number;
}

export function getKarachiWeekStrip(): KarachiWeekDay[] {
    const todayShifted = toKarachiShiftedDate(new Date());
    const todayKey = getKarachiDateKey(new Date());
    const dow = todayShifted.getUTCDay(); // 0=Sun..6=Sat
    const mondayShift = dow === 0 ? -6 : 1 - dow;
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const result: KarachiWeekDay[] = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date(Date.UTC(
            todayShifted.getUTCFullYear(),
            todayShifted.getUTCMonth(),
            todayShifted.getUTCDate() + mondayShift + i
        ));
        const dateKey = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
        result.push({
            dateKey,
            dayName: days[d.getUTCDay()],
            dateNum: d.getUTCDate(),
            monthName: months[d.getUTCMonth()],
            year: d.getUTCFullYear(),
            isToday: dateKey === todayKey,
            offset: mondayShift + i,
        });
    }
    return result;
}

export function getKarachiGreeting(): string {
    const hour = toKarachiShiftedDate(new Date()).getUTCHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
}

export function formatKarachiDate(
    date: string | Date,
    style: "short" | "medium" | "long" | "month-year" = "medium"
): string {
    const d = typeof date === "string" ? new Date(date) : date;
    const opts: Record<string, Intl.DateTimeFormatOptions> = {
        short: { timeZone: KARACHI_TZ, month: "short", day: "numeric" },
        medium: { timeZone: KARACHI_TZ, month: "short", day: "numeric", year: "numeric" },
        long: { timeZone: KARACHI_TZ, weekday: "long", month: "short", day: "numeric", year: "numeric" },
        "month-year": { timeZone: KARACHI_TZ, month: "short", year: "numeric" },
    };
    return d.toLocaleDateString("en-PK", opts[style]);
}

export function formatKarachiTime(date: string | Date): string {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleTimeString("en-PK", {
        timeZone: KARACHI_TZ,
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });
}
