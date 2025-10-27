// mdleware/rolemiddlewaer.js
import { Permissions } from '../models/index.js';
import { logger } from '../utils/logger.js';

/**
 * Middleware to check if user has permission for a module and action
 * @param {string} module - Module name (e.g., 'users', 'plans')
 * @param {string} action - Action name ('create', 'read', 'update', 'delete')
 */
export const roleMiddleware = (module, action) => {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({ status: 'error', message: 'User not authenticated' });
            }

            const roleId = req.user.role_id;
            if (!roleId) {
                return res.status(403).json({ status: 'error', message: 'User role not assigned' });
            }

            const permission = await Permissions.findOne({
                where: { role_id: roleId, module_name: module },
            });

            if (!permission) {
                return res.status(403).json({ status: 'error', message: 'Permission record not found' });
            }

            const canPerform = permission[`can_${action}`];
            if (!canPerform) {
                return res.status(403).json({ status: 'error', message: 'Permission denied' });
            }

            next();
        } catch (error) {
            logger.error(`RoleMiddleware Error: ${error.stack}`);
            res.status(500).json({ status: 'error', message: 'Internal server error' });
        }
    };
};
