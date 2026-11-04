"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRandomPatientPasswordHash = generateRandomPatientPasswordHash;
const crypto_1 = __importDefault(require("crypto"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
/**
 * Generates a cryptographically strong, random hashed password for auto-created patient accounts.
 * Prevents account takeover via predictable default passwords.
 */
async function generateRandomPatientPasswordHash() {
    const randomSecret = crypto_1.default.randomBytes(32).toString("hex");
    return bcryptjs_1.default.hash(randomSecret, 10);
}
