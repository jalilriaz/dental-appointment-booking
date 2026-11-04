import { NextResponse } from "next/server";

// Payment status has been removed from the appointment schema.
// This route is kept as a stub to avoid 404 errors.

export async function PATCH() {
    return NextResponse.json(
        { error: "Payment status tracking has been removed from this version." },
        { status: 410 }
    );
}
