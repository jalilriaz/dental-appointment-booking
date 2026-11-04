"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = POST;
const server_1 = require("next/server");
const auth_bot_1 = require("@/lib/auth-bot");
const bookingService_1 = require("@/lib/bookingService");
async function POST(req) {
    try {
        // 1. Timing-Safe Authentication Check
        const auth = (0, auth_bot_1.verifyBotAuth)(req);
        if (!auth.ok) {
            return server_1.NextResponse.json({ message: auth.error }, { status: auth.status || 401 });
        }
        // 2. Parse and Validate Request Body
        const body = await req.json();
        const { patientName, phone, age, date, time, serviceType, patientTreatmentId } = body;
        if (!patientName || !phone || !date || !time) {
            return server_1.NextResponse.json({ message: "Missing required fields: please provide patientName, phone, date, and time" }, { status: 400 });
        }
        // 3. Resolve treatmentId from serviceType if provided
        let treatmentId = undefined;
        if (serviceType) {
            const prisma = (await Promise.resolve().then(() => __importStar(require("@/lib/prisma")))).default;
            const treatment = await prisma.treatment.findFirst({
                where: {
                    name: {
                        contains: serviceType,
                        mode: "insensitive",
                    },
                },
            });
            if (treatment) {
                treatmentId = treatment.id;
            }
        }
        // 4. Delegate to Centralized Booking Engine
        const result = await (0, bookingService_1.createAppointment)({
            patientName,
            phone,
            age,
            date,
            time,
            treatmentId: treatmentId,
            bookedBy: "WHATSAPP_BOT",
            patientTreatmentId: patientTreatmentId || undefined,
            notes: `Booked via WhatsApp for ${patientName}. Age: ${age || "N/A"}. Service: ${serviceType || "Standard"}`,
        });
        if (!result.success) {
            return server_1.NextResponse.json({ message: result.error || "Failed to book appointment." }, { status: result.status || 400 });
        }
        return server_1.NextResponse.json({
            success: true,
            message: result.message || "Appointment booked successfully.",
            patientCode: result.patientCode,
            isMultiSession: result.isMultiSession,
            sessionNumber: result.sessionNumber,
            sessionLabel: result.sessionLabel,
            appointment: result.appointment,
        });
    }
    catch (error) {
        console.error("Error booking appointment via bot:", error);
        return server_1.NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
