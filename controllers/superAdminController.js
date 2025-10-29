// controllers\superAdminController.js
import { SuperAdmin } from '../models/SuperAdmin.js';
import { hashPassword, comparePassword } from '../utils/passwordHelper.js';
import { generateToken } from '../utils/jwtHelper.js';
import { logger } from '../utils/logger.js';

/**
 * Create a new super admin
 */
export const createSuperAdmin = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Hash password
    const password_hash = await hashPassword(password);

    // Create super admin
    const superAdmin = await SuperAdmin.create({ name, email, password_hash });

    // Generate token (attach super_admin_id)
    const token = generateToken({
      id: superAdmin.super_admin_id,
      role: 'super_admin',
    });

    // Respond with both data and token
    res.status(201).json({
      status: 'success',
      message: 'Super admin account created successfully',
      data: {
        superAdmin: {
          super_admin_id: superAdmin.super_admin_id,
          name: superAdmin.name,
          email: superAdmin.email,
        },
        token,
      },
    });
  } catch (error) {
    logger.error(`createSuperAdmin: ${error.message}`);
    next(error);
  }
};
/**
 * Super admin login
 */
export const loginSuperAdmin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const superAdmin = await SuperAdmin.findOne({ where: { email } });
        if (!superAdmin) return res.status(404).json({ status: 'error', message: 'Super admin not found' });

        const isValid = await comparePassword(password, superAdmin.password_hash);
        if (!isValid) return res.status(401).json({ status: 'error', message: 'Invalid credentials' });

        const token = generateToken({ id: superAdmin.super_admin_id, role: 'super_admin' });
        res.json({ status: 'success', data: { superAdmin, token } });
    } catch (error) {
        logger.error(`loginSuperAdmin: ${error.message}`);
        next(error);
    }
};

/**
 * Get all super admins
 */
export const getAllSuperAdmins = async (req, res, next) => {
    try {
        const superAdmins = await SuperAdmin.findAll();
        res.json({ status: 'success', data: superAdmins });
    } catch (error) {
        logger.error(`getAllSuperAdmins: ${error.message}`);
        next(error);
    }
};

/**
 * Get current super admin profile (from token)
 */
export const getCurrentSuperAdmin = async (req, res, next) => {
    try {
        // The super admin ID is available from the auth middleware
        const superAdminId = req.superAdmin.id;
        
        const superAdmin = await SuperAdmin.findByPk(superAdminId, {
            attributes: { exclude: ['password_hash'] } // Don't return password
        });
        
        if (!superAdmin) {
            return res.status(404).json({ 
                status: 'error', 
                message: 'Super admin not found' 
            });
        }

        res.json({ 
            status: 'success', 
            data: superAdmin 
        });
    } catch (error) {
        logger.error(`getCurrentSuperAdmin: ${error.message}`);
        next(error);
    }
};

/*
 * Get single super admin by ID
 */
export const getSuperAdminById = async (req, res, next) => {
    try {
        const superAdmin = await SuperAdmin.findByPk(req.params.id);
        if (!superAdmin) return res.status(404).json({ status: 'error', message: 'Super admin not found' });

        res.json({ status: 'success', data: superAdmin });
    } catch (error) {
        logger.error(`getSuperAdminById: ${error.message}`);
        next(error);
    }
};

/**
 * Update super admin
 */
export const updateSuperAdmin = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const superAdmin = await SuperAdmin.findByPk(req.params.id);

        if (!superAdmin) return res.status(404).json({ status: 'error', message: 'Super admin not found' });

        if (password) {
            superAdmin.password_hash = await hashPassword(password);
        }
        if (name) superAdmin.name = name;
        if (email) superAdmin.email = email;

        await superAdmin.save();
        res.json({ status: 'success', data: superAdmin });
    } catch (error) {
        logger.error(`updateSuperAdmin: ${error.message}`);
        next(error);
    }
};

/**
 * Delete super admin
 */
export const deleteSuperAdmin = async (req, res, next) => {
    try {
        const superAdmin = await SuperAdmin.findByPk(req.params.id);
        if (!superAdmin) return res.status(404).json({ status: 'error', message: 'Super admin not found' });

        await superAdmin.destroy();
        res.json({ status: 'success', message: 'Super admin deleted successfully' });
    } catch (error) {
        logger.error(`deleteSuperAdmin: ${error.message}`);
        next(error);
    }
};
