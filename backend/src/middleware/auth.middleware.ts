import { Request, Response, NextFunction } from 'express';
import { authenticate } from '../lib/auth';

export interface AuthenticatedUser {
    id: string;
    role: string;
    email: string | null;
    name: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: AuthenticatedUser | null;
        }
    }
}

export function extractToken(req: Request): string | undefined {
    if (req.cookies && req.cookies.session) {
        return req.cookies.session;
    }
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        return authHeader.substring(7).trim();
    }
    return undefined;
}

export async function optionalAuth(req: Request, _res: Response, next: NextFunction) {
    try {
        const token = extractToken(req);
        if (token) {
            const user = await authenticate(token);
            req.user = user as AuthenticatedUser | null;
        }
    } catch {
        req.user = null;
    }
    next();
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
    try {
        const token = extractToken(req);
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized: No token provided' });
        }
        const user = await authenticate(token);
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized: Invalid or expired session' });
        }
        req.user = user as AuthenticatedUser;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
}

export function requireRole(...allowedRoles: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
        }
        next();
    };
}

