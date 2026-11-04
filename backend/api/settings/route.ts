import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/auth";
import { z } from "zod";
import { logger } from "@/lib/logger";

const settingsSchema = z.object({
    clinicName: z.string().min(1).max(100).optional(),
    workDayStart: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format").optional(),
    workDayEnd: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format").optional(),
    slotDurationMin: z.number().int().min(5).max(120).optional().or(z.string().regex(/^\d+$/).transform(Number).optional()),
});

export async function PUT(request: Request) {
    try {
        const cookie = (await cookies()).get("session")?.value;
        if (!cookie) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const session = await decrypt(cookie);
        if (session.role !== "ADMIN") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const body = await request.json();
        const parseResult = settingsSchema.safeParse(body);
        
        if (!parseResult.success) {
            return NextResponse.json({ error: "Invalid data format" }, { status: 400 });
        }

        const {
            clinicName,
            workDayStart,
            workDayEnd,
            slotDurationMin,
        } = parseResult.data;

        // Upsert system settings (always stored with id = "settings")
        const settings = await prisma.systemSettings.upsert({
            where: { id: "settings" },
            update: {
                clinicName,
                workDayStart,
                workDayEnd,
                slotDurationMin: slotDurationMin ? Number(slotDurationMin) : undefined,
            },
            create: {
                id: "settings",
                clinicName: clinicName || "Elite Dental Centre",
                workDayStart: workDayStart || "09:00",
                workDayEnd: workDayEnd || "18:00",
                slotDurationMin: slotDurationMin ? Number(slotDurationMin) : 30,
            },
        });

        logger.info({ adminId: session.id, action: "update_system_settings" }, "Admin updated global system settings");

        return NextResponse.json({ settings });

    } catch (error) {
        console.error("Update settings error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
