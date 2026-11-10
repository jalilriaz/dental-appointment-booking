import { NextResponse } from "next/server";

// In-memory store for rate limiting (Note: This respects server instances/serverless cold starts)
// For a production, multi-instance deployment, Redis is highly recommended.
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

interface RateLimitOptions {
    limit: number; // Max requests
    windowMs: number; // Time window in milliseconds
}

/**
 * Validates a request against the rate limiter.
 * @param ip Client IP address or identifier
 * @param endpoint The API endpoint being accessed
 * @param options Rate limit configuration
 * @returns { success: boolean, headers: HeadersInit }
 */
export function checkRateLimit(ip: string, endpoint: string, options: RateLimitOptions) {
    const now = Date.now();
    const key = `${ip}:${endpoint}`;

    // Passive size check to prevent OOM in serverless environments
    if (rateLimitStore.size > 10000) {
        rateLimitStore.clear();
    }

    const record = rateLimitStore.get(key);

    if (!record) {
        rateLimitStore.set(key, {
            count: 1,
            resetTime: now + options.windowMs,
        });
    } else {
        // If window expired, reset
        if (now > record.resetTime) {
            rateLimitStore.set(key, {
                count: 1,
                resetTime: now + options.windowMs,
            });
        } else {
            record.count++;
        }
    }

    const currentCount = rateLimitStore.get(key)!.count;
    const isAllowed = currentCount <= options.limit;

    const remaining = Math.max(0, options.limit - currentCount);
    const resetEpoch = Math.floor(rateLimitStore.get(key)!.resetTime / 1000);

    const headers = {
        "X-RateLimit-Limit": options.limit.toString(),
        "X-RateLimit-Remaining": remaining.toString(),
        "X-RateLimit-Reset": resetEpoch.toString(),
    };

    return { success: isAllowed, headers };
}

/**
 * Returns a Next.js response indicating Too Many Requests.
 */
export function rateLimitExceededResponse() {
    return NextResponse.json(
        { error: "Too many requests, please try again later." },
        { status: 429 }
    );
}
