import prisma from "@/lib/prisma";

const REDACTED_KEYS = new Set([
    "password",
    "token",
    "refreshToken",
    "resetToken",
    "secret",
    "googleCalendarToken",
    "googleCalendarRefreshToken",
]);

function sanitizeAuditValue(value: unknown): unknown {
    if (value === null || value === undefined) return value;
    if (Array.isArray(value)) return value.map(sanitizeAuditValue);
    if (typeof value === "object") {
        const sanitized: Record<string, unknown> = {};
        for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
            sanitized[k] = REDACTED_KEYS.has(k) ? "[REDACTED]" : sanitizeAuditValue(v);
        }
        return sanitized;
    }
    return value;
}

export async function logFrontendAudit(input: {
    userId?: string | null;
    action: string;
    entity: string;
    entityId?: string | null;
    details?: Record<string, unknown> | null;
}): Promise<void> {
    try {
        await prisma.auditLog.create({
            data: {
                userId: input.userId || null,
                action: input.action,
                entity: input.entity,
                entityId: input.entityId || null,
                details: input.details ? (sanitizeAuditValue(input.details) as any) : undefined,
            },
        });
    } catch (error) {
        console.error("Failed to write frontend audit log:", error);
    }
}
