import type { getProfitReport, getAgingReport } from "@/lib/data/financeReports";
import type { getAppointmentReport, getRetentionReport } from "@/lib/data/clinicalReports";

export type ProfitReportData = Awaited<ReturnType<typeof getProfitReport>>;
export type AgingReportData = Awaited<ReturnType<typeof getAgingReport>>;
export type AppointmentReportData = Awaited<ReturnType<typeof getAppointmentReport>>;
export type RetentionReportData = Awaited<ReturnType<typeof getRetentionReport>>;

export interface ReportsBundle {
    profit: ProfitReportData;
    aging: AgingReportData;
    appointments: AppointmentReportData;
    retention: RetentionReportData;
}

export type ReportTabKey = "profit" | "aging" | "appointments" | "retention";
