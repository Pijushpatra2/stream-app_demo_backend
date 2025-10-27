//middleware/authMiddleware.js
import { verifyToken } from '../utils/jwtHelper.js';
import { logger } from '../utils/logger.js';
import { Users, Admins, SuperAdmins } from '../models/index.js';

/**
 * Middleware to authenticate JWT token for users, admins, or super admins
 * @param {string} role - 'user' | 'admin' | 'super_admin'
 */
export const authMiddleware = (role = 'user') => {
    return async (req, res, next) => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({ status: 'error', message: 'Authorization token missing' });
            }

            const token = authHeader.split(' ')[1];
            const decoded = verifyToken(token);

            let user;
            switch (role) {
                case 'super_admin':
                    user = await SuperAdmins.findByPk(decoded.id);
                    break;
                case 'admin':
                    user = await Admins.findByPk(decoded.id);
                    break;
                default:
                    user = await Users.findByPk(decoded.id);
            }

            if (!user) {
                return res.status(401).json({ status: 'error', message: 'User not found' });
            }

            req.user = user; // attach user to request
            next();
        } catch (error) {
            logger.error(`AuthMiddleware Error: ${error.stack}`);
            res.status(401).json({ status: 'error', message: 'Invalid or expired token' });
        }
    };
};
