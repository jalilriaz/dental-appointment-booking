import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

function resolveSecretKey(): Uint8Array {
  const secretKey = process.env.JWT_SECRET_KEY || process.env.JWT_SECRET;
  if (!secretKey || secretKey.trim().length < 32) {
    throw new Error(
      "FATAL: JWT_SECRET_KEY (at least 32 characters) must be configured in the environment."
    );
  }
  return new TextEncoder().encode(secretKey);
}

// Fail closed at startup (after dotenv.config() in src/index.ts)
const key = resolveSecretKey();

export async function signAccessToken(payload: Record<string, unknown>) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(key);
}

export async function signRefreshToken(payload: Record<string, unknown>) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1d")
    .sign(key);
}

export async function encrypt(payload: Record<string, unknown>) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(key);
}

export async function decrypt(input: string): Promise<Record<string, unknown>> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload as Record<string, unknown>;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

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
      select: {
        id: true,
        role: true,
        email: true,
        name: true,
        isActive: true,
        deletedAt: true,
        tokenVersion: true,
        mustChangePassword: true,
      },
    });

    if (!user || !user.isActive || user.deletedAt) {
      return null;
    }

    const tokenVersion = Number(payload.tokenVersion ?? 0);
    if (user.tokenVersion !== tokenVersion) {
      return null;
    }

    return {
      id: user.id,
      role: user.role,
      email: user.email,
      name: user.name,
      mustChangePassword: user.mustChangePassword,
    };
  } catch {
    return null;
  }
}
