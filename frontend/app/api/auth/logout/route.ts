import { NextResponse, NextRequest } from "next/server";

function clearCookiesAndRedirect(request: NextRequest, isRedirect: boolean) {
  const response = isRedirect
    ? NextResponse.redirect(new URL("/", request.url))
    : NextResponse.json({ success: true, redirect: "/" });

  const isProduction = process.env.NODE_ENV === "production";
  const cookieOptions = {
    path: "/",
    expires: new Date(0),
    maxAge: 0,
    httpOnly: true,
    secure: isProduction,
    sameSite: (isProduction ? "none" : "lax") as "none" | "lax",
  };

  response.cookies.set("session", "", cookieOptions);
  response.cookies.set("refreshToken", "", cookieOptions);
  response.cookies.set("token", "", cookieOptions);

  response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");

  return response;
}

export async function GET(request: NextRequest) {
  return clearCookiesAndRedirect(request, true);
}

export async function POST(request: NextRequest) {
  return clearCookiesAndRedirect(request, false);
}

