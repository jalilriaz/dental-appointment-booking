import { z } from "zod";

export const labOrderStatusEnum = z.enum([
    "SENT",
    "IN_PROGRESS",
    "RECEIVED",
    "DELIVERED",
    "CANCELLED",
]);

export const labOrderCreateSchema = z.object({
    patientId: z.string().uuid("Patient is required"),
    appointmentId: z.string().uuid().optional().nullable(),
    labName: z.string().trim().min(2, "Lab name is required").max(120),
    workType: z.string().trim().min(2, "Work type is required").max(150),
    toothNumbers: z.string().trim().max(80).optional().nullable(),
    shade: z.string().trim().max(50).optional().nullable(),
    cost: z.coerce.number().int().min(0, "Lab cost cannot be negative").default(0),
    expectedDate: z.coerce.date().optional().nullable(),
    notes: z.string().trim().max(500).optional().nullable(),
});

export const labOrderUpdateSchema = z.object({
    status: labOrderStatusEnum.optional(),
    cost: z.coerce.number().int().min(0).optional(),
    expectedDate: z.coerce.date().optional().nullable(),
    receivedDate: z.coerce.date().optional().nullable(),
    deliveredDate: z.coerce.date().optional().nullable(),
    notes: z.string().trim().max(500).optional().nullable(),
});

export type LabOrderCreateInput = z.infer<typeof labOrderCreateSchema>;
export type LabOrderUpdateInput = z.infer<typeof labOrderUpdateSchema>;
