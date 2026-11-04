import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/auth";
import {
    getPrecautionsForTreatment,
    formatPrecautionsMessage,
    generateWhatsAppDeepLink,
    dispatchN8nPrecautionsWebhook
} from "@/lib/precautions";

async function verifyAuth() {
    const cookie = (await cookies()).get("session")?.value;
    if (!cookie) return null;
    try {
        const session = await decrypt(cookie);
        if (session.role === "ADMIN" || session.role === "STAFF") {
            return session;
        }
        return null;
    } catch {
        return null;
    }
}

async function getAppointmentData(appointmentId: string) {
    return prisma.appointment.findUnique({
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
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await verifyAuth();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id: appointmentId } = await params;
        const appointment = await getAppointmentData(appointmentId);

        if (!appointment) {
            return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
        }

        const patientName = appointment.patient?.name || appointment.guestName || "Valued Patient";
        const patientPhone = appointment.patient?.phone || appointment.guestPhone;

        if (!patientPhone) {
            return NextResponse.json({
                error: "No WhatsApp/phone number recorded for this patient"
            }, { status: 400 });
        }

        const precautionsList = getPrecautionsForTreatment(
            appointment.treatment.name,
            appointment.treatment.instructions
        );

        const message = formatPrecautionsMessage({
            patientName,
            treatmentName: appointment.treatment.name,
            precautions: precautionsList,
            doctorName: "Dr. Sheriyaar"
        });

        const whatsappUrl = generateWhatsAppDeepLink(patientPhone, message);

        return NextResponse.json({
            success: true,
            patientName,
            patientPhone,
            treatmentName: appointment.treatment.name,
            precautions: precautionsList,
            message,
            whatsappUrl,
            n8nConfigured: Boolean(process.env.N8N_WEBHOOK_URL),
        });
    } catch (error) {
        console.error("Failed to load precautions preview:", error);
        return NextResponse.json({ error: "Failed to load precautions preview" }, { status: 500 });
    }
}

// ─── POST: Dispatch Precautions directly to n8n Webhook ───────────────────────
export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await verifyAuth();
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id: appointmentId } = await params;
        const appointment = await getAppointmentData(appointmentId);

        if (!appointment) {
            return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
        }

        const patientName = appointment.patient?.name || appointment.guestName || "Valued Patient";
        const patientPhone = appointment.patient?.phone || appointment.guestPhone;

        if (!patientPhone) {
            return NextResponse.json({
                error: "No WhatsApp/phone number recorded for this patient"
            }, { status: 400 });
        }

        let body: { customPrecautions?: string[] } = {};
        try {
            body = await request.json();
        } catch {
            // body is optional
        }

        const precautionsList = body.customPrecautions && body.customPrecautions.length > 0
            ? body.customPrecautions
            : getPrecautionsForTreatment(appointment.treatment.name, appointment.treatment.instructions);

        const message = formatPrecautionsMessage({
            patientName,
            treatmentName: appointment.treatment.name,
            precautions: precautionsList,
            doctorName: "Dr. Sheriyaar"
        });

        const whatsappUrl = generateWhatsAppDeepLink(patientPhone, message);

        // Dispatch directly to n8n webhook in background
        const webhookResult = await dispatchN8nPrecautionsWebhook({
            phone: patientPhone,
            patientName,
            treatmentName: appointment.treatment.name,
            precautions: precautionsList,
            message,
            appointmentId: appointment.id,
        });

        return NextResponse.json({
            success: true,
            patientName,
            patientPhone,
            treatmentName: appointment.treatment.name,
            message,
            whatsappUrl,
            n8nDispatched: webhookResult.success,
            n8nError: webhookResult.error || undefined,
        });
    } catch (error) {
        console.error("Failed to dispatch precautions:", error);
        return NextResponse.json({
            error: "Failed to generate or dispatch precautions"
        }, { status: 500 });
    }
}
