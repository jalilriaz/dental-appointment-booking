import crypto from "crypto";
import { Request, Response, NextFunction } from "express";

/**
 * Validates the Authorization header using timing-safe comparison against process.env.N8N_SECRET_KEY.
 */
export function verifyBotAuth(authHeader?: string | null): { ok: boolean; status?: number; error?: string } {
    const configuredSecret = process.env.N8N_SECRET_KEY?.replace(/^["']|["']$/g, "").trim();

    if (!configuredSecret) {
        return {
            ok: false,
            status: 500,
            error: "N8N_SECRET_KEY is not configured on the server",
        };
    }

    if (!authHeader || !authHeader.toLowerCase().startsWith("bearer ")) {
        return {
            ok: false,
            status: 401,
            error: "Missing or invalid Authorization header (Bearer token required)",
        };
    }

    const token = authHeader.substring(7).replace(/^["']|["']$/g, "").trim();
    const tokenBuf = Buffer.from(token);
    const secretBuf = Buffer.from(configuredSecret);

    if (tokenBuf.length !== secretBuf.length || !crypto.timingSafeEqual(tokenBuf, secretBuf)) {
        return {
            ok: false,
            status: 401,
            error: "Unauthorized",
        };
    }

    return { ok: true };
}

export function botAuthMiddleware(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    const auth = verifyBotAuth(authHeader);
    if (!auth.ok) {
        return res.status(auth.status || 401).json({ message: auth.error });
    }
    next();
}
