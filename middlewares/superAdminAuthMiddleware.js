// import { verifyToken } from '../utils/jwtHelper.js';
// import { logger } from '../utils/logger.js';
// import { SuperAdmin } from '../models/index.js';

// /**
//  * Middleware to authenticate only super admins
//  */
// export const superAdminAuthMiddleware = async (req, res, next) => {
//     try {
//         const authHeader = req.headers.authorization;

//         if (!authHeader || !authHeader.startsWith('Bearer ')) {
//             return res.status(401).json({ status: 'error', message: 'Authorization token missing' });
//         }

//         const token = authHeader.split(' ')[1];
//         const decoded = verifyToken(token);

//         // Check if role is super_admin
//         if (decoded.role !== 'super_admin') {
//             return res.status(403).json({ status: 'error', message: 'Access restricted to super admins only' });
//         }

//         const superAdmin = await SuperAdmin.findByPk(decoded.id);

//         if (!superAdmin) {
//             return res.status(401).json({ status: 'error', message: 'Super admin not found' });
//         }

//         req.user = superAdmin; // attach super admin to request
//         next();
//     } catch (error) {
//         logger.error(`superAdminAuthMiddleware: ${error.message}`);
//         return res.status(401).json({ status: 'error', message: 'Invalid or expired token' });
//     }
// };



//================

// import { verifyToken } from '../utils/jwtHelper.js';
// import { logger } from '../utils/logger.js';
// import { SuperAdmin } from '../models/index.js';

// /**
//  * Middleware to authenticate only super admins
//  */
// export const superAdminAuthMiddleware = async (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;

//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       return res.status(401).json({
//         status: 'error',
//         message: 'Authorization token missing',
//       });
//     }

//     const token = authHeader.split(' ')[1];
//     const decoded = verifyToken(token);

//     // Check if role is super_admin
//     if (decoded.role !== 'super_admin') {
//       return res.status(403).json({
//         status: 'error',
//         message: 'Access restricted to super admins only',
//       });
//     }

//     // Only fetch necessary fields (no 'status' column)
//     const superAdmin = await SuperAdmin.findByPk(decoded.id, {
//       attributes: ['super_admin_id', 'name', 'email'],
//     });

//     if (!superAdmin) {
//       return res.status(401).json({
//         status: 'error',
//         message: 'Super admin not found',
//       });
//     }

//     req.user = superAdmin; // Attach super admin to request
//     next();
//   } catch (error) {
//     logger.error(` superAdminAuthMiddleware: ${error.message}`);
//     return res.status(401).json({
//       status: 'error',
//       message: 'Invalid or expired token',
//     });
//   }
// };

import jwt from "jsonwebtoken";
import { SuperAdmin } from "../models/SuperAdmin.js";


export const superAdminAuthMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const superAdmin = await SuperAdmin.findByPk(decoded.id);

    if (!superAdmin) {
      return res.status(401).json({ message: "Invalid super admin" });
    }

    //attach as req.user (so your controller works)
    req.user = {
      id: superAdmin.super_admin_id,
      name: superAdmin.name,
      email: superAdmin.email,
    };

    next();
  } catch (err) {
    console.error("superAdminAuthMiddleware:", err);
    res.status(401).json({ message: "Unauthorized" });
  }
};
