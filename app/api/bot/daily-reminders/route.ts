import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { formatTime, formatDate } from "@/lib/utils";
import { verifyBotAuth } from "@/lib/auth-bot";
import { normalizePhone } from "@/lib/phone";
import { getKarachiTodayStr, getKarachiDayBoundaries } from "@/lib/timezone";

export async function GET(request: Request) {
    const auth = verifyBotAuth(request);
    if (!auth.ok) {
        return NextResponse.json({ error: auth.error }, { status: auth.status || 401 });
    }

    try {
        const todayStr = getKarachiTodayStr();
        const { startOfDay, endOfDay } = getKarachiDayBoundaries(todayStr);

        // Fetch all scheduled or rescheduled appointments for today in Karachi timezone
        const appointments = await prisma.appointment.findMany({
            where: {
                status: {
                    in: ["SCHEDULED", "RESCHEDULED"],
                },
                startTime: {
                    gte: startOfDay,
                    lte: endOfDay,
                },
            },
            include: {
                patient: {
                    select: {
                        name: true,
                        phone: true,
                    },
                },
                treatment: {
                    select: {
                        name: true,
                        durationMin: true,
                    },
                },
            },
            orderBy: {
                startTime: "asc",
            },
        });

        const reminders = appointments
            .filter((apt) => {
                const phone = apt.guestPhone || apt.patient?.phone;
                return Boolean(phone);
            })
            .map((apt) => {
                const patientName = apt.guestName || apt.patient?.name || "Patient";
                const rawPhone = apt.guestPhone || apt.patient?.phone || "";
                const phone = normalizePhone(rawPhone);
                const timeString = formatTime(apt.startTime);
                const dateString = formatDate(apt.startTime, "medium");
                const treatmentName = apt.treatment?.name || "Dental Visit";

                const message =
                    `🦷 *Elite Dental Centre — Appointment Reminder*\n\n` +
                    `Dear *${patientName}*,\n\n` +
                    `This is a friendly reminder for your scheduled dental visit today with *Dr. Sheriyaar*:\n\n` +
                    `📅 *Date:* Today (${dateString})\n` +
                    `⏰ *Time:* ${timeString}\n` +
                    `🦷 *Treatment:* ${treatmentName}\n` +
                    `📍 *Location:* F-10 Markaz, Islamabad\n\n` +
                    `To help us prepare for your visit, please reply to this message:\n` +
                    `• Reply *CONFIRM* if you are attending\n` +
                    `• Reply *RESCHEDULE* if you need a different time\n` +
                    `• Reply *CANCEL* if you cannot make it today\n\n` +
                    `We look forward to seeing you! ✨`;

                return {
                    appointmentId: apt.id,
                    patientName,
                    phone,
                    time: timeString,
                    treatmentName,
                    message,
                };
            });

        return NextResponse.json(reminders);
    } catch (error) {
        console.error("Error generating daily reminders:", error);
        return NextResponse.json(
            { error: "Failed to generate daily reminders" },
            { status: 500 }
        );
    }
}
