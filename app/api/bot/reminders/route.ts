import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
    try {
        // 1. Secure Authentication Check (Same as book-appointment)
        const authHeader = req.headers.get("authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const token = authHeader.split(" ")[1];
        if (token !== process.env.N8N_SECRET_KEY) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        // 2. Find appointments starting in exactly ~1 hour
        const now = new Date();

        // Target time: 1 hour from now
        const targetTimeStart = new Date(now.getTime() + 55 * 60000); // 55 mins from now
        const targetTimeEnd = new Date(now.getTime() + 65 * 60000);   // 65 mins from now

        const upcomingAppointments = await prisma.appointment.findMany({
            where: {
                status: "SCHEDULED",
                startTime: {
                    gte: targetTimeStart,
                    lte: targetTimeEnd,
                },
            },
            include: {
                patient: {
                    select: {
                        name: true,
                        phone: true,
                    }
                },
                treatment: {
                    select: {
                        name: true,
                    }
                }
            }
        });

        // Format the response for n8n
        const reminders = upcomingAppointments.map(appt => {
            // Remove the 'Z' and just format nicely for the local timezone
            const timeString = new Date(appt.startTime).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
                timeZone: 'Asia/Karachi' // Assuming PKT based on previous context
            });

            return {
                appointmentId: appt.id,
                patientName: appt.patient.name,
                phone: appt.patient.phone,
                treatmentName: appt.treatment.name,
                time: timeString,
                rawDate: appt.startTime
            };
        });

        return NextResponse.json({
            success: true,
            count: reminders.length,
            reminders,
        });

    } catch (error) {
        console.error("Error fetching reminders:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
