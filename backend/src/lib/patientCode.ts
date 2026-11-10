import prisma from "@/lib/prisma";

/**
 * Generate the next patient code.
 * Patient codes start at 1000 and auto-increment.
 * Used by WhatsApp bot and walk-in registration.
 */
export async function generatePatientCode(): Promise<number> {
    const result = await prisma.user.aggregate({
        _max: { patientCode: true },
    });
    return (result._max.patientCode || 999) + 1;
}
