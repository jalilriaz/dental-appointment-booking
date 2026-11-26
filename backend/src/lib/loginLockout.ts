import prisma from "./prisma";

const MAX_EMAIL_FAILURES = 5;
const MAX_IP_FAILURES = 20;
const FAILURE_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

export interface LockoutStatus {
    locked: boolean;
    retryAfterSeconds?: number;
}

function getIdentifiers(email: string, ip: string): { emailKey: string; ipKey: string } {
    return {
        emailKey: `email:${email.toLowerCase().trim()}`,
        ipKey: `ip:${ip.trim() || "unknown"}`,
    };
}

export async function checkLoginLockout(email: string, ip: string): Promise<LockoutStatus> {
    const { emailKey, ipKey } = getIdentifiers(email, ip);
    const now = new Date();

    const attempts = await prisma.loginAttempt.findMany({
        where: { identifier: { in: [emailKey, ipKey] } },
    });

    let maxLockedUntil: Date | null = null;
    for (const attempt of attempts) {
        if (attempt.lockedUntil && attempt.lockedUntil > now) {
            if (!maxLockedUntil || attempt.lockedUntil > maxLockedUntil) {
                maxLockedUntil = attempt.lockedUntil;
            }
        }
    }

    if (maxLockedUntil) {
        const retryAfterSeconds = Math.max(1, Math.ceil((maxLockedUntil.getTime() - now.getTime()) / 1000));
        return { locked: true, retryAfterSeconds };
    }

    return { locked: false };
}

async function bumpFailure(identifier: string, threshold: number, now: Date): Promise<Date | null> {
    const existing = await prisma.loginAttempt.findUnique({ where: { identifier } });
    const isWindowExpired =
        !existing || now.getTime() - existing.lastFailedAt.getTime() > FAILURE_WINDOW_MS;

    const nextCount = isWindowExpired ? 1 : existing.failedCount + 1;
    const lockedUntil = nextCount >= threshold ? new Date(now.getTime() + LOCKOUT_DURATION_MS) : null;

    await prisma.loginAttempt.upsert({
        where: { identifier },
        create: {
            identifier,
            failedCount: nextCount,
            lastFailedAt: now,
            lockedUntil,
        },
        update: {
            failedCount: nextCount,
            lastFailedAt: now,
            lockedUntil,
        },
    });

    return lockedUntil;
}

export async function recordLoginFailure(email: string, ip: string): Promise<LockoutStatus> {
    const { emailKey, ipKey } = getIdentifiers(email, ip);
    const now = new Date();

    const [emailLockedUntil, ipLockedUntil] = await Promise.all([
        bumpFailure(emailKey, MAX_EMAIL_FAILURES, now),
        bumpFailure(ipKey, MAX_IP_FAILURES, now),
    ]);

    const lockedUntil =
        emailLockedUntil && ipLockedUntil
            ? emailLockedUntil > ipLockedUntil
                ? emailLockedUntil
                : ipLockedUntil
            : emailLockedUntil || ipLockedUntil;

    if (lockedUntil && lockedUntil > now) {
        return {
            locked: true,
            retryAfterSeconds: Math.max(1, Math.ceil((lockedUntil.getTime() - now.getTime()) / 1000)),
        };
    }

    return { locked: false };
}

export async function clearLoginFailures(email: string): Promise<void> {
    const emailKey = `email:${email.toLowerCase().trim()}`;
    await prisma.loginAttempt.deleteMany({
        where: { identifier: emailKey },
    });
}
