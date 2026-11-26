const DAY_MS = 24 * 60 * 60 * 1000;

export function getKarachiHour(date: Date = new Date()): number {
    const str = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Karachi",
        hour: "2-digit",
        hour12: false,
    }).format(date);
    return Number.parseInt(str, 10) % 24;
}

/**
 * Quiet hours in Asia/Karachi: 21:00 to 07:59 PKT (no automated recalls sent at night).
 */
export function isKarachiNightHours(date: Date = new Date()): boolean {
    const hour = getKarachiHour(date);
    return hour >= 21 || hour < 8;
}

export interface RecallEligibilityInput {
    lastCompletedAt: Date | null;
    hasFutureAppt: boolean;
    deletedAt: Date | null;
    isActive: boolean;
    recallOptOut: boolean;
    lastRecallSentAt: Date | null;
    now?: Date;
}

export function isRecallEligible(input: RecallEligibilityInput): boolean {
    if (!input.lastCompletedAt) return false;
    if (input.deletedAt || !input.isActive || input.recallOptOut) return false;
    if (input.hasFutureAppt) return false;

    const now = input.now ?? new Date();
    const daysSinceVisit = Math.floor((now.getTime() - input.lastCompletedAt.getTime()) / DAY_MS);
    if (daysSinceVisit < 165 || daysSinceVisit > 365) return false;

    if (input.lastRecallSentAt) {
        const daysSinceSent = Math.floor((now.getTime() - input.lastRecallSentAt.getTime()) / DAY_MS);
        if (daysSinceSent < 120) return false;
    }

    return true;
}
