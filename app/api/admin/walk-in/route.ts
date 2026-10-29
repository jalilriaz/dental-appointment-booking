import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/auth";
import { createCalendarEvent } from "@/lib/googleCalendar";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { logger } from "@/lib/logger";
import { generatePatientCode } from "@/lib/patientCode";
import { sendAppointmentConfirmationEmail } from "@/lib/email";
import { revalidatePath } from "next/cache";

// Zod validation schema
const walkInSchema = z.object({
    // Patient identification — either existing patientId OR new patient details
    patientId: z.string().optional(),
    phone: z.string().min(10, "Phone number must be at least 10 digits").optional(),
    cnic: z.string().optional().default(""),
    fullName: z.string().optional(),
    age: z.number().int().min(1).max(150).optional(),
    // Appointment details — always required
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
    time: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format (HH:MM)"),
    treatmentId: z.string().min(1, "Treatment is required"),
    notes: z.string().optional(),
}).superRefine((data, ctx) => {
    // Must have either patientId (registered patient) OR new patient details
    if (!data.patientId) {
        if (!data.phone) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Phone is required for new patients", path: ["phone"] });
        if (!data.fullName) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Name is required for new patients", path: ["fullName"] });
        if (!data.age) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Age is required for new patients", path: ["age"] });
    }
});

