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

        const normalizedTime = normalizeTime(time);
        const startTimeStamp = new Date(`${date}T${normalizedTime}:00`);

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
