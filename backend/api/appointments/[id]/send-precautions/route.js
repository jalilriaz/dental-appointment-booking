"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
exports.POST = POST;
const server_1 = require("next/server");
const prisma_1 = __importDefault(require("@/lib/prisma"));
const headers_1 = require("next/headers");
const auth_1 = require("@/lib/auth");
const precautions_1 = require("@/lib/precautions");
async function verifyAuth() {
    const cookie = (await (0, headers_1.cookies)()).get("session")?.value;
    if (!cookie)
        return null;
    try {
        const session = await (0, auth_1.decrypt)(cookie);
        if (session.role === "ADMIN" || session.role === "STAFF") {
            return session;
        }
        return null;
    }
    catch {
        return null;
    }
}
async function getAppointmentData(appointmentId) {
    return prisma_1.default.appointment.findUnique({
        where: { id: appointmentId },
        include: {
            patient: {
                select: {
                    id: true,
                    name: true,
                    phone: true,
                }
            },
            treatment: {
                select: {
                    id: true,
                    name: true,
                    instructions: true,
                }
            },
            clinicalNotes: {
                take: 1,
                orderBy: { createdAt: "desc" },
                select: { remarks: true, prescription: true }
            }
        }
    });
}
// ─── GET: Preview Precautions without dispatching ───────────────────────────
async function GET(request, { params }) {
    try {
        const session = await verifyAuth();
        if (!session) {
            return server_1.NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const { id: appointmentId } = await params;
        const appointment = await getAppointmentData(appointmentId);
        if (!appointment) {
            return server_1.NextResponse.json({ error: "Appointment not found" }, { status: 404 });
        }
        const patientName = appointment.patient?.name || appointment.guestName || "Valued Patient";
        const patientPhone = appointment.patient?.phone || appointment.guestPhone;
        if (!patientPhone) {
            return server_1.NextResponse.json({
                error: "No WhatsApp/phone number recorded for this patient"
            }, { status: 400 });
        }
        const precautionsList = (0, precautions_1.getPrecautionsForTreatment)(appointment.treatment.name, appointment.treatment.instructions);
        const message = (0, precautions_1.formatPrecautionsMessage)({
            patientName,
            treatmentName: appointment.treatment.name,
            precautions: precautionsList,
            doctorName: "Dr. Sheriyaar"
        });
        const whatsappUrl = (0, precautions_1.generateWhatsAppDeepLink)(patientPhone, message);
        return server_1.NextResponse.json({
            success: true,
            patientName,
            patientPhone,
            treatmentName: appointment.treatment.name,
            precautions: precautionsList,
            message,
            whatsappUrl,
            n8nConfigured: Boolean(process.env.N8N_WEBHOOK_URL),
        });
    }
    catch (error) {
        console.error("Failed to load precautions preview:", error);
        return server_1.NextResponse.json({ error: "Failed to load precautions preview" }, { status: 500 });
    }
}
// ─── POST: Dispatch Precautions directly to n8n Webhook ───────────────────────
async function POST(request, { params }) {
    try {
        const session = await verifyAuth();
        if (!session) {
            return server_1.NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const { id: appointmentId } = await params;
        const appointment = await getAppointmentData(appointmentId);
        if (!appointment) {
            return server_1.NextResponse.json({ error: "Appointment not found" }, { status: 404 });
        }
        const patientName = appointment.patient?.name || appointment.guestName || "Valued Patient";
        const patientPhone = appointment.patient?.phone || appointment.guestPhone;
        if (!patientPhone) {
            return server_1.NextResponse.json({
                error: "No WhatsApp/phone number recorded for this patient"
            }, { status: 400 });
        }
        let body = {};
        try {
            body = await request.json();
        }
        catch {
            // body is optional
        }
        const precautionsList = body.customPrecautions && body.customPrecautions.length > 0
            ? body.customPrecautions
            : (0, precautions_1.getPrecautionsForTreatment)(appointment.treatment.name, appointment.treatment.instructions);
        const message = (0, precautions_1.formatPrecautionsMessage)({
            patientName,
            treatmentName: appointment.treatment.name,
            precautions: precautionsList,
            doctorName: "Dr. Sheriyaar"
        });
        const whatsappUrl = (0, precautions_1.generateWhatsAppDeepLink)(patientPhone, message);
        // Dispatch directly to n8n webhook in background
        const webhookResult = await (0, precautions_1.dispatchN8nPrecautionsWebhook)({
            phone: patientPhone,
            patientName,
            treatmentName: appointment.treatment.name,
            precautions: precautionsList,
            message,
            appointmentId: appointment.id,
        });
        return server_1.NextResponse.json({
            success: true,
            patientName,
            patientPhone,
            treatmentName: appointment.treatment.name,
            message,
            whatsappUrl,
            n8nDispatched: webhookResult.success,
            n8nError: webhookResult.error || undefined,
        });
    }
    catch (error) {
        console.error("Failed to dispatch precautions:", error);
        return server_1.NextResponse.json({
            error: "Failed to generate or dispatch precautions"
        }, { status: 500 });
    }
}
