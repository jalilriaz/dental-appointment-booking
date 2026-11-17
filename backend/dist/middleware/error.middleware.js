"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const logger_1 = require("../lib/logger");
const zod_1 = require("zod");
function errorHandler(err, req, res, _next) {
    logger_1.logger.error({
        msg: 'Unhandled route error',
        error: err?.message || err,
        stack: err?.stack,
        url: req.originalUrl,
        method: req.method,
    });
    if (err instanceof zod_1.ZodError) {
        return res.status(400).json({
            error: 'Validation Error',
            details: err.issues,
        });
    }
    const status = typeof err?.status === 'number' ? err.status : 500;
    const message = err?.message || 'Internal Server Error';
    return res.status(status).json({
        error: message,
    });
}
//# sourceMappingURL=error.middleware.js.map