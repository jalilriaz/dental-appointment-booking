/**
 * This script tests the API rate limiting implementation.
 * Run it using: npx ts-node scripts/test-rate-limit.ts
 */

async function testRateLimit() {
    const url = "http://localhost:3000/api/appointments"; // Adjust if port is different
    const totalRequests = 70; // Our limit is 60 per minute

    console.log(`Starting rate limit test... sending ${totalRequests} requests to ${url}\n`);

    let successCount = 0;
    let rateLimitedCount = 0;
    let errorCount = 0;

    for (let i = 1; i <= totalRequests; i++) {
        try {
            // We just send a GET request to the appointments API.
            // Even if unauthorized, the rate limiter should kick in first or alongside it.
            const response = await fetch(url);

            if (response.status === 429) {
                rateLimitedCount++;
                console.log(`[Request ${i}] 🔴 RATE LIMITED! Status: 429`);
            } else {
                successCount++;
                console.log(`[Request ${i}] 🟢 Passed rate limiter. Status: ${response.status}`);
            }
        } catch (error) {
            errorCount++;
            console.error(`[Request ${i}] ❌ Error:`, error);
        }

        // Small delay to simulate rapid sequential requests but not overwhelm the local server totally
        await new Promise(resolve => setTimeout(resolve, 50));
    }

    console.log("\n--- Rate Limit Test Summary ---");
    console.log(`Total Requests Sent: ${totalRequests}`);
    console.log(`Passed Rate Limiter: ${successCount} (Expected: ~60)`);
    console.log(`Blocked by Rate Limiter: ${rateLimitedCount} (Expected: ~10)`);
    console.log(`Network Errors: ${errorCount}`);

    if (rateLimitedCount > 0) {
        console.log("\n✅ SUCCESS: Rate limiter is working correctly!");
    } else {
        console.log("\n❌ FAILED: Rate limiter did not engage. Check middleware configuration.");
    }
}

testRateLimit();
