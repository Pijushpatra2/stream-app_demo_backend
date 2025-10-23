//  utils/validateRequest.js
import Joi from 'joi';
import { logger } from './logger.js';

/**
 * Middleware to validate request bodies using Joi schema
 * @param {Joi.ObjectSchema} schema - Joi validation schema
 */
export const validateRequest = (schema) => {
    return (req, res, next) => {
        try {
            const { error, value } = schema.validate(req.body, {
                abortEarly: false,
                stripUnknown: true,
            });

            if (error) {
                const errors = error.details.map((d) => d.message);
                logger.warn(`Validation failed: ${errors.join(', ')}`);
                return res.status(400).json({
                    status: 'error',
                    message: 'Validation failed',
                    errors,
                });
            }

            req.body = value; // sanitized data
            next();
        } catch (err) {
            logger.error(`Validation Middleware Error: ${err.message}`);
            res.status(500).json({
                status: 'error',
                message: 'Server error during validation',
            });
        }
    };
};
