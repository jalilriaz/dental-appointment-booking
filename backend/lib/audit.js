"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logAudit = logAudit;
const prisma_1 = __importDefault(require("@/lib/prisma"));
async function logAudit(userId, action, targetId, details) {
    try {
        await prisma_1.default.auditLog.create({
            data: {
                userId,
                action,
                targetId: targetId || null,
                details: details ? JSON.stringify(details) : null,
            },
        });
    }
    catch (error) {
        // We catch and log this instead of throwing, so audit failures
        // don't completely break the user's primary action.
        console.error("Failed to write to audit log:", error);
    }
}
