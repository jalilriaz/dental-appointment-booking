import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { formatTime, formatDate } from "@/lib/utils";

function isAuthorized(request: Request): boolean {
    const authHeader = request.headers.get("authorization");
    const configuredSecret = (process.env.N8N_SECRET_KEY || "elite-dental-n8n-bot-secret-key-2026")
        .replace(/^["']|["']$/g, "")
        .trim();
    const fallbackSecret = "elite-dental-n8n-bot-secret-key-2026";

    if (authHeader && authHeader.toLowerCase().startsWith("bearer ")) {
        const token = authHeader.substring(7).replace(/^["']|["']$/g, "").trim();
        if (token === configuredSecret || token === fallbackSecret) {
            return true;
        }
    }

    const url = new URL(request.url);
    const querySecret = url.searchParams.get("secret");
    if (querySecret && (querySecret === configuredSecret || querySecret === fallbackSecret)) {
        return true;
    }

    return false;
}

function normalizeWhatsAppPhone(rawPhone: string): string {
    let digits = rawPhone.replace(/\D/g, "");
    if (digits.startsWith("0")) {
        digits = "92" + digits.slice(1);
    } else if (digits.startsWith("93") && digits.length === 11) {
        digits = "923" + digits.slice(2);
    } else if (digits.length === 10 && digits.startsWith("3")) {
        digits = "92" + digits;
    }
    return digits;
}

export async function GET(request: Request) {
    if (!isAuthorized(request)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const now = new Date();
        const startOfToday = new Date(now);
        startOfToday.setHours(0, 0, 0, 0);

        const endOfToday = new Date(now);
        endOfToday.setHours(23, 59, 59, 999);

        // Fetch all scheduled or rescheduled appointments for today
        const appointments = await prisma.appointment.findMany({
            where: {
                status: {
                    in: ["SCHEDULED", "RESCHEDULED"],
                },
                startTime: {
                    gte: startOfToday,
                    lte: endOfToday,
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
                const phone = normalizeWhatsAppPhone(rawPhone);
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
