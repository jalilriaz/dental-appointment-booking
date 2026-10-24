import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { createCalendarEvent } from "@/lib/googleCalendar";
import { z } from "zod";
import { logger } from "@/lib/logger";
import { sendAppointmentConfirmationEmail } from "@/lib/email";
import { revalidatePath } from "next/cache";

// Zod Schema for Booking Payload Validation
const bookingSchema = z.object({
    treatmentId: z.string().min(1, "Treatment ID is required"),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
    time: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format (HH:MM)"),
    notes: z.string().optional(),
    patientId: z.string().optional(),
    newPatient: z.object({
        name: z.string().min(1, "Name is required"),
        email: z.string().email().optional().or(z.literal("")),
        phone: z.string().min(10, "Phone number is required"),
        dateOfBirth: z.string().optional(), // New DOB field
    }).optional(),
    guestName: z.string().optional(),
    guestPhone: z.string().optional(),
    guestEmail: z.string().email().optional().or(z.literal("")),
    guestDob: z.string().optional(), // New Guest DOB field
}).superRefine((data, ctx) => {
    // If guest details are partially provided
    if (data.guestName || data.guestPhone || data.guestEmail || data.guestDob) {
        if (!data.guestName) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Guest name is required", path: ["guestName"] });
        }
        if (!data.guestPhone) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Guest phone is required", path: ["guestPhone"] });
        }
    }
});

// GET: Fetch appointments (filtered by role)
export async function GET(request: Request) {
    try {
        const cookie = (await cookies()).get("session")?.value;
        if (!cookie) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const session = await decrypt(cookie);
        const role = session.role as string;

        if (role !== "ADMIN" && role !== "STAFF") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const { searchParams } = new URL(request.url);
        const status = searchParams.get("status");
        const dateFrom = searchParams.get("dateFrom");
        const dateTo = searchParams.get("dateTo");

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const where: any = {};

        if (status) where.status = status;
        if (dateFrom || dateTo) {
            where.startTime = {};
            if (dateFrom) where.startTime.gte = new Date(dateFrom);
            if (dateTo) where.startTime.lte = new Date(dateTo + "T23:59:59");
        }

        const appointments = await prisma.appointment.findMany({
            where,
            include: {
                patient: { select: { id: true, name: true, email: true, phone: true } },
                treatment: { select: { id: true, name: true, price: true, durationMin: true } },
            },
            orderBy: { startTime: "desc" },
        });

        return NextResponse.json({ appointments });
    } catch (error) {
        logger.error({ err: error }, "Failed to fetch appointments");
        return NextResponse.json({ error: "Failed to fetch appointments" }, { status: 500 });
    }
}

