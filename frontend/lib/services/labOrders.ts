import prisma from "@/lib/prisma";
import { logFrontendAudit } from "@/lib/audit";
import type { LabOrderStatus } from "@/src/generated/client";

export async function listLabOrders(statusFilter?: string) {
    return prisma.labOrder.findMany({
        where: statusFilter && statusFilter !== "ALL" ? { status: statusFilter as LabOrderStatus } : undefined,
        include: {
            patient: { select: { id: true, name: true, phone: true, patientCode: true } },
            appointment: { select: { id: true, startTime: true } },
        },
        orderBy: [{ status: "asc" }, { expectedDate: "asc" }, { createdAt: "desc" }],
        take: 200,
    });
}

export async function createLabOrder(
    input: {
        patientId: string;
        appointmentId?: string | null;
        labName: string;
        workType: string;
        toothNumbers?: string | null;
        shade?: string | null;
        cost: number;
        expectedDate?: string | null;
        notes?: string | null;
    },
    actorUserId: string
) {
    const order = await prisma.labOrder.create({
        data: {
            patientId: input.patientId,
            appointmentId: input.appointmentId || null,
            labName: input.labName.trim(),
            workType: input.workType.trim(),
            toothNumbers: input.toothNumbers?.trim() || null,
            shade: input.shade?.trim() || null,
            cost: input.cost,
            expectedDate: input.expectedDate ? new Date(`${input.expectedDate}T12:00:00+05:00`) : null,
            notes: input.notes?.trim() || null,
        },
        include: { patient: { select: { id: true, name: true, phone: true, patientCode: true } } },
    });

    await logFrontendAudit({
        userId: actorUserId,
        action: "CREATE_LAB_ORDER",
        entity: "LabOrder",
        entityId: order.id,
        details: { labName: order.labName, workType: order.workType, cost: order.cost },
    });
    return order;
}

export async function updateLabOrder(
    id: string,
    input: {
        status?: LabOrderStatus;
        labName?: string;
        workType?: string;
        toothNumbers?: string | null;
        shade?: string | null;
        cost?: number;
        expectedDate?: string | null;
        notes?: string | null;
    },
    actorUserId: string
) {
    const now = new Date();
    const order = await prisma.labOrder.update({
        where: { id },
        data: {
            ...(input.status ? { status: input.status } : {}),
            ...(input.status === "RECEIVED" ? { receivedDate: now } : {}),
            ...(input.status === "DELIVERED" ? { deliveredDate: now } : {}),
            ...(input.labName !== undefined ? { labName: input.labName.trim() } : {}),
            ...(input.workType !== undefined ? { workType: input.workType.trim() } : {}),
            ...(input.toothNumbers !== undefined ? { toothNumbers: input.toothNumbers?.trim() || null } : {}),
            ...(input.shade !== undefined ? { shade: input.shade?.trim() || null } : {}),
            ...(input.cost !== undefined ? { cost: input.cost } : {}),
            ...(input.expectedDate !== undefined
                ? { expectedDate: input.expectedDate ? new Date(`${input.expectedDate}T12:00:00+05:00`) : null }
                : {}),
            ...(input.notes !== undefined ? { notes: input.notes?.trim() || null } : {}),
        },
        include: { patient: { select: { id: true, name: true, phone: true, patientCode: true } } },
    });

    await logFrontendAudit({
        userId: actorUserId,
        action: "UPDATE_LAB_ORDER",
        entity: "LabOrder",
        entityId: id,
        details: { status: order.status },
    });
    return order;
}

export async function deleteLabOrder(id: string, actorUserId: string) {
    await prisma.labOrder.delete({ where: { id } });
    await logFrontendAudit({
        userId: actorUserId,
        action: "DELETE_LAB_ORDER",
        entity: "LabOrder",
        entityId: id,
    });
}
