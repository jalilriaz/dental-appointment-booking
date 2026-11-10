import { Request, Response, NextFunction } from 'express';
import { logger } from '../lib/logger';
import { ZodError } from 'zod';

export function errorHandler(
    err: any,
    req: Request,
    res: Response,
    _next: NextFunction
) {
    logger.error({
        msg: 'Unhandled route error',
        error: err?.message || err,
        stack: err?.stack,
        url: req.originalUrl,
        method: req.method,
    });

    if (err instanceof ZodError) {
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

