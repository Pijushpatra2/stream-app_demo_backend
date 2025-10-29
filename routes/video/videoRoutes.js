// // routes\video\videoRoutes.js
// import express from 'express';
// import upload from '../../middlewares/upload.js';
// import {
//   getAllVideos,
//   getVideoById,
//   addVideo,
//   updateVideo,
//   deleteVideo,
// } from '../../controllers/video/videoController.js';

// const router = express.Router();

// // Upload both thumbnail and video file
// router.post(
//   '/add',
//   upload.fields([
//     { name: 'video_file', maxCount: 1 },
//     { name: 'thumbnail', maxCount: 1 },
//   ]),
//   addVideo
// );

// router.get('/get', getAllVideos);
// router.get('/:id', getVideoById);
// router.put('/:id', updateVideo);
// router.delete('/:id', deleteVideo);

// export default router;




//===========

// routes/video/videoRoutes.js
import express from 'express';
import upload from '../../middlewares/upload.js';
import {
  getAllVideos,
  getVideoById,
  addVideo,
  updateVideo,
  deleteVideo,
  getVideosByAdminId,
} from '../../controllers/video/videoController.js';
import { superAdminAuthMiddleware } from '../../middlewares/superAdminAuthMiddleware.js';

const router = express.Router();

router.post(
  '/add',
  superAdminAuthMiddleware, // only super admin can upload
  upload.fields([
    { name: 'video_file', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 },
  ]),
  addVideo
);

/**
 * Get all videos
 */
router.get('/get', getAllVideos);

/**
 * Get video by ID
 */
router.get('/:id', getVideoById);

/**
 * Update video details (metadata only, not file)
 */
router.put('/:id', superAdminAuthMiddleware, updateVideo);

//Get videos by admin ID
router.get('/get/by-admin/:super_admin_id', getVideosByAdminId);

/**
 * Delete video
 */
router.delete('/:id', superAdminAuthMiddleware, deleteVideo);

export default router;
