//  utils/passwordHelper.js
import bcrypt from 'bcrypt';
import { logger } from '../utils/logger.js';

const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 12;

/**
 * Hash a plain text password
 * @param {string} plainPassword
 * @returns {Promise<string>} hashed password
 */
export const hashPassword = async (plainPassword) => {
    try {
        if (!plainPassword || typeof plainPassword !== 'string') {
            throw new Error('Password must be a valid string');
        }
        return await bcrypt.hash(plainPassword, SALT_ROUNDS);
    } catch (error) {
        logger.error(`Password Hashing Error: ${error.message}`);
        throw new Error('Failed to hash password');
    }
};

/**
 * Compare plain password with hashed password
 * @param {string} plainPassword
 * @param {string} hashedPassword
 * @returns {Promise<boolean>} comparison result
 */
export const comparePassword = async (plainPassword, hashedPassword) => {
    try {
        if (!plainPassword || !hashedPassword) {
            throw new Error('Both plain and hashed passwords are required');
        }
        return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
        logger.error(`Password Comparison Error: ${error.message}`);
        throw new Error('Failed to compare passwords');
    }
};