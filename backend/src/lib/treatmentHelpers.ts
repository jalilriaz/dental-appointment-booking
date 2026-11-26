export interface TreatmentInput {
    name?: string;
    category?: string;
    durationMin?: number | string;
    price?: number | string;
    discountedPrice?: number | string | null;
    description?: string | null;
    instructions?: string | null;
    isActive?: boolean;
    showOnWeb?: boolean;
    isMultiSession?: boolean;
    defaultSessions?: number | string;
    imageUrl?: string | null;
}

export function buildTreatmentUpdateData(
    body: TreatmentInput,
    existing?: { isMultiSession: boolean; defaultSessions: number }
) {
    const multi =
        body.isMultiSession !== undefined
            ? Boolean(body.isMultiSession)
            : (existing?.isMultiSession ?? false);
    const rawSessions = body.defaultSessions ?? existing?.defaultSessions ?? 2;
    const defaultSessions = multi ? Math.max(2, parseInt(String(rawSessions), 10) || 2) : 1;

    return {
        ...(body.name !== undefined && { name: body.name.trim() }),
        ...(body.category !== undefined && { category: body.category?.trim() || 'General' }),
        ...(body.durationMin !== undefined && { durationMin: parseInt(String(body.durationMin), 10) }),
        ...(body.price !== undefined && { price: parseInt(String(body.price), 10) }),
        ...(body.discountedPrice !== undefined && {
            discountedPrice: body.discountedPrice ? parseInt(String(body.discountedPrice), 10) : null,
        }),
        ...(body.description !== undefined && { description: body.description?.trim() || null }),
        ...(body.instructions !== undefined && { instructions: body.instructions?.trim() || null }),
        ...(body.isActive !== undefined && { isActive: Boolean(body.isActive) }),
        ...(body.showOnWeb !== undefined && { showOnWeb: Boolean(body.showOnWeb) }),
        isMultiSession: multi,
        defaultSessions,
        ...(body.imageUrl !== undefined && { imageUrl: body.imageUrl || null }),
    };
}
