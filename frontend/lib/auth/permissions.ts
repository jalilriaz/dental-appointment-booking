import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { decrypt } from "@/lib/auth";
import prisma from "@/lib/prisma";

export type AppRole = "ADMIN" | "STAFF" | "PATIENT";

export type PermissionAction =
    | "dashboard:admin"
    | "dashboard:staff"
    | "revenue:read"
    | "settings:read"
    | "settings:write"
    | "staff:manage"
    | "services:manage"
    | "appointments:read"
    | "appointments:write"
    | "appointments:checkout"
    | "appointments:notes:read"
    | "appointments:notes:write"
    | "patients:read"
    | "patients:write"
    | "patients:alerts:write";

const ROLE_PERMISSIONS: Record<AppRole, ReadonlySet<PermissionAction>> = {
    ADMIN: new Set<PermissionAction>([
        "dashboard:admin",
        "dashboard:staff",
        "revenue:read",
        "settings:read",
        "settings:write",
        "staff:manage",
        "services:manage",
        "appointments:read",
        "appointments:write",
        "appointments:checkout",
        "appointments:notes:read",
        "appointments:notes:write",
        "patients:read",
        "patients:write",
        "patients:alerts:write",
    ]),
    STAFF: new Set<PermissionAction>([
        "dashboard:staff",
        "appointments:read",
        "appointments:write",
        "appointments:checkout",
        "appointments:notes:read",
        "patients:read",
        "patients:write",
    ]),
    PATIENT: new Set<PermissionAction>([]),
};

export interface VerifiedSessionUser {
    id: string;
    role: AppRole;
    email: string | null;
    name: string;
    googleCalendarConnected?: boolean;
    mustChangePassword?: boolean;
}

/**
 * Single source of truth for role-based capability checks.
 */
export function can(role: string | null | undefined, action: PermissionAction): boolean {
    if (!role) return false;
    const normalized = role.toUpperCase() as AppRole;
    return ROLE_PERMISSIONS[normalized]?.has(action) ?? false;
}

/**
 * Reads the HTTP-only session cookie, verifies the JWT, and loads the live user record from DB.
 */
export async function getServerUser(): Promise<VerifiedSessionUser | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;
    if (!token) return null;

    try {
        const payload = await decrypt(token);
        if (!payload?.id || typeof payload.id !== "string") return null;

        const user = await prisma.user.findUnique({
            where: { id: payload.id },
            select: {
                id: true, role: true, email: true, name: true,
                isActive: true, deletedAt: true, tokenVersion: true,
                mustChangePassword: true, googleCalendarConnected: true,
            },
        });

        if (!user || !user.isActive || user.deletedAt) return null;
        if (user.tokenVersion !== Number(payload.tokenVersion ?? 0)) return null;
        return {
            id: user.id,
            role: user.role as AppRole,
            email: user.email,
            name: user.name,
            googleCalendarConnected: user.googleCalendarConnected,
            mustChangePassword: user.mustChangePassword,
        };
    } catch {
        return null;
    }
}

/**
 * Server Component / page guard: verifies session & allowed role, redirecting if unauthorized.
 */
export async function requireRole(
    allowedRoles: readonly AppRole[],
    options?: { callbackUrl?: string; redirectTo?: string; allowPasswordChange?: boolean }
): Promise<VerifiedSessionUser> {
    const user = await getServerUser();
    if (!user || !allowedRoles.includes(user.role)) {
        const target =
            options?.redirectTo ||
            (options?.callbackUrl
                ? `/login?callbackUrl=${encodeURIComponent(options.callbackUrl)}`
                : "/login");
        redirect(target);
    }
    if (user.mustChangePassword && !options?.allowPasswordChange) {
        redirect("/change-password");
    }
    return user;
}

/**
 * Server Action guard: returns structured authorization result without throwing NEXT_REDIRECT.
 */
export async function requireActionRole(
    allowedRoles: readonly AppRole[]
): Promise<
    | { ok: true; user: VerifiedSessionUser }
    | { ok: false; error: string; status: 401 | 403 }
> {
    const user = await getServerUser();
    if (!user) {
        return { ok: false, error: "Unauthorized: Please sign in to continue.", status: 401 };
    }
    if (!allowedRoles.includes(user.role)) {
        return { ok: false, error: "Forbidden: Insufficient permissions for this action.", status: 403 };
    }
    return { ok: true, user };
}
