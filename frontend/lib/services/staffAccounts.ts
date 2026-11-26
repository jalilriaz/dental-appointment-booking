import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { logFrontendAudit } from "@/lib/audit";

export async function listStaffAccounts() {
    return prisma.user.findMany({
        where: { role: { in: ["ADMIN", "STAFF"] } },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            isActive: true,
            deletedAt: true,
            mustChangePassword: true,
            createdAt: true,
        },
        orderBy: [{ isActive: "desc" }, { createdAt: "asc" }],
    });
}

export async function createStaffAccount(
    input: { name: string; email: string; phone?: string | null; role: "ADMIN" | "STAFF"; password: string },
    actorUserId: string
) {
    const email = input.email.toLowerCase().trim();
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) throw new Error("An account with this email already exists.");

    const passwordHash = await bcrypt.hash(input.password, 12);
    const created = await prisma.user.create({
        data: {
            name: input.name.trim(),
            email,
            phone: input.phone?.trim() || null,
            role: input.role,
            password: passwordHash,
            isActive: true,
        },
        select: {
            id: true, name: true, email: true, phone: true, role: true,
            isActive: true, deletedAt: true, mustChangePassword: true, createdAt: true,
        },
    });

    await logFrontendAudit({
        userId: actorUserId,
        action: "CREATE_STAFF",
        entity: "User",
        entityId: created.id,
        details: { role: created.role },
    });
    return created;
}

export async function updateStaffAccount(
    targetId: string,
    input: { name?: string; email?: string; phone?: string | null; role?: "ADMIN" | "STAFF"; isActive?: boolean },
    actorUserId: string
) {
    const target = await prisma.user.findUnique({
        where: { id: targetId },
        select: { id: true, role: true, isActive: true, name: true, email: true },
    });
    if (!target) return { ok: false as const, status: 404, error: "Staff account not found." };

    const nextRole = input.role ?? (target.role as "ADMIN" | "STAFF");
    const nextActive = input.isActive !== undefined ? input.isActive : target.isActive;
    const losingAdminCapacity = target.role === "ADMIN" && target.isActive && (!nextActive || nextRole !== "ADMIN");

    if (losingAdminCapacity) {
        const activeAdmins = await prisma.user.count({
            where: { role: "ADMIN", isActive: true, deletedAt: null },
        });
        if (activeAdmins <= 1) {
            return {
                ok: false as const,
                status: 409,
                error: "Cannot deactivate or demote the last active clinic administrator.",
            };
        }
    }

    const deactivating = input.isActive === false;
    const reactivating = input.isActive === true;

    const updated = await prisma.user.update({
        where: { id: targetId },
        data: {
            ...(input.name !== undefined ? { name: input.name.trim() } : {}),
            ...(input.email !== undefined ? { email: input.email.toLowerCase().trim() } : {}),
            ...(input.phone !== undefined ? { phone: input.phone?.trim() || null } : {}),
            ...(input.role !== undefined ? { role: input.role } : {}),
            ...(deactivating ? { isActive: false, deletedAt: new Date(), tokenVersion: { increment: 1 } } : {}),
            ...(reactivating ? { isActive: true, deletedAt: null } : {}),
        },
        select: {
            id: true, name: true, email: true, phone: true, role: true,
            isActive: true, deletedAt: true, mustChangePassword: true, createdAt: true,
        },
    });

    await logFrontendAudit({
        userId: actorUserId,
        action: deactivating ? "DEACTIVATE_STAFF" : reactivating ? "REACTIVATE_STAFF" : "UPDATE_STAFF",
        entity: "User",
        entityId: targetId,
        details: { role: updated.role, isActive: updated.isActive },
    });

    return { ok: true as const, staff: updated };
}

function generateTempPassword(): string {
    const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$";
    const bytes = crypto.randomBytes(12);
    return Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
}

export async function resetStaffPasswordByAdmin(targetId: string, actorUserId: string) {
    const target = await prisma.user.findFirst({
        where: { id: targetId, role: { in: ["ADMIN", "STAFF"] } },
        select: { id: true, name: true },
    });
    if (!target) throw new Error("Staff account not found.");

    const tempPassword = generateTempPassword();
    const hash = await bcrypt.hash(tempPassword, 12);

    await prisma.user.update({
        where: { id: targetId },
        data: {
            password: hash,
            mustChangePassword: true,
            tokenVersion: { increment: 1 },
        },
    });

    await logFrontendAudit({
        userId: actorUserId,
        action: "RESET_STAFF_PASSWORD",
        entity: "User",
        entityId: targetId,
        details: { mustChangePassword: true },
    });

    return { tempPassword, staffName: target.name };
}
