import express from 'express';
import upload from '../../middlewares/upload.js';
import {
  getAllVideos,
  getVideoById,
  addVideo,
  updateVideo,
  deleteVideo,
} from '../../controllers/video/videoController.js';

const router = express.Router();

// Upload both thumbnail and video file
router.post(
  '/add',
  upload.fields([
    { name: 'video_file', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 },
  ]),
  addVideo
);

router.get('/get', getAllVideos);
router.get('/:id', getVideoById);
router.put('/:id', updateVideo);
router.delete('/:id', deleteVideo);

export default router;
