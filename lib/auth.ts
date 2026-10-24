import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";

const secretKey = process.env.JWT_SECRET_KEY;
if (!secretKey && process.env.NODE_ENV === "production") {
  throw new Error("CRITICAL SECURITY ERROR: JWT_SECRET_KEY is missing in production!");
}
const key = new TextEncoder().encode(secretKey || "development-fallback-secret-key-do-not-use");

export async function signAccessToken(payload: Record<string, unknown>) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h") // Access token lifespan: 1 hour
    .sign(key);
}

export async function signRefreshToken(payload: Record<string, unknown>) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1d") // Refresh token lifespan: 1 day
    .sign(key);
}

export async function decrypt(input: string): Promise<Record<string, unknown>> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload as Record<string, unknown>;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12); // Enterprise standard: bcrypt work factor of 12
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

import prisma from "@/lib/prisma";

export async function getSession(cookieValue: string | undefined) {
  if (!cookieValue) return null;
  try {
    return await decrypt(cookieValue);
  } catch {
    return null;
  }
}

export async function authenticate(cookieValue: string | undefined) {
    if (!cookieValue) return null;
    try {
        const payload = await decrypt(cookieValue);
        const user = await prisma.user.findUnique({
            where: { id: payload.id as string },
            select: { id: true, role: true, isActive: true, deletedAt: true }
        });

        if (!user || user.deletedAt || !user.isActive) {
            return null; 
        }

        return user;
    } catch {
        return null;
    }
}
