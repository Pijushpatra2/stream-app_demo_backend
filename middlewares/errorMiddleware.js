// middleware/errorMiddleware.js
import { logger } from '../utils/logger.js';

/**
 * Centralized Express error handling middleware
 */
export const errorMiddleware = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;

    logger.error(
        `Error: ${err.message} | Status: ${statusCode} | ${req.method} ${req.originalUrl} | IP: ${req.ip}\nStack: ${err.stack}`
    );

    res.status(statusCode).json({
        status: 'error',
        message: err.message || 'Internal server error',
    });
};
