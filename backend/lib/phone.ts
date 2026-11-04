/**
 * Standardizes Pakistani phone numbers to canonical E.164 format: +923xxxxxxxxx
 */
export function normalizePhone(raw: string | null | undefined): string {
    if (!raw) return "";

    // Strip everything except digits
    let digits = raw.replace(/\D/g, "");

    // 00923... -> 923...
    if (digits.startsWith("0092")) {
        digits = digits.slice(2);
    }
    // 03... -> 923...
    else if (digits.startsWith("03")) {
        digits = "92" + digits.slice(1);
    }
    // 3... (10 digits) -> 923...
    else if (digits.length === 10 && digits.startsWith("3")) {
        digits = "92" + digits;
    }

    // Must start with 92
    if (!digits.startsWith("92") && digits.length === 11 && digits.startsWith("0")) {
        digits = "92" + digits.slice(1);
    }

    return `+${digits}`;
}

export function isValidPakistaniPhone(phone: string): boolean {
    const normalized = normalizePhone(phone);
    return /^\+923\d{9}$/.test(normalized);
}
