import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt } from "@/lib/auth";
import { checkRateLimit, rateLimitExceededResponse } from "@/lib/rateLimit";

// UI Routes
const protectedUIRoutes = ["/admin", "/staff", "/reception", "/change-password"];

// API Routes
// Exclude public auth routes, webhooks, or open endpoints from this list
const protectedApiRoutes = [
    "/api/admin",
    "/api/staff",
    "/api/patients",
    "/api/appointments", // Some might be public (e.g. availability), so handle carefully or protect all except specific ones
    "/api/medical-records",
    "/api/settings",
    "/api/notifications",
    "/api/upload",
    "/api/expenses",
    "/api/refunds",
    "/api/closing",
    "/api/reports",
    "/api/patient-files",
    "/api/consents",
    "/api/before-after",
    "/api/prescriptions",
    "/api/patient-records",
    "/api/staff-accounts",
    "/api/doctor-availability",
    "/api/recalls",
    "/api/lab-orders",
    "/api/waitlist",
    "/api/feedback-admin",
    "/api/backup",
];

// Routes that are strictly public (whitelisted)
const publicApiRoutes = [
    "/api/auth",
    "/api/appointments/availability", // Public for booking form
    "/api/treatments", // Public for website
    "/api/contact",
    "/api/bot",
    "/api/cron",
    "/api/feedback"
];

function isPublicApiRoute(pathname: string, method?: string) {
    if (pathname === "/api/appointments" && method === "POST") return true;
    if (/^\/api\/before-after\/[^/]+\/image$/.test(pathname) && method === "GET") return true;
    return publicApiRoutes.some((route) => pathname.startsWith(route));
}

// Global Security Headers Helper
function applySecurityHeaders(response: NextResponse) {
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), browsing-topics=()");
    // TODO: Implement strict Next.js CSP nonces to replace 'unsafe-inline'
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
    const allowedConnectOrigins = [
        "'self'",
        backendUrl,
        "http://localhost:4000",
        "http://127.0.0.1:4000",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
        "ws:",
        "wss:",
    ].filter(Boolean).join(" ");

    // TODO: Implement strict Next.js CSP nonces to replace 'unsafe-inline'
    response.headers.set(
        "Content-Security-Policy",
        `default-src 'self'; connect-src ${allowedConnectOrigins}; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: blob:; font-src 'self' data: https:; frame-src 'self' https://www.google.com https://maps.google.com https://www.openstreetmap.org; frame-ancestors 'none';`
    );
    return response;
}

