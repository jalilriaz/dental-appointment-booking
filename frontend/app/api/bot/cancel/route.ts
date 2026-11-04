import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { deleteCalendarEvent } from "@/lib/googleCalendar";
import { verifyBotAuth } from "@/lib/auth-bot";
import { normalizePhone } from "@/lib/phone";
import { getKarachiDayBoundaries } from "@/lib/timezone";

export async function PATCH(req: Request) {
    try {
        // 1. Timing-Safe Authentication Check
        const auth = verifyBotAuth(req);
        if (!auth.ok) {
            return NextResponse.json({ message: auth.error }, { status: auth.status || 401 });
        }

        // 2. Parse and Validate Request Body
        const body = await req.json();
        const { phone, currentDate, appointmentId } = body;

        if (!phone) {
            return NextResponse.json(
                { message: "Missing required fields: please provide phone" },
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

        // Build upcoming appointment query
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
                    message: "The patient has multiple upcoming appointments. Please ask them which one (by date or treatment) they wish to cancel.",
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
        });

        if (!existingAppointment) {
            return NextResponse.json(
                { message: "No upcoming scheduled appointments found for this phone number." },
                { status: 404 }
            );
        }

        if (existingAppointment.status === "CANCELLED") {
            return NextResponse.json({
                success: true,
                message: "Appointment is already cancelled.",
                appointmentId: existingAppointment.id,
            });
        }

        // 4. Cancel Appointment
        const cancelledAppointment = await prisma.appointment.update({
            where: { id: existingAppointment.id },
            data: {
                status: "CANCELLED",
            },
        });

        // 5. Trigger Google Calendar sync
        if (existingAppointment.googleEventId) {
            (async () => {
                try {
                    await deleteCalendarEvent(existingAppointment.googleEventId!);

                    await prisma.appointment.update({
                        where: { id: existingAppointment.id },
                        data: { googleEventId: null },
                    });
                } catch (calError) {
                    console.error("WhatsApp Bot -> Google Calendar delete sync failed:", calError);
                }
            })();
        }

        // 6. Real-Time UI Revalidation
        revalidatePath("/admin");
        revalidatePath("/staff");

        return NextResponse.json({
            success: true,
            message: "Appointment cancelled successfully.",
            appointmentId: cancelledAppointment.id,
        });
    } catch (error) {
        console.error("Error cancelling appointment via bot:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
