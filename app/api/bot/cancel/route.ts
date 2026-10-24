import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { deleteCalendarEvent } from "@/lib/googleCalendar";

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
        const { phone, currentDate } = body;

        if (!phone) {
            return NextResponse.json(
                { message: "Missing required fields: please provide phone" },
                { status: 400 }
            );
        }

        // 3. Find Existing Appointment by Phone Number
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
        let appointmentQuery: any = {
            patientId: patient.id,
            status: "SCHEDULED",
            startTime: {
                gt: new Date() // Only look for future appointments
            }
        };

        if (currentDate) {
            const startOfDay = new Date(`${currentDate}T00:00:00`);
            const endOfDay = new Date(`${currentDate}T23:59:59`);
            appointmentQuery.startTime = {
                gte: startOfDay,
                lte: endOfDay
            };
        }

        const existingAppointment = await prisma.appointment.findFirst({
            where: appointmentQuery,
            orderBy: {
                startTime: 'asc'
            }
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

        // 4. Cancel the Appointment
        const cancelledAppointment = await prisma.appointment.update({
            where: { id: existingAppointment.id },
            data: {
                status: "CANCELLED",
            },
        });

        // 5. Trigger Google Calendar sync (background)
        if (existingAppointment.googleEventId) {
            (async () => {
                try {
                    await deleteCalendarEvent(existingAppointment.googleEventId!);

                    // Remove the Google Event ID from our database since the event no longer exists on Google Calendar
                    await prisma.appointment.update({
                        where: { id: existingAppointment.id },
                        data: { googleEventId: null },
                    });
                } catch (calError) {
                    console.error("WhatsApp Bot -> Google Calendar delete sync failed:", calError);
                }
            })();
        }

        // 6. Real-Time UI Revalidation for the Admin Dashboard
        revalidatePath("/admin");

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
