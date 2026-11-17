import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/auth";
import { redirect } from "next/navigation";
import SettingsForm from "@/components/admin/settings/SettingsForm";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";

export default async function AdminSettingsPage() {
    const cookie = (await cookies()).get("session")?.value;
    if (!cookie) redirect("/login");
    let session;
    try { session = await decrypt(cookie); } catch { redirect("/login"); }

    // Load saved settings & holidays from DB
    const [settings, holidays, admin] = await Promise.all([
        prisma.systemSettings?.findUnique({ where: { id: "settings" } }).catch(() => null),
        (prisma as any).clinicHoliday?.findMany({ orderBy: { startDate: "desc" } }).catch(() => []) ?? [],
        prisma.user.findUnique({
            where: { id: session.id as string },
            select: { googleCalendarConnected: true },
        }),
    ]);

    const serializedHolidays = (holidays || []).map((h: any) => ({
        id: h.id,
        title: h.title,
        startDate: h.startDate.toISOString().split("T")[0],
        endDate: h.endDate.toISOString().split("T")[0],
        reason: h.reason || "",
        showOnWeb: h.showOnWeb,
        isActive: h.isActive,
    }));

    const initialSettings = settings ? {
        clinicName: settings.clinicName,
        clinicAddress: settings.clinicAddress,
        landlinePhone: settings.landlinePhone,
        mobilePhone: settings.mobilePhone,
        whatsappNumber: settings.whatsappNumber,
        clinicEmail: settings.clinicEmail,
        pmdcRegNumber: settings.pmdcRegNumber,
        receiptFooter: settings.receiptFooter,
        workingHoursStart: settings.workDayStart,
        workingHoursEnd: settings.workDayEnd,
        slotDurationMin: settings.slotDurationMin,
        weeklyWorkingDays: settings.weeklyWorkingDays,
    } : null;

    return (
        <div className="space-y-6 font-sans">
            {/* Header with Clinical Pill */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-1">
                <div className="space-y-1.5">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 text-[11px] font-extrabold uppercase tracking-wider">
                        <TuneOutlinedIcon sx={{ fontSize: 14 }} />
                        <span>Practice Governance · Cloud Integrations</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-sans">
                        Clinic Settings
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium">
                        Configure practice identity, official receipts, operating hours, holidays, and external calendar synchronization.
                    </p>
                </div>
            </div>

            <SettingsForm
                initialSettings={initialSettings}
                initialHolidays={serializedHolidays}
                googleCalendarConnected={admin?.googleCalendarConnected || false}
            />
        </div>
    );
}
