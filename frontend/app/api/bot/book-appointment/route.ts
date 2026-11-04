import { NextResponse } from "next/server";
import { verifyBotAuth } from "@/lib/auth-bot";
import { createAppointment } from "@/lib/bookingService";

export async function POST(req: Request) {
    try {
        // 1. Timing-Safe Authentication Check
        const auth = verifyBotAuth(req);
        if (!auth.ok) {
            return NextResponse.json({ message: auth.error }, { status: auth.status || 401 });
        }

        // 2. Parse and Validate Request Body
        const body = await req.json();
        const { patientName, phone, age, date, time, serviceType, patientTreatmentId } = body;

        if (!patientName || !phone || !date || !time) {
            return NextResponse.json(
                { message: "Missing required fields: please provide patientName, phone, date, and time" },
                { status: 400 }
            );
        }

        // 3. Resolve treatmentId from serviceType if provided
        let treatmentId: string | undefined = undefined;
        if (serviceType) {
            const prisma = (await import("@/lib/prisma")).default;
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
        const result = await createAppointment({
            patientName,
            phone,
            age,
            date,
            time,
            treatmentId: treatmentId as string,
            bookedBy: "WHATSAPP_BOT",
            patientTreatmentId: patientTreatmentId || undefined,
            notes: `Booked via WhatsApp for ${patientName}. Age: ${age || "N/A"}. Service: ${serviceType || "Standard"}`,
        });

        if (!result.success) {
            return NextResponse.json(
                { message: result.error || "Failed to book appointment." },
                { status: result.status || 400 }
            );
        }

        return NextResponse.json({
            success: true,
            message: result.message || "Appointment booked successfully.",
            patientCode: result.patientCode,
            isMultiSession: result.isMultiSession,
            sessionNumber: result.sessionNumber,
            sessionLabel: result.sessionLabel,
            appointment: result.appointment,
        });
    } catch (error) {
        console.error("Error booking appointment via bot:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}