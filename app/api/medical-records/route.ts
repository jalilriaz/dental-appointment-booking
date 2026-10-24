import { NextResponse } from "next/server";

// Medical records have been removed from the schema.
// This route is kept as a stub to avoid 404 errors.

export async function POST() {
    return NextResponse.json(
        { error: "Medical records feature has been removed from this version." },
        { status: 410 }
    );
}
