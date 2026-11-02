import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { updateCalendarEvent } from "@/lib/googleCalendar";
import { verifyBotAuth } from "@/lib/auth-bot";
import { normalizePhone } from "@/lib/phone";
import { isSundayInKarachi, parseKarachiDateTime, getKarachiDayBoundaries } from "@/lib/timezone";

export async function PATCH(req: Request) {
    try {
        // 1. Timing-Safe Authentication Check
        const auth = verifyBotAuth(req);
        if (!auth.ok) {
            return NextResponse.json({ message: auth.error }, { status: auth.status || 401 });
        }

        // 2. Parse and Validate Request Body
        const body = await req.json();
        const { phone, currentDate, newDate, newTime, appointmentId } = body;

        if (!phone || !newDate || !newTime) {
            return NextResponse.json(
                { message: "Missing required fields: please provide phone, newDate, and newTime" },
                { status: 400 }
            );
        }

        const canonicalPhone = normalizePhone(phone);

        // 3. Find Patient by Canonical Phone
        const patient = await prisma.user.findFirst({
            where: { phone: canonicalPhone },
        });

        if (!patient) {
            return NextResponse.json(
                { message: "Patient not found with this phone number." },
                { status: 404 }
            );
        }

        // Build query for upcoming appointment
        let appointmentQuery: any = {
            patientId: patient.id,
            status: { in: ["SCHEDULED", "RESCHEDULED"] },
            startTime: {
                gt: new Date(),
            },
        };

        if (appointmentId) {
            appointmentQuery.id = appointmentId;
        } else if (currentDate) {
            const { startOfDay, endOfDay } = getKarachiDayBoundaries(currentDate);
            appointmentQuery.startTime = {
                gte: startOfDay,
                lte: endOfDay,
            };
        } else {
            // Check if patient has multiple upcoming appointments
            const upcomingAppointments = await prisma.appointment.findMany({
                where: appointmentQuery,
                orderBy: { startTime: "asc" },
                include: { treatment: { select: { name: true } } },
            });

            if (upcomingAppointments.length > 1) {
                return NextResponse.json({
                    multipleAppointments: true,
                    message: "The patient has multiple upcoming appointments. Please ask them which one (by date or treatment) they wish to reschedule.",
                    appointments: upcomingAppointments.map((a) => ({
                        appointmentId: a.id,
                        patientName: a.guestName || patient.name || "Patient",
                        date: a.startTime.toISOString().split("T")[0],
                        time: a.startTime.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true }),
                        treatment: a.treatment.name,
                    })),
                });
            }
        }

        const existingAppointment = await prisma.appointment.findFirst({
            where: appointmentQuery,
            orderBy: {
                startTime: "asc",
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

        // 4. Timezone & Sunday Validation
        if (isSundayInKarachi(newDate)) {
            return NextResponse.json(
                { message: "The clinic is closed on Sundays. Please select a different day (Monday-Saturday)." },
                { status: 400 }
            );
        }

        const startTimeStamp = parseKarachiDateTime(newDate, newTime);
        const endTimeStamp = new Date(startTimeStamp.getTime() + existingAppointment.treatment.durationMin * 60000);

        // 5. Conflict Check
        const overlappingAppointment = await prisma.appointment.findFirst({
            where: {
                id: { not: existingAppointment.id },
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
                { status: 409 }
            );
        }

        // 6. Update Appointment
        const updatedAppointment = await prisma.appointment.update({
            where: { id: existingAppointment.id },
            data: {
                startTime: startTimeStamp,
                endTime: endTimeStamp,
                status: "RESCHEDULED",
            },
        });

        if (existingAppointment.status === "NO_SHOW") {
            try {
                await prisma.user.update({
                    where: { id: existingAppointment.patientId },
                    data: { noShowCount: { decrement: 1 } },
                });
            } catch (userErr) {
                console.error("Failed to decrement noShowCount on reschedule:", userErr);
            }
        }

        // 7. Google Calendar update
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

        // 8. Revalidate
        revalidatePath("/admin");
        revalidatePath("/staff");

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
