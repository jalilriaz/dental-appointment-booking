import { getKarachiDateKey } from "@/lib/format";

const KARACHI_OFFSET_MS = 5 * 60 * 60 * 1000;

/**
 * Returns Asia/Karachi UTC boundaries [00:00:00.000 PKT, 23:59:59.999 PKT] for a YYYY-MM-DD key.
 */
export function getKarachiBoundsForDateKey(dateKey: string): { startUtc: Date; endUtc: Date; closingDateUtc: Date } {
    const [y, m, d] = dateKey.split("-").map(Number);
    if (!y || !m || !d) {
        const fallbackKey = getKarachiDateKey(new Date());
        return getKarachiBoundsForDateKey(fallbackKey);
    }
    const startUtc = new Date(Date.UTC(y, m - 1, d, 0, 0, 0, 0) - KARACHI_OFFSET_MS);
    const endUtc = new Date(Date.UTC(y, m - 1, d, 23, 59, 59, 999) - KARACHI_OFFSET_MS);
    const closingDateUtc = new Date(Date.UTC(y, m - 1, d, 0, 0, 0, 0));
    return { startUtc, endUtc, closingDateUtc };
}

export function getKarachiDateKeyFromClosingDate(closingDate: Date): string {
    return `${closingDate.getUTCFullYear()}-${String(closingDate.getUTCMonth() + 1).padStart(2, "0")}-${String(closingDate.getUTCDate()).padStart(2, "0")}`;
}

export function shiftDateKey(dateKey: string, deltaDays: number): string {
    const [y, m, d] = dateKey.split("-").map(Number);
    const dt = new Date(Date.UTC(y, m - 1, d + deltaDays));
    return `${dt.getUTCFullYear()}-${String(dt.getUTCMonth() + 1).padStart(2, "0")}-${String(dt.getUTCDate()).padStart(2, "0")}`;
}

export function diffDaysInKarachi(from: Date, to: Date): number {
    const aKey = getKarachiDateKey(from);
    const bKey = getKarachiDateKey(to);
    const [ay, am, ad] = aKey.split("-").map(Number);
    const [by, bm, bd] = bKey.split("-").map(Number);
    const msA = Date.UTC(ay, am - 1, ad);
    const msB = Date.UTC(by, bm - 1, bd);
    return Math.max(0, Math.round((msB - msA) / 86400000));
}
