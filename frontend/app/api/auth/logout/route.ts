import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const cookieStore = await cookies();
    cookieStore.delete("session");
    cookieStore.delete("refreshToken");

    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
}

export async function POST() {
    const cookieStore = await cookies();
    cookieStore.delete("session");
    cookieStore.delete("refreshToken");

    return NextResponse.json({ success: true });
}

