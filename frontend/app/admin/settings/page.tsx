import prisma from "@/lib/prisma";
import { requireRole } from "@/lib/auth/permissions";
import SettingsForm from "@/components/admin/settings/SettingsForm";
import DoctorAvailabilityCard from "@/features/operations/DoctorAvailabilityCard";
import MessageTemplatesEditor from "@/features/operations/MessageTemplatesEditor";
import BookingRulesCard from "@/features/polish/BookingRulesCard";
import PublicContentCard from "@/features/polish/PublicContentCard";
import BackupExportCard from "@/features/polish/BackupExportCard";
import { getDoctorAvailabilityWithAffected } from "@/lib/services/doctorLeave";
import { mergeSavedTemplates } from "@/lib/services/messageTemplates";
import { mergePublicContent } from "@/lib/services/publicContent";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";

export default async function AdminSettingsPage() {
    const session = await requireRole(["ADMIN"], { callbackUrl: "/admin/settings" });

    // Load saved settings & holidays from DB
    const [settings, holidays, admin, doctor, availability] = await Promise.all([
        prisma.systemSettings?.findUnique({ where: { id: "settings" } }).catch(() => null),
        (prisma as any).clinicHoliday?.findMany({ orderBy: { startDate: "desc" } }).catch(() => []) ?? [],
        prisma.user.findUnique({
            where: { id: session.id },
            select: { googleCalendarConnected: true },
        }),
        prisma.doctor.findFirst({
            where: { isLead: true },
        }).catch(() => null) || prisma.doctor.findFirst().catch(() => null),
        getDoctorAvailabilityWithAffected(),
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

    const initialDoctor = doctor ? {
        id: doctor.id,
        name: doctor.name,
        role: doctor.role,
        pmdcReg: doctor.pmdcReg,
        qualifications: doctor.qualifications,
        experience: doctor.experience,
        specialty: doctor.specialty,
        operatory: doctor.operatory,
        schedule: doctor.schedule,
        consultationFee: doctor.consultationFee,
        isActive: doctor.isActive,
        image: doctor.image,
    } : null;

    return (
        <div className="space-y-6 font-sans">
            {/* Header with Clinical Pill */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-1">
                <div className="space-y-1.5">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 text-[11px] font-extrabold uppercase tracking-wider">
                        <TuneOutlinedIcon sx={{ fontSize: 14 }} />
                        <span>Practice Governance · Single-Doctor Setup</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-sans">
                        Clinic &amp; Doctor Settings
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium">
                        Configure practice identity, doctor credentials, operating hours, holidays, and calendar sync.
                    </p>
                </div>
            </div>

            <SettingsForm
                initialSettings={initialSettings}
                initialDoctor={initialDoctor}
                initialHolidays={serializedHolidays}
                googleCalendarConnected={admin?.googleCalendarConnected || false}
            />

            {availability.doctor && (
                <DoctorAvailabilityCard
                    initialDoctor={availability.doctor}
                    initialAffected={availability.affectedAppointments}
                />
            )}

            <MessageTemplatesEditor
                initialTemplates={mergeSavedTemplates(settings?.messageTemplates)}
            />

            <BookingRulesCard
                initialRules={{
                    breakStart: settings?.breakStart || "",
                    breakEnd: settings?.breakEnd || "",
                    bufferMin: settings?.bufferMin ?? 0,
                    advanceNoticeMin: settings?.advanceNoticeMin ?? 60,
                    maxBookingDaysAhead: settings?.maxBookingDaysAhead ?? 60,
                    cancellationCutoffHours: settings?.cancellationCutoffHours ?? 12,
                }}
            />

            <PublicContentCard initialContent={mergePublicContent(settings?.publicContent)} />

            <BackupExportCard />
        </div>
    );
}
