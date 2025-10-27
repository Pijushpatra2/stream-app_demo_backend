//  utils/jwtHelper.js
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { logger } from './logger.js';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

/**
 * Generate a JWT token
 * @param {Object} payload - Data to encode in the token
 * @returns {string} JWT token
 */
export const generateToken = (payload) => {
    try {
        if (!payload || typeof payload !== 'object') {
            throw new Error('Payload must be a valid object');
        }
        return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    } catch (error) {
        logger.error(`JWT Generation Error: ${error.message}`);
        throw new Error('Failed to generate token');
    }
};

/**
 * Verify a JWT token
 * @param {string} token - JWT token
 * @returns {Object} Decoded payload
 */
export const verifyToken = (token) => {
    try {
        if (!token || typeof token !== 'string') {
            throw new Error('Token must be a string');
        }
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        logger.error(`JWT Verification Error: ${error.message}`);
        throw new Error('Invalid or expired token');
    }
};
