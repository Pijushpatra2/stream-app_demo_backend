// // routes/superAdminRoutes.js
// import express from 'express';
// import { createSuperAdmin, loginSuperAdmin, getAllSuperAdmins, getSuperAdminById, updateSuperAdmin, deleteSuperAdmin } from '../controllers/superAdminController.js';
// import { validateRequest } from '../utils/validateRequest.js';
// import Joi from 'joi';
// import { superAdminAuthMiddleware } from '../middlewares/superAdminAuthMiddleware.js';

// const router = express.Router();

// // Validation schemas
// const createSchema = Joi.object({
//     name: Joi.string().min(2).max(100).required(),
//     email: Joi.string().email().required(),
//     password: Joi.string().min(6).required(),
// });

// const loginSchema = Joi.object({
//     email: Joi.string().email().required(),
//     password: Joi.string().required(),
// });

// // Public routes
// router.post('/register', validateRequest(createSchema), createSuperAdmin);
// router.post('/login', validateRequest(loginSchema), loginSuperAdmin);


// // Protected routes for super admins only
// router.get('/profile/:id', superAdminAuthMiddleware, getSuperAdminById);
// router.put('/:id', superAdminAuthMiddleware, updateSuperAdmin);
// router.delete('/:id', superAdminAuthMiddleware, deleteSuperAdmin);

// export default router;



// routes/superAdminRoutes.js
import express from 'express';
import { 
  createSuperAdmin, 
  loginSuperAdmin, 
  getAllSuperAdmins, 
  getSuperAdminById, 
  updateSuperAdmin, 
  deleteSuperAdmin,
  getCurrentSuperAdmin // Add this new controller
} from '../controllers/superAdminController.js';
import { validateRequest } from '../utils/validateRequest.js';
import Joi from 'joi';
import { superAdminAuthMiddleware } from '../middlewares/superAdminAuthMiddleware.js';

const router = express.Router();

// Validation schemas
const createSchema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

// Public routes
router.post('/register', validateRequest(createSchema), createSuperAdmin);
router.post('/login', validateRequest(loginSchema), loginSuperAdmin);

// Protected routes for super admins only
router.get('/profile', superAdminAuthMiddleware, getCurrentSuperAdmin); // Add this route
router.get('/profile/:id', superAdminAuthMiddleware, getSuperAdminById);
router.put('/:id', superAdminAuthMiddleware, updateSuperAdmin);
router.delete('/:id', superAdminAuthMiddleware, deleteSuperAdmin);

export default router;
