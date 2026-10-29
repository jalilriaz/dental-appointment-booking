import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { updateCalendarEvent } from "@/lib/googleCalendar";

export async function PATCH(req: Request) {
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
        const { phone, currentDate, newDate, newTime, appointmentId } = body;

        // phone, newDate, and newTime are absolutely required.
        if (!phone || !newDate || !newTime) {
            return NextResponse.json(
                { message: "Missing required fields: please provide phone, newDate, and newTime" },
                { status: 400 }
            );
        }

        // 3. Find Existing Appointment by Phone Number
        // We look for the soonest upcoming scheduled appointment for this patient.

        const patient = await prisma.user.findUnique({
            where: { phone },
        });

        if (!patient) {
            return NextResponse.json(
                { message: "Patient not found with this phone number." },
                { status: 404 }
            );
        }

        // Build the query to find their upcoming appointment.
        // If they provided the 'currentDate', we can use it to be specific.
        let appointmentQuery: any = {
            patientId: patient.id,
            status: "SCHEDULED",
            startTime: {
                gt: new Date() // Only look for future appointments to reschedule
            }
        };

        if (appointmentId) {
            appointmentQuery.id = appointmentId;
        } else if (currentDate) {
            // If they specified which one they want to change, match it
            const startOfDay = new Date(`${currentDate}T00:00:00`);
            const endOfDay = new Date(`${currentDate}T23:59:59`);
            appointmentQuery.startTime = {
                gte: startOfDay,
                lte: endOfDay
            };
        } else {
            // Check if patient has multiple upcoming appointments
            const upcomingAppointments = await prisma.appointment.findMany({
                where: appointmentQuery,
                orderBy: { startTime: 'asc' },
                include: { treatment: { select: { name: true } } },
            });

            if (upcomingAppointments.length > 1) {
                return NextResponse.json({
                    multipleAppointments: true,
                    message: "The patient has multiple upcoming appointments. Please ask them which one (by date or treatment) they wish to reschedule.",
                    appointments: upcomingAppointments.map(a => ({
                        appointmentId: a.id,
                        patientName: a.guestName || "Patient",
                        date: a.startTime.toISOString().split("T")[0],
                        time: a.startTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
                        treatment: a.treatment.name
                    }))
                });
            }
        }

        const existingAppointment = await prisma.appointment.findFirst({
            where: appointmentQuery,
            orderBy: {
                startTime: 'asc' // Get the soonest one
            },
            include: {
                treatment: true,
                patient: true,
            },
        });

        if (!existingAppointment) {
            return NextResponse.json(
                { message: "No upcoming scheduled appointments found for this phone number." },
                { status: 404 }
            );
        }

        if (existingAppointment.status === "CANCELLED" || existingAppointment.status === "COMPLETED") {
            return NextResponse.json(
                { message: `Appointment cannot be rescheduled because its status is ${existingAppointment.status}.` },
                { status: 400 }
            );
        }

        // Helper to normalize "04:00 PM", "4pm", "16:00" to "HH:mm"
        const normalizeTime = (rawTime: string) => {
            const trimmed = rawTime.trim();
            const ampmMatch = trimmed.match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)$/i);
            if (ampmMatch) {
                let hour = parseInt(ampmMatch[1], 10);
                const minute = ampmMatch[2] || "00";
                const modifier = ampmMatch[3].toLowerCase();
                if (modifier === "pm" && hour < 12) hour += 12;
                if (modifier === "am" && hour === 12) hour = 0;
                return `${String(hour).padStart(2, "0")}:${minute}`;
            }
            return trimmed;
        };

        const normalizedNewTime = normalizeTime(newTime);

        // 4. Calculate New Appointment Times
        const startTimeStamp = new Date(`${newDate}T${normalizedNewTime}:00`);
        const endTimeStamp = new Date(startTimeStamp.getTime() + existingAppointment.treatment.durationMin * 60000);

        // Check if the appointment is on Sunday (0 = Sunday in JavaScript Date)
        if (startTimeStamp.getDay() === 0) {
            return NextResponse.json(
                { message: "The clinic is closed on Sundays. Please select a different day (Monday-Saturday)." },
                { status: 400 }
            );
        }

        // 5. Check for exact time overlap
        const overlappingAppointment = await prisma.appointment.findFirst({
            where: {
                id: { not: existingAppointment.id }, // Exclude current appointment
                status: {
                    notIn: ["CANCELLED", "NO_SHOW"],
                },
                AND: [
                    { startTime: { lt: endTimeStamp } },
                    { endTime: { gt: startTimeStamp } },
                ],
            },
        });

        if (overlappingAppointment) {
            return NextResponse.json(
                { message: "An appointment already exists at this time. Please select another time slot." },
                { status: 409 } // 409 Conflict
            );
        }

        // 6. Update the Appointment status to RESCHEDULED
        const updatedAppointment = await prisma.appointment.update({
            where: { id: existingAppointment.id },
            data: {
                startTime: startTimeStamp,
                endTime: endTimeStamp,
                status: "RESCHEDULED",
            },
        });

        // If the appointment was previously marked NO_SHOW, decrement noShowCount on recovery
        if (existingAppointment.status === "NO_SHOW") {
            try {
                await prisma.user.update({
                    where: { id: existingAppointment.patientId },
                    data: { noShowCount: { decrement: 1 } } as any,
                });
            } catch (userErr) {
                console.error("Failed to decrement noShowCount on reschedule:", userErr);
            }
        }

        // 7. Trigger Google Calendar sync (background)
        if (existingAppointment.googleEventId) {
            (async () => {
                try {
                    await updateCalendarEvent({
                        eventId: existingAppointment.googleEventId!,
                        summary: `${existingAppointment.treatment.name} — ${existingAppointment.patient.name}`,
                        description: `Treatment: ${existingAppointment.treatment.name}\nDuration: ${existingAppointment.treatment.durationMin} min`,
                        startTime: startTimeStamp,
                        endTime: endTimeStamp,
                        patientName: existingAppointment.patient.name || "Patient",
                        patientPhone: existingAppointment.patient.phone || undefined,
                    });
                } catch (calError) {
                    console.error("WhatsApp Bot -> Google Calendar update sync failed:", calError);
                }
            })();
        }

        // 8. Real-Time UI Revalidation for the Admin Dashboard
        revalidatePath("/admin");

        return NextResponse.json({
            success: true,
            message: "Appointment rescheduled successfully.",
            appointment: updatedAppointment,
        });
    } catch (error) {
        console.error("Error rescheduling appointment via bot:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
