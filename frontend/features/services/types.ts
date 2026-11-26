export interface ServiceItem {
    id: string;
    name: string;
    category: string;
    durationMin: number;
    price: number;
    discountedPrice: number | null;
    description: string | null;
    instructions: string | null;
    isActive: boolean;
    showOnWeb: boolean;
    isMultiSession: boolean;
    defaultSessions: number;
    imageUrl: string | null;
    _count?: {
        appointments: number;
        patientTreatments?: number;
    };
}

export const SERVICE_CATEGORIES = [
    "General",
    "Cosmetic",
    "Restorative",
    "Consultations",
] as const;

export type ServiceSort = "name" | "price_asc" | "price_desc" | "duration" | "bookings";

export function totalRefs(item: ServiceItem): number {
    return (item._count?.appointments || 0) + (item._count?.patientTreatments || 0);
}
