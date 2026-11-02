import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createCalendarEvent } from "@/lib/googleCalendar";
import { generatePatientCode } from "@/lib/patientCode";
import { verifyBotAuth } from "@/lib/auth-bot";
import { normalizePhone } from "@/lib/phone";
import { isSundayInKarachi, parseKarachiDateTime } from "@/lib/timezone";
import { generateRandomPatientPasswordHash } from "@/lib/security";

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

        const canonicalPhone = normalizePhone(phone);

        // 3. Find or Create Patient (Never overwrite existing patient's name on incoming chat)
        let patient = await prisma.user.findFirst({
            where: { phone: canonicalPhone },
        });

        if (!patient) {
            const initialPasswordHash = await generateRandomPatientPasswordHash();
            const code = await generatePatientCode();
            patient = await prisma.user.create({
                data: {
                    name: patientName,
                    phone: canonicalPhone,
                    role: "PATIENT",
                    password: initialPasswordHash,
                    patientCode: code,
                },
            });
        } else if (!patient.patientCode) {
            const code = await generatePatientCode();
            patient = await prisma.user.update({
                where: { id: patient.id },
                data: { patientCode: code },
            });
        }

        // 4. Treatment Selection
        let treatment = null;
        if (serviceType) {
            treatment = await prisma.treatment.findFirst({
                where: {
                    name: {
                        contains: serviceType,
                        mode: "insensitive",
                    },
                },
            });
        }

        if (!treatment) {
            treatment = await prisma.treatment.findFirst();
        }

        if (!treatment) {
            return NextResponse.json(
                { message: "No valid treatments found in the system to assign." },
                { status: 400 }
            );
        }

        // 5. Calculate Appointment Times in Asia/Karachi Timezone
        if (isSundayInKarachi(date)) {
            return NextResponse.json(
                { message: "The clinic is closed on Sundays. Please select a different day (Monday-Saturday)." },
                { status: 400 }
            );
        }

        const startTimeStamp = parseKarachiDateTime(date, time);
        const endTimeStamp = new Date(startTimeStamp.getTime() + treatment.durationMin * 60000);

        // 6. Double Booking Check
        const existingAppointment = await prisma.appointment.findFirst({
            where: {
                status: {
                    notIn: ["CANCELLED", "NO_SHOW"],
                },
                AND: [
                    { startTime: { lt: endTimeStamp } },
                    { endTime: { gt: startTimeStamp } },
                ],
            },
        });

        if (existingAppointment) {
            return NextResponse.json(
                { message: "An appointment already exists at this time. Please select another time slot." },
                { status: 409 }
            );
        }

        // 7. Create Appointment
        const appointment = await prisma.appointment.create({
            data: {
                startTime: startTimeStamp,
                endTime: endTimeStamp,
                patientId: patient.id,
                treatmentId: treatment.id,
                bookedBy: "WHATSAPP_BOT",
                status: "SCHEDULED",
                price: treatment.price,
                guestName: patientName,
                guestPhone: canonicalPhone,
                patientTreatmentId: patientTreatmentId || null,
                notes: `Booked via WhatsApp for ${patientName}. Age: ${age || "N/A"}. Service: ${serviceType || treatment.name}`,
            },
            include: {
                treatment: true,
                patient: true,
            },
        });

        // 8. Trigger Google Calendar sync (background task)
        (async () => {
            try {
                const googleEventId = await createCalendarEvent({
                    summary: `${treatment!.name} — ${patientName}`,
                    description: `Patient: ${patientName}\nTreatment: ${treatment!.name}\nDuration: ${treatment!.durationMin} min${age ? `\nAge: ${age}` : ""}`,
                    startTime: startTimeStamp,
                    endTime: endTimeStamp,
                    patientName: patientName,
                    patientPhone: canonicalPhone,
                });

                if (googleEventId) {
                    await prisma.appointment.update({
                        where: { id: appointment.id },
                        data: { googleEventId },
                    });
                }
            } catch (calError) {
                console.error("WhatsApp Bot -> Google Calendar sync failed:", calError);
            }
        })();

        // 9. Revalidate Dashboard
        revalidatePath("/admin");
        revalidatePath("/staff");

        return NextResponse.json({
            success: true,
            message: "Appointment booked successfully.",
            patientCode: patient.patientCode,
            appointment,
        });
    } catch (error) {
        console.error("Error booking appointment via bot:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}