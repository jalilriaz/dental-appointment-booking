import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyBotAuth } from "@/lib/auth-bot";
import { isSundayInKarachi, parseKarachiDateTime } from "@/lib/timezone";

export async function POST(req: Request) {
    try {
        const auth = verifyBotAuth(req);
        if (!auth.ok) {
            return NextResponse.json({ message: auth.error }, { status: auth.status || 401 });
        }

        const { date, time } = await req.json();

        if (!date || !time) {
            return NextResponse.json({ message: "Missing date or time" }, { status: 400 });
        }

        // Sunday check in Asia/Karachi
        if (isSundayInKarachi(date)) {
            return NextResponse.json({
                isAvailable: false,
                message: "The clinic is closed on Sundays. Please select a different day (Monday-Saturday).",
            });
        }

        const startTimeStamp = parseKarachiDateTime(date, time);

        // Assume default 30 min duration since service may not be selected yet
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