// POST: Book a new appointment
export async function POST(request: Request) {
    let body;
    try {
        const cookie = (await cookies()).get("session")?.value;
        let session = null;
        if (cookie) {
            try {
                session = await decrypt(cookie);
            } catch {
                session = null;
            }
        }

        const bookerRole = session?.role as string | undefined;
        let patientId = session?.id as string | undefined;

        body = await request.json();

        // 🛡️ Strict Payload Validation using Zod
        const validationResult = bookingSchema.safeParse(body);
        if (!validationResult.success) {
            return NextResponse.json({
                error: "Validation failed",
                details: validationResult.error.format()
            }, { status: 400 });
        }

        const { treatmentId, date, time, notes, newPatient, guestName, guestPhone, guestEmail, guestDob } = validationResult.data;

        // If not logged in and not staff, guest details are required
        if (!session && (!guestName || !guestPhone)) {
            return NextResponse.json({ error: "Name and phone number are required to book" }, { status: 400 });
        }

        // Validation for Staff/Admin booking on behalf of others
        if (bookerRole === "STAFF" || bookerRole === "ADMIN") {
            if (validationResult.data.patientId) {
                patientId = validationResult.data.patientId;
            }
            if (!patientId && !newPatient) {
                return NextResponse.json({ error: "Patient ID or New Patient details required" }, { status: 400 });
            }
        }

        // Validate date — no past dates, no Sundays
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
            return NextResponse.json({ error: "Cannot book an appointment on a past date" }, { status: 400 });
        }

        if (selectedDate.getDay() === 0) {
            return NextResponse.json(
                { error: "Sunday is a clinic off day. Please select another date." },
                { status: 400 }
            );
        }

        // Get treatment info
        const treatment = await prisma.treatment.findUnique({
            where: { id: treatmentId },
        });
        if (!treatment) {
            return NextResponse.json({ error: "Treatment not found" }, { status: 404 });
        }

        // Calculate start and end times
        const [timeH, timeM] = time.split(":").map(Number);
        const startTime = new Date(date);
        startTime.setHours(timeH, timeM, 0, 0);

        const endTime = new Date(startTime);
        endTime.setMinutes(endTime.getMinutes() + treatment.durationMin);

        // Determine booking source
        let bookedBy: "WEBSITE" | "WALK_IN" | "WHATSAPP_BOT" = "WEBSITE";
        if (bookerRole === "STAFF" || bookerRole === "ADMIN") {
            bookedBy = body.bookedBy || "WALK_IN";
        }

        // Atomic transaction for double-booking prevention AND user creation
        const result = await prisma.$transaction(async (tx) => {
            let finalPatientId = patientId;

            // 1. Handle New Patient or Guest Creation if needed
            if ((bookerRole === "STAFF" || bookerRole === "ADMIN") && newPatient) {
                const existingUser = await tx.user.findFirst({
                    where: {
                        phone: newPatient.phone,
                    },
                });

                if (existingUser) {
                    finalPatientId = existingUser.id;
                } else {
                    const hashedPassword = await bcrypt.hash("Patient123!", 10);
                    const createdUser = await tx.user.create({
                        data: {
                            name: newPatient.name,
                            email: newPatient.email || undefined,
                            phone: newPatient.phone,
                            password: hashedPassword,
                            role: "PATIENT",
                            dateOfBirth: newPatient.dateOfBirth ? new Date(newPatient.dateOfBirth) : undefined,
                        },
                    });
                    finalPatientId = createdUser.id;
                }
            } else if (!finalPatientId && guestPhone && guestName) {
                const existingUser = await tx.user.findFirst({
                    where: { phone: guestPhone },
                });

                if (existingUser) {
                    finalPatientId = existingUser.id;
                } else {
                    const hashedPassword = await bcrypt.hash("Patient123!", 10);
                    const createdUser = await tx.user.create({
                        data: {
                            name: guestName,
                            email: guestEmail || undefined,
                            phone: guestPhone,
                            password: hashedPassword,
                            role: "PATIENT",
                            dateOfBirth: guestDob ? new Date(guestDob) : undefined,
                        },
                    });
                    finalPatientId = createdUser.id;
                }
            }

            // 2. Check for exact time overlap
            const conflict = await tx.appointment.findFirst({
                where: {
                    status: { notIn: ["CANCELLED"] },
                    AND: [
                        { startTime: { lt: endTime } },
                        { endTime: { gt: startTime } },
                    ],
                },
            });

            if (conflict) {
                throw new Error("DOUBLE_BOOKING");
            }

            // 3. Create appointment
            const appointment = await tx.appointment.create({
                data: {
                    startTime,
                    endTime,
                    patientId: finalPatientId,
                    treatmentId,
                    status: "SCHEDULED",
                    bookedBy,
                    price: treatment.price,
                    // Guest Details
                    guestName: guestName,
                    guestPhone: guestPhone,
                    guestEmail: guestEmail,
                    guestDob: guestDob ? new Date(guestDob) : undefined,
                },
                include: {
                    treatment: { select: { name: true, durationMin: true } },
                    patient: { select: { name: true, phone: true, email: true } },
                },
            });

            return appointment;
        });

        // 4. Create Google Calendar event (outside transaction — non-blocking background task)
        (async () => {
            try {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const safeResult = result as any;
                if (safeResult.treatment && safeResult.patient) {
                    const googleEventId = await createCalendarEvent({
                        summary: `${safeResult.treatment.name} — ${safeResult.patient.name}`,
                        description: `Treatment: ${safeResult.treatment.name}\nDuration: ${safeResult.treatment.durationMin} min`,
                        startTime: safeResult.startTime,
                        endTime: safeResult.endTime,
                        patientName: safeResult.patient.name || "Patient",
                    });

                    if (googleEventId) {
                        await prisma.appointment.update({
                            where: { id: result.id },
                            data: { googleEventId },
                        });
                    }
                }
            } catch (calError) {
                logger.warn({ err: calError, appointmentId: result.id }, "Google Calendar sync failed");
            }
        })();

        // Send Email notification
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const safeResultObj = result as any;
        const emailToNotify = safeResultObj.patient?.email;
        if (emailToNotify) {
            const formattedDate = new Date(safeResultObj.startTime).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
            const formattedTime = new Date(safeResultObj.startTime).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });

            sendAppointmentConfirmationEmail(
                emailToNotify,
                safeResultObj.patient.name,
                safeResultObj.treatment.name,
                formattedDate,
                formattedTime
            ).catch((err) => logger.warn({ err }, "Failed to send confirmation email"));
        }

        // Revalidate cached pages so admin/staff see fresh data instantly
        revalidatePath("/admin", "layout");
        revalidatePath("/staff", "layout");

        return NextResponse.json({
            success: true,
            appointment: result,
            message: "Appointment booked successfully!",
        }, { status: 201 });
    } catch (error) {
        if (error instanceof Error && error.message === "DOUBLE_BOOKING") {
            return NextResponse.json({
                error: "This time slot is no longer available. Please select another time.",
                code: "DOUBLE_BOOKING",
            }, { status: 409 });
        }
        logger.error({ err: error, body }, "Failed to book appointment");
        return NextResponse.json({ error: "Failed to book appointment" }, { status: 500 });
    }
}
