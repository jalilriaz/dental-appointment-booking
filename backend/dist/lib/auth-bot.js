"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyBotAuth = verifyBotAuth;
exports.botAuthMiddleware = botAuthMiddleware;
const crypto_1 = __importDefault(require("crypto"));
/**
 * Validates the Authorization header using timing-safe comparison against process.env.N8N_SECRET_KEY.
 */
function verifyBotAuth(authHeader) {
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
    if (tokenBuf.length !== secretBuf.length || !crypto_1.default.timingSafeEqual(tokenBuf, secretBuf)) {
        return {
            ok: false,
            status: 401,
            error: "Unauthorized",
        };
    }
    return { ok: true };
}
function botAuthMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    const auth = verifyBotAuth(authHeader);
    if (!auth.ok) {
        return res.status(auth.status || 401).json({ message: auth.error });
    }
    next();
}
//# sourceMappingURL=auth-bot.js.map