"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractToken = extractToken;
exports.optionalAuth = optionalAuth;
exports.requireAuth = requireAuth;
exports.requireRole = requireRole;
const auth_1 = require("../lib/auth");
function extractToken(req) {
    if (req.cookies && req.cookies.session) {
        return req.cookies.session;
    }
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        return authHeader.substring(7).trim();
    }
    return undefined;
}
async function optionalAuth(req, _res, next) {
    try {
        const token = extractToken(req);
        if (token) {
            const user = await (0, auth_1.authenticate)(token);
            req.user = user;
        }
    }
    catch {
        req.user = null;
    }
    next();
}
async function requireAuth(req, res, next) {
    try {
        const token = extractToken(req);
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized: No token provided' });
        }
        const user = await (0, auth_1.authenticate)(token);
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized: Invalid or expired session' });
        }
        req.user = user;
        next();
    }
    catch (error) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
}
function requireRole(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
        }
        next();
    };
}
//# sourceMappingURL=auth.middleware.js.map