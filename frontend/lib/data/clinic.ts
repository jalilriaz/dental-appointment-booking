import prisma from "@/lib/prisma";

export interface ClinicDoctorInfo {
    id: string | null;
    name: string;
    role: string;
    pmdcReg: string;
    qualifications: string;
    operatory: string;
    schedule: string;
    consultationFee: number;
    image: string;
    isActive: boolean;
}

export interface ClinicProfileData {
    clinicName: string;
    clinicAddress: string;
    landlinePhone: string;
    mobilePhone: string;
    whatsappNumber: string;
    clinicEmail: string;
    pmdcRegNumber: string;
    receiptFooter: string;
    workDayStart: string;
    workDayEnd: string;
    slotDurationMin: number;
    weeklyWorkingDays: string;
    doctor: ClinicDoctorInfo;
}

export async function getClinicProfile(): Promise<ClinicProfileData> {
    const [settings, leadDoctor] = await Promise.all([
        prisma.systemSettings.findUnique({ where: { id: "settings" } }).catch(() => null),
        prisma.doctor
            .findFirst({ orderBy: [{ isLead: "desc" }, { createdAt: "asc" }] })
            .catch(() => null),
    ]);

    return {
        clinicName: settings?.clinicName || "Dental Clinic",
        clinicAddress: settings?.clinicAddress || "-",
        landlinePhone: settings?.landlinePhone || "-",
        mobilePhone: settings?.mobilePhone || "-",
        whatsappNumber: settings?.whatsappNumber || "-",
        clinicEmail: settings?.clinicEmail || "-",
        pmdcRegNumber: settings?.pmdcRegNumber || leadDoctor?.pmdcReg || "-",
        receiptFooter: settings?.receiptFooter || "",
        workDayStart: settings?.workDayStart || "12:00",
        workDayEnd: settings?.workDayEnd || "20:00",
        slotDurationMin: settings?.slotDurationMin || 30,
        weeklyWorkingDays:
            settings?.weeklyWorkingDays || "Monday,Tuesday,Wednesday,Thursday,Friday,Saturday",
        doctor: {
            id: leadDoctor?.id || null,
            name: leadDoctor?.name || "Attending Dentist",
            role: leadDoctor?.role || "Lead Dental Surgeon",
            pmdcReg: leadDoctor?.pmdcReg || settings?.pmdcRegNumber || "-",
            qualifications: leadDoctor?.qualifications || "-",
            operatory: leadDoctor?.operatory || "Primary Suite",
            schedule: leadDoctor?.schedule || `${settings?.workDayStart || "12:00"} – ${settings?.workDayEnd || "20:00"}`,
            consultationFee: leadDoctor?.consultationFee ?? 0,
            image: leadDoctor?.image || "/logo.svg",
            isActive: leadDoctor?.isActive ?? true,
        },
    };
}
