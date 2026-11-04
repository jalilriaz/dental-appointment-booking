"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
const server_1 = require("next/server");
const prisma_1 = __importDefault(require("@/lib/prisma"));
// This route can be triggered by a Vercel Cron Job on a daily schedule
async function GET(req) {
    try {
        // Optional: you can add a secret key check here if you want to protect the cron route manually
        // const authHeader = req.headers.get('authorization');
        // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        //     return new Response('Unauthorized', { status: 401 });
        // }
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        // Find all unresolved past appointments (SCHEDULED or RESCHEDULED)
        const pastAppointments = await prisma_1.default.appointment.findMany({
            where: {
                startTime: { lt: today },
                status: { in: ["SCHEDULED", "RESCHEDULED"] }
            }
        });
        let updatedCount = 0;
        for (const apt of pastAppointments) {
            // Update status to NO_SHOW
            await prisma_1.default.appointment.update({
                where: { id: apt.id },
                data: { status: "NO_SHOW" }
            });
            // Increment patient's noShowCount
            await prisma_1.default.user.update({
                where: { id: apt.patientId },
                data: { noShowCount: { increment: 1 } }
            });
            updatedCount++;
        }
        return server_1.NextResponse.json({
            success: true,
            message: `Successfully processed ${updatedCount} past no-show appointments.`
        });
    }
    catch (error) {
        console.error("Cron Job Error (mark-no-show):", error);
        return server_1.NextResponse.json({ error: "Failed to process past appointments" }, { status: 500 });
    }
}
