import prisma from "@/lib/prisma";
import { listLabOrders } from "@/lib/services/labOrders";
import { listWaitlistEntries } from "@/lib/services/waitlist";
import type { LabOrderRow, WaitlistRow } from "@/features/polish/types";

export async function loadLabOrdersBundle(isAdmin: boolean) {
    const [ordersRaw, patients] = await Promise.all([
        listLabOrders("ALL"),
        isAdmin
            ? prisma.user.findMany({
                  where: { role: "PATIENT", deletedAt: null },
                  select: { id: true, name: true, phone: true },
                  orderBy: { name: "asc" },
                  take: 250,
              })
            : Promise.resolve([]),
    ]);

    const orders: LabOrderRow[] = ordersRaw.map((o) => ({
        id: o.id,
        patientId: o.patientId,
        patientName: o.patient?.name || "Patient",
        patientPhone: o.patient?.phone || null,
        labName: o.labName,
        workType: o.workType,
        toothNumbers: o.toothNumbers,
        shade: o.shade,
        cost: isAdmin ? o.cost : 0,
        status: o.status,
        sentDate: o.sentDate.toISOString(),
        expectedDate: o.expectedDate ? o.expectedDate.toISOString() : null,
        receivedDate: o.receivedDate ? o.receivedDate.toISOString() : null,
        deliveredDate: o.deliveredDate ? o.deliveredDate.toISOString() : null,
        notes: o.notes,
    }));

    return { orders, patients };
}

export async function loadWaitlistBundle() {
    const [entriesRaw, treatments] = await Promise.all([
        listWaitlistEntries("ALL"),
        prisma.treatment.findMany({
            where: { isActive: true, deletedAt: null },
            select: { id: true, name: true },
            orderBy: { name: "asc" },
        }),
    ]);

    const entries: WaitlistRow[] = entriesRaw.map((e) => ({
        id: e.id,
        patientId: e.patientId,
        patientName: e.patientName,
        patientPhone: e.patientPhone,
        treatmentId: e.treatmentId,
        treatmentName: e.treatment?.name || null,
        preferredDate: e.preferredDate.toISOString(),
        preferredTimeSlot: e.preferredTimeSlot,
        status: e.status,
        notes: e.notes,
        notifiedAt: e.notifiedAt ? e.notifiedAt.toISOString() : null,
    }));

    return { entries, treatments };
}
