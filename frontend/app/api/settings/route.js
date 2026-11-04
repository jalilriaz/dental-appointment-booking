"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PUT = PUT;
const server_1 = require("next/server");
const prisma_1 = __importDefault(require("@/lib/prisma"));
const headers_1 = require("next/headers");
const auth_1 = require("@/lib/auth");
const zod_1 = require("zod");
const logger_1 = require("@/lib/logger");
const settingsSchema = zod_1.z.object({
    clinicName: zod_1.z.string().min(1).max(100).optional(),
    workDayStart: zod_1.z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format").optional(),
    workDayEnd: zod_1.z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format").optional(),
    slotDurationMin: zod_1.z.number().int().min(5).max(120).optional().or(zod_1.z.string().regex(/^\d+$/).transform(Number).optional()),
});
async function PUT(request) {
    try {
        const cookie = (await (0, headers_1.cookies)()).get("session")?.value;
        if (!cookie)
            return server_1.NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        const session = await (0, auth_1.decrypt)(cookie);
        if (session.role !== "ADMIN") {
            return server_1.NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
        const body = await request.json();
        const parseResult = settingsSchema.safeParse(body);
        if (!parseResult.success) {
            return server_1.NextResponse.json({ error: "Invalid data format" }, { status: 400 });
        }
        const { clinicName, workDayStart, workDayEnd, slotDurationMin, } = parseResult.data;
        // Upsert system settings (always stored with id = "settings")
        const settings = await prisma_1.default.systemSettings.upsert({
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
        logger_1.logger.info({ adminId: session.id, action: "update_system_settings" }, "Admin updated global system settings");
        return server_1.NextResponse.json({ settings });
    }
    catch (error) {
        console.error("Update settings error:", error);
        return server_1.NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
