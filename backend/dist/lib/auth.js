"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signAccessToken = signAccessToken;
exports.signRefreshToken = signRefreshToken;
exports.encrypt = encrypt;
exports.decrypt = decrypt;
exports.hashPassword = hashPassword;
exports.verifyPassword = verifyPassword;
exports.getSession = getSession;
exports.authenticate = authenticate;
const jose_1 = require("jose");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = __importDefault(require("@/lib/prisma"));
const secretKey = process.env.JWT_SECRET_KEY ||
    process.env.JWT_SECRET ||
    "development-fallback-secret-key-at-least-32-chars";
const key = new TextEncoder().encode(secretKey);
async function signAccessToken(payload) {
    return await new jose_1.SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("1h")
        .sign(key);
}
async function signRefreshToken(payload) {
    return await new jose_1.SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("1d")
        .sign(key);
}
async function encrypt(payload) {
    return await new jose_1.SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("24h")
        .sign(key);
}
async function decrypt(input) {
    const { payload } = await (0, jose_1.jwtVerify)(input, key, {
        algorithms: ["HS256"],
    });
    return payload;
}
async function hashPassword(password) {
    return bcryptjs_1.default.hash(password, 12);
}
async function verifyPassword(password, hash) {
    return bcryptjs_1.default.compare(password, hash);
}
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
            select: { id: true, role: true, email: true, name: true },
        });
        if (!user) {
            return null;
        }
        return user;
    }
    catch {
        return null;
    }
}
//# sourceMappingURL=auth.js.map