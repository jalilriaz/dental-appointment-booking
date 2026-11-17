"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkRateLimit = checkRateLimit;
// Rate limiting utilities for Express backend
const rateLimitStore = new Map();
/**
 * Validates a request against the rate limiter.
 * @param ip Client IP address or identifier
 * @param endpoint The API endpoint being accessed
 * @param options Rate limit configuration
 * @returns { success: boolean, headers: Record<string, string> }
 */
function checkRateLimit(ip, endpoint, options) {
    const now = Date.now();
    const key = `${ip}:${endpoint}`;
    if (rateLimitStore.size > 10000) {
        rateLimitStore.clear();
    }
    const record = rateLimitStore.get(key);
    if (!record) {
        rateLimitStore.set(key, {
            count: 1,
            resetTime: now + options.windowMs,
        });
    }
    else {
        if (now > record.resetTime) {
            rateLimitStore.set(key, {
                count: 1,
                resetTime: now + options.windowMs,
            });
        }
        else {
            record.count++;
        }
    }
    const currentCount = rateLimitStore.get(key).count;
    const isAllowed = currentCount <= options.limit;
    const remaining = Math.max(0, options.limit - currentCount);
    const resetEpoch = Math.floor(rateLimitStore.get(key).resetTime / 1000);
    const headers = {
        "X-RateLimit-Limit": options.limit.toString(),
        "X-RateLimit-Remaining": remaining.toString(),
        "X-RateLimit-Reset": resetEpoch.toString(),
    };
    return { success: isAllowed, headers };
}
//# sourceMappingURL=rateLimit.js.map