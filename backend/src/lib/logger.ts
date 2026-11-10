import pino from "pino";

// Define the logger configuration
const isDev = process.env.NODE_ENV !== "production";

export const logger = pino({
    level: process.env.LOG_LEVEL || "info",
    // Base object to be included in all logs (useful for tracking app version or environment)
    base: {
        env: process.env.NODE_ENV,
    },
    // Redact sensitive keys from accidental logging
    redact: {
        paths: [
            "password",
            "req.headers.cookie",
            "res.headers['set-cookie']",
            "body.password",
            "body.token",
        ],
        censor: "[REDACTED]",
    },
    // Use pino-pretty in development for readable console output
    ...(isDev && {
        transport: {
            target: "pino-pretty",
            options: {
                colorize: true,
                translateTime: "SYS:standard",
                ignore: "pid,hostname,env", // Hide redundant info in dev console
            },
        },
    }),
});
