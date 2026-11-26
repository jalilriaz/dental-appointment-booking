import prisma from "./prisma";
import { Prisma } from "../generated/client";

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

export interface AuditLogInput {
    userId?: string | null;
    action: string;
    entity: string;
    entityId?: string | null;
    details?: Record<string, unknown> | null;
    ipAddress?: string | null;
}

export async function logAudit(input: AuditLogInput): Promise<void>;
export async function logAudit(
    userId: string,
    action: string,
    targetId?: string,
    details?: Record<string, unknown>
): Promise<void>;
export async function logAudit(
    userIdOrInput: string | AuditLogInput,
    actionArg?: string,
    targetIdArg?: string,
    detailsArg?: Record<string, unknown>
): Promise<void> {
    try {
        const entry: AuditLogInput =
            typeof userIdOrInput === "object"
                ? userIdOrInput
                : {
                      userId: userIdOrInput,
                      action: actionArg || "UNKNOWN",
                      entity: targetIdArg ? "Record" : "System",
                      entityId: targetIdArg || null,
                      details: detailsArg || null,
                  };

        const safeDetails = entry.details
            ? (sanitizeAuditValue(entry.details) as Prisma.InputJsonValue)
            : undefined;

        await prisma.auditLog.create({
            data: {
                userId: entry.userId || null,
                action: entry.action,
                entity: entry.entity,
                entityId: entry.entityId || null,
                details: safeDetails,
                ipAddress: entry.ipAddress || null,
            },
        });
    } catch (error) {
        console.error("Failed to write to audit log:", error);
    }
}
