import type { ClinicProfileData } from "@/lib/data/clinic";

export interface DashboardKPIs {
    revenueThisMonth: number | null;
    revenueTrendText: string;
    revenueTrendPositive: boolean;
    appointmentsTodayDone: number;
    appointmentsTodayTotal: number;
    appointmentsTodayRemaining: number;
    tomorrowTotal: number;
    totalPatients: number;
    newPatientsThisMonth: number;
    outstandingBalance: number | null;
}

export interface ChartDataPoint {
    label: string;
    revenue: number | null;
    appointments: number;
}

export interface ChartDatasets {
    weekly: ChartDataPoint[];
    monthly: ChartDataPoint[];
    yearly: ChartDataPoint[];
}

export interface DashboardQueueAppointment {
    id: string;
    startTime: string;
    endTime: string;
    dateKey: string;
    status: string;
    isEmergency: boolean;
    notes?: string | null;
    price?: number;
    discount?: number;
    amountPaid?: number;
    patient: {
        id: string;
        name: string | null;
        phone: string | null;
        patientCode?: number | null;
        medicalAlerts?: string | null;
        allergies?: string[];
        medications?: string[];
        noShowCount?: number;
        isFirstVisit: boolean;
    } | null;
    treatment: {
        id: string;
        name: string;
        durationMin: number;
        price: number;
        isMultiSession?: boolean;
        defaultSessions?: number;
    };
    doctor?: {
        id: string;
        name: string;
        role: string;
        operatory: string;
    } | null;
    patientTreatment?: {
        id: string;
        totalCost: number;
        totalSessions: number;
        clinicalStatus: string;
        financialStatus: string;
    } | null;
}

export interface UpcomingScheduleItem {
    id: string;
    startTime: string;
    endTime: string;
    dateKey: string;
    status: string;
    isEmergency: boolean;
    patient: {
        id: string;
        name: string | null;
        phone: string | null;
        isFirstVisit: boolean;
    } | null;
    treatment: {
        name: string;
        durationMin: number;
    };
}

export interface StatusDistribution {
    completed: number;
    upcoming: number;
    cancelled: number;
    noShow: number;
    total: number;
}

export interface PopularTreatmentItem {
    name: string;
    bookings: number;
    revenue: number | null;
    category: string;
}

export interface NeedsAttentionItem {
    id: string;
    type: "unpaid" | "unconfirmed" | "noshow";
    title: string;
    subtitle: string;
    href: string;
    meta?: string;
}

export interface ClinicDashboardData {
    role: "ADMIN" | "STAFF";
    clinic: ClinicProfileData;
    kpis: DashboardKPIs;
    chartData: ChartDatasets;
    queueAppointments: DashboardQueueAppointment[];
    upcomingAppointments: UpcomingScheduleItem[];
    statusDistribution: StatusDistribution;
    popularTreatments: PopularTreatmentItem[];
    needsAttention: NeedsAttentionItem[];
}
