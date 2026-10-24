import prisma from "@/lib/prisma";

export async function logAudit(
    userId: string,
    action: string,
    targetId?: string,
    details?: any
) {
    try {
        await prisma.auditLog.create({
            data: {
                userId,
                action,
                targetId: targetId || null,
                details: details ? JSON.stringify(details) : null,
            },
        });
    } catch (error) {
        // We catch and log this instead of throwing, so audit failures
        // don't completely break the user's primary action.
        console.error("Failed to write to audit log:", error);
    }
}
