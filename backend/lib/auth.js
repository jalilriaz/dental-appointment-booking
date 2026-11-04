"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signAccessToken = signAccessToken;
exports.signRefreshToken = signRefreshToken;
exports.decrypt = decrypt;
exports.hashPassword = hashPassword;
exports.verifyPassword = verifyPassword;
exports.getSession = getSession;
exports.authenticate = authenticate;
const jose_1 = require("jose");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const secretKey = process.env.JWT_SECRET_KEY;
if (!secretKey && process.env.NODE_ENV === "production") {
    throw new Error("CRITICAL SECURITY ERROR: JWT_SECRET_KEY is missing in production!");
}
const key = new TextEncoder().encode(secretKey || "development-fallback-secret-key-do-not-use");
async function signAccessToken(payload) {
    return await new jose_1.SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("1h") // Access token lifespan: 1 hour
        .sign(key);
}
async function signRefreshToken(payload) {
    return await new jose_1.SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("1d") // Refresh token lifespan: 1 day
        .sign(key);
}
async function decrypt(input) {
    const { payload } = await (0, jose_1.jwtVerify)(input, key, {
        algorithms: ["HS256"],
    });
    return payload;
}
async function hashPassword(password) {
    return bcryptjs_1.default.hash(password, 12); // Enterprise standard: bcrypt work factor of 12
}
async function verifyPassword(password, hash) {
    return bcryptjs_1.default.compare(password, hash);
}
const prisma_1 = __importDefault(require("@/lib/prisma"));
async function getSession(cookieValue) {
    if (!cookieValue)
        return null;
    try {
        return await decrypt(cookieValue);
    }
    catch {
        return null;
    }
}
async function authenticate(cookieValue) {
    if (!cookieValue)
        return null;
    try {
        const payload = await decrypt(cookieValue);
        const user = await prisma_1.default.user.findUnique({
            where: { id: payload.id },
            select: { id: true, role: true, isActive: true, deletedAt: true }
        });
        if (!user || user.deletedAt || !user.isActive) {
            return null;
        }
        return user;
    }
    catch {
        return null;
    }
}
