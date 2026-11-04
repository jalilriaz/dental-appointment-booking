"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePatientCode = generatePatientCode;
const prisma_1 = __importDefault(require("@/lib/prisma"));
/**
 * Generate the next patient code.
 * Patient codes start at 1000 and auto-increment.
 * Used by WhatsApp bot and walk-in registration.
 */
async function generatePatientCode() {
    const result = await prisma_1.default.user.aggregate({
        _max: { patientCode: true },
    });
    return (result._max.patientCode || 999) + 1;
}
