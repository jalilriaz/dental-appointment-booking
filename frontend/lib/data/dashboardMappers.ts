import type { AppRole } from "@/lib/auth/permissions";
import {
    formatKarachiDate,
    formatKarachiTime,
    getKarachiDateKey,
} from "@/lib/format";
import type { fetchDashboardRawData } from "@/lib/data/dashboardQueries";
import type {
    DashboardQueueAppointment,
    NeedsAttentionItem,
    UpcomingScheduleItem,
} from "@/features/dashboard/types";

type RawData = Awaited<ReturnType<typeof fetchDashboardRawData>>;

export function mapQueueAppointments(
    queueAppts: RawData["queueAppts"],
    canViewFinance: boolean
): DashboardQueueAppointment[] {
    return queueAppts.map((apt) => {
        const fin = apt as { price?: number; discount?: number | null; amountPaid?: number | null };
        return {
            id: apt.id,
            startTime: apt.startTime.toISOString(),
            endTime: apt.endTime.toISOString(),
            dateKey: getKarachiDateKey(apt.startTime),
            status: apt.status,
            isEmergency: apt.isEmergency,
            notes: apt.notes,
            ...(canViewFinance
                ? { price: fin.price, discount: fin.discount ?? undefined, amountPaid: fin.amountPaid ?? 0 }
                : {}),
            patient: apt.patient
                ? {
                      id: apt.patient.id,
                      name: apt.patient.name,
                      phone: apt.patient.phone,
                      patientCode: apt.patient.patientCode,
                      medicalAlerts: apt.patient.medicalAlerts,
                      allergies: Array.isArray(apt.patient.allergies) ? apt.patient.allergies.map(String) : [],
                      medications: Array.isArray(apt.patient.medications) ? apt.patient.medications.map(String) : [],
                      noShowCount: apt.patient.noShowCount,
                      isFirstVisit: (apt.patient._count?.appointments ?? 1) <= 1,
                  }
                : null,
            treatment: apt.treatment,
            doctor: apt.doctor,
            patientTreatment: apt.patientTreatment,
        };
    });
}

export function mapUpcomingAppointments(
    upcomingAppts: RawData["upcomingAppts"]
): UpcomingScheduleItem[] {
    return upcomingAppts.map((apt) => ({
        id: apt.id,
        startTime: apt.startTime.toISOString(),
        endTime: apt.endTime.toISOString(),
        dateKey: getKarachiDateKey(apt.startTime),
        status: apt.status,
        isEmergency: apt.isEmergency,
        patient: apt.patient
            ? {
                  id: apt.patient.id,
                  name: apt.patient.name,
                  phone: apt.patient.phone,
                  isFirstVisit: (apt.patient._count?.appointments ?? 1) <= 1,
              }
            : null,
        treatment: apt.treatment,
    }));
}

export function buildNeedsAttentionItems(
    role: AppRole,
    unpaidItems: NeedsAttentionItem[],
    unconfirmedTomorrow: RawData["unconfirmedTomorrow"],
    recentNoShows: RawData["recentNoShows"]
): NeedsAttentionItem[] {
    const basePrefix = role === "ADMIN" ? "admin" : "staff";
    return [
        ...unpaidItems,
        ...unconfirmedTomorrow.map((a) => ({
            id: `unconf-${a.id}`,
            type: "unconfirmed" as const,
            title: `${a.patient?.name || "Patient"} · ${a.treatment.name}`,
            subtitle: `Tomorrow at ${formatKarachiTime(a.startTime)} · No WhatsApp/email sent`,
            href: `/${basePrefix}/appointments?filter=tomorrow`,
        })),
        ...recentNoShows.map((a) => ({
            id: `noshow-${a.id}`,
            type: "noshow" as const,
            title: `${a.patient?.name || "Patient"} · ${a.treatment.name}`,
            subtitle: `No-show on ${formatKarachiDate(a.startTime, "short")}`,
            href: a.patient?.id
                ? `/${basePrefix}/patients/${a.patient.id}`
                : `/${basePrefix}/appointments`,
        })),
    ].slice(0, 8);
}
