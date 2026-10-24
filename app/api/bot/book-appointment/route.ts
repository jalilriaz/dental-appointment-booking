

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createCalendarEvent } from "@/lib/googleCalendar";
import { generatePatientCode } from "@/lib/patientCode";

export async function POST(req: Request) {
    try {
        // 1. Secure Authentication Check
        const authHeader = req.headers.get("authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const token = authHeader.split(" ")[1];
        if (token !== process.env.N8N_SECRET_KEY) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        // 2. Parse and Validate Request Body
        const body = await req.json();
        const { patientName, phone, age, date, time, serviceType } = body;

        if (!patientName || !phone || !date || !time) {
            return NextResponse.json(
                { message: "Missing required fields: please provide patientName, phone, date, and time" },
                { status: 400 }
            );
        }

        // 3. Find or Create the Patient
        let patient = await prisma.user.upsert({
            where: { phone },
            update: {
                name: patientName,
            },
            create: {
                name: patientName,
                phone,
                role: "PATIENT",
            },
        });

        // 3b. Assign a patient code if they don't have one yet
        if (!(patient as any).patientCode) {
            const code = await generatePatientCode();
            patient = await prisma.user.update({
                where: { id: patient.id },
                data: { patientCode: code } as any,
            });
        }

        // 4. Handle Treatment Logic
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

        // Fallback to the first available treatment if no specific match is found
        if (!treatment) {
            treatment = await prisma.treatment.findFirst();
        }

        if (!treatment) {
            return NextResponse.json(
                { message: "No valid treatments found in the system to assign." },
                { status: 400 }
            );
        }

        // 5. Calculate Appointment Times (Z removed for correct local time)
        const startTimeStamp = new Date(`${date}T${time}:00`);
        const endTimeStamp = new Date(startTimeStamp.getTime() + treatment.durationMin * 60000);

        // Check if the appointment is on Sunday (0 = Sunday in JavaScript Date)
        if (startTimeStamp.getDay() === 0) {
            return NextResponse.json(
                { message: "The clinic is closed on Sundays. Please select a different day (Monday-Saturday)." },
                { status: 400 }
            );
        }


        // 6. Check for Double Booking (Availability Check with Buffer)
        // Check for exact time overlap
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
                { status: 409 } // 409 Conflict
            );
        }


        // 7. Create the Appointment
        const appointment = await prisma.appointment.create({
            data: {
                startTime: startTimeStamp,
                endTime: endTimeStamp,
                patientId: patient.id,
                treatmentId: treatment.id,
                bookedBy: "WHATSAPP_BOT",
                status: "SCHEDULED",
                notes: `Booked via WhatsApp. Age provided: ${age || "N/A"}. Service requested: ${serviceType || "N/A"}`,
            },
        });

        // 8. Trigger Google Calendar sync (background task)
        (async () => {
            try {
                const googleEventId = await createCalendarEvent({
                    summary: `${treatment!.name} — ${patient.name}`,
                    description: `Treatment: ${treatment!.name}\nDuration: ${treatment!.durationMin} min${age ? `\nAge: ${age}` : ""}`,
                    startTime: startTimeStamp,
                    endTime: endTimeStamp,
                    patientName: patient.name || "Patient",
                    patientPhone: phone,
                });

                if (googleEventId) {
                    // Update the appointment with the Google Calendar event ID
                    await prisma.appointment.update({
                        where: { id: appointment.id },
                        data: { googleEventId },
                    });
                }
            } catch (calError) {
                console.error("WhatsApp Bot -> Google Calendar sync failed:", calError);
            }
        })();

        // 9. Real-Time UI Revalidation for the Admin Dashboard
        revalidatePath("/admin");

        return NextResponse.json({
            success: true,
            message: "Appointment booked successfully.",
            patientCode: (patient as any).patientCode,
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