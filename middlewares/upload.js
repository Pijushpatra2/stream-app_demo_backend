import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

// Storage configuration for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const folder = file.mimetype.startsWith('video/')
      ? 'videos'     // folder for videos
      : 'thumbnails'; // folder for thumbnails

    return {
      folder,
      resource_type: file.mimetype.startsWith('video/') ? 'video' : 'image',
      public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
      format: file.originalname.split('.').pop(),
    };
  },
});

const upload = multer({ storage });

export default upload;
