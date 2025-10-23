import { verifyToken } from '../utils/jwtHelper.js';
import { logger } from '../utils/logger.js';
import { SuperAdmin } from '../models/index.js';

/**
 * Middleware to authenticate only super admins
 */
export const superAdminAuthMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ status: 'error', message: 'Authorization token missing' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = verifyToken(token);

        // Check if role is super_admin
        if (decoded.role !== 'super_admin') {
            return res.status(403).json({ status: 'error', message: 'Access restricted to super admins only' });
        }

        const superAdmin = await SuperAdmin.findByPk(decoded.id);

        if (!superAdmin) {
            return res.status(401).json({ status: 'error', message: 'Super admin not found' });
        }

        req.user = superAdmin; // attach super admin to request
        next();
    } catch (error) {
        logger.error(`superAdminAuthMiddleware: ${error.message}`);
        return res.status(401).json({ status: 'error', message: 'Invalid or expired token' });
    }
};
