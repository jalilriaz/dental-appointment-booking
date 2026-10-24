import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/auth";
import { redirect } from "next/navigation";
import SettingsForm from "@/components/admin/settings/SettingsForm";

export default async function AdminSettingsPage() {
    const cookie = (await cookies()).get("session")?.value;
    if (!cookie) redirect("/login");
    let session;
    try { session = await decrypt(cookie); } catch { redirect("/login"); }

    // Load saved settings from DB
    const settings = await prisma.systemSettings.findUnique({
        where: { id: "settings" },
    });

    // Check if admin has Google Calendar connected
    const admin = await prisma.user.findUnique({
        where: { id: session.id as string },
        select: { googleCalendarConnected: true },
    });

    const initialSettings = settings ? {
        workingHoursStart: settings.workDayStart,
        workingHoursEnd: settings.workDayEnd,
    } : null;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Clinic Settings</h1>
                <p className="text-sm text-slate-500">Manage clinic configuration and integrations.</p>
            </div>
            <SettingsForm
                initialSettings={initialSettings}
                googleCalendarConnected={admin?.googleCalendarConnected || false}
            />
        </div>
    );
}
