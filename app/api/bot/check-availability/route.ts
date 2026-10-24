import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const authHeader = req.headers.get("authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const token = authHeader.split(" ")[1];
        if (token !== process.env.N8N_SECRET_KEY) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { date, time } = await req.json();

        if (!date || !time) {
            return NextResponse.json({ message: "Missing date or time" }, { status: 400 });
        }

        // Parse the date and time strings (e.g., date: "YYYY-MM-DD", time: "HH:MM")
        // Note: Assuming the timezone of the server matches the clinic's local timezone.
        const startTimeStamp = new Date(`${date}T${time}:00`);

        // Check if the appointment is on Sunday (0 = Sunday in JavaScript Date)
        if (startTimeStamp.getDay() === 0) {
            return NextResponse.json({
                isAvailable: false,
                message: "The clinic is closed on Sundays. Please select a different day (Monday-Saturday).",
            });
        }


        // Assume default 30 min duration since we don't know the exact service yet
        const endTimeStamp = new Date(startTimeStamp);
        endTimeStamp.setMinutes(endTimeStamp.getMinutes() + 30);

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
            return NextResponse.json({
                isAvailable: false,
                message: "An appointment already exists at this time.",
            });
        }

        return NextResponse.json({
            isAvailable: true,
            message: "Time slot is available.",
        });
    } catch (error) {
        console.error("Error checking availability:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