export async function POST(request: Request) {
    let body;
    try {
        // 1. Auth check
        const cookie = (await cookies()).get("session")?.value;
        if (!cookie) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const session = await decrypt(cookie);
        const role = session.role as string;
        if (role !== "ADMIN" && role !== "STAFF") {
            return NextResponse.json({ error: "Forbidden — Admin or Staff only" }, { status: 403 });
        }

        // 2. Validate
        body = await request.json();
        const validationResult = walkInSchema.safeParse(body);
        if (!validationResult.success) {
            return NextResponse.json({
                error: "Validation failed",
                details: validationResult.error.format(),
            }, { status: 400 });
        }

        const { patientId, phone, cnic, fullName, age, date, time, treatmentId, notes } = validationResult.data;

        // 3. Validate date — no past dates, no Sundays
        const [year, month, day] = date.split("-").map(Number);
        const selectedDate = new Date(year, month - 1, day); // local date, no UTC offset issues
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate < today) {
            return NextResponse.json({ error: "Cannot book an appointment on a past date" }, { status: 400 });
        }
        if (selectedDate.getDay() === 0) {
            return NextResponse.json({ error: "Sunday is a clinic off day. Please select another date." }, { status: 400 });
        }

        // 4. Get treatment info
        const treatment = await prisma.treatment.findUnique({ where: { id: treatmentId } });
        if (!treatment) return NextResponse.json({ error: "Treatment not found" }, { status: 404 });

        // 5. Calculate times (use local date to avoid UTC offset issues)
        const [timeH, timeM] = time.split(":").map(Number);
        const startTime = new Date(year, month - 1, day, timeH, timeM, 0, 0);
        const endTime = new Date(startTime);
        endTime.setMinutes(endTime.getMinutes() + treatment.durationMin);

        // 6. Atomic transaction
        const result = await prisma.$transaction(async (tx) => {
            let userId: string;
            let patientCode: number | null = null;
            let patientName: string;

            if (patientId) {
                // ── Registered patient path ──
                const existingUser = await tx.user.findUnique({ where: { id: patientId }, select: { id: true, name: true, patientCode: true } });
                if (!existingUser) throw new Error("PATIENT_NOT_FOUND");
                userId = existingUser.id;
                patientName = existingUser.name;
                patientCode = existingUser.patientCode;

                // Assign code if missing
                if (!patientCode) {
                    patientCode = await generatePatientCode();
                    await tx.user.update({ where: { id: userId }, data: { patientCode } });
                }
            } else {
                // ── New patient path: Main User record ──
                let user = await tx.user.findFirst({ where: { phone: phone! } });
                if (!user) {
                    patientCode = await generatePatientCode();
                    const hashedPassword = await bcrypt.hash("Patient123!", 10);
                    user = await tx.user.create({
                        data: { name: fullName!, phone: phone!, password: hashedPassword, role: "PATIENT", patientCode },
                    });
                } else if (!user.patientCode) {
                    patientCode = await generatePatientCode();
                    await tx.user.update({ where: { id: user.id }, data: { patientCode } });
                } else {
                    patientCode = user.patientCode;
                }
                userId = user.id;
                patientName = user.name;
            }

            // Double-booking check — exact overlap on same day only
            const dayStart = new Date(year, month - 1, day, 0, 0, 0, 0);
            const dayEnd = new Date(year, month - 1, day, 23, 59, 59, 999);

            const conflict = await tx.appointment.findFirst({
                where: {
                    status: { notIn: ["CANCELLED"] },
                    startTime: { gte: dayStart, lte: dayEnd },
                    AND: [
                        { startTime: { lt: endTime } },
                        { endTime: { gt: startTime } },
                    ],
                },
            });
            if (conflict) throw new Error("DOUBLE_BOOKING");

            // Create appointment
            const appointment = await tx.appointment.create({
                data: {
                    startTime, endTime, patientId: userId, treatmentId,
                    status: "SCHEDULED", bookedBy: "WALK_IN",
                    price: treatment.price, notes: notes || null,
                },
                include: {
                    treatment: { select: { name: true, durationMin: true } },
                    patient: { select: { name: true, phone: true, email: true } },
                },
            });

            return { appointment, patientCode, patientName };
        });

        // 7. Google Calendar (non-blocking in background)
        (async () => {
            try {
                const appt = result.appointment;
                const googleEventId = await createCalendarEvent({
                    summary: `${appt.treatment.name} — ${appt.patient.name}`,
                    description: `Treatment: ${appt.treatment.name}\nDuration: ${appt.treatment.durationMin} min\nBooked: Walk-In`,
                    startTime: appt.startTime, endTime: appt.endTime,
                    patientName: appt.patient.name || "Patient",
                    patientPhone: appt.patient.phone || undefined,
                });
                if (googleEventId) {
                    await prisma.appointment.update({ where: { id: appt.id }, data: { googleEventId } });
                }
            } catch (calError) {
                logger.warn({ err: calError, appointmentId: result.appointment.id }, "Google Calendar sync failed for walk-in");
            }
        })();

        // Send Email notification
        const emailToNotify = result.appointment.patient.email;
        if (emailToNotify) {
            const formattedDate = new Date(result.appointment.startTime).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
            const formattedTime = new Date(result.appointment.startTime).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });

            sendAppointmentConfirmationEmail(
                emailToNotify,
                result.appointment.patient.name,
                result.appointment.treatment.name,
                formattedDate,
                formattedTime
            ).catch((err) => logger.warn({ err }, "Failed to send confirmation email"));
        }

        // Revalidate cached pages
        revalidatePath("/admin", "layout");
        revalidatePath("/staff", "layout");

        // 8. Return
        return NextResponse.json({
            success: true,
            patientCode: result.patientCode,
            patientName: result.patientName,
            appointment: {
                id: result.appointment.id,
                date: result.appointment.startTime,
                time,
                serviceType: result.appointment.treatment.name,
                status: result.appointment.status,
            },
            message: `Appointment booked for ${result.patientName} (Patient ID: ${result.patientCode})`,
        }, { status: 201 });

    } catch (error) {
        if (error instanceof Error && error.message === "DOUBLE_BOOKING") {
            return NextResponse.json({ error: "This time slot is no longer available. Please select another time.", code: "DOUBLE_BOOKING" }, { status: 409 });
        }
        if (error instanceof Error && error.message === "PATIENT_NOT_FOUND") {
            return NextResponse.json({ error: "Patient not found" }, { status: 404 });
        }
        logger.error({ err: error, body }, "Walk-in registration error");
        return NextResponse.json({ error: "Failed to process walk-in registration" }, { status: 500 });
    }
}