export default async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Static asset bypass (images, icons, fonts, etc.)
    if (
        pathname.match(/\.(webp|png|jpg|jpeg|svg|ico|gif|woff|woff2|ttf|eot)$/) ||
        pathname.startsWith("/images/")
    ) {
        return NextResponse.next();
    }

    // Canonical Route Redirect: /reception/* -> /staff/*
    if (pathname === "/reception" || pathname.startsWith("/reception/")) {
        const staffPath = pathname.replace(/^\/reception/, "/staff");
        return applySecurityHeaders(NextResponse.redirect(new URL(staffPath, request.url)));
    }
    const isApiRoute = pathname.startsWith("/api");

    // 🛡️ 1. Global Rate Limiting for API routes
    if (isApiRoute) {
        // Use x-forwarded-for header to get the IP address
        const rawIp = request.headers.get("x-forwarded-for");
        const ip = rawIp ? rawIp.split(',')[0].trim() : "127.0.0.1";
        // Dynamic rate limits
        let limit = 60;
        let windowMs = 60000;
        if (pathname.startsWith("/api/auth")) {
            limit = process.env.NODE_ENV === "production" ? 10 : 60;
            windowMs = 60000; // 1 minute window
        }

        const { success, headers } = checkRateLimit(ip, pathname, { limit, windowMs });

        if (!success) {
            const response = rateLimitExceededResponse();
            Object.entries(headers).forEach(([key, value]) => {
                response.headers.set(key, value);
            });
            return applySecurityHeaders(response);
        }

        // Forward all API requests to the standalone Express backend (via Next.js rewrites)
        // Express backend handles route-level authentication, roles, and validation.
        const response = NextResponse.next();
        response.headers.set("X-RateLimit-Limit", headers["X-RateLimit-Limit"]);
        response.headers.set("X-RateLimit-Remaining", headers["X-RateLimit-Remaining"]);
        response.headers.set("X-RateLimit-Reset", headers["X-RateLimit-Reset"]);
        return applySecurityHeaders(response);
    }

    const isProtectedUI = protectedUIRoutes.some((route) => pathname.startsWith(route));
    const isProtectedApi = isApiRoute && !isPublicApiRoute(pathname, request.method);
    const isAuthPage = pathname === "/login";
    
    const cookie = request.cookies.get("session")?.value;

    // Prevent logged-in users from accessing the login page
    if (isAuthPage && cookie) {
        try {
            const session = await decrypt(cookie);
            if (session.role === "ADMIN") {
                return applySecurityHeaders(NextResponse.redirect(new URL("/admin", request.url)));
            } else if (session.role === "STAFF") {
                return applySecurityHeaders(NextResponse.redirect(new URL("/reception", request.url)));
            } else {
                return applySecurityHeaders(NextResponse.redirect(new URL("/", request.url)));
            }
        } catch {
            // Bad cookie - ignore and let them access the login page
        }
    }

    // If it's neither a protected UI route nor a protected API route, let it pass
    if (!isProtectedUI && !isProtectedApi) {
        const response = NextResponse.next();
        if (isApiRoute) {
            response.headers.set("X-RateLimit-Limit", request.headers.get("x-ratelimit-limit") || "");
            response.headers.set("X-RateLimit-Remaining", request.headers.get("x-ratelimit-remaining") || "");
            response.headers.set("X-RateLimit-Reset", request.headers.get("x-ratelimit-reset") || "");
        }
        return applySecurityHeaders(response);
    }

    if (!cookie) {
        if (isApiRoute) {
            const response = NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            response.headers.set("X-RateLimit-Limit", request.headers.get("x-ratelimit-limit") || "");
            response.headers.set("X-RateLimit-Remaining", request.headers.get("x-ratelimit-remaining") || "");
            response.headers.set("X-RateLimit-Reset", request.headers.get("x-ratelimit-reset") || "");
            return applySecurityHeaders(response);
        }
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return applySecurityHeaders(NextResponse.redirect(loginUrl));
    }

    try {
        const session = await decrypt(cookie);
        const role = session.role as string;

        // Admin functionality
        const isClosingAdminRoute =
            pathname.startsWith("/api/closing") && !pathname.startsWith("/api/closing/submit");
        const isPrescriptionAdminRoute =
            pathname.startsWith("/api/prescriptions") && request.method === "POST";
        const isBeforeAfterAdminRoute =
            pathname.startsWith("/api/before-after") && !pathname.endsWith("/image");
        const isLabAdminOnly =
            pathname.startsWith("/api/lab-orders") && (request.method === "POST" || request.method === "DELETE");
        const isFeedbackAdminOnly =
            pathname.startsWith("/api/feedback-admin") && request.method === "PATCH";
        const isSettingsAdminOnly =
            pathname.startsWith("/api/settings") && !(pathname === "/api/settings/public" && request.method === "GET") && request.method !== "GET";
        const isAdminStrictRoute =
            pathname.startsWith("/admin") ||
            (pathname.startsWith("/api/admin") && !pathname.startsWith("/api/admin/walk-in")) ||
            isSettingsAdminOnly ||
            pathname.startsWith("/api/expenses") ||
            pathname.startsWith("/api/refunds") ||
            pathname.startsWith("/api/reports") ||
            pathname.startsWith("/api/patient-files") ||
            pathname.startsWith("/api/staff-accounts") ||
            pathname.startsWith("/api/doctor-availability") ||
            pathname.startsWith("/api/notifications/logs") ||
            pathname.startsWith("/api/recalls") ||
            pathname.startsWith("/api/backup") ||
            isLabAdminOnly ||
            isFeedbackAdminOnly ||
            isBeforeAfterAdminRoute ||
            isPrescriptionAdminRoute ||
            isClosingAdminRoute;

        if (isAdminStrictRoute && role !== "ADMIN") {
            if (isApiRoute) return applySecurityHeaders(NextResponse.json({ error: "Forbidden" }, { status: 403 }));
            return applySecurityHeaders(NextResponse.redirect(new URL("/login", request.url)));
        }

        // Staff functionality (Staff or Admin)
        const isAppointmentsStaffRoute = pathname.startsWith("/api/appointments") && request.method !== "POST";
        const isStaffRoute = pathname.startsWith("/staff") || pathname.startsWith("/reception") || pathname.startsWith("/api/staff") || pathname.startsWith("/api/patients") || isAppointmentsStaffRoute || pathname.startsWith("/api/medical-records") || pathname.startsWith("/api/admin/walk-in") || pathname.startsWith("/api/upload") || pathname.startsWith("/api/closing/submit") || pathname.startsWith("/api/consents") || pathname.startsWith("/api/prescriptions") || pathname.startsWith("/api/patient-records");

        if (isStaffRoute && role !== "STAFF" && role !== "ADMIN") {
            if (isApiRoute) return applySecurityHeaders(NextResponse.json({ error: "Forbidden" }, { status: 403 }));
            return applySecurityHeaders(NextResponse.redirect(new URL("/login", request.url)));
        }

        const response = NextResponse.next();
        if (isApiRoute) {
            response.headers.set("X-RateLimit-Limit", request.headers.get("x-ratelimit-limit") || "");
            response.headers.set("X-RateLimit-Remaining", request.headers.get("x-ratelimit-remaining") || "");
            response.headers.set("X-RateLimit-Reset", request.headers.get("x-ratelimit-reset") || "");
        }
        // Prevent browser from caching protected pages (fixes back-button after logout)
        if (isProtectedUI) {
            response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
            response.headers.set("Pragma", "no-cache");
            response.headers.set("Expires", "0");
        }

        applySecurityHeaders(response);

        // CORS Headers
        if (isApiRoute) {
            const origin = request.headers.get("origin");
            
            // For true enterprise security, strictly whitelist domains instead of wildcard reflection
            const ALLOWED_ORIGINS = process.env.NODE_ENV === "production" 
                ? [process.env.NEXT_PUBLIC_APP_URL || "https://elitedental.com"] 
                : ["http://localhost:3000"];

            // If the origin is exact match OR it's a Vercel preview branch (*.vercel.app)
            const isAllowedOrigin = origin && (
                ALLOWED_ORIGINS.includes(origin) || 
                (process.env.NODE_ENV !== "production" && origin.endsWith(".vercel.app"))
            );

            if (isAllowedOrigin) {
                response.headers.set("Access-Control-Allow-Origin", origin);
                response.headers.set("Access-Control-Allow-Credentials", "true");
                response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
                response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
            }
        }

        return response;
    } catch {
        // Invalid session
        if (isApiRoute) {
            const response = NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            response.headers.set("X-RateLimit-Limit", request.headers.get("x-ratelimit-limit") || "");
            response.headers.set("X-RateLimit-Remaining", request.headers.get("x-ratelimit-remaining") || "");
            response.headers.set("X-RateLimit-Reset", request.headers.get("x-ratelimit-reset") || "");
            return applySecurityHeaders(response);
        }
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        const response = NextResponse.redirect(loginUrl);
        response.cookies.delete("session");
        return applySecurityHeaders(response);
    }
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
